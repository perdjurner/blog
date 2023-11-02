import { Link, useLoaderData } from "remix";
import { api } from "~/utils/github.server";
import { prepareUser, preparePosts, toSlug } from "~/utils/misc";
import PostComponent from "~/components/post";

export const loader = async ({ params }) => {
  let [user, posts] = await Promise.all([
    await api("users/perdjurner"),
    await api("repos/perdjurner/blog/issues?state=closed"),
  ]);
  user = prepareUser(user);
  posts = preparePosts(posts).filter((p) => toSlug(p.title) === params.title);
  return { user, posts };
};

export default function Post() {
  const { user, posts } = useLoaderData();
  const p = posts[0];
  return (
    <>
      <PostComponent key={p.id} post={p} user={user}></PostComponent>
    </>
  );
}
