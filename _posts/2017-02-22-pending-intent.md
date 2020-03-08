---
layout: post
title: Pending Intents - Part 1
modified: 23-Feb-2017 (22:42)
category: android
comments: true
tags:
- android
date: 2017-02-22
part1: "https://allaudin.github.io/pending-intent/"
part2: "https://allaudin.github.io/pending-intent-part-2/"
pintent: "https://developer.android.com/reference/android/app/PendingIntent.html"
---
{% include toc.html %}

last modified: {{ page.modified | downcase }} 
{: .last_modified }

This is part 1 of two parts pending intent series.

- [Part 1]({{page.part1}}){:.blue}
- [Part 2]({{page.part2}}){:.blue}

## What is it?

[Pending Intent]({{page.pintent}}){:.blue} is a special kind of Intent which wraps around an intent (base intent) and allows us
to send this intent to other application; which at later time, can execute the base intent **on our behalf**.

> By our behalf, I mean that *intent* (provided as base intent) is executed with **same permissions** as the application; who created the pending
> intent.

## Why pending intent?

Say, we have a `Service` which syncs our important data with server. *Service is local to app and it can not be started from outside the app*.
We want this `Service` to be executed by system at specific time. After thinking a bit, we have decided to use `Alarm` for this purpose.

Now, our service is local to application (it can not be started from outside the app), how can we manage to start out service? Is it
even possible? Yes. Here, we ask `PendingIntent` to help us. Pending intent says, you don't need to worry at all. Just create an
intent (as if you are starting service from your app) and handle it to me. I will fire the intent on your app's behalf when needed.

Finally, we create a pending intent which starts our service and hand it over to `alarm manger` which invokes it on appropriate time.

## Usage

Pending intent can be used in following situations

- Returning result from services

- Starting specific components from Alarm Manager

- Starting components from notifications etc


## Example

For the sake of this article, we will return data from a service to activity using pending intent.

**SampleService** - waits for 3 seconds and send data back to *MainActivity*.

{% highlight java %}
public class SampleService extends IntentService {

    public static final String INTENT_KEY = "intent_key";

    public SampleService() {
        super("SampleService");
    }

    @Override
    protected void onHandleIntent(Intent intent) {

        try {
            Thread.sleep(3000);

            PendingIntent p = intent.getParcelableExtra(INTENT_KEY);
            Intent in = new Intent();
            in.putExtra(MainActivity.DATA, "response from service");

            log("onHandleIntent[%s]", "sending response...");

            p.send(this, Activity.RESULT_OK, in);

        } catch (InterruptedException | PendingIntent.CanceledException e) {
            log("onHandleIntent[%s]", e.getMessage() + " intent canceled.");
        }

    } // onHandleIntent

    private void log(String format, Object... args){
        AppUtils.log("SampleService", String.format(format, args));
    } // log

} // SampleService
{% endhighlight %}


**MainActivity** - start the service passing it pending intent and logs the data returned from service.

{% highlight java %}
public class MainActivity extends AppCompatActivity {

    public static final String DATA = "service_data";

    private static final int REQUEST_CODE = 940;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        PendingIntent pendingIntent = createPendingResult(REQUEST_CODE, new Intent(), PendingIntent.FLAG_ONE_SHOT);
        Intent intent = new Intent(this, SampleService.class);
        intent.putExtra(SampleService.INTENT_KEY, pendingIntent);
        startService(intent);


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

} // MainActivity
{% endhighlight %}

**Output**

{% highlight text %}
D/demo: SampleService -> onHandleIntent[sending response...]
D/demo: MainActivity -> onActivityResult[response from service]
{% endhighlight %}

Just in case, if you are wondering what `AppUtils.log` does. It simply logs the message.

{% highlight java %}
    public static void log(String tag, String message) {
        try{
            Log.d(TAG, String.format("%s -> %s", tag, message));
        }catch (Exception e){
            e.printStackTrace();
        }
    } // log
{% endhighlight %}