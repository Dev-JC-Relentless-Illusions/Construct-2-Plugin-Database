// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.AirConsoleController = function (runtime) {
	this.runtime = runtime;
};

(function () {
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.AirConsoleController.prototype;

	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function (plugin) {
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function () {};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function (type) {
		this.type = type;
		this.runtime = type.runtime;

	};

	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function () {
		var _this = this;
		var orient;
		switch (this.properties[9]) {
		case 0:
			orient = AirConsole.ORIENTATION_LANDSCAPE;
			break;
		case 1:
			orient = AirConsole.ORIENTATION_PORTRAIT;
			break;
		}

		// [------------- Initializa Airconsole Controller ------------------]
		this.airconsole = new AirConsole({
				orientation: orient
			});
		// Let the screen know we are here
		var sendHandshake = function () {
			_this.airconsole.message(AirConsole.SCREEN, {
				handshake: true
			});
		};
		_this.airconsole.onReady = function () {
			sendHandshake();
		};
		_this.airconsole.onMessage = function (device_id, data) {
			if (data.handshake) {
				sendHandshake();
			} else // data is a message
			{
				_this.receivedmessage = data;
				_this.runtime.trigger(cr.plugins_.AirConsoleController.prototype.cnds.OnReceivedMessage, _this);
			}
		};
		//  [-----------------------------------------------------------------]


		if (this.properties[10]) // USE Airconsole HTML elements
		{
			if (this.properties[0] == 0) // ===================================================================== BUTTON
			{

				this.controller = document.createElement('div');
				this.controller.id = "button" + this.uid;
				switch (this.properties[2]) {
				case 0:
					$(this.controller).addClass("button-80");
					break;
				case 1:
					$(this.controller).addClass("button-300-150");
					break;
				case 2:
					$(this.controller).addClass("button-300-300");
					break;
				}
				this.controller.text = document.createElement('div');
				$(this.controller.text).html(this.properties[1]);
				$(this.controller.text).addClass("button-text");
				$(this.controller.text).appendTo(this.controller);
				$(this.controller).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");
				this.runtime.tickMe(this);

				this.button = new Button(this.controller.id, {
						"down": function () {
							_this.runtime.trigger(cr.plugins_.AirConsoleController.prototype.cnds.OnButtonDown, _this);
						},
						"up": function () {
							_this.runtime.trigger(cr.plugins_.AirConsoleController.prototype.cnds.OnButtonUp, _this);
						}
					});

			} // ===============================================================================================================
			else if (this.properties[0] == 1) // ====================================================================== D-Pad
			{
				this.controller = document.createElement('div');
				this.controller.id = "dpad" + this.uid;
				$(this.controller).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");
				this.controller.outline = document.createElement('div');
				$(this.controller.outline).appendTo(this.controller);
				this.controller.uppad = document.createElement('div');
				$(this.controller.uppad).addClass("dpad-arrow dpad-arrow-up");
				this.controller.downpad = document.createElement('div');
				$(this.controller.downpad).addClass("dpad-arrow dpad-arrow-down");
				this.controller.leftpad = document.createElement('div');
				$(this.controller.leftpad).addClass("dpad-arrow dpad-arrow-left");
				this.controller.rightpad = document.createElement('div');
				$(this.controller.rightpad).addClass("dpad-arrow dpad-arrow-right");
				$(this.controller.uppad).appendTo(this.controller.outline);
				$(this.controller.downpad).appendTo(this.controller.outline);
				$(this.controller.leftpad).appendTo(this.controller.outline);
				$(this.controller.rightpad).appendTo(this.controller.outline);

				this.runtime.tickMe(this);

				this.dpad = new DPad(this.controller.id, {
						diagonal: _this.properties[3],
						"directionchange": function (key, pressed) {
							_this.dpad.key = key;
							if (pressed) {
								switch (key) {
								case "up":
									_this.runtime.trigger(cr.plugins_.AirConsoleController.prototype.cnds.OnDPadUp, _this);
									break;
								case "down":
									_this.runtime.trigger(cr.plugins_.AirConsoleController.prototype.cnds.OnDPadDown, _this);
									break;
								case "left":
									_this.runtime.trigger(cr.plugins_.AirConsoleController.prototype.cnds.OnDPadLeft, _this);
									break;
								case "right":
									_this.runtime.trigger(cr.plugins_.AirConsoleController.prototype.cnds.OnDPadRight, _this);
									break;
								}
							}

						},
						"touchend": function (had_direction) {
							_this.runtime.trigger(cr.plugins_.AirConsoleController.prototype.cnds.OnDpadRel, _this);
						}
					});
			} // ===============================================================================================================
			else if (this.properties[0] == 2) // ====================================================================== Joystick
			{
				this.controller = document.createElement('div');
				this.controller.id = "joystick" + this.uid;
				$(this.controller).addClass("joystick");
				$(this.controller).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");
				this.controller.outline = document.createElement('div');
				$(this.controller.outline).addClass("joystick-relative");
				$(this.controller.outline).appendTo(this.controller);
				this.controller.stick = document.createElement('div');
				$(this.controller.stick).addClass("joystick-relative-stick");
				$(this.controller.stick).appendTo(this.controller.outline);

				this.runtime.tickMe(this);

				this.joystick = new Joystick(this.controller.id, {
						"touchmove": function (position) {
							_this.runtime.trigger(cr.plugins_.AirConsoleController.prototype.cnds.OnJoystickMove, _this);
							_this.joystick.positionX = position.x;
							_this.joystick.positionY = position.y;
						},
						"touchend": function (had_direction) {
							_this.runtime.trigger(cr.plugins_.AirConsoleController.prototype.cnds.OnJoyRel, _this);
						}
					});
			} // ===============================================================================================================
			else if (this.properties[0] == 3) // ====================================================================== Swipe Analog
			{
				this.controller = document.createElement('div');
				this.controller.id = "swipeanalog" + this.uid;
				$(this.controller).addClass("button-300-300");
				$(this.controller).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");
				this.controller.swipearea = document.createElement('div');
				$(this.controller.swipearea).addClass("button-text");
				$(this.controller.swipearea).html(this.properties[4]);
				$(this.controller.swipearea).appendTo(this.controller);

				this.runtime.tickMe(this);

				this.swipeanalog = new SwipeAnalog(this.controller.id, {
						min_swipe_distance: _this.properties[5],
						// Direction vector {x, y, angle, degree}
						onTrigger: function (vector) {
							_this.swipeanalog.xpos = vector.x;
							_this.swipeanalog.ypos = vector.y;
							_this.swipeanalog.angle = vector.angle;
							_this.swipeanalog.degree = vector.degree;
							_this.runtime.trigger(cr.plugins_.AirConsoleController.prototype.cnds.OnAnalogSwipe, _this);

						},
						touchend: function () {
							_this.runtime.trigger(cr.plugins_.AirConsoleController.prototype.cnds.OnAnSwipeRel, _this);
						}
					});

			} // ===============================================================================================================
			else if (this.properties[0] == 4) // ====================================================================== Swipe Digital
			{
				this.controller = document.createElement('div');
				this.controller.id = "swipedigital" + this.uid;
				$(this.controller).addClass("button-300-300");
				$(this.controller).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");
				this.controller.swipearea = document.createElement('div');
				$(this.controller.swipearea).addClass("button-text");
				$(this.controller.swipearea).html(this.properties[6]);
				$(this.controller.swipearea).appendTo(this.controller);

				this.runtime.tickMe(this);

				var dir;
				switch (this.properties[8]) {
				case 0:
					dir = SwipeDigital.ALLOWED_DIRECTIONS.FOURWAY;
					break;
				case 1:
					dir = SwipeDigital.ALLOWED_DIRECTIONS.EIGHTWAY;
					break;
				case 2:
					dir = SwipeDigital.ALLOWED_DIRECTIONS.VERTICAL;
					break;
				case 3:
					dir = SwipeDigital.ALLOWED_DIRECTIONS.HORIZONTAL;
					break;
				}
				this.swipedigital = new SwipeDigital(this.controller.id, {
						allowed_directions: dir,
						min_swipe_distance: _this.properties[7],
						// Directions: {down: <Boolean>, left: <Boolean>, up: <Boolean>, right: <Boolean>}
						onTrigger: function (directions) {
							_this.swipedigital.left = directions.left;
							_this.swipedigital.right = directions.right;
							_this.swipedigital.up = directions.up;
							_this.swipedigital.down = directions.down;
							_this.runtime.trigger(cr.plugins_.AirConsoleController.prototype.cnds.OnDigitalSwipe, _this);

						},
						touchend: function () {
							_this.runtime.trigger(cr.plugins_.AirConsoleController.prototype.cnds.OnDigSwipeRel, _this);
						}
					});

			} // ===============================================================================================================
		}
	};

	instanceProto.updatePosition = function () {
		var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);

		var rightEdge = this.runtime.width / this.runtime.devicePixelRatio;
		var bottomEdge = this.runtime.height / this.runtime.devicePixelRatio;

		// Is entirely offscreen or invisible: hide
		if (!this.visible || !this.layer.visible || right <= 0 || bottom <= 0 || left >= rightEdge || top >= bottomEdge) {
			if (!this.element_hidden)
				$(this.controller).hide();

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

		this.lastLeft = left;
		this.lastTop = top;
		this.lastRight = right;
		this.lastBottom = bottom;
		this.lastWinWidth = curWinWidth;
		this.lastWinHeight = curWinHeight;

		if (this.element_hidden) {
			$(this.controller).show();
			this.element_hidden = false;
		}

		var offx = Math.round(left) + $(this.runtime.canvas).offset().left;
		var offy = Math.round(top) + $(this.runtime.canvas).offset().top;
		$(this.controller).css("position", "absolute");
		$(this.controller).offset({
			left: offx,
			top: offy
		});
		$(this.controller).width(Math.round(right - left));
		$(this.controller).height(Math.round(bottom - top));
	};

	instanceProto.tick = function () {

		this.updatePosition();
	};

	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function () {};

	// called when saving the full state of the game
	instanceProto.saveToJSON = function () {
		// return a Javascript object containing information about your object's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
		};
	};

	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o) {
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
	};

	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function (ctx) {};

	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw) {};

	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections) {
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		propsections.push({
			"title": "My debugger section",
			"properties": [
				// Each property entry can use the following values:
				// "name" (required): name of the property (must be unique within this section)
				// "value" (required): a boolean, number or string for the value
				// "html" (optional, default false): set to true to interpret the name and value
				//                   as HTML strings rather than simple plain text
				// "readonly" (optional, default false): set to true to disable editing the property

				// Example:
				// {"name": "My property", "value": this.myValue}
			]
		});
	};

	instanceProto.onDebugValueEdited = function (header, name, value) {
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		if (name === "My property")
			this.myProperty = value;
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.OnButtonDown = function () {
		return true;
	};

	Cnds.prototype.OnButtonUp = function () {
		return true;
	};

	Cnds.prototype.OnDPadUp = function () {
		return true;
	};

	Cnds.prototype.OnDPadDown = function () {
		return true;
	};

	Cnds.prototype.OnDPadLeft = function () {
		return true;
	};

	Cnds.prototype.OnDPadRight = function () {
		return true;
	};

	Cnds.prototype.OnJoystickMove = function () {
		return true;
	};

	Cnds.prototype.OnAnalogSwipe = function () {
		return true;
	};

	Cnds.prototype.OnDigitalSwipe = function () {
		return true;
	};

	Cnds.prototype.OnAnSwipeRel = function () {
		return true;
	};
	Cnds.prototype.OnDigSwipeRel = function () {
		return true;
	};
	Cnds.prototype.OnDpadRel = function () {
		return true;
	};
	Cnds.prototype.OnJoyRel = function () {
		return true;
	};

	Cnds.prototype.OnReceivedMessage = function (m) {
		if (m == this.receivedmessage) {
			return true;
		} else {
			return false;
		}
	};

	pluginProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	// the example action
	Acts.prototype.SendMessage = function (message) {
		this.airconsole.message(AirConsole.SCREEN, {
			message: message
		});
	};

	Acts.prototype.EditProfile = function () {
		this.airconsole.editProfile();
	};

	pluginProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	// the example expression
	Exps.prototype.DPadKeyPressed = function (ret) // 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(String(this.dpad.key)); // return our value
		// ret.set_float(0.5);      // for returning floats
		// ret.set_string("Hello");   // for ef_return_string
		// ret.set_any("woo");      // for ef_return_any, accepts either a number or string
	};

	Exps.prototype.JoystickPositionX = function (ret) // 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(parseFloat(this.joystick.positionX)); // return our value
		// ret.set_float(0.5);      // for returning floats
		// ret.set_string("Hello");   // for ef_return_string
		// ret.set_any("woo");      // for ef_return_any, accepts either a number or string
	};

	Exps.prototype.JoystickPositionY = function (ret) // 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(parseFloat(this.joystick.positionY)); // return our value
		// ret.set_float(0.5);      // for returning floats
		// ret.set_string("Hello");   // for ef_return_string
		// ret.set_any("woo");      // for ef_return_any, accepts either a number or string
	};

	Exps.prototype.AnalogSwipeX = function (ret) // 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(parseFloat(this.swipeanalog.xpos)); // return our value
		// ret.set_float(0.5);      // for returning floats
		// ret.set_string("Hello");   // for ef_return_string
		// ret.set_any("woo");      // for ef_return_any, accepts either a number or string
	};

	Exps.prototype.AnalogSwipeY = function (ret) // 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(parseFloat(this.swipeanalog.ypos)); // return our value
		// ret.set_float(0.5);      // for returning floats
		// ret.set_string("Hello");   // for ef_return_string
		// ret.set_any("woo");      // for ef_return_any, accepts either a number or string
	};

	Exps.prototype.AnalogSwipeAngle = function (ret) // 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(parseFloat(this.swipeanalog.angle)); // return our value
		// ret.set_float(0.5);      // for returning floats
		// ret.set_string("Hello");   // for ef_return_string
		// ret.set_any("woo");      // for ef_return_any, accepts either a number or string
	};

	Exps.prototype.AnalogSwipeDegree = function (ret) // 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(parseFloat(this.swipeanalog.degree)); // return our value
		// ret.set_float(0.5);      // for returning floats
		// ret.set_string("Hello");   // for ef_return_string
		// ret.set_any("woo");      // for ef_return_any, accepts either a number or string
	};

	Exps.prototype.DigitalSwipeLeftStatus = function (ret) // 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_any(String(this.swipedigital.left)); // return our value
		// ret.set_float(0.5);      // for returning floats
		// ret.set_string("Hello");   // for ef_return_string
		// ret.set_any("woo");      // for ef_return_any, accepts either a number or string
	};

	Exps.prototype.DigitalSwipeRightStatus = function (ret) // 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_any(String(this.swipedigital.right)); // return our value
		// ret.set_float(0.5);      // for returning floats
		// ret.set_string("Hello");   // for ef_return_string
		// ret.set_any("woo");      // for ef_return_any, accepts either a number or string
	};

	Exps.prototype.DigitalSwipeUpStatus = function (ret) // 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_any(String(this.swipedigital.up)); // return our value
		// ret.set_float(0.5);      // for returning floats
		// ret.set_string("Hello");   // for ef_return_string
		// ret.set_any("woo");      // for ef_return_any, accepts either a number or string
	};

	Exps.prototype.DigitalSwipeDownStatus = function (ret) // 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_any(String(this.swipedigital.down)); // return our value
		// ret.set_float(0.5);      // for returning floats
		// ret.set_string("Hello");   // for ef_return_string
		// ret.set_any("woo");      // for ef_return_any, accepts either a number or string
	};

	Exps.prototype.DeviceID = function (ret) // 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_any(parseInt(this.airconsole.getDeviceId())); // return our value
		// ret.set_float(0.5);      // for returning floats
		// ret.set_string("Hello");   // for ef_return_string
		// ret.set_any("woo");      // for ef_return_any, accepts either a number or string
	};

	Exps.prototype.DeviceNickname = function (ret) // 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_any(String(this.airconsole.getNickname(this.airconsole.getDeviceId()))); // return our value
		// ret.set_float(0.5);      // for returning floats
		// ret.set_string("Hello");   // for ef_return_string
		// ret.set_any("woo");      // for ef_return_any, accepts either a number or string
	};

	Exps.prototype.DevicePlayerNumber = function (ret) // 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_any(parseInt(this.airconsole.convertDeviceIdToPlayerNumber(this.airconsole.getDeviceId()))); // return our value
		// ret.set_float(0.5);      // for returning floats
		// ret.set_string("Hello");   // for ef_return_string
		// ret.set_any("woo");      // for ef_return_any, accepts either a number or string
	};

	Exps.prototype.DevicePictureURL = function (ret, size) // 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_any(String(this.airconsole.getProfilePicture(this.airconsole.getDeviceId(), size))); // return our value
		// ret.set_float(0.5);      // for returning floats
		// ret.set_string("Hello");   // for ef_return_string
		// ret.set_any("woo");      // for ef_return_any, accepts either a number or string
	};

	Exps.prototype.DeviceAccelX = function (ret) // 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var x;
		this.airconsole.onDeviceMotion = function (data) {
			x = data.x;
		};

		ret.set_any(parseFloat(x));
	};
	Exps.prototype.DeviceAccelY = function (ret) // 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var y;
		this.airconsole.onDeviceMotion = function (data) {
			y = data.y;
		};

		ret.set_any(parseFloat(y));
	};
	Exps.prototype.DeviceAccelZ = function (ret) // 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var z;
		this.airconsole.onDeviceMotion = function (data) {
			z = data.z;
		};

		ret.set_any(parseFloat(z));
	};
	Exps.prototype.DeviceGyroAlpha = function (ret) // 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var a;
		this.airconsole.onDeviceMotion = function (data) {
			a = data.a;
		};

		ret.set_any(parseFloat(a));
	};

	Exps.prototype.DeviceGyroBeta = function (ret) // 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var b;
		this.airconsole.onDeviceMotion = function (data) {
			b = data.b;
		};

		ret.set_any(parseFloat(b));
	};

	Exps.prototype.DeviceGyroGamma = function (ret) // 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var g;
		this.airconsole.onDeviceMotion = function (data) {
			g = data.g;
		};

		ret.set_any(parseFloat(g));
	};

	Exps.prototype.MessageReceived = function (ret) // 'ret' must always be the first parameter - always return the expression's result through it!
	{

		ret.set_any(this.receivedmessage);
	};

	pluginProto.exps = new Exps();

}
	());
