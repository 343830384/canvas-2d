
var Clothes=function(o){
      var t=this;
          t.id=o.id;
          t.pth=o.pth;  // 装备基础路径
          t.zbShow={};  // 已装备装备数据
          t.body=[];    // 缓存骨骼底图
          t.list=o.list;  //绘制动作清单
          t.arr=o.dwData.bone;      //骨骼顺序
          t.dwData=o.dwData.act;    //骨骼绘制数据
          t.zbData=o.dwData.zbData; // 所有装备数据
          t.zbImg={};              // 缓存装备图片  
          t.specID={ //注意简化长度
              19:1,22:1,23:1, //前发
              18:1,20:1,21:1  //后发
          }; 
          t.zS=0;//装备加载计数
          t.zE=0;//装备zb 总数
          t.bi=0; //骨骼加载计数
          t.bf=0; //骨骼加载完成 
          t.zbf=0;//装备更新是否完成(只有初次加载的时候才有效 ,防止骨骼底图未加载完成的情况)
          t.bone();
          t.init();
          t.wj=0;  //0:未创建 1:以创建, 2:创建完直接开始游戏           
};
//初始化创建 canvas 左右面  ~~~~ 
Clothes.prototype.init=function(){ //200 130
   var t=this,id=t.id,list=t.list,i=0,l=list.length
       t.canL=document.createElement('canvas');
       t.canR=document.createElement('canvas');
       t.ctxL=t.canL.getContext('2d');
       t.ctxR=t.canR.getContext('2d');
       t.canL.width=200 , t.canL.height=130;
       t.canR.width=200 , t.canR.height=130;
       t.ctxR.translate(200,0);
       t.ctxR.scale(-1,1);
    //    debugger;
       allIdObj[id]=[];
       while(i<l){
         allIdObj[id][i]=[[],[]]; //0:左面向 1:右
         i++;
       };
};
//准备 骨骼底图
Clothes.prototype.bone=function(){
    var t=this, pth=t.pth,i=0,img,body=t.body;
        while(i<16){
            img=new Image();
            img.src=pth+i+'.webp';
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

// 绘制  装备  图片  ****************************************************************
Clothes.prototype.draw=function(){
    var t=this ,f=t.fps ,a=t.arr , i, l=a.length ,l2 ,id ,o2,d ,oid,pArr ,o  , id2, p ,q,x,y,n;
    var img , zb,zd, zi,zl ;
    var specID=t.specID , zbShow=t.zbShow ,ctx=t.ctxL , boneImg=t.body ,zbImgC=t.zbImg;    
             ctx.clearRect(0,0,200,130);
             i=0,oid=null;  
             while(i<l){
                     id=a[i]; //id
                    //  bone=cfgId===id?boneRed:boneBlack;
                     o=f[id];//fps 骨骼全部数据 // 0,1:基点; 2:角度; 3:父id 4:图
                     p=o[3];
                     n=1;
                     if(p===-1){
                             ctx.restore();
                             ctx.save();
                             if(specID[id]){//取消z===1 le 为了让骨骼图标显示正确
                                zb=zbShow[id];
                                if(zb&&zb.length){
                                    zb=zb[0];  // 特殊骨骼  当前 默认只有 一层 f=0;
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
                                         id2=q[0];  // img 在indImg 的索引
                                         img=boneImg[id2]; 
                                         ctx.drawImage( img,q[1],q[2],q[3],q[4] );
                                 };
                                  //clothes##########
                                  zb=zbShow[id];
                                  if(zb){
                                      zl=zb.length,zi=0;
                                       while(zi<zl){
                                          zd=zb[zi]; 
                                          if(zd!==undefined){ 
                                              //01:xy,23:wh,4:索引 5:id,6:骨id,7:层级,8:bx,9:by
                                              ctx.drawImage( zbImgC[zd[5]][zd[4]] , zd[0] , zd[1] , zd[2] , zd[3] );
                                          };  
                                          zi++;     
                                      };  
                                  };
                     }else{
                          //当前id 的父id 正好是上一个
                         //  debugger
                             if(p===oid){
                                    if(specID[id]){//取消z===1 le 为了让骨骼图标显示正确
                                        zb=zbShow[id];
                                        if(zb&&zb.length){
                                            zb=zb[0];  // 特殊骨骼  当前 默认只有 一层 f=0;
                                            if(zb){
                                                x=zb[8],y=zb[9];
                                                n=0;
                                            };   
                                        };              
                                    };
                                    if(n===1)x=o[0],y=o[1];
                                     ctx.translate(x,y);
                                     ctx.rotate(o[2]);
                                    //  say(o[0],o[1] ,o[2] );
                                             q=o[4];
                                             if(q!==0){
                                                    id2=q[0];
                                                    img=boneImg[id2];  
                                                    ctx.drawImage( img,q[1],q[2],q[3],q[4] );
                                             };
                                              //clothes##########
                                              zb=zbShow[id];
                                              if(zb){
                                                      zl=zb.length,zi=0;
                                                      while(zi<zl){
                                                          zd=zb[zi];// 8:bx,9:by
                                                          if(zd!==undefined){ 
                                                              ctx.drawImage( zbImgC[zd[5]][zd[4]] , zd[0]  , zd[1]  , zd[2] , zd[3] );
                                                          }; 
                                                          zi++;     
                                                      };  
                                              };
                             }else{
                                 //向上查找到最后一个父元素 ,自此向后旋转 到当前id
                                 ctx.restore();
                                 ctx.save(); 
                                 pArr=[id,p];
                                 // debugger;
                                 while(true){
                                     o2=f[p];
                                     p=o2[3];
                                     if(p===-1)break;
                                     pArr.push(p);
                                 };
                                 l2=pArr.length;
                                 while(l2--){
                                         d= f[pArr[l2]] ;
                                         if(l2===0&&specID[id]){//取消z===1 le 为了让骨骼图标显示正确
                                            zb=zbShow[id];
                                            if(zb&&zb.length){
                                                zb=zb[0];  // 特殊骨骼  当前 默认只有 一层 f=0;
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
                                                      //clothes##########
                                                      zb=zbShow[id];
                                                      if(zb){
                                                          zl=zb.length,zi=0;
                                                          while(zi<zl){
                                                              zd=zb[zi];//8:bx,9:by
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
//全部绘制 生成所有img对象 *************************************************************
Clothes.prototype.allDraw=function(){
   var t=this,dwData=t.dwData,id=t.id,list=t.list,i=0,l=list.length,v,i2,l2,o,img;
      //allIdObj
    //    if(allIdObj[id]===undefined)allIdObj[id]=[];
       o=allIdObj[id];
       while(i<l){
            v=dwData[ list[i] ];
            i2=0,l2=v.length;
                while(i2<l2){ 
                        t.fps=v[i2];
                        t.draw();
                        img=new Image();
                        img.src=t.canL.toDataURL(); //左面向图片
                        o[i][0][i2]=img;
                        t.ctxR.clearRect(0,0,200,130);
                        t.ctxR.drawImage(t.canL,0,0); //绘制 t.canL 的镜像图片
                        img=new Image();
                        img.src=t.canR.toDataURL(); //右面向图片
                        o[i][1][i2]=img;
                    i2++;
                }; 
            i++;
     };
     if(t.wj===2){//用于初次绘制时
        zdyEvt.gameKs();//执行游戏
     };
     t.wj=1; //已经创建
      console.log('装备绘制完成'); 
};

//缓存绘制 装备 img 对象 ~~~~~~~~~~~~ 
Clothes.prototype.zbImgC=function(id,n){
   var t=this,pth='./user-zb/',imgC=t.zbImg,o,img; 
       if(imgC[id]===undefined){
           imgC[id]=[];
       };
       o=imgC[id];
       if(o[n]===undefined){
            img=new Image();
            img.src=pth+id+'/'+n+'.png';
            o[n]=img;
            if(img.complete){
                 t.zS++;
                 if(t.zS===t.zE){
                    t.zbf=1; // 已装备装备 数据 更新完成(紧初始化时初次使用)
                    if(t.bf)t.allDraw();
                 };
            }else{
                img.onload=function(){
                    t.zS++;
                    if(t.zS===t.zE){
                        t.zbf=1; // 已装备装备 数据 更新完成(紧初始化时初次使用)
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
    //    t.zbImg={}; 应该清空的 ,上面无需 判断
};

// 穿装备 ( 执行完后 ,再执行 绘制操作 )*************************************
Clothes.prototype.addZb=function(n){
   var t=this,o=t.zbData,zb=t.zbShow,l,d,gid;
       o=o[n];
       if(o!==undefined){
            l=o.length;
            t.zE+=l;
            while(l--){
                d=o[l];
                //01:xy,23:wh,4:索引 5:id,6:骨id,7:层级,8:bx,9:by
                gid=d[6];
                if(zb[gid]===undefined)zb[gid]=[];
                zb[gid][d[7]]=d;
                t.zbImgC( d[5] , d[4] ); 
            }; 
       };
};

// 更新以装备数据 , 并绘制 
Clothes.prototype.gxZb=function(arr){ //arr:装备列表   更新装备 (直接重置已装备列表, 不再做判断删除 );
    var t=this,l=arr.length;
        t.zbShow={}; //清空已装备装备
        t.zS=0;//装备加载计数
        t.zE=0;
        while(l--){ // arr 要判断 上下身 是否装备装备, 未装备 则 默认装备内衣裤 ,禁止裸模型
            t.addZb(arr[l]);
        };
        // t.zbf=1; // 已装备装备 数据 更新完成(紧初始化时初次使用)
        // if(t.bf)t.allDraw();
};


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/* 
var clothes=new Clothes({
         id:5000,                // 人物id (判断男女)
         pth:'./user-zb/'+ ( SEX?'npc-1/':'npc-0/' ), // 此处(判断男女) 骨骼底图路径
         dwData:userActCfg[SEX?'npc1':'npc0'],         // 绘制数据 ( 判断 男女数据)
         list:['跑动','站立-单手','打哈欠','攻击-单手'],
}); 

*/
