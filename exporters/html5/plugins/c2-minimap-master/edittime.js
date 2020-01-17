function GetPluginSettings() {
	return {
		"name"       : "Minimap",
		"id"         : "armaldio_minimap",
		"version"    : "1.0",
		"description": "",
		"author"     : "Armaldio",
		"help url"   : "",
		"category"   : "Web",
		"type"       : "world",			// not in layout
		"rotatable"  : false,
		"flags"      : pf_position_aces | pf_size_aces | pf_angle_aces | pf_appearance_aces | pf_effects
	};
}

//////////////////////////////////////////////////////////////
// Conditions
//AddCondition(0, 0, "Cookies enabled", "Browser", "Cookies are enabled", "Browser has cookies enabled.", "CookiesEnabled");

//////////////////////////////////////////////////////////////
// Actions

AddFileParam("File", "Select a project file to request.");
AddAction(0, 0, "Load map from project file", "Map", "Use {0} as map", "Load an image and use it as map texture", "LoadMap");

AddStringParam("Base64 Image", "The base64 image to use as texture");
AddAction(2, 0, "Load map from base64", "Map", "Use {0} as map", "Load an image and use it as map texture", "LoadMapB64");

AddNumberParam("UID", "The unique identifier of the object to discover");
AddAction(1, 0, "Discover object", "Map", "Discover {0}", "Discover an object and show it on the map", "DiscoverObject");
//////////////////////////////////////////////////////////////
// Expressions
//AddExpression(3, ef_return_number, "Absolute mouse Y", "Cursor", "AbsoluteY", "Get the mouse cursor Y co-ordinate on the canvas.");

//AddExpression(0, ef_return_string, "Get current URL", "Navigation", "URL", "Get the current browser URL.");

ACESDone();

// Property grid properties for this plugin
var property_list = [];

// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
};

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
};

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
};

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
};

IDEInstance.prototype.OnCreate = function()
{
	this.instance.SetHotspot(new cr.vector2(0.5, 0.5));
	this.instance.SetSize(new cr.vector2(50, 50));
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
};

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
};

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
};

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
};

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
	var q = this.instance.GetBoundingQuad();
	var p1 = new cr.vector2(q.tlx, q.tly);
	var p2 = new cr.vector2(q.trx, q.try_);
	var p3 = new cr.vector2(q.brx, q.bry);
	var p4 = new cr.vector2(q.blx, q.bly);
	var c = cr.RGB(0, 0, 0);
	renderer.Line(p1, p2, c);
	renderer.Line(p2, p3, c);
	renderer.Line(p3, p4, c);
	renderer.Line(p4, p1, c);
};

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
};