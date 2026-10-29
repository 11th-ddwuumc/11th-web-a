import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-[var(--color-bg-page)]">
      <Header />
      <Outlet />
    </div>
  ),
  notFoundComponent: () => (
    <main className="grid min-h-[70vh] place-items-center px-4 text-center">
      <div>
        <h1 className="text-3xl font-bold">페이지를 찾을 수 없어요.</h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          주소를 확인하고 다시 시도해 주세요.
        </p>
      </div>
    </main>
  ),
});
