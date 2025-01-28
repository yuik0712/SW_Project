# SW_Project

# ✅ 간단한 기능 소개
이병준씨가 작성할 것!'
모스 
사회적 약자를 위한 플랫폼

# ⚙️ 개발 환경
IDE : Visual Studio Code
Runtime : Node.js

# ⚒️ 구조
```bash
/SW_Project
│
├── /controllers       # 비즈니스 로직을 처리하는 컨트롤러
│   ├── gptController.js
│   └── transitController.js
│
├── /models            # 모델 (데이터 처리 및 API 호출 관련 로직)
│   └── transitModel.js
│
├── /routes            # API 라우터
│   ├── gptRoutes.js
│   └── transitRoutes.js
│
├── /config            # 환경 설정 (예: dotenv)
│   └── dotenvConfig.js
│
├── /public            
│   ├── index.html  # 웹페이지의 레이아웃을 담당하는 코드
│   ├── index.css  # 웹페이지의 스타일을 담당하는 코드
│   └── script.js  #  웹페이지의 상호작용을 담당하는 코드
│
├── .env               # 환경 변수 파일 (API관련 키)
├── app.js             # Express, 엔드포인트
└── package.json       # npm 패키지 정보
``` 
