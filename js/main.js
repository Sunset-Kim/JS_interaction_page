'use strict';

// 1st: 정보를 담고 있는 배열을 생성
(() => {
    // variable
    let yOffset = 0; //페이지의 pageOffsetY 값을 대신할 변수
    let prevScrollHeight = 0; // 현재 스크롤 위치 이전의 섹션의 높이값의 합
    let currentScene = 0; // 현재 활성화된 씬의 인덱스
    let enterNewScene = false; //새로운 씬에 들어갈때 true --> 음수방지
    // 감속 변수
    let acc = 0.1;
    let delayedYOffset = 0;
    let rafId = 0;
    let rafState;

    const sceneInfo = [
        {
            // section 0 info
            type: 'sticky',
            heightNum: 5, //브라우져 높이의 "n" 배
            scrollHeight: 0,
            objs: {
                // dom 객체
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector(
                    '#scroll-section-0 .main-message.a'
                ),
                messageB: document.querySelector(
                    '#scroll-section-0 .main-message.b'
                ),
                messageC: document.querySelector(
                    '#scroll-section-0 .main-message.c'
                ),
                messageD: document.querySelector(
                    '#scroll-section-0 .main-message.d'
                ),

                canvas: document.querySelector('#video-canvas-0'),
                context: document
                    .querySelector('#video-canvas-0')
                    .getContext('2d'),
                videoImages: [],
            },
            values: {
                // key: 해당돔_속성 value: array[시작값,끝값,범위:object]
                // 예) header_opacity: [0, 1, {start: 0.2, end: 0.4}];
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
                messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
                messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
                messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],

                messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
                messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
                messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
                messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],

                messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
                messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
                messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
                messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],

                messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
                messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
                messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],

                // 비디오
                videoImageCount: 740,
                imageSequence: [0, 739],
                canvas_opacitiy_in: [0, 1, { start: 0, end: 0.1 }],
                canvas_opacitiy_out: [1, 0, { start: 0.9, end: 1 }],
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
                messageA: document.querySelector('#scroll-section-2 .a'),
                messageB: document.querySelector('#scroll-section-2 .b'),
                messageC: document.querySelector('#scroll-section-2 .c'),
                pinB: document.querySelector('#scroll-section-2 .b .pin'),
                pinC: document.querySelector('#scroll-section-2 .c .pin'),

                canvas: document.querySelector('#video-canvas-2'),
                context: document
                    .querySelector('#video-canvas-2')
                    .getContext('2d'),
                videoImages: [],
            },
            values: {
                // 텍스트
                messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
                messageB_translateY_in: [30, 0, { start: 0.5, end: 0.65 }],
                messageC_translateY_in: [30, 0, { start: 0.7, end: 0.8 }],
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
                messageB_opacity_in: [0, 1, { start: 0.5, end: 0.65 }],
                messageC_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
                messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
                messageB_translateY_out: [0, -20, { start: 0.7, end: 0.75 }],
                messageC_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
                messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
                messageB_opacity_out: [1, 0, { start: 0.7, end: 0.75 }],
                messageC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                pinB_scaleY: [0.5, 1, { start: 0.5, end: 0.65 }],
                pinC_scaleY: [0.5, 1, { start: 0.7, end: 0.8 }],

                // 비디오
                videoImageCount: 168,
                imageSequence: [0, 167],
                canvas_opacitiy_in: [0, 1, { start: 0, end: 0.1 }],
                canvas_opacitiy_out: [1, 0, { start: 0.9, end: 1 }],
            },
        },
        {
            // section 3 info
            type: 'sticky',
            heightNum: 5, //브라우져 높이의 "n" 배
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3'),
                canvasCaption: document.querySelector('.canvas-caption'),
                canvas: document.querySelector('.image-blend-canvas'),
                context: document
                    .querySelector('.image-blend-canvas')
                    .getContext('2d'),
                imagePath: ['./img/blend/blend1.jpg', './img/blend/blend2.jpg'],
                images: [],
            },
            values: {
                rect1X: [0, 0, { start: 0, end: 0 }],
                rect2X: [0, 0, { start: 0, end: 0 }],
                rectStartY: 0,
                blendHeight: [0, 0, { start: 0, end: 0 }],
                canvas_scale: [0, 0, { start: 0, end: 0 }],
                canvasCaption_opacity: [0, 1, { start: 0, end: 0 }],
                canvasCaption_translateY: [20, 0, { start: 0, end: 0 }],
            },
        },
    ];
    function setCanvasImages() {
        // 0 인덱스의 캔버스 이미지
        let imgElem;
        for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
            imgElem = new Image();
            imgElem.src = `./img/canvas_0/main${i + 1}.jpg`;
            sceneInfo[0].objs.videoImages.push(imgElem);
        }
        // 2 인덱스의 캔버스 이미지
        let imgElem2;
        for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
            imgElem2 = new Image();
            imgElem2.src = `./img/canvas_2/aven${i + 1}.jpg`;
            sceneInfo[2].objs.videoImages.push(imgElem2);
        }
        // 3 인덱스의 캔버스 이미지
        let imgElem3;
        for (let i = 0; i < sceneInfo[3].objs.imagePath.length; i++) {
            imgElem3 = new Image();
            imgElem3.src = sceneInfo[3].objs.imagePath[i];
            sceneInfo[3].objs.images.push(imgElem3);
        }
    }

    function checkMenu() {
        if (yOffset > 45) {
            document.body.classList.add('local-nav-sticky');
        } else {
            document.body.classList.remove('local-nav-sticky');
        }
    }

    function setLayout() {
        // 스크롤 높이값 세팅 함수
        for (let i = 0; i < sceneInfo.length; i++) {
            if (sceneInfo[i].type === 'sticky') {
                sceneInfo[i].scrollHeight =
                    sceneInfo[i].heightNum * window.innerHeight;
            } else if (sceneInfo[i].type === 'normal') {
                sceneInfo[i].scrollHeight =
                    sceneInfo[i].objs.container.offsetHeight;
            }
            sceneInfo[i].objs.container.style.height =
                sceneInfo[i].scrollHeight + 'px';
        }

        yOffset = window.pageYOffset;
        let totalScrollHeight = 0;
        for (let i = 0; i < sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if (totalScrollHeight >= yOffset) {
                currentScene = i;
                break; //반복문을 멈추고 빠져나옴 없을시 무조건 currentidex가 3이 된다.
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);
        // 캔버스 사이즈 조절
        const heightRatio = window.innerHeight / 1080;
        sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%,-50%,0) scaleY(${heightRatio})`;
        sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%,-50%,0) scaleY(${heightRatio})`;
    }

    function scrollLoop() {
        // 씬의 인덱스를 결정하는 함수
        enterNewScene = false;
        prevScrollHeight = 0;
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }
        // console.log(prevScrollHeight);

        if (
            delayedYOffset <
            prevScrollHeight + sceneInfo[currentScene].scrollHeight
        ) {
            document.body.classList.remove('scroll-effect-end');
        }

        if (
            delayedYOffset >
            prevScrollHeight + sceneInfo[currentScene].scrollHeight
        ) {
            enterNewScene = true;

            if (currentScene === sceneInfo.length - 1) {
                document.body.classList.add('scroll-effect-end');
            }

            if (currentScene < sceneInfo.length - 1) {
                currentScene++;
            }
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        } else if (delayedYOffset < prevScrollHeight) {
            if (currentScene === 0) return;
            enterNewScene = true;
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }

        if (enterNewScene) return;
        playAnimation();
    }

    function calcValues(values, currentYOffset) {
        // 현재 섹션에서 스크롤 비율을 계산하고 css 값을 반환하는 함수
        let rv;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        // 값의 범위 구하기 => 초기값 + 값의 범위 * 현재 스크롤 값
        let valuesLength = values[1] - values[0];

        if (values.length === 3) {
            // 구간사이에 애니메이션 구하기
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;
            const partScrollRatio =
                (currentYOffset - partScrollStart) / partScrollHeight;
            if (currentYOffset < partScrollStart) {
                rv = values[0];
            } else if (currentYOffset > partScrollEnd) {
                rv = values[1];
            } else if (
                currentYOffset >= partScrollStart &&
                currentYOffset <= partScrollEnd
            ) {
                rv = partScrollRatio * valuesLength + values[0];
            }
        } else {
            rv = scrollRatio * valuesLength + values[0];
        }
        return rv;
    }

    function playAnimation() {
        // 애니메이션 섹션별로 실행시키는 함수

        // dom 변수 간소화
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;
        switch (currentScene) {
            case 0:
                // 캔버스 애니메이션 => 리퀘스트 처리
                // let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                // if(objs.videoImages[sequence]) {
                //     objs.context.drawImage(objs.videoImages[sequence],0,0);
                // };

                if (scrollRatio <= 0.5) {
                    objs.canvas.style.opacity = calcValues(
                        values.canvas_opacitiy_in,
                        currentYOffset
                    );
                } else {
                    objs.canvas.style.opacity = calcValues(
                        values.canvas_opacitiy_out,
                        currentYOffset
                    );
                }

                // 텍스트 애니메이션
                if (scrollRatio <= 0.18) {
                    objs.messageA.style.opacity = calcValues(
                        values.messageA_opacity_in,
                        currentYOffset
                    );
                    objs.messageA.style.transform = `translateY(${calcValues(
                        values.messageA_translateY_in,
                        currentYOffset
                    )}%)`;
                } else {
                    objs.messageA.style.opacity = calcValues(
                        values.messageA_opacity_out,
                        currentYOffset
                    );
                    objs.messageA.style.transform = `translateY(${calcValues(
                        values.messageA_translateY_out,
                        currentYOffset
                    )}%)`;
                }
                if (scrollRatio <= 0.42) {
                    // in
                    objs.messageB.style.opacity = calcValues(
                        values.messageB_opacity_in,
                        currentYOffset
                    );
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(
                        values.messageB_translateY_in,
                        currentYOffset
                    )}%, 0)`;
                } else {
                    // out
                    objs.messageB.style.opacity = calcValues(
                        values.messageB_opacity_out,
                        currentYOffset
                    );
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(
                        values.messageB_translateY_out,
                        currentYOffset
                    )}%, 0)`;
                }

                if (scrollRatio <= 0.62) {
                    // in
                    objs.messageC.style.opacity = calcValues(
                        values.messageC_opacity_in,
                        currentYOffset
                    );
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(
                        values.messageC_translateY_in,
                        currentYOffset
                    )}%, 0)`;
                } else {
                    // out
                    objs.messageC.style.opacity = calcValues(
                        values.messageC_opacity_out,
                        currentYOffset
                    );
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(
                        values.messageC_translateY_out,
                        currentYOffset
                    )}%, 0)`;
                }

                if (scrollRatio <= 0.82) {
                    // in
                    objs.messageD.style.opacity = calcValues(
                        values.messageD_opacity_in,
                        currentYOffset
                    );
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(
                        values.messageD_translateY_in,
                        currentYOffset
                    )}%, 0)`;
                } else {
                    // out
                    objs.messageD.style.opacity = calcValues(
                        values.messageD_opacity_out,
                        currentYOffset
                    );
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(
                        values.messageD_translateY_out,
                        currentYOffset
                    )}%, 0)`;
                }

                break;
            case 1:
                break;
            case 2:
                // 캔버스 애니메이션 =>
                // let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));
                // if(objs.videoImages[sequence2]) {
                //     objs.context.drawImage(objs.videoImages[sequence2],0,0,objs.canvas.width,objs.canvas.height);
                // }

                if (scrollRatio <= 0.5) {
                    objs.canvas.style.opacity = calcValues(
                        values.canvas_opacitiy_in,
                        currentYOffset
                    );
                } else {
                    objs.canvas.style.opacity = calcValues(
                        values.canvas_opacitiy_out,
                        currentYOffset
                    );
                }
                // 텍스트 애니메이션
                if (scrollRatio <= 0.22) {
                    // in
                    objs.messageA.style.opacity = calcValues(
                        values.messageA_opacity_in,
                        currentYOffset
                    );
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(
                        values.messageA_translateY_in,
                        currentYOffset
                    )}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(
                        values.messageA_opacity_out,
                        currentYOffset
                    );
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(
                        values.messageA_translateY_out,
                        currentYOffset
                    )}%, 0)`;
                }

                if (scrollRatio <= 0.68) {
                    // in
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(
                        values.messageB_translateY_in,
                        currentYOffset
                    )}%, 0)`;
                    objs.messageB.style.opacity = calcValues(
                        values.messageB_opacity_in,
                        currentYOffset
                    );
                    objs.pinB.style.transform = `scaleY(${calcValues(
                        values.pinB_scaleY,
                        currentYOffset
                    )})`;
                } else {
                    // out
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(
                        values.messageB_translateY_out,
                        currentYOffset
                    )}%, 0)`;
                    objs.messageB.style.opacity = calcValues(
                        values.messageB_opacity_out,
                        currentYOffset
                    );
                    objs.pinB.style.transform = `scaleY(${calcValues(
                        values.pinB_scaleY,
                        currentYOffset
                    )})`;
                }

                if (scrollRatio <= 0.83) {
                    // in
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(
                        values.messageC_translateY_in,
                        currentYOffset
                    )}%, 0)`;
                    objs.messageC.style.opacity = calcValues(
                        values.messageC_opacity_in,
                        currentYOffset
                    );
                    objs.pinC.style.transform = `scaleY(${calcValues(
                        values.pinC_scaleY,
                        currentYOffset
                    )})`;
                } else {
                    // out
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(
                        values.messageC_translateY_out,
                        currentYOffset
                    )}%, 0)`;
                    objs.messageC.style.opacity = calcValues(
                        values.messageC_opacity_out,
                        currentYOffset
                    );
                    objs.pinC.style.transform = `scaleY(${calcValues(
                        values.pinC_scaleY,
                        currentYOffset
                    )})`;
                }

                // section3 미리 캔버스를 그릴 준비

                if (scrollRatio > 0.9) {
                    const objs = sceneInfo[3].objs;
                    const values = sceneInfo[3].values;
                    const widthRatio = window.innerWidth / objs.canvas.width;
                    const heightRatio = window.innerHeight / objs.canvas.height;

                    let canvasScaleRatio;

                    if (widthRatio <= heightRatio) {
                        // 캔버스보다 브라우저 창이 홀쭉한 경우
                        canvasScaleRatio = heightRatio;
                    } else {
                        // 캔버스보다 브라우저 창이 납작한경우
                        canvasScaleRatio = widthRatio;
                    }

                    objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
                    objs.context.fillStyle = `#fff`;
                    objs.context.drawImage(
                        objs.images[1],
                        0,
                        0,
                        objs.canvas.width,
                        objs.canvas.height
                    );

                    // 화면안에 꽉차는 캔버스 높이 & 너비 구하기
                    const recalculatedInnerWidth =
                        document.body.offsetWidth / canvasScaleRatio;
                    const recalculatedInnerHeight =
                        window.innerHeight / canvasScaleRatio;

                    // 흰색 박스 너비, 위치
                    const whiteRectWidth = recalculatedInnerWidth * 0.3;
                    values.rect1X[0] =
                        (objs.canvas.width - recalculatedInnerWidth) / 2;
                    values.rect1X[1] = values.rect1X[0] - whiteRectWidth;

                    values.rect2X[0] =
                        values.rect1X[0] +
                        recalculatedInnerWidth -
                        whiteRectWidth;
                    values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

                    // 박스 그리기
                    // objs.context.fillRect(values.rect1X[0],0, parseInt(whiteRectWidth), obj.canvas.height);
                    // objs.context.fillRect(values.rect2X[0],0, parseInt(whiteRectWidth), obj.canvas.height);

                    objs.context.fillRect(
                        parseInt(values.rect1X[0]),
                        0,
                        parseInt(whiteRectWidth),
                        objs.canvas.height
                    );

                    objs.context.fillRect(
                        parseInt(values.rect2X[0]),
                        0,
                        parseInt(whiteRectWidth),
                        objs.canvas.height
                    );
                }

                break;
            case 3:
                // 단계설정
                let step = 0;

                // 가로/세로 모두 꽉 차게 하기위해 여기서 세팅(계산 필요)
                const widthRatio = window.innerWidth / objs.canvas.width;
                const heightRatio = window.innerHeight / objs.canvas.height;

                let canvasScaleRatio;

                if (widthRatio <= heightRatio) {
                    // 캔버스보다 브라우저 창이 홀쭉한 경우
                    canvasScaleRatio = heightRatio;
                } else {
                    // 캔버스보다 브라우저 창이 납작한경우
                    canvasScaleRatio = widthRatio;
                }

                objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
                objs.context.fillStyle = `#fff`;
                objs.context.drawImage(
                    objs.images[1],
                    0,
                    0,
                    objs.canvas.width,
                    objs.canvas.height
                );

                // 화면안에 꽉차는 캔버스 높이 & 너비 구하기
                const recalculatedInnerWidth =
                    document.body.offsetWidth / canvasScaleRatio;
                const recalculatedInnerHeight =
                    window.innerHeight / canvasScaleRatio;

                // 브라우져와 캔버스의 높이 값으로 브라우져가 상단에 닿는 구간 구하기
                if (!values.rectStartY) {
                    // values.rectStartY = objs.canvas.getBoundingClientRect().top;
                    // values.rectStartY = objs.canvas.offsetTop; //scale 때문에 제대로 읽어올수 없음.

                    values.rectStartY =
                        objs.canvas.offsetTop +
                        (objs.canvas.height -
                            objs.canvas.height * canvasScaleRatio) /
                            2;

                    values.rect1X[2].start =
                        window.innerHeight / 2 / scrollHeight;
                    values.rect2X[2].start =
                        window.innerHeight / 2 / scrollHeight;

                    values.rect1X[2].end = values.rectStartY / scrollHeight;
                    values.rect2X[2].end = values.rectStartY / scrollHeight;
                }

                // 흰색 박스 너비, 위치

                const whiteRectWidth = recalculatedInnerWidth * 0.2;
                values.rect1X[0] =
                    (objs.canvas.width - recalculatedInnerWidth) / 2;
                values.rect1X[1] = values.rect1X[0] - whiteRectWidth;

                values.rect2X[0] =
                    values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
                values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

                // 박스 그리기
                // objs.context.fillRect(values.rect1X[0],0, parseInt(whiteRectWidth), obj.canvas.height);
                // objs.context.fillRect(values.rect2X[0],0, parseInt(whiteRectWidth), obj.canvas.height);

                objs.context.fillRect(
                    parseInt(calcValues(values.rect1X, currentYOffset)),
                    0,
                    parseInt(whiteRectWidth),
                    objs.canvas.height
                );

                objs.context.fillRect(
                    parseInt(calcValues(values.rect2X, currentYOffset)),
                    0,
                    parseInt(whiteRectWidth),
                    objs.canvas.height
                );

                if (scrollRatio < values.rect1X[2].end) {
                    step = 1;
                    objs.canvas.classList.remove('sticky');
                } else {
                    step = 2;
                    // 캔버스 고정
                    objs.canvas.classList.add('sticky');
                    objs.canvas.style.top = `-${
                        (objs.canvas.height -
                            objs.canvas.height * canvasScaleRatio) /
                        2
                    }px`;

                    // 이미지 블렌드
                    values.blendHeight[0] = 0;
                    values.blendHeight[1] = objs.canvas.height;
                    values.blendHeight[2].start = values.rect1X[2].end;
                    values.blendHeight[2].end =
                        values.blendHeight[2].start + 0.2;
                    const blendHeight = calcValues(
                        values.blendHeight,
                        currentYOffset
                    );

                    let NaturalRatio =
                        objs.images[0].naturalHeight / objs.canvas.height;
                    objs.context.drawImage(
                        objs.images[0],
                        // sorce
                        0,
                        (objs.canvas.height - blendHeight) * NaturalRatio,
                        objs.images[0].naturalWidth,
                        blendHeight * NaturalRatio,
                        // draw
                        0,
                        objs.canvas.height - blendHeight,
                        objs.canvas.width,
                        blendHeight
                    );

                    // 스케일 변화시작
                    if (scrollRatio > values.blendHeight[2].end) {
                        step = 3;
                        values.canvas_scale[0] = canvasScaleRatio;
                        values.canvas_scale[1] =
                            document.body.offsetWidth /
                            (1.5 * objs.canvas.width);
                        values.canvas_scale[2].start =
                            values.blendHeight[2].end;
                        values.canvas_scale[2].end =
                            values.canvas_scale[2].start + 0.2;

                        objs.canvas.style.transform = `scale(${calcValues(
                            values.canvas_scale,
                            currentYOffset
                        )})`;

                        objs.canvas.style.marginTop = `0`;
                    }

                    if (
                        scrollRatio > values.canvas_scale[2].end &&
                        values.canvas_scale[2].end > 0
                    ) {
                        objs.canvas.classList.remove('sticky');
                        objs.canvas.style.marginTop = `${scrollHeight * 0.4}px`;

                        values.canvasCaption_opacity[2].start =
                            values.canvas_scale[2].end;
                        values.canvasCaption_opacity[2].end =
                            values.canvas_scale[2].end + 0.1;
                        values.canvasCaption_translateY[2].start =
                            values.canvasCaption_opacity[2].start;
                        values.canvasCaption_translateY[2].end =
                            values.canvasCaption_opacity[2].end;

                        objs.canvasCaption.style.opacity = calcValues(
                            values.canvasCaption_opacity,
                            currentYOffset
                        );
                        objs.canvasCaption.style.transform = `translate3d(0,${calcValues(
                            values.canvasCaption_translateY,
                            currentYOffset
                        )}%,0)`;
                    }
                }

                break;
        }
    }
    // 리퀘스트 애니메이션
    function loop() {
        delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

        if (!enterNewScene) {
            if (currentScene === 0 || currentScene === 2) {
                const objs = sceneInfo[currentScene].objs;
                const values = sceneInfo[currentScene].values;
                const currentYOffset = delayedYOffset - prevScrollHeight;
                let sequence = Math.round(
                    calcValues(values.imageSequence, currentYOffset)
                );
                if (objs.videoImages[sequence]) {
                    objs.context.drawImage(
                        objs.videoImages[sequence],
                        0,
                        0,
                        objs.canvas.width,
                        objs.canvas.height
                    );
                }
            }
        }

        rafId = requestAnimationFrame(loop);

        if (Math.abs(yOffset - delayedYOffset) < 1) {
            cancelAnimationFrame(rafId);
            rafState = false;
        }
    }

    // 이벤트
    // load와 돔컨텐트 로드 차이 => html 구조만 다 받으면,
    window.addEventListener('load', () => {
        // 로딩
        document.body.classList.remove('before-load');

        // 레이아웃 설정
        setLayout();
        sceneInfo[0].objs.context.drawImage(
            sceneInfo[0].objs.videoImages[0],
            0,
            0
        );

        // 중간지점에서 새로고침할경우
        let tempYOffset = yOffset;
        let tempScrollCount = 0;

        if (yOffset > 0) {
            let setIn = setInterval(() => {
                window.scrollTo(0, tempYOffset);
                tempYOffset += 5;
                tempScrollCount++;

                if (tempScrollCount > 20) {
                    clearInterval(setIn);
                }
            }, 20);
        }

        // 스크롤
        window.addEventListener('scroll', () => {
            yOffset = pageYOffset;
            scrollLoop();
            checkMenu();

            if (!rafState) {
                rafId = requestAnimationFrame(loop);
                rafState = true;
            }
        });

        // 리사이즈
        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) {
                setLayout();
                sceneInfo[3].values.rectStartY = 0; // 리사이즈를 위한 초기화 함수
            }

            if (currentScene === 3) {
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            }
        });

        // 모바일 가로보기
        window.addEventListener('orientationchange', () => {
            scrollTo(0, 0);
            setTimeout(() => {
                window.location.reload();
            }, 500);
        });

        // 로딩창 삭제
        document
            .querySelector('.loading')
            .addEventListener('transitionend', (e) => {
                document.body.removeChild(e.currentTarget);
            });
    });

    // 실행코드
    setCanvasImages();
})();
