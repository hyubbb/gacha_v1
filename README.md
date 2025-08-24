## FSD 구조

src/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── widgets/                # 페이지 수준 위젯
│   └── dashboard/
├── features/               # 비즈니스 기능
│   ├── slot-management/
│   ├── product-management/
│   ├── display-management/
│   └── user-management/
├── entities/               # 비즈니스 엔티티
│   ├── product/
│   ├── slot/
│   └── user/
└── shared/                 # 공통 코드
    ├── ui/
    ├── lib/
    ├── hooks/
    ├── api/
    └── config/


•	src/app/ → Next.js 라우팅과 페이지 단위 구성 (layout.tsx, page.tsx 등)
•	src/shared/ → 공통 유틸, 스타일, 훅, API 클라이언트, 설정 등
•	src/widgets/ → 페이지 안에서 큰 단위의 UI 블록 (여러 feature와 entity를 묶은 복합 컴포넌트)
•	src/entities/ → 시스템에서 사용하는 핵심 도메인 객체 (product, slot, user 등)
•	src/features/ → 독립적인 비즈니스 기능 단위 (CRUD, 검색, 필터링 등)

•	api/
    •	이 기능에서만 쓰는 API 호출 함수
    •	예: fetchProducts.ts, createProduct.ts, updateProduct.ts
•	model/
    •	상태 관리, 비즈니스 로직, 타입 정의가 들어감
    •	React Query 훅(useProductsQuery.ts)
    •	Zustand, Redux slice
    •	데이터 변환 유틸
    •	TypeScript 타입 (Product, ProductFormData 등)
•	ui/
    •	이 기능에서만 쓰는 UI 컴포넌트
    •	예: ProductForm.tsx, ProductTable.tsx


## model의 구조

features/.../model/
├── types.ts          # 타입
├── constants.ts      # 상수
├── store.ts          # Zustand/Redux 등 상태
├── selectors.ts      # 파생 데이터 (store 의존 O)
├── hooks.ts          # React Query/커스텀 훅
├── services.ts       # 비즈니스 로직(비동기/동기)
└── index.ts          # 공개 API만 export

// ✅ 타입/상수는 거의 항상 공개
export * from './types';
export * from './constants';

// ✅ 외부에서 써야 하는 훅/셀렉터만 선별 공개
export { useProductsQuery, useCreateProduct } from './hooks';
export { selectLowStockProducts } from './selectors';

// ⛔ store의 내부 구현은 가려두고, 필요한 액션/바운드만 노출
export { useProductStoreActions } from './store';

// ⛔ services는 꼭 필요한 “퍼사드”만 노출 (구현 helper는 숨김)
export { createProductFacade, updateProductFacade } from './services';