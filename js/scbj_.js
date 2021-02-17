/* 
  素材编辑  合成图 与 动图
*/
(function(){
var scbj_=document.getElementById('scbj_');//模板本身
var close=scbj_.getElementsByClassName('ui_bt_close'); //[全面版, 子连线关系 ] 关闭按钮
   //全部关闭
    close[0].onclick=function(){
            gFun.save_fps(); //防止未保存
            gFun.destroy();
            scbj_.style.display='none';
    };
var scbj_gx=scbj_.getElementsByClassName('scbj_gx')[0];//子关系面板   
    //关闭 连线图面板
    close[1].onclick=function(){
        close[0].style.display='block'; //因为打开 关系图面板,会关闭子面板
        scbj_gx.style.display='none';   //关闭自身
        //调用存储 关系 面板
        gFun.gx_close();//关闭 并储存 gx数据
    };
var list1=null,list2=null,list3=null,idrr=null; //list1源目录数据 ; list2 path动画目录(根指向list3的id) ; list3 id目录 ; idrr=id动画组查重(顺位补缺)  
var nowData=null,nowImgIndex=-1;// 组动画全部数据 ; 演示区选中的 img 的index
var path=''; //基础项目目录
var fpsIndex=-1;// 选中的帧数据
var openF=0;//当前作用域关闭未打开
//域内通用方法    
var gFun={
    imgDom:null,//选中单个修改的img
    cache:null,//指向 app.cache
    st:null, //当前正在执行的定时器 bf_bf 和 imgSX 中生成 (不会同时出现)
    st2:null,
    //更新演示区动画数据 (因为 选择了动画子目录的原因)
    gxDhdata:function(a){ // a=[主,子]
        var b,c,d,e,f,g,h,i,j,k;
            app.dhData.bf=false;//禁止动画播放 
            this.save_fps();//储存显示区的数据
            a=list2[a[0]][a[1]]; //动画组id
            a=list3[a]; //对应id的动画组数据
            /*nowData => a={
                        t:true,// true:循环播放,false:单次 
                        dh:1,  // 0:帧过渡动画,1:帧切换动画,2:未标记(允许切换,空帧时)
                        jd:[x,y],基点    
                        id:[imgId1,imgId2,...], //包含的 子img id (用于图片集中请求加载 ,暂未!!!!)
                        list:[],// 帧执行目录顺序, 子值 指向fps 的索引
                        time:[], //每帧显示时间
                        fps:[
                            [//第0帧 
                                [imgId,w,h,x,y,jx,yy,xs,wy],//0   5jx=>镜像0:默认1:是  6yy=>是否为阴影帧 0:否,1:是  7xs=>是否显示1显0隐
                                [imgId,w,h,x,y,jx,yy],xs,wy//1
                                ....    
                            ],    
                        ]   
             } */
            b={
               bf:false, //停止播放 (赋值新数据时)
               dh:a.dh,
               xh:a.t,
               jx:a.jd[0],jy:a.jd[1],
               list:a.list.join(','),
               xzData:{ //选中的 演示区 img的imgData 数据 (此处默认无选择状态)
                   x:0,y:0,w:0,h:0,yf:false,jx:false,xs:true,wy:0
               }, 
            };
            fpsIndex=-1;//防止下面重置面板会清空
            nowData=null;//防止下面重置面板会清空
            app.dhData=b;//重置面板
            nowData=a;//当前动画 总 数据
            this.fpsShow(0);//显示第0帧
            
    },
    //执行播放操作
    bf_bf:function(bf){ //bf=> true 播放, undefind:停止播放(其它操作停止,非手动点击 停 停止)
          var t=this,a=nowData,b,c,d,e,f,g,h,i,j,k,l,m,n,o=nowData,gx,u;
              clearInterval(t.st);
              if(!a||!bf){
                  if(bf===u)app.dhData.bf=false;//停止播放
                  return; //不存在可播放数据 或 禁止播放
              };  
              t.img_clear();//清除多选状态  
              this.save_fps();
              b=a.time;//帧时间 [time0,time1,time2]
              c=a.list;//帧序
              i=0,l=c.length;   //i:顺序帧索引 ,l:总帧数
              if(l<2){
                  tipFun('有效播放 帧序列 , 少于2帧, 无法播放',1);
                  t.bf_bf();
                  return;
              };
              j=new Date().getTime();
              k=c[i],n=b[k]; //  k:播放帧 ; n:帧时间
              f=o.dh; //0:切换动画 1:过渡动画
              gx=o.gx; //关系数据
              if(f===0||gx===u){ //切换动画 或 还未编辑过渡关系的过渡动画
                  t.fpsShow(k,2); //初始显示第一帧
              }else{
                 t.bfGdInit();//过渡数据初始化
                 t.bfFpsInit(i,n);//播放顺序,帧用时 
              };
              t.st=setInterval(function(){
                  
                  if(n>0){//0是永久帧的意思
                    var v;
                            e=new Date().getTime();
                            v=e-j;
                            if(v>=n){
                                j+=v;
                                i++;
                                if(i>=l)i=0;
                                k=c[i],n=b[k]; 
                                if(f===0||gx===u){ //切换动画||未编辑的过渡动画
                                   t.fpsShow(k,2);
                                }else{
                                    t.bfFpsInit(i,n);//播放顺序,帧用时 
                                };
                            }else if(gx!==u){//过渡动画
                                t.bfGdData(v)
                            };
                  };
                //    t.fpsShow();
              },20); //大约30帧每秒
    },
    //过渡动画 播放时过渡帧数据 ,两帧之间 的渐进过渡
    bf_gd_init:function(){
        var t=this,a,b,c,d,e,f,g,h,i,j,k,l,m,n,d1,d2,d3,u;
            //a:fps所有帧数据,b:帧序数据,c:过渡关系数据,e:帧序长度
            //过渡动画播放初始化 
            t.bfGdInit=function(){
                 a=nowData.fps; //所有帧数据
                 b=nowData.list;//帧序数据
                 c=nowData.gx;  //关系数据
                 e=b.length;
            };
            //初步获得当前帧数据, 和下一帧差值 (每帧切换时,并默认指向一次)
            t.bfFpsInit=function(N,V){//播放帧 顺序index
               var n,d,i=0,l,f=1,o,p,q; 
                    m=V; //帧间隔用时
                    d1=a[b[N]]; //当前帧数据
                    d2=c[N]; //当前帧关系数据,
                    n=N+1;
                    if(n>=e)n=0;//下一帧顺序索引
                    d=a[b[n]];//下一帧数据
                    d3=[];// 间隔帧的差值数据
                    if(d2!==u){
                        l=d2.length;
                        if(l>0){//存在关系数据
                            while(i<l){
                                o=d2[i];
                                if(o!==null&&o>-1){//存在对位数据
                                    //[imgId,w,h,x,y,jx,yy,xs],
                                    p=d1[i];//当前帧 img数据
                                    q=d[o]; //关系帧 img数据
                                    d3[i]=[q[1]-p[1],q[2]-p[2],q[3]-p[3],q[4]-p[4]];   //wn,hn,xn.yn
                                    f=0;//有关系数据
                                }; 
                                i++;
                            };
                        };
                    };
                    if(f===1)d3=u;//不存在关系帧
                    
                    t.bfGdData(0);//显示播放
            };
            //根据帧差值 和时间 生成过渡间隔
            t.bfGdData=function(J){//计时 
                
                if(d3===u){//当前帧 不存在过度gx
                    t.fpsShow(d1,4); //直接发送当前帧数据
                }else{
                    var a,b,c,d=[],e,f,g,v,i=0,l=d1.length;
                       v=J/m;// 用时/完整时间 = 过渡比率
                       if(v>1)v=1;  
                       while(i<l){
                           a=d1[i];////[imgId,w,h,x,y,jx,yy,xs,wy],
                           //此处就不判断显示了(实际map中做处理)
                           b=d3[i];//对应的关系 变量数据 若有 (wn,hn,xn.yn)
                           if(b!==u){
                                d[i]=[a[0],a[1]+(b[0]*v)<<0,a[2]+(b[1]*v)<<0,a[3]+(b[2]*v)<<0,a[4]+(b[3]*v)<<0,a[5],a[6],a[7],a[8]];
                           }else{//不存在就直接赋值,无需另行生成
                                d[i]=a;
                           };
                         i++;
                       };
                    //    say(JSON.stringify(d));
                    //    t.fpsShow(d1,4);
                       t.fpsShow(d,4);//发送过渡 数据 d   
                };
            };

    },
    //储存演示区已编辑的数据 (切换子目录 , 和 点击 播放 时自动调用存储 当前帧 )
    save_fps:function(){
        var a,b,c,d,e,f,g,h,i,j,k,l,L, m,n;
            if(fpsIndex<0)return; //没有使用操控编辑任何帧
            a=nowData;
            if(a){// 存在之间的编辑数据
                    L=a.fps.length;//总帧数
                    b=reNew(app.imgData); //fps 数据
                    i=0,l=b.length,d=[];
                    while(i<l){
                        c=b[i];//{src,x,y,w,h,yf,jx,xs}
                        e=c.src.split('/');
                        e=e[e.length-1];// xxx.png
                        e=e.split('.')[0]<<0;
                        d.push([e,c.w,c.h,c.x,c.y,(c.jx?1:0),(c.yf?1:0),(c.xs?1:0),c.wy]);//[imgId,w,h,x,y,jx,yy,xs,wy]
                        i++;
                    };
                    // say(d);
                    a.fps[fpsIndex]=d; //储存 fps data
                    b=app.dhData;
                    a.jd=[b.jx,b.jy]; //储存基点数据  
                    a.t=b.xh; //储存是否为 循环播放类型
                    a.dh=b.dh;//动画类型 0:切换,1:过渡
                    c=b.list.split(','); //顺序目录
                    i=0,l=c.length,d=[];
                    while(i<l){
                         if(c[i]!==''){
                            n=c[i]<<0;//
                            if(n<L){
                                d[i]=n;//最大帧,不允许溢出 ,不记录
                            }else{
                                tipFun('存在异常帧!!!! 已被抛弃',1);
                            };
                        };
                        i++;
                    };
                    if(d.join(',')!==a.list.join(',')){
                        this.del_gx();// 之前存储的和当前的不同,则清空已经保存的关系
                    };
                    a.list=d; //储存 list 执行帧顺序
                    b.list=d.join(',');//剔除不正确的,显示合规值
                    // say(d);
                    c=b.fpsTime; //每帧时间
                    i=0,l=c.length,d=[];
                    // debugger
                    while(i<l){
                        d[i]=c[i].time<<0; //
                        i++;
                    };
                    // say(d);
                    a.time=d;// 储存 time 对应每个帧时间
            };   
    },
    //处理 显示 演示区 对应帧数据 
    fpsShow:function(n,t){//n=>指定帧,t=>undefind:不保留 1:保留(不刷新时间列表) ,2:不保留(不刷新时间列表)   (是否保留nowImgIndex), 3:不保留( 但保留多选) ,4:都不保留,数据就是n
          var o=nowData,a,b,c,d,e,f,g,h,i,j,k,l,m,u;
              if(t!==4){
                    a=o.fps; //所有帧数据
                    a=a[n];  //当前帧数据
              }else{
                    a=n;//n=过渡帧数据
              };
              if(t!==1)nowImgIndex=-1;  //t=u 为切换帧(切换帧理所当然切换),  t=1:单纯刷新
              if(a===u){
                 fpsIndex=-1; //不存在
                 app.imgData=[];//同时清空
                 return
              };
              c=app.dhData;
              c.jx=o.jd[0],c.jy=o.jd[1]; //设置基点 
              fpsIndex=n;//当前 帧
              i=0,l=a.length,d=[];
              while(i<l){
                  b=a[i]; //[imgId,w,h,x,y,yy,xs,wy]
                  d.push({
                      src:b[0]+'.png',
                      w:b[1],h:b[2],x:b[3],y:b[4],
                      jx:b[5]?true:false,
                      yf:b[6]?true:false,
                      xs:b[7]?true:false,
                      wy:b[8],
                  });
                i++;
              };
                // say(JSON.stringify(d));
            //   debugger
             app.imgData=d; //赋值 演示区数据
             if(t!==3)this.img_clear();//清空多选状态
             if(t>0)return; //不刷新 帧时间 列表
             a=o.time;
             i=0,l=a.length,d=[]
             while(i<l){
                 d.push({time:a[i]});
                i++;
             };
             app.dhData.fpsTime=d;// 赋值 帧 用时列表数据
    },
    //图片位置计算位置处置,根据基点,同时调整
    imgSX:function(){
        var t=this,d,a,b,c,d,e,f,g,h,x,y,i=nowImgIndex;
            if(fpsIndex>-1&&i>-1){//存在选中修改的 img 数据
                clearTimeout(t.st); //防止过份触发
                t.st=setTimeout(function(){
                    // debugger
                    a=nowData.fps[fpsIndex];
                    a=a[i];//[imgId,w,h,x,y,jx,yy,xs,wy],
                    d=app.dhData.xzData;   
                    a[1]=d.w,a[2]=d.h,a[3]=d.x,a[4]=d.y,a[5]=d.jx?1:0,a[6]=d.yf?1:0,a[7]=d.xs?1:0;a[8]=d.wy;
                    t.fpsShow(fpsIndex,1); //1:保留选中 nowImgIndex (单纯刷新显示,不是切换帧,不刷新帧时间列表)
                },16);
            };
    },
    //多个img 同时移动
    img_jt_move_init:function(){
        var t=this,f=0,a,b,c,d,e,g,h,i,j,k,l,m,n;
             //f=>0:无选中组,1:有选中组

            //添加新的 多选 img 对象 (判断重复,重复即取消选择的意思)
            t.img_tj=function(img){
                var ix,fps,fs;
                if(f===0){ 
                    f=1;//多选状态开启
                    a=[[],[],[]]; // 0:[index..],1:[data(指向nowData.fps[帧]中的对应)],2:[dom.....]
                };
                img.style.border='1px solid red';//标记
                ix=img.getAttribute('index')<<0;
                a[0].push(ix);
                fps=nowData.fps[fpsIndex];//当前帧组
                fs=fps[ix];//img 数据
                a[1].push(fs);         //存入img arrData 
                a[2].push(img);

            }; 
            //对选择对象全部整体移动
            t.img_all_move=function(x,y){
                   if(f===0)return; //没有数据
                var i=0,b=a[1],l=b.length,d;
                    while(i<l){
                        d=b[i];//[imgId,w,h,x,y,jx,yy,xs,wy]
                        d[3]+=x;
                        d[4]+=y;
                        i++;
                    };
                    t.fpsShow(fpsIndex,3);
            };
            
            //img dom 对象再匹配 (单选或 多选 , 因为 层移动 和 拖拽复制的原因 ) (单:修改gFun.imgDom, 多选修改此处的 a[[0],[1],[2]] ) 
            t.img_cp_move=function(v){ //v=>1:多选复制, 0:单选复制
                var t=this,b,c,d,e,f,g,h,i,j,k,l,m,n;
                    if(v===0){//复制单个对象
                        b=nowImgIndex;
                        if(b>-1){
                            c=nowData.fps[fpsIndex]; 
                            d=reNew(c[b]); //复制选中的数据
                            c.splice(b+1,0,d);//插入数据当前位置之后 (复制默认插入其后) [imgId,w,h,x,y,jx,yy,7:xs,8:wy]
                            gFun.imgDom.style.border='';//清除之前的选择
                            t.fpsShow(fpsIndex);//先生成dom 相关数据
                            c=app.dhData.xzData;//{w;h;x;y,yf}
                            nowImgIndex=b+1;
                            c.w=d[1],c.h=d[2],c.x=d[3],c.y=d[4],c.jx=d[5]?true:false,c.yf=d[6]?true:false,c.xs=a[7]?true:false,c.wy=d[8];
                            d=t.img_get([b+1])[0];//获取重新生成的dom
                            d.style.border='1px solid red';
                            gFun.imgDom=d;
                        };
                    }else if(a){//1复制多个对象  a:存在可复制 多选对象
                          g=nowData.fps[fpsIndex]; // 当前帧 所有数据 
                          b=a[0]; // [index ]列表
                          d=a[1]; // [indexData]列表
                          b.sort(function(a,b){return a-b});// 从小到大排序
                          i=0,l=b.length,c=0;
                          while(i<l){
                             e=reNew(g[b[i]+c])//复制帧的 复制数据 +c:之前的插入导致数据变长
                             b[i]=b[i]+1+c; // +1:将占领的位置(复制目标index+1) ; +c : 之前增加元素导致的长度变化  (复制后插入的index)
                             g.splice(b[i],0,e);// 帧总数据中,复制位index 插入复制数据 
                             d[i]=e;//赋值 对应的新数据
                             c++;
                             i++;
                          };
                          t.img_clear(1); //仅清除 border
                          t.fpsShow(fpsIndex,3);//刷新显示,并生成新的imgDom
                          c=t.img_get(b); //返回新的对应 imgDom
                          a[2]=c;//
                          i=0;
                          while(i<l){
                              c[i].style.border='1px solid red';//新匹配 imgDom 加border
                              i++;
                          };
                    };
            };
            //清除所有选择的img  (点击空白 ,播放, 会执行该方法)
            t.img_clear=function(mt){ //mt=>1;仅清除 border, 不清空缓存数据a
                 
                 if(a){//清除缓存, 并取消所有标记
                    var c=a[2],l=c.length;
                        while(l--){
                            c[l].style.border='';//
                        };
                       if(mt!==1)a=null,f=0;
                 }else{
                    f=0;
                 }
            };
    },
    //获取重匹配的 imgDom对象 
    img_get:function(d){ //d =[ index 列表 ]
        var i=0,l=d.length,a,c=[];
            a=mov_rq.getElementsByTagName('img');
            while(i<l){
                c[i]=a[d[i]];
                i++;
            }; 
            return c; // [imgDom...] 位置变化后,重新匹配的
    },
    //清空 xzData ( 因为 nowImgIndex 目标失效 [删除,切删添帧, 切换组动画]的原因 )
    qkXzData:function(){
        var a,b,c,d;
            nowImgIndex=-1;
            a={w:0,h:0,x:0,y:0,jx:false,yf:false,xs:true,wy:0};
            app.dhData.xzData=a;
    },
    //获取 子目录动画 的 组id
    getId:function(){ //1:图 2:音频
        var a,b,c,d,e,f,g,h,i=0,l,u;
            a=idrr;
            l=a.length;
            b=a[l-1]; //当前顺位最大值
            if(b===u){ //空值返回0
                a.push(0);
                return 0;
            };
            if(b===l-1){//顺位无缺
                a.push(l);
                return l; //返回顺位id
            };
            //查缺
            while(i<l){
                c=a[i];
                if(c!==i){//理应 c===i , 不相等, 说明此处缺了i
                    a.splice(i,0,i);//补位,按顺序
                    return i; //返回缺位id
                };
               i++;
            };
    },
    //删除 选中的 动画子组数据    list2 list3 和idrr
    del_data:function(a){// [主目录,子目录]
      var t=this,b,c,d,e,f,g,h,i,j;
           t.bf_bf();//停止动画
           t.qkXzData();//删除选择目标
           b=list2[a[0]][a[1]]; //所在目录组 对应的 id
           i=idrr.indexOf(b);
           if(i>-1)idrr.splice(i,1); //删除id 占用
           delete list2[a[0]][a[1]]; //删除所在目录树
           delete list3[b]; //删除 id组数据 
           app.imgData=[];//清空演示列表
           app.dhData.fpsTime=[];//清空帧列表
           nowData=null,fpsIndex=-1,nowImgIndex=-1; //此时清空 总组数据 于 id组数据
    },
    //添加动画帧数据  (添加新帧 复制当前帧数据 到 当前帧之后)
    addFps:function(){
      var  t=this,a,b,c,d,e,f,g=app,h,i,j,k,l,m,n;
            clearKjXz()//清除快捷键状态选择下选中 目标
            g.dhData.fpsTime.push({time:300});//默认时间300
            g.dhData.fpsTime='update';
            fpsIndex++; //帧指向当前  (默认选择 动画组的时候 ,会指向0 ,若没有就是-1,创建出的就是空帧)
            a=[];
            if(fpsIndex>0){ //复制前一帧(选择帧)的数据 (所以前一帧必须是>0的,因为fpsIndex++了)
                a=reNew(nowData.fps[fpsIndex-1]); 
            };
            t.qkXzData();//清除 img 选中状态nowImgIndex=-1
            nowData.fps.splice(fpsIndex,0,a);//增加一个帧, 复制前一帧数据到其后 (前一帧没有则使用[]空帧)
            nowData.time.splice(fpsIndex,0,300);//增加对应增加帧 用时(默认300)
            t.del_gx();
    },
    //删除动画帧数据
    delFps:function(){
        var t=this,a,b,c,d,e,f,g=app,h,i,j,k,l,m,n;
            clearKjXz()//清除快捷键状态选择下选中 目标
            g.imgData.splice(fpsIndex,1);//删除当前数据 imgData for
            g.imgData='update';
            g.dhData.fpsTime.splice(fpsIndex,1);//删除对应帧 计时 for数据
            g.dhData.fpsTime='update';
            nowData.fps.splice(fpsIndex,1);
            nowData.time.splice(fpsIndex,1);
            //此处先删除对应帧数据 同时删除nowData.fps里的
            l=g.imgData.length;
            if(l>0){
                if(fpsIndex>=l)fpsIndex=l-1;  //不溢出,就默认当前帧补位的数据,否则向前移1帧
            }else{
                fpsIndex=-1;// 所有帧数据都被删除了
                g.dhData.dh=1;//重置允许选择动画类型了, 默认选择切换  (需变更数值才生效)
                g.dhData.dh=0;
            };
            t.fpsShow(fpsIndex);
            t.del_gx();
    },
    //添加img数据 
    addImg:function(d){
        var a,b,c,e,f,g=app,h,i,j,k,l,m,n,o=nowData;
             clearKjXz()//清除快捷键状态选择下选中 目标
                g.imgData.push({x:0,y:0,w:d.size[0],h:d.size[1],src:d.src,jx:false,yf:false,xs:true,wy:0}); //默认初始位置都是 0,0
                g.imgData='update';
                gFun.save_fps();//储存
           
    },
    //删除img数据
    delImg:function(a){//nowImgIndex
        var t=this,b,c,e,f,g=app,h,i,j,k,l,m,n,o=nowData;
            clearKjXz()//清除快捷键状态选择下选中 目标
            g.imgData.splice(a,1);
            g.imgData='update';
            b=fpsIndex;
            nowData.fps[b].splice(a,1);//删除对应帧中的数据
            //删除操作
            gFun.qkXzData();//清除 img 选中状态nowImgIndex=-1
            t.del_gx();
    },
    //连线图区#############################################################################################################################################
    //删除所有关系 (当删除图片,删除帧和添加帧 ,层移动img , 修改播放帧序是  几类情况清空)
    del_gx:function(){
         var u;
          nowData.gx=u;//
    },
    //关系连线初始化 (依据默认播放帧序列填充); 
    gx_init:function(){
        var t=this,a,b,c,d,e,f,g,h,i,j,k,l,m,n;
            t.bf_bf(); //停止播放
            t.save_fps();//先存储
            a=nowData;
            b=a.list; //帧执行循序
            c=[];
            i=0,l=b.length;
            if(l<2){//少于两帧
                 tipFun('少于 2 帧 , 无法建立过渡动画');
                return;
            };
            
            close[0].style.display='none'; //隐藏总面板开关
            while(i<l){
                c.push({index:b[i]});
                i++;
            };
            app.gx_line.index=c;// 赋值上方的 帧序 列表
            //~~~~~~~~~~~~
            c=a.gx; //已有的关系数据
            if(!c)c=[];
            t.gx_hz_init(c,0);
            //~~~~
            t.gx_gx_show(0);//基于序列帧索引 初始位置(0) 建立视图 和对应关系图  (防止图片为异步未加载完,造成显示错误)
            //
        
            scbj_gx.style.display='block';   //显示过渡关系 编辑面板
              
    },
    //依据当前播放顺序帧,显示上下视图,并匹配对应关系
    gx_gx_show:function(n){ //n当前帧序索引, 上视图
        var t=this,a=nowData,b,c,d,l;
            clearTimeout(t.st2);
            b=a.list;//帧序
            c=a.fps;//
            l=b.length;
            d=n+1;
            if(d>=l)d=0;//溢出从头开始
            //n当前帧上视图,d:下一个播放帧帧视图 (基于播放帧序)
            t.gx_fps_show(c[b[n]],0);//上视图帧
            t.gx_fps_show(c[b[d]],1);//下试图帧
            
            //左侧显示当前的
            apItem.indexPrv.textContent=n;
            apItem.indexNxt.textContent=d;
            t.gx_index_bj(n,d); //更新上方 帧序的 指示标记
            t.st2=setTimeout(function(){t.gx_hz(n)},150);//绘制关系连线图 ,延迟因为img异步加载

    },
    //关系图 上下帧 显示输出
    gx_fps_show:function(d,n){//d:帧数据 ,n=>0:上,1:下
       var o=nowData,a,b,c,d,e,f,g,h,i,j,k,l,m,u;
                a=d; //帧数据
                // c=app.dhData;
                // c.jx=o.jd[0],c.jy=o.jd[1]; //设置基点 
                i=0,l=a.length,d=[];
                while(i<l){
                    b=a[i]; //[imgId,w,h,x,y,yy,xs]
                    d.push({
                        src:b[0]+'.png',
                        w:b[1],h:b[2],x:b[3],y:b[4],
                        jx:b[5]?true:false,
                        yf:b[6]?true:false,
                        xs:b[7]?true:false,
                        wy:b[8],
                    });
                    i++;
                };
                app.gx_line[n===0?'fpsPrv':'fpsNxt']=d; //赋值 演示区数据
    },
    //关系图 img hover 和click 对应显示关系 ,提前缓存dom ,进行相关逻辑处理
    gx_img_index_init:function(){
        var t=this,a=[],b,c,d,e,f,g,h,i,j,k,l,m,n,hc,u;
            //a=[[上视图imgDom],[上侧边栏imgDom],[下视图imgDom],[下侧边栏imgDom]]   视图和对应侧边栏都是一一 index 对应关系
        var gx=[],bi=0,L=0,zd,zb=[]; 
             /* 
              gx:[
                  [n1,n2,....] // index 帧序index  ,n1,n2 指向下个播放帧的 imgIndex  null或undefined占位
              ]
              bi:当前播放 帧 的index 指向fps的索引
              zd:最上方的 帧序 列表的子dom   , zb=[前后标记索引]
             */    
            t.gx_hz_init=function(D,I){
                gx=D,bi=I;
            };
            //关系连线图翻页
            t.gx_page=function(V){//0:上翻页,1:下翻页,2:仅刷新
                    L=nowData.list.length;
                    if(V===0){
                        bi--;
                        if(bi<0)bi=L-1;
                    }else if(V===1){
                        bi++;
                        if(bi>=L)bi=0;  
                    };//else 2
                    t.gx_qc_hc();//清除 hc
                    t.gx_gx_show(bi);//绘制新的 上下视图,并刷新gx
            };
            //缓存各个容器内的dom ,当数据发生变动时
            t.gx_cache=function(items,N){//dom容器对象 ,N对应位置 0:上1:下
                 if(N===0){//上视图区
                     a[0]=items.st_rq_t.getElementsByTagName('img');
                     b=app.gx_line.fpsPrv;
                     i=0,l=b.length,d=[];
                     while(i<l){
                         c=b[i];
                         d.push({src:c.src});
                        i++;
                     };
                     app.gx_line.imgBar_t=d;
                     a[1]=items.st_bar_t.getElementsByTagName('img');

                 }else{//1:下视图区
                    a[2]=items.st_rq_b.getElementsByTagName('img');
                     b=app.gx_line.fpsNxt;
                     i=0,l=b.length,d=[];
                     while(i<l){
                         c=b[i];
                         d.push({src:c.src});
                        i++;
                     };
                     app.gx_line.imgBar_b=d;
                     a[3]=items.st_bar_b.getElementsByTagName('img');
                 };
            };
            //当关系图被点击
            t.gx_img_dj=function(N,I,F){//N=1:上视图区 ,I:index ,F=>1:仅绘制(帧切换时,并且不保存),2:删除已有关系连接
                var svg,b,c,w,h,x,y,m,d,o,g;
                    svg=apItem.gx_svg;
                    b=a[N===1?0:2][I];//上或下视图 选中的imgDom
                    o=a[N===1?1:3][I];//侧边栏img
                    if(F!==1&&N===1){ //
                         g=gx[bi][I]; //当前图绑定的过渡关系
                         if(g!==null&&g>-1){//已有建立的过渡关系 (null>-1=true!!!!)
                             if(F===2){
                                 gx[bi][I]=null;//清除绑定关系
                                 t.gx_hz(bi); //刷新gx绘制
                             };   
                             t.gx_qc_hc();
                            return;
                         };
                    };
                    c=b.style;
                    w=c.width.replace('px','')<<0;
                    h=c.height.replace('px','')<<0;
                    x=c.left.replace('px','')<<0;
                    y=c.bottom.replace('px','')<<0;
                    if(N===1){//1:上视图区
                            if(hc){
                                hc[0][2].style.border=''
                                hc[0][3].style.border=''
                            };
                            x=x+300+(w/2)<<0; //
                            y=86+(470-y)-(h/2)<<0; //取左下角顶点
                            c.border='1px solid rgb(2,232,16)';
                            o.style.border='1px solid rgb(2,232,16)';
                            hc={
                                0:[x,y,b,o,I]
                            };
                    }else{//2:下视图区
                        if(hc){//存在上视图 选择
                                x=x+300+(w/2)<<0; //
                                y=567+(470-y-h/2)<<0;//取左上角顶点
                                m=hc[0];//[x1,y1,img1,cbImg,tIndex]
                                m[2].style.border='';
                                m[3].style.border='';
                                d=cjLine([m[0],m[1],x,y])
                                svg.appendChild(d);
                                //生成关系数据
                                if(F!==1)gx[bi][m[4]]=I;
                                hc=null;
                        }; 
                    };
            };
            //绘制显示帧的关系图
            t.gx_hz=function(N){
                d=gx[N];
                m=apItem.gx_svg; //svg DOM
                m.innerHTML='';
                if(!d){//空帧 简历数据格式
                    d=[];
                    gx[N]=[]
                }else{//存在关系数据
                    i=0,l=d.length;
                    while(i<l){
                        c=d[i];
                        if(c!==null&&c>-1){//存在对应关系   (null>-1===true!!!)
                             t.gx_img_dj(1,i,1); //模拟点击上视图区  index=i 的img  仅绘制
                             t.gx_img_dj(2,c,1);//模拟点击下视图区  index=i 的img
                        };
                        i++;
                    };
                };
            };
            //最上方的 帧序 索引标记
            t.gx_index_bj=function(v0,v1,F){
                if(!zd)zd=apItem.gx_zx.getElementsByTagName('span'); //
                if(zb.length>0){//存在之前的标记,清空border标记
                    zd[zb[0]].style.border='';
                    zd[zb[1]].style.border='';
                };
               
                    zb=[v0,v1];
                    zd[v0].style.border='1px solid red';
                    zd[v1].style.border='1px solid red';
        
            },
            //切换帧,和删除绑定关系时,若存在hc 则清除
            t.gx_qc_hc=function(){
               if(hc){
                    hc[0][2].style.border=''
                    hc[0][3].style.border=''
                    hc=null;
               };
            },
            //因面板关闭,储存数据,并清空缓存
            t.gx_close=function(){
                app.gx_line={};  
                nowData.gx=gx; //赋值关系数据
                //先清除选择border
                t.gx_qc_hc();
                //再清除gx连线 ,zd,zb
                a=[],zd=null,zb=[];
            }

    },
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //查重复文件名 (大类查大类,子类查对应子类)
    checkCf:function(n1,n2){ //大类名字或id,子类名字
        var a,b,c,d,e,f,g,h,i,j,k,l,m,n,u;
            a=app.ml_hcdh;
            if(n2!==u){ //存在子类就是查 子目录,否则主目录
                a=a[n1].child; //子类 ,此时n1=index
                c=n2;
            }else{
                c=n1;//
            };    
            l=a.length;
            while(l--){
                b=a[l];
                if(b.name===c)return true; // 存在重复,禁止使用
            };
    },
    //点击源目录时,更新显示右侧的资源列表 
    sourceList:function(a,dom){
       var b,c,d,e,f,g,h,i,j,k;
           b=list1[a[0]];
           if(b){
               b=b[a[1]];
               if(b){
                   d=[];
                   for(k in b){
                        c=b[k]; //{id,'',src:'',t:(1||2),size:[w,h]}   
                        d.push({
                            id:c.id,
                            t:c.t,
                            size:[c.size[0],c.size[1]],
                            src:'./|'+path+(c.t===1?'/img/':'/audio/')+c.src
                        });
                   }; 
                   dom.value=a[0]+' / '+a[1];
                   app.source=d;
               };
           }; 

    },
    //初始化打开面板时
    init:function(){
        var O=G_cfg,a,b,c,d,e,f,k,v,o;
             openF=1;//作用域打开
             path=O.project.path;//基础目录路径
            //生成 app.treeF的数据
            a=O.img_tree.data,d=[];
            if(a){//存在目录树
                list1=a;
                for(k in a){
                    c=a[k];
                    b={name:k,show:false};
                    e=[];
                    for(v in c){
                        e.push({name:v});
                    };
                    b.child_y=e;//
                    d.push(b);
                };
                app.ml_tree=d;
           };
           O=O.img_pj_dh;
           a=O.ml_tree,d=[];
           idrr=reNew(O.id); //查重id数组
           if(a){//存在 合成or动画 目录树
                list2=reNew(a); //动画目录树
                list3=reNew(O.id_data);//id 组dh数据
                for(k in a){
                    c=a[k];
                    b={name:k,show:false};
                    e=[];
                    for(v in c){
                        e.push({name:v});
                    };
                    b.child=e;//
                    d.push(b);
                };
                app.ml_hcdh=d; 
           }else{
                list2={},list3={};
           };
    },
    //关闭面板时  ( list2 数据合并到 G_cfg.img_tree.hcDh )
    destroy:function(){
        var t=this,o=this.cache,k,g=G_cfg.img_pj_dh;
            openF=0;//作用域关闭
            t.bf_bf();//关闭动画
            g.id=idrr;
            g.ml_tree=list2;
            g.id_data=list3;
            ist1=null,list2=null,list3=null,idrr=null;
            nowData=null,nowImgIndex=-1;
            path='';
            fpsIndex=-1;
            //清空app.cache;
            for(k in o){
                delete o[k]
            };
            app.ml_tree=[];
            app.source=[];
            app.ml_hcdh=[];
            app.imgData=[];
            app.dhData={};
            this.imgDom=null;//
            this.img_clear();//清除多选
    },
}; 
//多选dom 集体移动模式
gFun.img_jt_move_init();//复制动画相关 init
gFun.bf_gd_init();//过多动画相关init
gFun.gx_img_index_init();//关系图 img 选择关联逻辑处理模块 init
var apItem;
var app=new Eng({
       el:'scbj_',
       data:{
          //源 目录树 
          ml_tree:[
                /*{  name:'', //主目录
                     show:false,//  false:初始隐藏二级目录  show 影响 state
                     state:'＋', // 默认 + (提示展开)
                     child_y:[ //二级目录
                           {name:''}
                     ]
                }*/
          ],
          //源 图片 素材
          source:[//数据源 => 图片
                /* {
                   id:'',
                   src:'',//显示图路径
                   size:[],
                   t:'', //文件类型  -1:返回上层 0:文件夹 1:img 或 2:audio 
               } */
          ],
          //合成图 和 动图 目录树
          ml_hcdh:[
                /*{  name:'', //主目录
                     F:'', //是否显示主目录 border (用于判断选中的主目录)
                     show:false,//  false:初始隐藏二级目录  show 影响 state
                     state:'＋', // 默认 + (提示展开)
                     child:[ //二级目录
                           {name:''}
                     ]
                }*/
          ],
          //每帧 合成图 数据
          //演示区图片数据
          imgData:[
                // {x:10,y:60,w:40,h:40,src:'0.png',yf:false,xs:true,jx:false,wy:0},
          ], 
          //fps动画数据
          dhData:{
               bf:false,//播放状态默认是 fasle:显示播,true:显示停(实际播放中)
               xh:true, //默认 所有创建的 合成动画 都是循环的
               dh:0,    // 0:帧切换动画,1:帧过渡动画,
               jx:300,jy:40,//基点x 和基点y (同时作用于辅助线) 默认值 300;40  基点y值是从下往上算的 
               list:'',//播放顺序 以 ,分割
               xzData:{ //选中的 演示区 img的imgData 数据
                  yf:false,//演示区 选中修改的 img 是否为阴影层 (默认无选中状态 则是 false )
                  jx:false,//默认非镜像
                  xs:true, //默认显示
                  x:0,y:0,w:0,h:0,
                  wy:0, //位移 默认0  (如:-1上一个逻辑轴渲染,+1下一个逻辑轴渲染 0:当前轴) 范围 -5 ~ +5 当前允许范围
               },
               fpsTime:[
                    /* {time:300,//默认帧时间300 ,check:false//是否为阴影层}, */
                    // {time:300},{time:300}
               ],
          },
          //关系图属性
          gx_line:{
              index:[// index提示列表
                  // {index:No}
              ],
              fpsPrv:[//上视图 播放顺序前1帧
                  // {x:10,y:60,w:40,h:40,src:'0.png',yf:false},
              ],
              fpsNxt:[//下视图 播放顺序后1帧
                  // {x:10,y:60,w:40,h:40,src:'0.png',yf:false},
              ],
              imgBar_t:[//上视图 右侧选择栏 
                    //{src:''}
              ],
              imgBar_b:[//下视图 右侧选择栏 
                    //{src:''}
              ],
          },
       },
       cache:{
            line:null,//储存 关系line数据
            dragData:null,// 被拖拽的数据
            fpsDom:null,// 选中的fps dataDom
            pIndex:-1,// 之前选中的 主目录 (合成动画目录)
            dhZml:null, // 选中的动画子目录 dom (主要为了加border)
            pathArr:null,  //记录 选中子目录的 path 路径 :  主/副
            indexArr:null,//记录 选中子目录的  index 路径 :  主/副
       },
       watcherFor:{
           //过滤 源目录树
            ml_tree:function(items,cache){
                var a,b,c,d,e,f,g,h,i,j,k,l;
                    a=items.$_data; //当前数据
                    b=a.show;
                    if(b===true){//展开
                        a.state='━';
                    }else{//收缩状态
                        a.state='+';
                    };
                    c=a.name;
                    a=a.child_y;
                    i=0,l=a.length;
                   
                    while(i<l){
                        d=a[i];
                        d.path=c+'/'+d.name;
                        i++;
                    }; 
            },
            //过滤 动画 目录树
            ml_hcdh:function(items,cache){
                var a,b,c,d,e,f,g,h,i,j,k,l,u;
                    a=items.$_data; //当前数据
                    b=a.show;
                    if(a.F===u)a.F=false; //是否显示边框, 默认false (要有预设值, 否则后续添加无效 )
                    if(b===true){//展开
                        a.state='━';
                    }else{//收缩状态
                        a.state='+';
                    };
            },
            //过滤 动画 目录树 二级目录
            child:function(items,cache){
                var a,b,c,d,e,f,g,h,i,j,k,l,u;
                    a=items.$_data; //当前数据
                    b=items.$_pos;
                    a.pos=b[0]+';'+b[1];    // 索引  ;
                    c=items.$_gData.ml_hcdh[b[0]].name;//父pathName
                    a.path=c+';'+a.name; //path  ;  

            },
            //过滤演示区 图片 数据
            imgData:function(items,cache){
                var a,b,c,d,e,f,g,h,i,j,k,l,u;
                    a=items.$_data; //当前数据
                    //  var path='E:/test'; //test 临时
                    b=a.src.split('/').pop();//取文件名 (id.png) ,防止反复调整造成的 src路径地址自叠加
                    a.src='./|'+path+'/img/'+b;
            },
            // 帧用时
            fpsTime:function(i,cache){
                var a,b,c,d,e,f,g,hu;
                    a=i.$_forData;
                    if(a.length>0){//禁用选择 (只允许空帧选择)
                        i=i.$_items;
                        i.qh_dh_dom.disabled=true 
                        i.gd_dh_dom.disabled=true;
                    };
            },
            //#################################################
            fpsPrv:function(items,cache){
                var a,b,c,d,e,f,g,h,i,j,k,l,u;
                    a=items.$_data; //当前数据
                    //  var path='E:/test'; //test 临时
                    b=a.src.split('/').pop();//取文件名 (id.png) ,防止反复调整造成的 src路径地址自叠加
                    a.src='./|'+path+'/img/'+b;
            },
            fpsNxt:function(items,cache){
                var a,b,c,d,e,f,g,h,i,j,k,l,u;
                    a=items.$_data; //当前数据
                    //  var path='E:/test'; //test 临时
                    b=a.src.split('/').pop();//取文件名 (id.png) ,防止反复调整造成的 src路径地址自叠加
                    a.src='./|'+path+'/img/'+b;
            },
       },
       watcher:{
            'dhData.xh':function(o,n,i,c){
                var a=i.xh_dom;
                    a.checked=n;
            },
            'dhData.bf':function(o,n,i,c){
                var a=i.bfZt_dom,g=i.$_gData.imgData,d;
                     if(g.length===0){//没有可播放数据
                         n=false;
                         i.$_value=n;// 
                     };
                   //a: 播放暂停 按钮DOM : 默认停
                     a.textContent=n?'停':'播';
                     //n=> true:正在播放中提示 "停" , false: 停止状态 提示 "播";
                    //  say(n);
                     gFun.bf_bf(n);
                     d=c.fpsDom;
                     if(d){//清除选中的帧标记
                        d.style.background='';
                        c.fpsDom=null;
                     };
                     if(o===true){// 用于 修改.bf后显示图片 (播放时,隐藏属性的img 禁止显示,结束后触发一次显示)
                           gFun.fpsShow(0); // 用于 修改.bf后显示图片 (播放时,隐藏属性的img 禁止显示,结束后触发一次显示,显示第0帧)
                           
                    };
            },
            //0:帧切换动画,1:帧过渡动画,2:未标记(允许切换,空帧时)
            'dhData.dh':function(o,n,i,c){
                var a1=i.qh_dh_dom,a2=i.gd_dh_dom,g=i.$_gData.dhData.fpsTime,f=0; //a1:切换动画dom,a2:过渡动画dom,
                    if(g.length>0){//禁用选择 (只允许空帧选择)
                          a1.disabled=true 
                          a2.disabled=true;
                    }else{//空帧允许选择
                          a1.disabled=false; 
                          a2.disabled=false;
                    };
                    if(n===0){//选择切换动画
                        a1.checked=true;
                        a2.checked=false; 
                    }else if(n===1){//选择过渡动画
                        a1.checked=false;
                        a2.checked=true; 
                    };
            },
            //基点x值
            'dhData.jx':function(o,n,i,c){
                  var a=/^\+?[1-9][0-9]*$/;
                      if(n===0||a.test(n)){//正整数
                         n=n<<0;
                         if(n!==o){//修改基准线位置
                               i.fzx_x.style.left=n+'px';
                               i.$_gData.imgData='update';//因为修改了基准线,所以 所有图片跟随调整
                         };
                      }else{
                         n=o; //非法值则 取旧值
                      };
                      i.$_value=n;
            },
            //基点y值
            'dhData.jy':function(o,n,i,c){
                var a=/^\+?[1-9][0-9]*$/;
                    if(n===0||a.test(n)){//正整数
                       n=n<<0;
                       if(n!==o){//修改基准线位置
                          i.fzx_y.style.bottom=n+'px';
                          i.$_gData.imgData='update';//因为修改了基准线,所以 所有图片跟随调整
                       };
                    }else{
                       n=o; //非法值则 取旧值
                    };
                    i.$_value=n;
            },
            //是否显示 (过渡动画才生效, 0:隐藏,1:显示,2:禁用 )
            'dhData.xzData.xs':function(o,n,i,c){
                var a=i.xs_dom,d=i.$_gData.dhData;
                    a.checked=n;
                    gFun.imgSX();
            },
            //是否为阴影
            'dhData.xzData.yf':function(o,n,i,c){
                var a=i.yy_dom;
                   //a: checkbox DOM : 是否为阴影层 (选中的 演示区的 img )
                     a.checked=n;
                     gFun.imgSX();
            },
            //是否为镜像
            'dhData.xzData.jx':function(o,n,i,c){
                var a=i.jx_dom;
                   //a: checkbox DOM : 是否为阴影层 (选中的 演示区的 img )
                     a.checked=n;
                     gFun.imgSX();
            },
             //选中演示区 图片 x 属性
            'dhData.xzData.x':function(o,n,i,c){
                var a=/^(\+|\-)?[1-9][0-9]*$/;
                    if(n===0||a.test(n)){//整数(不区分正负)
                       n=n<<0;
                       gFun.imgSX();
                    }else{
                       n=o; //非法值则 取旧值
                    };
                    i.$_value=n;
            },
            //选中演示区 图片 y 属性
            'dhData.xzData.y':function(o,n,i,c){
                var a=/^(\+|\-)?[1-9][0-9]*$/;
                    if(n===0||a.test(n)){//整数(不区分正负)
                       n=n<<0;
                       gFun.imgSX();
                    }else{
                       n=o; //非法值则 取旧值
                    };
                    i.$_value=n;
            },
            //选中演示区 图片 w 属性
            'dhData.xzData.w':function(o,n,i,c){
                var a=/^\+?[1-9][0-9]*$/;
                    if(n===0||a.test(n)){//正整数
                       n=n<<0;
                       gFun.imgSX();
                    }else{
                       n=o; //非法值则 取旧值
                    };
                    i.$_value=n;
            },
            //选中演示区 图片 h 属性
            'dhData.xzData.h':function(o,n,i,c){
                var a=/^\+?[1-9][0-9]*$/;
                    if(n===0||a.test(n)){//正整数
                       n=n<<0;
                       gFun.imgSX();
                    }else{
                       n=o; //非法值则 取旧值
                    };
                    i.$_value=n;
            },
            //选中演示区 图片 wy 属性 wy值
            'dhData.xzData.wy':function(o,n,i,c){
                var n=n<<0;
                    if(n>-6&&n<6 ){// -5 ~ +5 允许的范围
                       gFun.imgSX();
                    }else{
                       tipFun('位移值当前允许范围 -5至5 ',1);
                       n=0; //非法值则 默认取0
                    };
                    i.$_value=n;
            },
            //关系图区#######################################################
             //上视图数据
            'gx_line.fpsPrv':function(o,n,i,c){
                setTimeout(function(){gFun.gx_cache(i,0)},1);//等待dom创建完成
            },
            'gx_line.fpsNxt':function(o,n,i,c){
                setTimeout(function(){gFun.gx_cache(i,1)},1);//等待dom创建完成
            },
             
       },
       event:{
            //点击 展开或收缩 二级列表 (源目录 和 动图目录)
            zk_ss:function(){
                var t=this,d=t.$_data,i=t.$_items,a,b,c,u,f,index;
                    //'＋','━'
                    f=d.show;
                    d.show=f?false:true; 
                    t.textContent=f?'＋':'━';
            },
            //选择源目录二级目录 ( 同时右侧显示对应 图片数据)
            sz_y:function(){
                var t=this,d=t.$_data,i=t.$_items,a,b,c,u;
                    a=t.getAttribute('path');//主目录/子目录
                    if(a){
                        a=a.split('/');
                        gFun.sourceList(a,i.ml_path);//[主目录,子目录] , 目录 value dom
                    };
            },
            // //选中 动画 主目录
            xz_pml:function(){
                var t=this,i=t.$_items,g=t.$_gData,d=t.$_data,c=t.$_cache,a,b;
                    //  debugger
                     a=t.getAttribute('index'); //主目录的 index
                     a=a<<0;
                     b=c.pIndex; //之前选中的主目录
                     if(b===a)return;//同一个目标
                     c.pIndex=a; //新的选择
                     d.F=true; //选中加边框
                     b=g.ml_hcdh[b];
                     if(b){//存在上一个选中目录
                          b.F=false; //取消选中
                     };
            },
            //选中 动画 子目录 (同时更换为 对应 动画演示数据 ,同时停止前一个动画 )
            xz_zml:function(){
                var t=this,c=t.$_cache,a,b,d,e,f,g;
                    gFun.bf_bf();//停止动画播放
                    a=t.getAttribute('pos').split(';'); // [pIndex , zIndex]
                    b=t.getAttribute('path').split(';');// [pMlName , zMlName]
                    t.style.border='1px solid black';
                    d=c.dhZml;
                    if(d)d.style.border='';//清空之前
                    c.dhZml=t;//记录当前选中dom 加 border 用
                    c.pathArr=b;
                    c.indexArr=a;
                    //
                    gFun.gxDhdata(b);//更新显示区, 默认显示对应第一帧的数据 若有
                    gFun.qkXzData();//清除 img 选中状态
                    // say(list2,list3,idrr);
            },
            //创建 动画主目录
            add_pm:function(){
                var t=this,i=t.$_items,g=t.$_gData,a,b,c,d,e,f,h;
                    a=i.flie_name;//pathName dom
                    b=a.value.trim(); //新建文件名
                    a.value='';
                    c=/[\\/:*?"<>|]/;
                    if(b===''||c.test(b)){
                         tipFun('违规命名 !! \r不允许包含\\/:*?"<>|',1) 
                         return;
                    };
                    a=gFun.checkCf(b);//命名查重
                    if(a){
                         tipFun('主目录 命名 存在重复!!',1) 
                         return;
                    };
                    a=reNew(g.ml_hcdh); //子子for 必须如此赋值,否则会被清空 子 =>子(这个的数据)
                    a.push({name:b,show:true,child:[]});
                    g.ml_hcdh=a;
                    list2[b]={}; //创建主目录数据
                    //新建取消之前的选中状态 
                    c=t.$_cache;
                    b=c.pIndex;
                    b=g.ml_hcdh[b];
                    if(b)b.F=false; //取消选中 (上一个主目录)
                    l=a.length-1;
                    c.pIndex=l;//指向当前主目录
                    a[l].F=true;

            },
            //创建 动画子目录 (以及基于id的组动画数据)
            add_zm:function(){
                var t=this,i=t.$_items,g=t.$_gData,a,b,c,d,e,f,h;
                    gFun.bf_bf();//停止动画播放
                    a=i.flie_name;//pathName dom
                    b=a.value.trim(); //新建文件名
                    a.value='';
                    c=/[\\/:*?"<>|]/;
                    if(b===''||c.test(b)){
                        tipFun('违规命名 !! \r不允许包含\\/:*?"<>|',1) 
                        return;
                    };
                    c=t.$_cache;
                    d=c.pIndex;//主目录 index
                    if(d<0){
                        tipFun('未选择主目录时无法创建子目录',1) 
                        return;
                    };
                    a=gFun.checkCf(d,b);//命名查重
                    if(a){
                         tipFun('主目录 命名 存在重复!!',1) 
                         return;
                    };
                    a=g.ml_hcdh[d];
                    a.child.push({name:b});
                    a.child='update';
                    d=a.name; //主目录名
                    a=list2[d];
                    if(!a)list2[d]={};//主目录未建立( 此处建立 )
                    e=gFun.getId(); //获取 动画组id
                    // say('组 id => '+e);
                    list2[d][b]=e;
                    list3[e]={t:true,dh:0,jd:[300,40],id:[],list:[],time:[],fps:[]};
                    // say(list2,list3); 
                   //t:true,id:[],list:[],time:[],fps:[]

            },
            //删除 合成动画目录 (先子后主 , 子删除完了才能主)
            del_ml:function(){
                var t=this,i=t.$_items,g=t.$_gData,c=t.$_cache,a,b,d,e,f,h;
                    gFun.bf_bf();//停止动画播放
                    a=c.indexArr;
                    if(a){//存在选中的 子目录
                        //app 中删除 
                        b=g.ml_hcdh[a[0]]; 
                        b.child.splice(a[1],1);//
                        b.child='update';
                        //list2 中删除
                        a=c.pathArr;
                        // say('删除 list2 子目录 ')
                        // delete list2[a[0]][a[1]];
                        gFun.del_data(a);//进行相关数据操作; 清除 list2,list3,idrr中的对应数据
                        //最后删除选中标记
                        c.dhZml.style.border='';
                        c.dhZml=null;
                        c.indexArr=null;
                        c.pathArr=null;

                    }else{//判断主目录
                        a=c.pIndex;
                        b=g.ml_hcdh[a];
                        if(b&&b.child.length===0){//存在对应主目录,并且子目录为空
                             b=reNew(g.ml_hcdh);
                             a=b.splice(a,1)[0];
                             g.ml_hcdh=b;
                             a=a.name; //待删除路径
                             delete list2[a] //删除主目录数据
                             c.dhZml=null;
                             c.indexArr=null;
                             c.pathArr=null;
                        }; 
                    };
            },
            //拖拽 素材源 (开始) 时
            ondragstart:function(){
                var t=this,i=t.$_items,d=t.$_data,g=t.$_gData,c=t.$_cache,a,b,e,f,h;
                    // say(d) //d={id:'',size:[w,h],src:'',t:1}
                    c.dragData=reNew(d);
            },
            //#########################################################################################################
            //拖拽 素材源 到演示区 放置时 (此处禁止 音频类素材放置)
            ondrop:function(){
                var t=this,i=t.$_items,g=t.$_gData,c=t.$_cache,a,b,d,e,f,h;
                    gFun.bf_bf();//停止动画播放
                    // say('放置');
                    if(fpsIndex<0){
                        c.dragData=null;
                        tipFun('未选定的空帧无法放置!!',1);
                        return;
                    };
                    d=c.dragData;
                    if(d){
                        c.dragData=null;
                        if(d.t!==1){
                            tipFun('此处不能编辑非图片!!',1);
                            return; 
                        };
                        gFun.addImg(d);
                    };
            },
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            //修改演示区背景色
            xz_color:function(){
                var t=this, a,b,c,d,e,f;
                    a=t.style.background;//选取的背景色
                    b=t.$_items.dh_rq;//容器dom
                    b.style.background=a;//
            },
            //循环类型切换 
            xh_lx:function(){
                var t=this,g=t.$_gData,a,b,c,d,e,f,x,y;
                    gFun.bf_bf();//停止动画播放
                    g.dhData.xh=t.checked;
            },
            //img加载后 触发 (永图调整自身宽高和位置基于基点)
            imgload:function(){
                var t=this,d=t.$_data,g=t.$_gData,c=t.$_cache,a,b,e,f,x,y;
                    // say('img 加载~~~~~')
                    //d={x,y,w,h,yf,src} //修改自身的 x,y,w,属性
                    a=t.style;
                    //基于基点计算
                    b=g.dhData;
                    f=b.bf;// true:播放,false:停
                    x=b.jx,y=b.jy;
                    x+=d.x,y=y+d.y;  // y轴值是从下往上算的  d.y 值越大越向上, (此处bottom 从底部向上算,忽略h)
                    // say(x,y,d.w,d.h);
                    a.width=d.w+'px';
                    a.height=d.h+'px';
                    a.left=x+'px';
                    a.bottom=y+'px';
                    a.display='block';
                    a.transform=d.jx?'scaleX(-1)':'';
                    if(f){//播放时
                        a.opacity=d.xs?'':0;//  隐藏的完全不显示(播放时)
                    }else{
                        a.opacity=d.xs?'':0.3;// 隐藏的透明显示(非播放时)
                    };
            },
            //删除选中的 img 数据 (从app.imgData中,同时清空app.dhData.xzData)
            del_img:function(){
                var t=this,i=t.$_items,g=t.$_gData,c=t.$_cache,a,b,d,e,f,h;
                     gFun.bf_bf();//停止动画播放
                     a=nowImgIndex,b=fpsIndex;
                     if(b>-1&&a>-1){
                         gFun.delImg(a);
                     };
            },
            //添加帧    (fpsIndex 指向复制帧 ,也就是当前指向++)
            add_fps:function(){
                var t=this,i=t.$_items,g=t.$_gData,c=t.$_cache,a,b,d,e,f,h; 
                    gFun.bf_bf();//停止动画播放
                    if(!nowData){
                            tipFun('没有选中的 组动画 数据',1);
                        return;
                    };
                    a=c.fpsDom;
                    if(a){ //清除之前标记的 border
                         a.style.background='';
                         c.fpsDom=null;
                    };
                    gFun.addFps();//添加新帧 复制当前帧数据 到 当前帧之后
            },
            //删除帧  (此时 fpsIndex 不指向任何 补位帧 )
            del_fps:function(){
                var t=this,i=t.$_items,g=t.$_gData,c=t.$_cache,a,b,e,f,h,l;
                     gFun.bf_bf();//停止动画播放
                     if(!nowData){
                           tipFun('每有选中的 动画 组数据',1);
                        return;
                    };
                    if(fpsIndex<0){
                           tipFun('所有选中的 帧数据',1);
                        return;// 没有选中的帧
                    };
                    a=c.fpsDom;
                    if(a){ //清除之前标记的 border
                         a.style.background='';
                         c.fpsDom=null;
                    };
                    gFun.qkXzData();//清除 img 选中状态nowImgIndex=-1  
                    gFun.delFps();
                    
            },
            //选中帧  的数据dom  (加border , 演示区同时显示帧数据 )
            xz_fps:function(){
                var t=this,c=t.$_cache,a,b,d,e;
                    gFun.bf_bf();//停止动画播放
                    clearKjXz()//清除快捷键状态选择下选中 目标
                    // gFun.imgSX();//储存当前选中的img属性信息
                    a=c.fpsDom;
                    if(a){
                        if(a===t)return; //同一个
                         a.style.background='';
                    };
                    c.fpsDom=t;
                    t.style.background='rgba(253,50,1,0.6)';
                    a=t.getAttribute('index')<<0;
                    if(fpsIndex>-1&&a!==fpsIndex)gFun.save_fps(); //切换不同的帧,储存前一个帧的数据
                    fpsIndex=a;//选中的帧数据索引
                    gFun.qkXzData();//清除 img 选中状态nowImgIndex=-1
                    gFun.fpsShow(a);//包含了重置 nowImgIndex=-1;
            },
             //选中 演示区 图片 的素材 ( 多用于拖拽 复制等 ,上下层级移动等 )
            xz_img:function(){
                var t=this,i=t.$_items,d=t.$_data,g=t.$_gData,c=t.$_cache,a,b,e,f,h;
                    gFun.bf_bf();//停止动画播放
                    b=t.getAttribute('index')<<0;
                    nowImgIndex=b;
                    a=g.dhData.xzData;//{w;h;x;y,yf}
                    a.x=d.x,a.y=d.y,a.w=d.w,a.h=d.h,a.jx=d.jx,a.yf=d.yf,a.xs=d.xs;
            },
            //选中 的演示区图片 层级上移 (数据中越高后,层级越高 因为后来的覆盖之前)
            img_up:function(){
                var t=this,d=t.$_gData.imgData,a,b,c,e,f,g,h,i,n;
                    gFun.bf_bf();//停止动画播放
                    i=nowImgIndex,n=fpsIndex
                    if(n>-1&&i>0){// 检查是否为最后一层
                            h=d.length-1;
                            if(i>=h)return; //已经是最顶层了
                            gFun.qkXzData();
                            a=nowData.fps[n];
                            b=a[i]; //当前层数据
                            c=a[i+1];//交换层数据
                            a[i+1]=b;
                            a[i]=c;
                            gFun.fpsShow(n);
                            gFun.del_gx();
                    }; 
            },
            //选中 的演示区图片 层级下移 (数据中越靠前,层级越低, 因为后来的覆盖之前)
            img_down:function(){
                var t=this,d=t.$_gData.imgData,a,b,c,e,f,g,h,i,n;
                    gFun.bf_bf();//停止动画播放
                    i=nowImgIndex,n=fpsIndex
                    if(n>-1&&i>0){// 图片层级1才能开始向上
                            gFun.qkXzData();
                            a=nowData.fps[n];
                            b=a[i]; //当前层数据
                            c=a[i-1];//交换层数据
                            a[i-1]=b;
                            a[i]=c;
                            gFun.fpsShow(n);
                            gFun.del_gx();
                    }; 
            },
            //播放 or 暂停  ( 播放时,禁止拖拽以及修改数据)
            bfOrZt:function(){
                var t=this,g=t.$_gData,a,b,c,d;
                    a=g.dhData.bf;//
                    g.dhData.bf=a?false:true;
            },
            //选中 的演示区图片 是否为阴影层 ( 用于地图编辑时,判断此帧是否 可以浮动于某些物体表面, 而非地面)
            yy_check:function(){
                var t=this,g=t.$_gData.dhData.xzData,a,b,c,d;
                    gFun.bf_bf();//停止动画播放
                    a=g.yf;//
                    g.yf=a?false:true;
            },
            //选中的演示区的图片 是否为镜像
            jx_check:function(){
                var t=this,g=t.$_gData.dhData.xzData,a,b,c,d;
                    gFun.bf_bf();//停止动画播放
                    a=g.jx;//
                    g.jx=a?false:true;
            },
            //显示切换 (img 在当前帧的 显示与关闭 )
            xs_check:function(){
                var t=this,g=t.$_gData.dhData.xzData,d=t.$_data,a,b,c,e,f;
                    gFun.bf_bf();//停止动画播放
                    // debugger
                    a=g.xs;
                    g.xs=a?false:true;//显示
            },
            //动画类型切换 (0:帧切换动画,1:帧过渡动画)
            dh_qh:function(){
                var t=this,g=t.$_gData.dhData,a,b,c,d,e,f;
                    gFun.bf_bf();//停止动画播放
                    a=g.dh;
                    g.dh=a?0:1; //单选, 帧切换和过渡动画类型   切换 
            },
            //更新帧显示时间 (0=永久, 不能小于0   ,修改this.time )
            gx_time:function(){
                 var t=this,d=t.$_data,a,b,c;
                     gFun.bf_bf();//停止动画播放
                     a=/^\+?[1-9][0-9]*$/;//正整数正则
                     b=t.value;
                     if(b==='0'||a.test(b)){
                          b=b<<0;
                          d.time=b;// 更新帧显示时间
                     };
            },
            //关系图相关 (过渡动画)##################################################################################################
            //点击 编辑过渡关系按钮
            gx_init:function(){
               var t=this,d=t.$_gData,a=d.dhData,b,c;
                   if(a.dh===1&&a.fpsTime.length>1){ //过渡动画 && 帧数大于2
                       gFun.gx_init();//关系图子面板展开
                   }else{
                       tipFun('无法使用! \r非过渡动画 或 帧数少于2...',1);
                   };
            },
            //上下视图img 加载
            gx_imgload:function(){
                var t=this,d=t.$_data,g=t.$_gData,c=t.$_cache,a,b,e,f,x,y;
                    // say('img 加载~~~~~')
                    //d={x,y,w,h,yf,src} //修改自身的 x,y,w,属性
                    a=t.style;
                    //基于基点计算
                    b=g.dhData;
                    // f=b.bf;// true:播放,false:停
                    x=b.jx,y=b.jy;
                    x+=d.x,y=y+d.y;  // y轴值是从下往上算的  d.y 值越大越向上, (此处bottom 从底部向上算,忽略h)
                    // say(x,y,d.w,d.h);
                    a.width=d.w+'px';
                    a.height=d.h+'px';
                    a.left=x+'px';
                    a.bottom=y+'px';
                    a.display='block';
                    a.transform=d.jx?'scaleX(-1)':'';
                    a.opacity=d.xs?'':0.3;// 选择隐藏,此处
                    
            },
            //点击上下视图内的img 生成关系连线 (包括 侧栏 imgBar)
            gx_line:function(e){
                var t=this,g=t.$_gData,d=t.$_data,c=t.$_cache,items=t.$_items,a,b,f,h,i,j,k,l,m,n,x,y;
                    n=t.getAttribute('p')<<0; //1:上视图区,2:下视图区
                    i=t.getAttribute('index')<<0;
                    if(e.button===2){//删除操作
                        f=2
                        e.preventDefault();//禁止弹出菜单
                    };
                    gFun.gx_img_dj(n,i,f);
            },
            //上翻页
            pagePrv:function(){
                gFun.gx_page(0);//前一帧
            },
            //下翻页
            pageNxt:function(){
                gFun.gx_page(1);;//后一帧
            }
       },
       created:function(items,cache){
            apItem=items;
             G_cz.fun.scbjFun=gFun; //内部方法暴露 给外部
             gFun.cache=cache; //关闭时清空用
              
             //防止 ondrop 无法在该区域触发
             items.sc_prevent.ondragover=function(e){
                   e.preventDefault()
             };
       }
});   
var mov_rq=scbj_.getElementsByClassName('scbj_dh_rq')[0];
var clearKjXz; //清除快捷选择 (添加帧,删除帧,添加,删除图片时 ,切换选择帧时触发)
//容器内元素拖拽 #####################################################################################  
(function(){
// var mov_rq=scbj_.getElementsByClassName('scbj_dh_rq')[0];
var x,y,x1,y1,x2,y2,f=0,dd; // f=>1 允许拖动状态
var cF=0 ///ctrl 1:按住 0:未按
var cF2=0; //cF2=>1:多选状态还未取消(已经选中的)
//ctrl+v 复制选中的对象 , 此刻可以 wasd 成组的移动
clearKjXz=function(){
    var a;
        a=gFun.imgDom;
        if(a){//去除边框,去除显存
            a.style.border='';
            gFun.imgDom=null;
            nowImgIndex=-1; //未有选中重置-1
        };
        if(cF2===1){//清空缓存的 多选组
            cF2=0; //多选模式 和 选择对象被清除
            gFun.img_clear();//
        };
};
//区域内鼠标按下
mov_rq.addEventListener('mousedown',function(e){
      var a=e.target,b,c,d,g,h,irr,ff=0;
          if(fpsIndex>-1&&a.tagName==='IMG'){
            //   say('111111');
                g=gFun;
                gFun.bf_bf();//停止动画播放
                b=g.imgDom;
                if(b)b.style.border='';//清空前一个选择
               
                if(cF===0){//单选模式
                    g.imgDom=a;
                    a.style.border='1px solid red';
                }else if(cF===1){//多选模式
                    cF2=1;
                    g.qkXzData();//清空选择data
                    g.img_tj(a);
                    ff=1;
                };
                //命中移动目标时 记录初次坐标 x1,y1
                x1=e.pageX,y1=e.pageY;//初始 坐标值
                f=1;
                d=app.dhData.xzData;
                x=d.x,y=d.y;//记录初始app 原始值 
                dd=d;
                // say(JSON.stringify(dd));
                // say('初始=>',x,y,x1,y1); 
                if(ff===1)e.stopPropagation();//防止向子img 传递 .避免设置 xzData数据
          }else{
              a=gFun.imgDom;
              if(a){//去除边框,去除显存
                    a.style.border='';
                    gFun.imgDom=null;
                    nowImgIndex=-1; //未有选中重置-1
              };
              if(cF2===1){//清空缓存的 多选组
                  cF2=0; //多选模式 和 选择对象被清除
                  gFun.img_clear();//
              }
          };        
});

//命中时判断 (大范围移动 ,10px 误触范围判定)
mov_rq.addEventListener('mousemove',function(e){
    if(openF===0)return;//功能区未起作用
     if(f===1){
              if(cF2===1)return; //多选模式,只能通过快捷键操作 
           var a,b,c,d,e,g,h,i,j,k;
                 a=dd; // app.dhData.xzData
                //  say(JSON.stringify(a));

                 x2=e.pageX,y2=e.pageY;
                 b=x2-x1;
                 c=y2-y1;
                 if(b>10||b<-10)a.x=x+b; //10px 误触判定范围, 微调用快捷键
                 if(b>10||b<-10)a.y=y-c; // y2-y1值越大越向下
                 e.stopPropagation();
                 e.preventDefault();
     };
});
window.addEventListener('keydown',function(e){
    if(openF===0)return;//功能区未起作用
    var a=e.keyCode,f=0,g;
        // say(a);
        if(nowData){
            g=gFun;
            if(nowImgIndex>-1){ //单选移动模式 (多选模式下 会 重置nowImgIndex=-1 ,按住ctrl再点击图片时 重置 ,不点击+c就是复制 单图 )
                switch(a){
                        case 65://左
                            dd.x--,f=1;
                        break;
                        case 68://右
                            dd.x++,f=1;
                        break;  
                        case 87://上
                            dd.y++,f=1;
                        break;  
                        case 83://下
                            dd.y--,f=1;
                        break;
                        case 17://ctrl 按住 选择集体移动模式
                           cF=1,f=1; // ctrl alt 互斥
                        break;
                        case 86: 
                        if(cF===1){// 复制模式
                            cF=0; //因为按住v不放,会反复触发, 只允许复制一次  
                            f=0;
                            g.img_cp_move(0);//单选复制
                        };
                        break; 
                }; 
           }else{ //多选移动模式
                switch(a){
                    case 65://左
                        g.img_all_move(-1,0);
                    break;
                    case 68://右
                        g.img_all_move(1,0);
                    break;  
                    case 87://上
                        g.img_all_move(0,1);
                    break;  
                    case 83://下
                        g.img_all_move(0,-1);
                    break;
                    case 17://ctrl 按住 选择集体移动模式
                        cF=1,f=1; // ctrl alt 互斥
                    break;
                    case 86: //v
                       if(cF===1){// 复制模式
                          cF=0; //因为按住v不放,会反复触发, 只允许复制一次  
                          f=0;
                          g.img_cp_move(1);//多选复制
                       };
                    break;      
                }; 
           };       
        };
        if(f===1)e.preventDefault();
 });
window.addEventListener('keyup',function(e){
    if(openF===0)return;//功能区未起作用
       var a=e.keyCode,f=0;
           switch(a){ 
               case 17://ctrl 弹起 解除集体选择模式
                  cF=0,f;
               break;   
           };
           if(f===1)e.preventDefault();
});
window.addEventListener('mouseup',function(e){
    if(openF===0)return;//功能区未起作用
    f=0;
});
window.addEventListener('blur',function(e){
    if(openF===0)return;//功能区未起作用
    f=0,cF=0;
});
//提示词~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var ts={
    //0:['',],//文本,颜色(0黑1红)
      1:['    鼠标左键按住 图标素材 拖拽至下方正中的演示区 , 进行帧动画组合'],
      2:['    点击更换演示区背景色'],
      3:['    帧动画演示区\r    鼠标左键单击选中单个图片, 按住不松, 可大范围移动. 松开鼠标可用w,a,s,d上下左右精确移动. 亦可通过右侧面板对选中的单个目标直接输入修改'+
        '\r    按住ctrl不松可选中多个目标, 此时通过w,a,s,d可进行集体移动, 鼠标移动仅支持单选目标'+
        '\r    按住ctrl+v可对所有选中目标进行复制, 此时复制目标与原有目标重叠, 通过w,a,s,d控制移动复制目标可进行区分'+
        '\r    十字线为基线,y轴为地平线, x轴为左边沿线, 对应地图编辑器中的 地图 网格, 可通过右侧面板对基点显示位置进行调整'],
      4:['    切换帧动画\r\r    通过 切换显示 形成视觉动画效果\r\r    注意: 主要用于地图场景动态元素的拼接组合, 对于绝大多数动画元素, 无需过多的"细节过渡", 几帧就足够了, 人脑会自动补帧'+
        '\r\r    用例提示: (变换的广告牌, 橱窗中的播放的电视, 摇曳的窗户, 活动的场景npc, 运动的机械....等)'],
      5:['    过渡帧动画\r\r    切换帧动画的加强版, 可设置关系帧内单或多个元素的过渡效果(只对x,y,宽,高参数生效)'+
        '\r\r    注意: 主要用于地图场景动态元素的拼接组合, 对于绝大多数动画元素, 无需过多的"细节过渡", 几帧就足够了, 人脑会自动补帧'+
        '\r\r    用例提示: 如:(变换的广告牌上不断移动环绕的跑马灯小星星, 过渡关系主要针对的是移动的小星星, 广告牌本身是切换动画, 小星星是不断位移的过渡元素) '],
      6:['    修改选中图片的x值, 相对于x轴参考线值越大越向右'],
      7:['    修改选中图片的y值, 相对于y轴参考线值越大越向上'],
      8:['    修改选中图片的宽 \r\r禁止负值, 若需不显示, 将显示选项勾掉即可'],
      9:['    修改选中图片的高 \r\r禁止负值, 若需不显示, 将显示选项勾掉即可'],
      10:['    在当前帧 选中的图片 是否允许显示'],
      11:['    当前帧 选中图片将镜像(左右对调)显示'],
      12:['    当前帧 选中的 图片将被视作地面阴影 ,当放置于地图场景时, 作为地面阴影元素, 被渲染于最底层'],
      13:['    选中的图片, 在当前帧渲染层级上移, 将会遮挡住其它层级较低的图片, 发生重叠时'],
      14:['    选中的图片, 在当前帧渲染层级下移, 将会被其它层级较高的图片遮挡, 发生重叠时'],
      15:['    动画是否按照设定帧序循环播放, 若非勾选循环, 则一个帧序周期结束后, 会自动消失 \r\r    注意:若当前帧的显示时间被设置为0, 则当播放到到该帧时会永久显示, 无法触发循环也无法自动结束'],
      16:['    过渡帧动画, 依据帧序打开关系面板设置过渡关系\r\r    必须是 过渡帧动画 类型, 且不能帧序个数至少有2帧才允许建立过渡关系'],
      17:['    设置播放执行循序,  以","英文逗号进行分隔, ","分隔数值为下方帧列表的顺位id值\r\r    如:0,3,2,1(先显示0帧画面,接着3,再然后2,最后1. 如果是循环的此时则会回到开头)\r\r    注意:当复制,添加或删除帧后, 实际帧id对应的画面会发生变化, 请注意相应变化进行修改..'],
      18:['    删除演示区中选择的图片\r\r    注意:该操作同时若存在过渡关系, 需要重新编辑'],
      19:['    删除帧列表中选中的帧\r\r    注意:会删除选中帧的所有数据\r\r    注意:该操作会导致帧列表的顺位id发生变化,  已设置的帧序需要进行相应的修改; 同时若存在过渡关系, 需全部重新编辑'],
      20:['    创建新帧, 会复制当前帧列表中已选中的帧数据, 并插入其后位置\r\r    注意:该操作会导致帧列表的顺位id发生变化,  已设置的帧序需要进行相应的修改; 同时若存在过渡关系, 需全部重新编辑'],
      21:['    播放或暂停帧动画\r\r    备注:会依据帧序中的设定值进行播放. 如:帧序值设定值为0,1,2,1,0则会按照该顺序执行播放, ","逗号为英文分隔符, 且分隔值与下方的帧列表顺位id一一对应'],
      22:['    当前帧的顺位id \r\r    备注:若之前有插入或删除帧操作, 会导致当前帧的顺序id发生变更, 因此相应的帧序和过渡关系需要进行重新设定'],
      23:['    当前帧的显示时间 \r\r    备注:显示时间会影响视觉效果, 动画是否连贯等, 需进行合理微调. 其次过渡动画内的过渡元素也依据此值进行计算'],
      24:['    帧序播放列表, 红色标记当前正在编辑的帧'],
      25:['    当前帧在帧序中的索引'],
      26:['    下一帧在帧序中的索引'],
      27:['    上演示区 - 当前显示中的动画帧\r\r    左键单击选择演示区内的图片, 同时点击 下演示区 内的对应元素, 则可以建立对应的过渡关系, 右键取消关系\r\r    提示:对于重叠被遮挡元素, 可在右侧列表中选择, 操作方式相同'],
      28:['    下演示区 - 即将显示的动画帧\r\r    建立过渡关系, 需先点击上演示区内的目标, 若要取消关系也是在上演示区内右键取消'],
      29:['    前一帧'],
      30:['    下一帧'],
        
}
//鼠标悬浮提示 ~~~~
scbj_.addEventListener('mouseover',function(e){
    if(openF===0)return;//功能区未起作用
    var a=e.target,b,c;
        b=a.getAttribute('tip');
        if(b){
            c=ts[b];
            if(c)tipFun(c[0],c[1]);
        };       
});


})();


})();