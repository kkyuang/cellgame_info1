//세포 관련 클래스
//먼저 세포 클래스와 동작 관련 부분부터 정의하자.

class Cell{
    //생성부
    constructor(position, mass){
        this.position = position
        this.mass = mass

        this.velocity = new Vector2(0, 0)
    }

    //마우스의 위치를 속도로 바꾸어주는 함수
    mpToVelocity(cvs, mouseX, mouseY){
        //마우스의 변위를 구하자
        var mvx = mouseX - cvs.width/2
        var mvy = -mouseY + cvs.height/2

        //속도 비례상수 곱하기
        var constant = 0.01
        var velocity = new Vector2(mvx * constant, mvy * constant)
        
        //최고 속도 정하기
        var maxV = 5
        if(velocity.norm() > maxV){
            velocity = velocity.unitvector().scalarmul(maxV)
        }

        return velocity
    }
}