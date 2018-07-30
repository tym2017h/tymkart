var stages=[
    {path:"jsonmodel/tym2.json"}
];
var stageId=0;
var loadstats=0;
loadstats++;
/*
(function(){
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath("obj/")
    mtlLoader.load( "tym2.mtl", function( materials ) {

        materials.preload();
            console.log(materials.materials);
        for(var i=0;i<materials.materials.length;i++){
            materials.materials[i].alphaTest=0.5;
            materials.materials[i].depthTest = false;

            console.log(materials.materials[i]);
        }
        var loader = new THREE.OBJLoader();
        loader.setMaterials(materials);
        loader.setPath("obj/");
        loader.load("tym2.obj",function ( obj ) {
            obj.scale.set(4,4,4);
            console.log(obj);
            for(var i=0;i<=obj.children.length;i++){
                var w="wall";
                try{
                    obj.children[i].needsUpdate=obj.children[i].needsUpdate;
                }catch(e){
                    //obj.children.splice(i, 1);
                }

                try{
                    //console.log(obj.children[i].material);
                    //if(obj.children[i].material.Tp){
                    console.log(obj.children[i].material);
                    if(obj.children[i].material.transparent){
                        var tpm=new THREE.MeshLambertMaterial({color:0xffff00});
                        console.log(obj.children[i].material);
                        obj.children[i].material=tpm;
                    }
                }catch(e){
                }
                var str;
                try{
                str=obj.children[i].name.slice(0,w.length);
                }catch(e){
                    continue;
                }
                if(str==w){
                    targetList.push(obj.children[i]);
                }
                var w1="boost";
                try{
                str=obj.children[i].name.slice(0,w1.length);
                }catch(e){
                    continue;
                }
                if(str==w1){
                    boostList.push(obj.children[i]);
                }
            }

            scene.add( obj );
            loadstats--;
            console.log(targetList);
            console.log(boostList);
        });
    });
})();*/
dogetWithError("","/stage",function(res){
    console.log(res);
    stageId=parseInt(res)%stages.length;
    LoadStage(); 
},function(){
    stageId=Math.floor(Math.random()*100)%stages.length;
    console.log(stageId);
    LoadStage(); 
});
var LoadStage=(function(){
    var loader = new THREE.ObjectLoader();
    loader.load("jsonmodel/tym2.json",function ( obj ) {
        obj.scale.set(4,4,4);
        console.log(obj);
        for(var i=0;i<=obj.children.length;i++){
            var w="wall";
            var str;
            try{
                str=obj.children[i].name.slice(0,w.length);
            }catch(e){
                continue;
            }
            if(str==w){
                targetList.push(obj.children[i]);
            }
            var w1="boost";
            try{
                str=obj.children[i].name.slice(0,w1.length);
            }catch(e){
                continue;
            }
            if(str==w1){
                boostList.push(obj.children[i]);
            }
        }
        scene.add( obj );
        loadstats--;
        console.log(targetList);
        console.log(boostList);
    });
});
/*
(function(){
    var loader = new THREE.ObjectLoader();
    loader.load("models/stage.json",function ( obj ) {
        loadstats--;
        //obj.position.set(10,0,30);
        //obj.rotation.y=Math.PI/4*5;
        obj.scale.set(4,4,4);
        for(var i=0;i<=6;i++){
            setchildcollision(obj,"wall"+i);
        }
        scene.add( obj );
        console.log(targetList);
    });
})();*/
function setchildcollision(obj,name){
    var mesh=obj.getObjectByName(name,true);
    ;
    console.log(mesh);
    targetList.push(mesh);
}
var carobj;
loadstats++;

(function(){
    var loader = new THREE.ObjectLoader();
    loader.load("models/car.json",function ( obj ) {
        loadstats--;
        //obj.position.set(10,0,30);
        //obj.rotation.y=Math.PI/4*5;
        obj.scale.set(0.5,0.5,0.5);
        carobj=obj;
        var obj1=obj.GdeepCloneMaterials();
        scene.add(obj1);
        player.setObj(obj1);
        /*
        for(var i in obj1.children){
            console.log(i.name);
        }
        */
        //console.log(obj1.getChildByName("Cube_Cube.001",true));
        var n=10;
        if(othercar.length>n)n=othercar.length;
        for(var i=0;i<n;i++){
            var obj2=carobj.GdeepCloneMaterials();
            obj2.position.set(i+10,0,0);
            scene.add(obj2);
            if(i<othercar.length&&(!othercar[i].mesh)){
                othercar[i].setObj(obj2);
            }
        }
        console.log(obj1.children);
        /*
        for(var i=0;i<othercar.length;i++){
            var obj2=carobj.GdeepCloneMaterials();
            scene.add(obj2);
            othercar[i].setObj(obj2);
        }*/
        //player.setObj(obj);
    });
})();
/** Gives the aptitude for an object3D to clone recursively with its material cloned (normal clone does not clone material)*/

THREE.Object3D.prototype.GdeepCloneMaterials = function() {
    var object = this.clone( new THREE.Object3D(), false );

    for ( var i = 0; i < this.children.length; i++ ) {

        var child = this.children[ i ];
        if ( child.GdeepCloneMaterials ) {
            object.add( child.GdeepCloneMaterials() );
        } else {
            object.add( child.clone() );
        }

    }
    return object;
};

THREE.Mesh.prototype.GdeepCloneMaterials = function( object, recursive ) {
    if ( object === undefined ) {
        object = new THREE.Mesh( this.geometry, this.material.clone() );
    }

    THREE.Object3D.prototype.GdeepCloneMaterials.call( this, object, recursive );

    return object;
};