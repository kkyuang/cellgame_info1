//Math.js
//수학 관련 클래스 모음

//2차원 운동 구현 위한 Vector2 클래스
class Vector2{
    constructor(x, y){
        this.x = x
        this.y = y
    }

    //동적 함수 모음
    add(a){ //덧셈
        return new Vector2(a.x + this.x, a.y + this.y)
    }
    sub(a){ //뺄셈
        return new Vector2(this.x - a.x, this.y - a.y)
    }
    scalarmul(k){ //상수배
        return new Vector2(this.x * k, this.y * k)
    }
    dotproduct(a){ //내적
        return a.x*this.x + a.y*this.y
    }
    isEqual(a){ //동치
        return (a.x == this.x && a.y == this.y)
    }
    distance(a){ //거리
        return Math.sqrt((a.x-this.x)**2 + (a.y-this.y)**2)
    }
    norm(){ //벡터의 절댓값
        return Vector2.distance(Vector2.zeroVector, this)
    }
    unitvector(){ //단위벡터
        return Vector2.scalarmul(this, 1/Vector2.distance(Vector2.zeroVector, this))
    }

    //정적 함수 모음
    static zeroVector = new Vector2(0, 0) //영벡터
    static distance(a, b){ //거리
        return Math.sqrt((a.x-b.x)**2 + (a.y-b.y)**2)
    }
    static add(a, b){ //덧셈
        return new Vector2(a.x+b.x, a.y+b.y)
    }
    static sub(a, b){ //뺄셈
        return new Vector2(a.x-b.x, a.y-b.y)
    }
    static scalarmul(a, k){ //상수배
        return new Vector2(a.x*k, a.y*k)
    }
    static dotproduct(a, b){ //내적
        return a.x*b.x + a.y*b.y
    }
    static unitvector(a){ //단위벡터
        return Vector2.scalarmul(a, 1/Vector2.distance(Vector2.zeroVector, a))
    }
    static isEqual(a, b){ //동치
        return a.x == b.x && a.y == b.y
    }
    //절댓값
    static norm(a){
        return Vector2.distance(Vector2.zeroVector, a)
    }
}