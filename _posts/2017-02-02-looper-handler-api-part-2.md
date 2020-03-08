---
layout: post
title: Looper/Handler API - Part 2
modified: 02-Feb-2017 (23:32)
category: android
comments: true
date: 2017-02-02
tags:
- android
- handlers
---

This is part two of looper/handler API series

- [Looper/Handler API - Part 1]({{site.url}}/looper-handler-api/){:.blue}
- [Looper/Handler API - Part 2]({{site.url}}/looper-handler-api-part-2/){:.blue}
- [Looper/Handler API - Part 3]({{site.url}}/looper-handler-api-part-3/){:.blue}
- [Looper/Handler API - Part 4]({{site.url}}/looper-handler-api-part-4/){:.blue}


In previous article, we have learnt about why we need handler API, classes used in this API and their responsibilities and in the last
we have written a small app for demonstration. In this article, I will explain the example code.

We started off by writing a worker thread. Let's see what's in `Worker Thread's` source code and how it works.

{% highlight java %}
class WorkerThread extends Thread implements Handler.Callback{

    private static final boolean LOG = true;

    private Handler mHandler;

    WorkerThread() {
        super("WorkerThread");
    } // WorkerThread

    @Override
    public void run() {
        Looper.prepare(); // attached looper to current thread
        mHandler = new Handler(this); // attach this handler to looper of current thread
        Looper.loop(); // starts to process queue, this is a blocking call.

        if(LOG){
            log("run -> %s", "terminating worker thread.");
        }

    } // run


    @Override
    public boolean handleMessage(Message msg) {
        try {
            int sleepTime = new Random().nextInt(2000);
            if(LOG){
                log("handleMessage -> sleeping for [%s ms]", sleepTime);
            }
            Thread.sleep(sleepTime);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        if(LOG){
            log("handleMessage -> what[%s], thread[%s]", msg.what, Thread.currentThread().getName());
        }
        return true;
    } // handleMessage

    Handler getHandler(){
        return mHandler;
    } // getHandler

    private void log(String format, Object... args){
        Utils.log("class[WorkerThread]", String.format(format, args));
    } // log

} // WorkerThread

{% endhighlight %}


Ok. I will explain each and every thing at very basic level here.

We extend our `WorkerThread` from `java.lang.Thread` class because it's a *thread* and implement `Handler.Callback` which is the callback
for  `Handler` (`Looper` will dispatch messages through this callback).

A `Handler` is declared as a private field. It is the interface used by `Main Thread` to add `Message` in the `Looper`'s queue.

In `run` method, we call `Looper.prepare()` to attach a `Looper` with current thread (WorkerThread). After calling this method, our thread
has a looper attached to it, we can initialize (` mHandler = new Handler(this)`). The default constructor of `Handler` binds the handler
to the `Looper` of current thread. Note that we have also passed `this` to constructor, it is for `Handler.Callback`. By contract `Handler.Callback`
enforces us to override `handleMessage(Message msg)`. All the messages passed to `Looper's` queue will be dispatched to `Handler`
through this method.

Once we have set up `Looper` and `Handler`, we can start the loop and wait for message. `Looper.loop()` will **block the current thread**
and whenever a message is sent to the `MessageQueue` it will be dispatched to the `handleMessage(Message msg)` method of `WorkerThread`.

Now let's go to `MainActivity` ans see what's happening there!

{% highlight java %}
public class MainActivity extends AppCompatActivity {

    private static final boolean LOG = true;
    private WorkerThread workerThread;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        ActivityUtils.setToolbar(this, getString(R.string.app_name));
    } // onCreate

    @Override
    protected void onStart() {
        super.onStart();
        if(LOG){
            log("onStart()");
        }

        workerThread = new WorkerThread();
        workerThread.start();
    }

    @Override
    protected void onStop() {
        super.onStop();
        if(LOG){
            log("onStop()");
        }
        if(workerThread != null){
            if(LOG){
                log("onStop -> %s", "quit looper.");
            }

            workerThread.getHandler().getLooper().quit();
            workerThread = null;
        }
    } // onStop

    private void log(String format, Object... args){
        Utils.log("class[MainActivity]", String.format(format, args));
    } // log

    public void onDoWork(View view) {
        if(workerThread.getHandler() != null){
            int what = new Random().nextInt(100);
            if(LOG){
                log("onDoWork -> seding [%d]", what);
            }

            workerThread.getHandler().sendMessage(workerThread.getHandler().obtainMessage(what));
        }
    } // onDoWork

} // MainActivity

{% endhighlight %}

In `MainActivity` we start off by initializing the worker **Thread**. Next we override `onStop` method, here we are quiting the loop so that `WorkerThread`
can terminate.

`onDoWork` methods is registered as `onClick` listener for Button in `layout`. Whenever this method is called, we get the handler from `WorkerThread`
and insert a `Message` in queue using `sendMessage` method.

`sendMessage` adds the method in the queue which is eventually dispatched to `handleMessage(Message msg)` in `WorkerThread`.


In upcoming articles, I will write in detail about messages and other callbacks related to handler. Read part 3 [here]({{site.url}}/looper-handler-api-part-3/){:.blue}