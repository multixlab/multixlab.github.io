---
layout: post
title: Getting familiar with Loaders - Part 2
modified: 31-Jan-2017 (00:07)
category: android
comments: false
date: 2017-01-30
tags: [android, loaders]
---

{% include toc.html %}

last modified: {{ page.modified | downcase }} 
{: .last_modified }


This is part 2 of **Loaders** article series

- [Getting familiar with Loaders - Part 1]({{site.url}}/loaders-part-1){:.blue}
- [Getting familiar with Loaders - Part 2]({{site.url}}/loaders-part-2){:.blue}

A loader has **6** states maintianed by fields in Loader class.

{% highlight java %}
    boolean mStarted = false;
    boolean mAbandoned = false;
    boolean mReset = true;
    boolean mContentChanged = false;
    boolean mProcessingChange = false;
{% endhighlight %}

## Reset

A loader starts in `reset` state. This flag will also become true if `reset` method is invoked on `Loader`, after that `onReset()` method is called. In `onReset` you should clean any resources attached to loader.

This state can be queried using `isReset()` method.

## Started

A loader is in started state if `startLoading` is invoked on it. `startLoading()` sets `mStarted` to true and calls `onStartLoading()` in Loader. In this state, you should start loading data, if data is cached you can deliver it immidiately. 

> You should call `forceLoade()` from this method, if it is invoked for the first time.

This state can be queried using `isStarted()` method. 

## Stopped

Loader goes into sotpped state if `stopLoading()` is called by Loder. In this state, loader should not deliver new results, rather it should cache the result and deliver them on next restart. 

> You should free any resources related to Loader in this state.


## ContentChanged

This flag notifies the loader that content is changed. You can check this flag in `onStartLoading` to see if something has changed while Loader was stopped. When Loader detects this flag `onContentChanged` is called on Loader to handle the change.

> Default implementation of `onContentChanged()` calls `forceload()` if loader is started.

## Abandoned and ProcessingChange

I haven't used these states yet, I will update it once I use these somewhere.
{:.notice}

## Flow Chart

*comming soon*