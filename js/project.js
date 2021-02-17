/* 
初始登录界面 操作相关

*/


(function(){
var project=document.getElementById('project');    
var qF=1;//0:请求中 1:请求毕
var listData={};//项目列表已经存在的
var ajax=function(n,data){// 
         var m=['init','new_xm','read_xm','del_xm'],o,ddd;
             o=m[n];//命令   //n=>0:初始读取 项目目录文件,若无创建, 1:存储新项目信息 ,2:读取完整项目信息,3:删除读取失败的项目
             if(n===1){//新项目 目录的初始 配置内容
                    ddd={
                        project:{
                                name:data.name,    //项目名称
                                path:data.path,    //项目路径
                                source:data.source //素材源  (记录最近的一个)
                        }, 
                        img:{},
                        img_tree:{tpId:[],ypId:[],data:{'地图':{'水面':{},'土地':{},'草地':{},'地板':{}},'建筑':{'外墙':{},'内墙':{},'屋顶':{},'窗户':{},'装饰':{}},'树木':{'普通':{},'枯树':{},'果树':{}},'植物':{'草':{},'花':{},'灌木':{}},'NPC':{'玩家':{},'居民':{},'动物':{},'怪物':{},'特殊':{}},'技能':{'魔法':{},'特效':{}},'物品':{'装备':{},'武器':{},'果实':{},'食物':{},'饮料':{},'材料':{}},'数值':{'数字':{},'字符':{}},'特殊':{'合成素材0':{},'合成素材1':{}}}},
                        img_pj_dh:{id:[],ml_tree:{},id_data:{}},audio:{},logic:{},ui:[],event:{},
                        map:{id:[]},
                    };
                    data.data=ddd;
             };
                $_ajax({
                    type:'post',
                    dataType:'json',
                    url:'?'+o, 
                    data:{ 
                        data:data, 
                    },
                    success:function(d){
                        if(n===1){//新项目 建立 成功 (新创建,然后关闭 项目面板进入开发, 同时赋值全局当前项目信息)
                              //因为是新建 所以使用 dd 数据,
                              G_cfg=ddd;
                              //关闭项目面板  
                              project.style.display='none';
                        }else if(n===0){//读取 项目目录 成功
                             //[{...},..]
                              app.project=d;;//赋值项目列表
                        }else if(n===2){//2 读取 项目数据成功  (选择项目后)
                                G_cfg=d;
                                //关闭项目面板  
                                project.style.display='none';
                                G_cz.init();//加载依赖项目数据的 js
                        }else{//3 失败项目删除成功

                        };
                        qF=1;//请求完成
                    },
                    error:function(d){
                            if(n===1){//存储项目失败
                                  tipFun('项目创建失败!!\r请仔细检查项目名称是否合法, 存储路径是否已经创建',1);
                            }else if(n===0){//init 读取项目目录失败 (基础文件未创建, 初次启动会后台创建)
                              
                            }else if(n===2){//读取 项目数据 失败  (失败后删除项目)
                                var a=app.project.splice(index,1)[0].name;  //删除读取失败的项目,并记录项目名
                                    app.project='update'; //更新
                                    ajax(3,a);//通知后面删除
                                    tipFun('项目数据读取失败!!!\r或损坏',1);  
                            }else{//3 删除失败

                            };
                            qF=1;//请求完成
                    }
                });
};
    ajax(0); //获取项目目录 (初始化请求)
var name,path;
var index;//选中打开项目的索引
var app=new Eng({
      el:'project',
      data:{
        project:[
            /* {
               name:'',//项目名称
               path:'',//项目储存文件夹路径 
            } */
        ],
      },
      event:{
        //创建新项目  
        create:function(){
            var t=this,i=t.$_items,c=t.$_cache,g=t.$_gData,d=t.$_data,a,b,c,e,f,h,j,k;
                a=i.name; //项目名称
                b=i.path; //项目路径
                name=a.value.trim();
                path=b.value.trim();
                 e=/^[a-zA-Z]:(([a-zA-Z]*)||([a-zA-Z]*\\))*/; //路径验证
                 f=/[\\/:*?"<>|]/;//检验文件夹 名字是否合法,中间为不允许出现的字符
                if(e.test(path)&&name!==''&&!f.test(name)){
                    qF=0;//ajax请求中
                    path=path.replace(/\\/g,'/');
                    c={name:name,path:path,source:''};
                    ajax(1,c);//创建新项目
                }else{
                    tipFun('非法的文件名 或 储存路径!!!',1);
                };
                a.value='',b.value='';//清空创建目录
        },
        //双击选择已有项目 (记录读取记录完整项目信息 ,同时关闭项目面板)
        select_xm:function(){
                if(qF===0)return; //ajax请求中 ,禁止反复请求
            var t=this,i=t.$_items,c=t.$_cache,g=t.$_gData,d=t.$_data,a;
                index=g.project.indexOf(d);//选中的索引
                a={
                   path:d.path,
                   name:d.name 
                },
                ajax(2,a); //请求项目 数据  
        },


      },
      created:function(items , cache ){
           
      }
});


//test 自动请求 test 目录,延迟300毫秒  (后期删除)
setTimeout(function(){
  ajax(2,{name:'test',path:'E:/test'});
},300);

})();