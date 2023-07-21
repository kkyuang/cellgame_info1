//캔버스 표시 관련 코드

class Drawing{
    //생성부
    constructor(cvs, scr){
        //캔버스 관련 정보
        this.cvs = cvs
        this.canvasWidth = cvs.width
        this.canvasHeight = cvs.height

        //표시 좌표 최대, 최소값 관련 정보
        this.xmin = scr.xmin
        this.xmax = scr.xmax
        this.ymin = scr.ymin
        this.ymax = scr.ymax
    }

    //좌표를 캔버스좌표로 변환
    cvtct(x, y) {
        var canvasX = ((x - this.xmin) / (this.xmax - this.xmin)) * this.canvasWidth ;
        var canvasY = this.canvasHeight - ((y - this.ymin) / (this.ymax - this.ymin)) * this.canvasHeight;
      
        return { x: canvasX, y: canvasY };
    }
    //Vector2를 캔버스좌표로 변환
    cvtctVector2(v2) {
        var canvasX = ((v2.x - this.xmin) / (this.xmax - this.xmin)) * this.canvasWidth ;
        var canvasY = this.canvasHeight - ((v2.y - this.ymin) / (this.ymax - this.ymin)) * this.canvasHeight;
      
        return { x: canvasX, y: canvasY };
    }
    //크기를 변환
    cvtctSize(r) {
        return r * (this.canvasWidth / (this.xmax - this.xmin));
    }

    //좌표축 그리기
    coordinateDrawing(){
        var ctx = this.cvs.getContext("2d");

        ctx.lineWidth = 1;

        //x축 그리기
        ctx.beginPath()
        ctx.moveTo(this.cvtct(this.xmax, 0).x, this.cvtct(this.xmax, 0).y)
        ctx.lineTo(this.cvtct(this.xmin, 0).x, this.cvtct(this.xmin, 0).y)
        ctx.stroke()
    
        //y축 그리기
        ctx.beginPath()
        ctx.moveTo(this.cvtct(0, this.ymax).x, this.cvtct(0, this.ymax).y)
        ctx.lineTo(this.cvtct(0, this.ymin).x, this.cvtct(0, this.ymin).y)
        ctx.stroke()
    }

    //Vector2 위치에 원 그리기
    Circle(r, v2){

        var ctx = this.cvs.getContext("2d");
        var position = this.cvtctVector2(v2)

        var centerX = position.x
        var centerY = position.y

        var radius = this.cvtctSize(r)
    
        //위치에 선 긋기
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.stroke();
    }
    
}

//화면 표시부에 관한 클래스
//화면의 중심점, 가로 크기 지정
class Screen{
    //생성부
    constructor(cvs, center, width){
        //표시 좌표 최대, 최소값 관련 정보
        this.xmin = center.x - width/2
        this.xmax = center.x + width/2

        var height = width * (cvs.height / cvs.width)

        this.ymin = center.y - height/2
        this.ymax = center.y + height/2
    }
}


//캔버스 크기 새로고침 관련
window.onresize = function(e) {

}

function resizeCvs(cvs){
    cvs.width = $("body")[0].offsetWidth;
    cvs.height = $("body")[0].offsetHeight;
}