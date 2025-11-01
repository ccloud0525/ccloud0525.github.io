---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<span class='anchor' id='about-me'></span>

# 🏷 About Me
{% include_relative includes/edu.md %}

# 🔥 News
{% include_relative includes/news.md %}

# 📝 Publications 
{% include_relative includes/pub.md %}

# 🎖 Honors and Awards
{% include_relative includes/honors.md %}

# 💬 Invited Talks
{% include_relative includes/talks.md %}

# 💻 Applications
{% include_relative includes/apps.md %}

# 📖 Services
{% include_relative includes/services.md %}

# 💼 Attendance
{% include_relative includes/attendance.md %}