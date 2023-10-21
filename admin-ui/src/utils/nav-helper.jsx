import { getNavHelper } from "internal-nav-helper";
import { useAuth } from "./auth";

// eslint-disable-next-line no-undef
const homepage = __HOMEPAGE__;
const basePath = window.location.href.replace(homepage, "");

console.log("homepage", homepage);
console.log("basePath", basePath);

function doUpdateUrl(path, state = {}) {
  const url = homepage + path;
  window.history.pushState(state, "", url);
  var popStateEvent = new PopStateEvent("popstate", { state: state });
  dispatchEvent(popStateEvent);
}

export default function NavHelper({ children }) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    const path = window.location.href.replace(homepage, "");
    if (path !== basePath) {
      // weird race condition between this call and the router setting up it's listener
      setTimeout(() => {
        doUpdateUrl("/");
      }, 1);
    }
  }
  return <div onClick={getNavHelper(doUpdateUrl)}>{children}</div>;
}

// eslint-disable-next-line react-refresh/only-export-components
export { doUpdateUrl };
