# React Fast Refresh 경고 해결하기

## 문제 상황

React 개발 중 다음과 같은 경고 메시지가 나타났습니다:

```
Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components.
```

이 경고는 `src/components/ui/button.tsx` 파일의 59번째 라인에서 발생했습니다.

## 원인 분석

### React Fast Refresh란?

React Fast Refresh는 React 컴포넌트의 상태를 유지하면서 코드 변경사항을 실시간으로 반영하는 기능입니다. 이 기능이 최적으로 작동하려면 특정 조건을 만족해야 합니다.

### 경고 발생 원인

Fast Refresh는 다음과 같은 규칙을 따릅니다:

1. **컴포넌트만 export하는 파일**: 파일이 React 컴포넌트만 export할 때 최적으로 작동
2. **혼합 export 문제**: 컴포넌트와 함께 상수, 함수, 클래스 등을 export하면 Fast Refresh가 제대로 작동하지 않음

우리의 경우 `button.tsx` 파일에서:
```tsx
// 문제가 된 코드
export { Button, buttonVariants }
```

- `Button` 컴포넌트와 `buttonVariants` 상수를 함께 export
- Fast Refresh는 이 파일을 "혼합 export" 파일로 인식
- 결과적으로 최적화된 Hot Reload가 불가능

## 해결 방법

### 1. 상수/함수 분리

상수나 함수를 별도 파일로 분리하여 컴포넌트 파일은 순수하게 컴포넌트만 export하도록 변경:

**Before:**
```tsx
// button.tsx
const buttonVariants = cva(/* ... */);

function Button() {
  // ...
}

export { Button, buttonVariants }; // 혼합 export
```

**After:**
```tsx
// button-variants.ts (새로 생성)
export const buttonVariants = cva(/* ... */);

// button.tsx (수정)
import { buttonVariants } from "./button-variants";

function Button() {
  // ...
}

export { Button }; // 컴포넌트만 export
```

### 2. 파일 구조 개선

```
src/components/ui/
├── button.tsx          # Button 컴포넌트만 export
├── button-variants.ts  # buttonVariants 상수 export
└── ...
```

## 적용 결과

이제 `button.tsx` 파일은:
- React 컴포넌트(`Button`)만 export
- Fast Refresh가 최적으로 작동
- 코드 변경 시 상태를 유지하며 실시간 반영

## 추가 고려사항

### 언제 분리해야 할까?

1. **분리 권장**:
   - 컴포넌트와 함께 export하는 상수/함수가 있는 경우
   - 여러 컴포넌트에서 공유하는 유틸리티 함수
   - 스타일 관련 상수 (cva, styled-components 등)

2. **분리 불필요**:
   - 컴포넌트 내부에서만 사용하는 private 함수/상수
   - 타입 정의 (TypeScript interfaces, types)

### 성능상 이점

- **빠른 피드백**: 코드 변경 시 즉시 반영
- **상태 유지**: 컴포넌트의 상태가 리셋되지 않음
- **개발 효율성**: 재렌더링 시간 단축

## 결론

React Fast Refresh 경고는 단순한 warning이 아닌 개발 경험을 크게 향상시킬 수 있는 중요한 신호입니다. 컴포넌트와 비컴포넌트 코드를 적절히 분리함으로써:

1. Fast Refresh의 모든 이점을 활용
2. 코드 구조의 명확성 향상
3. 유지보수성 개선

이러한 작은 개선사항들이 모여 전체적인 개발 경험을 크게 향상시킵니다.