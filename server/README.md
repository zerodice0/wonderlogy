# Wonderlogy Server

Hono 기반의 TypeScript 백엔드 서버입니다. JWT 인증 시스템과 PostgreSQL 데이터베이스를 사용합니다.

## 프로젝트 목적

- **인증 시스템**: JWT 토큰 기반 사용자 인증 (회원가입/로그인)
- **API 서버**: RESTful API 제공
- **데이터베이스**: PostgreSQL을 통한 사용자 데이터 관리
- **타입 안전성**: TypeScript로 안전한 코드 작성

## 개발 환경 설정

### 의존성 설치
```bash
bun install
```

### 환경 변수 설정
`.env` 파일을 생성하고 다음 변수들을 설정하세요:
```env
# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wonderlogy
DB_USER=postgres
DB_PASSWORD=your_password

# JWT 설정
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
```

### 개발 서버 실행
```bash
bun run dev
```

서버가 http://localhost:3000 에서 실행됩니다.

## API 엔드포인트

### 인증 API

#### 회원가입
```http
POST /auth/register
Content-Type: application/json

{
  "id": "사용자아이디",
  "password": "비밀번호123",
  "confirmPassword": "비밀번호123"
}
```

#### 로그인
```http
POST /auth/login
Content-Type: application/json

{
  "id": "사용자아이디", 
  "password": "비밀번호123"
}
```

## 테스트

### 테스트 실행
```bash
# 모든 테스트 실행
bun run test

# 테스트 감시 모드 (파일 변경 시 자동 재실행)
bun run test:watch

# 커버리지 리포트와 함께 테스트 실행
bun run test:coverage
```

### 테스트 구성

- **입력값 검증 테스트**: 필수 필드, 최소 길이, 비밀번호 확인 등
- **에러 케이스 테스트**: 잘못된 요청에 대한 적절한 에러 응답
- **성공 케이스 테스트**: 정상 요청에 대한 올바른 응답

테스트는 실제 데이터베이스에 데이터를 저장하지 않고 API 로직만 검증합니다.

## 빌드

```bash
# TypeScript 컴파일
bun run build
```

컴파일된 파일은 `dist/` 디렉토리에 생성됩니다.

## 프로젝트 구조

```
src/
├── routes/          # API 라우트
├── types/           # TypeScript 타입 정의
├── utils/           # 유틸리티 함수 (JWT 등)
├── __tests__/       # 테스트 파일
├── database.ts      # 데이터베이스 연결 설정
└── index.ts         # 메인 앱 엔트리포인트
```
