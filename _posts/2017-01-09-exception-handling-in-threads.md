---
layout: post
title: Exception Handling in Threads
modified: 10-Jan-2017 (22:32)
category: java
comments: true
date: 2017-01-09
tags: [java, threads]
---

last modified: {{ page.modified | downcase }} 
{: .last_modified }

By contract, [Runnable#run](https://docs.oracle.com/javase/7/docs/api/java/lang/Runnable.html) method does not allow **throwing exceptions**. Possible ways of handling exceptions are `try/catch blocks` or setting `exception handler` on thread or thread group.

A thread or thread group allows us to set an exception handler on it, to receive exceptions occured during the execution of thread.

## How it works

If you are clever enough, following flowchart says it all. Have a look!

<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="452px" version="1.1" content="&lt;mxfile userAgent=&quot;Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2970.0 Safari/537.36&quot; version=&quot;6.0.2.8&quot; editor=&quot;www.draw.io&quot; type=&quot;google&quot;&gt;&lt;diagram name=&quot;Page-1&quot;&gt;7Vtdc6M2FP01nmkftgMSH+Zxk812H9pOZ9JON48yyEZdQIwQsd1fXykIgxB22DiAy/QlA9dCwLnnHt17RVbwPj38zFAe/0ojnKyAFR1W8NMKgLUPxF9pOFYGB8LKsGMkqkx2Y3gk/2BltJS1JBEutIGc0oSTXDeGNMtwyDUbYozu9WFbmuh3zdEOG4bHECWm9S8S8Vi9lms19i+Y7OL6zralfklRPVgZihhFdN8ywYcVvGeU8uooPdzjRGJX41Jd9/nMr6cHYzjjQy5wo2209UMLALjBlh99UDM8o6RUL7sCXiLmuitylInjnTzmMcMoEuNYmWUk29VjxI3aw9Q78mMN3D4mHD/mKJTne8ENMSjmaSLO7NP4Z8w4Ppx9IfsEk6AXpinm7CiGqAtgTSVFrfW6Ot03frKhW9nilo+gcghS1NidZm7QEwcKwDNgblyMtxB4a7z2UeB+AAYAOBJEUqeU8ZjuaIaSh8Z6x2iZRVjOaOngCADY8au0/+TWp09q2N+Y86OKE1RyKkzN7L9QmmsAy4e4DK94ZlqyEJ8hicKPI7bD/BKRTDcxnCBOnvX7XwX6mYfTGNz1QpIIqZBoT0DItaURso78FiEdy+Sj8x587EKzNqAphA+5gY94W64DUXBGv+F7mlAmLBnNJHhbkiQdE0rILhOnoUAHC/udxI4I5fyofkhJFCXnkB8BbjgMbjAG3IEBNz6EOOeECoW0aBiWrDCwb+Lfnoafjg6Y7ZqI2aAHsndRTEM1LAOQayTzQHhLMcXZ0+2JaZ3AXBLTYC4xtc/nAxF5btZ5M0X4MwtRKcjyUFP+C8pE5DPxO0oljbNNkbeuNVKHk7nnRq/cuxBAigCTUaYyFfj5O+/TjcqYppuymCYiLaezYvREZADMiLS9UUISvJUCQvblzGWXCWO4/Ic/VEoqXtASx3SPNgn+8Tqvj+/r7moV9Lja7xHfcTztjiK+Leltqe2NiO8Q9a0iYBb59d7VI7eDezAE9tlKCNs3M7csMl0xYRlhd9I0F7iGUrg9QuGOIhTrhdKyXusu89KfjZdmRfGEzRLiP1y+2UGnWnZmrN/qzkEL7t/oktDu1n6n4nkWtOGQPHNATnk5eTyfKJ4rSy7PR1pVhuxX0zK/mewSWq7mX6enG3KKuLaDg1Ec7Cx11RiSRFb0nmPVAGZHlBQvpMUMy5tlx+alTYJ3uK1V0jdTMoNOdtRXR3k9RLdHyY/AUtP2WqMvM92djen+OLhrqL84YWrch+y4XK0wL5d+ZAwdWwNySjJetGb+XRqa0AO+Hnqe57Z9+Op4x3c7Pq+eoGHA6VXeSApz12NhSXO3i+TNuekBzBplYAtPLkrj94Y/4S0qE/5/e/rNbKtbz4ptfs9aC+oOirbW+mPwreb68tbaQZo/284QNHeGllUc2x1VXc+pqtBsRahKmPCXRxJPJDjX2l5GsmHZFKZIZvyCSYaHZthhtrye7Lxvi3mUXY76A6HlCcaQpnpFpFkEw1l6HtYletCzMk6nGGbVP/sextrThcC2ewAKTIBGKdKhZwCUs6pUKTgKv3EmoZBflvakdZgxQT05UuhrWsvtwJxQsDMlGeK4JdA30jH0ulLd9+3BdFL9rvX8TcqxN5scj7OHZ6/m7pXUqdJl3K/tUb2pV+JYnfCqP0UerfnhjLRTO7+XvZv1sg0m97LZc1lWLQaBvpHl93ykOllm5b5vx6H3G1VrdVOlhTNkLXMm60V0/8/CHsch4IJHwOguuVa2DF2Cvq8FUQD1GSoGqIsab3z3PBVJjHleFzpx2vznUzW8+fcx+PAv&lt;/diagram&gt;&lt;/mxfile&gt;" onclick="(function(svg){var src=window.event.target||window.event.srcElement;while (src!=null&amp;&amp;src.nodeName.toLowerCase()!='a'){src=src.parentNode;}if(src==null){if(svg.wnd!=null&amp;&amp;!svg.wnd.closed){svg.wnd.focus();}else{var r=function(evt){if(evt.data=='ready'&amp;&amp;evt.source==svg.wnd){svg.wnd.postMessage(decodeURIComponent(svg.getAttribute('content')),'*');window.removeEventListener('message',r);}};window.addEventListener('message',r);svg.wnd=window.open('https://www.draw.io/?client=1&amp;lightbox=1&amp;chrome=0&amp;edit=_blank');}}})(this);" viewBox="0 0 452 1143" style="cursor:pointer;max-width:100%;max-height:1143px;"><defs/><g transform="translate(0.5,0.5)"><rect x="274" y="69" width="135" height="30" fill="#ffffff" stroke="#000000" pointer-events="none"/><g transform="translate(301.5,77.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="80" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 81px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;"><span>thread running</span></div></div></foreignObject><text x="40" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">&lt;span&gt;thread running&lt;/span&gt;</text></switch></g><path d="M 341 41 L 341 61 L 342 61 L 342 62.63" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 342 67.88 L 338.5 60.88 L 342 62.63 L 345.5 60.88 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><ellipse cx="341" cy="21" rx="20" ry="20" fill="#ffffff" stroke="#000000" pointer-events="none"/><g transform="translate(329.5,14.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="23" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 24px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">start</div></div></foreignObject><text x="12" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">start</text></switch></g><rect x="281" y="131" width="120" height="30" rx="4.5" ry="4.5" fill="#ffffff" stroke="#000000" pointer-events="none"/><g transform="translate(294.5,139.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="92" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 93px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">exception occurs</div></div></foreignObject><text x="46" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">exception occurs</text></switch></g><path d="M 342 99 L 341 99 L 341 124.63" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 341 129.88 L 337.5 122.88 L 341 124.63 L 344.5 122.88 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 341 181 L 437 261 L 341 341 L 245 261 Z" fill="#ffffff" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><g transform="translate(263.5,247.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="154" height="26" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 155px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;"><div><span>UncaughtExceptionHandler </span></div><div><span>set on thread?</span></div></div></div></foreignObject><text x="77" y="19" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">[Not supported by viewer]</text></switch></g><rect x="21" y="371" width="170" height="60" fill="#ffffff" stroke="#000000" pointer-events="none"/><g transform="translate(42.5,387.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="127" height="26" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 128px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;"><div><span>call uncaughtException</span></div><div><span>(Thread, Throwable)</span></div></div></div></foreignObject><text x="64" y="19" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">[Not supported by viewer]</text></switch></g><path d="M 245 261 L 106 261 L 106 364.63" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 106 369.88 L 102.5 362.88 L 106 364.63 L 109.5 362.88 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 341 161 L 341 181 L 341 161 L 341 174.63" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 341 179.88 L 337.5 172.88 L 341 174.63 L 344.5 172.88 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><ellipse cx="106" cy="531" rx="25" ry="25" fill="#ffffff" stroke="#000000" pointer-events="none"/><g transform="translate(95.5,524.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="21" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 22px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">end</div></div></foreignObject><text x="11" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">end</text></switch></g><path d="M 106 431 L 106 499.63" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 106 504.88 L 102.5 497.88 L 106 499.63 L 109.5 497.88 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><g transform="translate(140.5,224.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="20" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 20px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">Yes</div></div></foreignObject><text x="10" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">Yes</text></switch></g><g transform="translate(292.5,364.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="16" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 17px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">No</div></div></foreignObject><text x="8" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">No</text></switch></g><rect x="246" y="411" width="190" height="90" fill="#ffffff" stroke="#000000" pointer-events="none"/><g transform="translate(277.5,435.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="127" height="40" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 128px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;"><div>call uncaughtException</div><div>(Thread, Throwable) </div><div>in thread group</div></div></div></foreignObject><text x="64" y="26" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">[Not supported by viewer]</text></switch></g><path d="M 341 341 L 341 404.63" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 341 409.88 L 337.5 402.88 L 341 404.63 L 344.5 402.88 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 341 571 L 421 646 L 341 721 L 261 646 Z" fill="#ffffff" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><g transform="translate(290.5,632.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="101" height="26" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 102px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">is there any parent<div>thread group?</div></div></div></foreignObject><text x="51" y="19" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">[Not supported by viewer]</text></switch></g><path d="M 341 501 L 341 564.63" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 341 569.88 L 337.5 562.88 L 341 564.63 L 344.5 562.88 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 261 646 L 211 646 L 211 456 L 239.63 456" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 244.88 456 L 237.88 459.5 L 239.63 456 L 237.88 452.5 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><g transform="translate(230.5,614.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="20" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 20px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">Yes</div></div></foreignObject><text x="10" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">Yes</text></switch></g><path d="M 341.5 771 L 450 856 L 341.5 941 L 233 856 Z" fill="#ffffff" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><g transform="translate(244.5,835.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="193" height="40" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 194px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;"><div><span>is </span></div><div><span>DefaultUncaughtExceptionHandler </span></div><div><span>set on thread?</span></div></div></div></foreignObject><text x="97" y="26" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">[Not supported by viewer]</text></switch></g><path d="M 341 721 L 341 746 L 342 746 L 342 764.63" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 342 769.88 L 338.5 762.88 L 342 764.63 L 345.5 762.88 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><g transform="translate(132.5,814.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="16" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 17px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">No</div></div></foreignObject><text x="8" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">No</text></switch></g><rect x="281" y="1041" width="120" height="60" fill="#ffffff" stroke="#000000" pointer-events="none"/><g transform="translate(282.5,1057.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="116" height="26" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 116px; white-space: normal; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">call it with exception and thread as arg</div></div></foreignObject><text x="58" y="19" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">call it with exception and thread as arg</text></switch></g><path d="M 342 940.61 L 342 991 L 341 991 L 341 1034.63" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 341 1039.88 L 337.5 1032.88 L 341 1034.63 L 344.5 1032.88 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><g transform="translate(290.5,974.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="20" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 20px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">Yes</div></div></foreignObject><text x="10" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">Yes</text></switch></g><ellipse cx="152" cy="1116" rx="24.5" ry="25" fill="#ffffff" stroke="#000000" pointer-events="none"/><g transform="translate(140.5,1109.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="21" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 22px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">end</div></div></foreignObject><text x="11" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">end</text></switch></g><rect x="1" y="981" width="120" height="60" fill="#ffffff" stroke="#000000" pointer-events="none"/><g transform="translate(13.5,990.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="95" height="40" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 96px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">print stacktrace to<div>error stream and</div><div>terminate thread</div></div></div></foreignObject><text x="48" y="26" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">[Not supported by viewer]</text></switch></g><path d="M 233 856 L 61 856 L 61 974.63" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 61 979.88 L 57.5 972.88 L 61 974.63 L 64.5 972.88 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 341 1101 L 341 1116 L 182.37 1116" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 177.12 1116 L 184.12 1112.5 L 182.37 1116 L 184.12 1119.5 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 61 1041 L 61 1116 L 120.63 1116" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 125.88 1116 L 118.88 1119.5 L 120.63 1116 L 118.88 1112.5 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><g transform="translate(277.5,734.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="16" height="12" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 17px; white-space: nowrap; word-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">No</div></div></foreignObject><text x="8" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica">No</text></switch></g><path d="M 286 731 L 286 731" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 286 731 L 286 731 L 286 731 L 286 731 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 318 74 L 318 74" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/><path d="M 318 74 L 318 74 L 318 74 L 318 74 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="none"/></g></svg>

## Example

Create a general `ExceptionalThread` class which inherits from `Thread` and generates `ArrayIndexOutOfBoundsException` when run. See the code below

{% highlight java %}
class ExceptionalThread extends Thread {

    ExceptionalThread(String name) {
        super(name);
    }


    ExceptionalThread(ThreadGroup group, String name) {
        super(group, name);
    }

    @Override
    public void run() {
        super.run();
        // generates ArrayIndexOutOfBoundsException
        final int unused = (new int[2])[3];
        System.out.println(unused);
    } // run

} // ExceptionalThread
{% endhighlight %}

Inherit 3 more classes from this class with names `DefaultHandler`, `ThreadGroupHandler`, `ThreadSpecificHandler`. 

- `ThreadSpecificHandler` thread sets its `UncaughtExceptionHandler` and exception will be caught in this handler.

- `ThreadGroupHandler` thread calls `uncaughtException` method of its thread group.

- `DefaultHandler` thread calls `DefaultUncaughtExceptionHandler` of the thread. 

Code for all three classes is given below

**ThreadSpecificHandler**

{% highlight  java %}
class ThreadSpecificHandler extends ExceptionalThread {

    ThreadSpecificHandler() {
        super("ThreadSpecificHandler");
    }

} // ThreadSpecificHandler
{% endhighlight %}

**ThreadGroupHandler**

{% highlight  java %}
class ThreadGroupHandler extends ExceptionalThread {

    ThreadGroupHandler(ThreadGroup tg) {
        super(tg, "ThreadGroupHandler");
    }
} // ThreadGroupHandler
{% endhighlight %}

**DefaultHandler**

{% highlight java %}
class DefaultHandler extends ExceptionalThread {

    DefaultHandler() {
        super("DefaultHandler");
    }

    @Override
    public void run() {
        Thread.setDefaultUncaughtExceptionHandler((t, e) -> App.exceptionHandler(t, e, "Thread#UncaughtExceptionHandler (Default)"));
        super.run();
    }
} // DefaultHandler
{% endhighlight %}

**App**

{% highlight java %}
public class App {

    static void exceptionHandler(Thread t, Throwable exp, String method){
        System.out.println(String.format("Method: %s - ThreadName: %s - Exception: %s", method, t.getName(), exp.getClass().getSimpleName()));
    } // exceptionHandler

    public static void main(String[] args) throws InterruptedException {

        Thread threadWithHandler = new ThreadSpecificHandler();
        threadWithHandler.setUncaughtExceptionHandler((t, e) -> exceptionHandler(t, e, "Thread#UncaughtExceptionHandler"));
        threadWithHandler.start();

        /*  ------------------- THREAD GROUP ---------------*/

        ThreadGroup group = new ThreadGroup("exp"){
            @Override
            public void uncaughtException(Thread t, Throwable e) {
               exceptionHandler(t, e, "ThreadGroup#uncaughtException");
            }
        };
		/*  ------------------- THREAD GROUP ---------------*/

        Thread threadWithGroupHandler = new ThreadGroupHandler(group);
        threadWithGroupHandler.start();


        Thread threadWithDefaultHandler = new DefaultHandler();
        threadWithDefaultHandler.start();


        // wait for threads
        threadWithDefaultHandler.join();
        threadWithGroupHandler.join();
        threadWithHandler.join();

    } // main

} // App
{% endhighlight %}

**Output**

{% highlight text %}
Method: ThreadGroup#uncaughtException - ThreadName: ThreadGroupHandler - Exception: ArrayIndexOutOfBoundsException
Method: Thread#UncaughtExceptionHandler (Default) - ThreadName: DefaultHandler - Exception: ArrayIndexOutOfBoundsException
Method: Thread#UncaughtExceptionHandler - ThreadName: ThreadSpecificHandler - Exception: ArrayIndexOutOfBoundsException
{% endhighlight %}