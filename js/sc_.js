/* 素材相关 */

(function(){
var hCache=document.getElementById('html_cache');    
var qF=1; //允许请求,防止反复无效请求   
var mlList={//储存 已访问目录路径
    //pth:[], 根据路径记录数据 
};

//允许访问获取的支持的文件类型
var aliow={
     'png':1,
     'mp3':2,
     'wav':2,
     'm4a':2,
     'ogg':2,
     'aac':2,
};

var ajax=function(n,data,v){//  v层级 +1 或-1
      var m,order;
          m=['read_ml','source'];//0:(获取目录),1:素材移动
          order=m[n];
        $_ajax({
            type:'post',
            dataType:'json',
            url:'?'+order,  //read_sc (读取源素材目录)
            data:{ 
                data:data, //  n=>0:path 1:{old:'path',new:'path'}
            },
            success:function(d){
               if(n===0){//读取源目录  成功 
                    var i=0,l=d.length,ml=[{src:'',t:-1}],img=[],a,c,b,e;  //-1 用作标记返回目录
                        while(i<l){
                            c=d[i];
                            a=c.split('.');
                            if(a.length===1){//单个的统一默认为 目录
                                    ml.push({src:'',path:c,t:0});//0文件夹的意思  
                            }else if(aliow[a[1]]!==undefined){//判断是否为支持文件类型
                                    b=aliow[a[1]];//1:png图,2:音频
                                    img.push({src:'',path:c,t:b});
                            };
                            i++;
                        };
                        
                        pathN+=v;// 当前层级 base1 ,base2 (基于前者), base3(基于前者)
                        path[pathN]=data; //目录层级 (用于确定进度)
                        ml=ml.concat(img);
                        mlList[data]=reNew(ml);//根据路径记录数据
                        app.source=ml;
                        if(pathN===0)G_cfg.project.source=data; //记录本次源目录 (只记录根目录)
                }else if(n===1){//素材移动成功

                         gFun.dataHb(data);//将数据 模板内 临时保存在nowData ,同时更新已处理文件

                };
                //    
                qF=1;//请求完成
            },
            error:function(d){
                if(n===0){//读取目录
                    if(pathN===-1){//全新的请求地址下 ,清空所有缓存
                        app.source=[];//清空列表
                        mlList={};
                        path=[];
                        tipFun('请检查 目录文件夹路径 是否正确 !!!',1);
                    }else{
                        mlList[data]=1;// 当前子路径是错误的,非文件夹
                        tipFun('非文件夹,无法进入!',1);
                    };
                }else if(n===1){//素材移动失败
                    tipFun('素材移动失败!',1);
                    dragData=null;
                };
                //
                qF=1;//请求完成
            }
        });
};
var  pathN=-1; //-1就是没有层级的意思
var  path=[]; //层级路径  basePath, childPath..... (通过这种方式判断层级)
var  sc_=document.getElementById('sc_');//整个素材区
var  sc_close=sc_.getElementsByClassName('ui_bt_close')[0];//点击关闭 整个素材区 
var  sc_input=sc_.getElementsByClassName('sc_path')[0]; // path路径input
var  sc_path_btn=sc_.getElementsByClassName('sc_path_button')[0]; // 路径点击获取 文件列表

     G_cz.dom.sc_path=sc_input;//G_cfg.dom 赋值 Input dom

//点击 关闭 sc_ (整个素材区 , 同时将以分类数据 保存到G_cfg)
sc_close.onclick=function(){
   sc_.style.display='none';
   gFun.destroy();
};

//读取 素材源路径
sc_path_btn.onclick=function(){
    var a,b,c,d;
        a=sc_input.value.trim();
        
        if(a&&qF===1){
            b=e=/^[a-zA-Z]:(([a-zA-Z]*)||([a-zA-Z]*\\))*/; 
            if(b.test(a)){
                path=[],mlList=[],pathN=-1; //初次通过 value 路径获取,清空目录
                a=a.replace(/\\/g,'/');
                sc_input.value='';
                qF=0;
                ajax(0,a,1);
            }else{
                tipFun('请检查 文件夹目录路径是否正确 !!!',1);
            };   
        };
};

//查重复文件名 (大类查大类,子类查对应子类)
var checkCf=function(n1,n2){ //大类名字或id,子类名字
    var a,b,c,d,e,f,g,h,i,j,k,l,m,n,u;
        a=app.treeF;
        if(n2!==u){
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
};
var pIndex=-1,zIndex=-1; //用于创建 删除 类目时查找对象, -1 为无
var tpIdrr,ypIdrr; //图片,音频  用于id查重  连续禁止重复
var nowData;//当前作用域复制的 图片数据{ 主目录:{子目录:{},....},.....}  (用于最后赋值到g_cfg)
var xmPath='';//项目储存路径
var cId=-1; //图片路径 ? 后+的非重复值,防止(同名缓存)
//公用方法
var gFun={
     p_old:'', //之前选中的那个 整个 大类框
     z_old:'',// 子目录 框
     xz_path:'',// (e-id=xz_path)的dom目标
     cache:null,// app的cache域 ,destroy 销毁时,判断去除边框, 销毁缓存dom 和数据
     //处理 目录 选择的 边框选中效果
     fun:function(obj,n){ //n:选中大类,1:删除大类(去框),2:选择子类3:删除子类(去框)
          var t=this,o;
            o=n<2?t.p_old:t.z_old;  
            // debugger
            if(o){
                if((n&1)===0&&o===obj)return; //偶数 相同不必重复设置  , 奇数删除
                o.style.border='';
            };
            if((n&1)===0){ //偶数选择 0:大类,2子类
                t[n===0?'p_old':'z_old']=obj;
            }else{ //删除 1:大类,3:子类
                if(n===1){//删除大类
                   t.p_old='';
                   pIndex=-1;
                   zIndex=-1; //大类删除,子类理应删除
                }else{//3 删除子类
                   t.z_old='' 
                   zIndex=-1;
                };
                t.fun2();//
                return;  
            };
            obj.style.border='1px solid '+(n<2?'red':'black');
            if(n<2){
                if(n===0){}
                    pIndex=obj.children[0].getAttribute('index')<<0;
                    zIndex=-1;//欣慰选了新的大类 ,zIndex重置
                    app.data=[]//清空已拖拽列表 (因为点击大类,不会指向zIndex, 会找不到对象)
                ;
            }else{
                pIndex=obj.getAttribute('pIndex')<<0;
                zIndex=obj.getAttribute('index')<<0;
            };
            t.fun2();//
     },
     //处理 选中目录的路径 (e-id=xz_path)的dom目标 ,(同时处理路径显示数据)
     fun2:function(){
         var t=this,a=app.treeF,b='',c,d,v,n1,n2;
              if(pIndex>-1){
                  a=a[pIndex];
                  n1=a.name;
                  b+=n1;
                  if(zIndex>-1){
                      a=a.child[zIndex];
                      n2=a.name;
                      b+=' / '+n2;
                      t.fun3(n1,n2);
                  };
              };
              t.xz_path.value=b;
     },
     //处理  文件路径 显示的已编辑资源列表
     fun3:function(n1,n2){
          var a,b,c,d=[],e,f,g,h,k;
              a=nowData[n1]; 
              if(a){
                  a=a[n2]; //主目录=>子目录 {id:{id:id,src:src(基于xmPath+src(src=xx.png或xx.音)),t:类型(1图2audio) ,size:[w,h](图特有) }}
                  for(k in a){
                      b=a[k];
                      d.push({
                          id:b.id,
                          src:'./|'+xmPath+(b.t===1?'/img/':'/audio/')+b.src,
                          t:b.t,
                          size:[b.size[0],b.size[1]]
                      });
                  };
              };
              app.data=d;
     },
     //拖拽数据 暂时赋值 到 nowData, 关闭面板后 nowData会被赋值到 G_cfg.img_tree.data;
     dataHb:function(data){
         var a=nowData,b,c,d,e,f=1,g,u;
             b=app.treeF[pIndex];
             if(b){
                a=a[b.name];
                b=b.child[zIndex];
                if(b){
                    f=0;
                    a=a[b.name];
                    a[dragData.id]=dragData;
                    //更新显示列表
                    a=dragData;
                    cId++;
                    app.data.push({id:a.id,src:'./|'+data.new+'?'+cId,t:a.t,size:a.size?[a.size[0],a.size[1]]:u});//更行拖拽区显示列表  (?防止同名缓存)
                    app.data='update';
                };
             };
             dragData=null; 
             if(f===1){
                 tipFun('数据异常 ,无法保存,\r请检查文件 选择目录是否为子目录, 项目文件是否遭到破坏',1);
             };
     },
     //获取 img 或 音频  的顺位补缺 id
     getId:function(n){ //1:图 2:音频
          var a,b,c,d,e,f,g,h,i=0,l,u;
              a=n===1?tpIdrr:ypIdrr;
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
     //打开面板初始化
     init:function(){
         var a=G_cfg.img_tree,b,c,d,e,f,k,v,o;
             hCache.content='no-cache';//设置浏览器禁止缓存 (防止 图片编辑自动生成的同id 资源 ,显示旧的)
             mlList={};//清处缓存的 素材源 路径
             tpIdrr=reNew(a.tpId);//查重 img id
             ypIdrr=reNew(a.ypId);//查看 yp id
             //生成 app.treeF的数据
             a=a.data,d=[];
             nowData=reNew(a);
            //  say(nowData)
             for(k in a){
                 c=a[k];
                 b={name:k,show:false};
                 e=[];
                 for(v in c){
                     e.push({name:v});
                     o=c[v];
                 };
                 b.child=e;//
                 d.push(b);
             };
             app.treeF=d;
             xmPath=G_cfg.project.path;//项目所在路径
     },
     //关闭面板 销毁缓存对象, 并在G_cfg.img_tree.data 上赋值 nowData
     destroy:function(){
        var t=this,a,g=G_cfg.img_tree;
            hCache.content=''; //关闭后允许缓存
            t.p_old='',t.z_old='';   
            pIndex=-1,zIndex=-1;
            g.data=nowData;
            g.tpId=tpIdrr;
            g.ypId=ypIdrr;
            // a=t.xz_img_yp
            dragData=null,nowData=null,tpIdrr=null,ypIdrr=null;
            //清空 app 的cache域
            a=t.cache;
            a.xz_d=null;
            a.xz_dom=null;
            a.xz_img-null
            //复制数据到 G_cfg ,然后清空自身 (数据要转化一下)
    },
};

var dragData=null; // 移动拖拽 的 数据, (移动成功,推入 app.data[], 同时保存到noData  ) {..src:'此处仅文件名'..}

G_cz.fun.sc_0=gFun;//赋值外部 调用方法
var app=new Eng({
       el:'sc_',
       cache:{
           xz_d:'', // 拖拽选择的目标data   {src:'',pth:'',t:''}
           xz_dom:'',//拖拽选择的目标 dom
           xz_img:null,//已编辑的图片 选中状态 (用于 删除 )
       },
       data:{
           //源素材列表 (img + audio)
           source:[
               /* {
                   src:'',//显示图路径
                   pth:'',//原始路径
                   t:'', //文件类型  -1:返回上层 0:文件夹 1:img 或 2:audio 
               } */
           ], 
           //文件分类目录列表
           treeF:[
               /* {  name:'', //主目录
                     show:false,//  false:初始隐藏二级目录  show 影响 state
                     state:'＋', // 默认 + (提示展开)
                     child:[ //二级目录
                        {name:''}
                     ]
                 }*/
            //   {name:123,show:true,child:[{name:3334,},{name:456},{name:1234},{name:98653}]},
            //   {name:442,show:false,child:[{name:7834},{name:226},{name:34},{name:3453}]},
           ], 
           //已拖拽分类 图片数据
           data:[
                /* {
                    id:id, //资源id === key {this}
                    src:'',//显示图路径 (此处为 所在   项目path/img/id.png)
                    t:'', //文件类型  1:img 或 2:audio
                    size:[w,h]
                } */
           ]  
       },
       watcher:{
           
       },
       watcherFor:{
           //素材源 视图列表  
           source:function(items ,cache){
                var a,b,c,d,e,f,g,h,i=0,l;
                    a=items.$_data;
                    b=a.t;
                    if(b===1){// png图片
                        a.src='./|'+path[pathN]+'/'+a.path;
                        a.drag=true;//允许拖拽
                    }else if(b===2){//audio
                        a.src='../img/功能小图标/音乐.png';
                        a.drag=true;//允许拖拽
                    }else if(b===0){//文件夹 (双击进入下层)
                        a.src='../img/功能小图标/进入.png';
                        a.drag=false;//禁止拖拽
                    }else if(b===-1){//返回上层目录
                        a.src='../img/功能小图标/返回.png';
                        a.drag=false;//禁止拖拽
                    };
           },
           //树目录
           treeF:function(items ,cache){
                var a,b,c,d,e,f,g,h,i=0,l;
                    a=items.$_data;
                    b=a.show;
                    if(b===true){//展开
                        a.state='━';
                    }else{//收缩状态
                        a.state='+';
                    }; 
           },
           //treeF:的子for 目录
           child:function(i,c){
                var a,b,d,e,f,g,h,l;
                   a=i.$_data;
                   b=i.$_pos[0]; //父元素下标
                   a.pIndex=b;
           },
           //
       },
       event:{
           //提示 => 创建 大类 ,子类 删除 提示  onmousehover
           ts_0:function(){
                var t=this,d=t.$_data,i=t.$_items,a,b,c,u,index;
                    a=t.textContent.trim();
                    if(a==='创主目录'){
                        tipFun('创建 素材分类 主目录\r注意: 所有 主目录 必须建立 子目录, 图片和音频资源只能放置于子目录');
                    }else if(a==='创子目录'){
                        tipFun('创建 素材分类 子目录\r注意: 图片和音频资源只能放置于 子目录');
                    }else if(a==='删除选中'){
                        tipFun('双击 删除 选中目录\r注意: 必须先删光 子目录, 才允许删除主目录',1);
                    }else{//删除素材
                        tipFun('双击 删除 下方已选中的素材',1);
                    };
           },
           //进入文件夹下一层 ,或返回上一层 (首位置是返回)
           inOrBakFile:function(){
                var t=this,d=t.$_data,p=d.path,a,c,u,index;
                    if(pathN<0)return; //基础目录不存在
                    index=t.getAttribute('index');
                    if(index==='0'){//返回上一级
                        if(pathN===0)return; //根目录无法继续向上
                        pathN--;
                        c=mlList[path[pathN]];//
                        app.source=reNew(c);
                        return; //
                    };
                    a=path[pathN]+'/'+p; //待请求目录
                    c=mlList[a];
                    if(c===u){//该目录还未访问过 ,请求
                        ajax(0,a,1);
                    }else if(c===1){ //错误目录 ,不响应
                        return;
                    }else{//已存在的 缓存请求 
                        pathN++;
                        path[pathN]=a; 
                        app.source=reNew(c);
                    };
           },
           //2级列表 展开 或 收缩
           shouFang:function(){
                 var t=this,d=t.$_data,i=t.$_items,a,b,c,u,f,index;
                  //'＋','━'
                    f=d.show;
                    d.show=f?false:true; 
                    t.textContent=f?'＋':'━';
           },
           //创建 主目录 - 文件树
           add_dl:function(){
                 var t=this,g=t.$_gData,d=t.$_data,i=t.$_items,a,b,c,f, u,index;
                        b=i.flie_name.value.trim(); //新建文件名
                        i.flie_name.value='';
                        c=/[\\/:*?"<>|]/;
                        if(b===''||c.test(b)){
                        tipFun('违规命名 !! \r不允许包含\\/:*?"<>|',1) 
                        return;
                        };
                        //查重
                        f=checkCf(b);
                        if(f){//大类名 重复了
                            tipFun('主目录 命名 存在重复!!',1) 
                            return;
                        };
                        //创建
                        // {name:b,show:true,child:[]}  //默认展开
                        // pIndex=g.treeF.length; //创建即为当前
                        a=reNew(g.treeF);
                        a.push({name:b,show:true,child:[]});
                        g.treeF=a;
                        //下面两行注释掉,自己去手选 新的主目录
                        // pIndex=a.length-1; //新建 主目录设置为最后一个
                        // zIndex=-1; // 子选项设置为无
                        gFun.fun2(); //显示新的目录路径
                        //nowData 增加主目录
                        nowData[b]={};

           },
           //创建 子目录 - 文件树
           add_zl:function(){
                 var t=this,g=t.$_gData,d=t.$_data,i=t.$_items,a,b,c,u,index;
                        if(pIndex<0)return; //没有选中的主目录
                        b=i.flie_name.value.trim(); //新建文件名
                        i.flie_name.value='';
                        c=/[\\/:*?"<>|]/;
                        if(b===''||c.test(b)){
                            tipFun('违规命名 !! \r不允许包含\\/:*?"<>|',1) 
                            return;
                        };
                        //查重
                        f=checkCf(pIndex,b);
                        if(f){//大类名 重复了
                            tipFun('子目录 命名 存在重复!!',1) 
                            return;
                        };
                        a=g.treeF[pIndex];
                        a.child.push({name:b});
                        nowData[a.name][b]={};//建立子目录
                        a.child='update';
           },
           //删除选 目录类 (必须先删光子类才可以删除大类)
           del_xz:function(){
                  var t=this,g=t.$_gData,d=t.$_data,i=t.$_items,a,b,c,u,index;
                      if(zIndex>-1){//有选中 删除子目录
                            a=confirm("再次确认是否需要删除此类目?\r注意: 其下所有文件将会一并删除 , 且不可撤销!!!");
                            if(!a)return; //false不删除,返回
                            a=g.treeF[pIndex];
                            a.child.splice(zIndex,1);
                            a.child='update';
                            gFun.fun(t,3);//删除子类
                      }else if(pIndex>-1){//删除 主目录,
                           if(g.treeF[pIndex].child.length===0){//子目录清空 才允许删除主目录
                                a=confirm("再次确认是否需要删除此类目?\r注意: 其下所有文件将会一并删除 , 且不可撤销!!!");
                                if(!a)return; //false不删除,返回
                               //此操作 因为 splice 竟然会生效!! 可能是因为 子子 for的原因,  
                                b=reNew(g.treeF);
                                b.splice(pIndex,1);

                                g.treeF=b;
                                gFun.fun(t,1);//删除大类
                           };    
                      };

           },
           //选中 大类目录
           sz_dl:function(){
                   gFun.fun(this.parentNode,0);//选中大类
           },
           //选中 子类目录
           sz_zl:function(e){
                var t=this,c=t.$_cache,a,b,d,f,g;
                     a=c.xz_img;
                    if(a)a.style.border='';//切换路径,取消选中已编辑
                    gFun.fun(t,2);//选中子类
                    e.stopPropagation(); //直接命中 子目录,防止传递到sz_dl()! 因为会清除子选择 zIndex
           },
           //拖拽开始 (从上方素材源 )
           dragStart:function(){
                 var t=this,d=t.$_data,c=t.$_cache,a,b,e,f,g;
                    //  say('start')
                     if(d.t===1||d.t===2){// 1:图片,2:audio
                         c.xz_d=d;
                         c.xz_dom=t;
                     };
           },
           //拖拽放置到目录时 (判断是否为 子目录路径 )
           dragDrop:function(e){
            var t=this,i=t.$_items,c=t.$_cache,a,b,o,img, f,g,p,p2,id,name,w,h;
                //    say('drop')
                   o=c.xz_d;//{src:'./|a-z:....',t:(1图,2音)}
                   if(!o)return;//没有拖拽数据
                   a=i.xz_path.value;//当前路径目录
                   b=a.split('/');
                   if(b.length===2){// 是 完整的 主子 目录
                         a=a.replace(/ /g,'');
                        //  say(a);
                         a=a.split('/');// ['主目录','子目录']
                        //  say(o); //{src:'',path:'等文件名',t:(1图.2音) }
                         img=c.xz_dom;//img dom
                         id=gFun.getId(o.t);//顺位补缺 id
                         name=id+'.'+o.path.split('.')[1];//新命名,不改变类型

                         //p:oldPath , p2:newPath  
                         p=o.src.split('|')[1]; //源 绝对路径
                         p2=xmPath+(o.t==1?'/img/':'/audio/')+name; //新路径+/img/+id名

                         ajax(1,{old:p,new:p2});//通知 后端移动复制 源数据
                        //  say(p),say(p2);
                         g={
                             id:id,
                             src:name,
                             t:o.t,
                         };
                         if(o.t===1){//图片
                            g.size=[img.naturalWidth,img.naturalHeight]; //设置图片 自然 宽高
                         };
                         c.xz_d='',c.xz_dom=''; //清空选中数据
                         dragData=g;//供ajax 内调用判断
                        //  debugger;
                   }else{//
                       tipFun('仅能拖拽到 已选定 的子目录中!!',1);
                   };
           },
           //选中 已编辑 目录列表的 图或音频 对象( 用于标记删除 )
           xz_img:function(){
               var t=this,d=t.$_data,g=t.$_gData,c=t.$_cache,a,b,e,f,h,i,j,k;
                   a=c.xz_img;
                   if(a)a.style.border='';
                    t.style.border='1px solid red';
                    c.xz_img=t;

           },
           //删除 已编辑的素材 (图片或音频)
           del_img_yp:function(){
            var t=this,g=t.$_gData,c=t.$_cache,a,d,b,e,f,h,i,j,k;
                 a=c.xz_img;
                 if(a){
                     a.style.border='';//去除选中边框
                     c.xz_img=null;
                     d=a.$_data;//
                     i=g.data.indexOf(d);//数据所在索引
                     if(i>-1){
                            j=d.t,k=d.id;// 类型,id
                            g.data.splice(i,1);//删除
                            g.data='update'; //更新显示
                            a=g.treeF[pIndex];
                            b=a.name; //主目录名
                            a=a.child[zIndex].name; //子目录名

                            e=j===1?tpIdrr:ypIdrr; //id 目录
                            i=e.indexOf(k);
                            if(i>-1)e.splice(i,1);//id目录 中删除
                            delete nowData[b][a][k]; //从now data中删除

                     }

                 } 
           },

       },
       created:function(items , cache){
               // 赋值 dom 供qhMb调用
               gFun.xz_path=items.xz_path;
               gFun.cache=cache; //app 的cache 作用域

               //拖拽进入阻止浏览器默认行为
               items.sc_prevent.ondragover=function(e){
                  e.preventDefault();
              };

       }
});
// say(app);
// gFun.init() ;//test 初始化^^^^^^^^^^^^^^^^^^^^^^^^^^^^

})();
