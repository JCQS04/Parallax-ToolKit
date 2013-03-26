Parallax-ToolKit Framework
================

ToolKit javascript libraries ready to use to create parallax effects, include:

-skrollr (v 0.5.14) https://github.com/Prinzhorn/skrollr

-jparallax https://github.com/stephband/jparallax

-imagePreLoader (Jose Mendez):
imagePreLoader v1
==============

imagePreLoader serves the main purpose of preloading the images on your website by showing an overlay and a loading bar. It automatically fetches all your images and background images and preloads them before showing the webpage.
imagePreLoader currently works with jQuery v1.7.2 and in IE version > 7, Chrome, Safari and Firefox.


How to use
----------

Include the script in the head section of your webpage.

  <script src="path/to/file/jquery.imagePreLoader.js" type="text/javascript"></script>

Be sure to add it after you include jQuery.

Now call imagePreLoader in a $(document).ready() like this:

	$(document).ready(function () {
		$("body").imagePreLoader();
	});
	
For support on iOS devices use the following code:

	window.addEventListener('DOMContentLoaded', function() {
		$("body").imagePreLoader();
	});

Basic usage
-----------

    $(selector).imagePreLoader(options);
	
Options
-------

**backgroundColor**

(string) background color of the loader (in hex).
Default: "#000"
	
**barColor**

(string) background color of the bar (in hex).
Default: "#FFF"

**barHeight**

(int) Height of the bar in pixels.
Default: 1

**completeAnimation**

(string) set the animation type at the end. Options: "grow" or "fade".
Default: "fade"

**minimumTime**

(int) time in miliseconds which the loading has to run. If time has not passed the animation will still show.
Default: 500

**deepSearch**

(boolean) set to true to find ALL images with the selected elements. If you don't want imagePreLoader to look in the children, set to false.
Default: true
	
**percentage**

(boolean) Set to true to enable percentage visualising.
Default: false

**onComplete**

(function) this function is called once the loading and animation are completed.
Default: none

**onLoadComplete**

(function) this function is called once the loading is complete. This is handy when changing the animation at the end.
Default: default behaviour
