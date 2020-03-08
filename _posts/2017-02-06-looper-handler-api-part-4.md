---
layout: post
title: Looper/Handler API - Part 4
modified: 06-Feb-2017 (22:19)
category: android
comments: true
date: 2017-02-06
tags:
- android
- handlers
looper_link: "https://developer.android.com/reference/android/os/Looper.html"
msg_link: "https://developer.android.com/reference/android/os/Message.html"
queue_link: "https://developer.android.com/reference/android/os/MessageQueue.html"
---

{% include toc.html %}

last modified: {{ page.modified | downcase }} 
{: .last_modified }

This is part 4 of looper/handler API series

- [Looper/Handler API - Part 1]({{site.url}}/looper-handler-api/){:.blue}
- [Looper/Handler API - Part 2]({{site.url}}/looper-handler-api-part-2/){:.blue}
- [Looper/Handler API - Part 3]({{site.url}}/looper-handler-api-part-3/){:.blue}
- [Looper/Handler API - Part 4]({{site.url}}/looper-handler-api-part-4/){:.blue}

## Background

This part belongs to [Looper]({{page.looper_link}}){:.blue}. A Looper fetches [Message]({{page.msg_link}}){:.blue}  from the [MessageQueue]({{page.queue_link}}){:.blue}  and dispatch it to handler and it
happens only if **current timestamp is greater than Message's timestamp**. If there is no message to dispatch or having timestamp less than current timestamp then Looper
blocks the thread and wait for messages to reach their dispatch time.

We can also set listener for these time gaps between messages. i.e if MessageQueue detects time gaps between messages, it invokes `MessageQueue.IdleHandler` on Queue.

{% highlight java %}
MessageQueue mq = Looper.myQueue();
MessageQueue.IdleHandler idleHandler = new MessageQueue.IdleHandler();
mq.addIdleHandler(idleHandler); //  add
mq.removeIdleHandler(idleHandler); // remove
{% endhighlight %}

## Usage

A looper has 3 important methods to remember

- prepare()
- loop()
- quit()

### Prepare

`Looper.prepare()` attaches a Looper to current thread and initializes it i.e. sets up MessageQueue.

A thread can have only one Looper attached to it. If a thread has already a Looper and you call `Looper.prepare()` on that thread, it will generate a runtime exception.
{:.notice}

### Loop

`Looper.loop()` is a **blocking** call, which prevents the current thread from termination. Anything after `Loop.loop()` method will not be executed unless
you call `Looper.quit()`.

### Quit

`Looper.quit()` methods breaks the Loop and allows the read to complete its execution.

Here is a snipped from example in part 1.

{% highlight java %}
    @Override
    public void run() {
        Looper.prepare();
        mHandler = new Handler(this);
        Looper.loop();

        if(LOG){
            log("run -> %s", "terminating worker thread.");
        }

    } // run
{% endhighlight %}

## Main Looper

When application starts a Looper is attached to `main` thread (UI thread). You can get this Looper from anywhere in the application by calling `Looper.getMainLooper()`.
*Main Looper* is a little different than looper we create manually.

- Main Looper can not be attached to any other thread except *UI Thread*

- Main Looper is initialized by calling special method `Looper.prepareMainLooper()` which is called once per app. **You should never call this method**.

- Main Looper is not terminated. Any attempt to invoke `Looper.quit()` on Main Looper will generate runtime exception.

{% highlight text %}
java.lang.IllegalStateException: Main thread not allowed to quit
{% endhighlight %}
