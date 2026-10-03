import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
    </>
  ),
  notFoundComponent: () => (
    <main className="mx-auto max-w-[1360px] px-5 py-16 sm:px-10">
      <h1 className="mb-6 text-2xl font-bold">페이지를 찾을 수 없어요.</h1>
      <Link className="text-blue-600 underline underline-offset-4" to="/">영화 목록으로 돌아가기</Link>
    </main>
  ),
});
