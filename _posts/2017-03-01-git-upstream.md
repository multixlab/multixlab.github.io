---
layout: post
title: Git upstream
modified: 01-Mar-2017 (13:12)
category: git
tags: [git]
comments: true
date: 2017-03-01
---

last modified: {{ page.modified | downcase }} 
{: .last_modified }

Whenever I push my *newly created* local repository to a remote repo, I am prompted with this message.

{% highlight bash %}
fatal: The current branch master has no upstream branch.
To push the current branch and set the remote as upstream, use

    git push --set-upstream origin master

{% endhighlight %}

Enough is enough, I have searched about it and I am going to write about it.

## What is Upstream?

Upstream is the name of remote branch to which our local branch is synced. Every local branch has exactly one upstream set. Say we have a
local branch `A` and its upstream is set to `origin/B`, then every `push` will push the changes to `origin/B` etc. `git branch -vv` can be
used to print the remote tracking branch.

{% highlight bash %}
$ git branch -vv
* master 8061b7f [origin/master] update
{% endhighlight %}

Here `master` branch is tracking `origin/master`.

## Why Upstream?

Setting upstream has effect on many commands e.g. `push`, `pull`, `merge`. When these commands are used without any conditional arguments,
remote branch information is retrieved from its upstream. Say, I have created a new repository and added its `origin`

{% highlight bash %}
$ git init test # create a new empty repo
Initialized empty Git repository in F:/Sandbox/gitdemo/test/.git/

$ cd test # move to newly created repo

$ git remote add origin /f/Sandbox/gitdemo/myremote/ # add remote

$ git remote show origin # print remote
* remote origin
  Fetch URL: F:/Sandbox/gitdemo/myremote/
  Push  URL: F:/Sandbox/gitdemo/myremote/
  HEAD branch: master
  Remote branches:
    master    new (next fetch will store in remotes/origin)
    newbranch new (next fetch will store in remotes/origin)

{% endhighlight %}

Everything is fine till now. Let's use `pull` to fetch data from remote

{% highlight bash %}
$ git pull # sync data with remote
remote: Counting objects: 6, done.
remote: Compressing objects: 100% (3/3), done.
remote: Total 6 (delta 0), reused 0 (delta 0)
Unpacking objects: 100% (6/6), done.
From F:/Sandbox/gitdemo/myremote
 * [new branch]      master     -> origin/master
 * [new branch]      newbranch  -> origin/newbranch
There is no tracking information for the current branch.
Please specify which branch you want to merge with.
See git-pull(1) for details.

    git pull <remote> <branch>

If you wish to set tracking information for this branch you can do so with:

    git branch --set-upstream-to=origin/<branch> master

{% endhighlight %}

See, `git pull` need to know which remote branch it needs to pull data from. As we haven't set any upstream yet, `git` provides us two options.

- Either use `git pull <remote> <branch>`, pass everything explicitly to `pull` command.

OR

- Set it's upstream to 
{% highlight bash %}
git branch --set-upstream-to=origin/<branch> master
{% endhighlight %}

next time you don't need to pass everything. Just use `git fetch/status/merge/pull` whatever
you want.

Let's chose the first option and see the result.

{% highlight bash %}
$ git pull origin master # pull from origin/master
From F:/Sandbox/gitdemo/myremote
 * branch            master     -> FETCH_HEAD

{% endhighlight %}

It syncs out current branch with `orgin/master` but still we haven't set its upstream we need to write the whole command again if we want to
push or fetch. e.g.

{% highlight bash %}

$ touch c.txt # create new file c.txt

$ git add . && git commit -m "test" # add to index and commit
[master f1be4b8] test
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 c.txt

$ git push # we haven't set upstream, we need write the complete command (git push <remote> <branch>)
fatal: The current branch master has no upstream branch.
To push the current branch and set the remote as upstream, use

    git push --set-upstream origin master


$ git push origin master # it works with complete command.
Counting objects: 2, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (2/2), done.
Writing objects: 100% (2/2), 258 bytes | 0 bytes/s, done.
Total 2 (delta 0), reused 0 (delta 0)
To F:/Sandbox/gitdemo/myremote/
   8061b7f..f1be4b8  master -> master

$ git branch -vv # SEE! we don't have any remote tracking branch for our current branch yet. I will use same
# command after setting upstream in next command snippet.
* master 8061b7f update

{% endhighlight %}

Now let's try all this with setting `upstream` first. 

{% highlight bash %}

$ git branch --set-upstream-to=origin/master master # set upstream to origin/master
Branch master set up to track remote branch master from origin.

$ git branch -vv # confirm master branch is tracking origin/master
* master f1be4b8 [origin/master] test

$ touch another.txt # update working directory

$ git add . && git commit -m "another file" # add to index and commit
[master 0d6cc8a] another file
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 another.txt

$ git push # use just push with any other argument.
Counting objects: 2, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (2/2), done.
Writing objects: 100% (2/2), 238 bytes | 0 bytes/s, done.
Total 2 (delta 1), reused 0 (delta 0)
To F:/Sandbox/gitdemo/myremote/
   f1be4b8..0d6cc8a  master -> master

{% endhighlight %}

## Upstream for newly created branch

When a new branch is created using (`git branch branch-name`), it is created locally without having any link to remote. Pushing it to
remote will do this

- Create a new branch in remote repo
- Add its reference to remote tracking branches locally.

Despite of all this, `git` does not set any `upstream` for this local branch. In this case, you can use

{% highlight bash %}
git branch --set-upstream-to=origin/new-branch new-branch
{% endhighlight %}

I have done the same in above example.

## Upstream for cloned repository

Let's end it with this observation, *"whenever I clone a repository, I don't need to set its upstream. Everything just works fine."*. This is
because when I clone a remote repository, git checkouts into `master` branch and sets master branch to track `origin/master`.

## Push with -u

Another thing that is mentioned when a new repo is created on `Github` or any other site

{% highlight bash %}
# this snippet is copied from github after creating a new repo (demo)

…or create a new repository on the command line

echo "# demo" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/allaudin/demo.git
git push -u origin master # see -u here
…or push an existing repository from the command line

git remote add origin https://github.com/allaudin/demo.git
git push -u origin master # see -u here

{% endhighlight %}

In either case, they tell you to use `push` with `-u` switch.

{% highlight bash %}
git push -u origin master # see -u here
{% endhighlight %}

Push `-u` does one special thing, apart from pushing data to remote, **it also sets the upstream for current branch**.


Hopefully, next time you will know *what's going on* while setting upstream and it will not bother you or me anymore.
