function turnCssToInline(a){
	var content = a;
	// preserve existing inline styles
	content.find('[style]').each(function() {
		var that = $(this);
		that.attr('data-inline-css', that.attr('style'));
	});

	// get external css rules and iterate over all of them(Applicable to multiple css)
	$('link').each(function(a,b){
	var extCssFile = b.sheet;
	var	extCssRules = extCssFile.cssRules;
	for(var i = 0; i < extCssRules.length; i++) {
		var extCssRule = extCssRules[i].cssText;
		if(extCssRule.substr(0,1)=="@"){
			continue;
		}
		var	extCssSelector = $.trim(extCssRule.substring(0, extCssRule.indexOf('{'))),
			extCssProps = $.trim(extCssRule.substring(extCssRule.indexOf('{') + 1, extCssRule.indexOf('}')));

		if(extCssSelector.indexOf(':after') == -1 &&
			extCssSelector.indexOf(':before') == -1 &&
			content.find(extCssSelector).length
		) {
	extCssProps = extCssProps.split(';');
			if($.trim(extCssProps[extCssProps.length - 1]) == '') {
				extCssProps.pop();
			}

			content.find(extCssSelector).each(function() {
				var that = $(this);
				for(var a = 0; a < extCssProps.length; a++) {
					var style = extCssProps[a].split(/:(?!\/\/)/),
						prop = $.trim(style[0]),
						val = $.trim(style[1]);
					// jQuery doesn't understand css "!important" - remove it
					if(val.indexOf('important') != -1) {
						val = $.trim(val.replace('!', '').replace('important', ''));
					}
					that.css(prop, val);
				}
			});
		}
	}

	// restore inline css, that already existed before applying external css
	content.find('[data-inline-css]').each(function() {
		var that = $(this),
			inlCssProps = that.attr('data-inline-css').split(';');
		if($.trim(inlCssProps[inlCssProps.length - 1]) == '') {
			inlCssProps.pop();
		}
		for(var i = 0; i < inlCssProps.length; i++) {
			var style = inlCssProps[i].split(/:(?!\/\/)/),
				prop = $.trim(style[0]),
				val = $.trim(style[1]);
			that.css(prop, val);
		}
		if(a==$('link').length-1){
			that.removeAttr('data-inline-css');
		}
	});	
	}）
}