export async function GET(request: Request, { params }: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;
  const endpoint = path.join("/");
  if (!/^(movie\/(popular|[1-9]\d*)|search\/movie)$/.test(endpoint)) {
    return Response.json({ message: "지원하지 않는 영화 요청이에요." }, { status: 404 });
  }

  const token = process.env.TMDB_ACCESS_TOKEN ?? process.env.VITE_TMDB_ACCESS_TOKEN;
  const baseUrl = process.env.TMDB_API_BASE_URL
    ?? process.env.VITE_TMDB_API_BASE_URL
    ?? "https://api.themoviedb.org/3";
  if (!token) {
    return Response.json({ message: "TMDB 토큰 설정이 필요해요." }, { status: 503 });
  }

  try {
    const url = new URL(endpoint, `${baseUrl.replace(/\/$/, "")}/`);
    url.search = new URL(request.url).search;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      redirect: "error",
    });

    if (!response.ok) {
      return Response.json({ message: "TMDB 요청에 실패했어요." }, { status: response.status });
    }
    return Response.json(await response.json());
  } catch {
    return Response.json({ message: "TMDB 서버에 연결하지 못했어요." }, { status: 502 });
  }
}
