// controllers/transitController.js
const { getTransitDirections } = require('../models/transitModel'); 

// 경로 정보 요청을 처리하는 함수 
const getTransitRoute = async (req, res) => { 
    const { origin, destination } = req.query; 
    
    try { 
        const routeInfo = await getTransitDirections(origin, destination); 
        const result = `출발지에서 ${routeInfo.duration / 60}분 소요, ${routeInfo.distance / 1000}km 거리에 있습니다. ${routeInfo.steps.length}번 환승합니다.`; 
        
        res.json({ route_summary: result }); 
    } catch (error) { 
        console.error(error); 
        res.status(500).json({ error: '대중교통 경로 조회에 실패했습니다.' });
    }
};

module.exports = {
    getTransitRoute,
};
