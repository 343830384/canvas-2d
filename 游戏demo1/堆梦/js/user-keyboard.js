



var keyMap={  
    
    65:{
      a:0, 
      t:0, 
    },
    68:{
      a:1,
      t:0, 
    },
    87:{
      a:2,
      t:0,
    },
    83:{
      a:3,
      t:0,
    },
    
    0:{ 
       a:0,   
       t:1
    },
    1:{ 
        a:1,   
        t:1
     },
    2:{ 
        a:2,   
        t:1
     },
     3:{ 
        a:3,   
        t:1
     },
    
    5:{ 
       t:2,  
       a:0, 
    },
    
   
    20:{ 
        t:3,  
        a:0,  
     },
     21:{ 
        t:3,  
        a:1,  
     },
     22:{ 
        t:3,  
        a:2,  
     },
     23:{ 
        t:3,  
        a:3,  
     },
     24:{ 
        t:3,  
        a:4,  
     },
     25:{  
        t:3,  
        a:5,  
     },
     26:{  
        t:3,  
        a:6,  
     },
     27:{ 
        t:3,  
        a:7,  
     },
     28:{  
        t:3,  
        a:8,  
     },
     29:{  
        t:3,  
        a:9,  
     },
};


var keyNow=[-1,-1,-1]; 
var keyk=-1; 
var keyDown=function(k,e,d){ 
    var o=keyMap[k],t,a,b,z,u;
        if(o){
            z=keyNow;
            t=o.t,a=o.a;
            if(t===0){ 
                if(keyk===-1){
                    keyk=a;
                    z[0]=t,
                    z[1]=a;
                }else{
                    b=keyk;
                    if(b!==a){
                        if(a===0){
                            if(b===2)z[1]=4;
                            if(b===3)z[1]=6;  
                        }else if(a===1){
                            if(b===2)z[1]=5;
                            if(b===3)z[1]=7;
                        }else if(a===2){
                            if(b===0)z[1]=4;
                            if(b===1)z[1]=5;
                        }else{ 
                            if(b===0)z[1]=6;
                            if(b===1)z[1]=7;
                        };
                    }; 
                };  
            }else{ 
                if(d===u)d=-1; 
                z[0]=t , z[1]=a ,z[2]=d;
            };
            e.preventDefault();
        };
};
var keyUp=function(k,e){
    var o=keyMap[k],t,a,b,z=keyNow,u;
        if(o){
            t=o.t,a=o.a;
            if(t===0){ 
                b=z[1];
                if(b>3){
                        if(b===4){
                           if(a===2)z[1]=0;
                           if(a===0)z[1]=2;
                        }else if(b===5){
                            if(a===2)z[1]=1;
                            if(a===1)z[1]=2;    
                        }else if(b===6){
                            if(a===3)z[1]=0;
                            if(a===0)z[1]=3; 
                        }else{
                            if(a===3)z[1]=1;
                            if(a===1)z[1]=3;
                        }; 
                        keyk=z[1];
                }else{
                        if(a===keyk){
                            keyk=-1;
                            z[0]=-1;
                            z[1]=-1,z[2]=-1;
                        };  
                }; 
            }else{
                if(t===z[0]){
                    z[0]=-1 , z[1]=-1,z[2]=-1;
                };
            };
            if(e!==u)e.preventDefault();
        };   
};

var keyAuto=function(k,e,d){
     
    keyDown(k,e,d);
    setTimeout(function(){
          keyUp(k);
    },30)
};

var keyEnd=function(){
    var a=keyNow
        a[0]=-1,a[1]=-1,a[2]=-1,
        keyk=-1;
};
window.addEventListener('keydown',function(e){
        keyDown(e.keyCode,e);
             
});
window.addEventListener('keyup',function(e){
        keyUp(e.keyCode,e);
});
window.addEventListener('blur',function(e){
      keyNow[0]=-1 , keyNow[1]=-1,keyk=-1;
});