import { createContext, useContext, useState } from "react";
const apiRoot = __API_ROOT__;
const cacheKey = "kwnvowehn-token";
const store = window.localStorage;

function setTokenToCache(token) {
  store.setItem(cacheKey, token);
}

function getTokenFromCache() {
  return store.getItem(cacheKey);
}

const defaultState = {
  token: getTokenFromCache() ?? "",
  setToken: () => {},
};

const AuthContext = createContext(defaultState);

function AuthProvider({ children }) {
  const [token, setToken] = useState(defaultState.token);

  async function login({ username, password }) {
    const token = await handleLogin({ username, password });
    setToken(token);
  }

  function logout() {
    setToken("");
    setTokenToCache("");
  }

  const isLoggedIn = token !== "";
  const roles = isLoggedIn ? atob(token.split(".")[1]).roles : [];

  return (
    <AuthContext.Provider value={{ login, logout, token, isLoggedIn, roles }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useCount must be used within a AuthProvider");
  }
  return context;
}

function handleLogin({ username, password }) {
  return new Promise((resolve, reject) => {
    fetch(`${apiRoot}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Login failed");
        }
      })
      .then((data) => {
        setTokenToCache(data.token);
        resolve(data.token);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export { AuthProvider, useAuth };
