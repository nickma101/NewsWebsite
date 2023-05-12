//getting article id from url
export default function get_article_id() {
  const params = new URLSearchParams(window.location.search);
  return params.get("article_id");
}
