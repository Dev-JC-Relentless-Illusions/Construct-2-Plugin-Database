// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.CordovaPowerManagement = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{	

	var isWakeLockActive=false;

	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.CordovaPowerManagement.prototype;
		
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

	};

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.isWakeLockActive = function ()
	{
		return this.isWakeLockActive;
	};

	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};
	
	Acts.prototype.fullWake = function ()
	{
		if (typeof window['powerManagement'] == 'undefined') {return;}else{
		window['powerManagement'].acquire();
		}
		this.isWakeLockActive=true;
	}

	Acts.prototype.partialWake = function ()
	{
		if (typeof window['powerManagement'] == 'undefined') {return;}else{
		window['powerManagement'].dim();
		}
		this.isWakeLockActive=true;
	}

	Acts.prototype.releaseWake = function ()
	{
		if (typeof window['powerManagement'] == 'undefined') {return;}else{
		window['powerManagement'].release();
		}
		this.isWakeLockActive=false;
	}

	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	pluginProto.exps = new Exps();

}());