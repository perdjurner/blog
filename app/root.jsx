import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";

import styles from "./css/styles.css";
import laptop from "./css/laptop.css";
import tablet from "./css/tablet.css";
import phoneLandscape from "./css/phone-landscape.css";
import phonePortrait from "./css/phone-portrait.css";

export const links = () => {
  return [
    {
      rel: "stylesheet",
      media: "print",
      onload: "this.onload=null;this.removeAttribute('media');",
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
    },
    {
      rel: "icon",
      href: "/images/favicon.ico",
      type: "image/x-icon",
    },
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: laptop, media: "(max-width: 1199px)" },
    { rel: "stylesheet", href: tablet, media: "(max-width: 991px)" },
    { rel: "stylesheet", href: phoneLandscape, media: "(max-width: 767px)" },
    { rel: "stylesheet", href: phonePortrait, media: "(max-width: 374px)" },
  ];
};

export const meta = () => {
  return {
    viewport: "width=device-width, initial-scale=1.0",
    description: "Dev blog",
    title: "Per Djurner",
  };
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
      </head>
      <body>
        <main>
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
        <script src="/js/scripts.js" defer></script>
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
