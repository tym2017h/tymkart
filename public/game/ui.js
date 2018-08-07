//ui
var linearGrad="linear-gradient(to right, rgba(30,30,30,0.8),rgba(30,30,30,0.7),rgba(30,30,30,0.8))";
var tdStyle="background:"+linearGrad+";border:10px;"+"font-size:30px;";
var linearGrad2="linear-gradient(to top, rgba(240,240,30,0.8),rgba(30,30,30,0.7),rgba(30,30,30,0.7),rgba(240,240,30,0.8))";
var tdStyle2="background:"+linearGrad2+";border:10px;color:#fff;"+"font-size:30px;";
var count=document.createElement("div");
count.style.position="absolute";
count.style.width=window.innerWidth+"px";
count.style.top=(window.innerHeight/2-20)+"px";
count.style.fontSize="40px";
count.style.textAlign="center";
count.style.color="#fff";
count.style.zIndex="1";
count.style.background="linear-gradient(to right, rgba(0,0,130,0.1),rgba(0,0,130,0.7),rgba(0,0,130,0.1))";
document.body.appendChild(count);
var lap=document.createElement("div");
lap.style.position="absolute";
lap.style.zIndex="1";
lap.style.color="white";
lap.style.background="linear-gradient(to right, rgba(0,0,130,0.5),rgba(0,0,130,0.7),rgba(0,0,130,0.5))";
document.body.appendChild(lap);
var orderdiv=document.createElement("div");
orderdiv.style.position="absolute";
orderdiv.style.left=(window.innerWidth-230)+"px";
orderdiv.style.width="230px";
orderdiv.style.height="60px";
orderdiv.style.fontSize="40px";
orderdiv.style.textAlign="center";
orderdiv.style.color="#fff";
orderdiv.style.zIndex="1";
orderdiv.style.background="linear-gradient(to right, rgba(0,0,130,0.1),rgba(0,0,130,0.7),rgba(0,0,130,0.1))";
document.body.appendChild(orderdiv);

var netdiv=document.createElement("div");
netdiv.style.position="absolute";
netdiv.style.zIndex="1";
netdiv.style.color="white";
netdiv.style.top= (window.innerHeight-80)+"px";
netdiv.style.height="80px";
netdiv.style.width="200px";
netdiv.style.background="linear-gradient(to right, rgba(0,0,130,0.5),rgba(0,0,130,0.7),rgba(0,0,130,0.5))";
document.body.appendChild(netdiv);


var dialogdiv=document.createElement("div");
dialogdiv.style.position="absolute";
dialogdiv.style.zIndex="1";
dialogdiv.style.color="white";
dialogdiv.style.top= 100+"px";
dialogdiv.style.height="80px";
dialogdiv.style.width=window.innerWidth+"px";
dialogdiv.style.fontSize="50px"
dialogdiv.style.background="linear-gradient(to right, rgba(0,0,130,0.5),rgba(0,0,130,0.7),rgba(0,0,130,0.5))";
document.body.appendChild(dialogdiv);

var resultTable=document.createElement("table");
resultTable.style.position="absolute";
resultTable.style.zIndex="1";
resultTable.style.color="white";
resultTable.style.top= (window.innerHeight/2)+"px";
resultTable.style.left= window.innerWidth/2+"px";
resultTable.style.fontSize="30px";

//button
var leftButton=document.createElement("div");
leftButton.style.position="absolute";
leftButton.style.zIndex="1";
leftButton.style.color="white";
leftButton.style.top= (window.innerHeight-80-(window.innerWidth*0.3))+"px";

leftButton.style.height=(window.innerWidth*0.3)+"px";
leftButton.style.width=(window.innerWidth*0.3)+"px";

leftButton.style.background="linear-gradient(to right, rgba(50,50,50,0.5),rgba(50,50,50,0.7),rgba(50,50,50,0.5))";
document.body.appendChild(leftButton);
var leftImg=document.createElement("div");
leftImg.style.backgroundImage="url('textures/left.png')";
leftImg.style.width="100%";
leftImg.style.height="100%";
leftImg.style.backgroundSize="cover";
leftButton.appendChild(leftImg);

var rightButton=document.createElement("div");
rightButton.style.position="absolute";
rightButton.style.zIndex="1";
rightButton.style.color="white";
rightButton.style.top= (window.innerHeight-80-(window.innerWidth*0.3))+"px";
rightButton.style.left=(window.innerWidth*0.7)+"px";
rightButton.style.height=(window.innerWidth*0.3)+"px";
rightButton.style.width=(window.innerWidth*0.3)+"px";

rightButton.style.background="linear-gradient(to right, rgba(50,50,50,0.5),rgba(50,50,50,0.7),rgba(50,50,50,0.5))";
document.body.appendChild(rightButton);
var rightImg=document.createElement("div");
rightImg.style.backgroundImage="url('textures/right.png')";
rightImg.style.width="100%";
rightImg.style.height="100%";
rightImg.style.backgroundSize="cover";
rightButton.appendChild(rightImg);


//resultTable.style.background="linear-gradient(to right, rgba(0,0,130,0.5),rgba(0,0,130,0.7),rgba(0,0,130,0.5))";
var tbody=document.createElement("tbody");
resultTable.appendChild(tbody);
document.body.appendChild(resultTable);
var tabletxt1="";

var itemImg=document.createElement("div");
itemImg.style.backgroundImage="url('textures/toyama.gif')";
itemImg.style.width="100%";
itemImg.style.height="100%";
itemImg.style.backgroundSize="cover";

var itemtextures=[
    "",
    "",
    "textures/toyama.gif",
    "textures/right.png"
];

var itemButton=document.createElement("div");
itemButton.style.position="absolute";
itemButton.style.zIndex="1";
itemButton.style.color="white";
itemButton.style.top= (window.innerHeight-(window.innerWidth*0.1))+"px";
itemButton.style.left=(window.innerWidth*0.45)+"px";
itemButton.style.height=(window.innerWidth*0.1)+"px";
itemButton.style.width=(window.innerWidth*0.1)+"px";
setItemBackground(0);
document.body.appendChild(itemButton);
itemButton.appendChild(itemImg);

function setItemBackground(srcId){
    //if(srcId>=itemtextures.length)
    //    return;
    var target="url('"+itemtextures[srcId]+"')";
    if(itemImg.style.backgroundImage!=target)  itemImg.style.backgroundImage=target;
}
function ui(){
    var laptxt=state+" ";

    if(state=="result"||player.goal){
        if(dialogdiv.style.visibility!="visible")
            dialogdiv.style.visibility="visible";
        var ds="次のレースは"+ Math.floor((next- neutralTime)*0.001)+"秒後です";
        if(dialogdiv.innerHTML!=ds)
            dialogdiv.innerHTML=ds;
    }else if(player.audience){
        if(orderdiv.style.visibility!="hidden")
            orderdiv.style.visibility="hidden";
        if(dialogdiv.style.visibility!="visible")
            dialogdiv.style.visibility="visible";
        var ds="あなたは途中参加しました";
        if(dialogdiv.innerHTML!=ds)
            dialogdiv.innerHTML=ds;
    }else{
        if(dialogdiv.style.visibility!="hidden")
            dialogdiv.style.visibility="hidden";
    }
    if(state!=="wait"){
        if(count.style.visibility!="hidden")
            count.style.visibility="hidden";
    }
    if(state=="wait"){
        if(count.style.visibility!="visible")
            count.style.visibility="visible";
        count.innerHTML="スタートまで"+Math.floor((start- neutralTime)*0.001)+"秒";
    }else if(state=="result"){
        laptxt+="次のレースは"+ Math.floor((next- neutralTime)*0.001)+"秒後です";
    }else if(state=="race"){
        //laptxt+="レースは"+ Math.floor((end- timenow+lag)*0.001)+"秒後に強制的に終了します";
        laptxt+=player.lap+"周目";
    }
    laptxt+="state:"+state+"rawstate:"+rawstate;
    //laptxt+=player.cp+"lap:"+player.lap+"order:";

    var ordertxt="";
    if(order==0){
        ordertxt="1st";
    }else if(order==1){
        ordertxt="2nd";
    }else if(order==2){
        ordertxt="3rd";
    }else{
        ordertxt=(order+1)+"th";
    }
    if(player.goal!=null||state=="result"){
        var contentArr1=[];
        resultTable.style.visibility="visible";
        resultTable.style.top= (window.innerHeight/2-resultTable.offsetHeight/2)+"px";
        resultTable.style.left= (window.innerWidth/2-resultTable.offsetWidth/2)+"px";
        var tabletxt="";
        var sorted=[];
        for(var i=0;i<othercar.length;i++){
            sorted.push(othercar[i]);
            console.log(othercar[i].goal);
            //if(othercar[i].goal!=null)console.log("goal"+i);
        }
        sorted.push(player);
        sorted.sort(function(a,b){
            if(a.goal!=null){
                if(b.goal==null){
                    return -1;//a
                }else{
                    if(b.goal>a.goal){
                        return -1;//a
                    }else{
                        return 1;//b
                    }
                }
            }
            if(b.goal!=null){
                if(a.goal==null){
                    return 1;
                }else{
                    if(a.goal>b.goal){
                        return 1;
                    }else{
                        return -1;
                    }
                }
            }
            if(a.lap>b.lap){
                return -1;
            }
            if(a.lap<b.lap){
                return 1;
            }
            if(a.cp>b.cp){
                return -1;
            }
            if(a.cp<b.cp){
                return 1;
            }
            if(a.dsq>b.dsq){
                return 1;
            }else{
                return -1;
            }
        });
        var myorder=0;
        for(var i=0;i<sorted.length;i++){
            var name="player "+sorted[i].cid;
            var content=sorted[i].goal;
            if(sorted[i].goal==null){content="レース中";}else{
                var t=sorted[i].goal*0.001;
                content=Math.floor(t/60)+"分"+(Math.floor(t)%60)+"秒"+(Math.floor(t*1000)%1000);
            }
            if(sorted[i].cid==player.cid){
                name="YOU";
                myorder=i;
                if(myorder==0){
                    ordertxt="1st";
                }else if(myorder==1){
                    ordertxt="2nd";
                }else if(myorder==2){
                    ordertxt="3rd";
                }else{
                    ordertxt=(myorder+1)+"th";
                }
            }
            contentArr1.push([name,content]);
            //contentArr1.push(["test"+i,"aaa"]);
        }
        for(var i=0;i<contentArr1.length;i++){
            var st=tdStyle;
            if(contentArr1[i][0]=="YOU"){
                st=tdStyle2;
            }
            tabletxt+="<tr><td style='"+st+"'>"+contentArr1[i][0]+"</td>"+"<td style='"+st+"'>"+contentArr1[i][1]+"</td></tr>";
            
        }
        if(tabletxt!=tabletxt1){
            //console.log(resultTable.innerHTML);
            tbody.innerHTML=tabletxt;
        }
        tabletxt1=tabletxt;
    }else{
        resultTable.style.visibility="hidden";
    }
    if(lap.innerHTML!==laptxt){
        lap.innerHTML=laptxt;
    }
    if(orderdiv.innerHTML!==ordertxt){
        orderdiv.innerHTML=ordertxt;
    }
    laptxt="";
}