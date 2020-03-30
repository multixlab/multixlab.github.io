---
title: Archive
layout: default
---

<div class="archive">
<h1 class="title">{{ page.title }}</h1>
<div class="count">{{site.posts.size}} articles</div>
<div class="post-list">
 {% for post in site.posts  %}
    {% capture current_year %}{{ post.date | date: "%Y" }}{% endcapture %}
        {% if forloop.first %}
            <h2 id="{{current_year}}">{{current_year}}</h2>
            <ul class="post">
        {% else %}
            {% if current_year != last_year %}
                </ul>
                <h2 id="{{current_year}}">{{current_year}}</h2>
                    <ul class="post">
            {% endif %}
        {% endif %}
             <li>
              {% if post.deprecated == true %}
               <a title="this article is no longer available" class="disabled">
                                            {{ post.title }}&nbsp;<span class="post-date">—&nbsp;{{ post.date | date_to_string }}</span> </a>
              {% else %}
                <a title="{{ post.date | date_to_string }}" href="{{ site.url }}{{ post.url }}">
                              {{ post.title }}&nbsp;<span class="post-date">—&nbsp;{{ post.date | date_to_string }}</span> </a>
              {% endif %}
             </li>
         {% if forloop.last %}
            </ul>
         {% endif %}  
         
    {% capture last_year %}{{ current_year }}{% endcapture %} 
         
 {% endfor %}
</div>
</div>
