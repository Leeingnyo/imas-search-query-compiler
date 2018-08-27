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
    'name': 'name.ko',
    'type': 'trackType',
    'artists': { edge: `out('ParticipatesIn')` },
    'number_of_artists': `in('ParticipatesIn').size()`,
    'song': { edge: `in('OriginatedFrom')` },
    'album': { edge: `in('BelongsToAlbum')` }
  },
  columnsResolver: function (query) {
    var candidates = {
      '이름': 'name',
      '타입': 'type',
      '아티스트': 'artists',
      '참여한 사람': 'artists',
      '부름': 'artists',
      '부른애': 'artists',
      '참여': 'artists',
      '참여캐릭터': 'artists',
      '참여 캐릭터': 'artists',
      'participated-in': 'artists',
      'participated in': 'artists',
      'ParticipatedIn': 'artists',
      'participatedIn': 'artists',
      '참여수': 'number_of_artists',
      '참여자수': 'number_of_artists',
      '참여 수': 'number_of_artists',
      '참여캐릭터수': 'number_of_artists',
      '참여캐릭터 수': 'number_of_artists',
      '참여 캐릭터수': 'number_of_artists',
      '참여 캐릭터 수': 'number_of_artists',
      '참여한 캐릭터 수': 'number_of_artists',
      '참여한캐릭터 수': 'number_of_artists',
      '참여한 캐릭터수': 'number_of_artists',
      '참여한 캐릭터 수': 'number_of_artists',
      '노래': 'song',
      '곡': 'song',
      '원래곡': 'song',
      '앨범': 'album',
      '수록앨범': 'album',
      '수록된앨범': 'album',
      '수록된 앨범': 'album',
    };
    return candidates[query] || query;
  }
};

const Participatable = {
  name: 'Participatable',
  columns: {
    'name': 'name.hangul',
    'peopleType': 'peopleType',
    'characterType': 'characterType',
    'company': 'company',
    'song': { edge: `out('SongFor')` },
    'tracks': { edge: `in('Track')` },
    'cv': { edge: `in('CV')` },
    'characters': { edge: `out('CV')` },
    'members': { edge: `out('IsMemberOf')` },
    'units': { edge: `in('IsMemberOf')` },
  },
  columnsResolver: function (query) {
    var candidates = {
      '이름': 'name',
      '종류': 'peopleType',
      '역할': 'characterType',
      '회사': 'company',
      '대표곡': 'song',
      '전용곡': 'song',
      '전용': 'song',
      '부른': 'tracks',
      '트랙': 'tracks',
      '참여트랙': 'tracks',
      '참여 트랙': 'tracks',
      '참여한트랙': 'tracks',
      '참여한 트랙': 'tracks',
      '성우': 'cv',
      '캐릭터': 'characters',
      '맡은캐릭터': 'characters',
      '맡은 캐릭터': 'characters',
      '멤버': 'members',
      '속한멤버': 'members',
      '속한 멤버': 'members',
      '유닛': 'units',
      '속한유닛': 'units',
      '속한 유닛': 'units',
    };
    return candidates[query] || query;
  }
};

const Song = {
  name: 'Song',
  columns: {
    'name': 'name.ko',
    'has': { edge: `in('SongFor')` },
    'track': { edge: `out('OriginatedFrom')` }
  },
  columnsResolver(query) {
    var candidates = {
      '이름': 'name',
      '대표곡': 'has',
      '전용': 'has',
      '전용곡': 'has',
      '전용곡인': 'has',
      '전용곡인 캐릭터': 'has',
      '전용곡인캐릭터': 'has',
      '캐릭터': 'has',
      '주인': 'has',
      '트랙': 'track',
    };
    return candidates[query] || query;
  }
};

Album.columns.tracks.class = Track;
Track.columns.artists.class = Participatable;
Track.columns.song.class = Song;
Track.columns.album.class = Album;
Participatable.columns.song.class = Song;
Participatable.columns.tracks.class = Track;
Participatable.columns.cv.class = Participatable;
Participatable.columns.members.class = Participatable;
Participatable.columns.units.class = Participatable;
Song.columns.has.class = Participatable;
Song.columns.track.class = Track;

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
      'relatedPeople': 'Participatable',
      '성우': 'Participatable',
      'voiceActor': 'Participatable',
      '유닛': 'Participatable',
      'unit': 'Participatable',
      '트랙': 'Track',
      'track': 'Track',
      '노래': 'Song',
      'song': 'Song'
    };
    return candidates[query] || query;
  }
};

module.exports = Root;

