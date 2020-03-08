---
layout: post
title: Pending Intents - Part 2
modified: 23-Feb-2017 (22:48)
category: android
comments: true
tags: [android]
date: 2017-02-23
part1: "https://allaudin.github.io/pending-intent/"
part2: "https://allaudin.github.io/pending-intent-part-2/"
pintent: "https://developer.android.com/reference/android/app/PendingIntent.html"
---

This is part 2 of two parts pending intent series.

- [Part 1]({{page.part1}}){:.blue}
- [Part 2]({{page.part2}}){:.blue}

## Background

In [part 1]({{page.part1}}){:.blue}, we have discussed the need and use of pending intents with an example. We have created `PendingIntent`
and set `PendingIntent.FLAG_ONE_SHOT` in example but we haven't discussed anything about creation and flags. These are the topics
of this article.

## Creating Pending Intents

[Pending Intent]({{page.pintent}}){:.blue} class provides static methods for creating pending intent of desired type. Like any other intent,
we create pending intent for specific component. e.g. activity, service etc.

{% highlight java %}

public static PendingIntent getService(Context context, int requestCode, @NonNull Intent intent, @Flags int flags);

public static PendingIntent getActivity(Context context, int requestCode, Intent intent, @Flags int flags);

public static PendingIntent getBroadcast(Context context, int requestCode, Intent intent, @Flags int flags);

{% endhighlight %}

**Note:** There are other methods too, which you can explore on your own.
{: .notice}


## Intent FLAGS

From docs,

><b><em class="yellow">A PendingIntent itself is simply a reference to a token maintained by the system describing the original data used to retrieve it.</em></b>
>This means that, even if its owning application's process is killed, the `PendingIntent` itself will remain usable
>from other processes that have been given it. If the creating application later re-retrieves the same kind of
>`PendingIntent` (same operation, same Intent action, data, categories, and components, and same flags),
>it will receive a `PendingIntent` representing the same token if that is still valid, and can thus call `cancel()` to remove it.

From the very first line, it's clear that `Pending Intents` are stored somewhere in the system and can be updated later. These `Pending Intent Flags`
help us to achieve this behaviour. Depending on the flag passed to create pending intent we can update or change the behaviour of intent.

Let's discuss each of them briefly.

##  FLAG_ONE_SHOT

If a pending intent is created using `PendingIntent.FLAG_ONE_SHOT` flag; *it can be used only once*. Any attempt to reuse it will fail (throw
exception).

I will create a simple app here.

**SampleService** - waits for *3 seconds* and execute the action attached to pending intent.

{% highlight java %}
public class SampleService extends IntentService {

    public static final String INTENT_KEY = "intent_key";

    public SampleService() {
        super("SampleService");
    }

    @Override
    protected void onHandleIntent(Intent intent) {

        try {
            Thread.sleep(3000); // assume some work

            PendingIntent p = intent.getParcelableExtra(INTENT_KEY);
            log("onHandleIntent[%s]", "sending response...");
            p.send();

        } catch (InterruptedException | PendingIntent.CanceledException e) {
            String msg = e.getMessage();
            if(msg == null) msg = e.getLocalizedMessage();
            log("onHandleIntent[%s]", msg + " intent canceled.");
        }

    } // onHandleIntent

    private void log(String format, Object... args){
        AppUtils.log("SampleService", String.format(format, args));
    } // log

} // SampleService
{% endhighlight %}

**MainActivity** - main activity, it has an `init` button which starts the service and schedule starting it again after 5 seconds from now.

{% highlight java %}
public class MainActivity extends AppCompatActivity {

    public static final String DATA = "service_data";

    private static final int REQUEST_CODE = 940;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    } // onCreate

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQUEST_CODE && resultCode == RESULT_OK) {
            log("onActivityResult[%s]", data.getStringExtra(DATA));
        }
    } // onActivityResult

    private void log(String format, Object... args) {
        AppUtils.log("MainActivity", String.format(format, args));
    } // log

    public void onInit(View view) {
        Intent base = new Intent(this, ResultActivity.class);
        base.putExtra(ResultActivity.RESULT_ACTIVITY, "first result");

        final PendingIntent pendingIntent = PendingIntent.getActivity(this, REQUEST_CODE, base, PendingIntent.FLAG_ONE_SHOT);
        Intent intent = new Intent(MainActivity.this, SampleService.class);
        intent.putExtra(SampleService.INTENT_KEY, pendingIntent);
        startService(intent);

        new Handler().postAtTime(new Runnable() {
            @Override
            public void run() {
                log("%s", "sending from handler");
                Intent intent = new Intent(MainActivity.this, SampleService.class);
                intent.putExtra(SampleService.INTENT_KEY, pendingIntent);
                startService(intent);

            }
        }, SystemClock.uptimeMillis() + 5000);
    }
} // MainActivity
{% endhighlight %}

**ResultActivity** - activity which will be started from service. It logs the extra data carried with intent.

{% highlight java %}

    public static final String RESULT_ACTIVITY = "result_activity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_result);

        if(getIntent().hasExtra(RESULT_ACTIVITY)){
            log("%s", getIntent().getStringExtra(RESULT_ACTIVITY));
        }else {
            log("%s", "no extra");
        }

        finish();
    } // onCreate

    private void log(String format, Object... args){
        AppUtils.log("ResultActivity", String.format(format, args));
    } // log

} // ResultActivity
{% endhighlight %}


In this example, we have create pending intent with `FLAG_ONE_SHOT`

{% highlight java %}
final PendingIntent pendingIntent = PendingIntent.getActivity(this, REQUEST_CODE, base, PendingIntent.FLAG_ONE_SHOT);
{% endhighlight %}

When the same intent is passed to starting service in scheduled called in `Handler`, service throws `CanceledException` becuase
**this intent was supposed to be used only once**.

**Output**

{% highlight text %}
D/demo: SampleService -> onHandleIntent[sending response...]
D/demo: ResultActivity -> first result
D/demo: MainActivity -> sending from handler
D/demo: SampleService -> onHandleIntent[sending response...]
D/demo: SampleService -> onHandleIntent - in catch block - [CanceledException intent canceled.]
{% endhighlight %}


## FLAG_UPDATE_CURRENT

This flag indicates that *if* intent is already there, update its extras with new intent's extras otherwise return a new pending intent.

Update `onInit` method with following code and analyze the result.

{% highlight java %}
    public void onInit(View view) {
        final Intent base = new Intent(this, ResultActivity.class);
        base.putExtra(ResultActivity.RESULT_ACTIVITY, "first result");

        PendingIntent pendingIntent = PendingIntent.getActivity(this, REQUEST_CODE, base, PendingIntent.FLAG_UPDATE_CURRENT);
        log("%s", "pending intent hash [first] - "  + pendingIntent.hashCode());
        Intent intent = new Intent(MainActivity.this, SampleService.class);
        intent.putExtra(SampleService.INTENT_KEY, pendingIntent);
        startService(intent);

        new Handler().postAtTime(new Runnable() {
            @Override
            public void run() {
                log("%s", "sending from handler");
                base.putExtra(ResultActivity.RESULT_ACTIVITY, "updated extras from handler.");
                PendingIntent pendingIntent = PendingIntent.getActivity(MainActivity.this, REQUEST_CODE, base, PendingIntent.FLAG_UPDATE_CURRENT);
                log("%s", "pending intent hash [second] - "  + pendingIntent.hashCode());
                Intent intent = new Intent(MainActivity.this, SampleService.class);
                intent.putExtra(SampleService.INTENT_KEY, pendingIntent);
                startService(intent);

            }
        }, SystemClock.uptimeMillis() + 5000);
    }
{% endhighlight %}

**Output**

{% highlight text %}
D/demo: MainActivity -> pending intent hash [first] - 61346262
D/demo: SampleService -> onHandleIntent[sending response...]
D/demo: ResultActivity -> first result
D/demo: MainActivity -> sending from handler
D/demo: MainActivity -> pending intent hash [second] - 61346262
D/demo: SampleService -> onHandleIntent[sending response...]
D/demo: ResultActivity -> updated extras from handler.
{% endhighlight %}


## FLAG_CANCEL_CURRENT

It indicates that if described pending intent already exists, **cancel it** before creating new one. In our example, service waits
for **3** seconds before starting new activity. We will update the  `onInit()` method, now it will schedulea new service start after **1**
second. It will cancel the previous one (generation canceled exception in the service) and will start a new one.

*Analyze the output carefully.*{: .yellow}

{% highlight java %}
 final Intent base = new Intent(this, ResultActivity.class);
        base.putExtra(ResultActivity.RESULT_ACTIVITY, "first result");

        PendingIntent pendingIntent = PendingIntent.getActivity(this, REQUEST_CODE, base, PendingIntent.FLAG_CANCEL_CURRENT);
        log("%s", "pending intent hash [first] - "  + pendingIntent.hashCode());
        Intent intent = new Intent(MainActivity.this, SampleService.class);
        intent.putExtra(SampleService.INTENT_KEY, pendingIntent);
        startService(intent);

        new Handler().postAtTime(new Runnable() {
            @Override
            public void run() {
                log("%s", "sending from handler");
                base.putExtra(ResultActivity.RESULT_ACTIVITY, "updated extras from handler.");
                PendingIntent pendingIntent = PendingIntent.getActivity(MainActivity.this, REQUEST_CODE, base, PendingIntent.FLAG_CANCEL_CURRENT);
                log("%s", "pending intent hash [second] - "  + pendingIntent.hashCode());
                Intent intent = new Intent(MainActivity.this, SampleService.class);
                intent.putExtra(SampleService.INTENT_KEY, pendingIntent);
                startService(intent);

            }
        }, SystemClock.uptimeMillis() + 1000);
{% endhighlight %}

**Output**

{% highlight text %}
D/demo: MainActivity -> pending intent hash [first] - 61346262
D/demo: MainActivity -> sending from handler
D/demo: MainActivity -> pending intent hash [second] - 66200388
D/demo: SampleService -> onHandleIntent[sending response...]
D/demo: SampleService -> onHandleIntent - in catch block - [CanceledException intent canceled.]
D/demo: SampleService -> onHandleIntent[sending response...]
D/demo: ResultActivity -> updated extras from handler.
{% endhighlight %}

## FLAG_NO_CREATE

This flag returns `null` if it does not find any **existing** pending intent to return.

Update `onInit()` with this code and see the output.

{% highlight java %}
PendingIntent pendingIntent = PendingIntent.getActivity(this, REQUEST_CODE, base, PendingIntent.FLAG_NO_CREATE);
        
        if(pendingIntent == null){
            log("onInit[%s]", "no intent found.");
            return;
        }
{% endhighlight %}

**Output**

{% highlight text %}
D/demo: MainActivity -> onInit[no intent found.]
{% endhighlight %}

## FLAG_IMMUTABLE (API >= 23)

From docs,

> Flag indicating that the created PendingIntent should be immutable.
> This means that the additional intent argument passed to the send methods to
> fill in unpopulated properties of this intent will be ignored.

**Note:** I haven't used this flag yet. I have added it here just for completion. You can explore it on your own or I will update it here
whenever I get time.
{: .notice}

