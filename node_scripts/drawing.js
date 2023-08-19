//캔버스 표시 관련 코드

class Drawing{
    //생성부
    constructor(cvs, scr){
        //캔버스 관련 정보
        this.cvs = cvs
        this.canvasWidth = cvs.width
        this.canvasHeight = cvs.height
        this.scr = scr

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
    
    drawline(ctx, v1 ,v2){
        ctx.beginPath()
        ctx.moveTo(this.cvtctVector2(v1).x, this.cvtctVector2(v1).y)
        ctx.lineTo(this.cvtctVector2(v2).x, this.cvtctVector2(v2).y)
        ctx.stroke()
    }

    border(bord){
        var ctx = this.cvs.getContext("2d");

        ctx.lineWidth = 1;
        ctx.strokeStyle = "red";

        //사각형 테두리 그리기
        this.drawline(ctx, bord.v1, bord.v2)
        this.drawline(ctx, bord.v2, bord.v3)
        this.drawline(ctx, bord.v3, bord.v4)
        this.drawline(ctx, bord.v4, bord.v1)
    }

    //Vector2 위치에 원 그리기
    Circle(r, v2, text){
        var ctx = this.cvs.getContext("2d");
        var position = this.cvtctVector2(v2)

        var centerX = position.x
        var centerY = position.y

        var radius = this.cvtctSize(r)

        if(!this.scr.isInScr(v2, r)){
            return
        }
    
        //원 그리기
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.stroke();

        //텍스트(질량 표시용)
        if(text != undefined){
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.textBaseline= "middle"; 
            ctx.fillText(text, centerX, centerY, radius) 
        }
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

    //오브젝트가 화면 내부에 있는가를 탐지 
    isInScr(v2, r){
        if(v2.x - r < this.xmax && v2.x + r > this.xmin){
            if(v2.y - r < this.ymax && v2.y + r > this.ymin){
                return true
            }
        }
        return false
    }
}


//캔버스 크기 새로고침 관련
window.onresize = function(e) {

}

function resizeCvs(cvs){
    cvs.width = $("body")[0].offsetWidth;
    cvs.height = $("body")[0].offsetHeight;
}