var fs=require('fs');
var PATH_tool= require('path');
var f={};
var say=console.log;
/* var o={
	clear:function(s){ //s:存在 单独 ,不存在 清除所有
	  var k;
		if(s){ delete o[s];return;};
		for(k in o){
			if(k!='clear') delete o[k];
		  };
	   
	}
}; */
/* 
例子
var s=1;
s++; //每次执行++ 防止重复
o[s]=function(err,data){
};
fs.readF(path,s);	

*/
//返回绝对路径, 并且将 \ 改为 / 防止出错
var PATH=function(str){
	return PATH_tool.resolve(str).replace(/\\/g,'/');
};

//读取指定文件(不适宜大文件)
f.readF=function(path,cB){//1
	   fs.readFile(path,function(err,data){
	   	    //   if(err)throw err;
			    cB(err,data);
	   });
};
//读取 文件列表
f.readDir=function(path,cB){//2
	    //检查是否为文件目录
		fs.stat(path,function(err,stats){
			   if(err){
				  cB(err);
				  return;
			   };
			   if(stats.isDirectory()){//是文件目录
					fs.readdir(path,function(err,files){
						cB(err,files);
					});
			   };
		});
	    
};
//写入文件
f.writeF=function(path,data,cB){//3
	   fs.writeFile(path,data,function(err){
			  cB(err);
	   });
}
//创建文件夹 (在现有目录)
f.mkDir=function(path,cB){//4
		fs.mkdir(path,function(err){
				cB(err); 
		});
};
//是否为 普通文件 (无必要时, 用f.checkF 检查目标是否存在)
f.isFile=function(path,cB){//5
	      fs.stat(path,function(err,stats){
				//stats.isDirectory() 是否为目录
				//stats.isFile()   是否为普通文件
				cB(err,stats.isFile());
	      });
};
//是否为 文件目录 (无必要时, 用f.checkF 检查目标是否存在)
f.isDirectory=function(path,cb){//5
	fs.stat(path,function(err,stats){
		  //stats.isDirectory() 是否为目录
		  //stats.isFile()   是否为普通文件
		  cb(err,stats.isDirectory());
	});
};
//复制指定的文件 到 指定目录
f.copyTo=function(pth0,pth1,cb){
	    fs.copyFile(pth0,pth1,function(err){
	    	     cb(err);
	    });
};

//同盘符:移动剪切 或 重命名   oldPath ,newPath  (注意:同盘符必须)(路径相同=>重命名, 路径不同=>移动+剪切+重命名(可3者兼), 对所有文件类型有效)
f.reName=function(o,n,cB){
       fs.rename(o,n,function(err){
             cB(err);
	   });    
};
//跨盘符: 移动复制文件 (不适宜大文件, 用法同上)
f.moveF=function(o,n,cB){
	 fs.readFile(o,function(err,data){
		//   if(err)throw err;
		    if(err){
				cB(err);
				return;
			};
			//写入数据
			fs.writeFile(n,data,function(err){
				   cB(err);
		    });
}); 
};
//判断文件或目录是否存在
f.checkF=function(path,cB){
	//    path=PATH(path);
	   fs.access(path, fs.constants.F_OK, function(err){
			/* if(err){//反正不存在,不可用
				// if(err.code=== "ENOENT")//文件不存在;
			}else{
				// 存在
			}; */
             cB(err);
	   });
};

//创建 目录 及 文件 (根据path 和data 判断)
f.mkPthF=function(pth,data,cB){// 文件路径, 数据(若有,无是创建纯路径文件夹),回调
	    // pth=PATH(pth);
	var arr=pth.split('/'),i=1,l=arr.length,s=arr[0],fun,fun2;
		  //路径是从 arr[0]+arr[1]开始的
		 //触发回调
	     fun=function(){
			  if(i>=l){
                cB();//
				return;
			  };
			  s+='/'+arr[i];
			  fun2(i);	
			  i++;
		 };
		 //数据空间回调
         fun2=function(N){
			f.checkF(s,function(err){
				if(err){//文件不存在
					 if(N!==l-1||!data){//纯创建目录  (不是最后一层路径 或 是但没有data时) 则纯创建文件夹
						 f.mkDir(s,fun);
					 }else{//结尾的文件
						 f.writeF(s,data,cB);
					 };
				}else{//文件已经存在
					  fun(); //继续向下检查
				};
			});
		 };
		 fun();
};

//删除普通文件
f.delFile=function(pth,cB){
	  fs.unlink(pth, function(err){
		    cB(err);
	  });
};

//删除目录
f.delFolder=function(pth,cB){
	   fs.rmdir(pth, function(err){
			cB(err);
	   });
};
exports.fs=f;
// exports.o=o;























