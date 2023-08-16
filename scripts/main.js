//애니메이션 정의
var interval

var reunionTimeout

//전역변수 정의
var cluster
var foods = []
var ufoods = []
var canvas


//먹이 범위
var bordersize = 200
var xrange = bordersize
var yrange = bordersize

//상수 정의
const reunionTime = 20*1000

//메인 코드 동작부
$(document).ready(function () {
    //캔버스 불러오기
    canvas = $("#mainCanvas")[0]

    //세포 정의
    cluster = new Cluster([new Cell(new Vector2(0, 0), 10), new Cell(new Vector2(3, 3), 15), new Cell(new Vector2(-8, 8), 64)])

    //먹이 생성
    foodCnt = 500
    for(var i = 0; i < foodCnt; i++){
        foods.push(new Food(new Vector2(Math.random()*xrange*2 - xrange, Math.random()*yrange*2 - yrange), 1))
    }

    //경계 정의
    border = new Border(new Vector2(-bordersize, bordersize), new Vector2(bordersize, bordersize), new Vector2(bordersize, -bordersize), new Vector2(-bordersize, -bordersize))

    //dt 정의
    dt = 0.01
    
    //애니메이션(인터벌)실행
    interval = setInterval(() => {
        //화면 사이즈 맞추기
        resizeCvs(canvas)

        //세포 변위 새로고침
        
        cluster.refreshPosition(border, dt)
        


        //스크린과 그림 오브젝트 정의
        scr = new Screen(canvas, cluster.averagePosition(), 120)
        drw = new Drawing(canvas, scr)
        
        //기본 좌표축 그리기
        drw.coordinateDrawing()

        //먹이 그리기
        for(var i  = 0; i < foods.length; i++){
            //충돌처리
            if(cluster.isFoodCollision(foods[i])){
                foods[i] = new Food(new Vector2(Math.random()*xrange*2 - xrange, Math.random()*yrange*2 - yrange), 1)
            }
            drw.Circle(foods[i].radius, foods[i].position)
        }

        //플레이어 발사 먹이 그리기
        for(var i  = 0; i < ufoods.length; i++){
            //충돌처리
            if(cluster.isFoodCollision(ufoods[i])){
                ufoods.splice(i, 1)
            }
            else{
                //속도 절댓값이 1보다 작으면 가속도, 속도를 0으로
                if(ufoods[i].velocity.norm() < 1){
                    ufoods[i].acceleration = Vector2.zeroVector
                    ufoods[i].velocity = Vector2.zeroVector
                }
                ufoods[i].velocity = ufoods[i].velocity.add(ufoods[i].acceleration.scalarmul(dt))
                ufoods[i].position = ufoods[i].position.add(ufoods[i].velocity.scalarmul(dt))
                drw.Circle(ufoods[i].radius, ufoods[i].position)
            }
        }
        

        cluster.draw(drw)

        drw.border(border)
        

    }, (dt)*1000)
});

//키 입력 이벤트
$(document).keydown(function(e) {
    if(e.keyCode == 32){ //스페이스
        //질량이 64 이상일 때부터 분열 가능
        cluster.division_all()
        clearTimeout(reunionTimeout)
        reunionTimeout = setTimeout(() => {cluster.reunion()}, reunionTime)
    }
    if(e.keyCode == 87){ //W
        // 질량이 32 이상일 때부터 먹이 주기 가능
        cluster.feeding(ufoods)
    }
    //if(e.keyCode == 82){ //R
        // 재결합
    //    cluster.reunion()
    //}
});

window.onmousemove = function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cluster.setVelocity(canvas, mouseX, mouseY)
}