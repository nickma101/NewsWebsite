//getting the cid from the url
export default function get_cid() {
  const params = new URLSearchParams(window.location.search);
  return params.get("cid");
}
