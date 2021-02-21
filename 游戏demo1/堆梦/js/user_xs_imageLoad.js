
/* 

 线上版本 ,资源懒加载 ,基于 (上线预处理 )文件夹内的 执行
 启用需 注释掉 本地版本

*/
console.error(' 非 map 编辑器内的 user-newImgLoad.js');

var ImgLoad=function(){


};
//初始化 获得全部 图片配置数据 和  常驻回调方法
ImgLoad.prototype.init=function(data,load,fun){ //所有图片配置数据 {id:{0,1,2,3,4},..} , 回调
    var t=this,l;
    var a=[8400,8401,8402,8403,8404,8405,8406,8407,8408,8600,8601]; // 固定常驻 ui 图片
        t.A=allIdObj;
        t.D=data; //全部img 配置
        t.F=1;    //初始化, 允许计算常驻缓存
        t.d={}; //存储数据常驻图片
        t.c=[];  //缓存每张图 id 懒加载列表 (切图清空)
        t.x={};  //普通图片,1对1加载 判断防止 同id 下 imgN 重复申请加载
        t.z={};  //背包物品图标, 常驻,不清空
        t.s=0;  //img 加载数量
        t.e=0;  //img 完成数量
        t.Q=0;  //1:切图中
        t.load=load;
        t.callBack=fun;
        l=a.length;
        while(l--){
            t.get(a[l]);  
        };
};
//换地图,清空缓存场景图片
ImgLoad.prototype.clear=function(){
    var t=this,c=t.c,l=c.length,o=allIdObj,u;
        t.Q=1;
        t.x={};
        while(l--){
             o[c[l]]=null; 
        };
        c.length=0;

};
//获取加载图片
ImgLoad.prototype.get=function(k,n,z){ //imgId ,imgN(常规图片 ,针对非 nq 和 jx 图片) ,z:1是否为背包常驻图标
    var t=this,a=t.A,d=t.D,c=t.c,u,f=1;
        if(t.Q===1)return;//切图中禁止操作
        if(!a[k]){
            if(t.F===0){//非常驻
                if(z!==1){//非背包图标
                c.push(k)
                };
            };   
            f=0;  //针对 普通图片(非摇摆,扭曲)   (注意!! 基本常驻 ui图拼 不存在 镜像,要被类型)
            a[k]=[];
        };    
        t.k=k;
        t.next(d[k],n,f,z);   
};
//[0:base,1:img,2:cfg,3:cfgs,4:mid,5:nq,6:jx] => [0,1,2,3,4,5,6]

ImgLoad.prototype.next=function(o,n,f,z){ //imgData,缓存目录
    var t=this,cfg,d, base ,end ,img ,nq ,i ,l ,src,jx,u;
            base='../上线预处理/'+(o[0]?o[0]:'');
            end='.png';
            img=o[1];
            if( img instanceof Array == false){ 
                img=[img];
            };
            cfg=o[2];
            nq=o[5];
            jx=o[6]; //是否生成镜像图
            if(jx===1){ //镜像  (长度x2)
                if(f===1)return; //已经加载过了
                i=0,l=img.length;
                while(i<l){
                    src=base+img[i]+end;
                    t.next2( src, nq ,cfg , i,l); 
                i++;
                };
            }else if(nq===u){//普通 (多帧) (常规图片 ,单张式加载 )
                if(n===u){
                    i=0,l=img.length;
                }else{
                    b=z===1?t.z:t.x;
                    d=b[t.k];
                    if(d===u){
                       d=[];
                       b[t.k]=d;
                    };
                    if(d[n]===1)return; //已存在图片
                    d[n]=1; //已加载
                    i=n,l=n+1;
                 };
                while(i<l){
                    src=base+img[i]+end;
                    t.next2( src, nq ,cfg , i); 
                  i++;
                };
            }else{ //风力摇摆  (单帧)
                if(f===1)return; //已经加载过了
                src=base + img + end;
                t.next2( src, nq ,cfg  );       
            }; 

};
ImgLoad.prototype.next2=function(src,nq,c,i,jxL){ //c:cfg
    var t=this,o=t.A[t.k], img ,w,h,d,zw,u;
       if(t.F===1)t.s++;
        img=new Image();
        img.src=src;
        img.onload=function(){
            // w=c?c[0]:this.naturalWidth;
            // h=c?c[1]:this.naturalHeight;
            w=this.naturalWidth;
            h=this.naturalHeight;
            if(jxL>0){ //优先判断是否存在镜像
                o[i]=this;
                o[jxL+i] = imgJX.getJx(this);
            }else if(nq===undefined){ //普通
                o[i]=this;
            }else{ //风力摇摆
                zw=c[8]; // 因扭曲风力摇摆, 防止画面确实,左右增加的图像面积
                if(zw!==u){
                    zw=c[8];
                    c[0]+=zw*2;
                    c[6]+=zw; //中心点右移
                    c[8]=0;  //因为已经加上长度,所以没必要在
                }else{
                    zw=0;
                };  
                d=imgNq.init([this,w,h,nq,5,zw],o);
                // o.img=d;
                // t.concat(o,d);
            };
            //   下面为进度条完成部分 和 编辑器主要区别~~~~
            if(t.F===1){
                t.e++;
                t.load(t.e,t.s)
                if(t.e===t.s){
                    t.F=0; //结束初始化常驻加载阶段 
                    t.callBack();
                };   
            };
        };
        
        if(img.complete){
            // w=c ? c[0] : img.naturalWidth;
            // h=c ? c[1] : img.naturalHeight;
            w=img.naturalWidth;
            h=img.naturalHeight;
            if(jxL!==undefined){
                o[i]=img;
                o[jxL+i] = imgJX.getJx(img);
            }else if(nq===undefined){ 
                o[i]=img;
            }else{
                zw=c[8]; // 因扭曲风力摇摆, 防止画面确实,左右增加的图像面积
                if(zw!==u){
                //    debugger
                    zw=c[8];
                    c[0]+=zw*2;
                    c[6]+=zw; //中心点右移
                    c[8]=0;  //因为已经加上长度,所以没必要在
                }else{
                    zw=0;
                };  
                d=imgNq.init([img,w,h,nq,5,zw],o);
                
            };
            
            if(t.F===1){
                t.e++;
                t.load(t.e,t.s)
                if(t.e===t.s){
                    t.F=0; //结束初始化常驻加载阶段 
                    t.callBack();
                };   
            };
        };  
};

var imgLoad=new ImgLoad();