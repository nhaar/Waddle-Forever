/*
 * Purl (A JavaScript URL parser) v2.3.1
 * Developed and maintanined by Mark Perkins, mark@allmarkedup.com
 * Source repository: https://github.com/allmarkedup/jQuery-URL-Parser
 * Licensed under an MIT-style license. See https://github.com/allmarkedup/jQuery-URL-Parser/blob/master/LICENSE for details.
 */

;(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        window.purl = factory();
    }
})(function() {

    var tag2attr = {
            a       : 'href',
            img     : 'src',
            form    : 'action',
            base    : 'href',
            script  : 'src',
            iframe  : 'src',
            link    : 'href',
            embed   : 'src',
            object  : 'data'
        },

        key = ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'fragment'], // keys available to query

        aliases = { 'anchor' : 'fragment' }, // aliases for backwards compatability

        parser = {
            strict : /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,  //less intuitive, more accurate to the specs
            loose :  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // more intuitive, fails on relative paths and deviates from specs
        },

        isint = /^[0-9]+$/;

    function parseUri( url, strictMode ) {
        var str = decodeURI( url ),
        res   = parser[ strictMode || false ? 'strict' : 'loose' ].exec( str ),
        uri = { attr : {}, param : {}, seg : {} },
        i   = 14;

        while ( i-- ) {
            uri.attr[ key[i] ] = res[i] || '';
        }

        // build query and fragment parameters
        uri.param['query'] = parseString(uri.attr['query']);
        uri.param['fragment'] = parseString(uri.attr['fragment']);

        // split path and fragement into segments
        uri.seg['path'] = uri.attr.path.replace(/^\/+|\/+$/g,'').split('/');
        uri.seg['fragment'] = uri.attr.fragment.replace(/^\/+|\/+$/g,'').split('/');

        // compile a 'base' domain attribute
        uri.attr['base'] = uri.attr.host ? (uri.attr.protocol ?  uri.attr.protocol+'://'+uri.attr.host : uri.attr.host) + (uri.attr.port ? ':'+uri.attr.port : '') : '';

        return uri;
    }

    function getAttrName( elm ) {
        var tn = elm.tagName;
        if ( typeof tn !== 'undefined' ) return tag2attr[tn.toLowerCase()];
        return tn;
    }

    function promote(parent, key) {
        if (parent[key].length === 0) return parent[key] = {};
        var t = {};
        for (var i in parent[key]) t[i] = parent[key][i];
        parent[key] = t;
        return t;
    }

    function parse(parts, parent, key, val) {
        var part = parts.shift();
        if (!part) {
            if (isArray(parent[key])) {
                parent[key].push(val);
            } else if ('object' == typeof parent[key]) {
                parent[key] = val;
            } else if ('undefined' == typeof parent[key]) {
                parent[key] = val;
            } else {
                parent[key] = [parent[key], val];
            }
        } else {
            var obj = parent[key] = parent[key] || [];
            if (']' == part) {
                if (isArray(obj)) {
                    if ('' !== val) obj.push(val);
                } else if ('object' == typeof obj) {
                    obj[keys(obj).length] = val;
                } else {
                    obj = parent[key] = [parent[key], val];
                }
            } else if (~part.indexOf(']')) {
                part = part.substr(0, part.length - 1);
                if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
                parse(parts, obj, part, val);
                // key
            } else {
                if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
                parse(parts, obj, part, val);
            }
        }
    }

    function merge(parent, key, val) {
        if (~key.indexOf(']')) {
            var parts = key.split('[');
            parse(parts, parent, 'base', val);
        } else {
            if (!isint.test(key) && isArray(parent.base)) {
                var t = {};
                for (var k in parent.base) t[k] = parent.base[k];
                parent.base = t;
            }
            if (key !== '') {
                set(parent.base, key, val);
            }
        }
        return parent;
    }

    function parseString(str) {
        return reduce(String(str).split(/&|;/), function(ret, pair) {
            try {
                pair = decodeURIComponent(pair.replace(/\+/g, ' '));
            } catch(e) {
                // ignore
            }
            var eql = pair.indexOf('='),
                brace = lastBraceInKey(pair),
                key = pair.substr(0, brace || eql),
                val = pair.substr(brace || eql, pair.length);

            val = val.substr(val.indexOf('=') + 1, val.length);

            if (key === '') {
                key = pair;
                val = '';
            }

            return merge(ret, key, val);
        }, { base: {} }).base;
    }

    function set(obj, key, val) {
        var v = obj[key];
        if (typeof v === 'undefined') {
            obj[key] = val;
        } else if (isArray(v)) {
            v.push(val);
        } else {
            obj[key] = [v, val];
        }
    }

    function lastBraceInKey(str) {
        var len = str.length,
            brace,
            c;
        for (var i = 0; i < len; ++i) {
            c = str[i];
            if (']' == c) brace = false;
            if ('[' == c) brace = true;
            if ('=' == c && !brace) return i;
        }
    }

    function reduce(obj, accumulator){
        var i = 0,
            l = obj.length >> 0,
            curr = arguments[2];
        while (i < l) {
            if (i in obj) curr = accumulator.call(undefined, curr, obj[i], i, obj);
            ++i;
        }
        return curr;
    }

    function isArray(vArg) {
        return Object.prototype.toString.call(vArg) === "[object Array]";
    }

    function keys(obj) {
        var key_array = [];
        for ( var prop in obj ) {
            if ( obj.hasOwnProperty(prop) ) key_array.push(prop);
        }
        return key_array;
    }

    function purl( url, strictMode ) {
        if ( arguments.length === 1 && url === true ) {
            strictMode = true;
            url = undefined;
        }
        strictMode = strictMode || false;
        url = url || window.location.toString();

        return {

            data : parseUri(url, strictMode),

            // get various attributes from the URI
            attr : function( attr ) {
                attr = aliases[attr] || attr;
                return typeof attr !== 'undefined' ? this.data.attr[attr] : this.data.attr;
            },

            // return query string parameters
            param : function( param ) {
                return typeof param !== 'undefined' ? this.data.param.query[param] : this.data.param.query;
            },

            // return fragment parameters
            fparam : function( param ) {
                return typeof param !== 'undefined' ? this.data.param.fragment[param] : this.data.param.fragment;
            },

            // return path segments
            segment : function( seg ) {
                if ( typeof seg === 'undefined' ) {
                    return this.data.seg.path;
                } else {
                    seg = seg < 0 ? this.data.seg.path.length + seg : seg - 1; // negative segments count from the end
                    return this.data.seg.path[seg];
                }
            },

            // return fragment segments
            fsegment : function( seg ) {
                if ( typeof seg === 'undefined' ) {
                    return this.data.seg.fragment;
                } else {
                    seg = seg < 0 ? this.data.seg.fragment.length + seg : seg - 1; // negative segments count from the end
                    return this.data.seg.fragment[seg];
                }
            }

        };

    }
    
    purl.jQuery = function($){
        if ($ != null) {
            $.fn.url = function( strictMode ) {
                var url = '';
                if ( this.length ) {
                    url = $(this).attr( getAttrName(this[0]) ) || '';
                }
                return purl( url, strictMode );
            };

            $.url = purl;
        }
    };

    purl.jQuery(window.jQuery);

    return purl;

});
;
/*	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
var swfobject=function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M=function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof O.ActiveXObject!=D){try{var ad=new ActiveXObject(W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k=function(){if(!M.w3){return}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false)}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(O==top){(function(){if(J){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(M.wk){(function(){if(J){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(J){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function K(X){if(J){X()}else{U[U.length]=X}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false)}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false)}else{if(typeof O.attachEvent!=D){i(O,"onload",Y)}else{if(typeof O.onload=="function"){var X=O.onload;O.onload=function(){X();Y()}}else{O.onload=Y}}}}}function h(){if(T){V()}else{H()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){var ab=Z.GetVariable("$version");if(ab){ab=ab.split(" ")[1].split(",");M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;H()})()}else{H()}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}P(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return !a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312)}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=M.ie&&M.win?"ActiveX":"PlugIn",ac="MMredirectURL="+O.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X}if(aa){if(typeof ai.id==D){ai.id=Y}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);I[I.length]=[Z,X,Y]}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;G=null}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}G=X}if(M.ie&&M.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y)}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function L(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y}var d=function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2])}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa])}for(var Y in M){M[Y]=null}M=null;for(var X in swfobject){swfobject[X]=null}swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(M.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai]}else{am.flashvars=ai+"="+Z[ai]}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y)}},removeSWF:function(X){if(M.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X)}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return L(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block"}}if(E){E(B)}}a=false}}}}();;
if(typeof CP === 'undefined') {
	CP = {};
}

if(!CP.utils) {
	CP.utils = {};
}

CP.utils.Modal = function(options) {
	// options that can overwritten
	this.options = {
		overlayOpacity: 0.8,
		overlayClickClose: true,
		showClose: true,
		contentCloseDelegate: null,
		centerOnResize: true,
		transitionDuration: 250,
		onOpenComplete: function(){},
		onCloseComplete: function(){},
		onOpenStart: function(){},
		onCloseStart: function(){}
	};
	jQuery.extend(true, this.options, options);

	// states
	this.isOpen = false;
	this.isLoading = false;

	//Due to conflicts with Panels only run this on the homepage at this time.  -- Added to backlog for permanent fix.
	if (location.pathname.match(/(\/|\/fr|\/es|\/de|\/pt)(\/index.php)?/)) {
	  this.inject();
	  this.attach();
	}
};
CP.utils.Modal.prototype.inject = function(){
	 //create and embed required elements
	 this.overlay = jQuery('<div id="modal-overlay"></div>').appendTo('body');
	 this.loading = jQuery('<div id="modal-loading"></div>').appendTo('body');
	 this.modal = jQuery('<div id="modal-window"></div>').appendTo('body');
	 // optional - close button
	 if(this.options.showClose){
	  	this.closeButton = jQuery('<a id="modal-close" href="#">close</a>').appendTo(this.modal);
	 }
	 this.modalContent = jQuery('<div id="modal-content"></div>').appendTo(this.modal);
	 // set overlay opacity to value in options
	 this.overlay.css('opacity', this.options.overlayOpacity);
	 this.body = jQuery('body');
};
CP.utils.Modal.prototype.attach = function(){
	var self = this;
	// overlay and loading resize handler
	jQuery(window).resize(function(){
		self.positionOverlay();
		self.centerElement(self.loading);
	});

	// optional - content triggered close event
	if(this.options.contentCloseDelegate != null){
		this.modalContent.delegate(this.options.contentCloseDelegate, 'click', function(e){
			e.preventDefault();
			self.close();
		});
	}
	// optional - hide on overlay click
	this.overlay.click(function(e){
		e.stopPropagation();

		if(self.options.overlayClickClose){
			self.close();
		}
	});

	// optional - close button
	if(this.options.showClose){
		// hide on close button click
		this.closeButton.click(function(e){
			e.preventDefault();
			self.close();
		});
	}
	// optional - window resize handler
	if(this.options.centerOnResize){
		jQuery(window).resize(function(){
			self.centerElement(self.modal);
		});
	}
};
CP.utils.Modal.prototype.centerElement = function(element){
	// usefull dimensions
	var elementWidth = element.width();

	var elementHeight = element.height();
	var windowWidth = jQuery(window).width();
	var windowHeight = jQuery(window).height();
	var scrollTop = jQuery(window).scrollTop();
	// calculate center
	var left = (windowWidth / 2) - (elementWidth / 2);
	var top = scrollTop + ((windowHeight / 2) - (elementHeight / 2));
	// bounding
	if(top < 0 ) top = 0;
	if(left < 0) left = 0;
	// set position
	element.css({
		top: top,
		left: left
	});
}
CP.utils.Modal.prototype.positionOverlay = function(){
	// ie6 alternate overlay size other browsers use css
	if(jQuery.browser.msie && jQuery.browser.version === '6.0'){
		this.overlay.css('height', jQuery(document).height());
	}
};
CP.utils.Modal.prototype.positionModal = function(){
	this.centerElement(this.modal);
};
CP.utils.Modal.prototype.showLoading = function(){
	if(this.isOpen){
		// already open just show loading indicator
		this.modal.fadeOut(this.options.transitionDuration);
		this.loading.fadeIn(this.options.transitionDuration);
	}else{
		// not open yet
		this.overlay.fadeIn(this.options.transitionDuration);
		this.positionOverlay();
		this.loading.fadeIn(this.options.transitionDuration);
		this.centerElement(this.loading);
	}
	this.isLoading = true;
};
CP.utils.Modal.prototype.open = function(modalContent, openCallback, closeCallback){
	var self = this;
	if(!this.isOpen){
		if(this.isLoading){
			// modal is already in loading state just open content
			this.loading.hide();
			this.modalContent.append(modalContent);
			this.modal.fadeIn(this.options.transitionDuration, function() {
				// callbacks
				self.options.onOpenComplete();

				if(closeCallback) self.activeCloseCallback = closeCallback;
			});
			this.options.onOpenStart();
			if(openCallback) openCallback();
			this.centerElement(this.modal);
			// update state
			this.isOpen = true;
			this.isLoading = false;
			if (self.closeButton) {
				self.closeButton.show();
			}
			this.body.addClass('modal-active');
		} else{
			// fresh modal nothing is open yet
			this.overlay.fadeIn(self.options.transitionDuration, function(){
				self.modalContent.append(modalContent);
				self.modal.fadeIn(self.options.transitionDuration, function() {
					// callbacks
					self.options.onOpenComplete();

					if(closeCallback) self.activeCloseCallback = closeCallback;
				});
				self.options.onOpenStart();
				if (self.closeButton) {
					self.closeButton.show();
				}
				if(openCallback) openCallback();
				self.centerElement(self.modal);
				// update state
				self.isOpen = true;
				self.isLoading = false;
				self.body.addClass('modal-active');
			});
			this.positionOverlay();
		}
	}else{
		// window already open just refresh content
		this.modal.css({visibility: 'hidden'}); ////to support interapp linking, instead of //this.modal.hide();
		this.modalContent.empty();
		this.modalContent.append(modalContent);
		this.options.onOpenStart();
		this.modal.css({visibility: 'visible'}); //to support interapp linking, instead of //this.modal.show();
		this.centerElement(this.modal);
		// update state
		this.isOpen = true;
		this.isLoading = false;
		this.body.addClass('modal-active');
		// callbacks
		this.options.onOpenComplete();
		if(openCallback) openCallback();
		if(closeCallback) this.activeCloseCallback = closeCallback;
	}
};
CP.utils.Modal.prototype.close = function(callback){
	if(this.isOpen){
		var self = this;

		//If you are in IE, find all embedded objects and replace them with divs. fadeout doesn't play too nice them
		if(jQuery.browser.msie) {
			var embeddedObjects = self.modalContent.find('object'); //Pro, Swfobject 2.x only uses object element!

			embeddedObjects.each(function(index, embObj) {
				embeddedObjects.replaceWith('<div id="' + embeddedObjects.attr('id') + '" />');
			});
		}

		// callback
		this.options.onCloseStart();

		// hide everything
		this.modal.fadeOut(this.options.transitionDuration, function(){
			self.modalContent.empty();
			self.loading.hide();
			self.overlay.hide();
			if (self.closeButton) {
				self.closeButton.hide();
			}

			// update state
			self.isLoading = false;
			self.isOpen = false;

			// remove class to body to signify closed modal
			self.body.removeClass('modal-active');

			// callbacks
			self.options.onCloseComplete();
			if(callback) callback();
			if(self.activeCloseCallback) {
				self.activeCloseCallback();
				self.activeCloseCallback = null;
			}
		});
	}
};


/**
 * Common Mobile Interstitial
 * @see cp_sitewide_settings.module "cp_sitewide_settings_init()"
 */
(function($) {
  Drupal.behaviors.cp_mobile_interstitial = {
    attach: function (context,settings) {
    	var add_mobile_popup = false;
    	var mobile_slug = '';
      // Watching Play buttons for iOS devices
      if( (navigator.userAgent.match(/iP(hone|od|ad)/i)) ) {
      	add_mobile_popup = true;
      	mobile_slug = 'ios';
      }
      // Watching Play buttons for Android devices
      else if( (navigator.userAgent.match(/android/i)) ) {
      	add_mobile_popup = true;
      	mobile_slug = 'android';
      }
      // Inject mobile interstitial details
      if ( add_mobile_popup ) {
        var popup = settings.cp_mobile_interstitial;
        $('a.play-now, a.play-now-v2, a.cp-mobile-pop')
          .addClass('agegated-link')
          .attr('href', popup[ mobile_slug ].action_link )
          .attr('data-interstitial_ok', popup[ mobile_slug ].buttons.action )
          .attr('data-interstitial_cancel', popup[ mobile_slug ].buttons.cancel )
          .attr('data-interstitial_text', popup[ mobile_slug ].content )
          .attr('data-interstitial_title', popup[ mobile_slug ].title )
          .attr('data-interstitial_class', popup[ mobile_slug ].class )
      }
    }
  };

})(jQuery);
;
/**
 * Sets a cookie in the user's browser
 * 
 * @param name of the cookie
 * @param value of the cookie
 * @param expiry_days from now, null for a session cookie
 */
function setCookie(name, value, expiry_days)
{
	// checking domains
	var domain_name = 'clubpenguin.com';
	var hostname = window.location.hostname;
	if (hostname.search(/cp.local/) > -1) {
		domain_name = hostname;
	}

	expiry_str = '';
	path_str = '; path=/';
	domain_str = '; domain='+domain_name;
	if(expiry_days) {
		var d = new Date();
		d.setDate(d.getDate() + expiry_days);
		expiry_str = ';expires=' + d.toGMTString();
	}
	
	document.cookie = name + '=' + escape(value) + expiry_str + path_str + domain_str;
}


/**
 * Gets the value of the cookie from the user's browser
 * 
 * @param name of the cookie
 * @return value of the cookie, null if the cookie isn't found
 */
function getCookie(name)
{
	var s = document.cookie.indexOf(name + "=");
	if(s == -1) {
		return null;
	}
	s += name.length + 1;
	var e = document.cookie.indexOf(";", s);
	if(e == -1) {
		e = document.cookie.length;
	}
	return unescape(document.cookie.substring(s, e));
}

/* 
The following checks for and records if a visitor is new or is a return visitor -- for A/B testing T&T
*/
if (!getCookie ('cpvisitor')) { 
	setCookie('cpvisitorsession', 'true', ''); 
	setCookie ('cpvisitor', 'new', 2400); 
} else { 
	if (!getCookie ('cpvisitorsession')) { 
		if ((getCookie ('cpvisitor')) == 'new') {
			setCookie ('cpvisitor', 'new', -1); 
			setCookie ('cpvisitor', 'return', 2400); 
		}			
	}
}


/* 
The following checks for and records the OAST source code present in a URL clicked on from a creative asset on an external site
*/

var qsParm = new Array();
function qs() {
var query = window.location.search.substring(1);
var parms = query.split('&');
	for (var i=0; i<parms.length; i++) {
	var pos = parms[i].indexOf('=');
		if (pos > 0) {
		var key = parms[i].substring(0,pos);
		var val = parms[i].substring(pos+1);
		qsParm[key] = val;
		}
	}
} 

qsParm['oast'] = null;
qs();

if (qsParm['oast'] != null) {
	if (getCookie ('oast')) { 
		setCookie ('oast', '', -1);
		setCookie ('oast', qsParm['oast'], 2400);
	} else {
		setCookie ('oast', qsParm['oast'], 2400);
	}
}


// -- BrowserID (cpBROWSERID)
browserid = getCookie('cpBROWSERID');
if (browserid == '-1' || browserid == "null" || browserid == null) {
	//Generate a GUID
	browserid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) { var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8); return v.toString(16); });
	try {
		setCookie('cpBROWSERID', browserid, 365);
	} catch (e){}
}


if(typeof jsAPI === 'undefined') {
	jsAPI = {};
}

jsAPI.showHTMLElements = function() {
	$('#membershipOptionsPrimary, #membershipOptions_real, #membershipOptions_other, #membershipOptionsSecondary, #membershipOptions_ca').css({"visibility":"visible"});
} 


jsAPI.mboxBackground = function() {
	try{
		$('#content').css({
			'background' : '#417DC5'
		});
		
		var IE7 =  ($.browser.msie  && parseInt($.browser.version) == 7);
		if (IE7){
			if ($('#membershipOptionsPrimary').length > 0){
				$('#membershipOptionsPrimary').css({
					'background' : 'url(/images/pricing_bg_ca_ie7.png) 0 0 no-repeat',
					'height':'135px',
					'margin': '8px 0 0 -14px'
				});	
			}
		} else{
			if ($('#membershipOptionsPrimary').length > 0){
				$('#membershipOptionsPrimary').css({
					'background' : 'url(/images/pricing_bg_ca_b.png) 0 0 no-repeat',
					'height':'135px',
					'margin': '8px 0 0 -14px'
				});	
			}
		}
		
		if ($('#membershipOptions_other').length > 0){
			$('#membershipOptions_other').css({
				'background' : 'url(/images/pricing_bg_ca_b.png) 0 0 no-repeat'
			});	
		}
		
		if ($('#membershipOptions_ca').length > 0){
			$('#membershipOptions_ca').css({
				'background' : 'url(/images/pricing_bg_ca_a.png) 0 0 no-repeat',
				'height':'154px',
				'margin-left': '-15px'
			});
		}
		
		if ($('#membershipOptions_real').length > 0){
			$('#membershipOptions_real').css({
				'background' : 'url(/images/pricing_bg_ca_b.png) 0 0 no-repeat',
				'height':'135px',
				'margin-left': '-15px'
			});	
		}		

		
		if ($('#content .padd').length > 2) {
			//euro style template with no padding
			$('#membershipOptions_other').css({
				'height':'135px',
				'margin': '8px 0 20px 15px'
			});	
		} else {
			//ar style template with padding already in place
			if (!$($('#membershipOptions_other').parent()).hasClass('padd')){
				$('#membershipOptions_other').css({
					'height':'135px',
					'margin': '8px 0 20px 15px'
				});	
			} else {
				$('#membershipOptions_other').css({
					'height':'135px',
					'margin': '8px 0 20px -15px'
				});	
			}
		}
	
		if ($('#content .padd').length > 1) {
			$($('#content .padd')[0]).css({
				'background' : '#fefde1',
				'border-bottom' : '3px solid #013A69'
			});
			var lastPad = $($('#content .padd')[($('#content .padd').length-1)]);
			if (lastPad.find('object').length == 0) {
				//last pad container doesn't contains flash
				lastPad.css({
					'background' : '#fff',
					'border-top' : '3px solid #013A69',
					'margin-top' : '25px'
				});
			} else {
				//last pad container contains both flash and purchase image
				if (lastPad.find('#membershipOptionsSecondary').length > 0) {
					$('#membershipOptionsSecondary').wrap('<div class="temporary-div" />');
					$('#content .padd').css({
						'padding-bottom':0
					});
				}
				
			}
		}

	}catch(e){}
}

	;
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
};

if (typeof CP === 'undefined') {
    CP = {};
}
CP.runningVars = {
    layoutDirty: true,
    isTouchDevice: false,
    cleanWidth: 0,
    firstLoad: true,
    langDir: ""
};

(function($) {

    CP.agegate = function(isGated, cutoffYear, langDir) {
        CP.runningVars.cutoffYear = cutoffYear;
        CP.runningVars.isGated = isGated;
        CP.runningVars.langDir = langDir;
        $.extend(true, this.options, {});
        this.load();
    };

    CP.agegate.prototype.initListeners = function() {
        var self = this;
        var htmltext = "";
        var hideContinue = false;

        $('#agegate label').live("click", function() {
            if (!$(this).hasClass('option')) {
                $(this).hide();
            }
        });

        $("#agegate input").live("focus", function() {
            //Hide label
            if (!$("label[for='" + $(this).attr('id') + "']").hasClass('option')) {
                $("label[for='" + $(this).attr('id') + "']").hide();
            }
        });

        $("#agegate input").live("blur", function() {
            var value = $(this).val();
            if (value == "") {
                $("label[for='" + $(this).attr('id') + "']").css('display', 'inline-block');
            }
            $("#tip-box").html('');
            $("#tip-box").hide();
        });

        //agegate -- Gated Link Pressed
        $('.agegated-link').live('mousedown', function() {
            CP.runningVars.clickedLink = this;
            CP.runningVars.pendingUrl = $(this).attr("href");
            CP.runningVars.interstitialText = $(this).attr("rel");
            CP.runningVars.interstitialData = $(this).data();
            if (typeof CP.runningVars.interstitialText == 'undefined') {
                CP.runningVars.interstitialText = false;
            }

            CP.runningVars.visitorAge = getCookie('cpvisitor-yob') || null;
            if (!(CP.runningVars.isGated || self.isLinkGated(CP.runningVars.pendingUrl))
                || (CP.runningVars.visitorAge != null && parseInt(CP.runningVars.visitorAge) <= CP.runningVars.cutoffYear)) {

                //show interstitial
                self.showAgegate(function() {

                    $('#modal-window #modal-close').hide();
                    $('#agegate .question').hide();
                    $('#agegate .sorry').hide();
                    if (CP.runningVars.interstitialData) {
                        if (CP.runningVars.interstitialData.interstitial_title) {
                            $('#agegate h3.interstitial').html(CP.runningVars.interstitialData.interstitial_title);
                        }

                        if (CP.runningVars.interstitialData.interstitial_text) {
                            $('#agegate #interstitial').html(CP.runningVars.interstitialData.interstitial_text);
                        }

                        if (CP.runningVars.interstitialData.interstitial_cancel) {
                            $('#agegate #cancel').html(CP.runningVars.interstitialData.interstitial_cancel);
                        }

                        if (CP.runningVars.interstitialData.interstitial_ok) {
                            if (CP.runningVars.interstitialData.interstitial_ok == 'hide') {
                                hideContinue = true;
                            } else {
                                $('#agegate #continue').html(CP.runningVars.interstitialData.interstitial_ok);
                            }
                        }

                        if (CP.runningVars.interstitialData.interstitial_class) {
                            $('#agegate').addClass(CP.runningVars.interstitialData.interstitial_class);
                        }
                    } else if (CP.runningVars.interstitialText) {
                        htmltext = CP.runningVars.interstitialText.split("|");
                        if (htmltext.length >= 2) {
                            $('#agegate h3.interstitial').html(htmltext[0]);
                            $('#agegate #interstitial').html(htmltext[1]);
                            //custom text for cancel button
                            if (htmltext.length >= 3) {
                                $('#agegate #cancel').html(htmltext[2]);
                            }
                            //custom text for ok button
                            if (htmltext.length >= 4) {
                                if (htmltext[3] == 'hide') {
                                    hideContinue = true;
                                } else {
                                    $('#agegate #continue').html(htmltext[3]);
                                }
                            }
                            //add class to the agegate wrapper
                            if (htmltext.length >= 5) {
                                $('#agegate').addClass(htmltext[4]);
                            }
                        }
                    }

                    try {
                        var clickedLinkUrl = CP.runningVars.clickedLink.href.split('/');
                        if (clickedLinkUrl.length > 2) {
                            clickedLinkUrl = clickedLinkUrl[0] + '/' + clickedLinkUrl[1] + '/' + clickedLinkUrl[2];
                        } else {
                            clickedLinkUrl = clickedLinkUrl[0];
                        }
                    } catch (e) {
                        clickedLinkUrl = ""
                    };
                    var newText = $('#interstitial').text().replace('%1', clickedLinkUrl);
                    $('#interstitial').text(newText);

                    $('#agegate .interstitial').show();
                    $('#agegate #cancel').show();
                    if (hideContinue) {
                        $('#agegate #continue').hide();
                    } else {
                        $('#agegate #continue').show();
                    }
                    $('#agegate #submit').hide();
                });
                return false;
            } else {
                //show age gate question
                self.showAgegate(function() {
                    $('#modal-window #modal-close').hide();
                    $('#agegate .question').show();
                    $('#agegate .sorry').hide();
                    $('#agegate .interstitial').hide();
                    $('#agegate #cancel').hide();
                    $('#agegate #continue').hide();
                    $('#agegate #submit').show();
                });
                return false;
            }
        }).live('click', function() {
            return false
        });

        // Age gate -- submit date
        $('#agegate #submit').live('click', function() {

            var month = $('#agegate #edit-month').val();
            var day = $('#agegate #edit-day').val();
            var year = $('#agegate #edit-year').val();
            if (month.length == 0 || month <= 0 || month > 31 //for ease of implementing MM/DD/YYYY and DD/MM/YYYY we just reverse the labels.
                || day.length == 0 || day <= 0 || day > 31 //for ease of implementing MM/DD/YYYY and DD/MM/YYYY we just reverse the labels.
                || year.length == 0 || year <= 1900 || year >= 2100) {
                $('#agegate h3').css({
                    'color': '#f00'
                });
            } else {
                $('#agegate h3').css({
                    'color': '#fff'
                });
                //write cookie
                setCookie('cpvisitor-yob', year, null);
                if (parseInt(year) < parseInt(CP.runningVars.cutoffYear)) {

                    $('#agegate .question').fadeOut(200, function() {
                        if (CP.runningVars.interstitialText) {
                            htmltext = CP.runningVars.interstitialText.split("|");
                            if (htmltext.length >= 2) {
                                $('#agegate h3.interstitial').html(htmltext[0]);
                                $('#agegate #interstitial').html(htmltext[1]);
                            }
                            //custom text for cancel button
                            if (htmltext.length >= 3) {
                                $('#agegate #cancel').html(htmltext[2]);
                            }
                            //custom text for ok button
                            if (htmltext.length >= 4) {
                                $('#agegate #continue').html(htmltext[3]);
                            }
                            //add class to the agegate wrapper
                            if (htmltext.length >= 5) {
                                $('#agegate').addClass(htmltext[4]);
                            }

                        }

                        try {
                            var clickedLinkUrl = CP.runningVars.clickedLink.href.split('/');
                            if (clickedLinkUrl.length > 2) {
                                clickedLinkUrl = clickedLinkUrl[0] + '/' + clickedLinkUrl[1] + '/' + clickedLinkUrl[2];
                            } else {
                                clickedLinkUrl = clickedLinkUrl[0];
                            }
                        } catch (e) {
                            clickedLinkUrl = ""
                        };
                        var newText = $('#interstitial').text().replace('%1', clickedLinkUrl);
                        $('#interstitial').text(newText);

                        $('#agegate .interstitial').fadeIn(200);
                        $('#agegate #submit').hide();
                        $('#agegate #cancel').show();
                        $('#agegate #continue').show();
                    });

                } else {
                    $('#agegate .question').fadeOut(200, function() {
                        $('#agegate .sorry').fadeIn(200);
                        $('#agegate #submit').hide();
                        $('#agegate #cancel').show();
                    });
                }
            }
        });

        // Age gate -- insterstitial answers
        $('#agegate #continue').live('click', function() {
            CP.runningVars.modal.close();
            window.location.href = CP.runningVars.pendingUrl;
        });

        $('#agegate #cancel').live('click', function() {
            CP.runningVars.modal.close();
        });
    };

    CP.agegate.prototype.initLinks = function(selector) {
        selector = selector || 'a';
        //determine external links
        $(selector).each(function(i, link) {
            var isExternal = (link.href.indexOf('clubpenguin.com') < 0 &&
                link.href.indexOf('cpassets-a') < 0 &&
                link.href.indexOf('cpsslassets-a') < 0 &&
                link.href.indexOf('clubpenguin.de') < 0 &&
                link.href.indexOf('clubpenguinimg') < 0 &&
                link.href.indexOf('clubpenguin-island') < 0 &&
                link.href.indexOf('clubpenguinisland') < 0 &&
                link.href.indexOf('disneycareers.com') < 0 &&
                link.href.indexOf('disneytermsofuse.com') < 0 &&
                link.href.indexOf('disneyprivacycenter.com') < 0 &&
                link.href.indexOf('clubpenguinoffer.com') < 0 &&
                link.href.indexOf('clubpenguintv.com') < 0 &&
                link.href.indexOf('getclubpenguin.com') < 0 &&
                link.href.indexOf('tryclubpenguin.com') < 0 &&
                link.href.indexOf('www.disneylatino.bumeran.com.ar') < 0 &&
                link.href.indexOf('disney.com') < 0 &&
                link.href.indexOf('localhost') < 0 &&
                link.href.indexOf('cp.local') < 0 &&
                link.href.indexOf('javascript:') < 0 &&
                link.href.indexOf('#nogo') < 0 &&
                link.href.indexOf('mailto:') < 0 &&
                !$(link).hasClass("ui-selectmenu") &&

                link.href.length > 0 &&
                link.href.indexOf('204.') < 0);
            if (isExternal) {
                if (link.href.indexOf("?nochrome=1") < 0) {
                    $(link).addClass('agegated-link');
                    $(link).attr('target', '_blank');
                }
            }

        });
    };
    
    //Is this link age gated for all users (not just specific regions)
    //ie twitter.
    CP.agegate.prototype.isLinkGated = function(href) {
        var isGated = (href.indexOf('twitter.com') >= 0)
        return isGated;
    };

    CP.agegate.prototype.initModal = function() {
        $("#modal-overlay").remove();
        $("#modal-loading").remove();
        $("#modal-window").remove();

        CP.runningVars.modal = new CP.utils.Modal({
            showClose: false,
            contentCloseDelegate: '.modal-close',
            onOpenComplete: function() {},
            onCloseComplete: function() {},
            onCloseStart: function() {},
            onOpenStart: function() {}
        });
    };

    CP.agegate.prototype.showAgegate = function(openCallback, closeCallback) {
        var host = window.location.host;
        // if (host.indexOf("play") > -1) {
        //     host = host.replace("play","www");
        // }
        var url = window.location.protocol + "//" + host + CP.runningVars.langDir + "/geoip/agegate-overlay";

        // Allow Cross Domain
        $.ajaxPrefilter( function(options, originalOptions, jqXHR) {
            options.crossDomain = { crossDomain: true };
            options.xhrFields = { withCredentials: true };
        });

        // Get Agegate Overlay
        $.ajax({
            type: "GET",
            url: url,
            success: function(overlay) {
                //open modal
                if (!closeCallback) closeCallback = null;
                if (!openCallback) openCallback = null;
                CP.runningVars.modal.open(overlay, openCallback, closeCallback);
            }
        });
    };

    CP.agegate.prototype.load = function() {
        var self = this;
        CP.runningVars.visitorAge = getCookie('cpvisitor-yob') || null;
        this.initLinks();
        this.initListeners();
        this.initModal();

        if (window.PIE) {
            $('.base a.button, .menu li a').each(function() {
                PIE.detach(this);
                PIE.attach(this);
            });
        }

        try {
            imgSizer.collate();
        } catch (e) {}
        CP.runningVars.firstLoad = false;
    };

})(window.jQuery);

/* ExternalInterface Functions called from CP or MP client
-----------------------------------------------------------------*/
/**
 * @function {public} launchMPGame
 * Begins trying to load MP through the snowball theme. The call to this
 * function originates from the CP client.
 * 
 * @param  {String} gameDetails Some game details from the CPClient for MP
 */
function launchMPGame(gameDetails) {
    //throw { name: 'FatalError', message: 'Something went badly wrong' };
    if (window.snowball) {
        window.snowball.loadMP(gameDetails);
    }
}

/**
 * @function {public} returnToClubPenguin
 * Begins trying to return to club penguin using the snowball theme. The call
 * to this function originates from the MP client.
 * 
 * @param  {String} commandString Some details that will be sent back to CP Client from MP
 */
function returnToClubPenguin(commandString) {
    if (window.snowball) {
        window.snowball.returnToClient(commandString);
    }
}

/**
 * @function {public} nameResubmission
 * This function is called from the CP Client when the user logging in had his/her
 * penguin name reject.
 * 
 * @param  {Number} player_id The player id
 * @param  {String} token The players auth token?
 * @param  {Object} data Some data that was passed in from the client, no idea.
 */
function nameResubmission(player_id, token, data) {
    var newHostname = location.hostname.replace("play", "secured");
    var newProtocol = ((newHostname.indexOf("sandbox") >= 0) ? "http" : "https");
    var langPath = window.snowball ? window.snowball.getLangPath() : '/';
    var href = newProtocol + "://" + newHostname + langPath + "penguin/update-username/" + player_id + "/" + token + "/" + data;
    Disney.Play.showModal(href);
}

/* BANNERS
-----------------------------------------------------------------*/

/**
 * @function {public} showActivationBanner
 * Checks to see if the activation banner should be displayed.
 * Display the banner accordingly.
 * 
 * @param {Number} hoursRemaining The number of hours remaining in the penguins activation
 */
function showActivationBanner(hoursRemaining) {
    if (window.snowball) {
        window.snowball.handleDisplayBanner('activation', {'hoursRemaining': hoursRemaining});
    }
    jQuery("#pre-activated-banner-btn").click(function(e) {
        e.preventDefault();
        if (window.snowball) {
            window.snowball.handleShowActivation();
        }
    });
}

/**
 * @function {public} showMembershipBanner
 * Checks to see if the membership banner should be displayed.
 * Display the banner accordingly.
 * 
 * @param {String} swid The Penguins StarWave id
 */
function showMembershipBanner(swid) {
    var request = jQuery.ajax({
        url: "http://" + location.hostname + "/web-service/membership",
        type: "POST",
        data: {'swid':swid},
        success: function(result) {
            if (result.membershipExpiring) {
                if (result.showBanner) {
                    if (window.snowball) {
                        window.snowball.handleDisplayBanner('membership', {'daysRemaining': result.daysRemaining});
                    }
                }
            }
        }
    });
}

/**
 * @function {public} showRules
 * Display Club Penguin rules. Triggered from client.
 * 
 * @param  {String} lang A two character language code like 'en' or 'de'
 */
function showRules(lang) {
    // Calls into the Disney.CP pre-port functionality.
    var newBaseUrl = location.hostname;
    var href = "http://" + newBaseUrl;
    href = lang != 'en' ? href + '/' + lang : href;
    window.cp.showRules(href);
}

/**
 * @function {public} goBack
 * Tells the browser to go back one step in the browsers history.
 */
function goBack() {
    window.history.back();
};
if (typeof CP === 'undefined') {
	CP = {};
}

/**
 * @class  Error
 */

/**
 * @constructor Error
 * @param {object} details The error object from PHP
 */
CP.Error = function(details) {
	this.code = details.code;
	this.header = details.header;
	this.headerTag = details.headerTag;
	this.message = details.message;
	this.messageTag = details.messageTag;
	this.links = details.links;

	this.errorTextClass = "errorText";
}

/**
 * @function {public} render
 * Render the header, message, and links and return the result.
 *
 * @return {object} The jQuery object with header, message, and links
 */
CP.Error.prototype.render = function() {
	// header
	var header = this.renderHeader();
	var message = this.renderMessage();
	var links = this.renderLinks();

	var textElement = jQuery("<div>").attr({
		id: this.code,
		'class': this.errorTextClass
	});

	return jQuery(textElement).append(jQuery(header).after(jQuery(message))).after(jQuery(links));
}

/**
 * @function {private} renderHeader
 * Renders the header text wrapped in the header tag.
 *
 * @return {object} jQuery object with the header wrapped in the header tag.
 */
CP.Error.prototype.renderHeader = function() {
	return this.renderElement(this.headerTag, this.header);
}

/**
 * @function {private} renderMessage
 * Renders the message text wrapped in the message tag.
 *
 * @return {object} jQuery object with the message wrapped in the message tag.
 */
CP.Error.prototype.renderMessage = function() {
	return this.renderElement(this.messageTag, this.message);
}

/**
 * @function {private} renderElement
 * Create a jQuery object with the tag and content (text).
 *
 * @param  {String} tag     A tag such as '<div>' or '<h1>'
 * @param  {String} content The content (text) to be set as the html
 * @return {object} jQuery object with the content wrapped in the tag.
 */
CP.Error.prototype.renderElement = function(tag, content) {
	return jQuery(tag).html(content);
}

/**
 * @function {private} renderLinks
 * Creates a jQuery object filled with links
 *
 * @return {object} jQuery object filled with links.
 */
CP.Error.prototype.renderLinks = function() {
	var links = jQuery('<div>');
	for (var i = 0; i < this.links.length; i++) {
		if (this.links[i].type == 'img') {
			var img = jQuery('<img>').attr({
				src: this.links[i].label
			});
			var link = jQuery('<a>').attr({
				id: this.links[i].id,
				href: this.links[i].href
			});
			jQuery(links).append(jQuery(link).append(img));
		} else {
			jQuery(links).append(jQuery('<a>').attr('id', this.links[i].id).text(this.links[i].label));
		}
	}
	return jQuery(links);
};
if (typeof CP === 'undefined') {
	CP = {};
}

(function($) {
	/**
	 * @class Banner
	 * This class is used to show Activation and Membership banners.
	 * The client makes a call to an external JS function in external.js
	 * which in turn creates a banner and executes the {@link CP.Banner.display() display()}
	 * function.
	 */
	/**
	 * @constructor Banner
	 * Setup the render functions so the banner can be displayed later.
	 * Here are the currently implemented banner render functions:
	 * <ol>
	 *   <li>{@link CP.Banner.renderActivation renderActivation()}</li>
	 *   <li>{@link CP.Banner.renderMembership renderMembership()}</li>
	 * </ol>
	 * @param {String} type The type of Banner. Possible values: 'membership', 'activation'
	 * @param {object} options The options for the banner, E.g. {daysRemaining: 3}
	 */
	CP.Banner = function(type, options) {
		this.options = {};
		$.extend(true, this.options, options);
		var self = this;

		/**
		 * The type of banner, so far only 'activation' and 'membership'
		 * @type {String}
		 */
		this.type = type;

		/**
		 * These are the functions that will be called when rendering out each
		 * different {@link CP.Banner.type type} of banner.
		 * @type {Object}
		 */
		this.renderFunctions = {
			'activation' : function(){self.renderActivation()},
			'membership' : function(){self.renderMembership()}
		};

		this.bannerId = 'banner';
	};

	/**
	 * @function {public} display
	 * Starts to dsiplay the banner. Fires the following this this order:
	 * <ol>
	 *   <li>{@link CP.Banner.beforeRender beforeRender()}</li>
	 *   <li>{@link CP.Banner.render render()}</li>
	 *   <li>{@link CP.Banner.afterRender afterRender()}</li>
	 * </ol>
	 */
	CP.Banner.prototype.display = function() {
		if (this.beforeRender()) {
			this.render();
			this.afterRender();
		}
	};

	/**
	 * @function {private} beforeRender
	 * Runs before the rendering of the Banner
	 * <ol>
	 *   <li>Shows the Banner Container</li>
	 * </ol>
	 * @return {Boolean} True if we should render the banner, False otherwise.
	 */
	CP.Banner.prototype.beforeRender = function() {
		this.cleanUp();

		// $('#affiliateheaderforcp').height(28);
		//$('#club_penguin').height('95%');
		// $('#hdrWrap').attr("style", "height:28px !important");

		return true;
	};

	/**
	 * @function {private} render
	 * Renders the banner function that was set earlier in the constructor.
	 * Only will execute if we set the function earlier.
	 */
	CP.Banner.prototype.render = function() {
		if (this.renderFunctions[this.type] !== undefined) {
			this.renderFunctions[this.type]();
		}
	};

	/**
	 * @function {private} afterRender
	 * Makes any final adjustments to the banner container
	 */
	CP.Banner.prototype.afterRender = function() {
		// if ($.browser.msie && parseInt($.browser.version, 10) === 7) {
		// 	$('#BannerContainer').height(28);
		// } else {
		// 	$('#BannerContainer').animate({height: '+28'}, 1000);
		// }
	};

	/**
	 * @function {private} cleanUp
	 * Removes any content in the banner that already exists.
	 * This is just in case the client makes two calls to the banners.
	 */
	CP.Banner.prototype.cleanUp = function() {
		$('#' + this.bannerId).empty();
		$('#' + this.bannerId).show();
	};

	/**
	 * @function {private} renderActivation
	 * Render the pre-activation banner. It will attach the banner to the id specified by
	 * {@link CP.Banner.bannerId bannerId}. This will be rendered if one of the following
	 * conditions apply:
	 * <ol>
	 *   <li>It's the last day of the user's pre-activation</li>
	 *   <li>The user has a certain amount of days left in pre-activation status</li>
	 *   <li>The user has a certain amount of hours left in pre-activation status</li>
	 * </ol>
	 */
	CP.Banner.prototype.renderActivation = function() {
		var countDown = Drupal.settings.snowball_banner.preActivationLastDay;

		if (this.options.hoursRemaining > 24) {
			var daysRemaining = Math.ceil(this.options.hoursRemaining / 24);
			countDown = Drupal.settings.snowball_banner.preActivationDaysRemaining.replace('%daysRemaining%', daysRemaining);
		} else if (this.options.hoursRemaining > 1) {

			countDown = Drupal.settings.snowball_banner.preActivationHoursRemaining.replace('%hoursRemaining%', this.options.hoursRemaining);
		}
		$('#' + this.bannerId).append($("<span>").html(countDown));
		$('#' + this.bannerId).append($("<a>").attr({'id':'pre-activated-banner-btn', 'href':'javascript:void(0);'}).html(Drupal.settings.snowball_banner.preActivationAbout));

	};

	/**
	 * @function {private} renderMembership
	 * Render the membership banner. It will attach the banner to the id specified by
	 * {@link CP.Banner.bannerId bannerId}. This will be rendered if one of the following
	 * conditions apply:
	 * <ol>
	 *   <li>It's the last day of the user's membership</li>
	 *   <li>The user has a certain amount of days left in membership</li>
	 * </ol>
	 */
	CP.Banner.prototype.renderMembership = function() {

		var countDown = Drupal.settings.snowball_banner.membershipLastDay;

		if (this.options.daysRemaining > 1) {
			countDown = Drupal.settings.snowball_banner.membershipDaysRemaining.replace('%daysRemaining%', this.options.daysRemaining);
		}
		$('#' + this.bannerId).append($("<span>").html(countDown));
		$('#' + this.bannerId).append($("<a>").attr({'href':'https://secured.clubpenguin.com/membership/', 'target':'_blank'}).html(Drupal.settings.snowball_banner.membershipAbout));

	};

})(window.jQuery);;
//To allow cross sub domain scripting
document.domain = window.location.hostname;
var Disney = Disney || {};
Disney.Play = Disney.Play || {};
Disney.Membership = Disney.Play; //Alias used by lightbox close

/* Definitions
-----------------------------------------------------------------*/
(function($){

    /* Disney CP
    -------------------------------------------------*/
    Disney.CP = function(){
        this.currentIndex = 0;
    };

    /**
     * @function {public} showRules
     * This function will display the rules of the club penguin game.
     * 
     * @param  {String} baseUrl A url such as 'http://www.clubpenguin.com'
     */
    Disney.CP.prototype.showRules = function(baseUrl) {
        var rulesUrl = '/club-penguin-rules';
        var fullUrl = baseUrl + rulesUrl;
        Disney.Play.showModal(fullUrl);
    };

    Disney.Play.initModal = function() {
        Disney.Play.modal = new CP.utils.Modal({
            overlayClickClose: false, //too easy to accidentally close the lightbox with no way to reopen.
            contentCloseDelegate: '.modal-close',
            onOpenComplete: function() {},
            onCloseComplete: function() {},
            onCloseStart: function() {},
            onOpenStart: function() {}
        });
    };

    Disney.Play.showModal = function(url) {
        var rdm = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) { var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8); return v.toString(16); });
        html = '<iframe id="modal-iframe" src="'+url+'?'+rdm+'" height="500" width="500" allowtransparency="true" marginheight="0" marginwidth="0" frameborder="0" style="overflow:hidden;" style="visibility:hidden;" onload="this.style.visibility = \'visible\';"=></iframe>';
        jQuery('.modal-close').css({"display": "none", "top": "12px", 'right': '39px'});
        jQuery('#modal-content').html(html).css({'top': '-2000px', 'position': 'relative'});
        jQuery('#modal-window').append(jQuery("#preload-gif").html());
        jQuery('#modal-window img:last').css({'top': '47%', 'left': '47%', 'position': 'fixed'});

        jQuery('iframe#modal-iframe').load(function() {
            jQuery('#modal-content').css({"top": "0", 'position': 'relative'});
            jQuery('#modal-window img:last').remove();
            jQuery('.modal-close').css({"display": "block", "top": "12px", 'right': '39px'});
        });

        Disney.Play.modal.showClose = false;
        Disney.Play.modal.open(null, null, Disney.Play.closeModalCallback);
    };
  
    Disney.Play.closeModalCallback = function() {
        if (Disney.Play.newName && window.snowball) {
            try {
                window.snowball.handleNameResubmit(Disney.Play.newName, Disney.Play.newToken, Disney.Play.newLoginData);
            } catch(e){}
        }
    };

    Disney.Play.get_browser = function() {
        var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
        if(/trident/i.test(M[1])){
            tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
            return 'IE '+(tem[1]||'');
            }   
        if(M[1]==='Chrome'){
            tem=ua.match(/\bOPR\/(\d+)/)
            if(tem!=null)   {return 'Opera '+tem[1];}
            }   
        M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
        return M[0];
    }

    Disney.Play.get_browser_version = function() {
        var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];                                                                                                                         
        if(/trident/i.test(M[1])){
            tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE '+(tem[1]||'');
            }
        if(M[1]==='Chrome'){
            tem=ua.match(/\bOPR\/(\d+)/)
            if(tem!=null)   {return 'Opera '+tem[1];}
            }   
        M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
        return M[1];
    }    

    /* Document ready
    -----------------------------------------------------------------*/
    $(document).ready(function(e){
        window.cp = new Disney.CP();
        //// Initializations
        Disney.Play.newName = false;
        Disney.Play.newLoginData = false;
        Disney.Play.newToken = false;
        Disney.Play.initModal();
    });

})(window.jQuery);
;
if (typeof CP === 'undefined') {
	CP = {};
}

/**
 * @class  CP.FlashClient
 */

/**
 * @constructor CP.FlashClient
 * @param {object} options An object with key value pairs from drupal.
 * @param {object} friendsClient A CP.FriendsClient object that we will use to load friends later.
 */
CP.FlashClient = function(options, friendsClient) {

	this.options = {};
	jQuery.extend(true, this.options, options);

	/**
	 * The friends (controller) client for the flash client
	 * @var {private object} friendsClient
	 */
	this.friendsClient = friendsClient;

	/**
	 * The ID for the swf that will be loaded
	 * @var {private String} od
	 */
	this.id = "cp_flash";

	/**
	 * This logout class is the CSS class that is attached to the logout link.
	 * We can show / hide this based on the state of the cpClient.
	 * @type {Boolean} logoutClass
	 */
	this.logoutClass = 'logout';

	/**
	 * The DOM Element that holds the flash client
	 * @var {private Object} domElement
	 */
	this.domElement = null;

	/**
	 * This will monitor whether or not the flash client needs to be unloaded.
	 * @type {Boolean} _cleanedUp
	 */
	this._cleanedUp = false;

};

/**
 * @function {public} getElement
 * Creates the element that will be used to house the mp client
 * @return {object} a jQuery object that is a div with an ID set
 */
CP.FlashClient.prototype.getElement = function() {

	if (!this.domElement) {
		this.domElement = jQuery("<div>").attr('id', this.id);
	}
	return this.domElement;
}

/**
 * @function {public} load
 * Attempts to load the FlashClient
 * <ul>
 *   <li>{@link CP.FlashClient.beforeRender beforeRender()}</li>
 *   <li>{@link CP.FlashClient.render render()}</li>
 *   <li>{@link CP.FlashClient.afterRender afterRender()}</li>
 * </ul>
 * @param  {Boolean} forceLoad Pass through to {@link CP.FlashClient.beforeRender beforeRender}
 *                             in order to accomodate bypassing flash checks
 * @return {Object} A {@link CP.Result CP.Result} object;
 */
CP.FlashClient.prototype.load = function(forceLoad) {

	var result = this.beforeRender(forceLoad);
	if (!result.hasError) {
		this.render();
		this.afterRender();
	}
	return result;
};

/**
 * @function {private} beforeRender
 * Runs before rendering the Flash Client. Does the following:
 * <ul>
 *   <li>{@link CP.FlashClient.validateFlashVersion validateFlashVersion(minimumVersion, recommendedVersion)}</li>
 *   <li>load the swfaddress.js file into the &lt;head&gt;</li>
 *   <li>tells the friendsClient to load</li>
 * </ul>
 *
 * @param  {Boolean} forceLoad True if we should skip checking the flash version. False otherwise.
 * @return {Object} A {@link CP.Result CP.Result} object;
 */
CP.FlashClient.prototype.beforeRender = function(forceLoad) {
	var result = new CP.Result();
	if (!forceLoad) {
		result = CP.FlashClient.validateFlashVersion(this.options.minimumSwfVersion, this.options.recommendedSwfVersion);
	}

	if (!result.hasError) {
		this.friendsClient.load();
	}
	this.loadSwfAddressJS();
	return result;
};

/**
 * @function {private} loadSwfAddressJS
 * Load the SwfAddress into the &lt;head&gt; of the document.
 * This is done like this because if we load it on the landing page, and then we change
 * the hash to say '/login', swfaddress doesn't like that there is no swf yet, since we 
 * load the flash client dynamically and swfaddress will start saying, "oopz, errors!"
 */
CP.FlashClient.prototype.loadSwfAddressJS = function () {
	var attributes = {
		'type' : 'text/javascript',
		'src' : this.options.swfAddressUrl
	}
	var scriptElement = jQuery("<script>").attr(attributes);

	// Append to dom
	jQuery("head").append(scriptElement);
};

/**
 * @function {private} render
 * Creates the &lt;object&gt; for the club penguin swf and attaches it to the DOM
 */
CP.FlashClient.prototype.render = function() {
	var swfUrl = this.options.loadSwf;
	var swfID = this.id;
	var swfWidth = "100%";
	var swfHeight = "100%";

	var flashVars = {
		play: this.options.baseUrl,
		client: this.options.clientDirectory,
		content: this.options.contentDirectory,
		games: this.options.gamesDirectory,
		connectionID: this.options.connectionID,

		a: this.options.affStyle,
		p: this.options.promotionString,

		nau: jQuery.trim(getCookie('nau')),
		nal: jQuery.trim(getCookie('nal')),
		nas: jQuery.trim(getCookie('nas')),
		nad: jQuery.trim(getCookie('nad')),

		lang: Drupal.settings.snowball.language,
		phrasechat: this.options.phraseChatUrl,

		isAS3WebServicesOn: true,
		cacheVersion: this.options.cacheVersion,
		clientVersion: this.options.clientVersion,
		configVersion: this.options.configVersion,
		contentVersion: this.options.contentVersion,
		minigameVersion: this.options.minigameVersion
	};

	var params = {
		menu: "false",
		quality: "high",
		allowscriptaccess: "always",
		wmode: "transparent"
	};

	var attributes = {
		"id": this.id,
		"name": this.id,
		"class": "disney_land_clubpenguin_player"
	};
	swfobject.switchOffAutoHideShow();
	swfobject.embedSWF(swfUrl, swfID, swfWidth, swfHeight, this.options.minimumSwfVersion, this.options.expressInstallSwfUrl, flashVars, params, attributes);
	this.show();
	//throw { name: 'FatalError', message: 'Something went badly wrong' };
};

/**
 * @function {private} afterRender
 * Executes after the Flash Client has been rendered. Bet you didn't guess that!
 * This function only gets called if you successfully complete a {@link CP.FlashClient.render render}
 * call.
 */
CP.FlashClient.prototype.afterRender = function() {
};

/**
 * @function {public} hide
 * Hides the Flash Client (we don't actually change the display or visiibility
 * option in CSS cause it forces the flash to reload when changing that
 * property)
 */
CP.FlashClient.prototype.hide = function() {
	//Move it as far off the screen as we can.
	jQuery("#" + this.id).css("left", "-9999px");
	jQuery("body").removeClass("flash");
};

/**
 * @function {public} show
 * Shows the Flash Client
 * <ul>
 * 	<li>just resets the position</li>
 * </ul>
 */
CP.FlashClient.prototype.show = function() {
	//Put the classic client back to it's normal position
	jQuery("#" + this.id).css('left', '0px');
	// This helps move the footer and any other styles when we are playing the flash game
	jQuery("body").addClass("flash");
	// make sure the logout button is shown
	jQuery("." + this.logoutClass).css('display', 'inline-block');
};

/**
 * @function {public} handleMPInstanceClose
 * This function is used to tell the flash client that MP has closed.
 *
 * @param  {String} commandString Any data that MP will be sending back to the flash clients.
 */
CP.FlashClient.prototype.handleMPInstanceClose = function(commandString) {
	try {
		jQuery("#" + this.id)[0].handleMPInstanceClose(commandString);
	} catch (error) {}
}

/**
 * @function {public} handleNameResubmit
 * Sends the name resubmission back to the client.
 *
 * @param  {String} newName The new name the user picked.
 * @param  {String} newToken The user's auth token
 * @param  {Object} newLoginData Dunno what this data specifically is.
 */
CP.FlashClient.prototype.handleNameResubmit = function(newName, newToken, newLoginData) {
	jQuery("#" + this.id)[0].handleNameResubmit(newName, newToken, newLoginData);
}

/**
 * @function {public} handleShowActivation
 * Signals to the client that the "about activation" link was clicked.
 */
CP.FlashClient.prototype.handleShowActivation = function() {
	jQuery("#" + this.id)[0].handleShowPreactivation();
}

/**
 * @function {public} handleLogOff
 * This function is used to tell the flash client to log off. It is called when
 * the user clicks a link, or clicks the logoff button or something like that.
 *
 * @param  {String} href The url of the link that was actually clicked.
 */
CP.FlashClient.prototype.handleLogOff = function(href) {
	try {
		jQuery("#" + this.id)[0].handleLogOff(href);
		this._cleanedUp = true;
	} catch (error) {}
}

/**
 * @function {public} handleUnload
 * This function called when the user clicks a link to leave the page, or types a
 * new URL in the address bar. The forward or backward buttons will also trigger
 * the event. Closing the browser window will also cause this to be triggered.
 */
CP.FlashClient.prototype.handleUnload = function() {
	try {
		if (!this._cleanedUp) {
			jQuery("#" + this.id)[0].handleWindowUnload();
		} else {
		}
	} catch (error) {}
}



/**
 * @function {static} validateFlashVersion
 * Checks the users flash player.
 * <ul>
 *   <li>Checks if the user has the flash player installed</li>
 *   <li>Checks if it's above the recommended version</li>
 *   <li>Checks if it's above the minimum version</li>
 * </ul>
 *
 * @return {Object} An object sth like &#123;hasError: false, error: &#123;errorObject&#125;&#125;
 */
CP.FlashClient.validateFlashVersion = function(minimumSwfVersion, recommendedSwfVersion) {
	var result = new CP.Result();

	if (swfobject.hasFlashPlayerVersion("1")) {
		if (swfobject.hasFlashPlayerVersion(recommendedSwfVersion)) {
			// return result;
		} else if (swfobject.hasFlashPlayerVersion(minimumSwfVersion)) {
			// recommending upgrade or required upgrade
			result.addError(Drupal.settings.snowball_errors.flashUpgradeRequired);
		} else {
			// Can't say "No Thanks" to minimum version upgrade
			result.addError(Drupal.settings.snowball_errors.flashMinimumRequired);
		}
	} else {
		if (window.snowball.browserType == 'Chrome') {
			result.addError(Drupal.settings.snowball_errors.flashInstallRequiredChrome);
		} else {
			result.addError(Drupal.settings.snowball_errors.flashInstallRequired);
		}
	}
	return result;
};
;
if (typeof CP === 'undefined') {
	CP = {};
}

/**
 * @class  CP.UpgradeFlashClient
 */

/**
 * @constructor CP.UpgradeFlashClient
 * @param {object} options An object with key value pairs from drupal.
 */
CP.UpgradeFlashClient = function(options) {

	this.options = {};
	jQuery.extend(true, this.options, options);

	/**
	 * The ID for the swf that will be loaded
	 * @var {private String} od
	 */
	this.id = "cp_flash_upgrade";

	/**
	 * The DOM Element that holds the upgrade flash client
	 * @var {private Object} domElement
	 */
	this.domElement = null;

};

/**
 * @function {public} getElement
 * Creates the element that will be used to house the mp client
 * @return {object} a jQuery object that is a div with an ID set
 */
CP.UpgradeFlashClient.prototype.getElement = function() {

	if (!this.domElement) {
		this.domElement = jQuery("<div>").attr('id', this.id);
	}
	return this.domElement;
}

/**
 * @function {public} load
 * Attempts to load the UpgradeFlashClient
 * <ul>
 *   <li>{@link CP.UpgradeFlashClient.beforeRender beforeRender()}</li>
 *   <li>{@link CP.UpgradeFlashClient.render render()}</li>
 *   <li>{@link CP.UpgradeFlashClient.afterRender afterRender()}</li>
 * </ul>
 * @return {Object} A {@link CP.Result CP.Result} object;
 */
CP.UpgradeFlashClient.prototype.load = function() {

	var result = this.beforeRender();
	if (!result.hasError) {
		this.render();
		this.afterRender();
	}
	return result;
};

/**
 * @function {private} beforeRender
 * Runs before rendering the Upgrade Flash Client. Does the following:
 * <ul>
 *   <li>Nothing for Now</li>
 * </ul>
 *
 * @return {Object} A {@link CP.Result CP.Result} object;
 */
CP.UpgradeFlashClient.prototype.beforeRender = function() {
	return new CP.Result();
};

/**
 * @function {private} render
 * Creates the &lt;object&gt; for the club penguin swf and attaches it to the DOM
 */
CP.UpgradeFlashClient.prototype.render = function() {
    var swfUrl = Drupal.settings.misc_game_settings.expressInstallSwfUrl;
    var swfID = this.id;
    var swfWidth = "100%";
    var swfHeight = "80%";
    var version = Drupal.settings.flash_game_settings.minimumSwfVersion;

    var flashVars = {};

    var params = {
        menu: "false",
        quality: "high",
        allowscriptaccess: "always",
        wmode: "transparent"
    };

    swfobject.embedSWF(swfUrl, swfID, swfWidth, swfHeight, version, false, flashVars, params);
    this.show();
};

/**
 * @function {private} afterRender
 * Executes after the Upgrade Flash Client has been rendered. Bet you didn't guess that!
 * This function only gets called if you successfully complete a {@link CP.UpgradeFlashClient.render render}
 * call.
 */
CP.UpgradeFlashClient.prototype.afterRender = function() {
};

/**
 * @function {public} hide
 * Hides the Upgrade Flash Client
 */
CP.UpgradeFlashClient.prototype.hide = function() {
	jQuery("body").removeClass("flashUpgrade");
};

/**
 * @function {public} show
 * Shows the Upgrade Flash Client
 */
CP.UpgradeFlashClient.prototype.show = function() {
	jQuery("body").addClass("flashUpgrade");
	this.domElement.css("visibility", "visible");
};
;
if (typeof CP === 'undefined') {
    CP = {};
}

/**
 * @class  CP.MPClient
 */

/**
 * @constructor CP.MPClient
 * @param {object} options An object with key value pairs from drupal.
 */
CP.MPClient = function(options) {
    this.options = {};
    jQuery.extend(true, this.options, options);

    /**
     * The ID for the mp client that will be loaded
     * @var {private String} id
     */
    this.id = "mp_client";

    /**
     * The background color of the MP game
     * @type {private String} bgColor
     */
    this.bgColor = "#22a4f3";

    /**
     * The DOM Element that holds the MP client
     * @var {private Object} domElement
     */
    this.domElement = null;

    /**
     * Game details that are passed over by the Client
     * @var {private Object} gameDetails
     */
    this.gameDetails = {};


    /**
     * The height threshold to switch the mp client from small to large
     * @var {private Number} heightThreshold
     */
    this.heightThreshold = 720;

};

/**
 * @function {public} getElement
 * Creates the element that will be used to house the mp client
 * @return {object} a jQuery object that is a div with an ID set
 */
CP.MPClient.prototype.getElement = function() {
    if (!this.domElement) {
        this.domElement = jQuery("<div>").attr('id',this.id);
    }
    return this.domElement;
};

/**
 * Sets the game details that are passed over by the Client
 * @param {object} gameDetails The details passed in by the client
 */
CP.MPClient.prototype.setGameDetails = function(gameDetails) {
    this.gameDetails = gameDetails;
};

/**
 * Attempts to load the MPClient
 * <ul>
 *   <li>{@link CP.MPClient.beforeRender beforeRender()}</li>
 *   <li>{@link CP.MPClient.snfRequest snfRequest()}</li>
 * </ul>
 * @param  {Boolean} forceLoad Pass through to {@link CP.MPClient.beforeRender beforeRender}
 *                             in order to accomodate bypassing flash checks
 * @return {[type]}           [description]
 */
CP.MPClient.prototype.load = function(forceLoad) {
    var result = this.beforeRender(forceLoad);
    if (!result.hasError) {
        this.snfRequest(result);
    }
    return result;
};

/**
 * @function {private} snfRequest
 * Makes the SNF Request to generate the details needed for the MP Client
 * @param  {Object} result CP.Result object
 */
CP.MPClient.prototype.snfRequest = function(result) {
    var self = this;
    this.gameDetails.worldName = this.options.productName+'_'+this.gameDetails.pid.substr(1,this.gameDetails.pid.length-2);

    jQuery.ajax({
        url: this.options.affLangDir + '/web-service/snfgenerator/session',
        type: 'POST',
        async: false,
        data: this.gameDetails,
        success: function(response) {self.onSnfSuccess(response, result);},
        error: function(jqXHR, textStatus, errorThrown) {self.onSnfError(jqXHR, textStatus, errorThrown, result)}
    });
}

/**
 * @function {private} onSnfSuccess
 * A function to be called if the request succeeds. Just a note that
 * the request may succeed, but the result sent back might have an error
 * in it, so we should always check for the error. If there are no errors it will: 
 * <ul>
 *   <li>Set the game Details</li>
 *   <li>{@link CP.MPClient.render render()}</li>
 *   <li>{@link CP.MPClient.afterRender afterRender()}</li>
 * </ul>
 * @param  {String} response The data returned from the server
 * @param  {String} textStatus  A string describing the status
 * @param  {Object} jqXHR A jqXHR object
 */
CP.MPClient.prototype.onSnfSuccess = function(response, result) {
    if (!response.hasError) {
        this.gameDetails.snfSession = response.data;
        this.render();
        this.afterRender();
    } else {
        this.setError(result);
    }
};

/**
 * @function {private} onSnfError
 * A function to be called if the request fails.
 * 
 * @param  {Object} jqXHR A jqXHR object
 * @param  {String} textStatus A string describing the type of error that occured
 * @param  {String} errorThrown an optional exception object
 * @param  {Object} result A CP.Result object to send back to snowball
 */
CP.MPClient.prototype.onSnfError = function(jqXHR, textStatus, errorThrown, result) {
    this.setError(result);
};

/**
 * Set the error that will be sent back to the snowball controller
 * @param {Object} result A CP.Result object to send back to snowball
 */
CP.MPClient.prototype.setError = function(result) {
    result.addError(Drupal.settings.snowball_errors.cjSnowSnfGenerator);
};

/**
 * @function {private} beforeRender
 * Runs before rendering the Metaplace Client. Does the following:
 * <ul>
 *   <li>{@link CP.MPClient.validateFlashVersion validateFlashVersion(minimumVersion)}</li>
 * </ul>
 *
 * @param  {Boolean} forceLoad True if we should skip checking the flash version. False otherwise.
 * @return {Object} A {@link CP.Result CP.Result} object;
 */
CP.MPClient.prototype.beforeRender = function(forceLoad) {
    var result = new CP.Result();
    if (!forceLoad) {
        result = CP.MPClient.validateFlashVersion(this.options.minimumSwfVersion);
    }
    return result;
};

/**
 * @function {private} render
 * Creates the &lt;object&gt; for the mp client swf and attaches it to the DOM
 */
CP.MPClient.prototype.render = function() {
    // Determine the size we should render out the MP client at.
    var deviceSize = this.getSize(this.gameDetails.gameHeight);
    var swfUrl = this.options.loadSwf;
    var swfID = this.id;
    var swfWidth = "100%";
    var swfHeight = "100%";

    var flashVars = {
        mpProduct: this.options.product,
        snfSession: this.gameDetails.snfSession,
        pid: this.gameDetails.pid,
        worldName: this.gameDetails.worldName,
        base_asset_url: this.options.baseAssetUrl,
        assetServer: this.options.assetServer,
        assetSeed: this.options.assetSeed,
        manifest: this.options.manifestUrl,
        devMode: "false",//this.options.devMode.toString(),
        wns: this.options.wns,
        lang: this.options.lang,
        SWF_ERRORS: this.options.SWF_ERRORS,
        SWF_LOADER: this.options.SWF_LOADER,
        queryString: encodeURIComponent('battleMode=' + this.gameDetails.data + '&base_asset_url=' + this.options.baseAssetUrl),
        DEVICE_STRING: deviceSize,
        PLACE: 'snow_lobby',
        isMuted: this.gameDetails.isMuted

    };

    var params = {
        menu: "false",
        quality: "high",
        allowscriptaccess: "always",
        wmode: "direct",
        bgColor: this.bgColor
    };

    var attributes = {
        "id": this.id,
        "name": this.id,
    };
    swfobject.embedSWF(swfUrl, swfID, swfWidth, swfHeight, this.options.minimumSwfVersion, false, flashVars, params, attributes);
    this.show();
};

/**
 * @function {private} afterRender
 * Executes after the Flash Client has been rendered. Bet you didn't guess that!
 * This function only gets called if you successfully complete a {@link CP.MPClient.render render}
 * call.
 */
CP.MPClient.prototype.afterRender = function() {
};

/**
 * @function {public} hide
 * Hiding the MP Client results in it being destroyed. There
 * is no hiding and bringing back.
 */
CP.MPClient.prototype.hide = function() {
    jQuery("body").removeClass("mp" + this.getSize(this.gameDetails.gameHeight));
    this.destroy();
};

/**
 * @function {public} show
 * Will add the mp class to the body
 */
CP.MPClient.prototype.show = function() {
    // This helps move the footer and any other styles when we are playing a mp game
    jQuery("body").addClass("mp" + this.getSize(this.gameDetails.gameHeight));
};

/**
 * This will get the string of the size of MP
 * @param  {Number} height The number representing the size of the game container
 * @return {String} Either "large" or "small"
 */
CP.MPClient.prototype.getSize = function(height) {
    var className = "large";
    if (height != undefined && height < this.heightThreshold) {
        className = "small";
    }
    return className;
}

/**
 * @function {private} destroy
 * Removes the SWF and Element from the page.
 */
CP.MPClient.prototype.destroy = function() {
    // remove the swf
    swfobject.removeSWF(this.id);
    jQuery('#'+this.id).remove();
};

/**
 * @function {static} validateFlashVersion
 * Checks the users flash player.
 * <ul>
 *   <li>Checks if it's above the minimum version</li>
 * </ul>
 *
 * @return {Object} An object sth like &#123;hasError: false, error: &#123;errorObject&#125;&#125;
 */
CP.MPClient.validateFlashVersion = function(minimumSwfVersion) {
    var result = new CP.Result();

    if (!swfobject.hasFlashPlayerVersion(minimumSwfVersion)) {
        // Say that you MUST upgrade, then we'll end up returning to Club Penguin Flash (later)
        result.addError(Drupal.settings.snowball_errors.cjSnowFlashUpgradeRequired);
    }
    return result;
};;
if (typeof CP === 'undefined') {
	CP = {};
}

/**
 * @class  CP.FriendsClient
 * Since 100% of the friends client code is handled through 
 * ostrta.js (attaching other css, and js files etc), this class
 * is used just to attach the ostrta.js into the &lt;head&gt; of the 
 * page. If someone tries to load it twice, it will fail since we 
 * keep track if it was added to the page or not.
 */

/**
 * @constructor CP.FriendsClient
 * @param {string} friendsUrl The Url of the disney-friends-ostrta-min.js file.
 */
CP.FriendsClient = function(friendsUrl) {

	/**
	 * The Url of the disney-friends-ostrta-min.js file
	 * @type {string} friendsUrl
	 */
	this.friendsUrl = friendsUrl;

	/**
	 * This will monitor whether or not the ostrta.js file was previously
	 * added to the &lt;head&gt; or not.
	 * @type {Boolean} _initialized
	 */
	this._initialized = false;
};

/**
 * @function {public} load
 * Attempts to load the FriendsClient
 * <ul>
 *   <li>{@link CP.FriendsClient.beforeInitialized beforeInitialized()}</li>
 *   <li>{@link CP.FriendsClient.initialize initialize()}</li>
 * </ul>
 * @return {[type]}           [description]
 */
CP.FriendsClient.prototype.load = function() {
	if (!this._initialized) {
		if (this.beforeInitialize()) {
			this.initialize();
		}
	}
};

/**
 * @function {private} beforeRender
 * Runs before initializing the friends client. Does the following:
 * <ul>
 *   <li>nothing</li>
 * </ul>
 * @return {Boolean} True if we should initialize, false otherwise
 */
CP.FriendsClient.prototype.beforeInitialize = function(forceLoad) {
	if (this.friendsUrl == '') {
		//throw { name: 'FriendsError', message: 'The friends client URL ostrta was not provided' };
		return false;
	}
	return true;
};

/**
 * @function {private} initialize
 * Attaches the ostrta file to the head element in the DOM.
 */
CP.FriendsClient.prototype.initialize = function() {
	var attributes = {
		'type' : 'text/javascript',
		'charset' : 'utf-8',
		'src' : this.friendsUrl
	}
	var scriptElement = jQuery("<script>").attr(attributes);

	// Append to dom
	jQuery("head").append(scriptElement);

	this._initialized = true;
};


;
if (typeof CP === 'undefined') {
    CP = {};
}

(function($) {

    /**
     * @class CP.Result
     */

    /**
     * @constructor CP.Result
     */
    CP.Result = function() {
        this.hasError = false;
        this.error = undefined;
    };

    /**
     * @function {public} addError
     * @param {object} error The error object that was passed in by drupal
     */
    CP.Result.prototype.addError = function(error) {
        this.hasError = true;
        this.error = error;
    }

    /**
     * @class  CP.snowball
     */

    /**
     * @constructor CP.snowball
     *
     * Handles the snowball theme.
     * This theme is specifically designed for the PLAY page.
     * It controls the flash client and mp.
     *
     * URLs hashcodes handled:
     * <ul>
     *     <li>/start</li>
     *     <li>/login</li>
     *     <li>/redeem</li>
     *     <li>/upgrade</li>
     *     <li>/create</li>
     * </ul>
     *
     * @param  {object} options Additional objects containing properties to merge in
     */
    CP.snowball = function(options) {
        this.options = {};
        $.extend(true, this.options, options);
        var self = this;

        /**
         * This is whether or not we should bypass the validation for 
         * seeing if a flash version is high enough to load CP
         * @var {Boolean} forceLoad
         */
        this.forceLoad = false;

        /**
         * These are functions that will be called when the hashcodes are
         * determined and the state then gets processed. If you want
         * to add another hashcode, just add the name of it here, then
         * add a corresponding function at the bottom of this file.
         * @var {Object} renderFunctions
         */
        this.renderFunctions = {
            '/start': function() {
                window.location.href = self.url.attr('base') + self.url.attr('directory');
            },
            '/login': function() {
                self.flow = "game";
                self.loadCP(self.forceLoad);
            },
            '/redeem': function() {
                self.flow = "redeem";
                self.loadCP(false);
            },
            '/upgrade': function() {
                self.loadUpgradeFlash();
            },
            '/create': function() {
                self.renderCreate();
            }
        };

        /**
         * This is the ID of the header element that will be
         * 'unhidden' if the user is viewing the game through an affiliate
         * @var {String} affiliateHeaderId
         */
        this.affiliateHeaderId = 'affiliate-header';

        /**
         * This is the element that the CP Flash client will sit inside.
         * @var {String} gameContainerId
         */
        this.gameContainerId = 'D_F_GameSection';

        /**
         * The Game Container DOM Element that is the parent for CP and MP.
         * @var {Object} gameContainerElement
         */
        this.gameContainerElement = undefined;


        /**
         * The Friends client controller.
         * This object is essentially just a wrapper for the friends client,
         * so we can pass it around to other game clients. This friends client will
         * just keep track of things like if the friends client JS was added to the
         * top of the page or not. If it's not and it's needed, then we add it to the
         * DOM, otherwise, we just continue on like normal cause we know it's already
         * loaded.
         * @var {object} friendsClient
         */
        this.friendsClient = undefined;

        /**
         * The Club Penguin client.
         * If you do a check and this is defined then we know the object has
         * been created and that the  dom element has already been appended
         * into the game container.
         * See: {@link CP.FlashClient CP.FlashClient()}
         * @var {Object} cpClient
         */
        this.cpClient = undefined;

        /**
         * The Upgrade Flash Client.
         * See: {@link CP.UpgradeFlashClient CP.UpgradeFlashClient()}
         * @var {Object} upgradeFlashClient
         */
        this.upgradeFlashClient = undefined;

        /**
         * The MP client.
         * Just like the {@link CP.snowball.cpClient cpClient} If you do a
         * check and this is defined then we know the object has been created
         * and that the  dom element has already been appended into the game
         * container.
         * See: {@link CP.MPClient CP.MPClient()}
         * @var {Object} mpClient
         */
        this.mpClient = undefined;

        /**
         * We have to make sure that the listeners only get initialized once.
         * Once they are intialized, we set this value to true to prevent
         * the listeners being called more than once.
         * @type {Boolean} _listenersInitialized
         */
        this._listenersInitialized = false;


        /**
         * We will hold generic "chrome", "firefox", "ie" in this property
         * or empty string if it is not set
         * @type {string}
         */
        this.browserType = Disney.Play.get_browser();
    };

    /**
     * @function {public} getLangPath
     * Gets the language path from the drupal settings that were passed over.
     * For English it will return '/', For other languages: '/ru/', '/pt/', etc.
     *
     * @return {String} The path. e.g. '/' for English, '/de/' for German.
     */
    CP.snowball.prototype.getLangPath = function() {
        return Drupal.settings.snowball.langPath;
    };

    /**
     * @function {public} load
     *
     * Preprocesses the page then initializes:
     * <ol>
     *   <li>Header</li>
     *   <li>Main</li>
     *   <li>Footer</li>
     *   <li>BI tracking????</li>
     *   <li>Listeners</li>
     * </ol>
     * @param {Boolean} isInitalRequest True if it's the initial page load. False otherwise.
     */
    CP.snowball.prototype.load = function(isInitialRequest) {
        this.preProcess(isInitialRequest);
        this.initHeader();
        this.initMain();
        this.initFooter();
        this.initListeners();
    };

    /**
     * @function {private} preProcess
     * This function is called before we start to intialize the different parts
     * on the page. It was originally created so that we could catch if we were
     * loading the page for the first time or if we were in a hash change, allowing
     * us to go back to the landing page ('/start'). It also loads the friends client.
     *
     * @param  {Boolean} isInitialRequest True if it's the initial page load. False otherwise.
     */
    CP.snowball.prototype.preProcess = function(isInitialRequest) {
        this.url = $.url(); // init the PURL url for use within the language, and main areas.

        // Get the hashcode fragment and strip any slashes at the end of the url
        this.fragment = this.url.attr('fragment').replace(/\/*$/, "");

        // Hit the back button while playing CP, trying to go back to the landing page
        // which is the billboards.
        if (!isInitialRequest && this.fragment == '') {
            this.fragment = '/start';

            // If we have a client initialized, we should try to log the user off.
            if (this.cpClient) {
                this.cpClient.handleLogOff();
            }
        }

        // Set up the friends client
        this.friendsClient = new CP.FriendsClient(Drupal.settings.misc_game_settings.friendsUrl);
    }



    /* HEADER
    ------------------------------------------------------------------*/

    /**
     * @function {private} initHeader
     * Initialize:
     * <ul>
     *   <li>affiliate header</li>
     *   <li>language selector</li>
     * </ul>
     */
    CP.snowball.prototype.initHeader = function() {
        this.initAffiliateHeader();
        this.initLanguageMenu();
        this.initNotifications();
    };

    /**
     * @function {private} initAffiliateHeader
     * Set the page up to display the affiliate banner.
     * <ul>
     *   <li>add the affiliate body class</li>
     *   <li>display the hidden affiliate header</li>
     * </ul>
     */
    CP.snowball.prototype.initAffiliateHeader = function() {
        //if (Drupal.settings.snowball.affStyle != 0) {
        var pCookie = getCookie('p');
        if (pCookie && pCookie != '1') {
            $("body").addClass("affiliate");
            $("#" + this.affiliateHeaderId).show();
        }
    };

    /**
     * @function {private} initLanguageMenu
     * Initialize the language menu.
     * Sets the click handler and the mouse leave functionality.
     */
    CP.snowball.prototype.initLanguageMenu = function() {
        var self = this;
        self.languageToggleHeight = -($('#bottom-languages').height() + 1);

        var query = self.url.attr('query');
        query = query != '' ? '?' + query : '';

        // Add the hash code to the language options (if we are on a hash'ed page)
        $('#bottom-languages a').each(function() {
            var _href = $(this).attr('href');

            var regex = /\/#\/(\w+)/g;
            if (_href.search(regex) == -1) {
                $(this).attr('href', _href + query + window.location.hash);
            } else {
                var fragment = self.url.attr('fragment');
                $(this).attr('href', _href.replace(regex, '/#' + fragment));
            }
        });

        // Language Selector Toggle
        $('#language-select a.top-level').click(function(e) {
            e.preventDefault();
            $(this).addClass('active');
            $('#bottom-languages').css('display', 'block');
        });
        $('#language-select').mouseleave(function() {
            $('a.top-level').removeClass('active');
            $('#bottom-languages').hide();
        });
    };

    /**
     * @function {private} initNotifications
     * Initialize tweaks to ticker notifications
     */
    CP.snowball.prototype.initNotifications = function() {
        var self = this;
        this.notificationArea = $( '#notification-area' );
        if ( self.notificationArea.length ) {
            // Drop our close button into place
            self.notificationArea.find( '.block-content-wrap' )
                .prepend( "<a id='notification-close' href='#'><span>Close</span></a>" );
            // Click listener
            $( '#notification-close' ).click( function(e) {
                e.preventDefault();
                self.notificationArea.slideToggle();
            });
        }
    };

    /* MAIN
    ------------------------------------------------------------------*/

    /**
     * @function {private} initMain
     * Initialize the MAIN element in the DOM
     * Makes calls in the following order:
     * <ul>
     *   <li>{@link CP.snowball.beforeRenderMain beforeRenderMain()}</li>
     *   <li>{@link CP.snowball.renderMain renderMain()}</li>
     *   <li>{@link CP.snowball.afterRenderMain afterRenderMain()}</li>
     * </ul>
     */
    CP.snowball.prototype.initMain = function() {
        if (this.beforeRenderMain()) {
            this.renderMain();
            this.afterRenderMain();
        }
    };

    /**
     * @function {private} beforeRenderMain
     * Before initializing the MAIN element in the DOM
     * <ul>
     *   <li>Does nothing now</li>
     * </ul>
     *
     * @return {Boolean} True if main should be rendered. False otherwise.
     */
    CP.snowball.prototype.beforeRenderMain = function() {
        return true;
    };

    /**
     * @function {private} renderMain
     * Renders out the function for the hashcode.
     * See {@link CP.snowball.renderFunctions renderFunctions} for
     * a list of fragments to functions.
     */
    CP.snowball.prototype.renderMain = function() {
        try {
            if (this.renderFunctions[this.fragment] !== undefined) {
                this.renderFunctions[this.fragment]();
            }
        } catch (error) {
            this.displayInGameError(Drupal.settings.snowball_errors.general);
        }
    };

    /**
     * @function {private} afterRenderMain
     * Finishes anything in the MAIN DOM element.
     */
    CP.snowball.prototype.afterRenderMain = function() {
        $('main section').show();
    };

    /* CP FLASH
    ------------------------------------------------------------------*/

    /**
     * @function {private} loadCP
     * Begins the process of loading the CP client.
     * Makes calls in the following order:
     *
     * @param  {Boolean} forceLoad True if we should skip checking the flash version. False otherwise.
     */
    CP.snowball.prototype.loadCP = function(forceLoad) {
        this.prepareMainContainer();

        if (this.upgradeFlashClient) {
            this.upgradeFlashClient.hide();
        }

        this.cpClient = this.getClient('flash');
        this.appendClient(this.cpClient);

        var result = this.cpClient.load(forceLoad);
        if (result.hasError) {
            this.displayError(result.error);
            delete this.cpClient;
        }

        //throw { name: 'FatalError', message: 'Something went badly wrong' };
    };


    /**
     * @function {public} getClient
     * Creates a flash client object and returns it.
     *
     * @return {Object} a CP.FlashClient object.
     */
    CP.snowball.prototype.getClient = function(type) {
        if (!type) {
            type = 'flash';
        }

        var options = {};
        switch (type) {
            case 'flash' : 
                $.extend(true, options, Drupal.settings.flash_game_settings, Drupal.settings.misc_game_settings, Drupal.settings.snowball);
                return new CP.FlashClient(options, this.friendsClient);
            case 'upgrade' : 
                $.extend(true, options, Drupal.settings.flash_game_settings, Drupal.settings.misc_game_settings, Drupal.settings.snowball);
                return new CP.UpgradeFlashClient(options);
            case 'mp' : 
                $.extend(true, options, Drupal.settings.mp_game_settings, Drupal.settings.misc_game_settings);
                return new CP.MPClient(options);
        }
    };

    /**
     * @function {private} appendClient
     * Sticks the client element into the DOM, so the client can use
     * the element to inject itself into the page.
     *
     * @param  {object} client An object like FlashClient or MPClient
     */
    CP.snowball.prototype.appendClient = function(client) {
        $(this.gameContainerElement).append(client.getElement());
    };

    /**
     * @function {private} prepareMainContainer
     * Cleans up the MAIN DOM element to allow the game to load or
     * the flash upgrade swf to load. Does the following:
     * <ul>
     *   <li>removes billboards, actions, errors</li>
     *   <li>adds a new game container to the MAIN dom element if it doesn't exist</li>
     *   <li>empties the game container if it already exists</li>
     * </ul>
     */
    CP.snowball.prototype.prepareMainContainer = function() {

        // Empty main area for the game container
        $("#billboards, #actions, #error").remove();

        // create the game container 
        if (!this.gameContainerElement) {
            this.gameContainerElement = $('<section>').attr('id', this.gameContainerId);
            $("main#content").append($(this.gameContainerElement));
        } else {
            // Clear out the game container
            this.gameContainerElement.empty();
        }

    };

    /* MP
    ------------------------------------------------------------------*/

    /**
     * @function {public} loadMP
     * Load the mp client
     * @param  {object} gameDetails Details sent over by the client.
     */
    CP.snowball.prototype.loadMP = function(gameDetails) {
        gameDetails.gameHeight = parseInt(this.gameContainerElement.height());

        // Hide the flash client
        if (this.cpClient) {
            this.cpClient.hide();
        }

        if (!this.mpClient) {
            this.mpClient = this.getClient('mp');
            this.mpClient.setGameDetails(gameDetails);
            this.appendClient(this.mpClient);
        }

        var loadResult = this.mpClient.load(false);
        if (loadResult.hasError) {
            this.displayInGameError(loadResult.error);
        }
    };

    /**
     * @function {public} returnToClient
     * Gets called after the MP client closes for whatever reason
     *
     * @param  {String} commandString (optional) The string from the MP Client
     */
    CP.snowball.prototype.returnToClient = function(commandString) {
        // Get rid of mpclient
        if (this.mpClient) {
            this.mpClient.hide();
            delete this.mpClient;
        }

        // Bring the client back
        if (this.cpClient) {
            this.cpClient.show(commandString);
            this.cpClient.handleMPInstanceClose(commandString);
        }
    };

    /**
     * @function {public} handleNameResubmit
     * Sends the name resubmission back to the client.
     *
     * @param  {String} newName The new name the user picked.
     * @param  {String} newToken The user's auth token
     * @param  {Object} newLoginData Dunno what this data specifically is.
     */
    CP.snowball.prototype.handleNameResubmit = function(newName, newToken, newLoginData) {
        if (this.cpClient) {
            this.cpClient.handleNameResubmit(newName, newToken, newLoginData);
        }
    };

    /**
     * @function {public} handleShowActivation
     * Signals to the client that the "about activation" link was clicked.
     */
    CP.snowball.prototype.handleShowActivation = function() {
        if (this.cpClient) {
            this.cpClient.handleShowActivation();
        }
    };

    /**
     * @function {public} handleDisplayBanner
     * Displays a notification banner to be shown to the user
     * @param  {String} type A type of banner like 'activation' or 'membership'
     * @param  {[type]} options An object with banner options.
     */
    CP.snowball.prototype.handleDisplayBanner = function(type, options) {
        new CP.Banner(type, options).display();
        $("body").addClass("membershipBanner");
    };

    /* UPGRADE FLASH
    ------------------------------------------------------------------*/

    /**
     * @function {private} loadUpgradeFlash
     * This function will render out the upgrade flash client
     */
    CP.snowball.prototype.loadUpgradeFlash = function () {

        // Empties / creates the main game container
        this.prepareMainContainer();

        // if the cpClient already exists, we should nuke it so next time
        // we try to load the client without a page refresh, it will append 
        // back into the DOM
        delete this.cpClient;

        this.upgradeFlashClient = this.getClient('upgrade');
        this.appendClient(this.upgradeFlashClient);

        var result = this.upgradeFlashClient.load();
        if (result.hasError) {
            this.displayError(result.error);
            delete this.upgradeFlashClient;
        }
    };

    /**
     * @function {private} render
     * "Renders" the create link which really just relocates the user
     * to the create page. https://secured.clubpenguin.com/penguin/create
     */
    CP.snowball.prototype.renderCreate = function() {
        // Redirect to the create page.
        window.location = Drupal.settings.misc_game_settings.createUrl + "/" + this.flow;
    };

    /* FOOTER
    ------------------------------------------------------------------*/

    /**
     * @function {private} initFooter
     * Initialize the Javascript for the footer of the page
     */
    CP.snowball.prototype.initFooter = function() {};

    /* UTILS
    ------------------------------------------------------------------*/

    /**
     * @function {private} displayError
     * Render the Error div to the page.
     *
     * @param  {object} errorDetails The object sent by drupal which
     * contains properties such as code, message, header etc.
     */
    CP.snowball.prototype.displayError = function(errorDetails) {
        var errorElement = $("<div>").attr("id", "error").append(new CP.Error(errorDetails).render());
        $(this.gameContainerElement).append(errorElement);
    };

    /**
     * @function {private} displayInGameError
     * Render the In Game Error div to the page.
     *
     * @param  {object} errorDetails The object sent by drupal which
     * contains properties such as code, message, header etc.
     */
    CP.snowball.prototype.displayInGameError = function(errorDetails) {
        var errorId = 'ingame-error';
        var errorElement = $("<div>").attr({
            "id": errorId
        }).append(new CP.Error(errorDetails).render());
        $(this.gameContainerElement).append(errorElement);

        // Add the click handlers to close the error and return to the game.
        var self = this;
        $('#' + errorId + ' a').click(function() {
            self.returnToClient();
            $(errorElement).remove();
        });
    };

    /**
     * @function {private} initListeners
     * Listens for clicks on the elements in the DOM. If the user clicks something
     * we should may have to send something to the client if need be, etc.
     * Also listen for the window unloading.
     */
    CP.snowball.prototype.initListeners = function() {

        // Make sure that the listeners only get initialized once
        if (!this._listenersInitialized) {

            var self = this;

            // Force clean up of the flash object during logoff
            $('a').click(function() {
                // If client exists, use the client to handle the logoff then redirect
                if (self.cpClient && $(this).attr("href") !== '#') {
                    self.cpClient.handleLogOff($(this).attr("href"));
                    return true;
                }
                return true;
            });

            // or if the user closes the window
            $(window).unload(function() {
                if (self.cpClient) {
                    self.cpClient.handleUnload();
                }
            });

            // This is a bit of a hack to make the 
            // ignore button function the same as the login
            $("#ignore-button").live("click", function () {
                  self.forceLoad = true;
                  $(window).trigger("hashchange");
            });

            this._listenersInitialized = true;
        }
    }

})(window.jQuery);

window.jQuery(document).ready(function($) {
    window.snowball = new CP.snowball();
    window.snowball.load(true);

    // Hash Change Binding
    $(window).bind("hashchange", function(event) {
        window.snowball.load(false);
    });
});
;
