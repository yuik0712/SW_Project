// app.js
require('dotenv').config(); // 환경변수 로드
const express = require('express');
const cors = require('cors'); // CORS 미들웨어
const { json } = require('express');

// 라우터 가져오기 
const gptRoutes = require('./routes/gptRoutes');  // GPT 관련 라우터
const transitRoutes = require('./routes/transitRoutes');  // 카카오 대중교통 라우터

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // 모든 오리진 허용
app.use(json()); // JSON 데이터 파싱

// 라우터 연결
app.use('/api/gpt', gptRoutes);  // GPT 경로
app.use('/api/transit', transitRoutes);  // 카카오 대중교통 경로

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
