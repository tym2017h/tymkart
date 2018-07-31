var width = window.innerWidth;
var height = window.innerHeight;
var renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.setSize(width, height);
renderer.setClearColor(0xbbccff);
renderer.domElement.style.position = "absolute";
renderer.domElement.style.zIndex = "0";
document.body.appendChild(renderer.domElement);
var order=0;
var targetList=[];
var boostList=[];
var slopeList=[];
var projector = new THREE.Projector();
var ambient=0x444477;
var sun=0xbbbb88;
var camera = new THREE.PerspectiveCamera();
camera.aspect=width/height;
camera.fov=80;
camera.updateProjectionMatrix();
camera.position.z = -5;
camera.position.y = 3;
camera.rotation.y=Math.PI;
var scene = new THREE.Scene();
var cp=[
    {x:0,z:0},
    {x:0,z:280},
    {x:-80,z:384},
    {x:0,z:448},
    {x:248,z:434},//-62 -108
    {x:320,z:364},
    {x:226,z:260},//-56.5 -57.5
    {x:220,z:36},
    {x:184,z:-32},
    {x:40,z:-36},
    {x:-52,z:-84},//13 21
    {x:-92,z:-40},//23 10
    {x:-60,z:-8},//15 2
    {x:-16,z:-22},//4 5.6
    {x:0,z:0}
];
var itemBox = [];
var carGeo = new THREE.CubeGeometry(1, 1, 1);
var carMatA = new THREE.MeshLambertMaterial( { color: 0xffffff,transparent:true,opacity:0.5} );
var carMat = new THREE.MeshLambertMaterial( { color: 0xffffff} );
var player=new Car();

var arrow;
(function(){
    var geom = new THREE.Geometry(); 
    var v1 = new THREE.Vector3(1,0,2);
    var v2 = new THREE.Vector3(-1,0,2);
    var v3 = new THREE.Vector3(0,0,3);

    geom.vertices.push(v1);
    geom.vertices.push(v2);
    geom.vertices.push(v3);

    geom.vertices.push(new THREE.Vector3(-0.25,0,2));
    geom.vertices.push(new THREE.Vector3(0.25,0,0));
    geom.vertices.push(new THREE.Vector3(-0.25,0,0));
    geom.vertices.push(new THREE.Vector3(-0.25,0,2));
    geom.vertices.push(new THREE.Vector3(0.25,0,2));
    geom.vertices.push(new THREE.Vector3(0.25,0,0));

    geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
    geom.faces.push( new THREE.Face3( 3, 4, 5 ) );
    geom.faces.push( new THREE.Face3( 6, 7, 8 ) );

    geom.faces.push( new THREE.Face3( 2, 1, 0 ) );
    geom.faces.push( new THREE.Face3( 5, 4, 3 ) );
    geom.faces.push( new THREE.Face3( 8, 7, 6 ) );

    //geom=new THREE.CubeGeometry(,1,1);
    arrow = new THREE.Mesh( geom, new THREE.MeshBasicMaterial({color:0xffff00,transparent:true,opacity:0.5}) );
    scene.add(arrow);
    arrow.position.y=1;
})();

//player.setMesh(carGeo,carMat);
(function(){
    var light = new THREE.DirectionalLight(sun,1);
    light.position.set(1, 1, 2).normalize();
    scene.add( light );
})();
(function(){
    var light = new THREE.DirectionalLight(sun,1);
    light.position.set(-1, 1, -2).normalize();
    scene.add( light );
})();
var l2 = new THREE.AmbientLight(ambient);
scene.add( l2 );
//network
var clientstart=null;

var state="wait";
var start=new Date().getTime()+10000;
var end=new Date().getTime()+180000;
var next=end+10000;
var sent=false;
var gameid=null;
var timediff=null;
var timedifflag=null;
var lag=null;
var senttime=null;
var neutralTime=null;

var LAP_ENDS=1;
doget(null,"/newcar",function(e){
    var d=JSON.parse(e);
    player.cid=d.cid;
    state=d.state;
    rawstate=d.state;
    start=d.start;
    end=d.end;
    next=d.next;
    player.audience=d.audience;
    gameid=d.gameid;
    //alert("your cid is "+player.cid);
});
var othercar=[];
function updatecars(cs){
    for(var i=0;i<cs.length;i++){
        var exists=false;
        for(var j=0;j<othercar.length;j++){
            if(exists)continue;
            if(othercar[j].cid==cs[i].cid){
                othercar[j].pos=cs[i].pos;
                othercar[j].vel=cs[i].vel;
                othercar[j].rot=cs[i].rot;
                othercar[j].acc=cs[i].acc;
                othercar[j].goal=cs[i].goal;
                othercar[j].audience=cs[i].audience;
                //othercar[j].physics(lag*0.001);
                exists=true;
            }
        }
        if(!exists&&cs[i].cid!=player.cid){
            var newcar=new Car();
            newcar.pos=cs[i].pos;
            newcar.cid=cs[i].cid;
            newcar.vel=cs[i].vel;
            newcar.rot=cs[i].rot;
            newcar.acc=cs[i].acc;
            newcar.goal=cs[i].goal;
            newcar.audience=cs[i].audience;
            if(carobj!=null){
                var obj1=carobj.GdeepCloneMaterials();
                newcar.setObj(obj1);
                scene.add(obj1);
            }
            newcar.physics(lag*0.001);
            othercar.push(newcar);
        }
    }
}
var lasttime=new Date().getTime();
function rotate(x,y,r){
    var cos=Math.cos(r);
    var sin=Math.sin(r);
    var p={x:x*cos-y*sin,y:x*sin+y*cos};
    return p;
}
/*
for(var i=0;i<cp.length;i++){

    var geometry = new THREE.CubeGeometry(1, 5, 1);
    var material = new THREE.MeshLambertMaterial( { color: 0x00ff00} );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.x=-cp[i].x;
    mesh.position.y=3;
    mesh.position.z=cp[i].z;
    scene.add( mesh );

}*/
var creatingcar=false;
var timenow=new Date().getTime();
console.log(player.pos);
var firststate=null;
var rawstate=state;
function timer(){
    if(loadstats>0){
        requestAnimationFrame(timer);
        return;
    }
    timenow=new Date().getTime();
    neutralTime=timenow+timediff;
    var dt=timenow-lasttime;
    //console.log(JSON.stringify(player.pos)+","+timenow);
    if(!sent){
        var d={};
        d.pos=player.pos;
        d.vel=player.vel;
        d.rot=player.rot;
        d.cp=player.cp;
        d.lap=player.lap;
        d.cid=player.cid;
        d.acc=player.acc;
        d.goal=player.goal;
        senttime=timenow;
        dopost(JSON.stringify(d),"/setpos",function(res){
            lag=new Date().getTime()- senttime;
            sent=false; 
            if(res=="nocar"){
                if(rawstate=="result")rawstate="wait";
                if(creatingcar)return;
                creatingcar=true;
                return;
            }
            var p=JSON.parse(res);
            updatecars(p.cars);
            //console.log(res);
            console.log(p.state);
            state=p.state;
            rawstate=p.state;
            start=p.start;
            end=p.end;
            next=p.next;
            gameid=p.gameid;
            timedifflag=p.time-senttime;
            //timediff=timedifflag-lag/2;
            timediff=p.time+lag/2-new Date().getTime();//timediff+time=servertime
            if(firststate==null){
                firststate=state;
                if(state!="wait"){
                    player.audience=true;
                }
            }
            netdiv.innerHTML="lag:"+lag+" servertime:"+p.time+" timediff:"+timediff+
                "<br>pos:"+Math.floor(player.pos.x)+","
            +Math.floor(player.pos.z);
        });
        sent=true;
    }
            
    //netdiv.innerHTML=            "<br>pos:"+Math.floor(player.pos.x)+","            +Math.floor(player.pos.z);
    if(neutralTime>next&&(rawstate!=="result")){
        location.reload();
        loadstats=1;
        return;
    }else if(neutralTime>end){
        state="result";
    }else if(neutralTime>start){
        state="race";
    }else {
        state="wait";
    }
    //neutralTime=timenow-timediff;
    dt*=0.001;
    handle=tilt;
    //lap.innerHTML=player.lap;
    if(keysPress[37]==true)handle=1;
    if(keysPress[39]==true)handle=-1;
    if(state=="wait"){
        player.reset();
    }
    if(state=="race"){
        player.rot+=handle*dt*1;
        player.acc=1;
        if(player.goal!=null){
            player.acc=0;
        }
        player.physics(dt,true);
    }else{
        player.acc=0;
    }
    player.updateMesh();
    order=0;
    for(var i=0;i<othercar.length;i++){
        if(othercar[i].cid==player.cid)continue;
        if(state=="race"){
            othercar[i].physics(dt,false);
        }
        if(state=="wait"){
            othercar[i].reset();
        }
        othercar[i].updateMesh();
        if(othercar[i].audience){
            order++;
        }else if(othercar[i].goal!=null&&player.goal==null){
            order++;
        }else if(othercar[i].lap>player.lap){
            order++;
        }else if(othercar[i].cp>player.cp){
            order++;
        }else if(othercar[i].cp==player.cp&&othercar[i].dsq<player.dsq){
            order++;
        }
    }
    if(player.mesh!=null){
        camera.position.x=player.mesh.position.x-Math.sin(player.rot)*12;
        camera.position.y=player.mesh.position.y+4.75;
        camera.position.z=player.mesh.position.z-Math.cos(player.rot)*12;
        //camera.rotation.x=Math.PI/4;
        arrow.position.set(player.mesh.position.x,player.mesh.position.y+3.75,player.mesh.position.z);
        arrow.rotation.y=-Math.atan2(cp[player.cp].x-player.pos.x,cp[player.cp].z-player.pos.z);
        var p={x:player.mesh.position.x,y:player.mesh.position.y,z:player.mesh.position.z};
        camera.lookAt(p);
        //p.rotation.y+=handle*0.1;
    }
    //alert(camera.rotation.x+","+camera.rotation.y+","+camera.rotation.z);
    //camera.rotation.y=0;
    //camera.lookAt(player.mesh);

    //camera.rotation.y=player.rot;
    if(player.lap>LAP_ENDS&&player.goal==null){
        player.goal=neutralTime-start;
    }
    //console.log(scene);
    //console.log(camera);
    try{
    renderer.render( scene, camera );  
    }catch(e){
        //console.log(e)
    }
    ui();
    lasttime=timenow;
    requestAnimationFrame(timer);
}
check();
function init(){
    additemBox(0,0.6,450);
    additemBox(0,0.6,80);
}
function check()
{
    //loadstats=0;
    if(loadstats<=0){
        init();
        timer();
    }else{
        setTimeout(check,100);
    }
}
function additemBox(x,y,z){
    var geometry = new THREE.CubeGeometry(2, 2,2);
    var material = new THREE.MeshLambertMaterial( { color: 0xffffff} );
    var mesh = new THREE.Mesh( geometry, material );
    itemBox.push({x:x,z:z});
    mesh.position.x=x;
    mesh.position.y=y;
    mesh.position.z=z;
    scene.add( mesh );
}
function addcube(x,y,z){
    var geometry = new THREE.CubeGeometry(2, 2, 2);
    var material = new THREE.MeshLambertMaterial( { color: 0xffffff} );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.x=x;
    mesh.position.y=y;
    mesh.position.z=z;
    scene.add( mesh );
    targetList.push(mesh);
}
function addlongcube(x,y,z,sx,sy,sz){
    var geometry = new THREE.CubeGeometry(sx, sy, sz);
    var material = new THREE.MeshLambertMaterial( { color: 0xffffff} );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.x=x;
    mesh.position.y=y;
    mesh.position.z=z;
    scene.add( mesh );
    targetList.push(mesh);
}
// render