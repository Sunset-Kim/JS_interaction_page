# JS_interaction_page
 자바스크립트로 스크롤인터렉션구현

<br>

## 현재의 섹션의 인덱스 구하고 해당 섹션의 컨텐츠를 보여주기

현재의 인덱스 값 :
pageYoffset > prevHeight + currentIndex section Height => 인덱스값 상승

### 예)
1. 증가할 경우

* 현재 인덱스 값 0 => 이전 높이값 = 0, 현재인덱스의 높이 4000px 일때 4000px 보다 스크롤 값이 커지면 current index ++해 준다.

* 현재 인덱스 값 1 => 이전 높이값 4000px 현재인덱스의 높이값 4000px 이면, 8000px 보다 스크롤값이 커지면 인덱스 증가.

```javascript
if(pageYOffset > curretindexHeight + prevHeight) {
     currentindex ++
    //  body에 id로 해당섹션 컨텐츠를 보여주기
    document.body.setAttribute('id',`show-scene-${currentScene}`);
}
 ```

2. 감소할 경우

*  현재의 인덱스 값 1, 이전 높이값 4000px, 현재 높이값 4000px 일때, pageYOffset이 이전 높이값보다 작아지면 curret index가 감사

```javascript
if(pageYOffset < prevHeight) {
    currentIndex --
    //  body에 id로 해당섹션 컨텐츠를 보여주기
    document.body.setAttribute('id',`show-scene-${currentScene}`);
}
```

3. 새로고침하거나 resize 할때

* 컨텐츠의 높이값을 설정할때 + 리사이즈시 setLayout을 실행하니까 이 함수 안에서 현재의 높이값을 바탕으로 인덱스를 정하는 코드를 넣는다.

* 전체의 높이값을 구하다가 현재의 pageYOffset 값을 체크하고 pageYOffset 값보다 totalheight가 클때 그때의 반복문을 멈추고 i값을 반환하여 curret index에 할당한다.

``` javascript 
for(let i =0; i < sceneInfo.length; i++) {
        totalScrollHeight += sceneInfo[i].scrollHeight;
        if(totalScrollHeight >= yOffset) {
            currentScene = i;
            break; //반복문을 멈추고 빠져나옴 없을시 무조건 currentidex가 3이 된다.
        }
    }
    //  body에 id로 해당섹션 컨텐츠를 보여주기
    document.body.setAttribute('id',`show-scene-${currentScene}`);
```

<br>

## 구한 인덱스로 해당 섹션 애니메이션 적용하기

1. 스크롤시 작동되는 함수 내부에 애니메이션 실행시킬 함수 실행

* switch문으로 현재 인덱스값으로 해당 섹션의 애니메이션만 작동시킨다.

``` javascript
switch (currentScene) {
    case 0:
        break;
    case 1:
        break;
    case 2:
        break;
    case 3:
        break;
```

2. 스위치문안에 해당 섹션일때 해당 컨텐츠의 애니메이션 정보값을 받아와서 값으로 리턴해주는 함수를 실행 calcValue()
``` javascript
//해당 속성의 정의
// dom이름_속성명_(in/out): [시작속성값, 끝나는속성값, 실행할구간:object[opt] {start: 0, end: 0.3}]

calcValue(전달할 속성,현재섹선의 스크롤값)
```

3. calcValue 안에서 적용할 속성으로 css 속성에 적용할 값을 계산한다.


    1. 구간이 존재하지 않을 경우
    * " 해당섹션 "의 스크롤 비율 * 속성값의 범위 + 시작속성의값

    2. 구간이 존재할 경우
    * 해당구간사이일 경우 : " 해당구간 "의 스크롤비율 * 속성값의 범위 + 시작속성의 값

    * 해당구간의 시작보다 해당섹션의 스크롤 값이 작은 경우 : 속성의 시작값

    * 해당구간의 끝보다 해당섹션의 스크롤 값이 큰 경우: 속성의 끝값

4. switch 문 안에서 같은 dom에 같은 효과 적용하기

* 조건문으로 분기 나눠주기 
* 예) 0.2 0.4 구간에 실행, 0.4 0.6 구간에 실행되는 속성값이 있다면 조건문으로 0.3구간 미만에서는 전자가 적용되도록, 0.3 구간 이상에서는 후자가 실행되도록 코드를 짠다.

```javascript
if(scrollRatio <= 0.3) {    
    objs.messageA.style.opacity = messageA_opacity_in;
} else {
    objs.messageA.style.opacity = messageA_opacity_out;
}
```