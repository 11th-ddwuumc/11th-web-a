export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-[1360px] items-center justify-end gap-2 px-5 py-5 text-[11px] text-gray-500 sm:px-10">
        <img className="w-6 shrink-0" src="/images/logos/tmdb-logo.svg" alt="TMDB" />
        <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </div>
    </footer>
  );
}
