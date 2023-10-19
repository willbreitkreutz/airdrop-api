import LoginForm from "./_login-form";
import Welcome from "./_welcome";
import { useAuth } from "../../utils/auth";
import { useEffect } from "react";

export default function Home() {
  const { isLoggedIn } = useAuth();
  console.log("isLoggedIn home", isLoggedIn);
  useEffect(() => {
    if (isLoggedIn) console.log("logged in");
  }, [isLoggedIn]);
  useEffect(() => {
    console.log("rendering home");
    return () => {
      console.log("unmounting home");
    };
  });
  return <div>{isLoggedIn ? <Welcome /> : <LoginForm />}</div>;
}
