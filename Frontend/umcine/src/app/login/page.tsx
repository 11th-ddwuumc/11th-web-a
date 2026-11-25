import { AuthGuard } from "../../components/layout/auth-guard";
import { LoginPage } from "../../views/auth/login-page";

export default function Page() {
  return <AuthGuard guestOnly><LoginPage /></AuthGuard>;
}
