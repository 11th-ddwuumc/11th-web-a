import { getMoviesWithFetch } from "../api/movies/get-movies-with-fetch";
console.log("getMoviesWithFetch 호출 직전");
getMoviesWithFetch(1)
  .then((response) => console.log(response.results))
  .catch((error) => console.error(error));