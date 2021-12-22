const toDate = (str) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(Date.parse(str));

const toSlug = (str) =>
  str
    .replace(/ \./g, " ")
    .replace(/ \/ /g, "-")
    .replace(/ /g, "-")
    .replace(/#/g, "")
    .toLowerCase();

const preparePosts = (posts) => {
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

const prepareUser = (user) => {
  return { name: user.name };
};

export { prepareUser, preparePosts, toDate, toSlug };
