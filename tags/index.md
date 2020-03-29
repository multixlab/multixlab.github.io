---
title: Tags
layout: default
---

 <h1 class="center">All {{ page.title }}</h1>
 
{% capture site_tags %}{% for tag in site.tags %}{{ tag | first }}{% unless forloop.last %},{% endunless %}{% endfor %}{% endcapture %}

{% assign tag_words = site_tags | split:',' | sort %}

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


<div class="post-list">
  {% for item in (0..site.tags.size) %}{% unless forloop.last %}
    {% capture this_word %}{{ tag_words[item] }}{% endcapture %}
    <h2 id="{{ this_word | cgi_escape }}">{{ this_word | capitalize }}</h2>
 
  <ul class="post" >
     {% for post in site.tags[this_word] %}{% if post.title != null %}
       
          <li >
         
           {% if post.deprecated == true %}
               <a class="disabled" title="this article is no long available">{{ post.title  }}
                    
                    <span class="post-date">—&nbsp;{{ post.date | date_to_string }}</span> 
                    
                    </a>
             {% else %}
               <a href="{{site.url}}{{ post.url }}">{{ post.title  }}
                    
                    <span class="post-date">—&nbsp;{{ post.date | date_to_string }}</span> 
                    
                    </a>
             {% endif %}
             
         
        
         
          </li>
           
         
        {% endif %}{% endfor %}
   </ul>
   
  {% endunless %}{% endfor %}
</div>

</div>
