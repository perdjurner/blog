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
  const bio = `
    <h1>${user.name}</h1>
    <hr>
    <p>${user.bio}</p>
    <hr>
  `;
  let articles = "";
  for (const issue of issues) {
    console.log(issue.body);
    articles += `
      <article> 
        <h2>${issue.title}</h2>
        <p>${toHtml(issue.body)}</p>
      </article>
    `;
  }
  const html = `
    <header>
      ${bio}
    </header>
    <main>
      ${articles}
    </main>
  `;
  document.querySelector("body").innerHTML = html;
})().catch((e) => {
  console.error(e);
});
