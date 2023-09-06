import featherRouteMatcher from "feather-route-matcher";
import Home from "./app-pages/home/home";
import Games from "./app-pages/games/games";
import GameDetail from "./app-pages/game-detail/game-detail";
import Users from "./app-pages/users/users";
import NewGame from "./app-pages/game-new/game-new";

const origin = window.location.origin;

export default featherRouteMatcher({
  [`${origin}/`]: Home,
  [`${origin}/games`]: Games,
  [`${origin}/games/new`]: NewGame,
  [`${origin}/games/:joinCode`]: GameDetail,
  [`${origin}/users`]: Users,
  "*": "NotFound",
});
