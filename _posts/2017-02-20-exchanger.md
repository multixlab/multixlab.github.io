---
layout: post
title: Exchanger
modified: 20-Feb-2017 (21:43)
category: java
comments: true
tags: [java, threads]
date: 2017-02-20
exchanger: "https://docs.oracle.com/javase/7/docs/api/java/util/concurrent/Exchanger.html"
---


[Exchanger]({{page.exchanger}}){:.blue}  is Java's high level API for sharing data between two threads. It allows one thread to wait while another thread generates or processes data. Once they have prepared data, data objects can be shared between the threads.

## Working

There are two important methods in Exchanger class. 

{% highlight java%}
V exchange(V x) throws InterruptedException

V exchange(V x, long timeout, TimeUnit unit) throws InterruptedException, TimeoutException 
{% endhighlight%}

**V** is the type of data to be exchanged. When `exhcange()` is invoked on a thread, it stops the current thread and waits for other thread to reach the exchange point.

> exchange() method waits until it is not invoked on **same** object by two **separate** threads or thread is 
> interrupted.

When `exchage()` is called by both threads, objects are swaped and thread execution is resumed. If `exchange()` is already called by a thread and another thread invoked `exchange()`, other thread is passed the object immidiately and execution is proceeded in both threads.

Exchange with `timeout` is same as `exchange()` with one major difference - it waits for specified interval of time. `TimeoutException` is thrown if no other thread arrives at exchange point in a given time.

## Example

We are going to create **two** threads which will exchange object. I will print object's hashcode along with thread name to get better understanding of what's going on.

**ThreadA** - sends an empty string and prints the string returned from *ThreadB*.

{% highlight java %}
class ThreadA extends Thread {

    private Exchanger<String> ex;
    private String str;

    ThreadA(Exchanger<String> ex) {
        super("ThreadA");
        this.ex = ex;
        str = "";
    }

    @Override
    public void run() {
        System.out.println(String.format("[%s] - sending object[%s]", getName(), str.hashCode()));
        try {
        	Thread.sleep(1000);
            str = ex.exchange(str);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(String.format("[%s] - receiving object[%s]", getName(), str.hashCode()));
    }
} // ThreadA
{% endhighlight %} 

**ThreadB** - sends a string (ThreadA) and prints the string returned from *ThreadA*.

{% highlight java %}
class ThreadB extends Thread {

    private Exchanger<String> ex;
    private String str;

    ThreadB(Exchanger<String> ex) {
        super("ThreadB");
        this.ex = ex;
        str = "";
    }

    @Override
    public void run() {
        try {
            str = getName();
            System.out.println(String.format("[%s] - sending object[%s]", getName(), str.hashCode()));
            Thread.sleep(500);
            str = ex.exchange(str);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(String.format("[%s] - receiving object[%s]", getName(), str.hashCode()));
    } // run
} // ThreadB
{% endhighlight %} 

**App.java**

{% highlight java %}
public class App {

    public static void main(String[] args) throws InterruptedException {

        Exchanger<String> exchanger = new Exchanger<>();

        Thread t1 = new ThreadA(exchanger);
        Thread t2 = new ThreadB(exchanger);

        t2.start();
        t1.start();

    } // main

} // App

{% endhighlight %}

**Output**

{% highlight text %}
[ThreadB] - sending object[326716248]
[ThreadA] - sending object[0]
[ThreadB] - receiving object[0]
[ThreadA] - receiving object[326716248]
{% endhighlight %}