var Car=function(){
    this.item=0;//0:none 2:banana 3:red
    this.audience=false;
    this.cp=0;
    this.lap=1;
    this.mesh=null;
    this.setObj=function(obj){
        this.mesh=obj;
        console.log("setobj");
        console.log(obj);
    }
    this.setMesh=function(geo,mat){
        this.mesh=new THREE.Mesh(geo,mat);
        this.mesh.name="car"+this.cid;
        scene.add(this.mesh);
    }
    this.cid=null;
    this.pos={x:0,y:0,z:-20};
    this.lastpos={x:0,y:0,z:-20};
    this.vel={x:0,y:0,z:0};
    this.rot=0;//radian
    this.fric=10;
    this.drag=1;
    this.acc=0;
    this.power=5;
    this.boostedSpeed=50;
    this.boost=0;
    this.terminalVelocity=30;
    this.spin=0;
    this.effectRot=0;
    this.reset=function(){
        this.pos={x:Math.floor(this.cid%5),y:0,z:Math.floor(this.cid/5)};
        this.vel={x:0,z:0};
        this.rot=0;
    }
    this.updateMesh=function(){
        if(this.mesh==null)return;
        this.mesh.position.x=-this.pos.x;
        this.mesh.position.z=this.pos.z;
        this.mesh.position.y=0.25+this.pos.y;
        this.mesh.rotation.y=this.rot+this.effectRot;
    }
    this.collidedTime=0;
    this.physics=function(dt,isplayer){
        //ma+kv=0
        //k=-ma/vel
        var drag=-this.power/this.terminalVelocity;
        var a=rotate(0,this.acc,this.rot);
        var abvel=XZDistance({x:0,z:0},this.vel);
        if(!isplayer){
            /*
            this.vel.x+=dt*a.x;
            this.vel.z+=dt*a.y;
            this.vel.x+=this.vel.x*drag*dt;
            this.vel.z+=this.vel.z*drag*dt;
            return;*/
        }
        //collision
        //netdiv.innerHTML=Math.sqrt(this.vel.x*this.vel.x+this.vel.z*this.vel.z);
        var res=8;
        var collided=false;
        var mg=Math.sqrt(this.vel.x*this.vel.x+this.vel.z*this.vel.z);
        var dpdt=mg*dt;
        for(var i=-3;i<3;i++){
            var h=i*0.1;
            var rv=rotate(this.vel.x/abvel,this.vel.z/abvel,0);
            var ray = new THREE.Raycaster(new THREE.Vector3(-this.pos.x,this.pos.y+h,this.pos.z), new THREE.Vector3(-rv.x, 0, rv.y).normalize());

            var obj = ray.intersectObjects(targetList);
            if (obj.length > 0) {
                var d=obj[0].distance;
                //console.log("detected"+d);
                var n=obj[0].face.normal;
                var spring=abvel*dt+0.5-d;
                if(spring>0){
                    this.vel.x=0;
                    this.vel.z=0;
                    this.pos.x=this.lastpos.x;
                    this.pos.y=this.lastpos.y;
                    this.pos.z=this.lastpos.z;
                }
            }
        }
        /*
        for(var i=-res/2;i<res/2;i++){
            if(collided)continue;
            var rv=rotate(this.vel.x/v,this.vel.z/v,Math.PI/2/res*i);
            var ray = new THREE.Raycaster(new THREE.Vector3(-this.pos.x,0,this.pos.z), new THREE.Vector3(-rv.x, 0, rv.y).normalize());
            var obj = ray.intersectObjects(targetList);
            if (obj.length > 0) {
                var d=obj[0].distance;
                var n=obj[0].face.normal;
                console.log(n);
                if(d<0.5||(d<0.5+dpdt&&i==0)){
                    this.vel.x+=this.vel.x*n.x*1;//-rv.x*v;
                    this.vel.z+=this.vel.z*n.z*1;
                    this.pos.x+=n.x*0.3;
                    this.pos.z+=n.z*0.3;

                    if(timenow-this.collidedTime<100){
                        this.vel.x=this.vel.x*n.x;//-rv.x*v;
                        this.vel.z=-rv.y*v;
                    }else{
                        this.vel.x+=-rv.x*v;
                        this.vel.z+=-rv.y*v;

                    }
                    collided=true;

                    this.collidedTime=timenow;
                }
            } 
        }*/
        //if(!collided){
        //}

        var p=this.power;
        {
            var tempY=0;
            for(var i=0;i<4;i++){
                var vec=rotate(0,1,this.rot+Math.PI/2*i);
                //console.log(vec);
                var ray = new THREE.Raycaster(new THREE.Vector3(-this.pos.x+vec.x,this.pos.y+1,this.pos.z+vec.y), new THREE.Vector3(0, -1, 0));
                var obj = ray.intersectObjects(boostList);
                if (obj.length > 0) {
                    this.boost=1;
                }
                var obj = ray.intersectObjects(slopeList);
                if (obj.length > 0) {
                    if(tempY<obj[0].point.y){
                        tempY=obj[0].point.y;
                    }
                }
            }
            if(tempY<this.pos.y){
                var ray = new THREE.Raycaster(new THREE.Vector3(-this.lastpos.x,this.lastpos.y+1,this.lastpos.z), new THREE.Vector3(-this.vel.x, 0, this.vel.z).normalize());
                var obj = ray.intersectObjects(slopeList);
                var dd=XZDistance({x:0,z:0},this.vel)*dt;
                if (obj.length > 0){
                    console.log((obj[0].point.y-this.lastpos.y)/obj[0].distance);
                    if(obj[0].distance<dd&&obj[0].point.y>this.lastpos.y) {
                        tempY=this.lastpos.y+(obj[0].point.y-this.lastpos.y)*dd/obj[0].distance;
                    }
                }
            }
            this.pos.y=tempY;
            this.vel.y=0;
        }
        this.lastpos.x=this.pos.x;
        this.lastpos.z=this.pos.z;

        this.lastpos.y=this.pos.y;
        this.pos.x+=this.vel.x*dt;
        this.pos.z+=this.vel.z*dt;

        this.boost-=dt;
        if(isplayer){
            var collidedItems=[];
            for(var i=0;i<fieldItems.length;i++){
                if(XYZDistance(fieldItems[i].p,this.pos)<0.5+fieldItems[i].size){
                    collidedItems.push(fieldItems[i]);
                }
            }
            
            for(var i=0;i<collidedItems.length;i++){
                switch(collidedItems[i].id){
                    case 3:
                       if(collidedItems[i].target>0&&
                         collidedItems[i].target!=player.cid){
                           continue;
                       } 
                    case 2:
                        this.spin=1;
                        break;
                    case 1:
                        if(this.item==0)
                            this.item=Math.round(Math.random()*1)+2;
                        break;
                }
                removeItem(collidedItems[i].uuid);
                //removeItem(collidedItemsId[i]);
            }
        }
        if(this.spin<=0){
            this.effectRot=0;
            if(this.boost>0){
                this.vel.x=a.x*this.boostedSpeed;
                this.vel.z=a.y*this.boostedSpeed;
            }else{
                this.vel.x+=dt*a.x*p;
                this.vel.z+=dt*a.y*p;
            }
        }else{
            this.vel.x=0;
            this.vel.z=0;
            this.spin-=dt;
            this.effectRot+=dt*6;
        }
        var v1=rotate(this.vel.x,this.vel.z,-this.rot);
        var relativeSideForce=v1.x;
        var sideforce=rotate(v1.x,0,this.rot);
        this.vel.x-=sideforce.x*dt*this.fric;
        this.vel.z-=sideforce.y*dt*this.fric;
        if(this.vel.x*this.vel.x+this.vel.z*this.vel.z>this.terminalVelocity*this.terminalVelocity){
            this.vel.x+=this.vel.x*drag*10*dt;
            this.vel.z+=this.vel.z*drag*10*dt;
        }else{
            //this.vel.x+=this.vel.x*drag*dt;
            //this.vel.z+=this.vel.z*drag*dt;
        }

        var relativevelX;
        var relativevelZ;
        //order
        this.checklapend();
        var tp=cp[this.cp];
        var dx=tp.x-this.pos.x;
        var dz=tp.z-this.pos.z;
        this.dsq=dx*dx+dz*dz;
        if(this.dsq<100){
            this.cp++;
            this.checklapend();
            tp=cp[this.cp];
            dx=tp.x-this.pos.x;
            dz=tp.z-this.pos.z;
            this.dsq=dx*dx+dz*dz;
        }
        //this.dsq=
    }
    this.checklapend=function(){
        if(this.cp>=cp.length){
            this.lap++;
            this.cp=1;
        }
    }
    this.goal=null;
    this.dsq=Infinity;
};
