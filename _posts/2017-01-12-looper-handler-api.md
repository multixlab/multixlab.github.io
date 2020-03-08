---
layout: post
title: Looper/Handler API - Part 1
modified: 02-Feb-2017 (23:15)
category: android
comments: true
date: 2017-01-12
tags:
- android
- handlers
---

{% include toc.html %}

last modified: {{ page.modified | downcase }} 
{: .last_modified }

This is part one of looper/handler API series

- [Looper/Handler API - Part 1]({{site.url}}/looper-handler-api/){:.blue}
- [Looper/Handler API - Part 2]({{site.url}}/looper-handler-api-part-2/){:.blue}
- [Looper/Handler API - Part 3]({{site.url}}/looper-handler-api-part-3/){:.blue}
- [Looper/Handler API - Part 4]({{site.url}}/looper-handler-api-part-4/){:.blue}

## Background

In Android, thread communication is trivial unless it involves **UI thread**. Care must be taken when communicating with UI thread, because blocking UI thread can effect you user's experience badly.

Many high level threading APIs in java are not well suited for communication with UI thread because of their blocking nature. e.g. `BlockingQueue`. To overcome these issues, Android has come up with it's own message passing mechanism. 

Looper/Handler API in Android is specific implementation of Consumer-Producer problem (also known as bounded-buffer) in which **Producer** never blocks. The producer puts the tasks in the queue and consumer consumes them on appropriate time.

## Classes

### Looper

Looper associates a [Message Queue](https://developer.android.com/reference/android/os/MessageQueue.html){:. blue} with the thread. Later, this queue will  be utilized by [Handler](https://developer.android.com/reference/android/os/Handler.html){:. blue} and [Looper](https://developer.android.com/reference/android/os/Looper.html){: .blue}

### Handler

[Handler](https://developer.android.com/reference/android/os/Handler.html){:. blue} is a two way interface. In producer thread, it inserts messages in the queue while in consumer thread it consumes those messages.

### Message Queue

[Message Queue](https://developer.android.com/reference/android/os/MessageQueue.html){:. blue} is an unbounded linked list attached with looper. It contains object of type [Message](https://developer.android.com/reference/android/os/Message.html){:.blue }. Looper will loop through this queue and pass messages to handler.

### Message

[Message](https://developer.android.com/reference/android/os/Message.html){:.blue } defines a message containing a description and arbitrary data object that can be sent to a [Handler](https://developer.android.com/reference/android/os/Handler.html){:. blue}.

## Relationship


<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="443px" version="1.1" content="&lt;mxfile userAgent=&quot;Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2979.2 Safari/537.36&quot; version=&quot;6.0.2.8&quot; editor=&quot;www.draw.io&quot; type=&quot;google&quot;&gt;&lt;diagram name=&quot;Page-1&quot;&gt;5VlBk5owGP01zmw7sx2SAOKxWlsP3UPHQ9tjhnxC2kCYGFbtr29YgohRa2d0cdaLQ15CEt57PD5wQCbZ+ouiRfokGYgB9th6QD4NMI6G2PxWwKYG/OGoBhLFWQ2hFpjzP2BBz6IlZ7DsDNRSCs2LLhjLPIdYdzCqlFx1hy2k6K5a0AQcYB5T4aLfOdOpvazAa/EZ8CRtVkae7cloM9gCy5QyudqByHRAJkpKXR9l6wmIiruGl/q8z0d6txtTkOtzTggYQwt/5BPsh3iI4dHO8ExFaS92RnMmQNn96k1DwirlGuYFjav2yug8IONUZ8K0kDm084DSsD66ObS9ZGMVkBlotTFD7Ak4sixZmzTNVcs5aohMd/gOLUatzMl25pYJc2DJOJMY7BDzVcriJnjplxjfYQCYuVtsUyqdykTmVExbdKxkmTOoZvS67BgG1OZHhX8ImuZPO+wXaL2xYUBLLQ3Uzl6J0WG42sRpfs2eZaliOH0naKoS0KdM4eqkQFDNn7vrX5T0wHHjg1lm8v6dI4axme5yvNRK/oaJFFIZJJd5pciCC7EHUcGT3DRjQ5vxORlXpuUmBT/ajowz9iLnIcsvBC9m1/M8ClzP+wcsj69h+fAw+wZCdyMA7lOAyBHgCZbL6qmNvW8lGLD/VPZ7TeXRG01lfEYqR32lclOf3lcwjLq+J30GA3Lr1/tTwO9VAbdQ1qkCyv43ki9MUujdUtGMyCXz+QYzGPVWGiP/DiPAR/929+tFwJG3kzetQBDckgLuG8q2QO69MA77Td7hJZP3hirj6JxUDntLZfeV7cGrM+ENf7TYK8zCVyzMzOKYRCRGgR8DDNkjucNQ3hcguJ4Aptl+tn/p2/nvg0z/Ag==&lt;/diagram&gt;&lt;/mxfile&gt;" onclick="(function(svg){var src=window.event.target||window.event.srcElement;while (src!=null&amp;&amp;src.nodeName.toLowerCase()!='a'){src=src.parentNode;}if(src==null){if(svg.wnd!=null&amp;&amp;!svg.wnd.closed){svg.wnd.focus();}else{var r=function(evt){if(evt.data=='ready'&amp;&amp;evt.source==svg.wnd){svg.wnd.postMessage(decodeURIComponent(svg.getAttribute('content')),'*');window.removeEventListener('message',r);}};window.addEventListener('message',r);svg.wnd=window.open('https://www.draw.io/?client=1&amp;lightbox=1&amp;chrome=0&amp;edit=_blank');}}})(this);" viewBox="0 0 443 663" style="cursor:pointer;max-width:100%;max-height:663px;"><defs/><g transform="translate(0.5,0.5)"><rect x="1" y="1" width="120" height="60" fill="#ffffff" stroke="#000000" pointer-events="none"/><g transform="translate(38.5,24.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="44" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 45px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">Handler</div></div></foreignObject><text x="22" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">Handler</text></switch></g><rect x="1" y="201" width="120" height="60" fill="#ffffff" stroke="#000000" pointer-events="none"/><g transform="translate(41.5,224.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="39" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 40px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">Looper</div></div></foreignObject><text x="20" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">Looper</text></switch></g><path d="M 61 61 L 61 194.63" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 61 199.88 L 57.5 192.88 L 61 194.63 L 64.5 192.88 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><g transform="translate(9.5,74.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="23" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 24px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">(1,*)</div></div></foreignObject><text x="12" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">(1,*)</text></switch></g><g transform="translate(6.5,174.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="28" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 29px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">(1, 1)</div></div></foreignObject><text x="14" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">(1, 1)</text></switch></g><rect x="1" y="401" width="120" height="60" fill="#ffffff" stroke="#000000" pointer-events="none"/><g transform="translate(15.5,424.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="90" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 91px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">Message Queue</div></div></foreignObject><text x="45" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">Message Queue</text></switch></g><path d="M 61 261 L 61 394.63" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 61 399.88 L 57.5 392.88 L 61 394.63 L 64.5 392.88 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><g transform="translate(16.5,274.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="28" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 29px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">(1, 1)</div></div></foreignObject><text x="14" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">(1, 1)</text></switch></g><g transform="translate(16.5,374.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="28" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 29px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">(1, 1)</div></div></foreignObject><text x="14" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">(1, 1)</text></switch></g><rect x="321" y="201" width="120" height="60" fill="#ffffff" stroke="#000000" transform="translate(381,0)scale(-1,1)translate(-381,0)" pointer-events="none"/><g transform="translate(363.5,224.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="35" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 36px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">thread</div></div></foreignObject><text x="18" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">thread</text></switch></g><path d="M 121 231 L 314.63 231" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 319.88 231 L 312.88 234.5 L 314.63 231 L 312.88 227.5 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><g transform="translate(136.5,204.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="28" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 29px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">(1, 1)</div></div></foreignObject><text x="14" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">(1, 1)</text></switch></g><g transform="translate(276.5,204.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="28" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 29px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">(1, 1)</div></div></foreignObject><text x="14" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">(1, 1)</text></switch></g><rect x="1" y="601" width="120" height="60" fill="#ffffff" stroke="#000000" pointer-events="none"/><g transform="translate(35.5,624.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="50" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 51px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">Message</div></div></foreignObject><text x="25" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">Message</text></switch></g><path d="M 61 461 L 61 594.63" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 61 599.88 L 57.5 592.88 L 61 594.63 L 64.5 592.88 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><g transform="translate(17.5,574.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="26" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 27px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">(0, *)</div></div></foreignObject><text x="13" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">(0, *)</text></switch></g><g transform="translate(16.5,474.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="28" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 29px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">(1, 1)</div></div></foreignObject><text x="14" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">(1, 1)</text></switch></g></g></svg>

## Example

Just to understand how every component fits together, let's write a simple app which does a long running operation when a button is
clicked.

We will write a `Worker Thread` which will do some long running operation in background when a message is received. On the main thread,
we will add message to the `MessageQueue` using handler.

I am writing code for this example here. In [next]({{site.url}}/looper-handler-api-part-2/){:.blue} article I will explain how it works.
{:.notice}

**Worker Thread**

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

**Main/Launcher Activity**

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

**MainActivity Layout**

{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/activity_main"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context="com.mallaudin.handlers.ui.MainActivity">

    <include layout="@layout/toolbar_layout" />

    <Button
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerInParent="true"
        android:onClick="onDoWork"
        android:text="@string/do_work"/>

</RelativeLayout>

{% endhighlight %}

**Output** (after clicking `Do Something` button many times, Log message are specially crafted for this example, see source code for better understanding)

{% highlight text %}
D/handlerapp: class[MainActivity] -> onStart()
D/handlerapp: class[MainActivity] -> onDoWork -> seding [44]
D/handlerapp: class[WorkerThread] -> handleMessage -> sleeping for [1963 ms]
D/handlerapp: class[MainActivity] -> onDoWork -> seding [8]
D/handlerapp: class[MainActivity] -> onDoWork -> seding [22]
D/handlerapp: class[MainActivity] -> onDoWork -> seding [36]
D/handlerapp: class[MainActivity] -> onDoWork -> seding [70]
D/handlerapp: class[MainActivity] -> onDoWork -> seding [89]
D/handlerapp: class[WorkerThread] -> handleMessage -> what[44], thread[WorkerThread]
D/handlerapp: class[WorkerThread] -> handleMessage -> sleeping for [227 ms]
D/handlerapp: class[WorkerThread] -> handleMessage -> what[8], thread[WorkerThread]
D/handlerapp: class[WorkerThread] -> handleMessage -> sleeping for [1935 ms]
D/handlerapp: class[WorkerThread] -> handleMessage -> what[22], thread[WorkerThread]
D/handlerapp: class[WorkerThread] -> handleMessage -> sleeping for [1339 ms]
D/handlerapp: class[WorkerThread] -> handleMessage -> what[36], thread[WorkerThread]
D/handlerapp: class[WorkerThread] -> handleMessage -> sleeping for [542 ms]
D/handlerapp: class[WorkerThread] -> handleMessage -> what[70], thread[WorkerThread]
D/handlerapp: class[WorkerThread] -> handleMessage -> sleeping for [1255 ms]
D/handlerapp: class[WorkerThread] -> handleMessage -> what[89], thread[WorkerThread]
D/handlerapp: class[MainActivity] -> onStop()
D/handlerapp: class[MainActivity] -> onStop -> quit looper.
D/handlerapp: class[WorkerThread] -> run -> terminating worker thread.
D/handlerapp: class[MainActivity] -> onStart()
D/handlerapp: class[MainActivity] -> onStop()
D/handlerapp: class[MainActivity] -> onStop -> quit looper.
D/handlerapp: class[WorkerThread] -> run -> terminating worker thread.
{% endhighlight %}

Please don't use this code in production, it is not thread safe, I have written here just give you an idea about how it works.
{:.notice}
<div markdown="0"><a href="https://github.com/allaudin/handlers" class="btn">Download Source Code</a></div>
