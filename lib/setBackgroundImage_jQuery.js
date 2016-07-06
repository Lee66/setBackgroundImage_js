/*
 * tableUI 1.0
 * Copyright (c) 2009 Gerry.zhong http://justinyoung.cnblogs.com/
 * Date: 2016-05-26
 * gitHub:
 * 延迟加载背景图片，带有淡出效果
 */
(function(){
    $.setBackgroundImage=function(options){
        //默认参数
        var defaults = {
            imgArr: [],        //图片数组
            imgSecond: 1000,  //图片淡出的时间
            isRandom:false    //是否为随机图片
        };
        // Extend our default options with those provided.
        var opts = $.extend(defaults, options);
        //绘制标签
        var divT= $("<div/>");
        divT.attr("id","divShow");
        var imgT = $("<img/>");
        imgT.attr("id","ImgShow");

        //添加样式
        var transitionCss = "opacity "+ options.imgSecond/1000+"s"+" ease";
        divT.css({"position":"absolute","left":"0","top":"0","z-index":"-1","overflow":"hidden","width":"100%","height":"100%"});
        imgT.css({"position":"absolute","left":"0","top":"0","z-index":"-2","transition":transitionCss});
        //解决兼容性问题：ie8不支持opacity和transition
        //                ie9不支持transition
        if($("body")[0].style.opacity==undefined ||$("body")[0].style.transition == undefined){
            divT.css({"display":"none"});
        }else{
            imgT.css({"opacity":"0"});
        }
        imgT.appendTo(divT);
        divT.appendTo($("body"));

        //延迟加载图片
        var imageT;
        var imgObjArr = new Array;
        if(options.isRandom){
            for(var i = 0;i<options.imgArr.length;i++){
                imageT = new Image();
                imageT.src = options.imgArr[i];
                imgObjArr.push(imageT);
            }
        }else {
            imageT = new Image();
            imageT.src = options.imgArr[0];
            imgObjArr.push(imageT);
        }

        //动态显示
        imageT.onload =function(){
            console.log(options.isRandom)
            if(options.isRandom){
                var result =Math.round(Math.random() * (options.imgArr.length - 1));
                $("#ImgShow").attr("src",options.imgArr[result]);
            }else{
                $("#ImgShow").attr("src",options.imgArr[0]);
            }

            //对于统一不支持css3属性的用jquery的fadeIn解决淡出问题
            if($("body")[0].style.opacity==undefined || $("body")[0].style.transition==undefined){
                $("#divShow").fadeIn(options.imgSecond);
            }else{
                $("#ImgShow").css({"opacity":"1"});
            }
           };
        }
})(jQuery)
