---
layout: post
title: Syncing with CountDownLatch
modified: 02-Feb-2017 (14:58)
category: java
comments: true
date: 2017-02-01
tags: [java, threads]
latch: "https://docs.oracle.com/javase/7/docs/api/java/util/concurrent/CountDownLatch.html"
---

A [CountDownLatch]({{page.latch}}){:.blue} is a synchronisation mechanism which allows threads to wait until some events occur. By using `CountDownLatch` you can wait for events to happen in **other threads**
and can proceed only if they have completed.

## Working

From docs

> A `CountDownLatch` is initialized with a given count. The await methods block until the current count reaches zero due to invocations of the countDown() method,
> after which all waiting threads are released and any subsequent invocations of await return immediately.

**Note:** This is a one-shot phenomenon -- the count cannot be reset. If you need a version that resets the count, consider using a CyclicBarrier.
{: .notice}


There are *3* important methods in `CountDownLatch` class.

- await()
- await(long timeout, TimeUnit unit)
- countDown()

## await()

{% highlight java %}
void await() throws InterruptedException
{% endhighlight %}

`await()` causes current thread to wait until event count in latch reaches to zero (by calling `countDown()` method on Latch) or thread is interrupted. If Latch has
already zero count, this method returns immediately.

If a thread has `interrupted` flag set upon entering this method, it will throw `InterruptedException` and will clear the flag.


## await(long timeout, TimeUnit unit)

{% highlight java %}
boolean await(long timeout, TimeUnit unit) throws InterruptedException
{% endhighlight %}

This method is same as `await` with one difference. It will stop waiting if given timeout is elapsed.It returns false if waiting timeout elapses and true, if
event count in latch become zero.

If the time is less than or equal to zero, the method will not wait at all. 
{:.notice}


## countDown()

{% highlight java %}
void countDown()
{% endhighlight %}

It decrements the latch count if count is greater than zero. If count reaches to zero, it awakes all awaiting threads.

## Example

To understand everything I have written, let's create a scenario in which we can use `CountDownLatch`. Say, we have 3 threads, first two threads insert value in a shared list
and third thread waits until each of them completes inserts value in the queue.

Once both thread have inserted values, we will calculate sum of those values in third thread.

Now, create a general `NumberThread` class which inserts values in the list and invokes `countDown` on latch.

{% highlight java %}
class NumberThread extends Thread {

    List<Integer> list;
    CountDownLatch latch;

    NumberThread(String name, List<Integer> list, CountDownLatch latch){
        super(name);
        this.list = list;
        this.latch = latch;
    } // NumberThread

    @Override
    public void run() {
        super.run();
        String threadName = getName();

        System.out.printf("%s - starts waiting\n", threadName);
        try {
            Thread.sleep(new Random().nextInt(1000));
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        int value = new Random().nextInt(100);
        System.out.printf("%s - inserting %d in the list\n", threadName, value);
        list.add(value);

        System.out.printf("%s - invoking countDown on latch\n", threadName);
        latch.countDown();

    } // run

} // NumberThread
{% endhighlight %}

Create `ThreadOne` class which extends from `NumberThread`

{% highlight java %}
class ThreadOne extends NumberThread {

    ThreadOne(List<Integer> list, CountDownLatch latch) {
        super(ThreadOne.class.getSimpleName(), list, latch);
    } // ThreadOne

} // ThreadOne
{% endhighlight %}

Create `ThreadTwo` class which extends from `NumberThread`

{% highlight java %}
class ThreadTwo extends NumberThread {

    ThreadTwo(List<Integer> list, CountDownLatch latch) {
        super(ThreadTwo.class.getSimpleName(), list, latch);
    } // ThreadTwo

} // ThreadTwo
{% endhighlight %}

Create `ThreadThree` class which extends from `NumberThread`. This class alos overrides the `run` method and waits for `ThreadOne` & `ThreadTwo` to insert value in list by invoking `await`
on latch.

{% highlight java %}
class ThreadThree extends NumberThread {

    ThreadOne threadOne;
    ThreadTwo threadTwo;

    ThreadThree(List<Integer> list, CountDownLatch latch, ThreadOne threadOne, ThreadTwo threadTwo) {
        super(ThreadThree.class.getSimpleName(), list, latch);
        this.threadOne = threadOne;
        this.threadTwo = threadTwo;
    }

    @Override
    public void run() {
        try {

            System.out.printf("%s - starts waiting for other threads to complete\n", getName());
            latch.await(); // wait for other threads to insert values

            int sum = list.get(0) + list.get(1);

            System.out.printf("%s - sum = %d\n", getName(), sum);

            System.out.printf("\nThread States\n");
            System.out.printf("%s - %s [%s], %s [%s]", getName(), threadOne.getName(), threadOne.getState(), threadTwo.getName(), threadTwo.getState());
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    } // run

} // ThreadThree
{% endhighlight %}

Finally, here is the `App` class.

{% highlight java %}
public class App {

    public static void main(String[] args) throws InterruptedException {
        List<Integer> list = new ArrayList<>();
        CountDownLatch latch = new CountDownLatch(2);

        ThreadOne one = new ThreadOne(list, latch);
        ThreadTwo two = new ThreadTwo(list, latch);
        NumberThread three = new ThreadThree(list, latch, one, two);

        three.start();
        one.start();
        two.start();

        one.join();
        two.join();
        three.join();

    } // main

} // App
{% endhighlight %}

**Output** - (it can vary)

{% highlight text %}
ThreadThree - starts waiting for other threads to complete
ThreadTwo - starts waiting
ThreadOne - starts waiting
ThreadTwo - inserting 74 in the list
ThreadTwo - invoking countDown on latch
ThreadOne - inserting 95 in the list
ThreadOne - invoking countDown on latch
ThreadThree - sum = 169

Thread States
ThreadThree - ThreadOne [TERMINATED], ThreadTwo [TERMINATED]
{% endhighlight %}