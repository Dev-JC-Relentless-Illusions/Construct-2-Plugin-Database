// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.C2astReceiver = function(runtime)
{
    this.runtime = runtime;
};

(function ()
 {
     var pluginProto = cr.plugins_.C2astReceiver.prototype;
     
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
     };
     
     var instanceProto = pluginProto.Instance.prototype;
     var isSupported = (navigator.userAgent.toLowerCase().indexOf('crkey') !== -1);
     
     console.log("isSupported = " + isSupported);

     // called whenever an instance is created
     instanceProto.onCreate = function()
     {
         this.isStarted = false;            // cast receiver started
         this.isReady = false;          // cast receiver is ready

         this.senderStatus= [];
         this.senderCount = 0;

         this.senderId = -1;
         this.messageText = "";

         this.errorMsg = "";
         
         if (isSupported) {
             
             console.log("Starting Cast Receiver");

             // Try to get a cast receiver manager instance
             try {
                 cast.receiver.logger.setLevelValue(0);
                 this.castRM = cast.receiver.CastReceiverManager.getInstance();
             } catch (e) {
                 this.errorMsg = "Unable to start cast receiver.";
                 console.log(this.errorMsg);
                 return;
             }

             this.isStarted = true;
             var self = this;

             // handler for the 'ready' event
             this.castRM.onReady = function(event) {
                 self.isReady = true;
                 self.castRM.setApplicationState("Application Ready");
                 self.runtime.trigger(cr.plugins_.C2astReceiver.prototype.cnds.OnReady, self);
             };
             
             this.castRM.onShutdown = function(event) {
                 self.castRM.setApplicationState("Shutdown");
                 self.runtime.trigger(cr.plugins_.C2astReceiver.prototype.cnds.OnShutdown, self);
             };
             
             // handler for 'senderconnected' event
             this.castRM.onSenderConnected = function(event) {
                 self.senderId = event.senderId;
                 self.senderStatus[event.senderId] = true;
                 self.senderCount = self.castRM.getSenders().length;
                 self.runtime.trigger(cr.plugins_.C2astReceiver.prototype.cnds.OnSenderConnected, self);
             };
             
             // handler for 'senderdisconnected' event
             this.castRM.onSenderDisconnected = function(event) {
                 self.senderId = event.senderId;
                 self.senderStatus[event.senderId] = false;
                 self.senderCount = self.castRM.getSenders().length;
                 self.runtime.trigger(cr.plugins_.C2astReceiver.prototype.cnds.OnSenderDisconnected, self);
             };
             
             // handler for 'systemvolumechanged' event
             this.castRM.onSystemVolumeChanged = function(event) {
                 self.senderId = event.senderId;
                 self.volume = event.data['level'];
                 self.muted = event.data['muted'];
                 self.runtime.trigger(cr.plugins_.C2astReceiver.prototype.cnds.OnSystemVolumeChanged, self);
             };

             // create a CastMessageBus to handle messages for a custom namespace
             // TODO: get the Construct 2 app id and use it to set the message bus name
             this.messageBus = self.castRM.getCastMessageBus('urn:x-cast:' + this.properties[0]);

             // handler for the CastMessageBus message event
             this.messageBus.onMessage = function(event) {
                 console.log('Message [' + event.senderId + ']: ' + event.data);
                 self.senderId = event.senderId;
                 self.messageText = event.data;
                 self.runtime.trigger(cr.plugins_.C2astReceiver.prototype.cnds.OnMessage, self);
                 // inform all senders on the CastMessageBus of the incoming message event
                 // sender message listener will be invoked
                 //this.messageBus.send(event.senderId, event.data);
             }

             // initialize the CastReceiverManager with an application status message
             this.castRM.start({statusText: "Application is starting"});
         } else {
             console.log("Cast functionality requested but not supported by this browser/device.");
         }
     };
     
     /**BEGIN-PREVIEWONLY**/
     instanceProto.getDebuggerValues = function (propsections)
     {
         propsections.push({
             "title": "CastReceiver",
             "properties": [
                 {"name": "Is Supported", "value": isSupported, "readonly": true},
                 {"name": "Is Started", "value": this.isStarted, "readonly": true},
                 {"name": "Is Ready", "value": this.isReady, "readonly": true},
                 {"name": "Sender Count", "value": this.senderCount, "readonly": true},
                 {"name": "Last error", "value": this.errorMsg, "readonly": true},
             ]
         });
     };
     /**END-PREVIEWONLY**/
     
     //////////////////////////////////////
     // Conditions
     function Cnds() {};

     Cnds.prototype.OnReady = function ()
     {
         return true;
     };
     
     Cnds.prototype.OnSenderConnected = function ()
     {
         return this.newSender;
     };
     
     Cnds.prototype.OnSenderDisconnected = function ()
     {
         return this.lostSender;
     };
     
     Cnds.prototype.OnShutdown = function ()
     {
         return true;
     };
     
     Cnds.prototype.OnSystemVolumeChanged = function ()
     {
         return true;
     };
     
     Cnds.prototype.OnVisibilityChanged = function ()
     {
         return true;
     };
     
     Cnds.prototype.OnMessage = function ()
     {
         return true;
     };
     
     Cnds.prototype.IsConnected = function ()
     {
         return this.senderCount > 0;
     };
     
     Cnds.prototype.IsListening = function ()
     {
         return this.isReady;
     };
     
     Cnds.prototype.IsSupported = function ()
     {
         return isSupported;
     };
     
     pluginProto.cnds = new Cnds();
     
     //////////////////////////////////////
     // Actions
     function Acts() {};

     Acts.prototype.Send = function (senderId, msg)
     {
         if (!this.isReady || !this.isStarted || this.senderCount < 1 || !this.senderStatus[senderId])
             return;
         
         this.messageBus.send(senderId, msg);
     };
     
     pluginProto.acts = new Acts();
     
     //////////////////////////////////////
     // Expressions
     function Exps() {};
     
     Exps.prototype.MessageText = function (ret)
     {
         ret.set_string(this.messageText);
     };
     
     Exps.prototype.ErrorMsg = function (ret)
     {
         ret.set_string(cr.is_string(this.errorMsg) ? this.errorMsg : "");
     }; 
     
     Exps.prototype.SenderId = function (ret)
     {
         ret.set_int(this.closeCode);
     };
     
     pluginProto.exps = new Exps();

 }());
