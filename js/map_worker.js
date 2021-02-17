/* 将来作为  worker 进程 */
/* 地图数据和渲染进程 */
(function(){
var  tt=0,zt=0;   //tt:用于计时,yt:用于暂停计时    tt-zt=实际消耗时间

//地图数据处理    
var Map=function(){
     var t=this;
         t.xy=[0,0]; //默认显示基点位置
         t.F=0; //允许绘制,状态就绪
         t.show=[1,1,1,1,1]; //默认对应5个层数据 全部显示 
         t.pP=null; //编辑操作匹配对象
         //t.d1,t.d2, t.pd;   地储,实储, 匹配储(d2的最后数据列)
};
//更改显示层
Map.prototype.showGx=function(d){
     this.show=d;
};

//新地图数据  (计算 map和solid 格数 , 全图计算,但是溢出范围不输出渲染 )
Map.prototype.newMap=function(m){//[0:map,1:solid,2:[floor障碍],3:[zw,zh,w,h,mw,mh,sw,sh]]  
    var t=this,a,b,c,d,e,f,g,i,l;
        say('新图~~~~~~')
        t.F=0;//禁止绘制
        t.xy=[0,0];//显示位置复位
        a=m[3];//[0:zw,1:zh,2:w,3:h,4:mw,5:mh,6:sw,7:sh]
        
        t.mz=a; //储存地图所有尺寸参数
        //pw,ph 可以根据最后输出值 判断边界范围 , 进而判断是否应该输出  (0-pw 是x轴允许输出范围, 0-zh是y轴允许输出范围)
        t.pw=a[2]; //窗口总宽px, 只算游戏窗口, 忽略程序窗口
        t.ph=a[3]; //窗口总高px  
        
        t.map=m[0];  //map数据
        t.mw=a[2]/a[4];//map 窗口w总格数
        t.mh=a[3]/a[5];//map 窗口h总格数 
        t.mmw=m[0][0].length;//map w总格数
        t.mmh=m[0].length;//map h总格数

        t.solid=m[1]; //solid数据 (具有空间体积概念的物体)
        t.sw=a[2]/a[6];//solid 窗口w总格数
        t.sh=a[3]/a[7];//solid 窗口h总格数
        t.ssw=m[1][0].length;//solid w总格数
        t.ssh=m[1].length;//solid h总格数
        t.floor=a[2];  //楼层 障碍 数据 (用于活动 npc)

        //计算 map格 和 solid的比值 不一一对应时的 逻辑处理
        //当比值不是 1比1 完全匹配时 ,   map格内 等于x轴为例    x%b=n  mapX轴=(x-n)/b;  此时逻辑渲染以 x轴基点=mw*x +sw*n        
        b=a[4]/a[6];
        t.msw=b;
        b=a[5]/a[7]
        t.msh=b; 
        t.F=1;//允许绘制
        // say(m)

        draw.init(a[2],a[3]);//通知 绘制方法内 地图宽高
};

//输出 数据格式 初始化 (基本分层输出格式部分)   这里是5层  编辑器只允许4层 第5层为云层
Map.prototype.scInit=function(){
    var t=this,mh=t.mmh,sh=t.ssh,o1,o2,a,b,c,d,e,f,g,h,i,j,k,l;
        //mh:map总行高, sh:solid总行高
        o1=[];//map 组数据
        i=0;
        while(i<mh){
                o1[i]=[[],[],[],[],[],[]];//
            i++;
        };
        o2=[];//solid 组数据
        i=0;
        while(i<sh){
            o2[i]=[[],[],[],[],[],[]];//
           i++;
       };
        t.d1=o1,t.d2=o2;
        t.pd=o2[sh-1][5];//最后一个数据位用来储存 天气云层 或 辅助标记  
};

//匹配 标记 编辑中 的 操作对象  
Map.prototype.matchDx=function(d){
    this.pP=d;

};

//位移 (此处基于左上顶点, 而非npc镜头中心 )
Map.prototype.pos=function(x,y){ //此处直接使用 x,y
var t=this,xy=t.xy;//,w=t.ssw-1,h=t.ssh-1,x,y;
         xy[0]=x;
         xy[1]=y; 
        //   x=xy[0],y=xy[1];
        // 0:左,1右,2上,3下
        //  if(n<2){//左右移
        //         x+=(n===1?1:-1);
        //         if(x<0)x=0;
        //         if(x>w)x=w;
        //         xy[0]=x;   
        //  }else{//上下移
        //         y+=(n===3?1:-1);
        //         if(y<0)y=0;
        //         if(y>h)y=h;
        //         xy[1]=y;  
        //  };       
};

//天气数据初始化
Map.prototype.tqInit=function(){
    var t=this,w=t.mmw,h=t.mmh;
};
 console.error('注意!! 还未设置 0=永久时间帧 的 逻辑 设置, 此处');

//计算输出map数据
Map.prototype.mapF=function(){
     var t=this,w=t.mmw,h=t.mmh,pw=t.pw,ph=t.ph,mw=t.mz[4],mh=t.mz[5],sw=t.mz[6],sh=t.mz[7],d1,a=t.map,b,c,d,e,f,g,i=0,j,k,l,m,n,o,p,q,r,s,v,z,x,y,xn=0,yn=0,mx,my,cx,cy,nn,nv,wn,hn,u;
     var pP,pd,pf; //匹配对象,匹配输出位  pf=>1:匹配,0未匹配
         //w,h:map总格数  pw,ph:窗口总px   mw,mh:格子的px值
         //当p,q比值不是 1比1 时 ,   map格内 等于x轴为例    x%b=n  mapX轴=(x-n)/b;  此时逻辑渲染以 x轴基点= mw*x +  xn(=>sw*n)   
         t.scInit();//格式初始化输出数据 (仅在map执行)
         pP=t.pP,pd=t.pd;
         p=t.msw,q=t.msh; // ms比值
         x=t.xy[0],y=t.xy[1];
         if(p>1){ //map x轴存在错位
             xn=x%p;
             x=(x-xn)/p; // mapX轴的绘制基点格
             xn=sw*xn;//偏移值  (偏移值都是基于 solid格的)
         };
         if(q>1){ //map y轴存在错位
             yn=y%q;
             y=(y-yn)/q; // mapY轴的绘制基点格
             yn=sh*yn;//偏移值  (偏移值都是基于 solid格的)
         };
         d1=t.d1;
         
        //w,h:数据总宽高, pw,ph:输出px范围 , 
        while(i<h){
               l=0;
               g=a[i];//行数据
               my=(i-y+1)*mh+yn; //y轴绘制基点  +1是因为地平线
               j=d1[i];//存储数据行
               while(l<w){
                    mx=(l-x)*mw+xn;//x轴绘制基点
                    b=g[l]; // 格数据 [ d,d1,d2] 
                    c=b.length;
                    if(c>0){ //有数据
                        e=0;
                        while(e<c){
                            d=b[e];
                            pf=d===pP?1:0;// pf=>1:是编辑选中对象,0:否
                            //m,n,o,r,s,v,z
                            r=d.length;
                            if(r===1){//单图
                                d=d[0]; 
                                    //[0:imgId,1:imgN,2:x,3:y,4:w,5:h,6:xs,7:yy,8:wy,9:f]
                                    //6:xs=>0:隐藏,1:显示;  (是否显示 , 多用于帧动画 默认0)
                                    //7:yy=>0:否,1:是       (阴影地面帧 , 多用于组合帧动画 默认0) ???
                                    //8:wy=> -5 ~5    (y轴位移, 多用于帧动画 ,默认0) 
                                    //9:floor=>  0,1,2,3,4  层 ( 默认 1, 通常是)
                                    //f,k,cx,cy
                                   if(d[6]===1){//显示
                                          f=0;
                                          k=d[8];//位移值
                                          cx=mx+d[2]; //x轴绘制起点
                                          cy=my-d[3]-d[5];//y轴绘制起点 ,基于地平线 所以 -y-h
                                          if(cx+d[4]>0&&cx<pw)f++; // 当 绘制图右边界大于 0, 左边界小于最大值 (表明物体会出现在视野中)
                                          if(cy+d[5]>0&&cy<ph)f++;// 当 绘制图下边界大于 0,  上边界小于最大值 (表明物体会出现在视野中)
                                          if(f===2){//在视界范围内
                                                if(k===0){//同轴数据
                                                        j[d[9]].push(d[0],d[1],cx,cy,d[4],d[5]); //0:img,1:imgN,2:x,3:y,4:w,5:h 
                                                        if(pf===1)pd.push(0,2,cx,cy,d[4],d[5]); //2:代表是辅助框,
                                                }else{//位移数据  溢出就输出到上下边界轴
                                                        k=i+k;
                                                        if(k<0)k=0;
                                                        if(k>=h)k=h-1;
                                                        d1[k][d[9]].push(d[0],d[1],cx,cy,d[4],d[5]);
                                                        if(pf===1)pd.push(0,2,cx,cy,d[4],d[5]); //2:代表是辅助框
                                                        
                                                };
                                        };
                                   };  
                            }else{// 帧动画
                                    o=d;
                                    v=o[0];//[0:lx,1:dh,2:list,3:time,4:bf,5:f,6:id,7:gx]   第0帧是动画类型数据
                                            //0:lx=>0:单次,1:循环播放
                                            //1:dh=>0:切换动画,1:过渡动画
                                            //2:list=>[n,n,n,n] 帧序
                                            //3:time=>[j,j,j,j] 帧时
                                            //4:bf=> 0:停止 1:播放中,2:初始化   (生成5,6值 ,初次执行时,避免判断第0帧直接略过 , 储存地图时 5,6值delete, 该值若为1改成 2, 0仍旧是0)
                                            //5:f=>  0,1,2,3,4  层 ( 默认 1, 通常是  )
                                            //6:id,
                                            //7:gx
                                            //下面的储存时需要将8-12清空  *4的值播放中的设置为2初始化 
                                            //8:j=> 用于计时
                                            //9:n=> 当前执行中的帧序索引 
                                            //10:n2=> 过渡帧 播放索引 =n+1,溢出归0
                                            //11:j2=>当前帧显示时间
                                            //12:当前帧与下一帧的过渡计算数据 (切帧时设置)
                                            if(v[4]===0){//已经停止执行播放的动画
                                       e++;
                                       continue;
                                   };
                                   if(v[4]===2){//需要初始化的 动画
                                        v[4]=1;//播放状态
                                        v[8]=tt;//计时
                                        v[9]=0; //初始化播放的是0帧
                                        if(v[1]===1){//过渡动画
                                            if(v[2].length>1){
                                                v[10]=1; //next 索引位 0+1
                                                v[11]=v[3][0];// 当前帧显示时间
                                                t.fpsGdInit(o); //生成*11 数据
                                                // say(v[9],v[11]);
                                            }else{
                                                 v[1]=0; //因为帧序长度小于2,所以不允许当做过渡动画处理,修改为切换动画
                                            };
                                        };
                                   };
                                   n=v[9];//当前执行顺序帧索引
                                   m=v[3];//[j,j1,j2] //每帧显示时间
                                   if(tt-v[8]>=m[n]){//当前帧显示时间结束,进入下一帧
                                        n++;
                                        if(n===m.length){
                                            n=0; //溢出从头开始
                                            if(v[0]===0){//单次动画  (除非再次被激活初始化)
                                                v[4]=0;//停止
                                                e++;
                                                continue
                                            };
                                        };
                                        v[9]=n; //新的 播放索引
                                        v[8]=tt;//新的计时
                                        if(v[1]===1){//过渡动画
                                            v[10]=n+1===m.length?0:n+1;// 防止溢出 (超出从0开始)
                                            v[11]=m[n]; //当前帧显示时间
                                            t.fpsGdInit(o); //生成*11 数据
                                            // say(v[9],v[11]);
                                       };    
                                   };
                                   
                                    m=o[v[2][n]+1]// 当前帧数据 ;   +1 因为第0帧记录动画信息, 第1帧开始才是  ;   值=[ [img,x,x],[img,x,x],...]
                                    n=v[5]; //f=>  0,1,2,3,4  层 
                                    s=0,z=m.length;
                                    while(s<z){
                                            d=m[s];
                                            if(d[6]===1){//显示
                                                    f=0;
                                                    k=d[8];//位移值
                                                    cx=mx+d[2]; //x轴绘制起点
                                                    cy=my-d[3]-d[5];//y轴绘制起点 ,基于地平线 所以-py-h
                                                    wn=d[4]; //imgW
                                                    hn=d[5]; //imgH
                                                    if(v[1]===1&&v[12]!==u){ //是过渡动画 并 存在过渡数据 
                                                        nn=v[12][s];// 对应帧 [w,h,x,y] 4个偏移值;
                                                        if(nn!==u){
                                                            nv=(tt-v[8])/v[11]; //过渡比例
                                                            wn+=(nn[0]*nv)<<0;
                                                            hn+=(nn[1]*nv)<<0;
                                                            cx+=(nn[2]*nv)<<0;
                                                            cy-=(nn[3]*nv)<<0;
                                                        };
                                                    };
                                                    if(cx+d[4]>0&&cx<pw)f++; // 当 绘制图右边界大于 0, 左边界小于最大值 (表明物体会出现在视野中)
                                                    if(cy+d[5]>0&&cy<ph)f++;// 当 绘制图下边界大于 0,  上边界小于最大值 (表明物体会出现在视野中)
                                                    if(f===2){//在视界范围内
                                                        if(k===0){//同轴数据
                                                                j[n].push(d[0],d[1],cx,cy,wn,hn); //0:img,1:imgN,2:x,3:y,4:w,5:h 
                                                                if(pf===1)pd.push(0,2,cx,cy,wn,hn); //2:代表是辅助框  
                                                        }else{//位移数据  溢出就输出到上下边界轴
                                                                k=i+k;
                                                                if(k<0)k=0;
                                                                if(k>=h)k=h-1;
                                                                d1[k][n].push(d[0],d[1],cx,cy,wn,hn); 
                                                                if(pf===1)pd.push(0,2,cx,cy,wn,hn); //2:代表是辅助框  
                                                        };
                                                };
                                            }; 
                                            s++;
                                    };
                                  
                                      
                            };//if(r===1) END       
                            e++;
                        };//while(e<c) END
                    };
                  l++;
               };
            i++;
        };

};

//计算输出solid数据
Map.prototype.solidF=function(){
var t=this,w=t.ssw,h=t.ssh,pw=t.pw,ph=t.ph,mw=t.mz[6],mh=t.mz[7],sw=t.mz[6],sh=t.mz[7],d1,a=t.solid,b,c,d,e,f,g,i=0,j,k,l,m,n,o,p,q,r,s,v,z,x,y,xn=0,yn=0,mx,my,cx,cy,nn,nv,wn,hn,u;
         //w,h:solid总格数  pw,ph:窗口总px   mw,mh:solid格子的px值   
 var pP=t.pP,pd=t.pd,pf; //匹配对象,匹配输出位  pf=>1:匹配,0未匹配
         x=t.xy[0],y=t.xy[1];
         d1=t.d2;
        //w,h:数据总宽高, pw,ph:输出px范围 , 
        while(i<h){
               l=0;
               g=a[i];//行数据
               my=(i-y+1)*mh; //y轴绘制基点  +1是因为地平线
               j=d1[i];//存储数据行
               while(l<w){
                    mx=(l-x)*mw;//x轴绘制基点
                    b=g[l]; // 格数据 [ d,d1,d2] 
                    c=b.length;
                    if(c>0){ //有数据
                        e=0;
                        while(e<c){
                            d=b[e];
                            pf=d===pP?1:0;// pf=>1:是编辑选中对象,0:否
                            //m,n,o,r,s,v,z
                            r=d.length;
                            if(r===1){//单图
                                d=d[0];  
                                    //[0:imgId,1:imgN,2:x,3:y,4:w,5:h,6:xs,7:yy,8:wy,9:f]
                                    //6:xs=>0:隐藏,1:显示;  (是否显示 , 多用于帧动画 默认0)
                                    //7:yy=>0:否,1:是       (阴影地面帧 , 多用于组合帧动画 默认0)
                                    //8:wy=> -5 ~5    (y轴位移, 多用于帧动画 ,默认0) 
                                    //9:floor=>  0,1,2,3,4  层 ( 默认 1, 通常是)
                                    //f,k,cx,cy
                                   if(d[6]===1){//显示
                                          f=0;
                                          k=d[8];//位移值
                                          cx=mx+d[2]; //x轴绘制起点
                                          cy=my-d[3]-d[5];//y轴绘制起点 ,基于地平线 所以-py-h
                                          if(cx+d[4]>0&&cx<pw)f++; // 当 绘制图右边界大于 0, 左边界小于最大值 (表明物体会出现在视野中)
                                          if(cy+d[5]>0&&cy<ph)f++;// 当 绘制图下边界大于 0,  上边界小于最大值 (表明物体会出现在视野中)
                                          if(f===2){//在视界范围内
                                                if(k===0){//同轴数据
                                                        j[d[9]].push(d[0],d[1],cx,cy,d[4],d[5]); //0:img,1:imgN,2:x,3:y,4:w,5:h  
                                                        if(pf===1)pd.push(0,2,cx,cy,d[4],d[5]); //2:代表是辅助框, 
                                                }else{//位移数据  溢出就输出到上下边界轴
                                                        k=i+k;
                                                        if(k<0)k=0;
                                                        if(k>=h)k=h-1;
                                                        d1[k][d[9]].push(d[0],d[1],cx,cy,d[4],d[5]); 
                                                        if(pf===1)pd.push(0,2,cx,cy,d[4],d[5]); //2:代表是辅助框,
                                                };
                                        };
                                   };  
                            }else{// 帧动画
                                    o=d;
                                    v=o[0];//[0:lx,1:dh,2:list,3:time,4:bf,5:j,6:id]   第0帧是动画类型数据
                                            //0:lx=>0:单次,1:循环播放
                                            //1:dh=>0:切换动画,1:过渡动画
                                            //2:list=>[n,n,n,n] 帧序
                                            //3:time=>[j,j,j,j] 帧时
                                            //4:bf=> 0:停止 1:播放中,2:初始化   (生成5,6值 ,初次执行时,避免判断第0帧直接略过 , 储存地图时 5,6值delete, 该值若为1改成 2, 0仍旧是0)
                                            //5:f=>  0,1,2,3,4  层 ( 默认 1, 通常是  )
                                            //6:id,
                                            //7:gx
                                            //下面的储存时需要将7和10值重置为0  *4的值播放中的设置为2初始化
                                            //8:j=> 用于计时
                                            //9:n=> 当前执行中的帧序索引 
                                            //10:n2=> 过渡帧 播放索引 =n+1,溢出归0
                                            //11:j2=>当前帧显示时间
                                            //12:当前帧与下一帧的过渡计算数据 (切帧时设置)
                                   if(v[4]===0){//已经停止执行播放的动画
                                       e++;
                                       continue;
                                   };
                                   if(v[4]===2){//需要初始化的 动画
                                        v[4]=1;//播放状态
                                        v[8]=tt;//计时
                                        v[9]=0; //初始化播放的是0帧
                                        if(v[1]===1){//过渡动画
                                            if(v[2].length>1){
                                                v[10]=1; //next 索引位 0+1
                                                v[11]=v[3][0];// 当前帧显示时间
                                                t.fpsGdInit(o); //生成*11 数据
                                            }else{
                                                 v[1]=0; //因为帧序长度小于2,所以不允许当做过渡动画处理,修改为切换动画
                                            };
                                        };
                                   };
                                   n=v[9];//当前执行顺序帧索引
                                   m=v[3];//[j,j1,j2] //每帧显示时间
                                   if(tt-v[8]>=m[n]){//当前帧显示时间结束,进入下一帧
                                        n++;
                                        if(n===m.length){
                                            n=0; //溢出从头开始
                                            if(v[0]===0){//单次动画  (除非再次被激活初始化)
                                                v[4]=0;//停止
                                                e++;
                                                continue
                                            };
                                        };
                                        v[9]=n; //新的 播放索引
                                        v[8]=tt;//新的计时  
                                        if(v[1]===1){//过渡动画
                                            v[10]=n+1===m.length?0:n+1;// 防止溢出
                                            v[11]=m[n];
                                            t.fpsGdInit(o); //生成*11 数据
                                       };   
                                   };
                                   m=o[v[2][n]+1]// +1 因为第0帧记录动画信心,第1帧开始才是 帧[img,..] 数据
                                   n=v[5]; //f=>  0,1,2,3,4  层 
                                   s=0,z=m.length;
                                   while(s<z){
                                       d=m[s];
                                        if(d[6]===1){//显示
                                                f=0;
                                                k=d[8];//位移值
                                                cx=mx+d[2]; //x轴绘制起点
                                                cy=my-d[3]-d[5];//y轴绘制起点 ,基于地平线 所以-py-h
                                                wn=d[4]; //imgW
                                                hn=d[5]; //imgH
                                                if(v[1]===1&&v[12]!==u){
                                                    nn=v[12][s];// 对应帧 [w,h,x,y] 4个偏移值;
                                                    if(nn!==u){
                                                        nv=(tt-v[8])/v[11]; //过渡比例
                                                        wn+=(nn[0]*nv)<<0;
                                                        hn+=(nn[1]*nv)<<0;
                                                        cx+=(nn[2]*nv)<<0;
                                                        cy-=(nn[3]*nv)<<0;
                                                    };
                                                };
                                                if(cx+d[4]>0&&cx<pw)f++; // 当 绘制图右边界大于 0, 左边界小于最大值 (表明物体会出现在视野中)
                                                if(cy+d[5]>0&&cy<ph)f++;// 当 绘制图下边界大于 0,  上边界小于最大值 (表明物体会出现在视野中)
                                                if(f===2){//在视界范围内
                                                    if(k===0){//同轴数据
                                                            j[n].push(d[0],d[1],cx,cy,wn,hn); //0:img,1:imgN,2:x,3:y,4:w,5:h
                                                            if(pf===1)pd.push(0,2,cx,cy,wn,hn); //2:代表是辅助框     
                                                    }else{//位移数据  溢出就输出到上下边界轴
                                                            k=i+k;
                                                            if(k<0)k=0;
                                                            if(k>=h)k=h-1;
                                                            d1[k][n].push(d[0],d[1],cx,cy,wn,hn);
                                                            if(pf===1)pd.push(0,2,cx,cy,wn,hn); //2:代表是辅助框   
                                                    };
                                            };
                                        };
                                        s++;
                                  };  
                            };       
                            e++;
                        };
                    };
                  l++;
               };
            i++;
        };
        t.dataHb();//合并输出数据
};

//过渡动画 过渡数据处理
Map.prototype.fpsGdInit=function(z){// 动画数据,计时, 行存储 ,总存储
    var a,b,c,d,e,f,g,h,i,k,l,m,n,d,i=0,l,f=1,o,p,q,d1,d2,d3,u;
        a=z[0];//
        //0:lx=>0:单次,1:循环播放
        //1:dh=>0:切换动画,1:过渡动画
        //2:list=>[n,n,n,n] 帧序
        //3:time=>[j,j,j,j] 帧时
        //4:bf=> 0:停止 1:播放中,2:初始化   (生成5,6值 ,初次执行时,避免判断第0帧直接略过 , 储存地图时 5,6值delete, 该值若为1改成 2, 0仍旧是0)
        //5:f=>  0,1,2,3,4  层 ( 默认 1, 通常是  )
        //6:id,
        //7:gx
        //下面的储存时需要将7和10值重置为0  *4的值播放中的设置为2初始化
        //8:j=> 用于计时
        //9:n=> 当前执行中的帧序索引 
        //10:n2=> 过渡帧 播放索引 =n+1,溢出归0
        //11:j2=>当前帧显示时间
        //12:与下一帧的过渡关系 , (此处生成)
        //   say(a[8],a[9]);
            b=a[2];//list
            n=a[9];//当前播放索引 
            d1=z[b[n]+1]; //当前帧数据  +1 因为0占位信息
            d2=a[7][n]; //当前帧关系数据,
            n=a[10]; //下个播放帧索引
            d=z[b[n]+1];//下一帧数据
            d3=[];// 间隔帧的差值数据
            if(d2){
                l=d2.length;
                if(l>0){//存在关系数据
                    while(i<l){
                        o=d2[i];//关系当前帧 对应下一帧帧 img的 索引
                        if(o!==null&&o>-1){//存在对位数据
                            //[0:imgId,1:imgN,2:x,3:y,4:w,5:h,6:xs,7:yy,8:wy],
                            p=d1[i];//当前帧 img数据
                            q=d[o]; //关系帧 img数据
                            d3[i]=[q[4]-p[4],q[5]-p[5],q[2]-p[2],q[3]-p[3]];   //wn,hn,xn.yn
                            f=0;//有关系数据
                        }; 
                        i++;
                    };
                };
            };
            if(f===1)d3=u;//不存在关系帧
            // if(d3)say(JSON.stringify(d3));
            a[12]=d3;

};

//数据合并 并输出绘制
Map.prototype.dataHb=function(){
 var t=this, d1=t.d1,d2=t.d2,i,l,c,o=[];
      d=[[],[],[],[],[],[]]; //0,1,2,3,4,5:云层天气和辅助标记层
      l=d1.length;
      i=0;
      while(i<l){
            c=d1[i]; //[ [f0],f[1],f[2],f[3],f[4]]  //此处f5 没用
            d[0]=d[0].concat(c[0]);
            d[1]=d[1].concat(c[1]);
            d[2]=d[2].concat(c[2]);
            d[3]=d[3].concat(c[3]);
            d[4]=d[4].concat(c[4]);
          i++;
      };
      l=d2.length;
      i=0;
      while(i<l){
            c=d2[i]; //[ [f0],f[1],f[2],f[3],f[4],f[5]]   //f5:云层 天气 层 ,辅助标记层
            d[0]=d[0].concat(c[0]);
            d[1]=d[1].concat(c[1]);
            d[2]=d[2].concat(c[2]);
            d[3]=d[3].concat(c[3]);
            d[4]=d[4].concat(c[4]);
            d[5]=d[5].concat(c[5]);
          i++;
      };
      o=o.concat(d[0],d[1],d[2],d[3],d[4],d[5]);//全部合并到一个数据
    //   say(o);
    // if(o.length>0)say(o);
    //调用 绘制方法
    draw.map(o);
};

//计算天气数据 (暂无)
Map.prototype.tq=function(){

};

//暂停时间
Map.prototype.ztSJ=function(j){
    var t=this;
        t.FF=1; //暂停状态
        t.FJ=j;//暂停时时间  
};

//输出绘制数据
Map.prototype.draw=function(j){
    var t=this;
        if(t.F===0)return; //禁止绘制
        tt=j;
        if(t.FF===1){//之前有暂停过
            t.FF=0;
            zt=tt-t.FJ;// 暂停用时
        };
        tt-=zt; //剪去暂停时间 ,让绘制连贯
        t.mapF();
        t.solidF();
};

map=new Map();



})();