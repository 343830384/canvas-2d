
var mapHq=function(id){
    var a=document.getElementById(id);
        a=a.textContent;
        a=a.trim();
        return a;
};

var $_ajax=function(o){
         var a,b,c,e,f,g,h,i,j,k,u;
             a=o.m;
             if(a[0]===0){
                setTimeout(function(){
                    o.success(mapHq(a[1])); 
                },100)
                
             }else if(a[0]===1){//存 (直接存localStorage )
                    b=new Date().getTime();
                    localStorage.setItem("duiMengData", a[1]);
                    localStorage.setItem("duiMengTime",b); 
                    o.success({msg:'已存储...'});
                    xnEvt.tsK('数据已经存于本地localStorage....');
                    
             }else{//2读  (直接读取 localStorage ,此demo删除web服务端)
               
                    c=localStorage.getItem("duiMengData");
                    j=localStorage.getItem("duiMengTime");
                    o.success(c);
             };
};
