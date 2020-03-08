---
layout: post
title: What to return from onStartCommand
modified: 22-Feb-2017 (21:19)
category: android
comments: true
tags: [android]
date: 2017-02-17
---

When a Service is started, `onCreate` method is invoked (*if it is not running already*) and subsequently `onStartCommand` is called.

{% highlight java %}
void onCreate();
int onStartCommand(Intent intent, int flags, int startId);
{% endhighlight %}

From `onStartCommand(...)` an `int` value is returned which defines the restart behaviour of service. There are **three** values (ignoring
START_STICKY_COMPATIBILITY) for this purpose. I will discuss each of them briefly

- START_STICKY
- START_NOT_STICKY
- START_REDELIVER_INTENT

## START_STICKY

When a `START_STICKY` service is killed by system, it restarts with following arguments

1. If there is any pending intent to be delivered, it is passed to `onStartCommand` otherwise `null` is passed.

2. If service is killed before completing `onStartCommand`, next time service if restarted with `flags = Service.START_FLAG_RETRY`

## START_NOT_STICKY

In this case, service is **only** started if these is any pending intent to be delivered.

## START_REDELIVER_INTENT

It is same as `START_STICKY` with following differences

1. Service is restarted with **last** intent passed to service.

2. On restarting, `Service.START_FLAG_REDELIVERY` if passed to `onStartCommand` flag.