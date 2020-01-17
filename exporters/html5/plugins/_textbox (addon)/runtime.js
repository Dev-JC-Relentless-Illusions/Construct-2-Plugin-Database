﻿// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.TextBoxAddon = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	var pluginProto = cr.plugins_.TextBoxAddon.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	
	var instanceProto = pluginProto.Instance.prototype;
	
	var elemTypes = ["text", "password", "email", "number", "tel", "url"];
	
	// IE9 doesn't recognise the last four form types and crashes, so set them to 'text'.
	if (navigator.userAgent.indexOf("MSIE 9") > -1)
	{
		elemTypes[2] = "text";
		elemTypes[3] = "text";
		elemTypes[4] = "text";
		elemTypes[5] = "text";
	}

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// Not supported in DC
		if (this.runtime.isDomFree)
		{
			cr.logexport("[Construct 2] Textbox plugin not supported on this platform - the object will not be created");
			return;
		}
		
		if (this.properties[7] === 6)	// textarea
		{
			this.elem = document.createElement("textarea");
			jQuery(this.elem).css("resize", "none");
		}
		else
		{
			this.elem = document.createElement("input");
			this.elem.type = elemTypes[this.properties[7]];	
		}

		this.elem.className = this.properties[9];
		jQuery(this.elem).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");
		this.elem["autocomplete"] = "off";
		this.elem.value = this.properties[0];
		this.elem["placeholder"] = this.properties[1];
		this.elem.title = this.properties[2];
		this.elem.disabled = (this.properties[4] === 0);
		this.elem["readOnly"] = (this.properties[5] === 1);
		this.elem["spellcheck"] = (this.properties[6] === 1);
		
		this.autoFontSize = (this.properties[8] !== 0); // PlayLive
		this.element_hidden = false;
		
		if (this.properties[3] === 0)
		{
			jQuery(this.elem).hide();
			this.visible = false;
			this.element_hidden = true;
		}

		// Properties TextBoxAddon Start
		if (this.properties[19] && this.properties[20])
		{
			var webfont = document.createElement("link");
			webfont.href = this.properties[19];
			webfont.rel = "stylesheet";
			webfont.type = "text/css";
			document.getElementsByTagName('head')[0].appendChild(webfont);
			this.elem.style.fontFamily = this.properties[20];
		} else
		{
			// "[bold|italic] 12pt Arial"
			var arr = this.properties[10].split(" ");
			var i;
			for (i = 0; i < arr.length; i++)
			{
				// Ends with 'pt'
				if (arr[i].substr(arr[i].length - 2, 2) === "pt")
				{
					var ptSize = parseInt(arr[i].substr(0, arr[i].length - 2));
					
					this.elem.style.fontSize = ptSize + "pt"
					var j;
					var font = "";
					for (j = i+1; j < arr.length; j++)
					{
						if (font !== "")
							font = font + " " + arr[j];
						else
							font = arr[j];
					}
					this.elem.style.fontFamily = font;

					if (i > 0)
					{
						if ( arr[0] === "bold" )
							this.elem.style.fontWeight = "bold";
						else
							this.elem.style.fontStyle = arr[0]
						
						if ( i > 1 ) 
							this.elem.style.fontStyle = arr[1]
					}
					break;
				}
			}
		}

		this.elem.style.color = this.properties[11];
		this.elem.style.textAlign = ["left","center","right"][this.properties[12]];
		this.elem.style.verticalAlign = ["top","center","bottom"][this.properties[13]];
		this.elem.style.backgroundColor = this.properties[14] ? "transparent" : this.properties[21];
		this.elem.style.border = this.properties[15] ? this.properties[22] : "none";
		this.elem.style.textDecoration = ["no","underline","line-through","overline"][this.properties[16]];
		if (this.properties[17])
			this.elem.style.textShadow = this.properties[25] ? this.properties[25] : "3px 3px 5px rgba(0,0,0,.5)";
		this.elem.style.textTransform = ["no","capitalize","lowercase","uppercase"][this.properties[18]];
		if(this.properties[23]) {
			this.elem.style.borderRadius = (this.properties[23]);
			this.elem.style.outline = 0;
		}
		this.elem.style.padding = (this.properties[24]);
		// Properties TextBoxAddon End
		
		var onchangetrigger = (function (self) {
			return function() {
				self.runtime.trigger(cr.plugins_.TextBoxAddon.prototype.cnds.OnTextChanged, self);
			};
		})(this);
		
		this.elem["oninput"] = onchangetrigger;
		
		// IE doesn't trigger oninput for 'cut'
		if (navigator.userAgent.indexOf("MSIE") !== -1)
			this.elem["oncut"] = onchangetrigger;
		
		this.elem.onclick = (function (self) {
			return function(e) {
				e.stopPropagation();
				self.runtime.isInUserInputEvent = true;
				self.runtime.trigger(cr.plugins_.TextBoxAddon.prototype.cnds.OnClicked, self);
				self.runtime.isInUserInputEvent = false;
			};
		})(this);
		
		this.elem.ondblclick = (function (self) {
			return function(e) {
				e.stopPropagation();
				self.runtime.isInUserInputEvent = true;
				self.runtime.trigger(cr.plugins_.TextBoxAddon.prototype.cnds.OnDoubleClicked, self);
				self.runtime.isInUserInputEvent = false;
			};
		})(this);

		this.elem.onfocus = (function (self) {
			return function(e) {
				e.stopPropagation();
				self.runtime.isInUserInputEvent = true;
				self.runtime.trigger(cr.plugins_.TextBoxAddon.prototype.cnds.OnFocus, self);
				self.runtime.isInUserInputEvent = false;
			};
		})(this);

		this.elem.onblur = (function (self) {
			return function(e) {
				e.stopPropagation();
				self.runtime.isInUserInputEvent = true;
				self.runtime.trigger(cr.plugins_.TextBoxAddon.prototype.cnds.OnBlur, self);
				self.runtime.isInUserInputEvent = false;
			};
		})(this);

		// Prevent touches reaching the canvas
		this.elem.addEventListener("touchstart", function (e) {
			e.stopPropagation();
		}, false);
		
		this.elem.addEventListener("touchmove", function (e) {
			e.stopPropagation();
		}, false);
		
		this.elem.addEventListener("touchend", function (e) {
			e.stopPropagation();
		}, false);
		
		// Prevent clicks being blocked
		jQuery(this.elem).mousedown(function (e) {
			e.stopPropagation();
		});
		
		jQuery(this.elem).mouseup(function (e) {
			e.stopPropagation();
		});
		
		// Prevent key presses being blocked by the Keyboard object
		jQuery(this.elem).keydown(function (e) {
			if (e.which !== 13 && e.which != 27)	// allow enter and escape
				e.stopPropagation();
		});
		
		jQuery(this.elem).keyup(function (e) {
			if (e.which !== 13 && e.which != 27)	// allow enter and escape
				e.stopPropagation();
		});
		
		this.lastLeft = 0;
		this.lastTop = 0;
		this.lastRight = 0;
		this.lastBottom = 0;
		this.lastWinWidth = 0;
		this.lastWinHeight = 0;
			
		this.updatePosition(true);
		
		this.runtime.tickMe(this);
	};
	
	instanceProto.saveToJSON = function ()
	{
		return {
			"text": this.elem.value,
			"placeholder": this.elem.placeholder,
			"tooltip": this.elem.title,
			"disabled": !!this.elem.disabled,
			"readonly": !!this.elem.readOnly,
			"spellcheck": !!this.elem["spellcheck"]
		};
	};
	
	instanceProto.loadFromJSON = function (o)
	{
		this.elem.value = o["text"];
		this.elem.placeholder = o["placeholder"];
		this.elem.title = o["tooltip"];
		this.elem.disabled = o["disabled"];
		this.elem.readOnly = o["readonly"];
		this.elem["spellcheck"] = o["spellcheck"];
	};
	
	instanceProto.onDestroy = function ()
	{
		if (this.runtime.isDomFree)
				return;
		
		jQuery(this.elem).remove();
		this.elem = null;
	};
	
	instanceProto.tick = function ()
	{
		this.updatePosition();
	};
	
	instanceProto.updatePosition = function (first)
	{
		if (this.runtime.isDomFree)
			return;
		
		var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);
		
		var rightEdge = this.runtime.width / this.runtime.devicePixelRatio;
		var bottomEdge = this.runtime.height / this.runtime.devicePixelRatio;
		
		// Is entirely offscreen or invisible: hide
		if (!this.visible || !this.layer.visible || right <= 0 || bottom <= 0 || left >= rightEdge || top >= bottomEdge)
		{
			if (!this.element_hidden)
				jQuery(this.elem).hide();
				
			this.element_hidden = true;
			return;
		}
		
		// Truncate to canvas size
		if (left < 1)
			left = 1;
		if (top < 1)
			top = 1;
		if (right >= rightEdge)
			right = rightEdge - 1;
		if (bottom >= bottomEdge)
			bottom = bottomEdge - 1;
		
		var curWinWidth = window.innerWidth;
		var curWinHeight = window.innerHeight;
			
		// Avoid redundant updates
		if (!first && this.lastLeft === left && this.lastTop === top && this.lastRight === right && this.lastBottom === bottom && this.lastWinWidth === curWinWidth && this.lastWinHeight === curWinHeight)
		{
			if (this.element_hidden)
			{
				jQuery(this.elem).show();
				this.element_hidden = false;
			}
			
			return;
		}
			
		this.lastLeft = left;
		this.lastTop = top;
		this.lastRight = right;
		this.lastBottom = bottom;
		this.lastWinWidth = curWinWidth;
		this.lastWinHeight = curWinHeight;
		
		if (this.element_hidden)
		{
			jQuery(this.elem).show();
			this.element_hidden = false;
		}
		
		var offx = Math.round(left) + jQuery(this.runtime.canvas).offset().left;
		var offy = Math.round(top) + jQuery(this.runtime.canvas).offset().top;
		jQuery(this.elem).css("position", "absolute");
		jQuery(this.elem).offset({left: offx, top: offy});
		jQuery(this.elem).width(Math.round(right - left));
		jQuery(this.elem).height(Math.round(bottom - top));
		
		if (this.properties[8] == 1)
			jQuery(this.elem).css("font-size", ((this.layer.getScale(true) / this.runtime.devicePixelRatio) - 0.2) + "em");
		if (this.properties[8] == 2)
			jQuery(this.elem).css("font-size", ((this.layer.getScale(true) / this.runtime.devicePixelRatio) - 0.25) + "em");
		if (this.properties[8] == 3)
			jQuery(this.elem).css("font-size", ((this.layer.getScale(true) / this.runtime.devicePixelRatio) - 0.15) + "em");
		if (this.properties[8] == 4)
			jQuery(this.elem).css("font-size", ((this.layer.getScale(true) / this.runtime.devicePixelRatio) - 0.1) + "em");
	};
	
	// only called if a layout object
	instanceProto.draw = function(ctx)
	{
	};
	
	instanceProto.drawGL = function(glw)
	{
	};
	
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		propsections.push({
			"title": "TextBoxAddon",
			"properties": [
				{"name": "Text", "value": this.elem.value},
				{"name": "Placeholder", "value": this.elem["placeholder"]},
				{"name": "Tooltip", "value": this.elem.title},
				{"name": "Enabled", "value": !this.elem.disabled},
				{"name": "Read-only", "value": !!this.elem["readOnly"]},
				{"name": "Spellcheck", "value": !!this.elem["spellcheck"]}
			]
		});
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		switch (name) {
		case "Text":				this.elem.value = value;			break;
		case "Placeholder":			this.elem["placeholder"] = value;	break;
		case "Tooltip":				this.elem.title = value;			break;
		case "Enabled":				this.elem.disabled = !value;		break;
		case "Read-only":			this.elem["readOnly"] = value;		break;
		case "Spellcheck":			this.elem["spellcheck"] = value;	break;
		}
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	
	Cnds.prototype.CompareText = function (text, case_)
	{
		if (this.runtime.isDomFree)
			return false;
		
		if (case_ === 0)	// insensitive
			return cr.equals_nocase(this.elem.value, text);
		else
			return this.elem.value === text;
	};
	
	Cnds.prototype.OnTextChanged = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnClicked = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnDoubleClicked = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnFocus = function ()
	{
		return true;
	};

	Cnds.prototype.OnBlur = function ()
	{
		if(this.elem != document.activeElement) return true;
	};

	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};
	
	Acts.prototype.SetText = function (text)
	{
		if (this.runtime.isDomFree)
			return;
		
		this.elem.value = text;
	};
	
	Acts.prototype.SetPlaceholder = function (text)
	{
		if (this.runtime.isDomFree)
			return;
		
		this.elem.placeholder = text;
	};
	
	Acts.prototype.SetTooltip = function (text)
	{
		if (this.runtime.isDomFree)
			return;
		
		this.elem.title = text;
	};
	
	Acts.prototype.SetVisible = function (vis)
	{
		if (this.runtime.isDomFree)
			return;
		
		this.visible = (vis !== 0);
	};
	
	Acts.prototype.SetEnabled = function (en)
	{
		if (this.runtime.isDomFree)
			return;
		
		this.elem.disabled = (en === 0);
	};
	
	Acts.prototype.SetReadOnly = function (ro)
	{
		if (this.runtime.isDomFree)
			return;
		
		this.elem.readOnly = (ro === 0);
	};
	
	Acts.prototype.SetFocus = function ()
	{
		if (this.runtime.isDomFree)
			return;
		
		this.elem.focus();
	};
	
	Acts.prototype.SetBlur = function ()
	{
		if (this.runtime.isDomFree)
			return;
		
		this.elem.blur();
	};
	
	Acts.prototype.SetCSSStyle = function (p, v)
	{
		if (this.runtime.isDomFree)
			return;
		
		jQuery(this.elem).css(p, v);
	};

	Acts.prototype.AppendText = function(param)
	{
		if (cr.is_number(param))
			param = Math.round(param * 1e10) / 1e10;	// round to nearest ten billionth - hides floating point errors
			
		var text_to_append = param.toString();
		
		if (text_to_append)	// not empty
		{
			this.elem.value += text_to_append;
			this.text_changed = true;
		}
	};

	Acts.prototype.ScrollTop = function ()
	{
        this.elem.scrollTop = 0;
	};
	
	Acts.prototype.ScrollBottom = function ()
	{
		this.elem.scrollTop = this.elem.scrollHeight;
	};

	Acts.prototype.Selectall = function ()
	{
        this.elem.select(); 
	};

	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.Text = function (ret)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_string("");
			return;
		}
		
		ret.set_string(this.elem.value);
	};
	
	pluginProto.exps = new Exps();
	
}());