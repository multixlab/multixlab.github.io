---
layout: post
title: Why should I fix it?
modified: 12-Mar-2017 (13:34)
category: random
comments: true
tag: random
date: 2017-03-12
ashfaq_ahmed: "https://en.wikipedia.org/wiki/Ashfaq_Ahmed"
---

Sometime we become lazy while writing code, in spite of knowing we are doing it wrong way, we do it just to make something complete. Well, it
happens to almost all of the developers, we quickly fix something and move forward - *keeping in mind that we will fix it later*.

If you are lucky enough, you get a chance to fix it but most of the time you will not get a chance to change it and you will have to move on
completing other tasks. This common practice is **really dangerous** in large projects.

I remember a story from the book **Zavia** by **[Ashfaq Ahmed]({{page.ashfaq_ahmed}}){:.blue}**. While he has written the story in another context (disappointment) but
it fits nicely here. I am writing it in current context,

 > Bad code is like a drop of ink in water. When a drop of ink falls in water, it does not remain there, it spreads over the surface of
 > water (event if it is the smallest drop) effecting all the water. Similarly, when we a bad code, it does not remain there in that part, eventually it effects the whole
 > project enforcing us to write more bad code or eventually we start losing the control.

Bad code does not sit in one place, it propagates to other parts of the software. As soon as you observe that this thing is a hack and it can
be done in a better way; leave everything else and do it on priority bases.

Leaving bad code there for long time can also make it irreversible, say if it takes few hours now to fix it, it may take days to fix it after project
 has evolved.

 A more important factor is bad code written by one developer can also effect other developers. As project evolved with time, new
 developers have to stick with previous bad technique to patch the code and they never get time to fix it.

 PS: As I see, developers are lazy creatures, even expert developers lazily put a piece of bad code there (intentionally or unintentionally),
 every software firm must have code reviewing process in which senior developers go through the code and fix any problem they see or ask
 the developer to fix before committing to VCS.

