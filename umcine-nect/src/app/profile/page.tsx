import { ProfileGuard } from "../../components/profile-guard";
import { ProfilePage } from "../../views/auth/profile-page";

export default function Page() {
  return (
    <ProfileGuard>
      <ProfilePage />
    </ProfileGuard>
  );
}
