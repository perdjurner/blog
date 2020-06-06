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

function toHtml(md) {
  html = md;
  html = html.replace(/`{3}([.\s\S]*?)`{3}/g, "<pre>$1</pre>");
  html = html.replace(/`(.*?)`/g, "<code>$1</code>");
  return html;
}

(async () => {
  const user = await api("users/perdjurner");
  const issues = await api("repos/perdjurner/dev/issues");
  let articles = "";
  for (const issue of issues) {
    articles += `
      <article> 
        <h1>${issue.title}</h1>
        <p>${toHtml(issue.body)}</p>
      </article>
    `;
  }
  const html = `
    <main>
      ${articles}
    </main>
    <footer>
      <a href="https://twitter.com/perdjurner">
        <img src="/images/twitter.svg" alt="Twitter logo">
        <p>${user.name}</p>
      </a>
    </footer>
  `;
  document.querySelector("body").innerHTML = html;
})().catch((e) => {
  console.error(e);
});
