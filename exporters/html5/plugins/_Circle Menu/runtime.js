// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.CircleMenu = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// Plugin proto
	var pluginProto = cr.plugins_.CircleMenu.prototype;
		
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
	
	/////////////////////////////////////
	// Functions
	instanceProto.makeID = function ()
	{
	    var id = "";
	    var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	    /////////////////////////////////////
	    for (var i = 0; i < 10; i++)
	        id += str.charAt(Math.floor(Math.random() * str.length));

	    return id;
	};

	/////////////////////////////////////
	// Called whenever an instance is created
	instanceProto.onCreate = function()
	{
		/////////////////////////////////////
		// none | black | blue | green | red | white | yellow
		var li_color = [];
		li_color[0] = "";
		li_color[1] = "class='first-li_black'";
		li_color[2] = "class='first-li_blue'";
		li_color[3] = "class='first-li_green'";
		li_color[4] = "class='first-li_red'";
		li_color[5] = "class='first-li_white'";
		li_color[6] = "class='first-li_yellow'";
		/////////////////////////////////////
		this.elem = document.createElement("div");
		this.elem.id = this.properties[0] || this.makeID();
		this.elem.setAttribute("id", this.elem.id);
		this.elem.setAttribute("class", "menu");
		this.elem.innerHTML = "<ul id='"+this.elem.id+"-ul'><li id='"+this.elem.id+"-li' "+li_color[this.properties[1]]+"></li></ul>";
		$(this.elem).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");
		$(this.elem).bind('contextmenu', function(e){ return false; });
		$(this.elem).css("user-select", "none");
		$(this.elem).css("cursor", "default");
		/////////////////////////////////////
		this.elem.count = 0;
		this.elem.degree = 315;
		this.elem.isopen = false;
		this.elem.items = [];
		this.elem.select = 0;
		/////////////////////////////////////
		var dir, cst = !this.properties[2] && !this.properties[3] ? this.properties[7] + 1 : 0;
		switch (cst) {
			case  0: dir = "";				break;
			case  1: dir = "top";			break;
			case  2: dir = "left";			break;
			case  3: dir = "right";			break;
			case  4: dir = "bottom";		break;
			case  5: dir = "top-left";		break;
			case  6: dir = "top-right";		break;
			case  7: dir = "bottom-left";	break;
			case  8: dir = "bottom-right";	break;
			case  9: dir = "top-half";		break;
			case 10: dir = "left-half";		break;
			case 11: dir = "right-half";	break;
			case 12: dir = "bottom-half";	break;
			case 13: dir = "full";			break;
		};
		var tra = "";
		switch (this.properties[12]) {
			case 0: tra = "ease";		break;
			case 1:	tra = "ease-in";	break;
			case 2:	tra = "ease-out";	break;
			case 3:	tra = "ease-in-out";break;
			case 4:	tra = "linear";		break;
			case 5: tra = "cubic-bezier(80,80,80,80)";break;
		};
		var tri = "";
		switch (this.properties[13]) {
			case 0: tri = "none";	break;
			case 1:	tri = "click";	break;
			case 2:	tri = "hover";	break;
		};
		$("#"+this.elem.id+"-ul").circleMenu({
			// An object specifying the position of the items in relation to the center,
            // measured in degrees where 0/360 are on the right and angle travels in a clockwise direction.
            // An alternative to the direction option, if you want more control.
            angle: {
                start: this.properties[2],
                end: this.properties[3],
            },
            // The radius of the circle that determines the distance of the items from the center.
            circle_radius: this.properties[4],
            // When the menu is triggered on hover, the delay is the amount of time before the items will move back in to the center, meaured in milliseconds.
            delay: this.properties[5],
            // Z-index.
			depth: this.properties[6],
            // The direction of the items in relation to the center. top will place the items above the center, in a 90 degree semicircle centered upwards.
            // top-half will create a full 180 degree semicircle. full will create a full 360 degree circle, with the first item appearing at the top.
            // top | left | right | bottom | top-left | top-right | bottom-left | bottom-right | top-half | left-half | right-half | bottom-half | full
            direction: dir,
            // The diameter of each item, in pixels. Used to set the CSS properties of each item including width, height, and border-radius.
            item_diameter: this.properties[8],
            // The animation speed, in milliseconds.
            // The number given is the total amount of time it will take for the items to move in or out from the center.
            speed: this.properties[9],
            // The number of milliseconds between each item moving in to the center when the menu closes.
            // A negative value will cause the menu to close in reverse, starting with the last item.
            step_in: this.properties[10],
            // The number of milliseconds between each item moving out from the center when the menu opens.
            // A negative value will cause the menu to open in reverse, starting with the last item.
            step_out: this.properties[11],
            // The CSS timing function used to control the open/close animation.
            // ease | ease-in | ease-out | ease-in-out | linear | cubic-bezier(x, x, x, x)
            transition_function: tra,
            // How the menu is triggered to open and close, whether by hovering over the center item or clicking on it.
            // none | click | hover
            trigger: tri
		});
		/////////////////////////////////////
		var self = this;
		$("#"+self.elem.id+"-ul").on('circleMenu-update', function() {
			document.getElementById(self.elem.id+"-li").style.transform = 'rotate(0deg)';
			self.elem.isopen = false;
			self.runtime.trigger(Cnds.prototype.OnUpdate, self);
		});
		$("#"+self.elem.id+"-ul").on('circleMenu-open', function() {
			if (self.elem.degree != 0) document.getElementById(self.elem.id+"-li").style.transform = "rotate("+self.elem.degree+"deg)";
			setTimeout(function() {
				self.elem.isopen = true;
				self.runtime.trigger(Cnds.prototype.OnOpen, self);
			}, self.properties[9]);
		});
		$("#"+self.elem.id+"-ul").on('circleMenu-close', function() {
			document.getElementById(self.elem.id+"-li").style.transform = 'rotate(0deg)';
			setTimeout(function() {
				self.elem.isopen = false;
				self.runtime.trigger(Cnds.prototype.OnClose, self);
			}, self.properties[9] - (self.properties[11] * self.elem.items.length));
		});
		$("#"+self.elem.id+"-ul").on('circleMenu-select', function(evt, index) {
			document.getElementById(self.elem.id+"-li").style.transform = 'rotate(0deg)';
			self.elem.select = index;
			self.runtime.trigger(Cnds.prototype.OnSelect, self);
			setTimeout(function() {
				self.elem.isopen = false;
				self.runtime.trigger(Cnds.prototype.OnClose, self);
			}, self.properties[9] - (self.properties[11] * self.elem.items.length));
		});
		$("#"+self.elem.id+"-ul").on('circleMenu-delete', function(evt, index) {
			self.elem.items.splice(index-1, 1);
			self.elem.isopen = false;
			self.runtime.trigger(Cnds.prototype.OnDelete, self);
		});
		$("#"+self.elem.id+"-ul").on('circleMenu-clear', function() {
			self.elem.count = 0;
			self.elem.items = [];
			self.elem.isopen = false;
			self.runtime.trigger(Cnds.prototype.OnClear, self);
		});
		/////////////////////////////////////
		this.runtime.tickMe(this);
		this.updatePosition();
	};

	instanceProto.saveToJSON = function ()
	{
		/* - beta test #PlayLive
		return {
			"count":		this.elem.count,
			"degree":		this.elem.degree,
			"id":			this.elem.id,
			"innerHTML":	this.elem.innerHTML,
			"items":		this.elem.items,
			"style":		this.elem.style.cssText,
		};
		*/
	};

	instanceProto.loadFromJSON = function (get)
	{
		/* - beta test #PlayLive
		this.elem.count			= get["count"];
		this.elem.degree		= get["degree"];
		this.elem.id			= get["id"];
		this.elem.innerHTML		= get["innerHTML"];
		this.elem.items			= get["items"];
		this.elem.style.cssText	= get["style"];

		// $("#"+this.elem.id+"-ul").circleMenu("close");
		*/
	};

	instanceProto.onDestroy = function ()
	{
		$(this.elem).remove();
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
		/////////////////////////////////////
		if (!this.visible || !this.layer.visible) {
			jQuery(this.elem).hide();
			return;
		};
		/////////////////////////////////////
		var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var offx = left + jQuery(this.runtime.canvas).offset().left;
		var offy = top + jQuery(this.runtime.canvas).offset().top;
		jQuery(this.elem).offset({left: Math.round(offx), top: Math.round(offy)});
		jQuery(this.elem).show();
	};

	// only called if a layout object
	instanceProto.draw = function(ctx)
	{
	};

	instanceProto.drawGL = function(glw)
	{
	};

	/////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.OnUpdate = function ()
	{
		return true;
	};

	Cnds.prototype.OnOpen = function ()
	{
		return true;
	};

	Cnds.prototype.OnClose = function ()
	{
		return true;
	};

	Cnds.prototype.OnSelect = function ()
	{
		return true;
	};

	Cnds.prototype.OnDelete = function ()
	{
		return true;
	};

	Cnds.prototype.OnClear = function ()
	{
		return true;
	};

	Cnds.prototype.IsOpen = function ()
	{
		return this.elem.isopen;
	};

	Cnds.prototype.CompareTag = function (text_)
	{
		if (this.runtime.isDomFree)
			return false;
		/////////////////////////////////////
		return cr.equals_nocase(this.elem.items[this.elem.select], text_);
	};
	
	pluginProto.cnds = new Cnds();
	
	/////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.Open = function ()
	{
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		$("#"+this.elem.id+"-ul").circleMenu("open");
	};

	Acts.prototype.Close = function ()
	{
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		$("#"+this.elem.id+"-ul").circleMenu("close");
	};

	Acts.prototype.Delete = function (item_)
	{
		var idx = typeof item_ === "number" ? item_ : this.elem.items.indexOf(item_) + 1;
		if (this.runtime.isDomFree || idx <= 0)
			return;
		/////////////////////////////////////
		$("#"+this.elem.id+"-ul").circleMenu("delete", idx);
	};

	Acts.prototype.Clear = function ()
	{
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
        $("#"+this.elem.id+"-ul").circleMenu("clear");
	};

	Acts.prototype.SetStyle = function (text_, degree_, background_, border_, color_, size_)
	{
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		var element = document.getElementById(this.elem.id+"-li");
		element.innerHTML = text_;
		this.elem.degree = degree_;
		/////////////////////////////////////
		$(element).css({
			'background': background_,
			'border': border_,
			'color': color_,
			'font-size': size_+'%',
			'transform': 'rotate(0)'
		});
	};

	Acts.prototype.AddItemIcon = function (tag_, icon_, animated_, background_, border_, color_, size_)
	{
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		this.elem.count++;
		this.elem.items.push(tag_ || this.elem.count.toString());

		var ani = [];
		ani[0] = "";
		ani[1] = "fa-spin";
		ani[2] = "fa-pulse";
		/////////////////////////////////////
		$("#"+this.elem.id+"-ul").append($(
			"<li style='background: "+background_+"; border: "+border_+"; color: "+color_+"; font-size: "+size_+"%;'>"+
				"<i class='fa fa-"+icon_+" "+ani[animated_]+" fa-fw' aria-hidden='true'></i>"+
			"</li>"
		)).circleMenu("update");
	};

	Acts.prototype.AddItemText = function (tag_, text_, family_, font_, background_, border_, color_, size_)
	{
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
		this.elem.count++;
		this.elem.items.push(tag_ || this.elem.count.toString());

		var style = font_ > 1 ? "italic" : "normal";
		var weight = font_ && font_ != 2 ? "bold" : "normal";
		/////////////////////////////////////
		$("#"+this.elem.id+"-ul").append($(
			"<li style='"+
				"background: "+background_+";"+
				"border: "+border_+";"+
				"color: "+color_+";"+
				"font-family: "+family_+";"+
				"font-size: "+size_+"%;"+
				"font-style: "+style+";"+
				"font-weight: "+weight+";"+
			"'>"+text_+"</li>"
		)).circleMenu("update");
	};

	Acts.prototype.Visibility = function (visible_)
	{
		if (this.runtime.isDomFree)
			return;
		/////////////////////////////////////
        this.visible = visible_;
	};

	pluginProto.acts = new Acts();
	
	/////////////////////////////////////
	// Expressions
	function Exps() {};

	Exps.prototype.GetID = function (ret)
	{
		ret.set_string(this.elem.id+"-ul");
	};

	Exps.prototype.GetItemCount = function (ret)
	{
		ret.set_int(this.elem.items.length);
	};

	Exps.prototype.GetItemTags = function (ret)
	{
		ret.set_string(this.elem.items.toString());
	};

	Exps.prototype.GetItemSelected = function (ret)
	{
		ret.set_string(typeof this.elem.items[this.elem.select] != "undefined" ? this.elem.items[this.elem.select] : "undefined");
	};

	pluginProto.exps = new Exps();

}());