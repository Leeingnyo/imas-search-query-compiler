const Album = {
  name: 'Album',
  columns: {
    'tracks': { edge: `out('BelongsToAlbum')` },
    'name': 'name.ko'
  },
  columnsResolver: function (query) {
    var candidates = {
      '트랙': 'tracks',
      '트랙중': 'tracks',
      '트랙 중': 'tracks',
      '트랙수록': 'tracks',
      '수록트랙': 'tracks',
      'track': 'tracks',
      'Track': 'tracks',
      '이름': 'name',
      'names': 'name'
    };
    return candidates[query] || query;
  }
};

const Track = {
  name: 'Track',
  columns: {
    'artists': { edge: `out('ParticipatesIn')` },
    'name': 'name.ko'
  },
  columnsResolver: function (query) {
    var candidates = {
      '이름': 'name',
      '아티스트': 'artists',
      '참여한 사람': 'artists',
      '부름': 'artists',
      '참여': 'artists',
      '참여캐릭터': 'artists',
      '참여 캐릭터': 'artists',
      'participated-in': 'artists',
      'participated in': 'artists',
      'ParticipatedIn': 'artists',
      'participatedIn': 'artists'
    };
    return candidates[query] || query;
  }
};

const Participatable = {
  name: 'Participatable',
  columns: {
    'name': 'name.hangul',
    'song': { edge: `out('SongFor')` }
  },
  columnsResolver: function (query) {
    var candidates = {
      '이름': 'name',
      '대표곡': 'song',
      '전용곡': 'song',
      '전용': 'song'
    };
    return candidates[query] || query;
  }
};

const Song = {
  name: 'Song',
  columns: {
    'name': 'name.ko',
    'has': { edge: `in('SongFor')` }
  },
  columnsResolver(query) {
    var candidates = {
      '이름': 'name',
      '대표곡': 'has',
      '전용곡': 'has',
      '전용곡인': 'has',
      '전용곡인 캐릭터': 'has',
      '전용곡인캐릭터': 'has',
      '캐릭터': 'has'
    };
    return candidates[query] || query;
  }
};

Album.columns.tracks.class = Track;
Track.columns.artists.class = Participatable;
Participatable.columns.song.class = Song;
Song.columns.has.class = Participatable;

var Root = {
  name: 'Root',
  columns: {
    'Album': { class: Album },
    'Song': { class: Song },
    'Track': { class: Track },
    'Participatable': { class: Participatable }
  },
  columnsResolver: function (query) {
    const candidates = {
      '앨범': 'Album',
      'album': 'Album',
      '캐릭터': 'Participatable',
      '등장인물': 'Participatable',
      'character': 'Participatable',
      '사람': 'Participatable',
      '관계자': 'Participatable',
      '트랙': 'Track',
      'track': 'Track',
      '노래': 'Song',
      'song': 'Song'
    };
    return candidates[query] || query;
  }
};

module.exports = Root;

