function GetPluginSettings()
{
  return {
    "name":         "MQTT",       // as appears in 'insert object' dialog, can be changed as long as "id" stays the same
    "id":           "Lele_MQTT",  // this is used to identify this plugin and is saved to the project; never change it
    "version":      "1.0",        // (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
    "description":  "MQTT client",
    "author":       "Bacchi Raffaele",
    "help url":     "http://www.egonet.it",
    "category":     "Lele - IoT", // Prefer to re-use existing categories, but you can set anything here
    "type":         "object",     // either "world" (appears in layout and is drawn), else "object"
    "rotatable":    false,        // only used when "type" is "world".  Enables an angle property on the object.
    "dependency":   "paho-mqtt.js",
    "flags":    0                 // uncomment lines to enable flags...
            | pf_singleglobal     // exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
          //  | pf_texture        // object has a single texture (e.g. tiled background)
          //  | pf_position_aces  // compare/set/get x, y...
          //  | pf_size_aces      // compare/set/get width, height...
          //  | pf_angle_aces     // compare/set/get angle (recommended that "rotatable" be set to true)
          //  | pf_appearance_aces  // compare/set/get visible, opacity...
          //  | pf_tiling         // adjusts image editor features to better suit tiled images (e.g. tiled background)
          //  | pf_animations     // enables the animations system.  See 'Sprite' for usage
          //  | pf_zorder_aces    // move to top, bottom, layer...
          //  | pf_nosize         // prevent resizing in the editor
          //  | pf_effects        // allow WebGL shader effects to be added
          //  | pf_predraw        // set for any plugin which draws and is not a sprite (i.e. does not simply draw
                                  // a single non-tiling image the size of the object) - required for effects to work properly
  };
};

////////////////////////////////////////
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])      // a number
// AddStringParam(label, description [, initial_string = "\"\""])    // a string
// AddAnyTypeParam(label, description [, initial_string = "0"])      // accepts either a number or string
// AddCmpParam(label, description)                    // combo with equal, not equal, less, etc.
// AddComboParamOption(text)                      // (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])      // a dropdown list parameter
// AddObjectParam(label, description)                  // a button to click and pick an object type
// AddLayerParam(label, description)                  // accepts either a layer number or name (string)
// AddLayoutParam(label, description)                  // a dropdown list with all project layouts
// AddKeybParam(label, description)                    // a button to click and press a key (returns a VK)
// AddAnimationParam(label, description)                // a string intended to specify an animation name
// AddAudioFileParam(label, description)                // a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,          // any positive integer to uniquely identify this condition
//        flags,        // (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//                  // cf_deprecated, cf_incompatible_with_triggers, cf_looping
//        list_name,      // appears in event wizard list
//        category,      // category in event wizard list
//        display_str,    // as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//        description,    // appears in event wizard dialog when selected
//        script_name);    // corresponding runtime function name
        
// example        
//AddNumberParam("Number", "Enter a number to test if positive.");
//AddCondition(0, cf_none, "Is number positive", "My category", "{0} is positive", "Description for my condition!", "MyCondition");

// https://www.scirra.com/manual/15/sdk :
// HKEY_CURRENT_USER\Software\Scirra\Construct2\html5\devmode 1 to force plugin reload without restart construct2
// https://www.scirra.com/forum/force-reload-refresh_t75210   to force browser cache update
AddCondition(0, cf_trigger, "On opened", "Connection", "On connection opened", "Triggered when the connection to the MQTT broker is successfully established.", "OnOpened");

AddCondition(1, cf_trigger, "On Subscribed", "Connection", "On topic subscribed", "Triggered when the MQTT topic subscribed", "OnSubscribed");

AddCondition(2, cf_trigger, "On closed", "Connection", "On connection closed", "Triggered when an active connection is closed.", "OnClosed");

AddCondition(3, cf_trigger, "On error", "Connection", "On error", "Triggered when there is an error.", "OnError");

AddCondition(4, cf_trigger, "On message", "Data", "On message", "Triggered when a message is received from the server.", "OnMessage");

AddCondition(5, cf_trigger, "On message delivered", "Data", "On message delivered", "Triggered when a message is sent.", "OnDelivered");

AddCondition(6, cf_none, "Is open", "Connection", "Is connection open", "True if the connection is currently open.", "IsOpen");

AddCondition(7, cf_none, "Is connecting", "Connection", "Is connecting", "True if the connection is currently being established.", "IsConnecting");


////////////////////////////////////////
// Actions

// AddAction(id,        // any positive integer to uniquely identify this action
//       flags,        // (see docs) af_none, af_deprecated
//       list_name,      // appears in event wizard list
//       category,      // category in event wizard list
//       display_str,    // as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//       description,    // appears in event wizard dialog when selected
//       script_name);    // corresponding runtime function name

// example
// AddStringParam("Message", "Enter a string to alert.");
// AddAction(0, af_none, "Alert", "My category", "Alert {0}", "Description for my action!", "MyAction");
       
AddStringParam("Host", "The address of the messaging server, as a fully qualified WebSocket URI, as a DNS name or dotted decimal IP address.", "\"iot.eclipse.org\"");
AddNumberParam("Port", "The port number to connect to - only required if host is not a URI.", "80");
AddStringParam("ClientId", "The Messaging client identifier, between 1 and 23 characters in length.", "\"MyID\"");
AddStringParam("Path", "The path on the host to connect to - only used if host is not a URI.", "\"/ws\"");
AddStringParam("User", "Authentication username for this connection.", "\"\"");
AddStringParam("Password", "Authentication password for this connection.", "\"\"");
AddNumberParam("KeepAlive", "he server disconnects this client if there is no activity for this number of seconds.", "60");
AddNumberParam("Timeout", "If the connect has not succeeded within this number of seconds, it is deemed to have failed.", "30");
//AddComboParamOption("False");
//AddComboParamOption("True");
//AddComboParam("useSSL", "disable/enable an SSL Websocket connection.", 0);
AddNumberParam("useSSL", "0|1 to disable|enable an SSL Websocket connection.", "0"); // prefer number param instead of combo so can use expression to set it
//AddComboParamOption("False");
//AddComboParamOption("True");
//AddComboParam("CleanSession", "if true the client and server persistent state is deleted on successful connect.", 0);
AddNumberParam("CleanSession", "0|1 to disable|enable client and server persistent state to be deleted on successful connect.", "0"); // prefer number param instead of combo so can use expression to set it
AddStringParam("lastWillTopic", "Sent by the server when the client disconnects abnormally.", "\"\"");
//AddComboParamOption("0");
//AddComboParamOption("1");
//AddComboParamOption("2");
//AddComboParam("lastWillQos", "The Quality of Service used to deliver the message. 0=best effort, 1=at least once, 2=exactly once.", 0);
AddNumberParam("lastWillQos", "0|1|2 The Quality of Service used to deliver the message. 0=best effort, 1=at least once, 2=exactly once.", "0"); // prefer number param instead of combo so can use expression to set it
//AddComboParamOption("False");
//AddComboParamOption("True");
//AddComboParam("lastWillRetain", "disable/enable retained message by the server and delivered to future subscriptions.", 0);
AddNumberParam("lastWillRetain", "0|1 to disable|enable retained message by the server and delivered to future subscriptions.", "0"); // prefer number param instead of combo so can use expression to set it
AddStringParam("lastWillMessage", "Sent by the server when the client disconnects abnormally.", "\"\"");
AddAction(0, af_none, "Connect", "Connection", "Connect to <i>{0}</i>", "Connect to a MQTT server.", "Connect");

AddStringParam("Topic", "Enter the topic to subscribe", "\"World\"");
//AddComboParamOption("0");
//AddComboParamOption("1");
//AddComboParamOption("2");
//AddComboParam("Qos", "The maiximum qos of any publications sent as a result of making this subscription.", 2);
AddNumberParam("Qos", "0|1|2 The maximum qos of any publications sent as a result of making this subscription.", "2"); // prefer number param instead of combo so can use expression to set it
AddAction(1, af_none, "Subscribe", "Connection", "Subscribe to <i>{0}</i> topic", "Subscribe a topic.", "Subscribe");

AddStringParam("Topic", "The topic where to send message.", "\"World\"");
AddStringParam("Message", "A text string to send to the server.");
//AddComboParamOption("0");
//AddComboParamOption("1");
//AddComboParamOption("2");
//AddComboParam("Qos", "The Quality of Service used to deliver the message.", 0);
AddNumberParam("Qos", "0|1|2 The Quality of Service used to deliver the message.", "0"); // prefer number param instead of combo so can use expression to set it
//AddComboParamOption("False");
//AddComboParamOption("True");
//AddComboParam("Retain", "if true, the message is to be retained by the server and delivered to both current and future subscriptions.", 0);
AddNumberParam("Retain", "0|1 if 1 the message is to be retained by the server and delivered to both current and future subscriptions.", "0"); // prefer number param instead of combo so can use expression to set it
AddAction(2, af_none, "Send text", "Data", "Send text <i>{1}</i> to topic <i>{0}</i>", "Send a text string to the server.", "Send");

AddStringParam("Topic", "Enter the topic to un-subscribe", "\"World\"");
AddAction(3, af_none, "Unsubscribe", "Connection", "Unsubscribe the <i>{0}</i> topic", "Unsubscribe a topic.", "Unsubscribe");

AddAction(4, af_none, "Close", "Connection", "Close connection", "Close active MQTT connection.", "Close");


////////////////////////////////////////
// Expressions

// AddExpression(id,      // any positive integer to uniquely identify this expression
//         flags,      // (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//                // ef_return_any, ef_variadic_parameters (one return flag must be specified)
//         list_name,    // currently ignored, but set as if appeared in event wizard
//         category,    // category in expressions panel
//         exp_name,    // the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//         description);  // description in expressions panel

// example
//AddExpression(0, ef_return_number, "Leet expression", "My category", "MyExpression", "Return the number 1337.");
AddExpression(0, ef_return_string, "", "Data", "MessageText", "The text content of the message in 'On message'.");
AddExpression(1, ef_return_string, "", "Connection", "ErrorMsg", "The error message in 'On error'.");
AddExpression(2, ef_return_string, "", "Data", "Topic", "The topic of 'On message'.");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,    name,  initial_value,  description)    // an integer value
// new cr.Property(ept_float,    name,  initial_value,  description)    // a float value
// new cr.Property(ept_text,    name,  initial_value,  description)    // a string
// new cr.Property(ept_color,    name,  initial_value,  description)    // a color dropdown
// new cr.Property(ept_font,    name,  "Arial,-16",   description)    // a font with the given face name and size
// new cr.Property(ept_combo,    name,  "Item 1",    description, "Item 1|Item 2|Item 3")  // a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,    name,  link_text,    description, "firstonly")    // has no associated value; simply calls "OnPropertyChanged" on click

var property_list = [
  //new cr.Property(ept_integer,   "My property",    77,    "An example property.")
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