---
layout: post
title: Gradle Mysteries
modified: 30-Jan-2017 (22:30)
category: gradle 
comments: true
date: 2017-01-24
tags: gradle
---

{% include toc.html %}

last modified: {{ page.modified | downcase }} 
{: .last_modified }

Gradle is a build tool based on Groovy. If you are not familiar with Groovy, gradle scripts will not make sense to you at first. Like everything else, you need to put decent amount of time to learn the basic concepts. In this article, I will skim through many of the concepts that will be helpful in better understanding of gradle.


## Language Style

- Semi colon is optional.
- Return keyword is optional. The last expression evaluated in the body of a method can be returned without using `return` keyword.
- Classes and methods are public by default.
- Parentheses can be omitted.

{% highlight groovy %}
  def sum(a, b){
    return a + b
  } 

  // this method can be called as

  sum(2, 10)
  // or 
  sum 2, 10
{% endhighlight %}

- If a closure is  last parameter of method, it can be moved outside the paranthesis.

{% highlight groovy %}

  void sum(a, b, print){
    print(a + b)
  }

  // call 1
  sum (10, 20, { println it })

  // call 2
  sum (10, 30) {
    println it
  }

  // call 3
  sum 10, 30, {
    println it
  }

  
{% endhighlight %}

## Script vs Main Class

Normally in you application, you have a class with `public static void main` method which is considered as `Main Class` - entry point of your application. In groovy, you don't need to create it **explicitly**.

Let's create a file `Hello.groovy` which contains the following line

{% highlight groovy %}
println "hello! how are you?"
{% endhighlight %}

Running it from command line will yield the following output.

{% highlight bash %}
$ groovy Hello.groovy # run script
hello! how are you?
{% endhighlight %}

You can write the same example with `main method` like this

{% highlight groovy %}
class Hello {
	static void main(String[] args){
		println "hello! how are you?" 
	}
}
{% endhighlight %}

## How script works?

In case of `script`, groovy generates a class which extends [script](http://docs.groovy-lang.org/2.4.8/html/gapi/groovy/lang/Script.html){:.blue}. `main` method is automatically generated which calls auto generated `run` method. `run` method contains all the code which is written in script. For the above example, groovy generates the following `script` class.

{% highlight groovy %}
import org.codehaus.groovy.runtime.InvokerHelper
class Hello extends Script {                     
    def run() {                                 
        println "hello! how are you?"               
    }
    static void main(String[] args) {           
        InvokerHelper.runScript(Hello, args)     
    }
}
{% endhighlight %}

Here is the disassembled `Hello.class` file

{% highlight bash %}
$ groovyc Hello.groovy # compile Hello script

$ javap Hello.class # see what's in Hello.class
Compiled from "Hello.groovy"
public class Hello extends groovy.lang.Script {
  public static transient boolean __$stMC;
  public Hello();
  public Hello(groovy.lang.Binding);
  public static void main(java.lang.String...);
  public java.lang.Object run();
  protected groovy.lang.MetaClass $getStaticMetaClass();
}

{% endhighlight %}

## All about methods 

- Methods declared without any modifier are public.
- Return keyword is optional. Output of last evaluated statement will be returned.
- A method can be declared with any return type or **def**. Think of def as `Object` in Java. 

{% highlight groovy %}
  def name(){
    // a simple method
  }
{% endhighlight %}

- Default values can be defined for parameters

{% highlight groovy %}
  def sum(int a, int b = 10){
    return a + b
  }
{% endhighlight %}

- Type of paramter can be skipped in a method. We can also write the above `sum` method as

{% highlight  groovy %}
  def sum(a, b = 10){ // note: types are not defined
    return a + b
  }
{% endhighlight %}

- As mentioned before, paranthesis in method call are optional. See the example below

{% highlight groovy %}
  int sum(a, b){
    return a + b
  }

  // call 1
  sum (10, 20)

  // call 2
  sum 10, 20 // without paranthesis
{% endhighlight %}

## Closures

In this section, I will copy most of the content from [docs](http://groovy-lang.org/closures.html){:.blue} and will edit only if necessary.
{:.notice}

From [docs](http://groovy-lang.org/closures.html){:.blue}.

>A closure in Groovy is an open, anonymous, block of code that can take arguments, return a value and 
>be assigned to a variable. A closure may reference variables declared in its surrounding scope. In 
>opposition to the formal definition of a closure, Closure in the Groovy language can also contain free 
>variables which are defined outside of its surrounding scope. 

I will not explain everything about closures, if you are interested visit [this](http://groovy-lang.org/closures.html){:.blue} link for details.

Delegation is the key concept in groovy closures. You will agree, if I say, delegation is the concept which makes groovy suitable for DSL (Domain Specific Languague).


## Owner, this and delegate

To understand the concept of delegate, we must first explain the meaning of this inside a closure. A closure actually defines 3 distinct things:

- `this` corresponds to the enclosing class where the closure is defined

- `owner` corresponds to the enclosing object where the closure is defined, which may be either a class or a closure

- `delegate` corresponds to a third party object where methods calls or properties are resolved whenever the receiver of the message is not defined


## Delegatoin Strategy

Whenever a property is accessed in a closure, it will be resolved by using some delegation strategy. There are 5 delegation strategies defined by groovy

- Closure.OWNER_FIRST is the **default** strategy. 

If a property/method exists on the owner, then it will be called on the owner. If not, then the delegate is used.

- Closure.DELEGATE_FIRST 

It reverses the logic: the delegate is used first, then the owner

- Closure.OWNER_ONLY 

It will only resolve the property/method lookup on the owner: the delegate will be ignored.

- Closure.DELEGATE_ONLY 

It will only resolve the property/method lookup on the delegate: the owner will be ignored.

- Closure.TO_SELF 

It can be used by developers who need advanced meta-programming techniques and wish to implement a custom resolution strategy: the resolution will not be made on the owner or the delegate but only on the closure class itself. It makes only sense to use this if you implement your own subclass of Closure.


## Example

Create a class `User` with some fields.

{% highlight groovy %}
class User {
    int age
    String name
    String email
    String location
    String profession

    void name(String value){
        this.name = value
    }
    void someMethod(Closure c){
        c()
    }
}
{% endhighlight %}

`App` class 

{% highlight groovy %}
class App {

    static void main(String[] args){
      // crete Object of User class
        User obj = new User (name: "username", age: 21, location: "mock location", profession: "developer", email: "aaaa@gmail.com")

        // create a user closure
        def user = {
            name "allaudin"
            name = "qazi"
            println "$name, $age, $location"
            someMethod {
                println "method called."
            }
        }
        user.delegate = obj // set delegate for closure (1)
        user.resolveStrategy = Closure.DELEGATE_FIRST // set delegation strategy 

        user() // call closure
    }
}
{% endhighlight %}

In `App` class, a `User` object (obj) is created with default values of the fields. A `user` closure is defined with some properties, these properties are same as fields in `User` object. At (1), obj is set as a delegate for `user` closure and resolve strategy is set to `Closure.DELEGATE_FIRST`. 

Now when code is executed, `user` closure **looks** for `name`, `age` etc properties in its delegate object and uses those values.

Output

{% highlight bash %}
$ groovy App.groovy # execute

qazi, 21, mock location
method called.

{% endhighlight %}

## About Classes

- By default, classes and methods are public.
- Fields are private by default.
- Groovy creates default getters and setters for private fields.
- Fields can be set as key/value pairs from constructor. 

{% highlight groovy %}
// from above example
// these properties will be set using default setters
User obj = new User (name: "username", age: 21, location: "mock location", profession: "developer", email: "aaaa@gmail.com")
{% endhighlight %}

{% highlight groovy %}
// snippet from the above example
  def user = {
    name "allaudin" // method call, same as name(arg)
    name = "qazi" // assigned directly to field using default setter.
    println "$name, $age, $location"
    someMethod {
      println "some method called."
    }
  }
{% endhighlight %}
