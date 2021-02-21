

var Clothes=function(m){
      var t=this,id=7000,p,d;
          
          p=m?'npc1':'npc0';
          t.sex=m; 
          t.id=id;  
          t.pth='./user-zb/'+p+'/';  
          t.zbShow={};  
          t.body=[];    
          t.list=[0,2,3,1,4,5]; 
          d=userActCfg[p]; 
          t.arr=[18,24,25,26,0,1,2,20,21,3,4,5,6,7,8,9,10,11,12,16,17,22,23,13,14,15,19,27];
          t.dwData=d.act;    
          t.zbData=d.zbData; 
          t.zbImg={};        
          t.specID={ 
              19:1,22:1,23:1, 
              18:1,20:1,21:1  
          }; 
          t.zS=0;
          t.zE=0;
          t.bi=0; 
          t.bf=0; 
          t.zbf=0;
          t.bone(); 
          t.init(); 
          t.wj=0;  
};

Clothes.prototype.init=function(){ 
   var t=this,id=t.id,list=t.list,i=0,l=list.length
       t.canL=document.createElement('canvas');
       t.canR=document.createElement('canvas');
       t.ctxL=t.canL.getContext('2d');
       t.ctxR=t.canR.getContext('2d');
       t.canL.width=200 , t.canL.height=130;
       t.canR.width=200 , t.canR.height=130;
       t.ctxR.translate(200,0);
       t.ctxR.scale(-1,1);
    
       allIdObj[id]=[]; 
       while(i<l){
         allIdObj[id][i]=[[],[]]; 
         i++;
       };
};


Clothes.prototype.bone=function(){
    var t=this, pth=t.pth,i=0,img,body=t.body;
        while(i<16){ 
            img=new Image();
            img.src=pth+i+'.png';
            body[i]=img;
            if(img.complete){
                        t.bi++;
                        if(t.bi===15){
                            t.bf=1; 
                            if(t.zbf)t.allDraw(); 
                        };
            }else{
                img.onload=function(){
                        t.bi++;
                        if(t.bi===15){
                            t.bf=1;
                            if(t.zbf)t.allDraw();
                        };
                };  
            };
          i++;
        };
};


Clothes.prototype.draw=function(){
    var t=this ,f=t.fps ,a=t.arr , i, l=a.length ,l2 ,id ,o2,d ,oid,pArr ,o  , id2, p ,q,x,y,n;
    var img , zb,zd, zi,zl ;
    var specID=t.specID , zbShow=t.zbShow ,ctx=t.ctxL , boneImg=t.body ,zbImgC=t.zbImg;    
             ctx.clearRect(0,0,200,130);
             i=0,oid=null;  
             while(i<l){
                     id=a[i]; 
                    
                     o=f[id];
                     p=o[3];
                     n=1;
                     if(p===-1){
                             ctx.restore();
                             ctx.save();
                             if(specID[id]){
                                zb=zbShow[id];
                                if(zb&&zb.length){
                                    zb=zb[0];  
                                    if(zb){
                                        x=zb[8],y=zb[9]; 
                                        n=0;
                                    };   
                                };              
                            };
                            if(n===1)x=o[0],y=o[1];
                             ctx.translate(x,y);
                             ctx.rotate(o[2]);
                                 q=o[4]; 
                                 if(q!==0){
                                         id2=q[0];  
                                         img=boneImg[id2]; 
                                         ctx.drawImage( img,q[1],q[2],q[3],q[4] );
                                 };
                                  
                                  zb=zbShow[id];
                                  if(zb){
                                      zl=zb.length,zi=0;
                                       while(zi<zl){
                                          zd=zb[zi]; 
                                          if(zd!==undefined){ 
                                              
                                              ctx.drawImage( zbImgC[zd[5]][zd[4]] , zd[0] , zd[1] , zd[2] , zd[3] );
                                          };  
                                          zi++;     
                                      };  
                                  };
                     }else{
                          
                         
                             if(p===oid){
                                    if(specID[id]){
                                        zb=zbShow[id];
                                        if(zb&&zb.length){
                                            zb=zb[0];  
                                            if(zb){
                                                x=zb[8],y=zb[9];
                                                n=0;
                                            };   
                                        };              
                                    };
                                    if(n===1)x=o[0],y=o[1];
                                     ctx.translate(x,y);
                                     ctx.rotate(o[2]);
                                    
                                             q=o[4];
                                             if(q!==0){
                                                    id2=q[0];
                                                    img=boneImg[id2];  
                                                    ctx.drawImage( img,q[1],q[2],q[3],q[4] );
                                             };
                                              
                                              zb=zbShow[id];
                                              if(zb){
                                                      zl=zb.length,zi=0;
                                                      while(zi<zl){
                                                          zd=zb[zi];
                                                          if(zd!==undefined){ 
                                                              ctx.drawImage( zbImgC[zd[5]][zd[4]] , zd[0]  , zd[1]  , zd[2] , zd[3] );
                                                          }; 
                                                          zi++;     
                                                      };  
                                              };
                             }else{
                                 
                                 ctx.restore();
                                 ctx.save(); 
                                 pArr=[id,p];
                                 
                                 while(true){
                                     o2=f[p];
                                     p=o2[3];
                                     if(p===-1)break;
                                     pArr.push(p);
                                 };
                                 l2=pArr.length;
                                 while(l2--){
                                         d= f[pArr[l2]] ;
                                         if(l2===0&&specID[id]){
                                            zb=zbShow[id];
                                            if(zb&&zb.length){
                                                zb=zb[0];  
                                                if(zb){
                                                    x=zb[8],y=zb[9]; 
                                                    n=0;
                                                };   
                                            };              
                                        };
                                        if(n===1)x=d[0],y=d[1];
                                         ctx.translate(x,y);
                                         ctx.rotate(d[2]);
                                         if(l2===0){
                                                     q=d[4];
                                                     if(q!==0){
                                                            id2=q[0];
                                                            img=boneImg[id2];
                                                            ctx.drawImage( img,q[1],q[2],q[3],q[4] );
                                                     }; 
                                                      
                                                      zb=zbShow[id];
                                                      if(zb){
                                                          zl=zb.length,zi=0;
                                                          while(zi<zl){
                                                              zd=zb[zi];
                                                              if(zd!==undefined){
                                                                  ctx.drawImage( zbImgC[zd[5]][zd[4]] , zd[0] , zd[1]  , zd[2] , zd[3] ); 
                                                              };  
                                                              zi++;     
                                                          };  
                                                      }; 
                                         };
                                 };
                             };
                     }; 
                  oid=id;
                  i++; 
             };
             ctx.restore();
};


Clothes.prototype.allDraw=function(){
   var t=this,dwData=t.dwData,id=t.id,list=t.list,i=0,l=list.length,v,i2,l2,o,img;
      
       o=allIdObj[id]; 
       while(i<l){
            v=dwData[ list[i] ]; 
            i2=0,l2=v.length;
                while(i2<l2){ 
                        t.fps=v[i2]; 
                        t.draw();
                        t.ctxR.clearRect(0,0,200,130);
                        t.ctxR.drawImage(t.canL,0,0); 
                        img=new Image();
                        img.src=t.canL.toDataURL(); 
                        o[i][0][i2]=img;
                        img=new Image();
                        img.src=t.canR.toDataURL(); 
                        o[i][1][i2]=img;
                    i2++;
                }; 
            i++;
     };
     if(t.wj===2){
        zdyEvt.gameKs();
     };
     t.wj=1; 
     t.clear();
};

Clothes.prototype.clear=function(){
   var t=this,d=t.zbC, a=t.zbImg,l=d.length;
       while(l--){
           a[l]=null;
       };
       t.zbImg={};
       t.zS=0;
       t.zE=0;
};

Clothes.prototype.zbImgC=function(id,n,l){ 
   var t=this,pth='./user-zb/zb/',src,imgC=t.zbImg,o,img; 
       if(imgC[id]===undefined){ 
           imgC[id]=[];
       };
       o=imgC[id];
       if(l===1){ 
          n=0;
          src=pth+id+'.png';
       }else{ 
          src=pth+id+'/'+n+'.png';
       }; 
       if(o[n]===undefined){ 
            img=new Image();
            // img.setAttribute("crossOrigin",'anonymous'); //本地跨域
            img.src=src;
            o[n]=img;
            if(img.complete){
                setTimeout(function(){
                    t.zS++;
                    if(t.zS===t.zE){
                       t.zbf=1; 
                       if(t.bf)t.allDraw();
                    };
                });
            }else{
                img.onload=function(){
                    t.zS++;
                    if(t.zS===t.zE){
                        t.zbf=1; 
                        if(t.bf)t.allDraw();   
                    };
                };
            }
       }else{
           t.zS++;
           if(t.zS===t.zE){  
             if(t.bf)t.allDraw();   
           };
       };
    
};


Clothes.prototype.addZb=function(n){ 
   var t=this,o=t.zbData,zb=t.zbShow,l,d,gid,m;
       o=o[n]; 
       if(o!==undefined){
            l=o.length;  
            m=l;
            t.zE+=l; 
            while(l--){
                d=o[l];
                
                gid=d[6];
                if(zb[gid]===undefined)zb[gid]=[]; 
                zb[gid][d[7]]=d;
                t.zbImgC( d[5] , d[4] ,m); 
            }; 
       };
};

Clothes.prototype.check=function(d){
  var t=this,s=t.sex,a=[-1,250,400,650],b=[-1,320,400,720],o,c,l=4,u;  
        
         o=s===1?b:a;
        while(l--){
            c=d[l];
            if(c===-1||c===u){
                d[l]=o[l];  
            }; 
        }
};

Clothes.prototype.gxZb=function(arr){ 
       
       
    var t=this,l,v;
        
        t.check(arr);
        
        t.zbC=arr;  
        l=arr.length;
        t.zbShow={}; 
        t.zS=0;
        t.zE=0;
        while(l--){ 
            v=arr[l]; 
            if(v>-1)t.addZb(arr[l]);
        };
};




