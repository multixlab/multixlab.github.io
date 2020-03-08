---
layout: post
title: Thread Local Variables
modified: 09-Jan-2017 (01:52)
category: java
comments: true
date: 2017-01-08
tags: [java, threads]
---

last modified: {{ page.modified | downcase }} 
{: .last_modified }


Normally, when an object is **shared** by multiple threads, depending on the *access modifier* each thread can access the *same field* in object and change in that field can be propagated to all other threads. 

That's the default behaviour, but sometimes we want each thread to have its own **local copy** of the field. In this way, every change to that field will be visible in that thread **only**.

Java allows us to achieve this behaviour using [ThreadLocal](https://docs.oracle.com/javase/7/docs/api/java/lang/ThreadLocal.html){:.blue} variables.

## Usage

[ThreadLocal](https://docs.oracle.com/javase/7/docs/api/java/lang/ThreadLocal.html){:.blue} is a 
generic class which can store any kind of object. When object is first get from `ThreadLocal` variable using `Threadlocal.get` method, it calls `initialValue` method *if variable is not initialized already*{: .yellow}.

See `MessageQueue` class in the example below.

## Example

Say, we have a `MessageQueue` class which contains a `ThreadLocal Queue`. We want to share an instance of this class with 2 threads, each having its own copy of `Queue` and inserts 5 items in the `Queue`.

**MessageQueue**
{% highlight java %}
class MessageQueue<T> {

    private final ThreadLocal<Queue<T>> queue;

    MessageQueue(){
        queue = new ThreadLocal<Queue<T>>(){
            @Override
            protected Queue<T> initialValue() {
                return new ArrayDeque<>();
            }
        };
    } // MessageQueue


    Queue<T> getQueue() {
        return queue.get();
    } // getQueue


} // MessageQueue
{% endhighlight %} 

**ThreadA**

{% highlight java %}

class ThreadA extends Thread {

    private MessageQueue<String> messageQueue;

    ThreadA(MessageQueue<String> messageQueue) {
        super("ThreadA");
        this.messageQueue = messageQueue;
    }

    @Override
    public void run() {
        super.run();
        Queue<String> queue = messageQueue.getQueue();
        for (int i = 0; i < 5; i++) {
          queue.add(String.format("%s - %s", i, Thread.currentThread().getName()));
        } // end for
        System.out.println(queue.toString());
    }
} // ThreadA

{% endhighlight %}

**ThreadB**

{% highlight java %}
class ThreadB extends Thread {

    private MessageQueue<String> messageQueue;

    ThreadB(MessageQueue<String> messageQueue) {
        super("ThreadB");
        this.messageQueue = messageQueue;
    }

    @Override
    public void run() {
        super.run();
        Queue<String> queue = messageQueue.getQueue();
        for (int i = 0; i < 5; i++) {
            queue.add(String.format("%s - %s", i, Thread.currentThread().getName()));
        } // end for
        System.out.println(queue.toString());
    } // run

} // ThreadB
{% endhighlight %}

**Main**

{% highlight java %}
public class App {

    public static void main(String[] args) throws InterruptedException {

        MessageQueue<String> messageQueue = new MessageQueue<>();

        // init 
        ThreadA threadA = new ThreadA(messageQueue);
        ThreadB threadB = new ThreadB(messageQueue);

        // start threads
        threadA.start();
        threadB.start();

        // wait for threads
        threadA.join();
        threadB.join();

    } // main

} // App
{% endhighlight %}

**Output**

{% highlight java %}

[0 - ThreadB, 1 - ThreadB, 2 - ThreadB, 3 - ThreadB, 4 - ThreadB]
[0 - ThreadA, 1 - ThreadA, 2 - ThreadA, 3 - ThreadA, 4 - ThreadA]

{% endhighlight %}

Without `ThreadLocal`, each thread will insert data in same `Queue`.

**Output Without ThreadLocal**

{% highlight java %}
[0 - ThreadB, 1 - ThreadA, 1 - ThreadB, 2 - ThreadA, 2 - ThreadB, 3 - ThreadB, 4 - ThreadA]
[0 - ThreadB, 1 - ThreadA, 1 - ThreadB, 2 - ThreadA, 2 - ThreadB, 3 - ThreadB, 4 - ThreadA]
{% endhighlight %}