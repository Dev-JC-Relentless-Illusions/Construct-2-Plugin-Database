// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.Lele_MQTT = function(runtime)
{
  this.runtime = runtime;
};

(function ()
{
  /////////////////////////////////////
  // *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
  //                            vvvvvvvv
  var pluginProto = cr.plugins_.Lele_MQTT.prototype;
    
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
    
    // any other properties you need, e.g...
    // this.myValue = 0;
  };
  
  var instanceProto = pluginProto.Instance.prototype;
  
  // called whenever an instance is created
  instanceProto.onCreate = function()
  {
    // note the object is sealed after this call; ensure any properties you'll ever need are set on the object
    // e.g...
    // this.myValue = 0;
    this.client = null;
    this.Topic = ""
    this.ReceivedMessage = "";
    this.errorMsg = "";
    this.connected = false;
  };
  
  // called whenever an instance is destroyed
  // note the runtime may keep the object after this call for recycling; be sure
  // to release/recycle/reset any references to other objects in this function.
  instanceProto.onDestroy = function ()
  {
  };
  
  // called when saving the full state of the game
  instanceProto.saveToJSON = function ()
  {
    // return a Javascript object containing information about your object's state
    // note you MUST use double-quote syntax (e.g. "property": value) to prevent
    // Closure Compiler renaming and breaking the save format
    return {
      // e.g.
      //"myValue": this.myValue
    };
  };
  
  // called when loading the full state of the game
  instanceProto.loadFromJSON = function (o)
  {
    // load from the state previously saved by saveToJSON
    // 'o' provides the same object that you saved, e.g.
    // this.myValue = o["myValue"];
    // note you MUST use double-quote syntax (e.g. o["property"]) to prevent
    // Closure Compiler renaming and breaking the save format
  };
  
  // only called if a layout object - draw to a canvas 2D context
  instanceProto.draw = function(ctx)
  {
  };
  
  // only called if a layout object in WebGL mode - draw to the WebGL context
  // 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
  // directory or just copy what other plugins do.
  instanceProto.drawGL = function (glw)
  {
  };
  
  // The comments around these functions ensure they are removed when exporting, since the
  // debugger code is no longer relevant after publishing.
  /**BEGIN-PREVIEWONLY**/
  instanceProto.getDebuggerValues = function (propsections)
  {
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
  
  instanceProto.onDebugValueEdited = function (header, name, value)
  {
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

  // the example condition
  //Cnds.prototype.MyCondition = function (myparam)
  //{
  //  // return true if number is positive
  //  return myparam >= 0;
  //};
  
  // ... other conditions here ...
  Cnds.prototype.OnOpened = function ()
  {
    return true;
  };
  
  Cnds.prototype.OnSubscribed = function ()
  {
    return true;
  };
  
  Cnds.prototype.OnClosed = function ()
  {
    return true;
  };
  
  Cnds.prototype.OnError = function ()
  {
    return true;
  };
  
  Cnds.prototype.OnMessage = function ()
  {
    return true;
  };
  
  Cnds.prototype.OnDelivered = function ()
  {
    return true;
  };
  
  Cnds.prototype.IsOpen = function ()
  {
    return this.connected;
  };
  
  Cnds.prototype.IsConnecting = function ()
  {
    //return this.ws && this.ws.readyState === 0 /* CONNECTING */;
    return this.client !== null && this.connected === false;
  };
  
  
  pluginProto.cnds = new Cnds();
  
  //////////////////////////////////////
  // Actions
  function Acts() {};

  // the example action
  //Acts.prototype.MyAction = function (myparam)
  //{
    // alert the message
  //  alert(myparam);
  //};
  
  // ... other actions here ...
    
  Acts.prototype.Connect = function (Host_, Port_, ClientID_,
    Path_, User_, Password_, KeepAlive_, Timeout_, Tls_, CleanSession_,
    lastWillTopic_, lastWillQos_, lastWillRetain_, lastWillMessage_)
  {
    var self = this;
    
    if(this.client)
    {
    	this.errorMsg = "Connect error: InvalidState";
      this.runtime.trigger(cr.plugins_.Lele_MQTT.prototype.cnds.OnError, self);
      return;
    }
    this.connected = false;

    // Create a client instance: Broker, Port, Websocket Path, Client ID
    //if(Path_.length > 0)
    this.client = new Paho.MQTT.Client(Host_, Port_, Path_, ClientID_);
    //else this.client = new Paho.MQTT.Client(Host_, Port_, ClientID_);
    this.client.onConnectionLost = onConnectionLost; // set callback handlers
    this.client.onMessageDelivered = onMessageDelivered;
    this.client.onMessageArrived = onMessageArrived;
    //this.client.disconnectedPublishing = 0;
    this.client.disconnectedBufferSize = 10; // set the maximum number of messages that the disconnected buffer will hold before rejecting new messages
    
    var options = 
    {
      invocationContext: {host : Host_, port: Port_, path: this.client.path, clientId: ClientID_},
      timeout: Timeout_,
      keepAliveInterval: KeepAlive_,
      cleanSession: (CleanSession_ !== 0),
      useSSL: (Tls_ !== 0),
      onSuccess: onConnect,
      onFailure: onFail
    };
    
    if(User_.length > 0) options.userName = User_;
    if(Password_.length > 0) options.password = Password_;

    if(lastWillTopic_.length > 0)
    {
      var lastWillMessage = new Paho.MQTT.Message(lastWillMessage_);
      lastWillMessage.destinationName = lastWillTopic_;
      lastWillMessage.qos = (lastWillQos_ > 2) ? 2 : ((lastWillQos_ < 0) ? 0 : lastWillQos_);
      lastWillMessage.retained = (lastWillRetain_ != 0);
      options.willMessage = lastWillMessage;
    }
    
    try { this.client.connect(options); } // connect the client
    catch (e)
    {
    	this.client = null;
      this.errorMsg = "Connect error: InvalidState";
      this.runtime.trigger(cr.plugins_.Lele_MQTT.prototype.cnds.OnError, self);
      return;
    }
    
    // called when the client connects
    function onConnect()
    {    
      self.connected = true;
      self.runtime.trigger(cr.plugins_.Lele_MQTT.prototype.cnds.OnOpened, self); 
    }

    // called when the client loses its connection
    function onConnectionLost(responseObject)
    {
      self.connected = false; self.client = null;
      if (responseObject.errorCode !== 0)
      {
        self.errorMsg = responseObject.errorMessage;
        self.runtime.trigger(cr.plugins_.Lele_MQTT.prototype.cnds.OnClosed, self);
      }
    }
    
    function onFail(responseObject)
    { // connection failed
      self.connected = false; self.client = null;
      if (responseObject.errorCode !== 0)
      {
        self.errorMsg = responseObject.errorMessage;
        self.runtime.trigger(cr.plugins_.Lele_MQTT.prototype.cnds.OnError, self);
      }
    }
    
    function onMessageDelivered(message)
    {
      //self.ReceivedMessage = message.payloadString;
      self.runtime.trigger(cr.plugins_.Lele_MQTT.prototype.cnds.OnDelivered, self);
    }

    // called when a message arrives
    function onMessageArrived(message)
    {
    	self.Topic = message.destinationName;
      self.ReceivedMessage = message.payloadString;
      self.runtime.trigger(cr.plugins_.Lele_MQTT.prototype.cnds.OnMessage, self);
    }
  };
  
  //-------
  
  Acts.prototype.Subscribe = function (Topic_, Qos_)
  {
  	var self = this;

    if(!this.connected) return;
    
    try // connect the client
    { 
    	this.client.subscribe(Topic_,
        { qos: (Qos_ > 2) ? 2 : ((Qos_ < 0) ? 0 : Qos_), onSuccess: onSubscribed, onFailure: onFail }  );
    } 
    catch (e)
    {
      this.errorMsg = "Subscribe error";
      this.runtime.trigger(cr.plugins_.Lele_MQTT.prototype.cnds.OnError, self);
      return;
    }
    
    function onSubscribed()
    {    
      self.runtime.trigger(cr.plugins_.Lele_MQTT.prototype.cnds.OnSubscribed, self); 
    }
    
    function onFail()
    {
      self.errorMsg = "Subscribe fail";
      self.runtime.trigger(cr.plugins_.Lele_MQTT.prototype.cnds.OnError, self); 
    }
    
  };
  
  Acts.prototype.Send = function (topic_, msg_, Qos_, Retain_)
  {
    if (!this.connected) return;
    
    
    try { this.client.send(topic_, msg_, (Qos_ > 2) ? 2 : ((Qos_ < 0) ? 0 : Qos_), (Retain_ != 0)); }
    catch (e)
    {
      this.errorMsg = "Send Failed";
      this.runtime.trigger(cr.plugins_.Lele_MQTT.prototype.cnds.OnError, this);
    }
  };
  
  Acts.prototype.Unsubscribe = function (Topic_)
  {
    if(!this.connected) return;
    try { this.client.unsubscribe(Topic_); }
    catch (e) { }
  };
  
  Acts.prototype.Close = function ()
  {
    if(this.client)
    {
    	try { this.client.disconnect(); } // diconnect the client
      catch (e) { }
    }
    this.connected = false; this.client = null;
  };
  
  pluginProto.acts = new Acts();
  
  //////////////////////////////////////
  // Expressions
  function Exps() {};
  
  // the example expression
  //Exps.prototype.MyExpression = function (ret)  // 'ret' must always be the first parameter - always return the expression's result through it!
  //{
  //  ret.set_int(1337);        // return our value
    // ret.set_float(0.5);      // for returning floats
    // ret.set_string("Hello");    // for ef_return_string
    // ret.set_any("woo");      // for ef_return_any, accepts either a number or string
  //};
  
  // ... other expressions here ...
  Exps.prototype.MessageText = function (ret)
  {
    ret.set_string(this.ReceivedMessage);
  };
  
  Exps.prototype.ErrorMsg = function (ret)
  {
    ret.set_string(cr.is_string(this.errorMsg) ? this.errorMsg : "");
  };  
  
  Exps.prototype.Topic = function (ret)
  {
    ret.set_string(this.Topic);
  };
  
  pluginProto.exps = new Exps();

}());