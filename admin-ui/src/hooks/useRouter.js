import { useEffect, useState } from "react";
import routes from "../routes";
window.routes = routes;

export default function useRouter() {
  const [route, setRoute] = useState(routes(window.location.href));

  useEffect(() => {
    console.log("adding event listener for popstate");
    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  function handleRouteChange() {
    const path = window.location.href;
    const newRoute = routes(path);
    setRoute(newRoute);
  }

  return [route.value, route.params];
}
