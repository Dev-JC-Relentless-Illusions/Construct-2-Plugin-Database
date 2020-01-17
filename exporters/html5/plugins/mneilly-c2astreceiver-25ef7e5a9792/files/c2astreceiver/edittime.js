function GetPluginSettings()
{
    return {
        "name":        "C2ast Receiver",     // can be changed
        "id":          "C2astReceiver",    // never change
        "version":     "1.0",               // C2 shows compatibility warnings based on this
        "description": "Adds Chromecast receiver functionality.",
        "author":      "Michael Neilly",
        "help url":    "https://bitbucket.org/mneilly/c2astreceiver/wiki/Home",
        "category":    "Platform specific", // For Chromecast only!!!
        "type":        "object",
        "rotatable":   false,
        "flags":       pf_singleglobal,
        "dependency":  "http://www.gstatic.com/cast/sdk/libs/receiver/2.0.0/cast_receiver.js"
    };
};

////////////////////////////////////////
// Conditions

AddCondition(0, cf_trigger, "On ready", "Connection",
             "On cast receiver ready",
             "Triggered when the cast receiver manager has been started and the application is ready.",
             "OnReady");

AddCondition(1, cf_trigger, "On sender connected", "Connection",
             "On cast sender connected",
             "Triggered when a cast sender has connected the this receiver.",
             "OnSenderConnected");

AddCondition(2, cf_trigger, "On sender disconnected", "Connection",
             "On cast sender disconnected",
             "Triggered when a cast sender disconnects from this receiver.",
             "OnSenderDisconnected");

AddCondition(3, cf_trigger, "On shutdown", "System",
             "On application shutdown", 
             "Triggered when the application shuts down.",
             "OnShutdown");

AddCondition(4, cf_trigger, "On system volume changed", "System",
             "On cast volume changed",
             "Triggered when the volume level has been changed.",
             "OnSystemVolumeChanged");

AddCondition(5, cf_trigger, "On visibility changed", "System",
             "On cast visibility changed",
             "Triggered when the visibility changed.",
             "OnVisibilityChanged");

AddCondition(6, cf_trigger, "On Message", "Messages",
             "On cast message",
             "Triggered when a cast message is received from a sender.",
             "OnMessage");

AddCondition(7, cf_none, "Is Connected", "Connection",
             "Is a connection open", "True if a sender session is currently open.", "IsConnected");

AddCondition(8, cf_none, "Is Listening", "Connection",
             "Is listening",
             "True if the receiver is running and listening for sender connections.",
             "IsListening");

AddCondition(9, cf_none, "Is Supported", "Connection",
             "Is cast supported",
             "True if the user's client is a cast receiver.",
             "IsSupported");

////////////////////////////////////////
// Actions

AddStringParam("Data", "A text string to send to the server.");
AddStringParam("SenderId", "The ID of the sender to send the message to.");
AddAction(0, af_none, "Send Message", "Sender", "Send text <i>{0}</i> to {1}", "Send a text string to the sender.", "Send");

//AddAction(1, af_none, "Start Receiver", "Receiver", "Start Cast Receiver", "Start the Cast Receiver and listen for connections from Cast Sender apps.", "StartReceiver");

////////////////////////////////////////
// Expressions

AddExpression(0, ef_return_string, "", "Data", "MessageText", "The text content of the message in 'On message'.");
AddExpression(1, ef_return_string, "", "Connection", "ErrorMsg", "The error message in 'On error'.");
AddExpression(2, ef_return_string, "", "Connection", "SenderId", "The ID of the sender.");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin

var property_list = [
    new cr.Property(ept_text, "Cast Message Bus Name", "us.neilly.michael.castreceiver", "Namespace to use to for sending messages between cast receiver and senders for this app. Change this to be unique for your game.")
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
