---
layout: default
title: Categories
---

  <div class="categories post-list">
                {% for category in site.categories %}

                {% capture title %}{{ category | first | capitalize }}{% endcapture %}

                <h2 id="{{ title }}">{{ title }}</h2>
                {% for posts in category %}
                {% for post in posts %}
                {% if post.project == null and post.title %}

                <ul class="post">
                    <li>
                        <a title="{{ post.date | date_to_string }}" href="{{ site.url }}{{ post.url }}">
                            {{ post.title }}&nbsp;<span class="post-date">—&nbsp;{{ post.date | date_to_string }}</span> </a>
                    </li>

                </ul>


                {% endif %}
                {% endfor %}
                {% endfor %}
                {% endfor %}
          </div>