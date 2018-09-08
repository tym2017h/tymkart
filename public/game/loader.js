function coord(x,y,z){
    this.x=x;
    this.y=y;
    this.z=z;
}
var stages=[
    {
        path:"jsonmodel/tym2.json",
        cp:[
            {x:0,z:0},
            {x:0,z:280},
            {x:-80,z:384},
            {x:-67,z:430},
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
        ],
        lap:1,
        renderDistance:300,
        item:[new coord(-4,0.6,100),
             new coord(-2,0.6,100),
             new coord(0,0.6,100),
             new coord(2,0.6,100),
             new coord(4,0.6,100),
              
             new coord(0,0.6,454),
             new coord(0,0.6,452),
             new coord(0,0.6,450),
             new coord(0,0.6,448),
             new coord(0,0.6,446),
              
             new coord(216,0.6,49),
             new coord(218,0.6,49),
             new coord(220,0.6,49),
             new coord(222,0.6,49),
             new coord(224,0.6,49),
              
             new coord(50,0.6,-34),
             new coord(50,0.6,-36),
             new coord(50,0.6,-38),
             new coord(50,0.6,-40),
             new coord(50,0.6,-42),]},{
            path:"tyminside/tym3acopiedSep.json",
            cp:[
                {x:-0.0,y:0.0,z:165.81021118164062},
{x:45.50059127807617,y:0.0,z:196.35171508789062},
{x:105.17279815673828,y:0.0,z:198.2216033935547},
{x:181.54405212402344,y:19.36359977722168,z:198.2216033935547},
{x:130.68565368652344,y:45.44776916503906,z:42.9554443359375},
{x:112.71247100830078,y:45.44776916503906,z:166.16256713867188},
{x:209.23663330078125,y:20.46858787536621,z:209.224365234375},
{x:248.12864685058594,y:23.198684692382812,z:253.3659210205078},
{x:366.8879089355469,y:24.173276901245117,z:248.0838165283203},
{x:366.8879089355469,y:24.173276901245117,z:176.93792724609375},
{x:423.30474853515625,y:21.419025421142578,z:176.93792724609375},
{x:419.09893798828125,y:21.419025421142578,z:107.27325439453125},
{x:341.32720947265625,y:0.0,z:49.21464157104492},
{x:285.33270263671875,y:0.0,z:-48.07014083862305},
{x:71.40111541748047,y:0.0,z:-56.586997985839844},
{x:-28.95150375366211,y:0.0,z:-120.40379333496094},
{x:-122.92648315429688,y:0.0,z:-110.8325424194336},
{x:-136.03753662109375,y:0.0,z:-62.462547302246094},
{x:-77.74522399902344,y:0.0,z:-13.518705368041992},
{x:-13.210227966308594,y:0.0,z:-28.342727661132812},
               ],
            lap:2,
            renderDistance:100,
             item:[
                {x:-2.0,y:0.0,z:130.8},
                {x:-0.0,y:0.0,z:130.8},
                {x:2.0,y:0.0,z:130.8},
                {x:4.0,y:0.0,z:130.8},
                {x:6.0,y:0.0,z:130.8},
                {x:105,y:0.0,z:192},
                {x:105,y:0.0,z:194},
                {x:105,y:0.0,z:196},
                {x:105,y:0.0,z:198},
                {x:105,y:0.0,z:200},
                 
                 {x:108,y:44,z:166},
                 {x:110,y:44,z:166},
                 {x:112,y:44,z:166},
                 {x:114,y:44,z:166},
                 {x:116,y:44,z:166},
                 
                 {x:300,y:23,z:249},
                 {x:300,y:23,z:251},
                 {x:300,y:23,z:253},
                 {x:300,y:23,z:255},
                 {x:300,y:23,z:257},
                 
                 {x:418,y:21,z:110},
                 {x:417,y:21,z:109},
                 {x:418,y:21,z:108},
                 {x:419,y:21,z:107},
                 {x:420,y:21,z:106},
                 {x:421,y:21,z:105},
                 {x:422,y:21,z:104},
                 
                 {x:-28,y:0.0,z:-122},
                 {x:-28,y:0.0,z:-120},
                 {x:-28,y:0.0,z:-118},
                 {x:-28,y:0.0,z:-116},
                 {x:-28,y:0.0,z:-114},
                 {x:-28,y:0.0,z:-112},
                 {x:-28,y:0.0,z:-110},
                 {x:-28,y:0.0,z:-108},
             ]}
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
    console.log(stages[stageId].cp);
    cp=stages[stageId].cp;
    LAP_ENDS=stages[stageId].lap;
    itemBoxes=stages[stageId].item;
    var loader = new THREE.ObjectLoader();
    loader.load(stages[stageId].path,function ( obj ) {
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
            var w2="slope";
            try{
                str=obj.children[i].name.slice(0,w2.length);
            }catch(e){
                continue;
            }
            if(str==w2){
                slopeList.push(obj.children[i]);
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

var itemMaterials=[undefined,undefined,undefined,undefined];

(function(){
    var loader = new THREE.TextureLoader();
    /*
    itemMaterials[1]=new THREE.MeshBasicMaterial( {
        color:0xaaaaff,
        transparent:true,
        opacity:0.5
    } );*/
    loadstats++;
    // load a resource
    loader.load(
        // resource URL
        'textures/itemBox.png',

        // onLoad callback
        function ( texture ) {
            // in this example we create the material when the texture is loaded
            var material = new THREE.MeshBasicMaterial( {
                map: texture,
                opacity:0.6,
                //alphaTest:0.18,
                transparent:true
            } );
            itemMaterials[1]=material;
            loadstats--;
        },

        // onProgress callback currently not supported
        undefined,

        // onError callback
        function ( err ) {
            console.error( 'An error happened.' );
            loadstats--;
        }
    );
    loadstats++;
    // load a resource
    loader.load(
        // resource URL
        'textures/toyama.gif',

        // onLoad callback
        function ( texture ) {
            // in this example we create the material when the texture is loaded
            var material = new THREE.MeshBasicMaterial( {
                map: texture,
                alphaTest:0.18,
                transparent:true
            } );
            itemMaterials[3]=material;
            loadstats--;
        },

        // onProgress callback currently not supported
        undefined,

        // onError callback
        function ( err ) {
            console.error( 'An error happened.' );
            loadstats--;
        }
    );
    loadstats++;
    // load a resource
    loader.load(
        // resource URL
        'textures/banana.png',

        // onLoad callback
        function ( texture ) {
            // in this example we create the material when the texture is loaded
            var material = new THREE.MeshBasicMaterial( {
                map: texture,
                alphaTest:0.18,
                transparent:true
            } );
            itemMaterials[2]=material;
            loadstats--;
        },

        // onProgress callback currently not supported
        undefined,

        // onError callback
        function ( err ) {
            console.error( 'An error happened.' );
            loadstats--;
        }
    );
})();
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