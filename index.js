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
function Item(){
    this.id=0;
    this.p={x:0,y:0,z:0};
    this.cp=0;
    this.uuid=0;
    this.target=0;
    this.staticId=-1;
    this.owner=0;
}
var cars=[];
var items=[];
var lastConnection=0;
var stage=0;
//     start     end       next
//wait       race    result     wait
var state="wait";
var start;
var end;
var next;
var RACE_DURATION=240000;
var RESULT_DURATION=5000;
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
    items=[];
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
    //console.log(request.body);
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
    //console.log(state);
    //console.log("last connection:"+(time-lastConnection));
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
    var _cid=request.body.cid;
    //console.log("aaa"+checkNumber(10));
    if(request.body.rot!=null&&request.body.pos!=null&&
       checkNumber(request.body.cid)&&request.body.acc!=null&&
       request.body.vel!=null){
        var cid=_cid;
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
                if(checkNumber(p.x)&&
                   checkNumber(p.z)&&
                   checkNumber(p.y)){
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
        }catch(e){
            return;
        }
    }else{
        console.log("f");
        return;
    }
    if(request.body.added!=null&&
       Array.isArray(request.body.added)&&
       request.body.removed!=null&&
       Array.isArray(request.body.removed)){
        if(request.body.removed.length>0){
            console.log("request.body.removed");
            console.log(request.body.removed);
        }
        if(request.body.added.length>0){
            console.log("request.body.added");
            console.log(request.body.added);
        }
        var added=request.body.added;
        var removed=request.body.removed;
        for(var i=0;i<added.length;i++){
            var sentItem=added[i];
            var exists=false;
            var _id=sentItem.id;
            if(!checkNumber(_id)){
                console.log("1");
                return;
            }
            var _p=sentItem.p;
            if(_p==null||
               (!checkNumber(_p.x))||
               (!checkNumber(_p.y))||
               (!checkNumber(_p.z))){
                console.log("2");
                return;
            }
            var _cp=sentItem.cp;
            if(!checkNumber(_cp)){
                console.log("3");
                return;
            }
            var _uuid=sentItem.uuid;
            if(!checkNumber(_uuid)){
                console.log("4");
                return;
            }
            var _target=sentItem.target;
            if(!checkNumber(_target)){
                console.log("5");
                return;
            }
            var _staticId=sentItem.staticId;
            if(!checkNumber(_staticId)){
                console.log("6");
                return;
            }
            var _owner=sentItem.owner;
            if(!checkNumber(_owner)){
                console.log(added);
                console.log("7");
                return;
            }
            var _item=new Item();
            if(_staticId>=0){
                for(var j=0;j<items.length;j++){
                    if(items[j].staticId==_staticId){
                        exists=true;
                        break;
                    }
                }
            }
            for(var j=0;j<items.length;j++){
                if(items[j].uuid==_uuid){
                    exists=true;
                    console.log((items[j].owner==_cid)+
                               ","+JSON.stringify( items[j].p));
                    if(items[j].owner==_cid){
                        items[j].p={x:_p.x,y:_p.y,z:_p.z};
                        items[j].target=_target;
                        items[j].cp=_cp;
                    }
                    break;
                }
            }
            if(exists)continue;
            _item.id=_id;
            _item.p={x:_p.x,y:_p.y,z:_p.z};
            _item.cp=_cp;
            _item.uuid=_uuid;
            _item.target=_target;
            _item.staticId=_staticId;
            _item.owner=_owner;
            if(items.length<500)
                items.push(_item);
        }
        if(removed.length!=0){
            console.log("removed.length!=0");
        }
        for(var i=0;i<removed.length;i++){
            var _uuid=removed[i].uuid;
            var matched=-1;
            for(var j=0;j<items.length;j++){
                if(items[j].uuid==_uuid){
                    matched=j;
                    break;
                }
            }
            if(matched>=0){
                console.log("item removed:"+matched);
                items.splice(matched,1);
            }
        }
        if(request.body.added.length>0){
            console.log(items);
        }
    }
    //console.log(request.body.removed);
    var rr=JSON.stringify({
        cars:cars,state:(state),start:start,end:end,next:next,gameid:gameid,
        time:new Date().getTime(),
        items:items});
    //console.log(rr);
    response.send(rr);
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