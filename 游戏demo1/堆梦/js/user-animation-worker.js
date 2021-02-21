
(function(){
var animate=window.requestAnimationFrame;
var gifArr=[];
var fpsArr=[];
var Animation=function(){
      if(TOOL.play){
            var l=gifArr.length ,a=0,fps,d,b,s,i;
                    while(a<l){
                        fps=fpsArr[a];
                        fps[0]++;
                        if(fps[0]>=fps[1]){
                            fps[0]=0;
                            gifArr[a](new Date().getTime());
                        };
                        a++;
                    };
                       
        }; 
      animate(Animation); 
};


var DhDl=function(){
    var t=this;
        t.n=0; 
        t.arr=[]; 
    return t;
};
DhDl.prototype.push=function(o){  
    var t=this;
        t.n++;
        t.arr.push(o);
};

DhDl.prototype.del=function(i){
     var t=this;
        
         t.n--;
         t.arr.splice(i,1);
};
var dhDl=new DhDl(); 



TOOL={
    animation:Animation,
    funArr:gifArr,
    fpsArr:fpsArr,
    dhDl:dhDl, 
    play:1,
};

}()); 