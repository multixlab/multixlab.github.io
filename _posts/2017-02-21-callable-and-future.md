---
layout: post
title: Callable & Future Interfaces
modified: 21-Feb-2017 (21:45)
category: java
comments: true
tags: [java, threads]
date: 2017-02-21
callable: "https://docs.oracle.com/javase/7/docs/api/java/util/concurrent/Callable.html"
future: "http://docs.oracle.com/javase/7/docs/api/java/util/concurrent/Future.html"
exservice: "https://docs.oracle.com/javase/7/docs/api/java/util/concurrent/ExecutorService.html"
---

## Callable

A [Callable]({{page.callable}}){:.blue}  is a generic interface, represents a thread which will return a value.
It has a single method `call()` which throws `Exception` and returns an object of given type.

{% highlight java %}
V call() throws Exception;
{% endhighlight %}

[Callable]({{page.callable}}){:.blue} is similar to `Runnable` with **two** major differences.

- `Runnable` task can not return a value while a `Callable` can.

- `Callable` can throw an exception while a `Runnable` can not.

> A `Callable` must return a value if task is completed successfully or in case of failure an exception 
> must be thrown.

[ExecutorService#submit]({{page.exservice}}){:.blue}  method accepts objects of type callable and execute them in their own threads.


## Future

[ExecutorService#submit]({{page.exservice}}){:.blue}  returns an object of type [Future]({{page.future}}){:.blue}  which represents the result of `Callable` thread.

{% highlight java %}
V get() throws InterruptedException, ExecutionException;
{% endhighlight %}

Future object can be queried for getting information about task cancellation or completion. The most important method of `Future` object is `get()` which returns the result of `Callable` object.

**`get()` is a blocking a call** and it stops the execution of current thread unless one of the following event occurs

- Current thread is interrupted (`InterruptedException` is thrown).

- Task is canceled (`CancellationException` is thrown).

or

- Task throws an exception (`ExecutionException` is thrown.)

## Example

**App.java**

{% highlight java %}
public class App {

    public static void main(String[] args) throws InterruptedException, ExecutionException {

        ExecutorService es = Executors.newFixedThreadPool(2);

        Future<String> future = es.submit(() -> {
            System.out.println("waiting in " + Thread.currentThread().getName());
            Thread.sleep(3000);
            return "some random result";
        });

        System.out.println(future.get());

        es.shutdown();

    } // main

} // App
{% endhighlight %}

**Output**

{% highlight text %}
waiting in pool-1-thread-1
some random result
{% endhighlight %}