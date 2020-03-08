---
layout: post
title: Synchronized keyword ?
modified: 12-Feb-2017 (22:42)
category: java
comments: true
date: 2017-02-12
tags: [java, threads]
---

At low level, java provides `synchronized` keyword for syncing multiple threads. It can be used in **two** different ways;

- On methods
- On separate block of code

When used on methods, it will hold lock on *calling object* until control goes out of the method i.e. method completes or throws
some exception. In case of static methods, lock will be held on *Class object*.

{% highlight java %}
    synchronized void log(String name){
       // some logic
    }
{% endhighlight %}

When used on separate block of code, it holds lock on provided object.

{% highlight java %}
  synchronized (lock){
            // critical section
  }
{% endhighlight %}

When thread reaches a synchronized blocks, it asks for lock; if and only if, it is not held by any other thread, this thread is given access
to enter the synchronized block.

Locks in java are reentrant i.e. if a thread holds a lock and requests a new one on same object, it is given the lock and access to
synchronized block. JVM stores an accusation counter and thread owner info in the lock. Zero value in the counter indicates that
it is free to be used by threads. When a thread acquires lock, this counter is incremented and owner info is saved, if the *same*
thread wants to acquire lock again, counter is incremented and access is give again.

On coming out of Synchronized block, counter is decremented, indicating the release of lock. When thread completes
execution of all the synchronized blocks it was given access to, other threads are allowed to acquire the lock and start execution.

Note: Every object in java has an intrinsic lock which is used for synchronization.
{: .notice}