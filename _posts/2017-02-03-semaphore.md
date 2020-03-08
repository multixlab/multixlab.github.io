---
layout: post
title: Semaphore
modified: 25-Feb-2017 (19:27)
category: java
comments: true
date: 2017-02-03
tags: [java, threads]
---

## Background

A [Semaphore](https://docs.oracle.com/javase/7/docs/api/java/util/concurrent/Semaphore.html){:.blue} synchronizes access to a shared resource. With trivial synchronized blocks, only one thread can enter the *critical section* at a time,
with `Semaphores` there is no restriction. We can define the no. of threads accessing the shared source while initializing the `Semaphore`.

## Working

Semaphore controls the access to shared resource using a counter. When a thread asks for permit (*using acquire() method of Semaphore*), Semaphore
checks the counter, if counter is greater than zero, permit will be given to requesting thread,consequently thread will be allowed to
enter the critical section.

If counter is zero, calling thread will be suspended until some other thread releases the semaphore (*using release() method of Semaphore*).

## Constructors

`Semaphore` class has *two* constructors.

 - Semaphore(int permits)
 - Semaphore(int permits, boolean fair)

First constructor allows us to set the number of permits. Think of counter here as permit. If we set the no. of permits to *2*, the Semaphore
will have two permits which it can assign to any two threads.

If `Semaphore` has suspended some threads and any other thread releases the semaphore, it will pick a **random thread** from
suspended threads to start execution again. That's not fair (**why?**). `boolean fair` in constructor will alternate this behaviour, if `fair`
 is set to true threads will be resumed in order in which they were suspended.

## acquire() / release()

- `acquire()` acquires a permit from this semaphore, blocking until one is available, or the thread is interrupted. Read more [here](https://docs.oracle.com/javase/7/docs/api/java/util/concurrent/Semaphore.html#acquire()){:.blue}.

- `release()` releases a permit, returning it to the semaphore.. Read more [here](https://docs.oracle.com/javase/7/docs/api/java/util/concurrent/Semaphore.html#release()){:.blue}.

## Example

Let's create a simple program to understand `Semaphores`. We create two threads which will update a shared resource - a static counter. Each
thread will get permit before incrementing the resource and will release if afterwards.

**ThreadOne**

{% highlight java %}
class ThreadOne extends Thread {

    private Semaphore semaphore;

    public ThreadOne(Semaphore semaphore) {
        super("thread-1");
        this.semaphore = semaphore;
    } // ThreadOne

    @Override
    public void run() {
        System.out.println(getName() + " acquiring lock.");
        try {
            semaphore.acquire();
            System.out.println(getName() + " lock acquired. incrementing resource");

            for (int i = 0; i < 3; i++) {
                SharedResource.counter++;
                Thread.sleep(200);
            }

            System.out.println(getName() + " releasing lock.");
            semaphore.release();

        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    } //
} // ThreadOne
{% endhighlight %}

**ThreadTwo**

{% highlight java %}
 class ThreadTwo extends Thread {

    private Semaphore semaphore;

    ThreadTwo(Semaphore semaphore) {
        super("thread-2");
        this.semaphore = semaphore;
    } // ThreadOne

    @Override
    public void run() {
        System.out.println(getName() + " acquiring lock.");
        try {
            semaphore.acquire();
            System.out.println(getName() + " lock acquired. incrementing resource");

            for (int i = 0; i < 3; i++) {
                SharedResource.counter++;
                Thread.sleep(200);
            }

            System.out.println(getName() + " releasing lock.");
            semaphore.release();

        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    } //

}
{% endhighlight %}

**App**

{% highlight java %}
public class SemApp {

    public static void run() throws InterruptedException {
        Semaphore semaphore = new Semaphore(1);

        ThreadOne t1 = new ThreadOne(semaphore);
        ThreadTwo t2 = new ThreadTwo(semaphore);

        t1.start();
        t2.start();


        t1.join();
        t2.join();

        System.out.println("resource value = " + SharedResource.counter);
    } // main

}
{% endhighlight %}


**Output**

{% highlight text %}
thread-1 acquiring lock.
thread-2 acquiring lock.
thread-1 lock acquired. incrementing resource
thread-1 releasing lock.
thread-2 lock acquired. incrementing resource
thread-2 releasing lock.
resource value = 6
{% endhighlight %}
