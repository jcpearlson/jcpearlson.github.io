<%
const archive = templateParams?.archive;
const topics = archive
  ? [...new Set(items.flatMap(item => item.categories || []))].sort((a, b) => a.localeCompare(b))
  : [];
%>
```{=html}
<% if (archive) { %>
<div class="index-heading archive-toolbar">
  <h2><span class="accent" aria-hidden="true">/</span> All writing</h2>
  <% if (topics.length) { %>
  <div class="topic-filter" hidden>
    <label for="article-topic">Topic</label>
    <select id="article-topic">
      <option value="">All topics</option>
      <% for (const topic of topics) { %>
      <option value="<%= topic %>"><%= topic %></option>
      <% } %>
    </select>
  </div>
  <p id="article-results" class="visually-hidden" role="status"></p>
  <% } %>
</div>
<% } %>
<ul class="list index-list" role="list">
  <% for (const [index, item] of items.entries()) { %>
  <li class="index-row" <%= metadataAttrs(item) %>>
    <a class="index-entry" href="<%= item.path %>" aria-labelledby="post-title-<%= index %>">
      <span class="index-title listing-title" id="post-title-<%= index %>"><%= item.title %></span>
      <span class="index-meta">
        <span class="listing-date"><%= item.date %></span>
        <% if (item.categories?.length) { %>
        <span class="meta-topics"><%= (archive ? item.categories : item.categories.slice(0, 1)).join(' · ') %></span>
        <% } %>
      </span>
    </a>
  </li>
  <% } %>
</ul>
```
