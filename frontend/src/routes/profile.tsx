
import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "../pages/auth/profile-page";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});
