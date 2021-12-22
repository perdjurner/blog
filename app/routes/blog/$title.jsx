import { Link, useLoaderData } from "remix";
import { api } from "~/utils/github.server";
import { preparePosts, toSlug } from "~/utils/misc";
import PostComponent from "~/components/post";

export const loader = async ({ params }) => {
  let [user, posts] = await Promise.all([
    await api("users/perdjurner"),
    await api("repos/perdjurner/blog/issues?state=closed"),
  ]);
  posts = preparePosts(posts).filter((p) => toSlug(p.title) === params.title);
  return { user, posts };
};

export default function Post() {
  const { user, posts } = useLoaderData();
  const p = posts[0];
  return (
    <>
      <p className="home">
        &larr; <Link to="/">Home</Link>
      </p>
      <PostComponent key={p.id} post={p} author={user.name}></PostComponent>
    </>
  );
}
