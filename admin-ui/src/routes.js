import featherRouteMatcher from "feather-route-matcher";
import Home from "./app-pages/home/home";
import Games from "./app-pages/games/games";
import Users from "./app-pages/users/users";

const origin = window.location.origin;
console.log("origin", origin);

export default featherRouteMatcher({
  [`${origin}/`]: Home,
  [`${origin}/games`]: Games,
  [`${origin}/users`]: Users,
  "*": "NotFound",
});
