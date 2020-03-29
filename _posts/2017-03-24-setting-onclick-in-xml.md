---
layout: post
title: Setting onClick listener in XML layouts
modified: 24-Mar-2017 (22:22)
category: android
tags: [best-practices]
comments: true
date: 2017-03-24
deprecated: true
---

> Working on code written by other programmers is a **nightmare** if it is not expressive and for every update you need to look around and start
> finding where the actual components are.

I work on a similar kind of code nowadays and every time I come across a situation where I need to look for `onClick` listeners, I promise myself
to write an article about it and fortunately today, I have some spare time to write about it.

## Be consistent

While setting `onClick` listeners in `XML layouts` is not inherently bad, it's not good either. Whenever I talk to my friends or other developers
I work with, I tell them to be **consistent** and follow the same approach for whole project. If at the start of project you have decided to
go on with setting `onClicks` in `XML layouts`; then for every single view that you need, write click listener in `XML` - for every single
 view which needs it - for every single ...

## Choose wisely

Writing `onClick` listeners in `XML` is relatively easy, you don't need to fetch the view by ID and android studio will implement the
method for you. This approach is not bad if you are writing a test project or demo where you quickly want to add click listeners and there are
few views which need to be clickable. Say, I have an activity which has *two* buttons - start and end. I write `onClicks` in `XML` and it's easy
for me to find out where those two methods are in the class because there are just two.

{% highlight xml %}
        <Button
                android:id="@+id/startButton"
                android:layout_width="180dp"
                android:layout_height="40dp"
                android:layout_alignParentTop="true"
                android:layout_centerHorizontal="true"
                android:gravity="center"
                android:onClick="onStartClick"
                android:text="@string/start"
                android:textColor="@color/white"
                android:textSize="22sp"
                android:textStyle="bold" />

        <Button
                android:id="@+id/endButton"
                android:layout_width="180dp"
                android:layout_height="40dp"
                android:layout_alignParentTop="true"
                android:layout_centerHorizontal="true"
                android:gravity="center"
                android:onClick="onEndClick"
                android:text="@string/end"
                android:textColor="@color/white"
                android:textSize="22sp"
                android:textStyle="bold" />

{% endhighlight %}
{% highlight java %}
public void onStartClick(View view){
    // do something
}

public void onEndClick(View view){
    // do something
}
{% endhighlight %}


**For a relatively large project, this is not a suitable choice.** We often have more clickable views and most of the time we need reference
to them too, more realistically you will have to find the view in the activity to use it. Why not create a single `onClick` listener for all
views and then call separate function by matching IDs? In this way, all our `onClicks` routes through a single function and it's really
easy for developers to find whatever click listener they need **instead of going through XML for each view for just finding the name
of click listener**.

For same above mentioned layout, click listeners can be set as

{% highlight java %}

public void onClick(View view){
    switch(view.getId()){

        case R.id.startButton: {
            // do something
            break;
        }

        case R.id.endButton: {
            // do something
            break;
        }
    } // switch
}

{% endhighlight %}


> Compare to previous example, it looks more clean and expressive. In previous example, you can't figure out the views for which the
> click listeners are set without going through xml first. With this approach, it clear in first look - the view IDs for which these
> listeners work.

Another approach being used by many developers is *setting separate click listeners for all of the views in a single layout*. While it works
similar to previously discussed approaches with one drawback; it pollutes the code with so many anonymous classes and any wise developer will
avoid it.

