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
앨범(트랙(참여(이름=[호시이 미키, 시죠 타카네, 가나하 히비키]), 이름=오버마스터))
```

to

```
select * from Album
where @rid in (
  select out('BelongsToAlbum') from Track
  where @rid in (
    select intersect(out('ParticipatesIn')) from Participatable
    where name.hangul in ["호시이 미키", "시죠 타카네", "가나하 히비키"])
  and name.ko = "오버마스터")
```

