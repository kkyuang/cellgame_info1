//애니메이션 정의
var interval

//전역변수 정의
var cell
var foods = []
var canvas

//메인 코드 동작부
$(document).ready(function () {
    //캔버스 불러오기
    canvas = $("#mainCanvas")[0]

    //세포 정의
    cell = new Cell(new Vector2(0, 0), 10)

    //먹이 생성
    foodCnt = 1000
    for(var i = 0; i < 100; i++){
        //범위
        xrange = 100
        yrange = 100
        foods.push(new Food(new Vector2(Math.random()*xrange*2 - xrange, Math.random()*yrange*2 - yrange), 1))
    }

    //dt 정의
    dt = 0.01
    
    //애니메이션(인터벌)실행
    interval = setInterval(() => {
        //화면 사이즈 맞추기
        resizeCvs(canvas)

        //세포 변위 새로고침
        cell.position = cell.position.add(cell.velocity.scalarmul(dt))
        


        //스크린과 그림 오브젝트 정의
        scr = new Screen(canvas, cell.position, 100)
        drw = new Drawing(canvas, scr)
        
        //기본 좌표축 그리기
        drw.coordinateDrawing()

        //먹이 그리기
        for(var i  = 0; i < foods.length; i++){
            //충돌처리
            if(cell.isColllision(foods[i])){
                cell.mass += foods[i].mass
                cell.radius = Math.sqrt(Number(cell.mass))
                console.log(cell.mass)

                foods[i].mass = 0
                foods[i].radius = 0
            }
            drw.Circle(foods[i].radius, foods[i].position)
        }
    
        //세포 그리기
        drw.Circle(cell.radius, cell.position)
        

    }, (dt)*1000)
});

window.onmousemove = function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cell.velocity = cell.mpToVelocity(canvas, mouseX, mouseY)
}