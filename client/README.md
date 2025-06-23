# ✈️ Wonderlogy - 무계획 여행 도우미

## 🌟 프로젝트 개요
여행 계획을 세우는 것이 어려운 사람들을 위한 웹 애플리케이션입니다. 사용자가 관심있는 장소들을 미리 리스트업 해놓고, 실제 여행지에서 그때그때 가고싶은 장소를 선택하여 자유로운 여행 경로를 만들고 기록할 수 있습니다.

**서비스 컨셉**: "무계획적이지만 재밌게 여행을 할 수 있는 서비스!"

## 🏗️ 프로젝트 구조

```
wonderlogy/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI 컴포넌트
│   │   │   ├── ui/         # Shadcn/ui 기본 컴포넌트
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── LanguageSwitcher.tsx
│   │   ├── i18n/           # 다국어 관리
│   │   │   ├── index.ts    # i18n 설정
│   │   │   └── translations.ts  # 번역 파일
│   │   ├── lib/            # 유틸리티
│   │   ├── App.tsx         # 메인 앱 컴포넌트
│   │   └── main.tsx        # 앱 진입점
│   ├── public/             # 정적 파일
│   └── package.json
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── routes/         # API 라우트
│   │   ├── types/          # TypeScript 타입 정의
│   │   ├── utils/          # 유틸리티 함수
│   │   └── database.ts     # DB 연결 설정
│   ├── database_schema.sql # PostgreSQL 스키마
│   └── package.json
└── shared/                 # 공유 타입 및 유틸리티
```

## 🛠️ 기술 스택

### Frontend
- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** - 스타일링
- **Shadcn/ui** - UI 컴포넌트 라이브러리
- **react-i18next** - 다국어 지원

### Backend
- **Bun** - JavaScript 런타임
- **Hono** - 웹 프레임워크
- **PostgreSQL** - 데이터베이스
- **TypeScript** - 타입 안전성

## 🌍 다국어 지원 (Internationalization)

이 프로젝트는 한국어, 영어, 일본어를 지원합니다.

### 다국어 시스템 구조
```
src/i18n/
├── index.ts          # i18n 설정 및 초기화
└── translations.ts   # 모든 번역 텍스트
```

### 사용 방법

#### 1. 컴포넌트에서 번역 사용하기
```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('login')}</h1>
      <p>{t('loginDescription')}</p>
    </div>
  );
}
```

#### 2. 새로운 번역 키 추가하기
`src/i18n/translations.ts` 파일에서 각 언어별로 번역을 추가:

```typescript
export const translations = {
  ko: {
    translation: {
      newKey: '새로운 텍스트',
      // ... 기존 번역들
    }
  },
  en: {
    translation: {
      newKey: 'New Text',
      // ... 기존 번역들
    }
  },
  ja: {
    translation: {
      newKey: '新しいテキスト',
      // ... 기존 번역들
    }
  }
};
```

#### 3. 언어 변경하기
사용자는 우상단의 언어 선택 버튼을 통해 언어를 변경할 수 있습니다.
선택된 언어는 localStorage에 저장되어 다음 방문 시에도 유지됩니다.

#### 4. 기본 언어 설정
- 기본 언어: 한국어 (ko)
- 언어 감지 순서: localStorage → 브라우저 언어 → HTML lang 속성

### 현재 지원하는 언어
- 🇰🇷 한국어 (ko)
- 🇺🇸 English (en)  
- 🇯🇵 日本語 (ja)

## 🚀 개발 시작하기

### 필수 요구사항
- Node.js 18+ 또는 Bun
- PostgreSQL 14+

### 환경 설정

1. **환경 변수 설정**
   ```bash
   # .env.local 파일 생성 (개발 환경용)
   cp .env.example .env.local
   ```

2. **환경 변수 값 확인/수정**
   ```bash
   # .env.local 파일 내용
   VITE_API_URL=http://localhost:3000
   ```

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 브라우저에서 http://localhost:5173 접속
```

### 환경 설정 검증

환경 설정이 올바른지 확인하는 방법:

1. **개발자 도구 콘솔 확인**
   - 브라우저를 열고 F12를 눌러 개발자 도구를 엽니다
   - Console 탭에서 환경 설정 로그를 확인합니다:
     ```
     🔧 Current API URL: http://localhost:3000
     🌍 Environment: development
     ✅ API URL is valid
     ```

2. **수동 검증 명령어**
   개발자 도구 콘솔에서 다음 명령어를 실행할 수 있습니다:
   ```javascript
   // 환경 설정 검증
   validateEnv()
   
   // 서버 연결 상태 확인
   checkHealth()
   ```

### 환경별 설정

#### 개발 환경 (Development)
- 파일: `.env.local`
- API URL: `http://localhost:3000`

#### 프로덕션 환경 (Production)
- 파일: `.env.production`
- API URL: 배포된 서버 주소로 설정

```bash
# .env.production 예시
VITE_API_URL=https://your-api-server.com
```

### 문제 해결

1. **로그인/회원가입 버튼이 작동하지 않는 경우**
   - 콘솔에서 API URL 설정을 확인하세요
   - 서버가 실행 중인지 확인하세요

2. **환경 변수가 적용되지 않는 경우**
   - `.env.local` 파일이 올바른 위치에 있는지 확인하세요
   - 개발 서버를 재시작하세요

### 사용 가능한 스크립트
- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run preview` - 빌드 결과 미리보기
- `npm run lint` - ESLint 실행

## ✨ 주요 기능

### 인증 시스템
- 사용자 로그인/회원가입
- JWT 기반 인증
- 폼 유효성 검사

### 사용자 인터페이스
- 반응형 디자인
- 다국어 지원
- 접근성 고려
- 일관된 디자인 시스템

## 📄 라이선스
이 프로젝트는 MIT 라이선스 하에 배포됩니다.
