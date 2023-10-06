const apiUrl = import.meta.env.VITE_API_URL;

export default {
  name: "games",

  state: {
    games: [],
  },

  getGames: (state) => state.games.games,

  loadGames: (store) => {
    const token = store.getToken();
    if (!token) return null;
    return fetch(`${apiUrl}/games`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error("Failed to load games");
        }
      })
      .then((data) => {
        return {
          games: data,
        };
      });
  },

  init: (store) => {
    store.loadGames();
    store.on("login", () => {
      store.loadGames();
    });
  },
};
