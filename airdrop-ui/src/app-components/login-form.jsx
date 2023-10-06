import { useEffect, useState } from "react";
import useStore from "../hooks/useStore";

export default function LoginForm() {
  const { login, errorMsg, clearErrorMsg } = useStore(
    "login",
    "getErrorMsg",
    "clearErrorMsg"
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState(false);

  const borderClass = focused ? "border-secondary" : "border-primary";

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
  };

  useEffect(() => {
    console.log("starting up");
    return () => {
      console.log("shutting down");
      setUsername("");
      setPassword("");
    };
  }, []);
  return (
    <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
      <div className={`card ${borderClass} mb-3`}>
        <div className="card-body">
          <h4 className="card-title">Login</h4>
          <form
            onSubmit={handleSubmit}
            onFocus={() => {
              setFocused(true);
            }}
            onBlur={() => {
              setFocused(false);
            }}
          >
            <div className="form-group mb-2">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                className="form-control"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  clearErrorMsg();
                }}
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                className="form-control"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearErrorMsg();
                }}
              />
              {errorMsg && <p className="text-danger mt-2">{errorMsg}</p>}
            </div>
            <div className="d-flex flex-row justify-content-end">
              <button className="btn btn-secondary" type="submit">
                Login
              </button>
            </div>
            <p className="read-the-docs mt-3">
              Login or create an account to get started
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
