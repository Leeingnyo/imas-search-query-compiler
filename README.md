# Imas Search Query Compiler

검색 쿼리를 OrientDB SQL 쿼리로 컴파일합니다.  
compile the search query to OrientDB SQL query.

## 문법 Grammar

토큰들 tokens

```
open-parenthesis := '('
close-parenthesis := ')'
open-bracket := '['
close-bracket := ']'
comma := ','
operator := '=', '>=', '<=', '!=', '>', '<', '>>'
special := '()[]!=><,'
letters := not( special )
```

문법 grammar

```
query := class-condition
class-condition := letters open-parenthesis conditions close-parenthesis
conditions := condition [ comma condition ]
condition = class-condition | column-condition
column-condition := letters operator expression
expression  := array | constant
array := open-bracket constants close-bracket
constants := constant [ comma constant ]
constant := letters
```

## 사용가능한 클래스 Available Classes

`class.js` 참고

```
Album {
  name
  trakcs: [Track]
}

Track {
  name
  artists: [Artist]
}

Participatable {
  name
}
```

## 쿼리 예시 Query Example

```
앨범(트랙(참여(이름=[호시이 미키, 시죠 타카네, 가나하 히비키]), 이름=Colorful Days))
```

to

```
select * from Album
where @rid in (
  select out('BelongsToAlbum') from Track
  where @rid in (
    select intersect(out('ParticipatesIn')) from Participatable
    where name.hangul in ["호시이 미키", "시죠 타카네", "가나하 히비키"])
  and name.ko = "Colorful Days")
```

## 연산자

나머지는 다 같고 배열과 관련된 연산자가 좀 다르다.
상수값의 타입(숫자와 문자)을 구분해야하는데 아직 하고 있지 않다 (TODO).

1. 이름 >> [호시이 미키, 시죠 타카네, 가나하 히비키]
2. 이름 = [호시이 미키, 시죠 타카네, 가나하 히비키]
3. 이름 << [호시이 미키, 시죠 타카네, 가나하 히비키]

`=` 는 정확히 일치이다.
위의 쿼리 예시를 보면 참여한 사람이 정확히 3명인 트랙이 속한 앨범만 나온다 (아직 구현 안 됨).
`>>` 는 포함이다.
3명이 들어간 트랙이 나온다 (다른 애가 더 들어가 있을 수도 있음).
`<<` 는 이름이 뒤 3개에 포함되는 거라고 보면 된다.
`트랙(노래(이름<<[기도의 날개, 영원한 꽃]))` 쿼리처럼 양립할 수 없는 것(1 대 1 관계)에 사용된다.
