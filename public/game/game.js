
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
camera.distance
var frontPlayer=-1;
var staticItemId=0;
var fieldItems=[

];
var addedItems=[];
var removedItems=[];
function Item(x,y,z,id,mesh){
    this.id=id;
    this.p={x:x,y:y,z:z};
    this.cp=0;
    this.uuid=Math.random();
    this.mesh=mesh;
    this.size=0.5;
    this.target=0;
    this.staticId=-1;
    this.owner=0;
    this.setStatic=function(){
        this.staticId=staticItemId;
        staticItemId++;
    }
    this.updated=true;
    this.update=function(dt){
        //console.log(player.lap);
        if(this.owner!=player.cid&&player.cid!=null){
            this.updateMesh();
            return;
        }
        //console.log("itemupdate"+this.id);
        if(this.id==3){
            logArr.push("item cp"+this.cp);
            this.updated=true;
            //this.p.x+=dt;
            var vel=70;
            var nextIndex=(this.cp+1)%(cp.length);
            var targetPoint={x:0,y:0,z:0};
            if(player.cid!=null){
                logArr.push("target cp"+(player.cp+(player.lap)*cp.length));
            }
            if((this.target==player.cid
                ||player.cid==null)&&
               player.cp+(player.lap)*cp.length<=this.cp+1){
                targetPoint=player.pos;

            }else{
                targetPoint={x:cp[nextIndex].x,y:0,z:cp[nextIndex].z};
                if(cp[nextIndex].y!=null){
                    targetPoint.y=cp[nextIndex].y;
                }
            }
            var xzd=XZDistance(this.p,targetPoint);
            if(xzd<vel*dt){
                this.p=targetPoint;
                this.cp++;
            }else{
                this.p.x+=(targetPoint.x-this.p.x)*vel*dt/xzd;
                this.p.z+=(targetPoint.z-this.p.z)*vel*dt/xzd;
                var ty=targetPoint.y;
                var yd=ty-this.p.y;
                var yd1=yd>0?yd:-yd;
                if(yd1<vel*dt){
                    this.p.y=ty;
                }else{
                    this.p.y+=(yd)*vel*dt/yd1;
                }
            }

        }
        this.updateMesh();
    }
    this.updateMesh=function(){
        this.mesh.position.x=-this.p.x;
        this.mesh.position.y=this.p.y+1;
        this.mesh.position.z=this.p.z;
        this.mesh.quaternion.copy( camera.quaternion );
    }

}

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

const LOW_FPS_TEST=false;
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
                othercar[j].spin=cs[i].spin;
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
            newcar.spin=cs[i].spin;
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
var sent_state=false;

var resChache=null;
function timer(){
    if(loadstats>0){
        if(neutralTime>end){
            if(!sent_state){
                sent_state=true;
                dogetWithError("","/state",function(res){
                    netdiv.innerHTML=res;
                    if(res=="wait"){
                        location.reload();
                    }
                    sent_state=false;
                }
                               ,function(res){
                    location.reload();
                });
            }
        }
        requestAnimationFrame(timer);
        return;
    }
    timenow=new Date().getTime();
    neutralTime=timenow+timediff;
    var dt=timenow-lasttime;
    //console.log(JSON.stringify(player.pos)+","+timenow);
    if(!sent){
        if(resChache){
            var p=resChache;
            var onlineItems=p.items;
            //console.log(p.items);
            var onlineArr=new Array(onlineItems.length);
            var fieldArr=new Array(fieldItems.length);
            for(var i=0;i<onlineItems.length;i++){
                for(var j=0;j<fieldItems.length;j++){
                    //console.log(i);
                    //console.log(onlineItems[i]);
                    //console.log(fieldItems[j]);
                    if(onlineItems[i].uuid==fieldItems[j].uuid){
                        onlineArr[i]=true;
                        fieldArr[j]=true;
                        if(onlineItems[i].owner!=player.cid){
                          console.log("position updated");  fieldItems[j].p=onlineItems[i].p;  fieldItems[j].cp=onlineItems[i].cp;  fieldItems[j].target=onlineItems[i].target;
                            
                        }
                    }
                }
            }

            //console.log(onlineArr);
            //console.log(fieldArr);
            //console.log(sentRemoved);

            for(var i=0;i<onlineArr.length;i++){
                if(onlineArr[i]){
                    
                    continue;
                }
                var _item=onlineItems[i];
                var realItem=new Item(_item.p.x,_item.p.y,_item.p.z,_item.id);
                realItem.uuid=_item.uuid;
                realItem.mesh=generateMeshForItem(_item.p.x,_item.p.y,_item.p.z,_item.id);
                realItem.staticId=_item.staticId;
                realItem.owner=_item.owner;
                realItem.cp=_item.cp;
                realItem.target=_item.target;
                fieldItems.push(realItem);
                console.log(realItem);
            }
            var removeuuids=[];
            for(var i=0;i<fieldArr.length;i++){
                for(var j=0;j<addedItems.length;j++)
                {
                    if(addedItems[j].uuid==fieldItems[i].uuid){
                        fieldArr[i]=true;
                    }
                }
                if(fieldArr[i])continue;
                removeuuids.push(fieldItems[i].uuid);
                if(fieldItems[i].id>1){
                    console.log(addedItems);
                    console.log("item removed");
                }
            }
            for(var i=0;i<removeuuids.length;i++){
                console.log("removeItemNoServer:"+removeuuids[i]);
                removeItemNoServer(removeuuids[i]);
            }
            netdiv.innerHTML="lag:"+lag+" servertime:"+p.time+" timediff:"+timediff+
                "<br>pos:"+Math.floor(player.pos.x)+","
                +Math.floor(player.pos.z)+", cid:"+
                player.cid;

        }
        var d={};
        d.pos=player.pos;
        d.vel=player.vel;
        d.rot=player.rot;
        d.cp=player.cp;
        d.lap=player.lap;
        d.cid=player.cid;
        d.acc=player.acc;
        d.goal=player.goal;
        d.spin=player.spin;
        function tmpItem(p,id,cp,uuid,target,staticId,owner){
            this.p=p;
            this.id=id;
            this.cp=cp;
            this.uuid=uuid;
            this.target=target;
            this.staticId=staticId;
            this.owner=owner;
        }
        var sentRemoved=[];
        for(var i=0;i<removedItems.length;i++){
            var o=removedItems[i];
            if(o.id>1){
                console.log("removedItems");
                console.log(o);
            }
            sentRemoved.push(new tmpItem(o.p,o.id,o.cp,o.uuid,o.target,o.staticId,
                                         o.owner));
        }
        /*
        if(removedItems.length!=0){
            console.log("sentRemoved");
            console.log(removedItems);
            console.log(sentRemoved);
        }*/
        var sentAdded=[];
        /*
        for(var i=0;i<addedItems.length;i++){
            var o=addedItems[i];
            sentAdded.push(new tmpItem(o.p,o.id,o.cp,o.uuid,o.target,o.staticId));
        }*/

        for(var i=0;i<fieldItems.length;i++){
            var o=fieldItems[i];
            if(o.id>1){
                console.log("fieldItems id>1");
                console.log(o);
            }
            if(o.updated){
                sentAdded.push(new tmpItem(o.p,o.id,o.cp,o.uuid,o.target,o.staticId,o.owner));
            }
            fieldItems[i].updated=false;
        }/*
        if(sentAdded.length!=0){
            console.log("sentAdded");
            console.log(sentAdded);
        }*/
        addedItems=[];
        removedItems=[];
        d.added=sentAdded;
        d.removed=sentRemoved;
        //console.log(d);
        senttime=timenow;
        sent=true;

        dopost(JSON.stringify(d),"/setpos",function(res){
            lag=new Date().getTime()- senttime;
            if(res=="nocar"){
                //if(rawstate=="result")rawstate="wait";
                if(creatingcar)return;
                creatingcar=true;
                return;
            }
            var p=JSON.parse(res);
            resChache=p;
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
            sent=false; 
        });
    }

    //netdiv.innerHTML=            "<br>pos:"+Math.floor(player.pos.x)+","            +Math.floor(player.pos.z);
    if(neutralTime>next){
        loadstats=1;
        requestAnimationFrame(timer);
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
        for(var i=0;i<fieldItems.length;i++){
            fieldItems[i].updateMesh();
        }
    }
    if(state=="race"){
        for(var i=0;i<fieldItems.length;i++){
            fieldItems[i].update(dt);
        }
        player.rot+=handle*dt*1;
        player.acc=1;
        if(player.goal!=null){
            player.acc=0;
        }
        player.physics(dt,true);
        if((keysPress[32]||itemTrigger)&&player.item!=0){
            var k=-1;
            if(player.item==3){
                k=dt*120+4;
                if(k<4){
                    k=4;
                }
            }
            additem(player.pos.x+Math.sin(-player.rot)*2*k,player.pos.y,player.pos.z+Math.cos(-player.rot)*2*k,player.item);
            player.item=0;
        }
        itemTrigger=false;
        //console.log(player.item);
        setItemBackground(player.item);

    }else{
        player.acc=0;
    }
    player.updateMesh();
    order=0;
    var leastACp=Infinity;//absolute cp
    var maximumDsq=0;
    frontPlayer=-1;
    for(var i=0;i<othercar.length;i++){
        if(othercar[i].cid==player.cid)continue;
        if(state=="race"){
            othercar[i].physics(dt,false);
        }
        if(state=="wait"){
            othercar[i].reset();
        }
        othercar[i].updateMesh();
        //if(othercar[i].audience){
        //    order++;
        //}else 
        var oacp=othercar[i].cp+othercar[i].lap*cp.length;
        var pacp=player.cp+player.lap*cp.length;
        if(othercar[i].goal!=null&&player.goal==null){
            order++;
        }else if(oacp>pacp){
            order++;
            if(oacp<leastACp){
                leastACp=oacp;
                frontPlayer=othercar[i].cid;
                maximumDsq=0;
            }
        }else if(oacp==pacp&&othercar[i].dsq<player.dsq){
            leastACp=oacp;
            if(othercar[i].dsq>maximumDsq){
                frontPlayer=othercar[i].cid;
                maximumDsq=othercar[i].dsq;
            }
            order++;
        }/*else if(othercar[i].lap>player.lap){
            order++;

        }else if(othercar[i].cp>player.cp){
            order++;
        }*/
    }
    if(player.mesh!=null){
        camera.position.x=player.mesh.position.x-Math.sin(player.rot)*12;
        camera.position.y=player.mesh.position.y+3.75;
        camera.position.z=player.mesh.position.z-Math.cos(player.rot)*12;
        //camera.rotation.x=Math.PI/4;
        arrow.position.set(player.mesh.position.x,player.mesh.position.y+1.75,player.mesh.position.z);
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
    if(LOW_FPS_TEST){
        setTimeout(timer,100);
    }else{
        requestAnimationFrame(timer);
    }
}
var itemBoxes=[];
function init(){
    for(var i=0;i<itemBoxes.length;i++){
        additemBox(itemBoxes[i].x,itemBoxes[i].y,itemBoxes[i].z);
    }
    /*
    additemBox(0,0.6,450);
    additemBox(-4,0.6,80);
    additemBox(-2,0.6,80);
    additemBox(0,0.6,80);
    additemBox(2,0.6,80);
    additemBox(4,0.6,80);*/
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

function generateMeshForItem(x,y,z,id){
    var geometry = new THREE.PlaneGeometry(2, 2,2);
    var material = itemMaterials[id];
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.x=-x;
    mesh.position.y=y;
    mesh.position.z=z;
    scene.add( mesh );
    return mesh;
}
function additem(x,y,z,id){/*
    var geometry = new THREE.CubeGeometry(2, 2,2);
    var material = new THREE.MeshLambertMaterial( { color: 0xffffff} );
    var mesh = new THREE.Mesh( geometry, material );*/
    var mesh=generateMeshForItem(x,y,z,id);
    var item=new Item(x,y,z,id,mesh);
    item.size=1.4;
    if(player.cid!=null){
        item.owner=player.cid;
    }else{
        item.owner=0;
    }
    item.updated=true;
    if(id==3){
        item.target=-1;
        if(frontPlayer>=0){
            item.target=frontPlayer;
            item.owner=frontPlayer;
        }
        item.cp=player.cp+1+player.lap*cp.length;
        console.log(item.cp);
    }
    //console.log(fieldItems.length);
    fieldItems.push(item);
    addedItems.push(item);
    //console.log(fieldItems);
    /*
    var ll=fieldItems.length;
    console.log(ll);
    console.log(fieldItems.length);
    console.log(fieldItems[ll-1]);
    console.log(fieldItems.length);*/
    //scene.add( mesh );
}
function additemBox(x,y,z){
    /*
    var geometry = new THREE.CubeGeometry(2, 2,2);
    var material = new THREE.MeshLambertMaterial( { color: 0xffffff} );*/
    //var mesh = new THREE.Mesh( geometry, material );
    var mesh=generateMeshForItem(x,y,z,1);
    //itemBox.push({x:x,z:z});
    var i=new Item(x,y,z,1,mesh);
    i.size=1.4;
    i.setStatic();
    fieldItems.push(i);
    addedItems.push(i);
    //scene.add( mesh );
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
function removeItem(uuid)
{
    var index=0;
    for(var i=0;i<fieldItems.length;i++){
        if(uuid==fieldItems[i].uuid){
            index=i;
            break;
        }else if(i==fieldItems.length-1){
            console.log("removeitem:not found");
            return;
        }
    }
    removedItems.push(fieldItems[index]);
    console.log("removeItem("+uuid+")");
    scene.remove(fieldItems[index].mesh);
    fieldItems.splice(index, 1);

}
function removeItemNoServer(uuid)
{
    var index=0;
    for(var i=0;i<fieldItems.length;i++){
        if(uuid==fieldItems[i].uuid){
            index=i;
            break;
        }
        if(i==fieldItems.length-1){
            console.log("removeItemNoServer:not found");
            return;
        }
    }
    scene.remove(fieldItems[index].mesh);
    fieldItems.splice(index, 1);
}
// render
function XYZDistance(v1,v2){
    return Math.sqrt((v1.x-v2.x)*(v1.x-v2.x)+(v1.z-v2.z)*(v1.z-v2.z)+(v1.y-v2.y)*(v1.y-v2.y))
}
function XZDistance(v1,v2){
    return Math.sqrt((v1.x-v2.x)*(v1.x-v2.x)+(v1.z-v2.z)*(v1.z-v2.z))
}
check();
