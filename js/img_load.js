
(function(){
var pth='./|'+G_cfg.project.path+'/img/';

var Load=function(){
    var t=this;
        t.C={//用于检查img 缓存使用状态
            /* 
             imgId:2,   //2:代表当前地图正在使用的数据, 1:代表之前地图的数据300秒内未使用的话 会被清空
            
            */
        };
        t.D=[];//用于储存imgID 已有的 (方便遍历)
        t.sT=null;// 延迟清除计时器 


        t.init();
        //注意 !! 暂未设置 加载进度判断

};
//延迟清除非当前地图的 img 资源数据
Load.prototype.lvl=function(){
     var t=this,c=t.C,d=t.D,i=0,l=d.length,a;
          while(i<l){
              a=d[i];//imgID
              c[a]=1;// 全部降级为 1  (延迟清除目标)
              i++;
          };
};
Load.prototype.clear=function(){
    var t=this,c=t.C,d=t.D,l=d.length,a,b,e,f,g;
        clearTimeout(t.sT);//清除之前延迟清除状态 (防止反复切图无意义多次触发)
        g=IMG;
        t.sT=setTimeout(function(){
                while(l--){
                    a=d[l];//imgID
                    b=c[a];//lvl
                    if(b===1){//超时未使用 进行清除
                        g[a]=null;//清除全局缓存的img
                        d.pop();//删除最后一个遍历数据
                        c[a]=null;//清除标记

                    };
                };
        },900*1000);// 每张图数据缓存15分钟 (一直未使用就会被清理)
};
Load.prototype.init=function(){
    var t=this,C=t.C,D=t.D,P,G;
        P=pth;//资源路径
        G=IMG;
        //切换地图时集中加载数据 (地图资源数据)
        t.addArr=function(a){// a=[[imgId,F] ] 地图数据中的imgId列表 F=1:镜像
            var b,c,d,g,i=0,l=a.length,f,u;
                t.lvl();//执行延迟清除
                g=IMG;
                while(i<l){
                    b=a[i];// [imgID,F]
                    f=b[1];//1:存在镜像 
                    b=b[0];//imgID
                    d=C[b];//之前的存储状态
                    if(!d){//1:延迟,2:使用中
                        D.push(b); //未使用的 imgId 存储 (方便遍历)
                        c=new Image();
                        if(f===1){//镜像
                            c.id=b;
                            c.onload=function(){
                                var img=this,id=img.id;
                                    G[id][1]=imgJX.getJx(img);//赋值镜像 在1位置 , 0是正像
                            };
                        };
                        c.src=P+b+'.png';
                        G[b]=[c];
                        ////注意 !! 暂未设置 加载进度判断
                    }else if(f===1){//已经存在的图像直接请求镜像
                        if(G[b][1]===u){//不存在镜像生成
                                c=G[b][0];
                                if(c.complete){//直接生成
                                    G[b][1]=imgJX.getJx(c);
                                }else{
                                    c.id=b;
                                    c.onload=function(){
                                        var img=this,id=img.id;
                                            G[id][1]=imgJX.getJx(img);//赋值镜像 在1位置 , 0是正像
                                    };
                                };
                        };
                        
                        if(G[b][1]===u)G[b][1]=imgJX.getJx(G[b][0]);//不存在镜像生成
                    };
                    C[b]=2;//标记为当前场景使用中
                    i++;
                };
        };
        //添加单张 补充型 
        t.addOne=function(a,f){//a-imgID ,f:1镜像
            var b,c,d,g;
                b=a;// imgID
                d=C[b];//之前的存储状态
                if(!d){//1:延迟,2:使用中
                    D.push(b); //未使用的 imgId 存储 (方便遍历)
                    c=new Image();
                    if(f===1){//镜像
                        c.id=b;
                        c.onload=function(){
                            var img=this,id=img.id;
                                G[id][1]=imgJX.getJx(img);//赋值镜像 在1位置 , 0是正像
                        };
                    };
                    c.src=P+b+'.png';
                    G[b]=[c];
                    ////注意 !! 暂未设置 加载进度判断
                }else if(f===1){//已经存在的图像直接请求镜像
                        if(G[b][1]===u){//不存在镜像生成
                            c=G[b][0];
                            if(c.complete){//直接生成
                                G[b][1]=imgJX.getJx(c);
                            }else{
                                c.id=b;
                                c.onload=function(){
                                    var img=this,id=img.id;
                                        G[id][1]=imgJX.getJx(img);//赋值镜像 在1位置 , 0是正像
                                };
                            };
                       };
                };
                C[b]=2;//标记为当前场景使用中
        };
};


//测试加载 (不清缓存)
Load.prototype.test=function(a,f){//a=imgId  f=1镜像
    var t=this,b,c,d,e,f,g,h,i=0,j,k,p,C=t.C,D=t.D,u;
        p=pth;//资源路径
        g=IMG;
        b=a;// imgID
        d=C[b];//之前的存储状态
        if(!d){//1:延迟,2:使用中
                D.push(b); //未使用的 imgId 存储 (方便遍历)
                c=new Image();
                if(f===1){//镜像
                    c.id=b;
                    c.onload=function(){
                        var img=this,id=img.id;
                            g[id][1]=imgJX.getJx(img);//赋值镜像 在1位置 , 0是正像
                            
                    };
                };
                c.src=p+b+'.png';
                g[b]=[c];
        }else if(f===1){//已经存在的图像直接请求镜像
                    if(g[b][1]===u){//不存在镜像生成
                        c=g[b][0];
                        if(c.complete){//直接生成
                            g[b][1]=imgJX.getJx(c);
                        }else{
                            c.id=b;
                            c.onload=function(){
                                var img=this,id=img.id;
                                    g[id][1]=imgJX.getJx(img);//赋值镜像 在1位置 , 0是正像
                            };
                        };
                    };
        };
        C[b]=2;//标记为当前场景使用中      
};
imgLoad=new Load();
})();