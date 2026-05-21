# G·A·I Platform v0.4
## KBU 디자인학과 · (재)경기도경제과학진흥원 디자인 재능나눔 사업

---

## 파일 구조

```
DAI_Platform/
├── index.html          ← 로그인 (역할 선택 + 회원가입)
├── dashboard.html      ← 홈 대시보드
├── intro.html          ← 플랫폼 소개
├── project.html        ← 프로젝트 매칭
├── agent.html          ← AI Agent (Anthropic API 연동)
├── dao.html            ← DAO 거버넌스 (실시간 투표)
├── portfolio.html      ← 포트폴리오 아카이브
└── assets/
    ├── css/style.css   ← 공통 스타일
    └── js/
        ├── firebase.js ← Firebase 초기화 · 공통 유틸
        ├── auth.js     ← 로그인 · 회원가입
        ├── dao.js      ← DAO 투표 로직
        └── agent.js    ← AI Agent API 연동
```

---

## Firebase 설정 방법

### 1단계 — Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com) 접속
2. **새 프로젝트 만들기** → 프로젝트 이름: `gai-platform-kbu`
3. Google Analytics 설정 (선택 사항)

### 2단계 — 웹 앱 추가

1. 프로젝트 홈 → ⚙️ 설정 → **앱 추가** → 웹(`</>`)
2. 앱 닉네임: `GAI Platform`
3. **Firebase SDK 설정값** 복사 (apiKey, authDomain 등)

### 3단계 — `assets/js/firebase.js` 수정

```javascript
const firebaseConfig = {
  apiKey:            "AIzaSy...",        // 복사한 값으로 교체
  authDomain:        "gai-platform-kbu.firebaseapp.com",
  projectId:         "gai-platform-kbu",
  storageBucket:     "gai-platform-kbu.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc123"
};
```

### 4단계 — Authentication 활성화

Firebase Console → **Authentication** → 로그인 방법:
- ✅ 이메일/비밀번호 사용 설정
- ✅ Google 사용 설정 (지원 이메일 입력)

### 5단계 — Firestore 데이터베이스 생성

1. Firebase Console → **Firestore Database** → 데이터베이스 만들기
2. **프로덕션 모드** 선택 → 지역: `asia-northeast3 (서울)`
3. 규칙 탭에서 아래 규칙 적용:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자 본인 데이터
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /contributions/{doc} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      match /agentSessions/{doc} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    // 투표: 로그인한 사용자 모두 읽기, 쓰기
    match /votes/{voteId} {
      allow read: if request.auth != null;
      allow update: if request.auth != null;
    }
    // 프로젝트: 읽기 공개
    match /projects/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    // 포트폴리오: 읽기 공개
    match /portfolios/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### 6단계 — Firestore 초기 데이터 입력

Firestore Console → **데이터** 탭에서 아래 컬렉션/문서 수동 생성:

**votes 컬렉션:**
```
votes/v1: { title:"2025-2학기 산학 평가 루브릭 개정안", pro:36, con:16, total:52, deadline:"D-3" }
votes/v2: { title:"신규 파트너 승인 — ㈜인터렉티브랩", pro:51, con:10, total:61, deadline:"D-6" }
votes/v3: { title:"외부 연구자 데이터 접근 권한 정책", pro:14, con:14, total:28, deadline:"D-12" }
```

---

## GitHub Pages 배포

```bash
# 1. 이 폴더 전체를 GitHub 저장소에 업로드
# 2. Settings → Pages → Branch: main / root
# 3. 배포 URL: https://caritas6.github.io/DAI_Platform/
```

> ⚠️ Firebase 모듈(`type="module"`)은 로컬 파일에서 직접 열면 CORS 오류가 발생합니다.
> 반드시 GitHub Pages 또는 로컬 서버(`npx serve .`)에서 실행하세요.

---

## 기술 스택

| 항목 | 기술 |
|---|---|
| 프론트엔드 | 순수 HTML / CSS / JavaScript (ES Modules) |
| 인증 | Firebase Authentication (이메일 + Google) |
| 데이터베이스 | Firebase Firestore (실시간) |
| AI Agent | Anthropic API (claude-sonnet-4-20250514) |
| 배포 | GitHub Pages |
| 의존성 | 0 (외부 라이브러리 없음) |

---

## 연구 맥락

- **HCI 이론**: Norman(2013) HCD · Nielsen 10 Heuristics · Fogg Behavior Model
- **HCAI 프레임워크**: Shneiderman(2022) Human-Centered AI
- **DAO 거버넌스**: Ostrom(1990) Commons Governance
- **플랫폼**: G·A·I (Governance · AI Agent · Interaction)
