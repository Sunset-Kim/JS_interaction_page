'use strict'

// 1st: 정보를 담고 있는 배열을 생성
;(() => {
    // variable
    let yOffset = 0; //페이지의 pageOffsetY 값을 대신할 변수
    let prevScrollHeight = 0; // 현재 스크롤 위치 이전의 섹션의 높이값의 합
    let currentScene = 0; // 현재 활성화된 씬의 인덱스


    const sceneInfo = [
        {
            // section 0 info
            type: 'sticky',
            heightNum: 5, //브라우져 높이의 "n" 배
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
            },
        },
        {
            // section 1 info
            type: 'normal',
            heightNum: 5, //브라우져 높이의 "n" 배
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1'),
            },
        },
        {
            // section 2 info
            type: 'sticky',
            heightNum: 5, //브라우져 높이의 "n" 배
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2'),
            },
        },
        {
            // section 3 info
            type: 'sticky',
            heightNum: 5, //브라우져 높이의 "n" 배
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3'),
            },
        },
    ]

    function setLayout() {
        // 스크롤 높이값 세팅 함수
        for (let i = 0; i < sceneInfo.length; i++) {
            sceneInfo[i].scrollHeight =
                sceneInfo[i].heightNum * window.innerHeight;
            sceneInfo[i].objs.container.style.height =
                sceneInfo[i].scrollHeight + 'px';
        }
    }

    function scrollLoop() {
        // 씬의 인덱스를 결정하는 함수
        prevScrollHeight = 0;
        for(let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight; 
            console.log(prevScrollHeight);
        }
    }

    // 이벤트
    window.addEventListener('resize', setLayout)
    window.addEventListener('scroll', () => {
        yOffset = pageYOffset;
        scrollLoop()
    })

    // tdd 코드
    setLayout()
    scrollLoop();


})()
