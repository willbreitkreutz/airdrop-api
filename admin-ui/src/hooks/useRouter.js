import { useEffect, useState } from "react";
import routes from "../routes";
window.routes = routes;

// eslint-disable-next-line no-undef
const homepage = __HOMEPAGE__;
const defaultPath = window.location.href.replace(homepage, "");

export default function useRouter() {
  const [route, setRoute] = useState(routes(defaultPath));

  useEffect(() => {
    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  function handleRouteChange() {
    const href = window.location.href;
    const path = href.replace(homepage, "");
    const newRoute = routes(path);
    setRoute(newRoute);
  }

  return [route.value, route.params];
}
