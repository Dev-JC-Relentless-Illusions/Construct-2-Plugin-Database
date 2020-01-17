// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.Color = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	var pluginProto = cr.plugins_.Color.prototype;
		
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

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		if (this.runtime.isDomFree)
		{
			cr.logexport("[Construct 2] Color plugin not supported on this platform - the object will not be created");
			return;
		}

		/////////////////////////////////////
		// Create
		this.elem = document.createElement("input");
		this.elem.type = "color";

		var hex = this.properties[0].match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
		this.elem.value = "#" +	("0" + parseInt(hex[1],10).toString(16)).slice(-2) + ("0" + parseInt(hex[2],10).toString(16)).slice(-2) + ("0" + parseInt(hex[3],10).toString(16)).slice(-2);

		////////////////////////////
		// Visible
		if (this.properties[2] === 0)
		{
			jQuery(this.elem).hide();
			this.visible = false;
			this.element_hidden = true;
		}

		/////////////////////////////////////
		// Style
		this.elem.id = (this.properties[5]);
		this.elem.style.background = this.properties[3] ? "transparent" : this.properties[6];
		this.elem.style.border = this.properties[4] ? this.properties[7] : "none";
		this.elem.disabled = !this.properties[1];
		this.elem.style.borderRadius = (this.properties[8]);
		this.elem.style.outline = "0";

		/////////////////////////////////////
		// OnChange
		var cRuntime = this.runtime;
		var cInst = this;

		this.elem.onchange = function() {
			cRuntime.trigger(cr.plugins_.Color.prototype.cnds.OnChange, cInst);
		};

		////////////////////////////
		// Position
		this.lastLeft = 0;
		this.lastTop = 0;
		this.lastRight = 0;
		this.lastBottom = 0;
		this.lastWinWidth = 0;
		this.lastWinHeight = 0;

		////////////////////////////
		// Update
		jQuery(this.elem).appendTo("body");
		this.updatePosition(true);
		this.runtime.tickMe(this);
	};

	instanceProto.saveToJSON = function ()
	{
		return {
			"value": this.elem.value,
			"visible": this.visible
		};
	};
	
	instanceProto.loadFromJSON = function (o)
	{
		this.elem.value = o["value"];
		this.visible = o["visible"];
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
	};
	
	instanceProto.draw = function(ctx)
	{
	};
	
	instanceProto.drawGL = function (glw)
	{
	};

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.OnChange = function ()
	{
		return true;
	};
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.SetValue = function (color)
	{
		if (this.runtime.isDomFree)
			return;

    	var hex = color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
		this.elem.value = (hex && hex.length === 4) ? "#" +
			("0" + parseInt(hex[1],10).toString(16)).slice(-2) +
			("0" + parseInt(hex[2],10).toString(16)).slice(-2) +
			("0" + parseInt(hex[3],10).toString(16)).slice(-2) : color;

		this.runtime.trigger(Cnds.prototype.OnChange, this);
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

	Acts.prototype.SetCSS = function (p, v)
	{
		if (this.runtime.isDomFree)
			return;
		
		jQuery(this.elem).css(p, v);
	};
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.ColorHEX = function (ret)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_string("");
			return;
		}
		
		ret.set_string(this.elem.value.toUpperCase());
	};
	
	Exps.prototype.ColorRGB = function (ret)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_string("");
			return;
		}

		var hex = this.elem.value.replace("#", "");
		var r = parseInt(hex.substring(0, 2), 16);
		var g = parseInt(hex.substring(2, 4), 16);
		var b = parseInt(hex.substring(4, 6), 16);
		
		ret.set_string("rgb(" + r + ", " + g + ", " + b + ")");
	};

	pluginProto.exps = new Exps();

}());