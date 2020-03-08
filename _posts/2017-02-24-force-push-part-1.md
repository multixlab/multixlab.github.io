---
layout: post
title: How to destroy others work using force push - I
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

This is part *I* of two part series about force pushing in git.

- [Part I]({{page.part1}}){:.blue}
- [Part II]({{page.part2}}){:.blue}

Let me start it with a disclaimer

 THIS ARTICLE IS NOT FOR BEGINNERS!
{: .notice}

While using git, I often here about the situation where a user commits code and later thinks **"Oh! I have pushed the buggy code! I need to undo it
 but it's on remote"**.

 If you are a clever guy *(like Linus? kidding!)*, you will never **hard reset** your commit (*I will write about revering git commits some time later*) but let's assume for this article
 that you were drunk and you did a reset.

Technically what happens is, you go back to previous commit by removing the last commit in your local branch, but remote still has that
commit. See the following `commit history` diagram

{% highlight text %}


Before RESET
--------------

remote: a -> b -> c -> d (your last commit)
local: a -> b -> c -> d (your last commit)


After RESET
-----------

remote: a -> b -> c -> d (your last commit)
local: a -> b -> c (c is your last now)

{% endhighlight %}

Assuming that teams are working actively and pushing the code to remote repo. As soon as you delete your commit in `local branch`, some one
commits his/her work to remote. Now the `commit history` looks like this.


{% highlight text %}


LOCAL BRANCH
------------

local: a -> b -> c (c is your last now)


REMOTE BRANCH
-------------

remote: a -> b -> c -> d (your last commit, deleted from local) -> e (someone else just committed)


{% endhighlight %}

Here comes the last, **destructive part**. You have deleted your commit locally and you want to push it to remote (to remove it from there). As
soon as you type `git push` and enter, a very strange message pops up.

{% highlight text %}
error: failed to push some refs to '/f/bla/bla/bla'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. Integrate the remote changes (e.g.
hint: 'git pull ...') before pushing again.
{% endhighlight %}

To get rid of this message, someone suggested you to `force-push` your changes and the moment you wrote `git push -f` and entered, you
destroyed the work committed by other guy **after your deleted commit**.

Apart from destroying other's work, it creates an **extremely confusing and depressing situation**. *You have matched remote branch's history
with your local branch and everything happened after that (on remote) is disappeared*{:.yellow}. Someone else clones the branch and finds that
the code other developer are talking about is not there and other developers find out that they were synced with remote branch
a moment ago but now they are **ahead** of remote branch.

Although, they  have **your** work in their local repositories and worst, if they commit  now, *the code written by <b>you</b> will be committed by
 <b>some other</b> developer in some other commit.*{:.yellow}

> You shouldn't care about all of this if you are the **only** person committing to a repo. But still, I discourage using `force push`
> and `hard reset`. If you are in habit of using these **destructive** commands you can easily apply them in some other busy repo.

I leave the demo for next part where I will show you practically by creating all these scenarios.
