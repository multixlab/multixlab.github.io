---
layout: post
title: Refusing to merge unrelated histories
modified: 03-Mar-2017 (22:33)
category: git
tags: [git]
comments: true
date: 2017-03-03
---

last modified: {{ page.modified | downcase }} 
{: .last_modified }

## Background

A long time ago, my senior came to me and said I have this strange error while pulling my code from server

{% highlight text %}
fatal: refusing to merge unrelated histories
{% endhighlight %}

I was not sure at that time what happened to his repository. We have searched a bit and solved it using `--allow-unrelated-histories` switch
with pull command. I was unaware of the consequences and origin of this error. I added this error to my  `to do` list for searching it later.
From now onwards you will read what I have learnt.

## Why unrelated histories?

As clear from the error message, it happens when some one try to merge two **unrelated** projects (*projects which do not know about each other and commit
history in one project does not match with other project.*). Until now
I am aware of two scenarios when this error can occur.

- You have cloned a project and some how you have **lost** your `.git` directory or somehow `.git` got corrupted. You local history is gone and `git` is not happy with it.

OR

- You have create a brand **new** repository, added few commits and now you are trying to `pull` from some remote repository which already
has some commits.

Unrelated histories can be fixed in **two** ways.

## allow-unrelated-histories switch

You can simple use `allow-unrelated-histories` with pull. This will merge remote history first followed by your commit.

{% highlight bash %}
git pull origin master --allow-unrelated-histories
{% endhighlight %}


## Clone and reset to commit

This is a little tricky, you have to recall the last commit you have pulled from before you have started updating local repository. I have sketched it
on white board ( apologies for bad image quality ).

<p><img src="/assets/img/unrelated-histories.jpeg"></p>

Here are the steps you need to follow.

- Copy the changes you have made to some other directory.

- Clone the repository again.

- Reset to the commit from where you have started changes.

{% highlight bash %}
git reset --hard #commit-hash
{% endhighlight %}

- Paste you changes to this newly clones repository.

- Commit new changes.

- Sync with remote.

> With this, you lose all the commits you have been making while updating local repository before the `.git` corrupted or destroyed and all your updates are committed in a single commit
> in newly cloned repo.