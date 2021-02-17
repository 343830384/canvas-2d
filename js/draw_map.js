(function(){
var game_main=document.getElementById('game_main');
var canvas=game_main.getElementsByTagName('canvas');
var map,weather,floor;
    map=canvas[0].getContext('2d'); // map,solid 层
    weather=canvas[1].getContext('2d');//天气层 (帷幕 ,云层型天气)
    floor=canvas[2].getContext('2d');//楼层路径  (map 编辑模式 才允许用 , npc实机模式,禁用)
   
 //   
 var Draw=function(){

 }; 
 
 //获取 画布尺寸
 Draw.prototype.init=function(w,h){
  var t=this;
      t.mw=w,t.mh=h;
      
 };
 //绘制地图
 Draw.prototype.map=function(d){
     var t=this,load=imgLoad,i=0,l=d.length,mw=t.mw,mh=t.mh,a=-6,b,c,e,f,g,u;
         map.clearRect(0,0,mw,mh);//清空画布
         map.strokeStyle='rgb(0,255,0)';//设置辅助框颜色
         map.lineWidth=2;//辅助线宽度 
         l=l/6;  //6个长度一组数据
         while(i<l){
             a+=6; //初始从0开始      [0:imgId,1:imgN,2:x,3:y,4:w,5:h]
             b=d[a];//imgId
             e=d[a+1];//imgN
             if(e===2){//编辑操作 标记辅助框
                map.strokeRect(d[a+2],d[a+3],d[a+4],d[a+5]); 
                i++;
                continue;
             };
             c=IMG[b];
             f=1;
             if(c===u){ //完全未创建的img
                  load.test(b,e); 
                  i++;
                  continue;
             };
             c=c[e];
             if(c===u){//对应 imgN 未加载
                 load.test(b,e); 
                 f=0;
             };
             if(f===1)map.drawImage(c,d[a+2],d[a+3],d[a+4],d[a+5]);
            i++;
         };
 };
 //绘制 帷幕 天气层  云层
Draw.prototype.weather=function(){

};
 //绘制 路径层
Draw.prototype.floor=function(){

};

draw=new Draw();

})();