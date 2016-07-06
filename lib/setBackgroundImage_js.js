/*
 * setBackgroundImage 1.0
 * Copyright (c) 2009 Gerry.zhong http://www.cnblogs.com/GerryOfZhong/
 * Date: 2016-07-06
 * gitHub: https://github.com/GerryIsWarrior/setBackgroundImage_js
 * 延迟加载背景图片，带有淡出效果  原生js插件
 */
    var gerry = window.gerry || {};
    gerry.setBackgroundImage = (function(){
        //私有参数设置（不对外开放）
         var config={
            imgArr: [],        //图片数组
            imgSecond: 1000,  //图片淡出的时间
            isRandom:false    //是否为随机图片
        }

        var tool = {
            //ID选择器
            id_selector:function (selector){
                return document.getElementById(selector);
            },
            //创建节点
            createElement:function(node){
                return document.createElement(node);
            },
            //设置节点属性
            attr:function(setArrObject){
                for(var i = 0,len=setArrObject.attribute.length;i<len;i++){
                    setArrObject.node.setAttribute(setArrObject.attribute[i].key,setArrObject.attribute[i].value);
                }
            }
        }

        //设置的样式
        var css = {
            divT : 'position:absolute;left:0;top:0;z-index:-1;overflow:hidden;width:100%;height:100%',
            ImgT:'position:absolute;left:0;top:0;z-index:-2;opacity:0;',
        }

        //私有方法，不对外开放
        var privateMethods = {
            //对开发者的配置进行处理
            paraHandling:function(option){
                var configTemp ;
                if(option.config != undefined){  //开发者设置了值
                    option.config.imgArr== undefined ? option.config.imgArr =config.imgArr:null;
                    option.config.imgSecond== undefined ? option.config.imgSecond = config.imgSecond:null;
                    option.config.isRandom== undefined ? option.config.isRandom = config.isRandom:null;
                    configTemp = option.config;
                }else{
                    configTemp = config;
                };
                return configTemp;
            },
            //针对IE9处理淡出效果
            divFadeIn:function(option){
                if(option.selector == undefined){
                    throw new Error("please select a id (div).")
                }else{
                    var showTime =  Number(option.config.imgSecond);
                    var opacityValue = 0;  //设置opacity的属性值
                    var divSelector = tool.id_selector(option.selector); //获得div的ID
                    var temp = setInterval(function(){
                        opacityValue+=0.01;
                        divSelector.style.opacity = opacityValue;
                        if(opacityValue>1){
                            clearInterval(temp);
                        }
                    },showTime/100);
                }
            },
            //创建内容主题
            createContent:function(option){
                //设置ID
                var divImg = tool.createElement("div");
                var object_div = {
                    node:divImg,
                    attribute:[
                        {
                            key:"id",
                            value:"divShow"
                        },
                        {
                            key:"style",
                            value:css.divT
                        }
                    ]
                };
                tool.attr(object_div);

                //设置img属性
                var img = tool.createElement("img");
                var object_div = {
                    node:img,
                    attribute:[
                        {
                            key:"id",
                            value:"imgShow"
                        },
                        {
                            key:"style",
                            value:css.ImgT+"transition:opacity "+option.config.imgSecond/1000+"s ease",
                        }
                    ]
                };
                tool.attr(object_div);
                divImg.appendChild(img);
                document.body.appendChild(divImg);
                privateMethods.delayLoadImg(option.config.imgArr[0]);
            },
            //延迟加载图片
            delayLoadImg:function(img_src){
                var img = new Image();
                img.src = img_src;
                img.onload = function(){
                    var temp = {
                        node:tool.id_selector("imgShow"),
                        attribute:[
                            {
                                key:"src",
                                value:img_src
                            }
                        ]
                    };
                    tool.attr(temp);

                    tool.id_selector("imgShow").style.opacity = 1;
                }

            }
        }

        //暴露给开发者使用的方法，可随意拓展
        var publicMethods = {
            init:function(option){
                if(arguments.length == 0){
                    throw new Error("this method need a config object");
                }else{
                    if(document.body.style.opacity == undefined){  //检测是否支持opacity属性 [即IE9及以上]
                        throw new Error("please use the browser of high version ");
                    }else {
                        option.config = privateMethods.paraHandling(option);
                        option.selector = "divShow";
                        //如果是IE9的话
                        if (document.body.style.transition == undefined) {
                            privateMethods.createContent(option);
                            privateMethods.divFadeIn(option);
                        } else {
                            privateMethods.createContent(option);
                        };
                    }
                }
            }
        }

        return publicMethods;

    })()