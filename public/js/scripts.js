(async () => {
  document.fonts.load("1em Inter").then(() => {
    document.querySelector("main").classList.add("loaded");
  });
})().catch((e) => {
  console.error(e);
});
