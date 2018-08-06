var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var cidgen=0;
var gameid=0;
var car=function(){
    this.goal=null;
    this.pos={x:0,z:0,y:0};
    this.vel={x:0,z:0};
    this.rot=0;
    this.cid=cidgen;
    this.lap=0;
    this.cp=0;
    this.dsq=0;
    this.acc=0;
    this.audience=false;
    this.spin=0;
    cidgen++;
};
var cars=[];
var lastConnection=0;
var stage=0;
//     start     end       next
//wait       race    result     wait
var state="wait";
var start;
var end;
var next;
var RACE_DURATION=120000;
var RESULT_DURATION=10000;
var WAIT_DURATION=10000;
app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

//join
function waitState(){
    start=new Date().getTime()+WAIT_DURATION;
    end=start+RACE_DURATION;
    next=end+RESULT_DURATION;
    state="wait";
}
//next<time
function switchState(){
    cars=[];
    stage=Math.floor(Math.random()*100);
    var time=new Date().getTime();
    gameid++;
    cidgen=0;
    start=time+WAIT_DURATION;
    end=start+RACE_DURATION;
    next=end+RESULT_DURATION;
    state="wait";
    console.log("gameid:"+gameid);
}
app.get('/newcar', function (request, response) {
    var c=new car();
    if(state!="wait")c.audience=true;
    cars.push(c);
    if(state=="wait"){
        waitState();
    }
    response.send(JSON.stringify(
        {cid:c.cid,
         state:state,start:start,end:end,next:next,audience:c.audience,gameid:gameid}));
});
app.get('/stage', function (request, response) {
    var time=new Date().getTime();
    lastConnection=time;
    response.send(stage+"");
});
app.get('/carlist', function (request, response) {
    var time=new Date().getTime();
    lastConnection=time;
    response.send(JSON.stringify(cars));
});
app.get('/a', function (request, response) {
    response.send("test");
});
app.get('/state', function (request, response) {
    var time=new Date().getTime();
    if(time>next){
        switchState();
    } else if(time>end){
        state="result";
    } else if(time>start){
        state="race";
    } else {
        state="wait";
    }
    response.send(state);
});
function getcarindex(cid){
    for(var i=0;i<cars.length;i++){
        if(cars[i].cid==cid)return i;
    }
    return null;
};
app.post('/setpos', function (request, response) {
    console.log(request.body);
    var time=new Date().getTime();
    if(time>next){
        switchState();
    } else if(time>end){
        state="result";
    } else if(time>start){
        state="race";
    } else {
        state="wait";
    }
    console.log(state);
    console.log("last connection:"+(time-lastConnection));
    if(end-time>30000&&state=="race"){
        var g=false;
        for(var i=0;i<cars.length;i++){
            if(cars[i].goal){
                g=true;
            }
        }
        if(g){
            end=time+30000;
            next=time+40000;
        }
    }
    /*
    if(request.body==null)
        response.send(JSON.stringify(cars));
   */
    lastConnection=time;
    console.log("aaa"+checkNumber(10));
    if(request.body.rot!=null&&request.body.pos!=null&&
       checkNumber(request.body.cid)&&request.body.acc!=null&&
       request.body.vel!=null){
        var cid=request.body.cid;
        var p=request.body.pos;
        var r=request.body.rot;
        var a=request.body.acc;
        var c=getcarindex(cid);
        var vx=request.body.vel.x;
        var vz=request.body.vel.z;
        var spin=request.body.spin;
        
        console.log("carindex:"+c);
        try{
            if(checkNumber(c)){
                var car1=cars[c];
                if(checkNumber(vx)&&checkNumber(vz)){
                    car1.vel.x=vx;
                    car1.vel.z=vz;
                }else{
                    console.log("a");
                    return;
                }
                if(checkNumber(np.x)&&
                   checkNumber(np.z)&&
                   checkNumber(np.y)){
                    car1.pos.x=p.x;
                    car1.pos.y=p.y;
                    car1.pos.z=p.z;
                }else{
                    console.log("b");
                    return;
                }
                if(checkNumber(r)&&
                   checkNumber(a)){
                    car1.rot=r;
                    car1.acc=a;
                }else{
                    console.log("c");
                    return;
                }
                if(request.body.goal==null||
                  checkNumber(request.body.goal)){
                    car1.goal=request.body.goal;
                }else{
                    console.log("d");
                    return;
                }
                if(spin!=null||checkNumber(spin)){
                    car1.spin=spin;
                }else{
                    
                    console.log("e");
                    return;
                }
                cars[c]=car1;
            }else{
                response.send("nocar");
                return;
            }
        }catch(e){}
    }else{
        
                    console.log("f");
    }
    response.send(JSON.stringify({cars:cars,state:(state),start:start,end:end,next:next,gameid:gameid,
                                  time:new Date().getTime()}));
});
app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
    waitState();
});
function checkNumber(str){
    if(str==null)
        return false;
    var k=Number(str+"");
    if(isNaN(k)||(!isFinite(k)))
        return false;
    return true;
}