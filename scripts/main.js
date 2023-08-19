//애니메이션 정의
var interval

var reunionTimeout

//전역변수 정의
var cluster
var foods = []
var ufoods = []
var canvas
var other_clusters = []

var frameNum = 0

var socket

var clientID


//조작 관련
//마우스 방향 표시
var mouseDirection = new Vector2(0, 0)
var isDivide = false
var isFeeding = false

//먹이 범위
var bordersize = 200
var xrange = bordersize
var yrange = bordersize

//상수 정의
const reunionTime = 20*1000

$(function(){
    //게임 시작 버튼을 눌렀을 때
    $("#start-btn").click(() => {
        console.log($("#client_ID").val() )
        console.log("게임 시작 버튼 클릭")
        if($("#client_ID").val() != ""){
            clientID = $("#client_ID").val()
            socket.emit('client_regist', clientID)

            $("#ID_input_div").hide()
        }
        else{
            alert("클라이언트 ID를 입력해 주세요")
        }
    })
})

//메인 코드 동작부
$(document).ready(function () {

    socket = io();
    socket.on('msg', function (data) {
        console.log(data)
    });


    //새로운 프레임을 받았을 때
    socket.on('new_frame', function (data) {
        console.log(data)

        //캔버스 불러오기
        canvas = $("#mainCanvas")[0]
        
        //화면 사이즈 맞추기
        resizeCvs(canvas)


        //스크린과 그림 오브젝트 정의
        //스크린 사이즈를 질량 범위에 따라서
        cluster = new Cluster(data.clusters[clientID])
        console.log(cluster)

        //스크린 위치 맞추기
        masssum = cluster.mass_sum()
        scrsize = 15 * Math.sqrt(masssum)
        scr = new Screen(canvas, cluster.averagePosition(), scrsize)
        drw = new Drawing(canvas, scr)

        //기본 좌표축 그리기
        drw.coordinateDrawing()

        //먹이 그리기
        for(var i  = 0; i < data.foods.length; i++){
            drw.Circle(data.foods[i].radius, data.foods[i].position)
        }

        //플레이어 발사 먹이 그리기
        for(var i  = 0; i < data.ufoods.length; i++){
            drw.Circle(data.ufoods[i].radius, data.ufoods[i].position)
        }        

        //클러스터 그리기
        cluster_names = Object.keys(data.clusters)
        for(var i = 0; i < cluster_names.length; i++){
            cluster_i = new Cluster(data.clusters[cluster_names[i]])
            cluster_i.draw(drw, cluster_names[i])
        }

        //경계면 그리기
        drw.border(data.border)

        //조작 데이터 전송
        socket.emit('action_receive', {clientID: clientID, frameNum: data.frameNum, mouseDirection: mouseDirection, isDivide: isDivide, isFeeding: isFeeding})

        //키 입력 여부 초기화
        isDivide = false
        isFeeding = false
    });
});

//키 입력 이벤트
$(document).keydown(function(e) {
    if(e.keyCode == 32){ //스페이스
        //질량이 64 이상일 때부터 분열 가능
        isDivide = true
    }
    if(e.keyCode == 87){ //W
        // 질량이 32 이상일 때부터 먹이 주기 가능
        isFeeding = true
    }
    //if(e.keyCode == 82){ //R
        // 재결합
    //    cluster.reunion()
    //}
});

window.onmousemove = function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    mouseDirection = new Vector2(2*(e.clientX - window.innerWidth/2)/window.innerWidth, -2*(e.clientY - window.innerHeight/2)/window.innerHeight)
}