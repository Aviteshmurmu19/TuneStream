import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Local JSON Response
import topChartsData from "./topChartsData.json";
import getSongsByGenreData from "./getSongsByGenre.json";
import { normalizeSong, normalizeSongs } from "./normalize";

const allSongs = [...topChartsData, ...getSongsByGenreData];
const byId = new Map(allSongs.map((song) => [String(song.id), song]));

const findSongById = (songid) => {
  const id = String(songid);
  return byId.get(id) || allSongs.find((s) => String(s.id) === id) || null;
};

const findRelatedSongs = (songid) => {
  const target = findSongById(songid);
  if (!target) return allSongs.slice(0, 10);
  const targetGenres = target.attributes?.genreNames || [];
  const scored = allSongs
    .filter((s) => String(s.id) !== String(songid))
    .map((s) => {
      const overlap = (s.attributes?.genreNames || []).filter((g) =>
        targetGenres.includes(g)
      ).length;
      return { song: s, score: overlap };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((x) => x.song);
  return scored.length ? scored : allSongs.slice(0, 10);
};

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
      queryFn: () => ({ data: normalizeSongs(topChartsData) }),
    }),
    getSongsByGenre: builder.query({
      queryFn: () => ({ data: normalizeSongs(getSongsByGenreData) }),
    }),
    getSongDetails: builder.query({
      queryFn: ({ songid }) => {
        const song = findSongById(songid);
        return { data: song ? normalizeSong(song) : null };
      },
    }),
    getSongRelated: builder.query({
      queryFn: ({ songid }) => ({
        data: normalizeSongs(findRelatedSongs(songid)),
      }),
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
