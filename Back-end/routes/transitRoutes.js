// routes/transitRoutes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY; // .env 파일에 저장한 카카오 REST API 키
const KAKAO_API_URL = 'https://apis.kakao.com/v1/geo/transit';

router.get('/', async (req, res) => {
    const destination = req.query.destination;

    try {
        const response = await axios.get(KAKAO_API_URL, {
            headers: {
                Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
            },
            params: {
                query: destination,
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error('카카오 API 호출 오류:', error);
        res.status(500).json({ error: 'API 호출 오류가 발생했습니다.' });
    }
});

module.exports = router;
