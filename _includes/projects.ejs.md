```{=html}
<ul class="list index-list" role="list">
  <% for (const [index, item] of items.entries()) { %>
  <li class="index-row" <%= metadataAttrs(item) %>>
    <a class="index-entry" href="<%= item.url %>" aria-labelledby="project-title-<%= index %>">
      <span class="index-title listing-title" id="project-title-<%= index %>"><%= item.title %><% if (item.url.startsWith('https://')) { %> <span class="external-arrow" aria-hidden="true">↗</span><% } %></span>
      <span class="index-description"><%= item.description %></span>
      <% if (templateParams?.details) { %>
      <span class="index-meta"><%= item.detail %></span>
      <% } %>
    </a>
  </li>
  <% } %>
</ul>
```
