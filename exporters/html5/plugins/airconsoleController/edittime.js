function GetPluginSettings() {
	return {
		"name": "AirConsole Controller",
		"id": "AirConsoleController",
		"version": "1.0",
		"description": "Make your airconsole game controller",
		"author": "X3M",
		"help url": "",
		"dependency": "button.css;button.js;dpad.css;dpad.js;joystick.css;joystick.js;swipe-analog.js;swipe-digital.js;https://www.airconsole.com/api/airconsole-1.6.0.js",
		"category": "Web", // Prefer to re-use existing categories, but you can set anything here
		"type": "world", // either "world" (appears in layout and is drawn), else "object"
		"rotatable": false, // only used when "type" is "world".  Enables an angle property on the object.
		"flags": 0 // uncomment lines to enable flags...
		//  | pf_singleglobal    // exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
		//  | pf_texture         // object has a single texture (e.g. tiled background)
		//  | pf_position_aces   // compare/set/get x, y...
		 | pf_size_aces // compare/set/get width, height...
		 | pf_angle_aces // compare/set/get angle (recommended that "rotatable" be set to true)
		//  | pf_appearance_aces // compare/set/get visible, opacity...
		//  | pf_tiling          // adjusts image editor features to better suit tiled images (e.g. tiled background)
		//  | pf_animations      // enables the animations system.  See 'Sprite' for usage
		//  | pf_zorder_aces     // move to top, bottom, layer...
		//  | pf_nosize          // prevent resizing in the editor
		//  | pf_effects         // allow WebGL shader effects to be added
		//  | pf_predraw         // set for any plugin which draws and is not a sprite (i.e. does not simply draw
		// a single non-tiling image the size of the object) - required for effects to work properly
	};
};

// ==============================================
// CONDITION
// ==============================================
AddCondition(0, cf_trigger, "On button down", "Airconsole Button", "On button down", "Triggered if the button was pressed.", "OnButtonDown");
AddCondition(1, cf_trigger, "On button up", "Airconsole Button", "On button up", "Triggered if the button was released.", "OnButtonUp");
AddCondition(2, cf_trigger, "On UP d-pad pressed", "Airconsole D-Pad", "On up d-pad pressed", "Triggered if the UP button was pressed.", "OnDPadUp");
AddCondition(3, cf_trigger, "On DOWN d-pad pressed", "Airconsole D-Pad", "On down d-pad pressed", "Triggered if the DOWN button was pressed.", "OnDPadDown");
AddCondition(4, cf_trigger, "On LEFT d-pad pressed", "Airconsole D-Pad", "On left d-pad pressed", "Triggered if the LEFT button was pressed.", "OnDPadLeft");
AddCondition(5, cf_trigger, "On RIGHT d-pad pressed", "Airconsole D-Pad", "On right d-pad pressed", "Triggered if the RIGHT button was pressed.", "OnDPadRight");
AddCondition(6, cf_trigger, "On joystick move", "Airconsole Joystick", "On joystick move", "Triggered if the joystick was moved.", "OnJoystickMove");
AddCondition(7, cf_trigger, "On analog swipe", "Airconsole AnalogSwipe", "On analog swipe", "Triggered if the analog swipe was performed.", "OnAnalogSwipe");
AddCondition(8, cf_trigger, "On digital swipe", "Airconsole DigitalSwipe", "On digital swipe", "Triggered if the digital swipe was performed.", "OnDigitalSwipe");
AddCondition(9, cf_trigger, "On analog swipe released", "Airconsole AnalogSwipe", "On analog swipe released", "Triggered if the analog swipe was released.", "OnAnSwipeRel");
AddCondition(10, cf_trigger, "On digital swipe released", "Airconsole DigitalSwipe", "On digital swipe released", "Triggered if the digital swipe was released.", "OnDigSwipeRel");
AddCondition(11, cf_trigger, "On dpad released", "Airconsole D-Pad", "On d-pad released", "Triggered if the dpad was released.", "OnDpadRel");
AddCondition(12, cf_trigger, "On joystick released", "Airconsole Joystick", "On joystick released", "Triggered if the joystick was released.", "OnJoyRel");
AddAnyTypeParam("Message", "The message to be received");
AddCondition(25, cf_trigger, "On message received", "Airconsole Message", "On message {0} received from the screen", "Triggered if the message was received from the screen.", "OnReceivedMessage");
//// ==============================================
//// ACTION
//// ==============================================
//// Message
AddAnyTypeParam("Data", "The data to send to the device");
AddAction(13, af_none, "Send message", "Airconsole Message", "Send message {0}", "Send message.", "SendMessage");
AddAction(37, af_none, "Edit profile", "Airconsole Profile", "Edit the player profile", "Edit profile.", "EditProfile");
//// ==============================================
//// EXPRESSIONS
//// ==============================================
AddExpression(14, ef_return_string, "DPad pressed key", "Airconsole D-Pad", "DPadKeyPressed", "Returns the key which was pressed.");
AddExpression(15, ef_return_number, "Joystick position X", "Airconsole Joystick", "JoystickPositionX", "Returns the joystick position.");
AddExpression(16, ef_return_number, "Joystick position Y", "Airconsole Joystick", "JoystickPositionY", "Returns the joystick position.");
AddExpression(17, ef_return_number, "AnalogSwipe x", "Airconsole AnalogSwipe", "AnalogSwipeX", "Returns the swipe x.");
AddExpression(18, ef_return_number, "AnalogSwipe y", "Airconsole AnalogSwipe", "AnalogSwipeY", "Returns the swipe y.");
AddExpression(19, ef_return_number, "AnalogSwipe angle", "Airconsole AnalogSwipe", "AnalogSwipeAngle", "Returns the swipe angle.");
AddExpression(20, ef_return_number, "AnalogSwipe degree", "Airconsole AnalogSwipe", "AnalogSwipeDegree", "Returns the swipe degree.");
AddExpression(21, ef_return_any, "DigitalSwipe left state", "Airconsole DigitalSwipe", "DigitalSwipeLeftStatus", "Returns the left swipe stat.");
AddExpression(22, ef_return_any, "DigitalSwipe right state", "Airconsole DigitalSwipe", "DigitalSwipeRightStatus", "Returns the right swipe stat.");
AddExpression(23, ef_return_any, "DigitalSwipe up state", "Airconsole DigitalSwipe", "DigitalSwipeUpStatus", "Returns the up swipe stat.");
AddExpression(24, ef_return_any, "DigitalSwipe down state", "Airconsole DigitalSwipe", "DigitalSwipeDownStatus", "Returns the down swipe stat.");
AddExpression(26, ef_return_any, "DeviceID", "Airconsole Profile", "DeviceID", "Returns this device ID.");
AddExpression(27, ef_return_any, "DeviceNickname", "Airconsole Profile", "DeviceNickname", "Returns this device nickname.");
AddExpression(28, ef_return_any, "DevicePlayerNumber", "Airconsole Profile", "DevicePlayerNumber", "Returns this device player number.");
AddNumberParam("Size", "Size of the picture in pixels.", initial_string = "64");
AddExpression(29, ef_return_any, "DevicePictureURL", "Airconsole Profile", "DevicePictureURL", "Returns this device picture url.");
AddExpression(30, ef_return_any, "DeviceAccelX", "Airconsole Accelerometer", "DeviceAccelX", "Returns this device accelerometer X.");
AddExpression(31, ef_return_any, "DeviceAccelY", "Airconsole Accelerometer", "DeviceAccelY", "Returns this device accelerometer Y.");
AddExpression(32, ef_return_any, "DeviceAccelZ", "Airconsole Accelerometer", "DeviceAccelZ", "Returns this device accelerometer Z.");
AddExpression(33, ef_return_any, "DeviceGyroAlpha", "Airconsole Gyroscope", "DeviceGyroAlpha", "Returns this device gyroscope Alpha.");
AddExpression(34, ef_return_any, "DeviceGyroBeta", "Airconsole Gyroscope", "DeviceGyroBeta", "Returns this device gyroscope Beta.");
AddExpression(35, ef_return_any, "DeviceGyroGamma", "Airconsole Gyroscope", "DeviceGyroGamma", "Returns this device gyroscope Gamma.");
AddExpression(36, ef_return_any, "MessageReceived", "Airconsole Message", "MessageReceived", "Returns the message received.");
////////////////////////////////////////
ACESDone();
////////////////////////////////////////

var property_list = [
	new cr.Property(ept_combo, "Controller type", "Button", "The controller type", "Button|D-Pad|Joystick|SwipeAnalog|SwipeDigital"),
new cr.Property(ept_section, "Button controller properties", "", ""),
	new cr.Property(ept_text, "Button Label", "Button", "The button label."),
	new cr.Property(ept_combo, "Type", "Type1", "The button type", "Type1|Type2|Type3"),
new cr.Property(ept_section, "D-Pad controller properties", "", ""),
	new cr.Property(ept_combo, "Diagonal", "False", "Diagonal combo keys", "False|True"),
new cr.Property(ept_section, "Joystick controller properties", "", ""),
new cr.Property(ept_section, "Swipe Analog controller properties", "", ""),
	new cr.Property(ept_text, "SwipeAnalog Label", "Swipe Analog", "The swipe area label."),
	new cr.Property(ept_float, "SwipeAnalog Min swipe distance", 30, "mount of pixels which the user needs to move or tap the SwipeAnalog before triggering a direction."),
new cr.Property(ept_section, "Swipe Digital controller properties", "", ""),
	new cr.Property(ept_text, "SwipeDigital Label", "Swipe Digital", "The swipe area label."),
	new cr.Property(ept_float, "SwipeDigital Min swipe distance", 30, "mount of pixels which the user needs to move or tap the SwipeAnalog before triggering a direction."),
	new cr.Property(ept_combo, "Directions", "4Directions", "", "4Directions|8Directions|Vertical|Horizantal"),
new cr.Property(ept_section, "Smartphone orientation properties", "", ""),
	new cr.Property(ept_combo, "Orientation", "Landscape", "The orientation mode", "Landscape|Portrait"),
new cr.Property(ept_section, "HTML properties", "", ""),
	new cr.Property(ept_combo, "Use HTML elements", "True", "Set to False if you're using your own sprites.", "False|True")
];

// Called by IDE when a new object type is to be createdm
function CreateIDEObjectType() {
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType() {
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function (instance) {
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type) {
	assert2(this instanceof arguments.callee, "Constructor called as a function");

	// Save the constructor parameters
	this.instance = instance;
	this.type = type;

	// Set the default property values from the property table
	this.properties = {};

	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;

	// Plugin-specific variables
	// this.myValue = 0...
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function () {
	this.instance.SetHotspot(new cr.vector2(0, 0));
	this.instance.SetPosition(new cr.vector2(0, 0));
	this.instance.SetSize(new cr.vector2(this.instance.GetLayoutSize().x, this.instance.GetLayoutSize().y));
	var q = this.instance.GetBoundingQuad();
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function () {}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function (property_name) {}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function (renderer) {

	this.font_str = "Arial,-16";
	var font_info = cr.ParseFontString(this.font_str);
	this.font = renderer.CreateFont("Arial", font_info.face_size, false, false);

}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function (renderer) {

	var q = this.instance.GetBoundingQuad();
	var label;
	// If there is a font present, draw it
	switch (this.properties["Controller type"]) {
	case "Button":
		label = this.properties["Button Label"];
		break;
	case "D-Pad":
		label = "D-Pad";
		break;
	case "Joystick":
		label = "Joystick";
		break;
	case "SwipeAnalog":
		label = this.properties["SwipeAnalog Label"];
		break;
	case "SwipeDigital":
		label = this.properties["SwipeDigital Label"];
		break;
	}
	if (this.font != null) {

		this.font.DrawText(label,
			q,
			cr.RGB(0, 0, 0),
			ha_center,
			1,
			0,
			false,
			0,
			ha_center);
		renderer.Outline(q, cr.RGB(159, 204, 17));
		renderer.Outline(scale(q, 1), cr.RGB(159, 204, 17));

	}
}

function scale(quad, factor) {
	quad.tlx -= factor;
	quad.tly -= factor;
	quad.trx += factor;
	quad.try_ -= factor;
	quad.blx -= factor;
	quad.bly += factor;
	quad.brx += factor;
	quad.bry += factor;
	return quad;
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function (renderer) {}
