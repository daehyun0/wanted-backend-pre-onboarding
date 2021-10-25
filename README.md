# [위코드 x 원티드] 백엔드 프리온보딩 선발 과제

## 구현한 방법과 이유에 대한 간략한 내용
- env 폴더 안의 시크릿 키는 Git repo가 아닌 별도의 저장소, 혹은 실행 환경에서 관리되어야 함을 알고 있으나, 과제의 용이한 제출을 위해 repo에 포함시켰습니다.
- Express, Sequelize, sqlite3를 이용하엿습니다. 
- jest를 이용해 Service에 대해 TDD 방식으로 개발했습니다.
  - sequelize를 처음 다뤄보았기에 학습 테스트 겸 테스트를 진행했습니다.
- jwt를 이용해 로그인 관리를 합니다. 
- Springboot를 통해 백엔드를 처음 접해보았기 떄문에 Entity / Service / Controller와 같은 형태로 나누었습니다.
  - DAO, Service, Route(Controller)
  - DTO
- bcrypt, jsonwebtoken 패키지를 직접 사용하지 않고 password-utils, user-token-utils로 나누었습니다. 이유는 추후 다른 형태의 암호화 패키지나 토큰을 사용할 경우, utils 파일을 변경하는 것으로 의존성을 변경하기 편하다고 생각했기 때문입니다.
- error의 경우 http status code와 비슷하게 사용할 수 있도록 구분했습니다
- commit message는 angular commit convention format에 따라 작성하였습니다.

## 자세한 실행 방법
1. npm run start을 통해 서버를 실행한다. 
- postman을 통해 엔드포인트를 호출하거나
- shell(terminal)을 통해 엔드포인트를 호출한다. (API 명세에 함께 첨부)

## API 명세 (실행 예제)
- 유저 로그인
  ```
  curl -L http://localhost:3000/user/login -H "Accept: application/json" -H "Content-Type: application/json" -d '{"id": "jane1","password": "1234"}'
  
  200 OK
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyUGsiOjIsImlhdCI6MTYzNTE4MDExMiwiZXhwIjoxNjM1Nzg0OTEyLCJzdWIiOiJ1c2VySW5mbyJ9.JQBJN46NnIsjbPfG2k7ZlkIdxUqQuZsyXHzpuxM2A8o"
  }
  
  401 Unauthorized
  NOT_FOUND_ID, WRONG_PASSWORD
  ```

- 유저 로그아웃
  ```
  curl -X 'POST' -L http://localhost:3000/user/logout
  
  204 
  <내용 없음>
  ```

- 게시글 하나 가져오기
  ```
  curl http://localhost:3000/article/:id

  200 OK
  {
    "no": 2,
    "title": "title2",
    "body": "body2",
    "writer": "jane1nickname",
    "createdAt": "2021-10-23T16:46:44.798Z"
  }
  
  404 NOT FOUND
  NOT_FOUND_ARTICLE
  ```
- 게시글 리스트 가져오기
  ```
  curl http://localhost:3000/articles?pageNum=:pageNum&count=:count
  (pageNum > 0, count > 0)
  
  200 OK
  [
    {
      "no": 19,
      "title": "title19",
      "body": "body19",
      "writer": "jane18nickname",
      "createdAt": "2021-10-06T16:46:44.799Z"
    },
    {
      "no": 18,
      "title": "title18",
      "body": "body18",
      "writer": "jane17nickname",
      "createdAt": "2021-10-07T16:46:44.799Z"
    },
    {
      "no": 17,
      "title": "title17",
      "body": "body17",
      "writer": "jane16nickname",
      "createdAt": "2021-10-08T16:46:44.799Z"
    },
    ...
  ]
  ```

- 글 쓰기
  ```
  curl http://localhost:3000/article -H "Accept: application/json" -H "Content-Type: application/json" -d '{"title":"title_new","body":"body_new"}' -H "Authorization: bearer \:accessToken"

  200 OK
  {"articlePk":20}
  
  400 Bad Request
  NO_TITLE, NO_BODY
  
  401 Unauthorized
  EXPIRED_TOKEN, INVALID_TOKEN  
  ```

- 글 업데이트
  ```
  curl http://localhost:3000/article/2 -X 'PATCH' -H "Accept: application/json" -H "Content-Type: application/json" -d '{ "title": "title_updated","body":"body_updated" }' -H "Authorization: bearer \:accessToken"

  200 OK
  {"articlePk":20}
  
  400 Bad Request
  NO_TITLE, NO_BODY
  
  401 Unauthorized
  EXPIRED_TOKEN, INVALID_TOKEN
  
  403 Forbidden
  NOT_MATCHED_USER
  
  404 NOT FOUND
  NOT_FOUND_ARTICLE
  ```
- 글 삭제
  ```
  curl http://localhost:3000/article/2 -X 'DELETE' -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: bearer \:accessToken"
  
  204 No Content
  <내용 없음>
  
  401 Unauthorized
  EXPIRED_TOKEN, INVALID_TOKEN
  
  403 Forbidden
  NOT_MATCHED_USER
  
  404 NOT FOUND
  NOT_FOUND_ARTICLE
  ```