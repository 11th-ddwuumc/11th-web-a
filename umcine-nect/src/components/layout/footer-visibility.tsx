"use client";
import {usePathname,useSearchParams} from "next/navigation";
export function FooterVisibility({children}:{children:React.ReactNode}){const path=usePathname();const q=useSearchParams().get("query")??"";return path==="/search"&&!q.trim()?null:<>{children}</>}
