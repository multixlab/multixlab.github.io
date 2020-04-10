---
layout: post
title: Custom Views - I
modified: 07-Mar-2017 (19:59)
category: android
comments: true
date: 2017-03-07
tags:
- android
- views
link1: "/custom-views-1/"
link2: "/custom-views-2/"
link3: "/custom-views-3/"
view: "https://developer.android.com/reference/android/view/View.html"
viewparent: "https://developer.android.com/reference/android/view/ViewParent.html"
viewgroup: "https://developer.android.com/reference/android/view/ViewGroup.html"
const_3: "https://developer.android.com/reference/android/view/View.html#View(android.content.Context, android.util.AttributeSet, int)"
style_const: "https://developer.android.com/reference/android/view/View.html#View(android.content.Context, android.util.AttributeSet, int, int)"
---

This is part 1 of two part series

- [Part 1]({{site.url}}{{page.link1}}){:.blue}
- [Part 2]({{site.url}}{{page.link2}}){:.blue}



## Background

I am a kind of guy who hates UI designing and layouts but when it becomes my responsibility to draw them, I make sure I understand them well. I
have been observing that whenever we need some control which is not part of android default UI components, we need to add another
library to handle it - sometime, a poorly written library.

Getting tired from all this, I decided to go a bit deeper and search about the views. This series of articles will explain most of the things that
a developer should know before drawing their own views or custom controls.

## Views API

View API contains **three** main classes

- View
- ViewParent (Interface)
- ViewGroup
- ViewRootImpl (internal implementation - not a public API)

## View

A [View]({{page.view}}){:.blue} is the basic building block of user interface in android and every layout component is derived from the
[View]({{page.view}}){:.blue} class. e.g. TextView, EditText etc.

## View Parent

[View Parent]({{page.viewparent}}){:.blue} is an interface which defines a protocol for a view who wants to be the parent of other views. Both
`ViewGroup` and `ViewRootImpl` implement `ViewParent` interface.

## View Group

[ViewGroup]({{page.viewgroup}}){:.blue} is a **special kind of view** which acts a container to hold other views e.g. FrameLayout, LinearLayout etc

## ViewRootImpl

This is an internal implementation of `ViewParent`. From docs,

> The top of a view hierarchy, implementing the needed protocol between View
> and the WindowManager. This is for the most part an internal implementation
> detail of WindowManagerGlobal.

In this series of articles, we are only interested in [View]({{page.view}}){:.blue} class and will explore it as we move forward.

Every view directly/indirectly inherits from [View]({{page.view}}){:.blue} and custom views are no exception. Whenever someone needs to
create a `Custom View` it must be inherited from `View` class.

View class has many constructors and inheriting from `View` class enforces us to override at least one constructor.

{% highlight java %}
 View(Context ctx)
 View(Context ctx, AttributeSet attrs)
 View(Context ctx, AttributeSet attrs, int defStyleAttr)
 View(Context ctx, AttributeSet attrs, int defStyleAttr, int defStyleRes)
{% endhighlight %}

### View(Context ctx)

This constructor is used when you want to create a `View` from your code. e.g.

{% highlight java %}
    CustomView v = new CustomView(context);
{% endhighlight %}

###  View(Context context, AttributeSet attrs)

Called when a layout is inflated from `xml` with attributes defined in `xml` are passed via `attrs` parameter. This constructor calls

{% highlight java %}
 View(Context ctx, AttributeSet attrs, int defStyleAttr)
{% endhighlight %}

with `defStyleAttr = 0`.

### View(Context ctx, AttributeSet attrs, int defStyleAttr)

Called when attributes are applied from **class-specific** base style from a theme attribute. i.e. a style attribute is present in the `xml`
layout of the view. 0 value for `defStyleAttr` means; **don't look for defaults**.

Example from [docs]({{page.const_3}}){:.blue} ,

This constructor of View allows subclasses to use their own base style when they are inflating. For example, a Button class's
constructor would call this version of the super class constructor and  supply `R.attr.buttonStyle` for `defStyleAttr`; this
allows the theme's button style to modify all of the base view attributes (in particular its background) as well as the Button class's attributes.

### View(Context ctx, AttributeSet attrs, int defStyleAttr, int defStyleRes)

This constructor is called when a theme attribute referring to a style resource or a style resource is used for default attribute values. It
allows subclasses to use their own style when views are inflated.

From [docs]({{page.style_const}}){:.blue} ,

When determining the final value of a particular attribute, there are **four** inputs that come into play:

- Any attribute values in the given `AttributeSet`.

- The style resource specified in the `AttributeSet` (named **style**).

- The default style specified by `defStyleAttr`.

- The default style specified by `defStyleRes`.

- The base values in this theme.

Each of these inputs is considered in-order, with the first listed taking precedence over the following ones. In other words,
if in the `AttributeSet` you have supplied `<Button textColor="#ff000000">`, then the button's text will <em>always</em>
be black, regardless of what is specified in any of the styles.

**Note:** This is available for API level >= 21.
{:.notice}

##  InflateException

Sometime (especially when you are new), you will see `android.view.InflateException` while using your custom view via `xml`. This error occurs when 
layout inflater does not find an appropriate constructor to call i.e constructor with `context` & `AttributeSet` as parameter or any other constructor. To fix this error, you must atleast override this constructor

{% highlight java %}
View(Context context, AttributeSet attrs)
{% endhighlight %}


> One last thing, I took me a while to understand what each constructor is for, if this is the case with you, don't worry! I will go through them 
> again while writing an example view. For now, keep this theory in mind and move forward.

Read part 2 [here]({{site.url}}{{page.link2}}){:.blue}.