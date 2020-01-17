// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

var lastContact;

/////////////////////////////////////
// Plugin class
cr.plugins_.armaldio_contacts = function (runtime) {
    this.runtime = runtime;
};

(function () {

    var pluginProto = cr.plugins_.armaldio_contacts.prototype;

    /////////////////////////////////////
    // Object type class
    pluginProto.Type = function (plugin) {
        this.plugin = plugin;
        this.runtime = plugin.runtime;
    };

    var typeProto = pluginProto.Type.prototype;

    // called on startup for each object type
    typeProto.onCreate = function () {

    };

    /////////////////////////////////////
    // Instance class
    pluginProto.Instance = function (type) {
        this.type = type;
        this.runtime = type.runtime;
    };

    var instanceProto = pluginProto.Instance.prototype;

    // called whenever an instance is created
    instanceProto.onCreate = function () {
        this.dictionary = {};
        this.cur_key = ""; // current key in for-each loop
        this.key_count = 0;
    };

    instanceProto.saveToJSON = function () {
        return this.dictionary;
    };

    instanceProto.loadFromJSON = function (o) {
        this.dictionary = o;

        // Update the key count
        this.key_count = 0;

        for (var p in this.dictionary) {
            if (this.dictionary.hasOwnProperty(p))
                this.key_count++;
        }
    };

    /**BEGIN-PREVIEWONLY**/
    instanceProto.getDebuggerValues = function (propsections) {
        var props = [];

        for (var p in this.dictionary) {
            if (this.dictionary.hasOwnProperty(p)) {
                props.push({
                    "name": p,
                    "value": this.dictionary[p]
                });
            }
        }

        propsections.push({
            "title": "Dictionary",
            "properties": props
        });
    };

    instanceProto.onDebugValueEdited = function (header, name, value) {
        this.dictionary[name] = value;
    };
    /**END-PREVIEWONLY**/

    //////////////////////////////////////
    // Conditions
    function Cnds() {
    };

    /**
     * @return {boolean}
     */
    Cnds.prototype.OnContactSelected = function () {
        return true;
    };

    pluginProto.cnds = new Cnds();

    //////////////////////////////////////
    // Actions
    function Acts() {
    };

    Acts.prototype.GetContact = function () {
        var self = this;
        navigator.contacts.pickContact(function(contact){
            lastContact = contact;
            self.runtime.trigger(cr.plugins_.armaldio_contacts.prototype.cnds.OnContactSelected, self);
        },function(err){
            console.log('Error: ' + err);
        });
    };

    pluginProto.acts = new Acts();

    //////////////////////////////////////
    // Expressions
    // ret.set_float, ret.set_string, ret.set_any
    function Exps() {
    };

    Exps.prototype.GetEmails = function (ret, index) {
        ret.set_any(lastContact.emails[index].value);
    };

    Exps.prototype.GetDisplayName = function (ret) {
        ret.set_any(lastContact.displayName);
    };

    Exps.prototype.GetPhoneNumbers = function (ret) {
        ret.set_any(lastContact.phoneNumbers);
    };
	
	Exps.prototype.EmailCount = function (ret) {
		if (lastContact.emails)
			ret.set_float(lastContact.emails.length);
		else
			ret.set_float(0);
    };

    pluginProto.exps = new Exps();

}());
