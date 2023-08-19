
var Cell = require('./cell.js')
var Vector2 = require('./vector2.js')
var Cluster = require('./cluster.js')

class Border{
    //생성부
    constructor(v1, v2, v3, v4){
        this.v1 = v1
        this.v2 = v2
        this.v3 = v3
        this.v4 = v4
        
        //v1     v2
        //v4     v3
    }

    findXYrange(){
        //세포가 가질 수 있는 x, y값의 최대 최소 구하기
        //x12 = this.v1.y - this.v2.y == 0 ? undefined : ((this.v1.x - this.v2.x)*(position.y - this.v1.y) / this.v1.y - this.v2.y) + this.v1.x
        //x23 = this.v2.y - this.v3.y == 0 ? undefined : ((this.v2.x - this.v3.x)*(position.y - this.v2.y) / this.v2.y - this.v3.y) + this.v2.x
        //x34 = this.v3.y - this.v4.y == 0 ? undefined : ((this.v3.x - this.v4.x)*(position.y - this.v3.y) / this.v3.y - this.v4.y) + this.v3.x
        //x41 = this.v2.y - this.v3.y == 0 ? undefined : ((this.v4.x - this.v1.x)*(position.y - this.v4.y) / this.v4.y - this.v1.y) + this.v4.x

        return{
            xmin: this.v1.x,
            xmax: this.v2.x,
            ymin: this.v4.y,
            ymax: this.v1.y
        }
    }
}

module.exports = Border