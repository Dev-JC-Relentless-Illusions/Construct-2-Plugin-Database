function GetPluginSettings()
{
	return {
		"name":			"CordovaAdmobPro",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"CordovaAdmobPro",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.2",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Show adds calling cordova-plugin-admobpro by Liming Xie",
		"author":		"Josek5494",
		"help url":		"http://hermitsdevelopment.blogspot.com.es",
		"category":		"Plugins by Josek5494",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":	pf_singleglobal
	};
};

////////////////////////////////////////
// Conditions

// Banners

AddCondition(4, cf_trigger, "On banner ad preloaded", "Banners", "On banner ad preloaded", 
	"Triggered when a banner ad is preloaded.", "onBannerAdpreloaded");

AddCondition(0, cf_trigger, "On banner ad dismissed", "Banners", "On banner ad dismissed", 
	"Triggered when a banner ad is dismissed.", "onBannerAdDismissed");

AddCondition(5, cf_trigger, "On banner ad failed", "Banners", "On banner ad failed", 
	"Triggered when an banner ad fails to load.", "onFailedBannerAd");

AddCondition(6, cf_none, "Is banner showing", "Banners", "Is banner ad showing", 
	"True if a banner is showing.", "isShowingBannerAd");

// Interstitials

AddCondition(1, cf_trigger, "On interstitial ad preloaded", "Interstitials", "On interstitial ad preloaded", 
	"Triggered when a interstitial is received and ready to show.", "onInterstitialAdPreloaded");

AddCondition(2, cf_trigger, "On interstitial ad dismissed", "Interstitials", "On interstitial ad dismissed", 
	"Triggered when a interstitial ad is dismissed.", "onInterstitialAdDismissed");

AddCondition(3, cf_trigger, "On interstitial ad failed", "Interstitials", "On interstitial ad failed", 
	"Triggered when an interstitial ad fails to load.", "onFailedInterstitialAd");

AddCondition(7, cf_none, "Is interstitial showing", "Interstitials", "Is interstitial ad showing", 
	"True if an interstitial is showing.", "isShowingInterstitialAd");

////////////////////////////////////////
// Actions

// Banners ///////////////////////////////

// Remove

AddAction(1, af_none, "Remove banner", "Banners", "Remove the banner ad", 
	"Remove the currently showing banner ad. (Needed to create a new banner in different pos)", "removeBanner");

// Load and show

AddComboParamOption("TOP LEFT");
AddComboParamOption("TOP CENTER");
AddComboParamOption("TOP RIGHT");
AddComboParamOption("LEFT");
AddComboParamOption("CENTER");
AddComboParamOption("RIGHT");
AddComboParamOption("BOTTOM LEFT");
AddComboParamOption("BOTTOM CENTER");
AddComboParamOption("BOTTOM RIGHT");
AddComboParam("Position", "Choose where the banner ad will appear.");
AddComboParamOption("SMART BANNER");
AddComboParamOption("BANNER");
AddComboParamOption("MEDIUM RECTANGLE");
AddComboParamOption("FULL BANNER");
AddComboParamOption("LEADERBOARD");
AddComboParamOption("SKYSCRAPER");
AddComboParam("Size", "Choose the banner size.");
AddComboParamOption("True");
AddComboParamOption("False");
AddComboParam("Overlap", "Set to true if want to show the ad overlapping.");
AddComboParamOption("True");
AddComboParamOption("False");
AddComboParam("Test mode", "Set to true if want to show test ad.");
AddAction(2, af_none, "Load and show a banner", "Banners", "Load and show a banner ad", "Start loading a banner ad, and autoshow when ready.", "loadBanner");

// Only load

AddComboParamOption("SMART BANNER");
AddComboParamOption("BANNER");
AddComboParamOption("MEDIUM RECTANGLE");
AddComboParamOption("FULL BANNER");
AddComboParamOption("LEADERBOARD");
AddComboParamOption("SKYSCRAPER");
AddComboParam("Size", "Choose the banner size.");
AddComboParamOption("True");
AddComboParamOption("False");
AddComboParam("Overlap", "Set to true if want to show the ad overlapping.");
AddComboParamOption("True");
AddComboParamOption("False");
AddComboParam("Test mode", "Set to true if want to show test ad.");
AddAction(3, af_none, "Load a banner", "Banners", "Load a banner ad", "Start loading a banner ad. Be sure the banner is loaded before show(just wait a few seconds)", "onlyLoadBanner");

// Show

AddComboParamOption("TOP LEFT");
AddComboParamOption("TOP CENTER");
AddComboParamOption("TOP RIGHT");
AddComboParamOption("LEFT");
AddComboParamOption("CENTER");
AddComboParamOption("RIGHT");
AddComboParamOption("BOTTOM LEFT");
AddComboParamOption("BOTTOM CENTER");
AddComboParamOption("BOTTOM RIGHT");
AddComboParam("Position", "Choose where the banner ad will appear.");
AddAction(4, af_none, "Show a preloaded banner", "Banners", "Show a banner ad", "Show a preloaded banner ad. Be sure the banner is loaded before show(just wait a few seconds)", "showBanner");

// Interstitials /////////////////////////////////////

// Load and show

AddComboParamOption("True");
AddComboParamOption("False");
AddComboParam("Overlap", "Set to true if want to show the ad overlapping.");
AddComboParamOption("True");
AddComboParamOption("False");
AddComboParam("Test mode", "Set to true if want to show test ad.");
AddAction(5, af_none, "Load and show an interstitial", "Interstitials", "Load and show an interstitial", "Start loading an interstitial and autoshow when ready.", "loadInterstitial");

// Only load

AddComboParamOption("True");
AddComboParamOption("False");
AddComboParam("Overlap", "Set to true if want to show the ad overlapping.");
AddComboParamOption("True");
AddComboParamOption("False");
AddComboParam("Test mode", "Set to true if want to show test ad.");
AddAction(6, af_none, "Load an interstitial", "Interstitials", "Load an interstitial", 
	"Start loading an interstitial. Be sure the interstitial is loaded before show(just wait a few seconds)", "onlyLoadInterstitial");

// Show

AddAction(7, af_none, "Show a preloaded interstitial", "Interstitials", "Show a preloaded interstitial", 
	"Show a preloaded interstitial. Be sure the interstitial is loaded before show(just wait a few seconds)", "showInterstitial");

// Reward videos /////////////////////////////////////

// Load and show

AddComboParamOption("True");
AddComboParamOption("False");
AddComboParam("Overlap", "Set to true if want to show the ad overlapping.");
AddComboParamOption("True");
AddComboParamOption("False");
AddComboParam("Test mode", "Set to true if want to show test ad.");
AddAction(8, af_none, "Load and show a reward video", "RewardVideos", "Load and show a reward video", "Start loading a reward video and autoshow when ready.", "loadShowRewVid");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Properties

var property_list = [

    new cr.Property(ept_text,   "Banner ID",  "", "Ad unit ID for the banner ad."),
    new cr.Property(ept_text,   "Interstitial ID", "", "Ad unit ID for the interstitials."),
    new cr.Property(ept_text,   "Reward Video ID", "", "Ad unit ID for rewarded videos.")

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