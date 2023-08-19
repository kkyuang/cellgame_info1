var express = require('express')
var app = express()
var fs = require('fs');
var http = require('http')
var server = http.createServer(app);
var { Server } = require("socket.io");
var io = require('socket.io')(server);


//게임 관련 클래스 선언
var Cell = require('./node_scripts/cell.js')
var Vector2 = require('./node_scripts/vector2.js')
var Border = require('./node_scripts/border.js')
var Cluster = require('./node_scripts/cluster.js')


//게임 관련 변수 선언
var clusters = {}
var foods = []
var ufoods = []

var frameNum = 0

//경계 사이즈
const bordersize = 200
const xrange = bordersize
const yrange = bordersize

//상수 정의
const reunionTime = 20*1000

//먹이 개수
var foodCnt = 500

//미소 시간 변화량
var dt = 0.01 //단위: ms
let exTime = null;

//개인별 동작 처리
var actions = {}

//서버 시작할 때
server.listen(3000, function() {
    //먹이 생성
    for(var i = 0; i < foodCnt; i++){
        foods.push(new Cell(new Vector2(Math.random()*xrange*2 - xrange, Math.random()*yrange*2 - yrange), 1))
    }

    //경계 정의
    border = new Border(new Vector2(-bordersize, bordersize), new Vector2(bordersize, bordersize), new Vector2(bordersize, -bordersize), new Vector2(-bordersize, -bordersize))


});

//기본 프레임 연산 함수
function makeFrame(){

}
 


//소켓 서버
io.on('connection', (socket) => {
  console.log('a user connected');

  //클라이언트 등록 수신
  socket.on('client_regist', function (data) {


    //새로운 클러스터 추가하기
    var clientID = data
    clusters[clientID] = new Cluster([new Cell(new Vector2(xrange*(Math.random()*2 - 1), yrange*(Math.random()*2 - 1)), 20)])
    socket.emit('new_frame', {clusters: clusters, foods: foods, ufoods: ufoods, border: border, frameNum: frameNum})
  });

  //클라이언트 동작 수신
  socket.on('action_receive', (data) => {
    //프레임 넘버가 현재와 같은지 체크
    if(data.frameNum == frameNum){
      //클라이언트의 액션에 데이터 저장
      actions[data.clientID] = data

      //모든 클라이언트의 동작이 수신되었는가? -> 게임 상황 새로고침하기
      if(Object.keys(actions).length == Object.keys(clusters).length){
        //dt 측정하기
        dt = exTime == null ? 0.01 : (new Date() - exTime)/1000;
        exTime = new Date();

        //동작 조절하기
        var actionKeys = Object.keys(actions)
        for(var i = 0; i < actionKeys.length; i++){
          key_i = actionKeys[i]
          
          //위치 새로고침
          clusters[key_i].refreshPosition(actions[key_i].mouseDirection, border, dt)

          //분열 동작
          if(actions[key_i].isDivide){

          }

          //먹이주기 동작
          if(actions[key_i].isFeeding){
            
          }
        }

        //최종 전송
        frameNum++
        io.emit('new_frame', {clusters: clusters, foods: foods, ufoods: ufoods, border: border, frameNum: frameNum})
      }
    }
  })
});

 
app.get('/', function(request, response) {
  var html = fs.readFileSync(__dirname + '\\index.html', 'utf-8')
  response.send(html);
});
 
app.get('/page', function(req, res) { 
  return res.send('/page');
});


//css 라우팅
app.get('/css/:name', function(request, response) {
  response.send(fs.readFileSync('css/' + request.params.name))
});

//js 라우팅
app.get('/scripts/:name', function(request, response) {
  response.send(fs.readFileSync('scripts/' + request.params.name))
});