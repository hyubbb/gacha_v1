FSD 구조

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


src/app/ - Next.js App Router 구조
src/widgets/ - 페이지 수준의 복합 컴포넌트
src/features/ - 비즈니스 기능 단위
src/entities/ - 비즈니스 엔티티
src/shared/ - 공통 재사용 가능한 코드