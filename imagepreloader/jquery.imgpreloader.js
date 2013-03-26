/*
 * Images PreLoader v1 
 *
 * For instructions read the post:
 * 
 *
 * Copyright (c) 2013 - Jose Mendez
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Version:  1.0
 *
 */
(function($) {


	/*Browser detection patch*/
	jQuery.browser = {};
	jQuery.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase());
	jQuery.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
	jQuery.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
	jQuery.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
	


    if (!Array.prototype.indexOf)
	   {
	   Array.prototype.indexOf = function(elt /*, from*/)
             {
             var len  = this.length >>> 0;
             var from = Number(arguments[1]) || 0;
                 from = (from < 0)
                      ? Math.ceil(from)
                      : Math.floor(from);
             if (from < 0)
                 from += len;
 
                 for (; from < len; from++)
                     {
                     if (from in this &&
                     this[from] === elt)
                     return from;
                     }
             return -1;
             };
       }


    var iPimages = new Array;
    var iPdone = 0;
    var iPdestroyed = false;

    var iPimageContainer = "";
    var iPoverlay = "";
    var iPbar = "";
    var iPpercentage = "";
    var iPimageCounter = 0;
    var iPstart = 0;

    var iPoptions = {
        onComplete: function () {},
        backgroundColor: "#000",
        barColor: "#fff",
        overlayId: 'iPoverlay',
        barHeight: 1,
        percentage: false,
        deepSearch: true,
        completeAnimation: "fade",
        minimumTime: 500,
        onLoadComplete: function () {
            if (iPoptions.completeAnimation == "grow") {
                var animationTime = 500;
                var currentTime = new Date();
                if ((currentTime.getTime() - iPstart) < iPoptions.minimumTime) {
                    animationTime = (iPoptions.minimumTime - (currentTime.getTime() - iPstart));
                }

                $(iPbar).stop().animate({
                    "width": "100%"
                }, animationTime, function () {
                    $(this).animate({
                        top: "0%",
                        width: "100%",
                        height: "100%"
                    }, 500, function () {
                        $('#'+iPoptions.overlayId).fadeOut(500, function () {
                            $(this).remove();
                            iPoptions.onComplete();
                        })
                    });
                });
            } else {
                $('#'+iPoptions.overlayId).fadeOut(500, function () {
                    $('#'+iPoptions.overlayId).remove();
                    iPoptions.onComplete();
                });
            }
        }
    };

    var afterEach = function () {
        //start timer
        var currentTime = new Date();
        iPstart = currentTime.getTime();

        createPreloadContainer();
        createOverlayLoader();
    };

    var createPreloadContainer = function() {
        iPimageContainer = $("<div></div>").appendTo("body").css({
            display: "none",
            width: 0,
            height: 0,
            overflow: "hidden"
        });
        
        for (var i = 0; iPimages.length > i; i++) {
            $.ajax({
                url: iPimages[i],
                type: 'HEAD',
                complete: function(data) {
                    if(!iPdestroyed){
                        iPimageCounter++;
                        addImageForPreload(this['url']);
                    }
                }
            });
        }        	

    };

    var addImageForPreload = function(url) {
        var image = $("<img />").attr("src", url).bind("load", function () {
            completeImageLoading();
        }).appendTo(iPimageContainer);
    };

    var completeImageLoading = function () {
        iPdone++;

        var percentage = (iPdone / iPimageCounter) * 100;
        $(iPbar).stop().animate({
            width: percentage + "%",
            minWidth: percentage + "%"
        }, 200);

        if (iPoptions.percentage == true) {
            $(iPpercentage).text(Math.ceil(percentage) + "%");
        }

        if (iPdone == iPimageCounter) {
            destroyQueryLoader();
        }
    };

    var destroyQueryLoader = function () {
        $(iPimageContainer).remove();
        iPoptions.onLoadComplete();
        iPdestroyed = true;
    };

    var createOverlayLoader = function () {
        iPoverlay = $("<div id='"+iPoptions.overlayId+"'></div>").css({
            width: "100%",
            height: "100%",
            backgroundColor: iPoptions.backgroundColor,
            backgroundPosition: "fixed",
            position: "fixed",
            zIndex: 666999,
            top: 0,
            left: 0
        }).appendTo("body");
        iPbar = $("<div id='iPbar'></div>").css({
            height: iPoptions.barHeight + "px",
            marginTop: "-" + (iPoptions.barHeight / 2) + "px",
            backgroundColor: iPoptions.barColor,
            width: "0%",
            position: "absolute",
            top: "50%"
        }).appendTo(iPoverlay);
        if (iPoptions.percentage == true) {
            iPpercentage = $("<div id='iPpercentage'></div>").text("0%").css({
                height: "40px",
                width: "100px",
                position: "absolute",
                fontSize: "3em",
                top: "50%",
                left: "50%",
                marginTop: "-" + (59 + iPoptions.barHeight) + "px",
                textAlign: "center",
                marginLeft: "-50px",
                color: iPoptions.barColor
            }).appendTo(iPoverlay);
        }
        if ( !iPimages.length) {
        	destroyQueryLoader()
        }
    };

    var findImageInElement = function (element) {
        var url = "";

        if ($(element).css("background-image") != "none") {
            var url = $(element).css("background-image");
        } else if (typeof($(element).attr("src")) != "undefined" && element.nodeName.toLowerCase() == "img") {
            var url = $(element).attr("src");
        }

        if (url.indexOf("gradient") == -1) {
            url = url.replace(/url\(\"/g, "");
            url = url.replace(/url\(/g, "");
            url = url.replace(/\"\)/g, "");
            url = url.replace(/\)/g, "");

            var urls = url.split(", ");

            for (var i = 0; i < urls.length; i++) {
                if (urls[i].length > 0 && iPimages.indexOf(urls[i]) == -1) {
                    var extra = "";
                    if ($.browser.msie && $.browser.version < 9) {
                        extra = "?" + Math.floor(Math.random() * 3000);
                    }
                    iPimages.push(urls[i] + extra);
                }
            }
        }
    }

    $.fn.imagePreLoader = function(options) {
        if(options) {
            $.extend(iPoptions, options );
        }

        this.each(function() {
            findImageInElement(this);
            if (iPoptions.deepSearch == true) {
                $(this).find("*:not(script)").each(function() {
                    findImageInElement(this);
                });
            }
        });

        afterEach();

        return this;
    };

})(jQuery);
