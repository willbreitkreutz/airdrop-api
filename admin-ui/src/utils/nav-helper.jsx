import { getNavHelper } from "internal-nav-helper";
import { useAuth } from "./auth";

// eslint-disable-next-line no-undef
const homepage = __HOMEPAGE__;

function doUpdateUrl(url, state = {}) {
  window.history.pushState(state, "", url);
  var popStateEvent = new PopStateEvent("popstate", { state: state });
  dispatchEvent(popStateEvent);
}

export default function NavHelper({ children }) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    console.log(window.location.toString(), homepage);
    if (window.location.toString() !== homepage) {
      // weird race condition between this call and the router setting up it's listener
      setTimeout(() => {
        doUpdateUrl(homepage);
      }, 1);
    }
  }
  return <div onClick={getNavHelper(doUpdateUrl)}>{children}</div>;
}

// eslint-disable-next-line react-refresh/only-export-components
export { doUpdateUrl };
