"use client";
import {useEffect,useState} from "react";
import {useRouter} from "next/navigation";
import {useAuthStore} from "../stores/auth-store";
export function ProfileGuard({children}:{children:React.ReactNode}){const router=useRouter();const token=useAuthStore(s=>s.accessToken);const [ready,setReady]=useState(false);useEffect(()=>{const check=()=>setReady(true);if(useAuthStore.persist.hasHydrated())check();else return useAuthStore.persist.onFinishHydration(check)},[]);useEffect(()=>{if(ready&&!token)router.replace("/login")},[ready,token,router]);return ready&&token?<>{children}</>:<main className="p-10">로그인 상태 확인 중...</main>}
