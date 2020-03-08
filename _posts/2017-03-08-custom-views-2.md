---
layout: post
title: Custom Views - II
modified: 08-Mar-2017 (20:25)
category: android
comments: true
date: 2017-03-08
tags:
- android
- views
link1: "https://allaudin.github.io/custom-views-1/"
link2: "https://allaudin.github.io/custom-views-2/"
link3: "https://allaudin.github.io/custom-views-3/"
---

{% include toc.html %}

last modified: {{ page.modified | downcase }} 
{: .last_modified }

This is part 1 of three part series

- [Part 1]({{page.link1}}){:.blue}
- [Part 2]({{page.link2}}){:.blue}
- [Part 3]({{page.link3}}){:.blue}

In [part 1]({{page.link1}}){:.blue}, I have discussed core view classes and view types of view constructor. This article focuses on view drawing in its
layout in parent view.

At high level, a view is created in **two** phases.

1. Layout Phase
2. Drawing Phase


## Layout Phase

In layout phase, view parent determines the **size** and **layout** of a view, it calculates the size of view and place for laying out view.
Layout phase is completed in 2 passes.

- Measure Pass
- Layout Pass


### Measure Pass

In measure pass, size of a view is calculated (*when it wants to know how big a view can be*). It starts when a view parent calls

{% highlight java %}
measure(int widthMeasureSpec, int heightMeasureSpec)
{% endhighlight %}

method of view with appropriate `MeasureSpecs`. This method does some work and calls

{% highlight java %}
    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }
{% endhighlight %}

in custom view.

#### MeasureSpecs

Parameters passed to `onMeasure(...)` are special parameters. They have `integer` type but they are actually two parameters encoded
 in a single integer. Each parameter has a **mode** and **size** value and these values can be retrieved by passing it
 to `MeasureSpec.getMode(int)` and `MeasureSpec.getSize(int)`.
 
 {% highlight java %}
     @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);

        // decode width values
        int modeWidth = MeasureSpec.getMode(widthMeasureSpec);
        int sizeWidth = MeasureSpec.getSize(widthMeasureSpec);

        // decode width values
        int modeHeight = MeasureSpec.getMode(heightMeasureSpec);
        int sizeHeight = MeasureSpec.getSize(heightMeasureSpec);
    }

 {% endhighlight %}

#### MeasureSpecs Modes

Mode gives you a clue about how big a view should be. Mode can be one of the following

{% highlight java %}
  MeasureSpec.AT_MOST
  MeasureSpec.EXACTLY
  MeasureSpec.UNSPECIFIED
{% endhighlight %}

#### MeasureSpec.EXACTLY

This mode tells that parent has measure the size of child view and view should have this size. `onMeasure` is called with this mode
when view is specified in `xml` with size equals to `match_parent` or exact size in dps e.g. 40dp.

{% highlight java %}
if(MeasureSpec.getMode(widthMeasureSpec) == MeasureSpec.EXACTLY) {
    // do something
}
{% endhighlight %}

#### MeasureSpec.AT_MOST

`onMeasure` is called with his mode bit if view is specified in `xml` with size equals to `wrap_content`. With this mode bit, android tells that
I have this size and you can draw your view *with in this size*.

{% highlight java %}
if(MeasureSpec.getMode(widthMeasureSpec) == MeasureSpec.AT_MOST) {
    // do something
}
{% endhighlight %}

### MeasureSpec.UNSPECIFIED

This mode is used when android system wants to query how big this view can be. It's our responsibliy to provide the system with appropriate size.

{% highlight java %}
if(MeasureSpec.getMode(widthMeasureSpec) == MeasureSpec.UNSPECIFIED) {
    // do something
}
{% endhighlight %}

### Setting size in `onMeasure(...)`

In measure pass, after calling `onMeasure`, parent views expects us to set the size of view using 

{% highlight java %}
setMeasuredDimension(width, height);
{% endhighlight %}

After calculating size (based on mode bit or any other logic) you must pass this size to parent using above method, failing to call
this method will trigger `IllegalStateException` at runtime.

{% highlight java %}
  java.lang.IllegalStateException: View with id -1: io.github.allaudin.customviews.MyView#onMeasure() did not set the measured dimension by calling setMeasuredDimension()
{% endhighlight %}


### Default implementation of `onMeasure()`

The default implementation of `onMeasure` calls `setMeasuredDimension` by getting width and height from `getSuggestedMinimumWidth()`
and `getSuggestedMinimumHeight()`.

{% highlight java %}
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        setMeasuredDimension(getDefaultSize(getSuggestedMinimumWidth(), widthMeasureSpec),
                getDefaultSize(getSuggestedMinimumHeight(), heightMeasureSpec));
    }

       public static int getDefaultSize(int size, int measureSpec) {
        int result = size;
        int specMode = MeasureSpec.getMode(measureSpec);
        int specSize = MeasureSpec.getSize(measureSpec);

        switch (specMode) {
        case MeasureSpec.UNSPECIFIED:
            result = size;
            break;
        case MeasureSpec.AT_MOST:
        case MeasureSpec.EXACTLY:
            result = specSize;
            break;
        }
        return result;
    }

{% endhighlight %}

Note that `getDefaultSize` returns the same size for both `MeasureSpec.AT_MOST` and `MeasureSpec.EXACTLY`.

## Layout Pass

Layout pass sets the size of view by using dimensions set in `onMeasure`. This pass is started when parent view calls `layout(...)` method
of view followed by calling `onLayout(...)` in derived view.

{% highlight java %}
public void layout(int left, int top, int right, int bottom)
{% endhighlight %}

{% highlight java %}
  @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        super.onLayout(changed, left, top, right, bottom);
    }

{% endhighlight %}

After setting the size on view, it calls `onSizeChanged(..)` if the size of view is changed.

{% highlight java %}
 @Override
    protected void onSizeChanged(int width, int height, int oldWidth, int oldWidth) {
        super.onSizeChanged(width, height, oldWidth, oldWidth);
    }
{% endhighlight %}

Default implementation of both `onSizeChanged` and `onLayout` is no-op.

Read part 3 [here]({{page.link3}}){:.blue}.
