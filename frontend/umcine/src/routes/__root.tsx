import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <div className="flex h-screen w-full flex-col bg-[#f5f5f7]">
      <Header />
      <main className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto">
        <Outlet />
      </main>

      <footer className="w-full shrink-0 border-t border-gray-200 bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-end gap-2 px-6 py-3">
          <img
            src="/images/logos/tmdb-logo.svg"
            alt="TMDB"
            className="h-auto w-7"
          />
          <p className="text-[11px] text-gray-500">
            This product uses the TMDB API but is not endorsed or certified by
            TMDB.
          </p>
        </div>
      </footer>
    </div>
  ),

  notFoundComponent: () => (
    <div className="flex flex-1 items-center justify-center">
      페이지를 찾을 수 없어요.
    </div>
  ),
});