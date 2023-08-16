//세포 관련 클래스
//먼저 세포 클래스와 동작 관련 부분부터 정의하자.

//최저 속도
const minVelocity = 5
//속도 비례상수
const VelocityC = 50




class Cell{
    //생성부
    constructor(position, mass){
        this.position = position
        this.mass = mass
        this.radius = Math.sqrt(mass)
        this.acceleration = new Vector2(0, 0)

        this.velocity = new Vector2(0, 0)
        this.exVelocity =  new Vector2(0, 0)
        this.acVelocity =  new Vector2(0, 0)
    }

    //마우스의 위치를 속도로 바꾸어주는 함수
    mpToVelocity(cvs, mouseX, mouseY){
        //마우스의 변위를 구하자
        var mvx = mouseX - cvs.width/2
        var mvy = -mouseY + cvs.height/2

        //최고 속도 정하기
        var maxV = minVelocity + (VelocityC/this.mass)

        //속도 비례상수 곱하기
        var constant = (maxV) / 100
        var velocity = new Vector2(mvx * constant, mvy * constant)
        
        //최고 속도 정하기
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

//세포 군집
class Cluster{
    constructor(cellarr){
        this.cells = cellarr
    }

    //모든 세포의 위치를 새로고침
    refreshPosition(border, dt){
        for(var i = 0; i < this.cells.length; i++){
            //분열시가속도관여속도 
            this.cells[i].acVelocity = this.cells[i].acVelocity.add(this.cells[i].acceleration.scalarmul(dt))
            if(this.cells[i].acVelocity.norm() < 1){
                this.cells[i].acceleration = Vector2.zeroVector
            }

            this.cells[i].position = this.cells[i].position.add((this.cells[i].velocity.add(this.cells[i].exVelocity).add(this.cells[i].acVelocity)).scalarmul(dt))
            //경계선 넘었는지 판단
            this.cells[i].isBorder(border)
            //세포끼리 겹치지 않도록
            for(var j = 0; j < this.cells.length; j++){
                if(i != j){
                    if(Vector2.distance(this.cells[i].position, this.cells[j].position) < this.cells[i].radius + this.cells[j].radius){
                        var mid = Vector2.add(this.cells[i].position.scalarmul(this.cells[j].radius), this.cells[j].position.scalarmul(this.cells[i].radius)).scalarmul(1/(this.cells[i].radius + this.cells[j].radius))
                        this.cells[i].position = mid.add(Vector2.sub(mid, this.cells[i].position).unitvector().scalarmul(-this.cells[i].radius))
                        this.cells[j].position = mid.add(Vector2.sub(mid, this.cells[j].position).unitvector().scalarmul(-this.cells[j].radius))
                    }
                }
            }

            //평균 위치로의 인력 작용
            this.cells[i].exVelocity = /*this.cells[i].exVelocity.add(*/this.averagePosition().sub(this.cells[i].position).scalarmul(0.4)/*.scalarmul(dt))*/
        }
    }

    //평균 위치 반환
    averagePosition(){
        var avp = new Vector2(0, 0)
        for(var i = 0; i < this.cells.length; i++){
            avp = avp.add(this.cells[i].position)
        }
        avp = avp.scalarmul(1/this.cells.length)
        return avp
    }

    //먹이 섭취 여부 판단
    isFoodCollision(food){
        for(var j = 0; j < this.cells.length; j++){
            if(this.cells[j].isColllision(food)){
                this.cells[j].mass += food.mass
                this.cells[j].radius = Math.sqrt(Number(this.cells[j].mass))
                console.log(this.cells[j].mass)

                return true
            }
        }
        return false
    }

    //먹이주기
    feeding(ufoods){
        for(var i = 0; i < this.cells.length; i++){
            if(this.cells[i].mass >= 32){
                this.cells[i].mass -= 17 // 질량 손실: 17
                this.cells[i].radius = Math.sqrt(this.cells[i].mass)


                ufoods[ufoods.length] = new Food(this.cells[i].position.add(this.cells[i].velocity.unitvector().scalarmul(this.cells[i].radius + Math.sqrt(14))), 13) // 질량이 13인 먹이 생성
                ufoods[ufoods.length - 1].velocity = this.cells[i].velocity.unitvector().scalarmul(30)
                ufoods[ufoods.length - 1].acceleration = this.cells[i].velocity.unitvector().scalarmul(-15)
            }
        }
    }

    draw(drw){
        for(var i = 0; i < this.cells.length; i++){
            //세포 그리기
            drw.Circle(this.cells[i].radius, this.cells[i].position)
        }
    }

    //각 세포들의 속도를 설정
    setVelocity(canvas, mouseX, mouseY){
        for(var i = 0; i < this.cells.length; i++){
            this.cells[i].velocity = this.cells[i].mpToVelocity(canvas, mouseX, mouseY)
        }
    }
    
    division_all(){
        var cellslength = this.cells.length
        console.log("division")
        for(var i = 0; i < cellslength; i++){
            if(this.cells[i].mass >= 64){ // 64이상에서만 분열 가능
                this.cells[i].mass /= 2 //절반으로 분할
                this.cells[i].radius = Math.sqrt(Number(this.cells[i].mass))// 반지름 새로고침

                // 분열 방향 정하기
                // 새로운 세포 만들고 위치를 현재 벡터에서 분열 방향으로 반지름 두 배 만큼 떨어진 곳으로 정함.
                var direction;
                if(!this.cells[i].velocity.isEqual(Vector2.zeroVector)){ //속도벡터가 0이 아닐 경우
                    direction = this.cells[i].velocity
                }
                else{ //속도백터가 0일경우
                    direction = new Vector2(1-2*Math.random(), 1-2*Math.random())
                }
                this.cells[this.cells.length] = new Cell(this.cells[i].position.add(direction.unitvector().scalarmul(this.cells[i].radius*2)), this.cells[i].mass)
                this.cells[this.cells.length-1].acVelocity = direction.unitvector().scalarmul(30)
                this.cells[this.cells.length-1].acceleration = direction.unitvector().scalarmul(-15)
            }
        }
    }

    //모든 세포의 재결합
    reunion(){
        var massSum = 0
        console.log("reunion")
        var AVP = this.averagePosition() //평균 위치
        for(var i = 0; i < this.cells.length; i++){
            massSum += this.cells[i].mass
        }

        //세포 배열 초기화 후 평균 위치에 모든 질량의 합으로 새로운 세포 생성
        this.cells = [new Cell(AVP, massSum)]
    }
}

//먹이
class Food extends Cell{

}