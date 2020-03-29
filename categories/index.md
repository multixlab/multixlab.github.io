---
layout: default
title: Categories
---

  <div class="categories post-list">
                <h1 class="center">All {{ page.title }}</h1>
                
                  
                   
                {% for category in site.categories %}

                {% capture title %}{{ category | first | capitalize }}{% endcapture %}

                <h2 id="{{ title }}">{{ title }}</h2>
                 <ul class="post">
                {% for posts in category %}
                {% for post in posts %}
                {% if post.project == null and post.title %}

             
                    <li>
                    
                      {% if post.deprecated == true %}
                          <a title="this article is no longer available" class="disabled">
                                                    {{ post.title }}&nbsp;<span class="post-date">—&nbsp;{{ post.date | date_to_string }}</span> </a>
                        {% else %}
                       <a title="{{ post.date | date_to_string }}" href="{{ site.url }}{{ post.url }}">
                                                 {{ post.title }}&nbsp;<span class="post-date">—&nbsp;{{ post.date | date_to_string }}</span> </a>
                        {% endif %}
                        
                      
                    </li>

               


                {% endif %}
                {% endfor %}
                {% endfor %}
                   </ul>
                {% endfor %}
                
          </div>