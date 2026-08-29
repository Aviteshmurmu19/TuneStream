export const normalizeSong = (song) => {
  if (!song) return song;
  const attrs = song.attributes || {};
  const artworkUrl = attrs.artwork?.url?.replace('{w}', '400').replace('{h}', '400');
  const artistId = song.relationships?.artists?.data?.[0]?.id;
  return {
    ...song,
    key: song.id,
    title: attrs.name,
    subtitle: attrs.artistName,
    images: {
      coverart: artworkUrl,
      background: artworkUrl,
    },
    artists: artistId ? [{ adamid: artistId }] : [],
  };
};

export const normalizeSongs = (songs) => {
  if (!Array.isArray(songs)) return songs;
  return songs.map(normalizeSong);
};
