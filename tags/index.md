---
title: Tags
layout: default
---

{% capture site_tags %}{% for tag in site.tags %}{{ tag | first }}{% unless forloop.last %},{% endunless %}{% endfor %}{% endcapture %}

<!-- `tag_words` is a sorted array of the tag names. -->
{% assign tag_words = site_tags | split:',' | sort %}

<!-- Build the Page -->

<!-- List of all tags -->
<div class="tags">

<ul class="tag-list">
  {% for item in (0..site.tags.size) %}{% unless forloop.last %}
    {% capture this_word %}{{ tag_words[item] }}{% endcapture %}
    <li>
      <a href="#{{ this_word | cgi_escape }}" class="tag">{{ this_word }}
        <span>({{ site.tags[this_word].size }})</span>
      </a>
    </li>
  {% endunless %}{% endfor %}
</ul>

<!-- Posts by Tag -->
<div class="post-list">
  {% for item in (0..site.tags.size) %}{% unless forloop.last %}
    {% capture this_word %}{{ tag_words[item] }}{% endcapture %}
    <h2 id="{{ this_word | cgi_escape }}">{{ this_word | capitalize }}</h2>
 
     {% for post in site.tags[this_word] %}{% if post.title != null %}
        <ul class="post" >
          <li >
         
            <a href="{{site.url}}{{ post.url }}">{{ post.title  }}
        
        <span class="post-date">—&nbsp;{{ post.date | date_to_string }}</span> 
        
        </a>
        
         
          </li>
            </ul>
         
        {% endif %}{% endfor %}
  
   
  {% endunless %}{% endfor %}
</div>

</div>
