var keysPress=new Array(1000);
var handle=0;
var tilt=0;
/*
window.addEventListener('devicemotion', function (event) {
    var gv = event.accelerationIncludingGravity;
    tilt=gv.x/10;
    if(navigator.userAgent.indexOf('iPad') > 0){
        tilt*=-1;
    }else if(navigator.userAgent.indexOf('iPhone') > 0){
        tilt*=-1;
    }
    if(tilt>1)tilt=1;
    if(tilt<-1)tilt=-1;
    tilt=Math.asin(tilt);
});*/
window.onkeydown = function (ev) {
    keysPress[ev.keyCode] = true;
}
window.onkeyup = function (ev) {
    keysPress[ev.keyCode] = false;
}
//37 39
rightImg.addEventListener('touchstart', function (e) {
    if(e.touches){
        keysPress[37] = true;
    }
    e.preventDefault();
}, false);
rightImg.addEventListener('touchmove', function (e) {
    if(e.touches){
        keysPress[37] = true;
    }
    e.preventDefault();
}, false);
rightImg.addEventListener('touchend', function (e) {
    if(e.touches){
        keysPress[37] = false;
    }
    e.preventDefault();
}, false);
rightImg.addEventListener('touchcancel', function (e) {
    if(e.touches){
        keysPress[37] = false;
    }
    e.preventDefault();
}, false);

leftImg.addEventListener('touchstart', function (e) {
    if(e.touches){
        keysPress[39] = true;
    }
    e.preventDefault();
}, false);
leftImg.addEventListener('touchmove', function (e) {
    if(e.touches){
        keysPress[39] = true;
    }
    e.preventDefault();
}, false);
leftImg.addEventListener('touchend', function (e) {
    if(e.touches){
        keysPress[39] = false;
    }
    e.preventDefault();
}, false);
leftImg.addEventListener('touchcancel', function (e) {
    if(e.touches){
        keysPress[39] = false;
    }
    e.preventDefault();
}, false);

/*
window.addEventListener('touchstart', function (e) {
    if(e.touches){
        tilt=0;
        if(e.touches[0].pageY>window.innerHeight-window.innerWidth*0.3-80){
            if(e.touches[0].pageX<window.innerWidth*0.3){
                tilt=1;
            }
            else if(e.touches[0].pageX>window.innerWidth*0.7){
                tilt=-1;
            }
        }
    }
    e.preventDefault();
}, false);
window.addEventListener('touchmove', function (e) {
    if(e.touches){
        tilt=0;
        if(e.touches[0].pageY>window.innerHeight-window.innerWidth*0.3-80){
            if(e.touches[0].pageX<window.innerWidth*0.3){
                tilt=1;
            }
            else if(e.touches[0].pageX>window.innerWidth*0.7){
                tilt=-1;
            }
        }
    }
    e.preventDefault();
} ,false);
window.addEventListener('touchcancel', function (e) {
    
    if(e.touches){
        tilt=0;
    }
    e.preventDefault();
}, false);
window.addEventListener('touchend', function (e) {
    if(e.touches){
        tilt=0;
    }
    e.preventDefault();
}, false);*/
//var leftTouch=false;
//var RightTouch=false;