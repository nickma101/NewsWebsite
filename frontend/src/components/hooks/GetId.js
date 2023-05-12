//getting the user id from the url
export default function get_id() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}
