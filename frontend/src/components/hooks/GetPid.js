//getting the pid from the url
export default function get_pid() {
  const params = new URLSearchParams(window.location.search);
  return params.get("pid");
}
