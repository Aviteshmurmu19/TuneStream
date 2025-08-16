import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Local JSON Response
import topChartsData from "./topChartsData.json";
import getSongsByGenreData from "./getSongsByGenre.json";

export const shazamCoreApi = createApi({
  reducerPath: "shazamCoreApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://shazam-core.p.rapidapi.com/v1",
    prepareHeaders: (headers) => {
      headers.set(
        "X-RapidAPI-Key",
        import.meta.env.VITE_SHAZAM_CORE_RAPID_API_KEY
      );
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTopCharts: builder.query({
      queryFn: () => {
        return { data: topChartsData };
        // query: (countryCode) => ({
        // url: "/charts/world",
        // params: { country_code: countryCode },
      },
    }),
    getSongsByGenre: builder.query({
      query: () => {
        return { data: getSongsByGenreData };
        // query: ({ genre, countryCode }) =>
        //   `v1/charts/genre-world?genre_code=${genre}&country_code=${countryCode}`,
      },
    }),
    getSongsByCountry: builder.query({
      query: (countryCode) => `v1/charts/country?country_code=${countryCode}`,
    }),
    getSongsBySearch: builder.query({
      query: (searchTerm) =>
        `v1/search/multi?search_type=SONGS_ARTISTS&query=${searchTerm}`,
    }),
    getArtistDetails: builder.query({
      query: (artistId) => `v2/artists/details?artist_id=${artistId}`,
    }),
    getSongDetails: builder.query({
      query: ({ songid }) => `v1/tracks/details?track_id=${songid}`,
    }),
    getSongRelated: builder.query({
      query: ({ songid }) => `v1/tracks/related?track_id=${songid}`,
    }),
  }),
});

export const {
  useGetTopChartsQuery,
  useGetSongsByGenreQuery,
  useGetSongsByCountryQuery,
  useGetSongsBySearchQuery,
  useGetArtistDetailsQuery,
  useGetSongDetailsQuery,
  useGetSongRelatedQuery,
} = shazamCoreApi;
