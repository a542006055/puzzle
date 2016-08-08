//2015.11.16
(function($) {
  $.fn.extend({
    puzzle: function(options) {
      var $this=$(this);  
      var Cont,ContW,ContH,row,col,BoxNum,BoxW,BoxH,Arr,NewArr,lastArr,minIndex,pos1,pos2,disX,disY,near,pos,oDiv,step,in1,in2;
      var defaults = {img:"images/pic1.jpg",row:3,col:3,success:success};
      var opts = $.extend(defaults,options);
      init(); 

      function init(){
        Cont = $this;
        ContW = Math.floor(Cont.width()-1);
        ContH = Math.floor(Cont.height()-1);
        row = opts.row;
        col = opts.col;
        Arr = [];//初始数组
        NewArr = [];//新数组
        lastArr = [];
        pos = [];
        BoxNum = row*col;
        BoxW=Math.floor(ContW/col);
        BoxH=Math.floor(ContH/row);
        minIndex=10; 
        near = null;
        step = 0;
        $this.off("start").on("start",start)
        initArr();
        creatDiv()
      }

      function start(){
        $(".picDiv").off();
        randomArr();
      }

      function initArr(){
        for(i = 0; i < BoxNum; i++){
          Arr.push(i);
        }
        NewArr = Arr.slice(0);
      }

      function creatDiv(){
        var html = '';
        $.each(Arr,function(i,item){
          var divCont = $('<div class="outer"><div class="picDiv"></div></div>')
          oDiv = divCont.find(".picDiv")
          var  dd = parseInt(10) * 10 /parseInt(row)+'%'
          oDiv.css({width:dd,height:dd,background:"url("+opts.img+") no-repeat","background-position":"-"+(i%col)*BoxW+"px"+" -"+Math.floor(i/row)*BoxH+"px" });
          html += divCont.html()
        })
        $(html).appendTo(Cont);
        pos=[];
        $.each(Arr,function(i,item){
          var left =$(".picDiv").eq(i).position().left
          var top =$(".picDiv").eq(i).position().top
          pos.push([left,top])
          
        })

      }
      function randomArr(){
        //存位置
        

        NewArr.sort(function(){
          return Math.random() > 0.5 ? 1 :-1;
        });
        //如果随机数组重复
        if (NewArr.toString() == Arr.toString()) {
          NewArr.sort(function() {
            return Math.random() > 0.5 ? 1 : -1;
          })
        }
        console.log(NewArr);
        $(".picDiv").each(function(i,item){
          $(this).css({position:"absolute",left:0,top:0,x:pos[i][0],y:pos[i][1]}).transition({x:pos[NewArr[i]][0],y:pos[NewArr[i]][1],delay:400},300);
          $(this).attr({"data-index":NewArr[i]});
          
        })

        $(".picDiv").on("touchstart",start_handler)
      }

      

      function start_handler(e){
        step++;
        e.preventDefault();
        e.stopPropagation();
        $(this).css("z-index","40");
        var x = parseInt($(this).css("x"));
        var y = parseInt($(this).css("y"));
        pos1=[e.originalEvent.touches[0].clientX,e.originalEvent.touches[0].clientY];
        $(this).on('touchmove',move_handler).one('touchend',end_handler);

        function move_handler(e){
          pos2 = [e.originalEvent.touches[0].clientX,e.originalEvent.touches[0].clientY];
          disX = pos2[0]-pos1[0]+x
          disY = pos2[1]-pos1[1]+y
          $(this).css({x:disX,y:disY});
          near = findnear($(this),$(".picDiv"))
          if(near){
            near.addClass('active');
          }
        }

        function end_handler(){
          in1 = $(this).attr("data-index");
          if(near){
            
            in2 = near.attr("data-index");
            var temp = 0
            near.removeClass('active');
            $(this).css("z-index","30");
            near.css("z-index","30");
            near.transition({x:pos[in1][0],y:pos[in1][1]},200,function  () {
              near.css("z-index","10");
            })
            $(this).transition({x:pos[in2][0],y:pos[in2][1]},200,function  () {
              $(this).css("z-index","10");
            })

            temp=near.attr("data-index");
            near.attr("data-index",in1);
            $(this).attr("data-index",temp);

            for(var i=0;i<BoxNum;i++){
              lastArr[i]=($(".picDiv").eq(i).attr("data-index"));
            }
            if(isSuccess()){
              success()
            }
          }
          else{
            console.log(in1)
            $(this).transition({x:pos[in1][0],y:pos[in1][1]},200);
            $(this).css("z-index","10");
          }
        }
      }

      function isSuccess(){
        if(lastArr.toString() == Arr.toString()) return true;
        else return false;
      };

      function success(){
        $(".picDiv").off();
        if(opts.success) opts.success(step);
      }

      function findnear(obj,objs){
        var iMin=99999,index=-1;
        objs.removeClass('active');
        objs.each(function(i,item){
          var end=imath.hitTest(obj,objs.eq(i));
          if (end){
            var x1 = parseInt(obj.css("x"));
            var y1 = parseInt(obj.css("y"));
            var x2 = parseInt(objs.eq(i).css("x"));
            var y2 = parseInt(objs.eq(i).css("y"));
            var dis = imath.getDis([x1,y1],[x2,y2])

            if(iMin>dis&& dis!=0)
            {
              iMin=dis;
              index=i;
            };
          }

        })
        if(index==-1){
          return null;
        }
        else
        { 
          return objs.eq(index);
        };

      }
    },

    puzzleStart: function() {
      $(this).triggerHandler('start');
    }
  });
})(jQuery);//闭包