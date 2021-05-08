# JS_interaction_page
 자바스크립트로 스크롤인터렉션구현

## 현재의 섹션의 인덱스 구하기

현재의 인덱스 값 :
pageYoffset > prevHeight + currentIndex section Height => 인덱스값 상승

### 예)
1. 증가할 경우

* 현재 인덱스 값 0 => 이전 높이값 = 0, 현재인덱스의 높이 4000px 일때 4000px 보다 스크롤 값이 커지면 current index ++해 준다.

* 현재 인덱스 값 1 => 이전 높이값 4000px 현재인덱스의 높이값 4000px 이면, 8000px 보다 스크롤값이 커지면 인덱스 증가.

```javascript
if(pageYOffset > curretindexHeight + prevHeight) {
     currentindex ++
}
 ```

2. 감소할 경우

*  현재의 인덱스 값 1, 이전 높이값 4000px, 현재 높이값 4000px 일때, pageYOffset이 이전 높이값보다 작아지면 curret index가 감사

```javascript
if(pageYOffset < prevHeight) {
    currentIndex --
}
```

