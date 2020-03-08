---
layout: post
title: Setting typeface effectively
modified: 18-Mar-2017 (21:23)
category: android
comments: true
tags: [performance]
date: 2017-03-18
source_code: "https://github.com/allaudin/fontperformancetest"
---

{% include toc.html %}

last modified: {{ page.modified | downcase }} 
{: .last_modified }

## Background

While I know setting `typeface` on a `TextView` is not a big deal but setting it in a wrong can effect the performance of your app badly. First
approach that is being used by many developers is calling `setTypeface` on `TextView` when it is created e.g.

{% highlight java %}
 TextView robotoBoldTv = new TextView(this);
 robotoBoldTv.setTypeface(Typeface.createFromAsset(getAssets(), "Roboto-Bold.tff"));
{% endhighlight %}

While this is a nice approach if you **only** need to set typeface on a single `TextView` which is rare.

If you need to use the same view throughout the app, a nice approach would be to extend the `TextView` and set the typeface there. With this
approach you get maximum flexibility - you can change or update font any time without going through the hassle of setting it individually
on every view throughout the app.

{% highlight java %}
public class BoldTextView extends TextView {

    public BoldTextView(Context context) {
        super(context);
        init(context);
    }

    public BoldTextView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init(context);
    }

    public BoldTextView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context);
    }

    private void init(Context context) {
        setTypeface(Typeface.createFromAsset(context.getAssets(), "Roboto-Bold.tff"));
    }

    @Override
    public boolean isInEditMode() {
        return true;
    }
}

{% endhighlight %}


## Performance

{% highlight text %}
    All the tests in this article are executed on Nexus 5.
{% endhighlight %}

While setting typeface by extending `TextView` gives us flexibility but performace wise it is same as setting it on individual text views i.e.
`setTypeface` is called for every `TextView` **and typeface is created from assets for every `TextView`**. With this you can guess that
`createFromAsset` is called from **every view**.

If you a few custom typefaced views in your layout, performance is negligible but as soon as the number of views grow, performance becomes an
issue. **The method which creates typeface from assets is time expensive**. To clear my doubt, I tried to log the time of creating typeface
from assets.

I have *three* robot fonts (bold, light, regular) in my assets directory and I use all three in my layouts. Here is the time `createFromAssets`
takes to load font from assets.

{% highlight text %}

TypefaceHelper -> creating roboto regular from assets.
TypefaceHelper -> time: [5017656ns] [5.018ms]
TypefaceHelper -> creating roboto bold from assets.
TypefaceHelper -> time: [3922031ns] [3.922ms]
TypefaceHelper -> creating roboto light from assets.
TypefaceHelper -> time: [3893282ns] [3.893ms]

{% endhighlight %}

> 5 ms is not bad if there is only one view otherwise time will increase linearly with views - more typefaced views, more time.

## A better approach

To avoid creating typefaces every time, a better approach would be to create a singleton typeface helper which caches the generated typefaces and
pass it to views whenever needed.

Here is a simple helper class.

{% highlight java %}
class TypefaceHelper {

    private static final TypefaceHelper mInstance = new TypefaceHelper();

    private Typeface mRobotoBold;
    private Typeface mRobotoLight;
    private Typeface mRobotoRegular;

    private TypefaceHelper() {
    }

    static TypefaceHelper getInstance() {
        return mInstance;
    } // getInstance

    Typeface getRobotoLight(Context context) {
        if (mRobotoLight == null) {
            mRobotoLight = Typeface.createFromAsset(context.getAssets(), "Roboto-Light.ttf");
        }
        return mRobotoLight;
    } // getRobotoLight

    Typeface getRobotoBold(Context context) {
        if (mRobotoBold == null) {

            mRobotoBold = Typeface.createFromAsset(context.getAssets(), "Roboto-Bold.ttf");
        }
        return mRobotoBold;
    } // getRobotoBold

    Typeface getRobotoRegular(Context context) {

        if (mRobotoRegular == null) {
            mRobotoRegular = Typeface.createFromAsset(context.getAssets(), "Roboto-Regular.ttf");
        }

        return mRobotoRegular;
    } // getRobotoRegular

} // TypefaceHelper
{% endhighlight %}

**Usage**

{% highlight java %}
public class BoldTextView extends TextView {

    public BoldTextView(Context context) {
        super(context);
        init(context);
    }

    public BoldTextView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init(context);
    }

    public BoldTextView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context);
    }

    private void init(Context context) {
        // new typeface helper to return cached typeface if it is already generated.
        setTypeface(TypefaceHelper.getInstance().getRobotoBold(context));
    }

    @Override
    public boolean isInEditMode() {
        return true;
    }
}
{% endhighlight %}

## Performance measuring

In order to test it, create **three** custom `TextView`s and use them in a simple layout. In my layout, I have used them `28` times
just to compare performance better (with more time, it is easy to compare).

- BoldTextView (uses roboto bold font)

- LightTextView (uses roboto light font)

- RegularTextView (uses roboto regular font)

All text views are same (with different font) as `BoldTextView` in the above example.

**activity_main.xml**

{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
<ScrollView
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/activity_main"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:paddingBottom="@dimen/activity_vertical_margin"
    android:paddingLeft="@dimen/activity_horizontal_margin"
    android:paddingRight="@dimen/activity_horizontal_margin"
    android:paddingTop="@dimen/activity_vertical_margin"
    tools:context="io.github.allaudin.fonts.MainActivity">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical">

        <io.github.allaudin.fonts.tvs.RegularTextView
            style="@style/TextViewStyle"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="@string/regular"/>

        <io.github.allaudin.fonts.tvs.BoldTextView
            style="@style/TextViewStyle"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="@string/bold"/>

        <io.github.allaudin.fonts.tvs.LightTextView
            style="@style/TextViewStyle"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="@string/thin"/>

        <TextView
            style="@style/TextViewStyle"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="@string/simple_text_view"/>
           .
           .
           .
           .
        <io.github.allaudin.fonts.tvs.LightTextView
            style="@style/TextViewStyle"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="@string/thin"/>

        <TextView
            style="@style/TextViewStyle"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="@string/simple_text_view"/>

    </LinearLayout>


</ScrollView>

{% endhighlight %}

### Without caching fonts

Starting the activity `15` times **without caching the fonts** results in *average* start time of **+232.6ms**.

{% highlight text %}
I/ActivityManager: ... io.github. ... .fonts.MainActivity: +227ms
I/ActivityManager: ... io.github. ... .fonts.MainActivity: +228ms
I/ActivityManager: ... io.github. ... .fonts.MainActivity: +244ms
I/ActivityManager: ... io.github. ... .fonts.MainActivity: +225ms
I/ActivityManager: ... io.github. ... .fonts.MainActivity: +199ms
I/ActivityManager: ... io.github. ... .fonts.MainActivity: +237ms
I/ActivityManager: ... io.github. ... .fonts.MainActivity: +219ms
I/ActivityManager: ... io.github. ... .fonts.MainActivity: +218ms
I/ActivityManager: ... io.github. ... .fonts.MainActivity: +222ms
I/ActivityManager: ... io.github. ... .fonts.MainActivity: +230ms
I/ActivityManager: ... io.github. ... .fonts.MainActivity: +227ms
I/ActivityManager: ... io.github. ... .fonts.MainActivity: +240ms
I/ActivityManager: ... io.github. ... .fonts.MainActivity: +247ms
I/ActivityManager: ... io.github. ... .fonts.MainActivity: +313ms
I/ActivityManager: ... io.github. ... .fonts.MainActivity: +213ms
{% endhighlight %}

### With caching fonts

Starting the activity `15` times **with caching the fonts** results in *average* start time of **+116.2ms**.

{% highlight text %}
I/ActivityManager: ... io.github. ... .MainActivity: +139ms
I/ActivityManager: ... io.github. ... .MainActivity: +124ms
I/ActivityManager: ... io.github. ... .MainActivity: +110ms
I/ActivityManager: ... io.github. ... .MainActivity: +141ms
I/ActivityManager: ... io.github. ... .MainActivity: +116ms
I/ActivityManager: ... io.github. ... .MainActivity: +112ms
I/ActivityManager: ... io.github. ... .MainActivity: +113ms
I/ActivityManager: ... io.github. ... .MainActivity: +96ms
I/ActivityManager: ... io.github. ... .MainActivity: +98ms
I/ActivityManager: ... io.github. ... .MainActivity: +110ms
I/ActivityManager: ... io.github. ... .MainActivity: +117ms
I/ActivityManager: ... io.github. ... .MainActivity: +96ms
I/ActivityManager: ... io.github. ... .MainActivity: +114ms
I/ActivityManager: ... io.github. ... .MainActivity: +118ms
I/ActivityManager: ... io.github. ... .MainActivity: +140ms
{% endhighlight %}

## Results

> **100%** performance is gained from **non-cached 232ms** start time to **cached 116ms** start time.

Regardless of these **approximate** results, you always get performance gain when fonts are cached.

> Please note that these results are not 100% correct i.e. you don't always get a 100% performance gain. These results are approximate,
> calculated just to show **there is a performance gain**.

## Source Code

Source code for this article is available on [github]({{page.source_code}}){:.blue} .