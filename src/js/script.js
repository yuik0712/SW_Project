let map;
let directionsService;
let directionsRenderer;
let currentLocation;
let recognitionStarted = false;
let hasSpoken = false;
let routeDescription = ""; // 전역 변수로 경로 설명을 저장

// Google 지도 초기화하는 코드
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: { lat: 37.5665, lng: 126.9780 } // 서울 시청 좌표
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        draggable: true,
              map: map,
              panel: document.getElementById("panel"),
    });
    directionsRenderer.setMap(map);

    getCurrentLocation();
}

// 현재 위치 정보를 받아오는 코드
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            document.getElementById('startAddress').textContent = `(${position.coords.latitude}, ${position.coords.longitude})`;
            map.setCenter(currentLocation);
            new google.maps.Marker({
                position: currentLocation,
                map: map,
                title: "현재 위치"
            });
        }, error => {
            document.getElementById('startAddress').textContent = "GPS 정보를 가져오지 못했습니다.";
        });
    } else {
        document.getElementById('startAddress').textContent = "GPS를 지원하지 않는 브라우저입니다.";
    }
}

// 음성 인식 및 텍스트 입력에서 GPT API로 처리 후 경로 검색
async function handleRouteSearch(inputText) {
    const gptResult = await processSpeechWithGPT(inputText);

    if (gptResult) {
        searchRoute(gptResult);
        if (!hasSpoken) {
            hasSpoken = true;
        }
    }
}

// Web Speech API 음성 인식 객체 생성
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.interimResults = false;
recognition.continuous = true;

recognition.addEventListener('result', async function (e) {
    let transcript = Array.from(e.results)
        .map(result => result[0].transcript)
        .join('');
    document.getElementById('endAddress').value = transcript;

    handleRouteSearch(transcript);  // 음성 입력 처리
});

// 원형 클릭 시 음성 인식 시작
document.querySelector('.circle')?.addEventListener('click', function () {
    if (recognitionStarted) return;

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
            document.querySelector('.circle').classList.add('animated');
            document.querySelector('.text').textContent = "말씀해 주세요...";
            recognition.start();
            recognitionStarted = true;
            this.style.pointerEvents = 'none';
        })
        .catch(err => {
            document.querySelector('.text').textContent = "마이크 권한이 필요합니다.";
        });
});

// 이벤트 리스너 기능
recognition.addEventListener('end', function () {
    recognitionStarted = false;
    document.querySelector('.circle').style.pointerEvents = 'auto';
    document.querySelector('.text').textContent = "다시 클릭하여 말씀해 주세요.";
});

// 팝업 열기 버튼 및 GPS 위치 설정
document.querySelector('.btn.close')?.addEventListener('click', function (e) {
    e.stopPropagation();
    document.querySelector('.popup').style.display = 'block';
    document.querySelector('.circle').style.pointerEvents = 'none';
    getCurrentLocation();
});

function closeMainPopup() {
    document.querySelector('.popup').style.display = 'none'; // 팝업 숨기기
}

// 팝업 열기 함수
function openDetailsPopup() {
    document.getElementById('detailsPopup').style.display = 'block';
}

// 팝업 닫기 함수
function closeDetailsPopup() {
    document.getElementById('detailsPopup').style.display = 'none';
}

// 버튼 클릭 이벤트 리스너 추가
document.getElementById('viewRouteDetails').addEventListener('click', openDetailsPopup);

// 음성 합성 (TTS) 함수
function speak(text) {
    if (!('speechSynthesis' in window)) {
        console.log("TTS가 지원되지 않는 브라우저입니다.");
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // TTS 종료 후 초기화
    utterance.onend = () => {
        console.log("TTS 안내가 완료되었습니다.");
        hasSpoken = false;
        recognitionStarted = false;
        document.querySelector('.circle').classList.remove('animated');
        document.querySelector('.text').textContent = "다시 클릭하여 말씀해 주세요.";
        document.querySelector('.circle').style.pointerEvents = 'auto';
    };

    utterance.onerror = (event) => {
        console.error("TTS 실행 중 오류 발생:", event.error);
    };

    // 기존 음성 정리 후 TTS 실행
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
    console.log("TTS 안내 시작:", text);
}

// 경로 검색 함수 (구글 지도)
function searchRoute(destination) {
    console.log("searchRoute 함수 호출됨"); // 함수 호출 확인

    if (!currentLocation) {
        console.error("현재 위치 정보가 없습니다. 위치 설정 후 다시 시도하세요.");
        return;
    }

    if (!destination) {
        console.error("목적지 정보가 유효하지 않습니다.");
        return;
    }

    console.log("현재 위치:", currentLocation); // 현재 위치 확인
    console.log("목적지:", destination);        // 목적지 확인

    const request = {
        origin: currentLocation,
        destination: destination,
        travelMode: google.maps.TravelMode.TRANSIT
    };

    directionsService.route(request, (result, status) => {
        console.log("Directions API 호출됨");  // API 호출 여부 확인
        console.log("Directions API Status:", status);  // API 응답 상태 확인

        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);

            const leg = result.routes[0].legs[0];
            const steps = leg.steps;
            let routeDescription = `현재 위치는 ${leg.start_address}입니다. ${leg.end_address}까지 가는 방법을 알려드릴게요.`;

            steps.forEach((step, index) => {
                const stepDuration = step.duration ? step.duration.text : '정보 없음';

                if (step.travel_mode === 'TRANSIT') {
                    const transitDetails = step.transit;
                    const busNumber = transitDetails.line.short_name || '정보 없음';
                    const departureStop = transitDetails.departure_stop.name || '정보 없음';
                    const arrivalStop = transitDetails.arrival_stop.name || '정보 없음';
                    const numStops = transitDetails.num_stops || '정보 없음';

                    routeDescription += ` ${index + 1}단계: ${busNumber}번 버스를 ${departureStop}에서 승차하여 ${arrivalStop}에서 하차하세요. 소요 시간은 ${stepDuration}입니다.`;
                } else if (step.travel_mode === 'WALKING') {
                    routeDescription += ` ${index + 1}단계: ${step.distance.text}만큼 걸어가세요. 소요 시간은 ${stepDuration}입니다.`;
                }
            });

            routeDescription += ` ${leg.end_address}에 도착했습니다. 전체 소요 시간은 약 ${leg.duration.text}입니다.`;

            if (!hasSpoken) {
                speak(routeDescription);
                hasSpoken = true;
                openDetailsPopup(); // 세부 정보 팝업 열기
            }

        } else {
            console.error("경로를 찾지 못했습니다:", status);
        }
    });
}

// 경로 표시 함수
function displayRoute(origin, destination, service, display) {
    service
        .route({
            origin: origin,
            destination: destination,
            waypoints: [],
            travelMode: google.maps.TravelMode.DRIVING,
            avoidTolls: true,
        })
        .then((result) => {
            display.setDirections(result);
            updateRouteDetails(result); // 경로 상세 정보 업데이트
        })
        .catch((e) => {
            alert("Could not display directions due to: " + e);
        });
}

// 경로 상세 정보 업데이트 함수
function updateRouteDetails(result) {
    routeDescription = ""; // 경로 설명 초기화
    const myroute = result.routes[0];
    if (myroute) {
        myroute.legs.forEach((leg, index) => {
            routeDescription += `구간 ${index + 1}: ${leg.start_address}에서 ${leg.end_address}까지 ${leg.distance.text} 소요\n`;
        });
        document.getElementById("routeDetailsText").innerText = routeDescription;
    }
}

// 음성 안내 기능
function speak(text) {
    if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    } else {
        alert("이 브라우저는 음성 합성을 지원하지 않습니다.");
    }
}

// 음성 안내 시작 함수
document.querySelector("#detailsPopup button").addEventListener("click", () => {
    speak(routeDescription);
});

// 버튼 클릭 이벤트 리스너 추가
document.getElementById('searchRoute').addEventListener('click', function() {
    const destination = document.getElementById('endAddress').value;
    if (destination) {
        searchRoute(destination);
    } else {
        console.error("목적지를 입력하세요.");
    }
});

// Google 지도 API 비동기 로드
function loadScript() {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCfZmkexKmqDQl6I9sTKZST_VNQOvVHNqc&callback=initMap`;
    document.body.appendChild(script);
}

// 스크립트 로드 실행
window.onload = loadScript;

