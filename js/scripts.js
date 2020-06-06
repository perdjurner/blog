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
  html = html.replace(/#{3} (.*)[\s\S]/g, "<strong>$1</strong>");
  return html;
}

(async () => {
  const user = await api("users/perdjurner");
  const issues = await api("repos/perdjurner/blog/issues");
  let articles = "";
  for (const issue of issues) {
    if (issue.state === "open") {
      console.log(issue.body);
      articles += `
      <article> 
        <h1>${issue.title}</h1>
        <p>${toHtml(issue.body)}</p>
      </article>
    `;
    }
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
