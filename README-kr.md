# Wonderlogy

[![English](https://img.shields.io/badge/English-README.md-blue)](./README.md)

> 여행자들이 자유롭고 즐거운 여행을 할 수 있도록 도와주는 무계획 여행 도우미 웹 애플리케이션입니다.

## 🌟 개요

Wonderlogy는 세부적인 여행 계획을 세우는 것이 어려운 사람들을 위한 웹 애플리케이션입니다. 사용자는 관심있는 장소들을 미리 등록해놓고, 실제 여행 중에 그때그때 원하는 목적지를 선택하여 유연한 여행 경로를 만들고 기억에 남는 경험을 쌓을 수 있습니다.

## ✨ 주요 기능

- **여행 전 계획**: 여행 전에 관심있는 장소들을 등록하고 관리
- **즉석 경로 생성**: 여행 중 실시간으로 즉석 여행 경로 생성
- **여행 추억 기록**: 여행 경험을 저장하고 문서화
- **유연한 여행 경험**: 무계획적이지만 흥미진진한 여행 모험 즐기기

## 🏗️ 프로젝트 구조

세 개의 주요 패키지로 구성된 모노레포입니다:

```
wonderlogy/
├── client/          # React 프론트엔드 애플리케이션
├── server/          # Hono 백엔드 API 서버
├── shared/          # 공유 타입 및 유틸리티
└── package.json     # 루트 워크스페이스 설정
```

## 🛠️ 기술 스택

### 프론트엔드 (Client)
- **프레임워크**: React 19 with TypeScript
- **빌드 도구**: Vite
- **UI 컴포넌트**: Radix UI 기반 커스텀 컴포넌트
- **스타일링**: Tailwind CSS
- **국제화**: i18next와 React 통합
- **상태 관리**: React hooks와 context
- **아이콘**: Lucide React

### 백엔드 (Server)
- **런타임**: Bun
- **프레임워크**: Hono (경량 웹 프레임워크)
- **언어**: TypeScript
- **데이터베이스**: PostgreSQL with native `pg` driver
- **인증**: JWT with bcrypt 패스워드 해싱
- **테스팅**: Jest with coverage support

### 공유 (Shared)
- **타입**: 공통 TypeScript 인터페이스 및 타입
- **유틸리티**: 클라이언트와 서버 간 공유 유틸리티 함수

### 개발 도구
- **패키지 매니저**: Bun (with npm workspaces)
- **린팅**: ESLint with TypeScript support
- **Git 훅**: Husky with lint-staged
- **프로세스 관리**: Concurrently for running multiple services

## 🚀 시작하기

### 사전 요구 사항

- [Bun](https://bun.sh) (최신 버전)
- [Node.js](https://nodejs.org) (호환성을 위해)
- [PostgreSQL](https://postgresql.org) (데이터베이스용)

### 설치

1. 저장소를 클론합니다:
```bash
git clone <repository-url>
cd wonderlogy
```

2. 의존성을 설치합니다:
```bash
bun install
```

3. 데이터베이스를 설정합니다:
```bash
cd server
bun run db:create
```

### 개발

#### 모든 서비스 실행 (권장):
```bash
bun run dev
```
다음 서비스들이 시작됩니다:
- Shared 패키지 (watch 모드)
- 서버 `http://localhost:3000`
- 클라이언트 `http://localhost:5173`

#### 개별 서비스 실행:

**프론트엔드만:**
```bash
bun run dev:client
```

**백엔드만:**
```bash
bun run dev:server
```

**공유 패키지:**
```bash
bun run dev:shared
```

### 빌드

#### 모든 패키지 빌드:
```bash
bun run build
```

#### 개별 빌드:
```bash
bun run build:client   # 프론트엔드 빌드
bun run build:server   # 백엔드 빌드
bun run build:shared   # 공유 패키지 빌드
```

## 🧪 테스팅

### 서버 테스트
```bash
cd server
bun run test           # 테스트 한 번 실행
bun run test:watch     # 테스트 watch 모드
bun run test:coverage  # 커버리지와 함께 테스트 실행
bun run test:ci        # CI/CD용 테스트 실행
```

### 타입 체킹
```bash
cd server
bun run typecheck      # TypeScript 타입 체크
```

## 📁 프로젝트 세부사항

### 클라이언트 아키텍처
- **React 19**: 최신 React와 현대적인 훅 및 기능
- **TypeScript**: 애플리케이션 전반의 완전한 타입 안전성
- **컴포넌트 라이브러리**: Radix UI 기반 커스텀 UI 컴포넌트
- **라우팅**: 현대적인 React 라우팅 패턴
- **에러 바운더리**: 포괄적인 에러 처리
- **국제화**: 다국어 지원

### 서버 아키텍처
- **Hono 프레임워크**: 빠르고 경량화된 웹 프레임워크
- **PostgreSQL 통합**: 타입 안전성을 갖춘 직접 데이터베이스 쿼리
- **JWT 인증**: 안전한 사용자 인증 시스템
- **RESTful API**: 적절한 HTTP 메서드를 사용한 깔끔한 API 설계
- **데이터베이스 마이그레이션**: 버전 관리되는 데이터베이스 스키마 변경

### 데이터베이스 스키마
- 사용자 인증 및 관리
- 여행 목적지 저장
- 경로 계획 및 히스토리
- 여행 추억 및 사진 저장

## 🌍 국제화

애플리케이션은 다음 언어를 지원합니다:
- English (기본값)
- Korean (한국어)

언어 파일은 `client/src/i18n/`에 위치합니다.

## 📦 패키지 스크립트

### 루트 레벨
- `bun run dev` - 모든 서비스를 개발 모드로 시작
- `bun run build` - 모든 패키지 빌드
- `bun run dev:client` - 클라이언트만 시작
- `bun run dev:server` - 서버만 시작
- `bun run dev:shared` - 공유 패키지를 watch 모드로 시작

### 클라이언트
- `bun run dev` - Vite 개발 서버 시작
- `bun run build` - 프로덕션용 빌드
- `bun run lint` - ESLint 실행
- `bun run preview` - 프로덕션 빌드 미리보기

### 서버
- `bun run dev` - 핫 리로드와 함께 서버 시작
- `bun run build` - TypeScript 컴파일
- `bun run test` - 테스트 suite 실행
- `bun run db:create` - 데이터베이스 테이블 생성
- `bun run db:migrate-v2` - 데이터베이스 마이그레이션 실행

## 🤝 기여하기

1. 저장소를 포크합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 엽니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 라이선스가 부여됩니다 - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👨‍💻 작성자

zerodice0

## 🔗 링크

- [BHVR](https://github.com/stevedylandev/bhvr)
- [English Documentation](./README.md)

---

**서비스 컨셉**: *"무계획적이지만 재밌는 여행 경험!"*