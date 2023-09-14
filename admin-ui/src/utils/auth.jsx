import { createContext, useContext, useState } from "react";
const apiRoot = __API_ROOT__;
const cacheKey = "kwnvowehn-token";
const store = window.localStorage;

function setTokenToCache(token, callback) {
  store.setItem(cacheKey, token);
  callback && typeof callback === "function" && callback();
}

function getTokenFromCache() {
  return store.getItem(cacheKey);
}

function isTokenExpired(token) {
  const decodedToken = atob(token.split(".")[1]);
  const expiresAt = JSON.parse(decodedToken).exp;
  return Date.now() >= expiresAt * 1000;
}

function getRolesFromToken(token) {
  const decodedToken = atob(token.split(".")[1]);
  const roles = JSON.parse(decodedToken).roles;
  return roles;
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
    setTokenToCache("", () => {
      setToken("");
    });
  }

  const isLoggedIn = token !== "";

  if (isLoggedIn && isTokenExpired(token)) {
    logout();
  }

  const roles = isLoggedIn ? getRolesFromToken(token) : [];
  console.log(roles);

  if (isLoggedIn && !roles.includes("ADMIN")) {
    logout();
  }

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
