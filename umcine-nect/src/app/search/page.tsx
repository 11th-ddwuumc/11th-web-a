import { Suspense } from "react";
import { SearchPage } from "../../views/movies/search-page";

export default function Page() {
  return (
    <Suspense fallback={<div>寃??濡쒕뵫 以?..</div>}>
      <SearchPage />
    </Suspense>
  );
}
