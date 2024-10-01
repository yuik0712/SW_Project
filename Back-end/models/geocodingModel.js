const axios = require('axios');

const getGeocode = async (address) => {
    try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
           params: {
               q: address,
               format: 'json',
               addressdetails: 1,
               limit: 1,
           },
            headers: {
               'User-Agent': 'lab',  // 요청 시 User-Agent 헤더 추가
            },
        });

        console.log('Geocoding Response:', response.data);  // 응답 로그 추가

        id (response.data.length === 0) {
            throw new Error('주소를 찾을 수 없습니다.');  // 주소가 없을 경우 처리
        }

        const location = response.data[0];
        return {
            lat: location.lat,
            lon: location.lon,
        }; // 위도와 경도를 반환
    } catch (error) {
        console.error('지오코딩 API 호출 오류:', error.message); // 오류 메시지 로그 추가
        throw new Error('지오코딩 조회에 실패했습니다.');
    }
};

module.exports = {
    getGeocode,
};