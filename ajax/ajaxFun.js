
/* 
当前工具 服务端 ajax命令响应的方法列巴
*/
var say=console.log;
var fs=require('./fileTool.js').fs;
var PATH_tool= require('path');
var base=process.cwd()+'/'; //基础工作目录路径
//将路径中的 \转为/ ,防止出错
var PATH=function(str){
	return PATH_tool.resolve(str).replace(/\\/g,'/');
};
//基本的  DreamBuilder.json 配置
// var dbCfg={
//       name:"",//项目名称
//       path:"",//基础路径
//       source:"",//素材源, 原始素材获取目录
// };

//ajax请求成功 (状态或数据响应) 
var ajaxRes=function(res , data){
        if(!data)data={msg:'成功'};
        res.writeHead(200,{'Content-Type':'json'});
        if(typeof(data)!=='string')data=JSON.stringify(data);
        res.write(data); //只能写入 string类型 
        res.end();

        //ajaxRes(res,data)
};
//ajax请求失败 (数据获取不到等)
var ajaxFail=function(res){
      res.writeHead(404);
      res.end();

      //ajaxFail(res); //错误不响应请求
};
//错误处理 , 行内写法 
var errDefault=function(err,res){
      try {
          throw err;
      } catch (error) {
          ajaxFail(res);
      };
      /* 调用写法
         if(err){
               errDefault(err,res);
               return;
         };
      */
};
var projectList={//全部项目列表 (以创建的),
   //   '项目名':{
   //         path:'项目路径'
   //   },
};
//
var nowPth={//正在使用的项目信息, 用于存储时正确查找文件位置
     //name:'项目名称'
     //path:'项目路径',
}; 
var ajaxFun={
    //query命令
    //测试本方法正确执行,首次加载时
    'test':function(res,data){
           console.log('ajax 对应项目配置, 测试调用成功')
        //    ajaxRes(res);
     },
     //初始化默认 读取项目目录  (读取 根目录 project_data 下的 DreamBuilder.json ) (建立默认文件,不存在的话)
     'init':function(res,data){
      var a,b,c,d,e; 
         // say('init')
          fs.checkF('./project_data/DreamBuilder.json',function(err){
               if(err){//文件目录不存在
                    fs.mkPthF('./project_data/DreamBuilder.json','{}',function(){
                                 if(err){
                                    errDefault(err,res);
                                    return;
                              };
                    });
                    ajaxFail(res); 
               }else{//读取并返回
                    fs.readF('./project_data/DreamBuilder.json',function(err,data){
                           if(err){
                              errDefault(err,res);
                              return;
                           };
                           var a,b,c,d=[],e,k;
                             a=data.toString();
                             a=JSON.parse(a);
                             projectList=a;//当前已经建立的项目
                             //转为 [{name:'',path:''}] 格式发往前端
                             for(k in a){
                                b=a[k];
                                d.push({
                                      name:k,
                                      path:b.path,
                                      source:b.source
                                });
                             };
                           ajaxRes(res,d);
                    });
               };
          });
     },
     //项目存储    存储到 项目 所在目录的 game.json
     'save':function(res,data){
         var a,b,c,d,e; 
             a=data.data; //{path:path,data:data}
             
            fs.writeF(a.path+'/game.json',JSON.stringify(a.data),function(err){
                  if(err){
                     errDefault(err,res);
                     return;
                  };
                  ajaxRes(res);
           });
     },
     //获取文件目录  (主要用作读取源 数据目录)
     'read_ml':function(res,data){
         var a,b,c,d,e; 
             a=data.data; //目录路径
             fs.checkF(a,function(err){
               if(err){//文件目录不存在
                     errDefault(err,res);
                     return;
               }else{//读取并返回
                     fs.readDir(a,function(err,files){
                           if(err){
                              errDefault(err,res);
                              return;
                           };
                           ajaxRes(res,files);
                     });
               };
          });


     },
     //读取 选中的 项目数据
     'read_xm':function(res,data){
          var a,b,c,d,e; 
              a=data.data; //{path:path,name:name}
              if(a){
                  fs.readF(a.path+'/game.json',function(err,data){
                        if(err){
                           errDefault(err,res);
                           return;
                        };
                        nowPth=a;
                        ajaxRes(res,data.toString());
                  });
             }else{
                 ajaxFail(res);
             };
     },
     //新项目创建  (记录到DreamBuilder.json , 同时项目目录建立配置信息 )
     'new_xm':function(res,data){
            var a,b,c,d,e; 
               a=data.data; //命令  ( 路径)
               b=a.name;//项目名称
               c=a.path;//项目目录
               d=a.data;//项目目录下的默认配置
               fs.checkF(c,function(err){
                  if(err){//存储路径不存在,(储存失败,要么是初次启动未正确创建基础目录文件, 要么就是中途被删除了)
                        ajaxFail(res);
                        return;
                  }else{//储存项目
                        projectList[b]={path:c,source:''};
                        //记录当前项目位置, 因为创建 即 启用
                        nowPth.name=b;
                        nowPth.path=c;
                        fs.writeF('./project_data/DreamBuilder.json',JSON.stringify(projectList),function(err){
                                 if(err){
                                    errDefault(err,res);
                                    return;
                                 };
                                 ajaxRes(res);
                                 //创建 项目path 目录里的 基础文件目录 img 下的
                                 var arr=['img','audio','map'],l=arr.length,dd;
                                    while(l--){
                                       dd=arr[l];
                                       fs.mkPthF(nowPth.path+'/'+dd,null,function(){});// 
                                    };
                                 //创建 项目path 目录下的 game.json; (此处初始数据)   
                                 fs.writeF(c+'/'+'game.json',JSON.stringify(d),function(err){});
                        });

                  };
               });
     },
     //删除项目  (前端读取失败,即删除)
     'del_xm':function(res,data){
      var a,b,c,d,e; 
          a=data.data; //项目名
         //  say('删除项目 => '+a);
          delete projectList[a];
          fs.writeF('./project_data/DreamBuilder.json',JSON.stringify(projectList),function(err){
                  if(err){
                     errDefault(err,res);
                     return;
                  };
                  ajaxRes(res);
         });
     },
     //数据源  (图片,音频复制移动并重命名)_
     'source':function(res,data){
      var a,b,c,d,e,old,New; 
           a=data.data; //{old:源路径,new:新路径}
           old=a.old;
           New=a.new;
         //   say(a);
           fs.moveF(old,New,function(err){
                  if(err){
                     // console.log(err);
                     errDefault(err,res);
                     return;
                  };
                  ajaxRes(res);
           });
     },
     //地图数据 增 删 查 
     'map_cz':function(res,data){
      var a,b,c,d,e,old,New; 
          a=data.data; //
          /* 
            a={t:n,//0:读,1:存,2:删
               pth:p,//数据路径
               id:id,//mapId
               d:d,  //map数据
            };
         */
               b=a.t;
               c=a.pth;
               d=a.id;
               e=a.d;
               // say(b,c,d);
               //errDefault(err,res);
               //ajaxRes(res);
                  if(b===0){//读地图数据
                     fs.readF(c+'/map/'+d,function(err,data){
                              if(err){
                                 // throw err;
                                 errDefault(err,res);
                                 return;
                              };
                              ajaxRes(res,data.toString());
                     });
                  }else if(b===1){//存地图数据
                     fs.writeF(c+'/map/'+d,JSON.stringify(e),function(err){
                              if(err){
                                 errDefault(err,res);
                                 return;
                              };
                              ajaxRes(res);
                     });
                  }else{//2删除地图数据
                     fs.delFile(c+'/map/'+d,function(err){
                           if(err){
                              errDefault(err,res);
                              return;
                           };
                           ajaxRes(res);
                     });
                  };
     }
};
// ajaxFun.init(); //debug 测试用
exports.ajaxFun=ajaxFun;