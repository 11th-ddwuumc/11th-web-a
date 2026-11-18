// src/api/tmdb-client.ts

// 1. ky import
import ky from "ky";
// 2. env import
import {env} from "../config/env";
// 3. tmdbClient 생성 및 export
export const tmdbClient = ky.create({
//    - baseUrl
    baseUrl : `${env.tmdbApiBaseUrl}/`,
//    - headers.Authorization
    headers: {Authorization : `Bearer ${env.tmdbAccessToken}`}
});