import { getNavHelper } from "internal-nav-helper";
import { useAuth } from "./auth";

function doUpdateUrl(url, state = {}) {
  window.history.pushState(state, "", url);
  var popStateEvent = new PopStateEvent("popstate", { state: state });
  dispatchEvent(popStateEvent);
}

export default function NavHelper({ children }) {
  const { isLoggedIn, token } = useAuth();
  console.log(isLoggedIn, token);
  if (!isLoggedIn) {
    if (window.location.pathname !== "/") {
      // weird race condition between this call and the router setting up it's listener
      setTimeout(() => {
        doUpdateUrl("/");
      }, 1);
    }
  }
  return <div onClick={getNavHelper(doUpdateUrl)}>{children}</div>;
}

export { doUpdateUrl };
