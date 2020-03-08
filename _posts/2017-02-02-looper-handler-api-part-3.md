---
layout: post
title: Looper/Handler API - Part 3
modified: 06-Feb-2017 (21:08)
category: android
comments: true
date: 2017-02-02
tags:
- android
- handlers
message_link: "https://developer.android.com/reference/android/os/Message.html"
queue_link: "https://developer.android.com/reference/android/os/MessageQueue.html"
---

{% include toc.html %}

last modified: {{ page.modified | downcase }} 
{: .last_modified }

This is part 3 of looper/handler API series

- [Looper/Handler API - Part 1]({{site.url}}/looper-handler-api/){:.blue}
- [Looper/Handler API - Part 2]({{site.url}}/looper-handler-api-part-2/){:.blue}
- [Looper/Handler API - Part 3]({{site.url}}/looper-handler-api-part-3/){:.blue}
- [Looper/Handler API - Part 4]({{site.url}}/looper-handler-api-part-4/){:.blue}


In part 1 and 2, we had skimmed through the API and created an example app. In this part, we will study in detail [Message]({{page.message_link}}){:.blue}
and its types.

Objects inserted in [MessageQueue]({{page.queue_link}}){:.blue} of the Looper are of [Message]({{page.message_link}}){:.blue} type. There are
 *two* types of messages.

 - Data Message
 - Task Message

## Data Message

 A data message consists of some data to be passed to handler. It has a number of fields which can be used to pass data. e.g.

 - what
 - arg1, arg2
 - object

 {% highlight java %}
Message m = Message.obtain(Handler h);
Message m = Message.obtain(Handler h, int what);
Message m = Message.obtain(Handler h, int what, Object o);
Message m = Message.obtain(Handler h, int what, int arg1, int arg2);
Message m = Message.obtain(Handler h, int what, int arg1, int arg2, Object o);
 {% endhighlight %}

Although, you can obtain message directly from `Message.obtain` method but `Handler` also provides wrapper around these methods and returns message with handler set to `this` 
handler.

{% highlight java %}
workerThread.getHandler().obtainMessage(what);
{% endhighlight %}

## Task Message

Task message is java.lang.Runnable object which is executed on *consumer* thread.

{% highlight java %}
     workerThread.getHandler().post(new Runnable() {
                @Override
                public void run() {
                    // post task
                }
            });
{% endhighlight %}

## Explanation

A message queue can contain any number of data and task messages. Data messages are dispatched to Handler callback while task messages
are run on consumer thread without calling handler callbacks.

## Message Lifecycle

Android stores Messages in application wide pool and reuses them when necessary. At given time, a Message can be in one of the
following states

- Initialized
- Pending
- Dispatched
- Recycled

### Initialized

A message is created in initialized state and populated with data if required. e.g

{% highlight java %}
Message m = Message.obtain();
{% endhighlight %}

### Pending

In pending state, Message is added to MessageQueue for dispatching in consumer thread.

### Dispatched

In dispatched state, Message is dispatched to consumer thread for processing. As Message contains information about its Handler,
Looper dispatches Message to its related Handler.

### Recycled

After processing on consumer thread, Looper cleared **message state** and returns it back to Looper.

<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="163px" version="1.1" viewBox="0 0 163 409" style="max-width:100%;max-height:409px;"><defs/><g transform="translate(0.5,0.5)"><path d="M 117 40 L 117 83.63" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 117 88.88 L 113.5 81.88 L 117 83.63 L 120.5 81.88 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><ellipse cx="117" cy="20" rx="30" ry="20" fill="#ffffff" stroke="#000000" pointer-events="none"/><g transform="translate(96.5,13.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="41" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 42px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">created</div></div></foreignObject><text x="21" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">created</text></switch></g><path d="M 117 120 L 117 153.63" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 117 158.88 L 113.5 151.88 L 117 153.63 L 120.5 151.88 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><rect x="72" y="90" width="90" height="30" fill="#ffffff" stroke="#000000" pointer-events="none"/><g transform="translate(90.5,98.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="52" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 53px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">initialized</div></div></foreignObject><text x="26" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">initialized</text></switch></g><path d="M 117 190 L 117 233.63" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 117 238.88 L 113.5 231.88 L 117 233.63 L 120.5 231.88 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><rect x="72" y="160" width="90" height="30" fill="#ffffff" stroke="#000000" pointer-events="none"/><g transform="translate(94.5,168.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="45" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 46px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">pending</div></div></foreignObject><text x="23" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">pending</text></switch></g><path d="M 117 270 L 117 313.63" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 117 318.88 L 113.5 311.88 L 117 313.63 L 120.5 311.88 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><rect x="72" y="240" width="90" height="30" fill="#ffffff" stroke="#000000" pointer-events="none"/><g transform="translate(90.5,248.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="53" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 54px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">dispatced</div></div></foreignObject><text x="27" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">dispatced</text></switch></g><path d="M 117 350 L 117 400 L 7 400 L 7 60 L 110.63 60" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 115.88 60 L 108.88 63.5 L 110.63 60 L 108.88 56.5 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><rect x="72" y="320" width="90" height="30" fill="#ffffff" stroke="#000000" pointer-events="none"/><g transform="translate(93.5,328.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="46" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 47px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">recycled</div></div></foreignObject><text x="23" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">recycled</text></switch></g></g></svg>

## Caution!

Looper API does not provide any callbacks for observing the states of message and we can not assume the message state, therefore you
should **never change** the state of Message after it is pushed to the MessageQueue.

It is possible that we will be changing the state of a Message after it is dispatched or being reused after recycling.
{:.notice}