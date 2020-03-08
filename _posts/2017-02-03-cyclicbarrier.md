---
layout: post
title: Syncing with CyclicBarrier
modified: 03-Feb-2017 (11:01)
category: java
comments: true
date: 2017-02-03
tags: [java, threads]
cblink: "https://docs.oracle.com/javase/7/docs/api/java/util/concurrent/CyclicBarrier.html"
---

{% include toc.html %}

last modified: {{ page.modified | downcase }} 
{: .last_modified }

[CyclicBarrier]({{cblink}}){:.blue} is useful in situations where you want each thread in a set of threads to reach at specific execution point
before moving further.

## How to implement?

CyclicBarrier constructor received two arguments.

- No. of threads to reach the barrier. Minimum 1 is allowed here. Anything less than 1 will trigger `IllegalArgumentException()`
- Optional runnable task to invoke, once all threads reach the barrier and **before** resuming threads blocked by barrier.

`await()` function is invoked in thread to make current thread *wait* until all other threads invoke `await()` i.e. reach the barrier or one of the
following situations occur

  - The last thread arrives
  - Some other thread interrupts the current thread
  - Some other thread interrupts one of the other waiting threads
  - Some other thread times out while waiting for barrier
  - Some other thread invokes `reset` on this barrier.

## Example

Let's make a simple program to demonstrate the behaviour of cyclic barrier. We create a `CyclicBarrier` which waits for `await()` method to
be invoked three times. In each thread, we wait for some random time and print data about thread. Finally, we print a message once each thread
reaches the barrier.

**MyThread.java**

{% highlight java %}
class MyThread extends Thread {

    private final CyclicBarrier barrier;

    MyThread(String name, CyclicBarrier barrier){
        super(name);
        this.barrier = barrier;
    }

    @Override
    public void run() {
        System.out.printf("running %s \n", getName());
        int sleepTime = new Random().nextInt(2000);
        System.out.printf("[%s] sleeping for %dms\n", getName(), sleepTime);
        try {
            Thread.sleep(sleepTime);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.printf("[%s] invoking await on barrier[%s]\n", getName(), barrier.hashCode());

        try {
            barrier.await();
        } catch (InterruptedException | BrokenBarrierException e) {
            e.printStackTrace();
        }

        System.out.printf("[%s] after waiting for barrier[%s]\n", getName(), barrier.hashCode());
    } // run

} // MyThread
{% endhighlight %}

Barrier **Main** class

{% highlight java %}
public class BarrierApp {

    public static void run(){
        CyclicBarrier barrier = new CyclicBarrier(3, () -> System.out.println("\nall threads have reached the barrier.\n"));

        new MyThread("A", barrier).start();
        new MyThread("B", barrier).start();
        new MyThread("C", barrier).start();


    } // run

} // BarrierApp

{% endhighlight %}

**Output**

{% highlight text %}
running A
running C
running B
[A] sleeping for 1496ms
[C] sleeping for 450ms
[B] sleeping for 1435ms
[C] invoking await on barrier[6867595]
[B] invoking await on barrier[6867595]
[A] invoking await on barrier[6867595]

all threads have reached the barrier.

[A] after waiting for barrier[6867595]
[B] after waiting for barrier[6867595]
[C] after waiting for barrier[6867595]
{% endhighlight %}


## Repeating Cycle

Unlike [CountDownLatch](){:.blue}, `CyclicBarrier` is repeatable. We can again invoke `await()` of new threads and `CyclicBarrier` will trigger
completion tasks and release thread when a barrier is reached or any of above discussed situation occurs.

Modify the above example, add following code in `BarrierApp.run()`

{% highlight java %}
    new MyThread("A", barrier).start();
    new MyThread("B", barrier).start();
    new MyThread("C", barrier).start();
    // repeat
    new MyThread("Aa", barrier).start();
    new MyThread("Bb", barrier).start();
    new MyThread("Cc", barrier).start();
{% endhighlight %}

**Output for repeated cycle**

{% highlight text %}
Starting CyclicBarrier demo...
running B
running Cc
running Bb
running Aa
running C
running A
[Cc] sleeping for 1091ms
[Bb] sleeping for 81ms
[C] sleeping for 1385ms
[B] sleeping for 1677ms
[Aa] sleeping for 777ms
[A] sleeping for 1371ms
[Bb] invoking await on barrier[1122215709]
[Aa] invoking await on barrier[1122215709]
[Cc] invoking await on barrier[1122215709]

all threads have reached the barrier.

[Cc] after waiting for barrier[1122215709]
[Aa] after waiting for barrier[1122215709]
[Bb] after waiting for barrier[1122215709]
[A] invoking await on barrier[1122215709]
[C] invoking await on barrier[1122215709]
[B] invoking await on barrier[1122215709]

all threads have reached the barrier.

[B] after waiting for barrier[1122215709]
[C] after waiting for barrier[1122215709]
[A] after waiting for barrier[1122215709]
{% endhighlight %}

## Resetting Barrier

Calling `reset` on `Barrier` resets the barrier and throws `BrokenBarrierException()` if there are threads awaiting for barrier.

Note that resets after a breakage has occurred for other reasons can be complicated to carry out; threads need to re-synchronize in some other way,
and choose one to perform the reset.  It may be preferable to instead create a new barrier for subsequent use.
{:.notice}

Modify the `BarrierApp.run()` method as below

{% highlight java %}
 new MyThread("A", barrier).start();
 new MyThread("B", barrier).start();

 Thread.sleep(5000); // avoid race condition
 barrier.reset();
{% endhighlight %}

**Output**

{% highlight text %}
running A
running B
[A] sleeping for 561ms
[B] sleeping for 1330ms
[A] invoking await on barrier[42326203]
[B] invoking await on barrier[42326203]
[A] after waiting for barrier[42326203]
[B] after waiting for barrier[42326203]
java.util.concurrent.BrokenBarrierException
	at java.util.concurrent.CyclicBarrier.dowait(CyclicBarrier.java:250)
	at java.util.concurrent.CyclicBarrier.await(CyclicBarrier.java:362)
	at io.github.allaudin.cbarrier.MyThread.run(MyThread.java:35)
java.util.concurrent.BrokenBarrierException
	at java.util.concurrent.CyclicBarrier.dowait(CyclicBarrier.java:250)
	at java.util.concurrent.CyclicBarrier.await(CyclicBarrier.java:362)
	at io.github.allaudin.cbarrier.MyThread.run(MyThread.java:35)
{% endhighlight %}