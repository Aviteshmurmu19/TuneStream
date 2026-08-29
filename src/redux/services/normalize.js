export const normalizeSong = (song) => {
  if (!song) return song;
  const attrs = song.attributes || {};
  const artworkUrl = attrs.artwork?.url?.replace('{w}', '400').replace('{h}', '400');
  const artistId = song.relationships?.artists?.data?.[0]?.id;
  const previewUrl = attrs.previews?.[0]?.url;
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
    hub: previewUrl
      ? { actions: [null, { uri: previewUrl }] }
      : undefined,
  };
};

export const normalizeSongs = (songs) => {
  if (!Array.isArray(songs)) return songs;
  return songs.map(normalizeSong);
};
