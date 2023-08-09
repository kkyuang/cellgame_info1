//세포 관련 클래스
//먼저 세포 클래스와 동작 관련 부분부터 정의하자.

class Cell{
    //생성부
    constructor(position, mass){
        this.position = position
        this.mass = mass
        this.radius = Math.sqrt(mass)

        this.velocity = new Vector2(0, 0)
    }

    //마우스의 위치를 속도로 바꾸어주는 함수
    mpToVelocity(cvs, mouseX, mouseY){
        //마우스의 변위를 구하자
        var mvx = mouseX - cvs.width/2
        var mvy = -mouseY + cvs.height/2

        //최고 속도 정하기
        var maxV = 7 + (100/this.mass)

        //속도 비례상수 곱하기
        var constant = (maxV) / 100
        var velocity = new Vector2(mvx * constant, mvy * constant)
        
        if(velocity.norm() > maxV){
            velocity = velocity.unitvector().scalarmul(maxV)
        }

        return velocity
    }
    
    isBorder(bord){
        //x축과 y축을 각각 고려
        var range = bord.findXYrange()
        if(this.position.x - this.radius < range.xmin){
            this.position = new Vector2(range.xmin + this.radius, this.position.y)
        }
        if(this.position.x + this.radius > range.xmax){
            this.position = new Vector2(range.xmax - this.radius, this.position.y)
        }
        if(this.position.y - this.radius< range.ymin){
            this.position = new Vector2(this.position.x, range.ymin + this.radius)
        }
        if(this.position.y + this.radius > range.ymax){
            this.position = new Vector2(this.position.x, range.ymax - this.radius)
        }
    }

    //충돌 감지
    isColllision(cell){
        if(Vector2.distance(this.position, cell.position) <= this.radius + cell.radius){
            return true
        }
        return false
    }
}

//먹이
class Food extends Cell{

}