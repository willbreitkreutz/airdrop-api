import { useAuth } from "../../utils/auth";

export default function Games() {
  const { token } = useAuth();
  return <div>{token}</div>;
}
