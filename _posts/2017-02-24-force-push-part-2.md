---
layout: post
title: How to destroy others work using force push - II
modified: 25-Feb-2017 (09:41)
category: git
comments: true
tags: [git]
date: 2017-02-24
part1: "https://allaudin.github.io/force-push-part-1/"
part2: "https://allaudin.github.io/force-push-part-2/"
---

last modified: {{ page.modified | downcase }} 
{: .last_modified }

This is part *II* of two part series about force pushing in git.

- [Part I]({{page.part1}}){:.blue}
- [Part II]({{page.part2}}){:.blue}

In [previous]({{page.part1}}){:.blue} article, we have discussed theory about `force push`. In this article, I will try to demonstrate all the
scenarios by creating local repositories.

## Step 1

Create a local `bare` repo - it will serve as our remote repository

{% highlight bash %}

$ git init --bare myremote
Initialized empty Git repository in F:/Sandbox/gdemo/myremote/


$ cd myremote/

Qazi@Geek MINGW64 /f/Sandbox/gdemo/myremote (BARE:master)
$ ls
config  description  HEAD  hooks/  info/  objects/  refs/

{% endhighlight %}

## Step 2

Create another repository with name local1. This will be our local repository.

{% highlight bash %}

$ git init local1
Initialized empty Git repository in F:/Sandbox/gdemo/local1/.git/

{% endhighlight %}

Now we have total **2** repositories.

- myremote
- local1

## Step 3

Set `myremote` as origin of  `local1`.

{% highlight bash %}

$ cd local1

Qazi@Geek MINGW64 /f/Sandbox/gdemo/local1 (master)
$ git remote add origin /f/Sandbox/gdemo/myremote/


{% endhighlight %}

## Step 4

Add a file with some content in `local1 repo`, commit and push it to remote.

{% highlight bash %}
$ cd ../local1

Qazi@Geek MINGW64 /f/Sandbox/gdemo/local1 (master)
$ touch name.txt # create name.txt file

$ echo "first line" >> name.txt # write text to name.txt

$ git add name.txt

$ git commit -m "first commit" # commit
[master (root-commit) 6a70de9] first commit
 1 file changed, 1 insertion(+)
 create mode 100644 name.txt

Qazi@Geek MINGW64 /f/Sandbox/gdemo/local1 (master)
$ git push --set-upstream origin master
Counting objects: 3, done.
Writing objects: 100% (3/3), 221 bytes | 0 bytes/s, done.
Total 3 (delta 0), reused 0 (delta 0)
To F:/Sandbox/gdemo/myremote/
 * [new branch]      master -> master
Branch master set up to track remote branch master from origin.

$ cat name.txt # show file content
first line

Qazi@Geek MINGW64 /f/Sandbox/gdemo/local1 (master)
$ echo "second line" >> name.txt # add new line

$ git add . && git commit -m "add second line" # commit
[master c85f062] add second line
 1 file changed, 1 insertion(+)

$ git push # push it to remote
Counting objects: 3, done.
Writing objects: 100% (3/3), 261 bytes | 0 bytes/s, done.
Total 3 (delta 0), reused 0 (delta 0)
To F:/Sandbox/gdemo/myremote/
   6a70de9..c85f062  master -> master


$ git log # show logs
commit c85f062accadc879de10cf2a79331313b96a0e02
Author: mallaudin <mallaudinqazi@gmail.com>
Date:   Fri Feb 24 21:47:10 2017 +0500

    add second line

commit 6a70de9f4c83a16ff3ce29a6869205b68c878f3c
Author: mallaudin <mallaudinqazi@gmail.com>
Date:   Fri Feb 24 21:38:59 2017 +0500

    first commit

{% endhighlight %}

Now we have two commits from `local1` in `myremote` repo.

## Step 5

Clone `myremote` and create another repo with name `local2`

{% highlight bash %}
$ git clone /f/Sandbox/gdemo/myremote/ local2
Cloning into 'local2'...
done.
{% endhighlight %}

At this point, we have both `local1` & `local2` pointing to same code and are synced with remote. 

## Step 6 

Reset the last commit in `local1`.

{% highlight bash %}

$ git log --oneline
c85f062 add second line
6a70de9 first commit

$ git reset --hard HEAD~1 # reset to previous commit
HEAD is now at 6a70de9 first commit

$ git log --oneline
6a70de9 first commit

$ cat name.txt # print content of file
first line

{% endhighlight %}

## Step 7

Go to `local2`, modify the file and push it to remote.

{% highlight bash %}

$ cd ../local2

$ cat name.txt # print content
first line
second line

$ echo "third line" >> name.txt # add third line


$ git add .

$ git commit -m "add third line" # commit
[master e95518e] add third line
 1 file changed, 1 insertion(+)


$ git push
Counting objects: 6, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (2/2), done.
Writing objects: 100% (6/6), 496 bytes | 0 bytes/s, done.
Total 6 (delta 0), reused 0 (delta 0)
To F:/Sandbox/gdemo/myremote/
   6a70de9..e95518e  master -> master

$ git log --oneline # logs in local2
e95518e add third line
c85f062 add second line
6a70de9 first commit

{% endhighlight %}

At this point, remote must have our last commit (third line) and previous commits.

## Step 8

 Go to `local1` and force push you commit. Remote history will be overriden and out last commit from `local2` will disappear.

 {% highlight bash %}
 $ cd ../local1

$ git status
On branch master
Your branch is behind 'origin/master' by 1 commit, and can be fast-forwarded.
  (use "git pull" to update your local branch)
nothing to commit, working tree clean


$ git push -f # force push, override the remote history
Counting objects: 3, done.
Writing objects: 100% (3/3), 221 bytes | 0 bytes/s, done.
Total 3 (delta 0), reused 0 (delta 0)
To F:/Sandbox/gdemo/myremote/
 + e95518e...6a70de9 master -> master (forced update)

 {% endhighlight %}


## Step 9

Confirm it by cloning another repo `local3`. `local3` will be same as `local1`, **see! commit from `local2` has disappeared**

{% highlight bash %}

$ git clone /f/Sandbox/gdemo/myremote/ local3
Cloning into 'local3'...
done.

$ cd local3

Qazi@Geek MINGW64 /f/Sandbox/gdemo/local3 (master)
$ cat name.txt
first line

$ git log --oneline
6a70de9 first commit

{% endhighlight %}

In similar manner, you can create other scenarios.

> Git isn't hard or complex, you jsut have to spend more time to get familiar with it.