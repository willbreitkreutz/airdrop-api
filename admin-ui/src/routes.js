import featherRouteMatcher from "feather-route-matcher";
import Home from "./app-pages/home/home";
import Games from "./app-pages/games/games";
import GameDetail from "./app-pages/game-detail/game-detail";
import Users from "./app-pages/users/users";
import NewGame from "./app-pages/game-new/game-new";
import GameWatch from "./app-pages/game-watch/game-watch";

export default featherRouteMatcher({
  "/": Home,
  "/games": Games,
  "/games/new": NewGame,
  "/games/:joinCode": GameDetail,
  "/games/:joinCode/watch": GameWatch,
  "/users": Users,
  "*": "NotFound",
});
