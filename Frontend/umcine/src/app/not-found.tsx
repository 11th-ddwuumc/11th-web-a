import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-4 text-center">
      <div>
        <h1 className="text-3xl font-bold">페이지를 찾을 수 없어요.</h1>
        <Link href="/" className="mt-4 inline-block font-bold text-[var(--color-action-primary)]">영화 목록으로 돌아가기</Link>
      </div>
    </main>
  );
}
