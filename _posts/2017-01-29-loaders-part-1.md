---
layout: post
title: Getting familiar with Loaders - Part 1
modified: 30-Jan-2017 (22:33)
category: android
comments: true
date: 2017-01-29
tags: [android, loaders]
---

{% include toc.html %}

last modified: {{ page.modified | downcase }} 
{: .last_modified }

This is part 1 of **Loaders** article series

- [Getting familiar with Loaders - Part 1]({{site.url}}/loaders-part-1){:.blue}
- [Getting familiar with Loaders - Part 2]({{site.url}}/loaders-part-2){:.blue}

## Why Loaders?

- Loaders load data on background thread and make it available on main thread. Cool?
- Loaders cache the result and redeliver it on successive calls for speed and efficency. Great!
- As loaders are managed on application level, the data is available across the application and activity restarts. Developers control the initialization and destroying of loaders. Awesome!
- Loaders can monitor the source of data and can deliver the updated result when necessary.

If you do not get something at this point, don't worry. I will explain each of them with example. 

## Loaders API

- [Loader](https://developer.android.com/reference/android/content/Loader.html){:.blue}  

   An abstract class that performs asynchronous loading of data.

- [Loader Manager](https://developer.android.com/reference/android/app/LoaderManager.html){: .blue}

   Manages async loading of data.

- [Loader Callback](https://developer.android.com/reference/android/app/loaderManager.LoaderCallbacks.html){: .blue}  

	Callbacks for handling data.

- [AsyncTask Loader](https://developer.android.com/reference/android/content/AsyncTaskLoader.html){: .blue}	

	Implementation of loader which uses async task to load data in background.

- [Cursor Loader](https://developer.android.com/reference/android/content/CursorLoader.html){: .blue }	

	Sub class of AsynTask loader. It handles quering on background thread.

## Loader&lt;D&gt;

[Loader](https://developer.android.com/reference/android/content/Loader.html){:.blue} is a class that performs async loading of data. There are a couple of important methods in this class, which you need to get familiar with. Before talking about methods, note this point from docs

> Note on threading: Clients of loaders should as a rule perform any calls on to a Loader from the main 
> thread of their process (that is, the thread the Activity callbacks and other things occur on). 
> Subclasses of Loader (such as AsyncTaskLoader) will often perform their work in a separate thread, but
> when delivering their results this too should be done on the main thread.

Basically, there are *5* important methods in this  class. I will explaing them one by one

- [onStartLoading]({{site.url}}#onstartloading)
- [onStopLoading]({{site.url}}#onstoploading)
- [onForceLoad]({{site.url}}#onforceload)
- [onReset]({{site.url}}#onreset)
- [onCancelLoad]({{site.url}}#oncancelload)

### onStartLoading

[onStartLoading](https://developer.android.com/reference/android/content/Loader.html#onStartLoading()){:.blue} starts loading of async data in background. It is called automatically by [Loader Manager](https://developer.android.com/reference/android/app/LoaderManager.html){: .blue} and **you are not supposed to call it directly**, otherwise you will conflict with loaders internal state. 

Behind the scene, Loader manager calls [startLoading](https://developer.android.com/reference/android/content/Loader.html#startLoading()){:.blue} which updates loader's internal state and calls 
onStartLoading. Loader's state is updated so that [isStarted](https://developer.android.com/reference/android/content/Loader.html#isStarted()){: .blue} and 
[isReset()](https://developer.android.com/reference/android/content/Loader.html#isReset()){:.blue} will return the correct values. 

startLoading method code from android source

{% highlight java %}
  public final void startLoading() {
        mStarted = true;
        mReset = false;
        mAbandoned = false;
        onStartLoading();
  }
{% endhighlight %}

### onStopLoading

[onStopLoading](https://developer.android.com/reference/android/content/Loader.html#onStopLoading()){:.blue}
 is called by [Loader Manager](https://developer.android.com/reference/android/app/LoaderManager.html){: .blue} when an activity or fragment stops. At this stags, loader can continue loading data in background but **it should not deliver updates to the client**. It also updates loader's internal state so that [isStarted](https://developer.android.com/reference/android/content/Loader.html#isStarted()){: .blue} will return the correct value.

stopLoading method code from android source

{% highlight java %}
 public void stopLoading() {
        mStarted = false;
        onStopLoading();
}
{% endhighlight %}

### onForceLoad

[onForceLoad](https://developer.android.com/reference/android/content/Loader.html#onForceLoad()){:.blue} 
is invoked by [forceLoad](https://developer.android.com/reference/android/content/Loader.html#forceLoad()){:.blue} when a force load is requested. It is like clearing the cache and requesting new data.

### onReset

[onReset](https://developer.android.com/reference/android/content/Loader.html#onReset()){:.blue} is called automatically by [Loader Manager](https://developer.android.com/reference/android/app/LoaderManager.html){: .blue} when destroying loader. At this stage, you should free any resource related to this loader since it many never be called again. Before calling this method, loader resets all flags (internal state) so that 
[isStarted](https://developer.android.com/reference/android/content/Loader.html#isStarted()){: .blue} and 
[isReset()](https://developer.android.com/reference/android/content/Loader.html#isReset()){:.blue} will return the correct values.

reset method code from android source

{% highlight java %}
    public void reset() {
        onReset();
        mReset = true;
        mStarted = false;
        mAbandoned = false;
        mContentChanged = false;
        mProcessingChange = false;
    }
{% endhighlight %}

### onCancelLoad

[onCancelLoad](https://developer.android.com/reference/android/content/Loader.html#onCancelLoad()){:.blue} is called by Loader Manager when there is a request to cancel the load. It does not cancel the task immidiately, if a task is in progress, it waits for the task to complete and calls 
`OnLoadCanceledListener` when task completes. 

If the task is already completed or `startLoading` hasn't been called, this method will return false.

## LoaderManager

A loader manager manages the loaders and can be accessed application wide. There are two methods for getting loader manager in an activity/fragment.

{% highlight java %}

LoaderManager getLoaderManager()
// android.support.v4
LoaderManager getSupportLoaderManager();

{% endhighlight %}

Loader manager provides API for initializing, stopping and destroying loaders.

{% highlight java %}

// initialize loader
Loader<D> initLoader(int id, Bundle args, LoaderManager.LoaderCallbacks<D> callback)
// restart loader
Loader<D> restartLoader(int id,Bundle args, LoaderManager.LoaderCallbacks<D> callback) 
// get loader with ID
Loader<D> getLoader(int id); 
// destroy loader with ID
void destroyLoader(int id); 

{% endhighlight %}

## initLoader

From [docs](https://developer.android.com/reference/android/app/LoaderManager.html#initLoader(int, android.os.Bundle, android.app.LoaderManager.LoaderCallbacks<D>)){:.blue}

>Ensures a loader is initialized and active. If the loader doesn't already exist, one is created and (if 
>the activity/fragment is currently started) starts the loader. Otherwise the last created loader is 
>re-used.
>In either case, the given callback is associated with the loader, and will be called as the loader 
>state changes. If at the point of call the caller is in its started state, and the requested loader 
>already exists and has generated its data, then callback onLoadFinished(Loader, D) will be called 
>immediately (inside of this function), so you must be prepared for this to happen.


## restartLoader

From [docs](https://developer.android.com/reference/android/app/LoaderManager.html#restartLoader(int, android.os.Bundle, android.app.LoaderManager.LoaderCallbacks<D>)){:.blue}

>Starts a new or restarts an existing Loader in this manager, registers the callbacks to it, and (if the
> activity/fragment is currently started) starts loading it. If a loader with the same id has previously 
>been started it will automatically be destroyed when the new loader completes its work. The callback 
>will be delivered before the old loader is destroyed.

## destroyLoader

From [docs](https://developer.android.com/reference/android/app/LoaderManager.html#destroyLoader(int)){:.blue}

>Stops and removes the loader with the given ID. If this loader had previously reported data to the 
>client through onLoadFinished(Loader, Object), a call will be made to onLoaderReset(Loader).

## getLoader

> Returns the Loader with the given id or null if no matching Loader is found.

## LoaderManager Callbacks

A loader manager interacts with client through [this](https://developer.android.com/reference/android/app/LoaderManager.LoaderCallbacks.html){:.blue} callback. It has 3 methods

- onCreateLoader(int id, Bundle args)

Instantiate and return a new Loader for the given ID.

- onLoadFinished(Loader<D> loader, D data) 

Called when a previously created loader has finished its load. 

- onLoaderReset(Loader<D> loader)

Called when a previously created loader is being reset, and thus making its data unavailable. The application should at this point remove any references it has to the Loader's data.


Next I will discuss loaders lifecycle in detail. Read it [here]({{site.url}}/loaders-part-2){:.blue}



