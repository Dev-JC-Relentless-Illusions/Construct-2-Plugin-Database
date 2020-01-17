function GetPluginSettings()
{
	return {
		"name":			"Text box addon",
		"id":			"TextBoxAddon",
		"version":		"1.92",
		"description":	"A text field form control for the user to type text in to.",
		"author":		"Scirra (default) | Gregory Georges (v1.0) | PlayLive (v2.0)",
		"modified":		"PlayLive | Fer-N@ndynho",
		"help url":		"https://www.scirra.com/forum/viewtopic.php?f=153&t=149593",
		"category":		"Addon",
		"type":			"world",			// appears in layout
		"rotatable":	false,
		"flags":		pf_position_aces | pf_size_aces
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
				
AddStringParam("Text", "The text to compare the text box's text to.");
AddComboParamOption("case insensitive");
AddComboParamOption("case sensitive");
AddComboParam("Case", "Choose whether the comparison is case sensitive (FOO different to Foo) or case insensitive (FOO same as Foo).");
AddCondition(0, cf_none, "Compare text", "Text box", "Text is {0} (<i>{1}</i>)", "Compare the text currently entered in to the text box.", "CompareText");

AddCondition(1, cf_trigger, "On text changed", "Text box", "On text changed", "Triggered when the text in the text box changes.", "OnTextChanged");
AddCondition(2, cf_trigger, "On clicked", "Text box", "On clicked", "Triggered when the text box is clicked.", "OnClicked");
AddCondition(3, cf_trigger, "On double-clicked", "Text box", "On double-clicked", "Triggered when the text box is double-clicked.", "OnDoubleClicked");
AddCondition(4, cf_trigger, "On focus", "Text box", "On Focus", "Triggered input focus.", "OnFocus");
AddCondition(5, cf_trigger, "On blur", "Text box", "On Blur", "Triggered input blur.", "OnBlur");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

AddStringParam("Text", "The text to set in the text box.");
AddAction(0, af_none, "Set text", "Text box", "Set text to {0}", "Set the text box's text.", "SetText");

AddStringParam("Placeholder", "The new text box placeholder.");
AddAction(1, af_none, "Set placeholder", "Text box", "Set placeholder to {0}", "Set the text box's placeholder.", "SetPlaceholder");

AddAnyTypeParam("Append text", "Enter the text to append to the object's content.", "\"\"");
AddAction(2, 0, "Append text", "Text box", "Append <i>{0}</i>", "Add text to the end of the existing text.", "AppendText");

AddStringParam("Tooltip", "The tooltip to set on the text box.");
AddAction(3, af_none, "Set tooltip", "Text box", "Set tooltip to {0}", "Set the text box's tooltip.", "SetTooltip");

AddComboParamOption("Invisible");
AddComboParamOption("Visible");
AddComboParam("Visibility", "Choose whether to hide or show the text box.");
AddAction(4, af_none, "Set visible", "Appearance", "Set <b>{0}</b>", "Hide or show the text box.", "SetVisible");

AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParam("Mode", "Choose whether to enable or disable the text box.");
AddAction(5, af_none, "Set enabled", "Text box", "Set <b>{0}</b>", "Disable or enable the text box.", "SetEnabled");

AddComboParamOption("Read-only");
AddComboParamOption("Not read-only");
AddComboParam("Mode", "Choose whether to enable or disable read-only mode.");
AddAction(6, af_none, "Set read-only", "Text box", "Set <b>{0}</b>", "Turn read-only on or off.", "SetReadOnly");

AddAction(7, af_none, "Set focused", "Text box", "Set focused", "Set the input focus to the text box.", "SetFocus");

AddStringParam("Property name", "A CSS property name to set on the control.", "\"color\"");
AddStringParam("Value", "A string to assign as the value for this CSS property.", "\"#FF0000\"");
AddAction(8, af_none, "Set CSS style", "Appearance", "Set CSS style {0} to {1}", "Set a CSS style on the control.", "SetCSSStyle");

AddAction(9, af_none, "Set unfocused", "Text box", "Set unfocused", "Remove the input focus from the text box.", "SetBlur");

AddAction(10, 0, "Scroll Top", "Text box", "Scroll to the top line of a textarea.", "Scroll to the top line of a textarea.", "ScrollTop");
AddAction(11, af_none, "Scroll bottom", "Text box", "Scroll to bottom line of a textarea", "Scroll to the bottom line of a textarea.", "ScrollBottom");

AddAction(12, 0, "Select All", "Text box", "Select all the text inside the textbox.", "Select all the text inside the textbox.", "Selectall");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

AddExpression(0, ef_return_string, "Get text", "Text box", "Text", "Get the text box's text.");

ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_text,	"Text",						"",						"The initial text for the text box."), // 00
	new cr.Property(ept_text,	"Placeholder",				"",						"A tip to display when the text box is empty."), // 01
	new cr.Property(ept_text,	"Tooltip",					"",						"Display this text when hovering the mouse over the control."), // 02
	new cr.Property(ept_combo,	"Initial visibility",		"Visible",				"Choose whether the text box is visible on startup.", "Invisible|Visible"), // 03
	new cr.Property(ept_combo,	"Enabled",					"Yes",					"Choose whether the text box is enabled or disabled on startup.", "No|Yes"), // 04
	new cr.Property(ept_combo,	"Read-only",				"No",					"Choose whether the text box is read-only on startup.", "No|Yes"), // 05
	new cr.Property(ept_combo,	"Spell check",				"No",					"Allow the browser to spell-check the text box, if supported.",	"No|Yes"), // 06
	new cr.Property(ept_combo,	"Type",						"Text",					"The kind of text entered in to the text box, which also affects on-screen keyboards on touch devices.", "Text|Password|Email|Number|Telephone number|URL|Textarea"), // 07
	new cr.Property(ept_combo,	"Auto font size",			"Default",				"Automatically set the font size depending on the layer scale.", "No|Default|Small|Big|Large"), // 08
	new cr.Property(ept_text,	"CLASS (optional)",			"",						"An CLASS for the control allowing it to be styled with CSS from the page HTML."), // 09
	// addon simple
	new cr.Property(ept_section,"Addon (simple)",			"",						"Style properties of the text box."),
	new cr.Property(ept_font, 	"Font",						"Arial,-16",			"Choose the font to display.  This applies to all instances of this type."), // 10
	new cr.Property(ept_color,	"Color",					cr.RGB(0, 0, 0),		"Color of the text."), // 11
	new cr.Property(ept_combo,	"Alignment (horizontal)",	"Left",					"Horizontal alignment of the text.", "Left|Center|Right"), // 12
	new cr.Property(ept_combo,	"Alignment (vertical)",		"Center",				"*not stable.  Vertical alignment of the text.", "Top|Center|Bottom"), // 13
	new cr.Property(ept_combo,	"Background",				"Solid", 				"The background solid or transparent.", "Solid|Transparent"), // 14
	new cr.Property(ept_combo,	"Borders",					"Yes",					"Choose whether the text box has borders.", "No|Yes"), // 15
	new cr.Property(ept_combo,	"Text decoration",			"No",					"Text decoration in the text box.", "No|Underline|Line-Through|Overline"), // 16
	new cr.Property(ept_combo,	"Text shadow",				"No", 					"Set the shadow of the text.", "No|Yes"), // 17
	new cr.Property(ept_combo,	"Text transform",			"No",					"Text in uppercase or lowercase in the text box.", "No|Capitalize|Lowercase|Uppercase"), // 18
	// addon advance
	new cr.Property(ept_section,"Addon (advanced)",			"",						"Style properties of the text box."),
	new cr.Property(ept_text,	"Webfont URL",				"",						"Set the webfont URL for the text box."), // 19
	new cr.Property(ept_text,	"Webfont name",				"",						"The webfont name for the text box."), // 20
	new cr.Property(ept_color,	"Background Color",			cr.RGB(255, 255, 255),	"The background color."), // 21
	new cr.Property(ept_text,	"Border",					"",						"example: 3px solid #000000"), // 22
	new cr.Property(ept_text,	"Border radius",			"",						"example: 3px"), // 23
	new cr.Property(ept_text,	"Padding",					"",						"example: 3px"), // 24
	new cr.Property(ept_text,	"TextShadow",				"",						"If 'Text shadow' is 'Yes'.  example: 3px 3px 5px #000000") // 25
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
	this.just_inserted = false;
	this.font = null;

	// Properties for font
	this.font_str = "Arial,-16";		// default font string
	this.old_font_str = "";				// last font string, in case not changed
	this.recreate_font = true;			// font not yet created
	this.font = null;					// handle to font in IDE
}

// Called when drawing the text and the font needs to be recreated
IDEInstance.prototype.RecreateFont = function(renderer)
{
	// The font hasn't really changed: don't actually recreate
	if (this.font_str == this.old_font_str)
	{
		this.recreate_font = false;
		return;
	}
		
	var had_font = false;
	
	// Release any existing font first
	if (this.font)
	{
		renderer.ReleaseFont(this.font);
		had_font = true;
	}
	
	// Parse the font details out of the font string
	var font_info = cr.ParseFontString(this.font_str);
	
	// Attempt to create the font as requested
	this.font = renderer.CreateFont(font_info.face_name, font_info.face_size, font_info.bold, font_info.italic);
	
	// Creating the font failed: fall back to arial
	if (!this.font)
	{
		this.font = renderer.CreateFont("Arial", font_info.face_size, false, false);
		
		// Notify the user if the font has been changed via the property grid.  Don't notify
		// if this error happens just loading a layout.
		if (had_font)
		{
			BalloonTipLastProperty("Font not supported",
								   "The font you chose does not appear to be supported by Construct 2, for technical reasons.  "
								   + "The object has fallen back to 'Arial'.  Click the help link for more information.",
								   bti_warning);
		}
	}
	else if (!this.font.exact_match && had_font)
	{
		// The font was not an exact match.  Notify the user, but only when the font was changed,
		// don't display this when loading a layout.
		BalloonTipLastProperty("Font variation not supported",
							   "The exact font you chose does not appear to be supported by Construct 2, for technical reasons.  "
							   + "The object has fallen back to a different variation of the chosen font.  Click the help link for more information.",
							   bti_warning);
	}
	
	assert2(this.font, "Failed to create font or default Arial font");
		
	// Font has been created
	this.recreate_font = false;
	this.old_font_str = this.font_str;
}

IDEInstance.prototype.OnCreate = function()
{
	this.instance.SetHotspot(new cr.vector2(0, 0));
}

IDEInstance.prototype.OnInserted = function()
{
	this.instance.SetSize(new cr.vector2(150, 22));
}

IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
	// Recreate font if font property changed
	if (property_name === "Font")
	{
		this.font_str = this.properties["Font"];
		this.recreate_font = true;
	}
}

IDEInstance.prototype.OnRendererInit = function(renderer)
{
}
	
// Called to draw self in the editor
IDEInstance.prototype.Draw = function(renderer)
{
	// If the font is not yet created or needs recreating, recreate it
	if (!this.font || this.recreate_font)
		this.RecreateFont(renderer);

	// If there is a font present, draw it
	if (this.font)
	{
		var halign = ha_left;
		var valign = va_top;
		
		var hprop = this.properties["Alignment (horizontal)"];
		var vprop = this.properties["Alignment (vertical)"];
		
		if (hprop == "Center")
			halign = ha_center;
		else if (hprop == "Right")
			halign = ha_right;
		
		if (vprop == "Center")
			valign = ha_center;
		else if (vprop == "Bottom")
			valign = va_bottom;

		var quad = this.instance.GetBoundingQuad();
		if (this.properties["Background"] === "Solid")
			renderer.Fill(quad, this.properties["Enabled"] === "Yes" ? cr.RGB(255, 255, 255) : cr.RGB(224, 224, 224));
		if (this.properties["Borders"] === "Yes")
			renderer.Outline(quad, cr.RGB(0, 0, 0));
		
		if (this.properties["Text"].length)
		{
			this.font.DrawText(this.properties["Text"],
								quad,
								this.properties["Color"],
								halign,
								100,
								0,
								0,
								0,
								valign);
		}
		else
		{
			this.font.DrawText(this.properties["Placeholder"],
								quad,
								this.properties["Color"],
								halign,
								100,
								0,
								0,
								0,
								valign);
		}
	}
}

IDEInstance.prototype.OnRendererReleased = function(renderer)
{
	this.font = null;		// drop reference to created font
	this.old_font_str = "";
}