import { Link, useLocation } from "remix";
import ReactMarkdown from "react-markdown";
import { toDate } from "~/utils/misc";

export default function PostComponent({ post, user }) {
  const { pathname } = useLocation();
  return (
    <article>
      <div className="date">
        {toDate(post.closedAt)}
        <br />
        <a href={user.url}>{user.name}</a>
      </div>
      <div className="title">
        <h1>
          {pathname === "/" ? (
            <Link prefetch="intent" to={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          ) : (
            post.title
          )}
        </h1>
      </div>
      <div />
      <div className="post">
        <ReactMarkdown>{post.body}</ReactMarkdown>
        {pathname !== "/" ? (
          <p className="back">
            <Link to="/">Home</Link>
          </p>
        ) : null}
      </div>
    </article>
  );
}
