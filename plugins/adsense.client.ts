export default defineNuxtPlugin(() => {
  if (!import.meta.client) return;

  const ID = "adsbygoogle-js";
  if (document.getElementById(ID)) return;

  const s = document.createElement("script");
  s.id = ID;
  s.async = true;
  s.src =
    "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7427499965173279";
  s.crossOrigin = "anonymous";
  document.head.appendChild(s);
});
