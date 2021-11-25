# github auto inviter

팀에 19.5기 루키 130분을 자동 초대하려다가 너무너무 귀찮아서 만들게 된 ui 툴입니다

스택은 쓸데없이 nextJS입니다.

### 기능

1. repository 에 collaborator 로 초대
   - `/repository` 링크에서 아래 필드를 입력한다.
      1. 깃헙 access token
      2. 소유자 (조직명 또는 유저네임)
      3. 레포 이름
      4. 권한 (read, write, triage, ...)
      5. github username 들 `,`로 join한 거
2. organization과 소속 team에 동시에 초대
   - `/team` 링크에서 아래 필드를 입력한다.
      1. 깃헙 access token
      2. 조직명
      3. 팀 명
      4. github username 들 `,`로 join한 거
   - 초대 버튼을 누른다.

owner: [@woohm402](https://github.com/woohm402)
