/*!
 * Plugin for scrollarax.
 * This plugin makes hashlinks scroll nicely to their target position.
 *
 * free to use under terms of MIT license
 */
(function(document, scrollarax) {
	var DEFAULT_DURATION = 500;
	var DEFAULT_EASING = 'sqrt';

	var TOP_OFFSET_ATTRIBUTE = 'data-menu-top';

	/*
		Since we are using event bubbling, the element that has been clicked
		might not acutally be the link but a child.
	*/
	var findParentLink = function(element) {
		//Yay, it's a link!
		if(element.tagName === 'A') {
			return element;
		}

		//We reached the top, no link found.
		if(element === document) {
			return false;
		}

		//Maybe the parent is a link.
		return findParentLink(element.parentNode);
	};

	/*
		Handle the click event on the document.
	*/
	var handleClick = function(e) {


		var link = findParentLink(e.target);

		//The click did not happen inside a link.
		if(!link) {
			return;
		}

		//Don't use the href property because it contains the absolute url.
		var href = link.getAttribute('href');

		//Check if it's a hashlink.
		if(href.indexOf('#') !== 0) {
			return;
		}

		//Now get the offset to scroll to.
		var offset;

		//If there's a data-menu-top attribute, it overrides the actuall anchor offset.
		if(link.hasAttribute(TOP_OFFSET_ATTRIBUTE)) {
			offset = +link.getAttribute(TOP_OFFSET_ATTRIBUTE);
		} else {
			var scrollTarget = document.getElementById(href.substr(1));

			//Ignore the click if no target is found.
			if(!scrollTarget) {
				return;
			}

			offset = _scrollaraxInstance.relativeToAbsolute(scrollTarget, 'top', 'top');
		}

		//Now finally scroll there.
		if(_animate) {
			_scrollaraxInstance.animateTo(offset, {
				duration: _duration,
				easing: _easing
			});
		} else {
			_scrollaraxInstance.setScrollTop(offset);
		}

		e.preventDefault();
	};

	/*
		Global menu function accessible through window.scrollarax.menu.init.
	*/
	scrollarax.menu = {};
	scrollarax.menu.init = function(scrollaraxInstance, options) {
		_scrollaraxInstance = scrollaraxInstance;

		options = options || {};

		_duration = options.duration || DEFAULT_DURATION;
		_easing = options.easing || DEFAULT_EASING;
		_animate = options.animate !== false;

		//Use event bubbling and attach a single listener to the document.
		scrollarax.addEvent(document, 'click', handleClick);
	};

	//Private reference to the initialized scrollarax.
	var _scrollaraxInstance;

	var _easing;
	var _duration;
	var _animate;

	//In case the page was opened with a hash, prevent jumping to it.
	//http://stackoverflow.com/questions/3659072/jquery-disable-anchor-jump-when-loading-a-page
	window.setTimeout(function() {
		if(location.hash) {
			window.scrollTo(0, 0);
		}
	}, 1);
}(document, window.scrollarax));