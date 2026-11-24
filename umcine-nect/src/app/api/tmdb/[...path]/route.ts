import { NextRequest, NextResponse } from "next/server";

async function handler(request: NextRequest, context: { params: Promise<{path:string[]}> }) {
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) return NextResponse.json({message:"TMDB_ACCESS_TOKEN이 없습니다."},{status:500});
  const {path} = await context.params;
  const url = new URL("https://api.themoviedb.org/3/" + path.map(encodeURIComponent).join("/"));
  request.nextUrl.searchParams.forEach((value,key)=>url.searchParams.append(key,value));
  try {
    const response = await fetch(url,{headers:{Authorization:`Bearer ${token}`,Accept:"application/json"},cache:"no-store"});
    return new NextResponse(await response.text(),{status:response.status,headers:{"content-type":response.headers.get("content-type")??"application/json"}});
  } catch {return NextResponse.json({message:"TMDB 요청 실패"},{status:502})}
}
export const GET=handler;
