import { cache } from "./cache.server";

const api = async (url) => {
  if (cache.has(url)) {
    return cache.get(url);
  } else {
    const baseUrl = "https://api.github.com";
    const data = await fetch(`${baseUrl}/${url}`).then((res) => res.json());
    cache.set(url, data);
    return data;
  }
};

export { api };
