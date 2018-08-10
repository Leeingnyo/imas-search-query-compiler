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
    'name': 'name.hangul'
  },
  columnsResolver: function (query) {
    var candidates = {
      '이름': 'name'
    };
    return candidates[query] || query;
  }
};

Album.columns['tracks'].class = Track;
Track.columns['artists'].class = Participatable;

var Root = {
  '앨범': { class: Album }
};

module.exports = Root;

