async function api(url) {
  const baseUrl = "https://api.github.com";
  let fetchData;
  let data = localStorage.getItem(url);
  if (data) {
    data = JSON.parse(data);
    fetchData = parseInt((Date.now() - data.added) / 1000 / 60) >= 10;
  } else {
    fetchData = true;
  }
  if (fetchData) {
    const result = await fetch(`${baseUrl}/${url}`);
    data = { value: await result.json(), added: Date.now() };
    localStorage.setItem(url, JSON.stringify(data));
  }
  return data.value;
}

function toEntities(md) {
  const elm = document.createElement("p");
  elm.textContent = md;
  return elm.innerHTML;
}

function toHtml(md) {
  return "<p>" + 
  md.replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2'>$1</a>")
   .replace(/`{3}([.\s\S]*?)`{3}/g, "<pre>$1</pre>")
   .replace(/`(.*?)`/g, "<code>$1</code>")
   .replace(/\*\*(.*)\*\*/g, "<strong>$1</strong>")
   .replace(/\r\n\r\n/g, "</p><p>")
   .replace(/\r\n/g, "<br>")
  + "</p>";
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
