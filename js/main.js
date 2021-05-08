'use strict'

// 1st: 정보를 담고 있는 배열을 생성
;(() => {
    // variable
    let yOffset = 0; //페이지의 pageOffsetY 값을 대신할 변수
    let prevScrollHeight = 0; // 현재 스크롤 위치 이전의 섹션의 높이값의 합
    let currentScene = 0; // 현재 활성화된 씬의 인덱스
    let enterNewScene = false; //새로운 씬에 들어갈때 true --> 음수방지

    const sceneInfo = [
        {
            // section 0 info
            type: 'sticky',
            heightNum: 5, //브라우져 높이의 "n" 배
            scrollHeight: 0,
            objs: {
                // dom 객체
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d'),
                
            },
            values: {
                // key: 해당돔_속성 value: array[시작값,끝값,범위시작,범위끝]
                // 예) header_opacity: [0, 1, .2, .4];
                messageA_opacity: [0,1,{start: 0.1, end: 0.2}],
                messageB_opacity: [0,1,{start: 0.3, end: 0.4}],
                messageC_opacity: [0,1,{start: 0.3, end: 0.4}],
                messageD_opacity: [0,1,{start: 0.3, end: 0.4}],
            }
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

        yOffset = window.pageYOffset;
        let totalScrollHeight = 0;
        for(let i =0; i < sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if(totalScrollHeight >= yOffset) {
                currentScene = i;
                break; //반복문을 멈추고 빠져나옴 없을시 무조건 currentidex가 3이 된다.
            }
        }
        document.body.setAttribute('id',`show-scene-${currentScene}`);

    }

    function scrollLoop() {
        // 씬의 인덱스를 결정하는 함수
        enterNewScene = false;
        prevScrollHeight = 0;
        for(let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight; 
        }
        // console.log(prevScrollHeight);

        if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true;
            currentScene ++;
            document.body.setAttribute('id',`show-scene-${currentScene}`);

        } else if (yOffset < prevScrollHeight) {
            if(currentScene === 0) return;
            enterNewScene = true;
            currentScene --;
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }
        
        if(enterNewScene) return;
        playAnimation()
    }

    function calcValues(values, currentYOffset) {
        // 현재 섹션에서 스크롤 비율을 계산하고 css 값을 반환하는 함수
        let rv;
        let scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;

        // 구간 정하기
        let valuesLength = values[1] - values[0];
    
        rv = valuesLength * scrollRatio + values[0]; 
        console.log(rv);

        return rv;
    }

    function playAnimation() {
        // 애니메이션 섹션별로 실행시키는 함수

        // dom 변수 간소화
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;

        switch (currentScene) {
            case 0:
                let messageA_opacity_in = calcValues(values.messageA_opacity, currentYOffset);
                objs.messageA.style.opacity = messageA_opacity_in;
                break;
            case 1:
                
                break;
            case 2:
                
                break;
            case 3:
                
                break;
        
        }
    }

    // 이벤트
    // load와 돔컨텐트 로드 차이 => html 구조만 다 받으면,
    window.addEventListener('load',()=>{
        setLayout();
    })
    window.addEventListener('resize', setLayout)
    window.addEventListener('scroll', () => {
        yOffset = pageYOffset;
        scrollLoop();
    })

    // tdd 코드
    scrollLoop();


})()
