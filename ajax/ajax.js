$_ajax=function(o,z){
    var $=new XMLHttpRequest(),t,d,u,a,s,y,f;
        t=o.type||'post'; //默认post
        t=t.toLowerCase(); 
        d=o.dataType||'json'; //默认json
        d=d.toLowerCase();  
        u=o.url||'/eng-data'; 
        a=o.async===undefined?true:false; //默认 异步 
        s=o.data;
        f=JSON.stringify(s);
        $.open(t ,u+(t!='post'?(s?('?'+f):''):''),a);
        $.setRequestHeader("Content-type","application/"+d+'charset=utf-8');
        // console.log(f);
        $.send(t=='post'?f:'');
        $.onreadystatechange=function(){
            if($.readyState==4){
                var status= $.status;
                if(status==200||status==304){
                    y=$.responseText;
                    if(o.success)
                     o.success(d=='json'?JSON.parse(y):y,z);

                }else{
                    if(o.error)
                    o.error(status,z);
                }
            }
     };
};
/*
基本使用范例, 所有均为 json格式
$_ajax({
    type:'post',
    dataType:'json',
    url:'?指令',
    data:{ },
    success:function(d){
       
    },
    error:function(d){
    
    }
}); 
*/
