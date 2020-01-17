function GetPluginSettings()
{
	return {
		"name":			"Comment Layout",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"frez_CommentLayout",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Show comments in layout.",
		"author":		"FrezerTop",
		"help url":		"<your website or a manual entry on Scirra.com>",
		"category":		"Frez - Other",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"world",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		0						// uncomment lines to enable flags...
												
	};
};


ACESDone();



var property_list = [
    new cr.Property(ept_section, 	"Comment settings", "",															"Color,Font and content of comment."),
		new cr.Property(ept_text,		  "Comment",			"Comment",						"You comment."),	
		new cr.Property(ept_color,		  "Color",				cr.RGB(0, 0, 0),				"Comment color."),
		new cr.Property(ept_font, 		  "Font",				"Arial,-16",					"Font comment"),
		new cr.Property(ept_combo,	      "Visible",	        "Yes",	    					"Visible comment.", "No|Yes"),
	 
	 
	 new cr.Property(ept_section, 	"Background settings", 		"",														"Settings of background."),
		new cr.Property(ept_combo,	      "Background",	        "No",	    					"Background of comment.", "No|Yes"),
		new cr.Property(ept_color,		  "Background color",	cr.RGB(123, 123, 123),			"Background color."),		
		
	new cr.Property(ept_section, 	"Outline settings", 		"",														"Settings of Outline."),
		new cr.Property(ept_combo,	      "Outline",	        "No",	    					"Outline of comment.", "No|Yes"),
		new cr.Property(ept_color,		  "Outline color",		cr.RGB(255, 0, 0),				"Outline color."),		
	];
	
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
}

function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	this.instance = instance;
	this.type = type;
	
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	this.font_str = "Arial,-16";		
	this.old_font_str = "";				
	this.recreate_font = true;			
	this.font = null;					

}

IDEInstance.prototype.OnInserted = function()
{
	this.instance.SetSize(new cr.vector2(200, 25));
}

IDEInstance.prototype.OnDoubleClicked = function()
{
	alert('//'+this.properties["Comment"]);	
}

IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
	if (property_name === "Font")
	{
		this.font_str = this.properties["Font"];
		this.recreate_font = true;
	}	
}

IDEInstance.prototype.RecreateFont = function(renderer)
{
	if (this.font_str == this.old_font_str)
	{
		this.recreate_font = false;
		return;
	}
		
	var had_font = false;
	
	if (this.font)
	{
		renderer.ReleaseFont(this.font);
		had_font = true;
	}
	
	var font_info = cr.ParseFontString(this.font_str);
	
	this.font = renderer.CreateFont(font_info.face_name, font_info.face_size, font_info.bold, font_info.italic);
	
	if (!this.font)
	{
		this.font = renderer.CreateFont("Arial", font_info.face_size, false, false);
		
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
		BalloonTipLastProperty("Font variation not supported",
							   "The exact font you chose does not appear to be supported by Construct 2, for technical reasons.  "
							   + "The object has fallen back to a different variation of the chosen font.  Click the help link for more information.",
							   bti_warning);
	}
	
	assert2(this.font, "Failed to create font or default Arial font");
		
	this.recreate_font = false;
	this.old_font_str = this.font_str;

}
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

IDEInstance.prototype.Draw = function(renderer)
{
	if (!this.font || this.recreate_font){
		this.RecreateFont(renderer);
	}
	
	if (this.font)
	{
	
	var quad = this.instance.GetBoundingQuad();
	
	
		//VisibleComment == "Visible"
	var IsVisible = (this.properties["Visible"] == "Yes");	
	if(IsVisible){	
		this.font.DrawText(this.properties["Comment"], this.instance.GetBoundingQuad(), this.properties["Color"]);		
}
			
			
		//Background == "Yes"	
	var Background = (this.properties["Background"] == "Yes");	
	if(Background){
		renderer.SetTexture(null);
		renderer.Fill(quad, this.properties["Background color"]);
		
		if(IsVisible){	
		this.font.DrawText(this.properties["Comment"], this.instance.GetBoundingQuad(), this.properties["Color"]);		
}}


		//Outline == "Yes"	
	var Outline = (this.properties["Outline"] == "Yes");	
	if(Outline){
		renderer.Outline(quad, this.properties["Outline color"]);
		
		if(IsVisible){	
		this.font.DrawText(this.properties["Comment"], quad, this.properties["Color"]);		
}}
			
			
			
			
	
	}
}

IDEInstance.prototype.OnRendererReleased = function(renderer)
{
	this.font = null;		
	this.old_font_str = "";
}