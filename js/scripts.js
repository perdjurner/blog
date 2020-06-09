async function api(url) {
  const baseUrl = "https://api.github.com";
  let data = localStorage.getItem(url);
  if (data) {
    data = JSON.parse(data);
  } else {
    const result = await fetch(`${baseUrl}/${url}`);
    data = await result.json();
    localStorage.setItem(url, JSON.stringify(data));
  }
  return data;
}

function toEntities(md) {
  const elm = document.createElement("p");
  elm.textContent = md;
  return elm.innerHTML;
}

function toHtml(md) {
  html = md;

  html = html.replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2'>$1</a>");
  html = html.replace(/`{3}([.\s\S]*?)`{3}/g, "<pre>$1</pre>");
  html = html.replace(/`(.*?)`/g, "<code>$1</code>");
  html = html.replace(/\*\*(.*)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\r\n\r\n/g, "</p><p>");
  html = html.replace(/\r\n/g, "<br>");
  return "<p>" + html + "</p>";
}

function toDate(str) {
  return new Intl.DateTimeFormat("en-US").format(Date.parse(str));
}

function render(html) {
  document.querySelector("main").innerHTML = html;
}

(async () => {
  const user = await api("users/perdjurner");
  let issues = await api("repos/perdjurner/blog/issues?state=closed");
  issues = [...issues].sort((a, b) => (a.closed_at < b.closed_at ? 1 : -1));
  let articles = "";
  for (const issue of issues) {
    const labels = issue.labels.reduce((acc, cur, index) => {
      const li = `<li>${cur.name}</li>`;
      acc += index === 0 ? `<ul>${li}` : li;
      return index === issue.labels.length - 1 ? `${acc}</ul>` : acc;
    }, "");
    articles += `
      <article> 
        <div class="date">
          ${toDate(issue.closed_at)}
        </div>
        <div class="title">  
          <h1>${issue.title}</h1>
        </div>
        <div class="labels">
          ${labels}
        </div>
        <div class="post">
          ${toHtml(toEntities(issue.body))}
        </div>
      </article>
    `;
  }
  render(`
    <main>
      ${articles}
    </main>
    <footer>
      <a href="https://twitter.com/perdjurner">
        <img src="/images/twitter.svg" alt="Twitter logo">
        <p>${user.name}</p>
      </a>
    </footer>
`);
})().catch((e) => {
  console.error(e);
});
