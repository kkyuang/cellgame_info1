//애니메이션 정의
var interval

//전역변수 정의
var cell
var canvas

//메인 코드 동작부
$(document).ready(function () {
    //캔버스 불러오기
    canvas = $("#mainCanvas")[0]

    //세포 정의
    cell = new Cell(new Vector2(0, 0), 1)

    //dt 정의
    dt = 0.01
    
    //애니메이션(인터벌)실행
    interval = setInterval(() => {
        //화면 사이즈 맞추기
        resizeCvs(canvas)

        //세포 변위 새로고침
        cell.position = cell.position.add(cell.velocity.scalarmul(dt))

        //스크린과 그림 오브젝트 정의
        scr = new Screen(canvas, cell.position, 40)
        drw = new Drawing(canvas, scr)
        
        //기본 좌표축 그리기
        drw.coordinateDrawing()
    
        //세포 그리기
        drw.Circle(cell.size, cell.position)
    }, (dt)*1000)
});

window.onmousemove = function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cell.velocity = cell.mpToVelocity(canvas, mouseX, mouseY)
    
    console.log(cell.velocity)
}