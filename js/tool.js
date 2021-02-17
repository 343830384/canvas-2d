/* 
######################################################################
删除指定dom 
*/
var delDom=function(d){
    d.parentNode.removeChild(d)
};
/* 
######################################################################
创建 DOM 
*/
var DIV=document.createElement('div');//创建子容器
var cjDom=function(str){
    var a;
        DIV.innerHTML=str.trim();
        a=DIV.childNodes;
        return a[0];     
}; 
/* 
######################################################################
创建 svg DOM  line 
*/
var cjLine=function(d){//d=[0:x1,1:y1,2:x2,3:y2,4:lineWidth,5:lineColor ]   //'<line x1="'+x+'" y1="'+y+'" x2="171" y2="563" style="stroke:rgb(255,0,0);stroke-width:1"/>';
    var a;
        a=document.createElementNS('http://www.w3.org/2000/svg','line');
        a.setAttribute('x1',d[0]);
        a.setAttribute('y1',d[1]);
        a.setAttribute('x2',d[2]);
        a.setAttribute('y2',d[3]);
        a.setAttribute('style','stroke:'+(d[5]?d[5]:'rgb(255,0,0)')+';stroke-width:'+(d[4]?d[4]:1)+';');
        return a;     
}; 
/* 
######################################################################
获取dom 相对于浏览器窗口的偏移量
*/
var offset=function( d ){  
    var left = d.offsetLeft;
	var top  = d.offsetTop;
    var parent = d.offsetParent;  
       while( parent != null ){  
        left+= parent.offsetLeft; //在非ie低版本浏览器中 parent== document.body所以这里等于 0
		top+= parent.offsetTop;
        parent = parent.offsetParent;  
    };  
    return {top:top,left:left};
};

/* 
######################################################################
  右下角 文本提示 工具
*/
var tips=cjDom("<textarea id='tips' readonly ></textarea>"); //创建右下提示框
    document.body.appendChild(tips);
    
var tipFun=function(str,type){//str:文本   type:提示文字颜色=>0黑1红
        tips.textContent=str;//写入提示
        tips.style.color=type?'red':'black'; //1:红,它:黑
        tips.style.display='block';
};
    tips.onclick=function(){ //点击提示框 关闭
        this.style.display='none';
    };
/* 
###################################################################### 
    图片镜像
*/

var ImgJX=function(){ // 图片镜像
    var t=this;
        t.can=document.createElement('canvas');
        t.ctx=t.can.getContext('2d'); 
};

ImgJX.prototype.getJx=function( o ){
   var t=this,c=t.can,x=t.ctx,w,h,img;
          w=o.naturalWidth;
          h=o.naturalHeight;
          c.width=w;
          c.height=h;
          x.restore();
          x.save();
          x.clearRect(0,0,w,h);
          x.translate(w, 0);
          x.scale(-1,1);
          x.drawImage(o,0,0,w,h);
          img=new Image();
          img.src=t.can.toDataURL();
          return img; 
};

var imgJX=new ImgJX();

/* 
###################################################################### 

*/