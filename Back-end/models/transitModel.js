// models/transitModel.js
const axios = require('axios');

// 카카오 대중교통 경로 조회 함수 
const getTransitDirections = async (origin, destination) => {
    try {
        const response = await axios.get('https://apis-navi.kakao.com/v1/transit/directions', {
            headers: {
                Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}`, // 템플릿 리터럴 수정
            },
            params: {
                origin,  // 출발지 좌표
                destination,  // 목적지 좌표
            },
        }); 
        return response.data.routes[0].summary; // 요약 정보를 반환
    } catch (error) {
        throw new Error('대중교통 경로 조회에 실패했습니다.');
    }
};

module.exports = {
    getTransitDirections,
};
