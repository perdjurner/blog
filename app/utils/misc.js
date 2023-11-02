export const toDate = (str) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(Date.parse(str));

export const toSlug = (str) =>
  str
    .replace(/ \./g, " ")
    .replace(/ \/ /g, "-")
    .replace(/ /g, "-")
    .replace(/#/g, "")
    .toLowerCase();

export const preparePosts = (posts) => {
  return posts
    .filter((p) => p.author_association === "OWNER")
    .map((p) => ({
      id: p.id,
      body: p.body,
      title: p.title,
      closedAt: p.closed_at,
      slug: toSlug(p.title),
    }))
    .sort((a, b) => (a.closedAt < b.closedAt ? 1 : -1));
};

export const prepareUser = (user) => {
  return { name: user.name, url: user.html_url };
};
