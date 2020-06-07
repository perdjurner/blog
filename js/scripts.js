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
  html = html.replace(/`{3}([.\s\S]*?)`{3}/g, "<pre>$1</pre>");
  html = html.replace(/`(.*?)`/g, "<code>$1</code>");
  html = html.replace(/\*\*(.*)\*\*/g, "<strong>$1</strong>");
  return html;
}

function toDate(str) {
  return new Intl.DateTimeFormat("en-US").format(Date.parse(str));
}

function render(html) {
  document.querySelector("main").innerHTML = html;
}

(async () => {
  const user = await api("users/perdjurner");
  const issues = await api("repos/perdjurner/blog/issues");
  let articles = "";
  for (const issue of issues) {
    if (issue.state === "open") {
      const labels = issue.labels.reduce((acc, cur, index) => {
        const li = `<li>${cur.name}</li>`;
        acc += index === 0 ? `<ul>${li}` : li;
        return index === issue.labels.length - 1 ? `${acc}</ul>` : acc;
      }, "");
      articles += `
      <article> 
        <div class="date">
          ${toDate(issue.created_at)}
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
