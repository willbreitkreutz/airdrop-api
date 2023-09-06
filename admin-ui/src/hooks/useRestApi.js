import { useEffect, useState } from "react";
import hash from "../utils/simple-hash";

const store = window.localStorage;

export function useRestApi({
  getUrl,
  postUrl,
  putUrl,
  deleteUrl,
  staleAfter = 5000,
  token,
}) {
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [at, setAt] = useState(null);

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    const cacheKey = hash(getUrl || new Date());
    const cachedData = store.getItem(`${cacheKey}-items`);
    const cachedAt = store.getItem(`${cacheKey}-at`);
    if (cachedData) {
      setItems(JSON.parse(cachedData));
      setAt(new Date(cachedAt));
    }
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      const cacheKey = hash(getUrl);
      store.setItem(`${cacheKey}-items`, JSON.stringify(items));
      store.setItem(`${cacheKey}-at`, new Date());
    }
  }, [items]);

  useEffect(() => {
    if (at) {
      const now = new Date();
      const diff = now.getTime() - at.getTime();
      if (diff > staleAfter) {
        setAt(null);
      }
    }
  }, [at]);

  useEffect(() => {
    if (at === null) {
      setBusy(true);
      setError(null);
      get();
    }
  }, [at]);

  function get() {
    setBusy(true);
    if (!getUrl) {
      setBusy(false);
      return;
    }
    fetch(getUrl, {
      method: "GET",
      headers: {
        ...{
          Accept: "application/json",
        },
        ...authHeader,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          data = [data];
        }
        console.log(data);
        setItems(data);
        setAt(new Date());
        setBusy(false);
      })
      .catch((error) => {
        setError(error);
      });
  }

  function post(item, callback) {
    fetch(postUrl, {
      method: "POST",
      headers: {
        ...{
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        ...authHeader,
      },
      body: JSON.stringify(item),
    })
      .then((response) => {
        if (response.ok) {
          setAt(null);
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((json) => {
        console.log("json", json);
        if (callback && typeof callback === "function") {
          callback(json);
        }
      })
      .catch((error) => {
        setError(error);
      });
  }

  function put(item, callback) {
    fetch(putUrl, {
      method: "PUT",
      headers: {
        ...{
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        ...authHeader,
      },
      body: JSON.stringify(item),
    })
      .then((response) => {
        if (response.ok) {
          return setAt(null);
        }
        throw new Error("Network response was not ok.");
      })
      .then(() => {
        if (callback && typeof callback === "function") {
          callback();
        }
      })
      .catch((error) => {
        setError(error);
      });
  }

  function del(item, callback) {
    fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        ...{
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        ...authHeader,
      },
      body: JSON.stringify(item),
    })
      .then((response) => {
        if (response.ok) {
          return setAt(null);
        }
        throw new Error("Network response was not ok.");
      })
      .then(() => {
        if (callback && typeof callback === "function") {
          callback();
        }
      })
      .catch((error) => {
        setError(error);
      });
  }

  function save(item, callback) {
    if (item.id) {
      put(item, callback);
    } else {
      post(item, callback);
    }
  }

  function remove(item, callback) {
    del(item, callback);
  }

  return { items, save, remove, busy, error };
}
