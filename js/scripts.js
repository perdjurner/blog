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
  return (
    "<p>" +
    md
      .replace(/`{3}\r\n([.\s\S]*?)\r\n`{3}/g, "<pre>$1</pre>")
      .replace(/([^a-z])\[(.*?)\]\((.*?)\)/g, "$1<a href='$3'>$2</a>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/\*\*(.*)\*\*/g, "<strong>$1</strong>")
      .replace(/([^a-z])_(.*?)_([^a-z])/gi, "$1<strong>$2</strong>$3")
      .replace(/\r\n\r\n/g, "</p><p>")
      .replace(/\r\n/g, "<br>") +
    "</p>"
  );
}

function toDate(str) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(Date.parse(str));
}

function permalink(str) {
  return "/#/" + str.replace(/ /g, "-").toLowerCase();
}

function title(post) {
  const url = permalink(post.title);
  return window.location.hash
    ? post.title
    : `<a href="${url}" onclick="setTimeout(location.reload.bind(location), 1)">${post.title}</a>`;
}

function author(name) {
  return `
    <p class="author">
      <a href="https://twitter.com/perdjurner">
        <img src="/images/twitter.svg" alt="Twitter logo">
        <span>${name}</span>
      </a>
    </p>`;
}

function html(user, posts) {
  let rv = "";
  if (window.location.hash) {
    rv += `<p class="home">&larr; <a href="/">Home</a></p>`;
  }
  for (const post of posts) {
    rv += `
      <article> 
        <div class="date">
          ${toDate(post.closed_at)}
        </div>
        <div class="title">  
          <h1>${title(post)}</h1>
        </div>
        <div>
        </div>
        <div class="post">
          ${toHtml(toEntities(post.body))}
          ${author(user.name)}
        </div>
      </article>
    `;
  }
  return rv;
}

function render(html) {
  document.querySelector("main").innerHTML = html;
}

(async () => {
  // Load user and posts from the GitHub issues API.
  const user = await api("users/perdjurner");
  let posts = await api("repos/perdjurner/blog/issues?state=closed");

  // Make sure only posts created by the repository owner are included.
  posts = posts.filter((elm) => elm.author_association === "OWNER");

  // Get either the post matching the URL hash or sort all posts.
  const hash = window.location.hash.replace(/[^\-a-z]/g, "");
  const byClosedAt = (a, b) => (a.closed_at < b.closed_at ? 1 : -1);
  const onHash = (elm) => hash === elm.title.replace(/ /g, "-").toLowerCase();
  posts = hash ? posts.filter(onHash) : [...posts].sort(byClosedAt);

  // Build and render HTML.
  render(`<main>${html(user, posts)}</main>`);
})().catch((e) => {
  console.error(e);
});
