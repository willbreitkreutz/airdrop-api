import routes from "../routes";
window.routes = routes;
export default function useRouter() {
  const path = window.location.href;
  const route = routes(path);
  return [route.value, route.params];
}
