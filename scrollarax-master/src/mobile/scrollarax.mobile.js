/*
 * This file is the bridge between iscroll and scrollarax.
 * It configures the page so that both work together
 * and exposes an instance of iscroll to scrollarax.
 */

(function(window, document, undefined) {
	document.addEventListener('touchmove', function(e) {
		e.preventDefault();
	}, false);

	document.addEventListener('DOMContentLoaded', function () {
		window.setTimeout(function() {
			var scrollaraxBody = document.getElementById('scrollarax-body');

			if(!scrollaraxBody) {
				throw "For mobile support scrollarax needs a #scrollarax-body element";
			}

			scrollaraxBody.style.cssText += 'position:absolute;width:100%;';

			document.body.style.cssText += 'position:absolute;left:0;top:0;bottom:0;width:100%;padding:0;margin:0;';

			scrollarax.iscroll = new iScroll(document.body, {
				bounce: false,
				//When using transform, all fixed-positioned child elements degrade to absolut positioned.
				useTransform: false,
				onBeforeScrollStart: function(e) {
					var target = e.target;

					while(target.nodeType != 1) {
						target = target.parentNode;
					}

					if(!/(select|input|textarea)/i.test(target.tagName)) {
						e.preventDefault();
					}
				}
			});

			document.documentElement.className += ' scrollarax-mobile';

			window.scroll(0, 0);
		}, 200);
	},false);
}(window, document));