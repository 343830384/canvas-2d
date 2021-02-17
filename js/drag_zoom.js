/* 
   ui 拖拽
   行内属性 包含 drag='1' 的,试用拖拽
   
*/
(function(){
  var bod=document.body,mb,mf,dx=0,dy=0;
      //mb:拖拽目标,mf:(1:允许拖拽0:释放)
     //命中的拖拽目标 ,  mf=>1:有选择,0:未命中
      window.addEventListener('mousedown',function(e){
               var a=e.target,b,c,d,e,f=0;
                  b=a.getAttribute('drag');
                  mb=null,mf=0;
                  if(b==='1'){//命中拖拽按钮
                     b=a.getAttribute('dragDom'); //拖动相对于自身的 拖动目标 父元素层级  0=自身
                     b=b*1;
                     while(b--){
                        a=a.parentNode
                     };
                     f=1;
                  }else{
                     return;
                  };   
                  if(f===1){//命中拖拽元素
                        mb=a,mf=1;
                        e.stopPropagation();
                        e.preventDefault();
                  };  
      });
     //命中缩放目标
      window.addEventListener('mousedown',function(e){
         var a=e.target,b,c,d,e,f=0;
            b=a.className;
            //  say(b)
            if(b=='ui_bt_zoom'){
                 c=a.zoom;  //0:缩,1:展开
                 a.zoom=c?0:1;
                 d=a.parentNode.parentNode;//被缩放的元素整体  
                 if(c===1){
                    d.className=''; //还原
                 }else{//缩小
                    d.className='ty_zoom_sx';
                 };
                 e.stopPropagation();
                 e.preventDefault();
            };
      });
      //拖拽目标释放
      window.addEventListener('mouseup',function(){
         mf=0;
         mb=null; 
      });
      //拖拽目标释放
      window.addEventListener('blur',function(){
            mf=0;
            mb=null; 
      });
      //拖拽目标移动
      window.addEventListener('mousemove',function(e){
            if(mf===1){
                var x=e.pageX,y=e.pageY;
                    mb.style.left=x+'px';
                    mb.style.top=y+'px';
                    e.stopPropagation();
                    e.preventDefault();
            };
      });
})();

