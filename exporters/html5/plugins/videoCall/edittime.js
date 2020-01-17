﻿function GetPluginSettings()
{
	return {
		"name":			"Video Call",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"hmmg_video_call",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Make video calls using Construct 2",
		"author":		"hmmg",
		"help url":		"https://www.scirra.com/forum/plugin-video-call_t167151",
		"category":		"HMMG",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"dependency": 	"peer.min.js",
		"flags":								// uncomment lines to enable flags...
					 pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
					//	| pf_position_aces		// compare/set/get x, y...
					//	| pf_size_aces			// compare/set/get width, height...
					//	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
					//	| pf_zorder_aces		// move to top, bottom, layer...
					//  | pf_nosize				// prevent resizing in the editor
					//	| pf_effects			// allow WebGL shader effects to be added
					//  | pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
												// a single non-tiling image the size of the object) - required for effects to work properly
	};
};

////////////////////////////////////////
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])			// a number
// AddStringParam(label, description [, initial_string = "\"\""])		// a string
// AddAnyTypeParam(label, description [, initial_string = "0"])			// accepts either a number or string
// AddCmpParam(label, description)										// combo with equal, not equal, less, etc.
// AddComboParamOption(text)											// (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])			// a dropdown list parameter
// AddObjectParam(label, description)									// a button to click and pick an object type
// AddLayerParam(label, description)									// accepts either a layer number or name (string)
// AddLayoutParam(label, description)									// a dropdown list with all project layouts
// AddKeybParam(label, description)										// a button to click and press a key (returns a VK)
// AddAnimationParam(label, description)								// a string intended to specify an animation name
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name
				
// example	

AddCondition(0, cf_trigger, "User connected", "User", "Trigger when the user connect", "Trigger when the user connect", "connected");		
AddCondition(1, cf_trigger, "Peer has connected", "Peer", "Trigger when a peer has just connected", "Trigger when a peer has just connected", "peerConnected");
AddCondition(2, cf_trigger, "Message received", "Message", "Trigger when a message is received", "Trigger when a message received", "msgReceived");
AddCondition(3, cf_trigger, "Call received", "Call", "Trigger when a call is received", "Trigger when a call is received", "callReceived");
AddCondition(4, cf_trigger, "Message sent", "Message", "Trigger the message is Sent", "Trigger the message is Sent", "msgSent");
AddCondition(5, cf_trigger, "User Answer Call", "Call", "Trigger when user answer a call", "Trigger when user answer a call", "userAnswerCall");
AddCondition(6, cf_trigger, "Peer stream received", "Call", "Trigger when peer stream received", "Trigger when peer stream received", "peerStreamReceived");
AddCondition(7, cf_trigger, "User stream ready", "Call", "Trigger when user stream is ready", "Trigger when user stream is ready", "userStreamReady");
AddCondition(8, cf_trigger, "User Hang Up", "Call", "Trigger when user hang up", "Trigger when user hang up", "cndHangUp");




////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

// example
AddStringParam("id", "Unique id");
AddAction(0, af_none, "Connect", "Generale", "Connect to the server as <i>{0}</i>", "Connect to the server", "connect");

AddStringParam("id Peer", "Peer's id to send The Message to");
AddStringParam("Message", "Message");
AddAction(1, af_none, "Send Message", "Message", "Send {1} to <i>{2}</i>", "Send Message to a peer", "sendMsg");

AddStringParam("id Peer", "Peer's id to call");
AddComboParamOption("Video + Audio");
AddComboParamOption("Audio Only");
AddComboParam("Type", "Call type" ,0);
AddAction(2, af_none, "Call", "Call", "Call {0} with {1}", "Call a peer", "call");


AddStringParam("id Peer", "Peer's id to answer");
AddComboParamOption("Video + Audio");
AddComboParamOption("Audio Only");
AddComboParam("Type", "Answer type" ,0);
AddAction(3, af_none, "Answer call", "Call", "Answer a {1} call from <i>{0}</i>", "Answer a call", "answerCall");


AddStringParam("id Peer", "Peer's id to hang up it's call");
AddAction(4, af_none, "Hang Up", "Call", "Hang Up a call on <i>{0}</i>", "Hang Up a call", "hangUp");



////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

// example
AddExpression(0, ef_return_string, "LastMessagePeerId", "videoCall", "LastMessagePeerId", "Return the last Peer's id that sent a message");
AddExpression(1, ef_return_string, "LastCallerPeerId", "videoCall", "LastCallerPeerId", "Return the last Peer's id that called");
AddExpression(2, ef_return_string, "LastReceivedMessage", "videoCall", "LastReceivedMessage", "Return the last received Message");
AddExpression(3, ef_return_string, "UserId", "videoCall", "UserId", "Return the current User id");
AddExpression(4, ef_return_string, "LastSentMessage", "videoCall", "LastSentMessage", "Return the last sent message");
AddExpression(5, ef_return_string, "PeerStream", "videoCall", "PeerStream", "Return the peer stream data");
AddExpression(6, ef_return_string, "UserStream", "videoCall", "UserStream", "Return the user stream data");






////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_color,		name,	initial_value,	description)		// a color dropdown
// new cr.Property(ept_font,		name,	"Arial,-16", 	description)		// a font with the given face name and size
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,		name,	link_text,		description, "firstonly")		// has no associated value; simply calls "OnPropertyChanged" on click

var property_list = [
	new cr.Property(ept_text,"API key",	"",	"Get a free API key from Here : http://peerjs.com/peerserver")		// a string
	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
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
IDEInstance.prototype.OnInserted = function()
{
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}