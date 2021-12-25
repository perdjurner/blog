import { Link, useLocation } from "remix";
import ReactMarkdown from "react-markdown";
import { toDate } from "~/utils/misc";

export default function PostComponent({ post, author }) {
  const { pathname } = useLocation();
  return (
    <article>
      <div className="date">{toDate(post.closedAt)}</div>
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
        <p className="author">
          <a href="https://twitter.com/perdjurner">
            <img src="/images/twitter.svg" alt="Twitter logo" />
            <span>{author}</span>
          </a>
        </p>
      </div>
    </article>
  );
}
