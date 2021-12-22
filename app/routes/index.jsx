import { useLoaderData } from "remix";
import { api } from "~/utils/github.server";
import { prepareUser, preparePosts } from "~/utils/misc";
import PostComponent from "~/components/post";

export const loader = async () => {
  let [user, posts] = await Promise.all([
    await api("users/perdjurner"),
    await api("repos/perdjurner/blog/issues?state=closed"),
  ]);
  user = prepareUser(user);
  posts = preparePosts(posts);
  return { user, posts };
};

export default function Index() {
  const { user, posts } = useLoaderData();
  return (
    <>
      {posts.map((p) => (
        <PostComponent key={p.id} post={p} author={user.name}></PostComponent>
      ))}
    </>
  );
}
