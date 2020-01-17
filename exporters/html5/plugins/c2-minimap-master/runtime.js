// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.armaldio_minimap = function (runtime) {
	this.runtime = runtime;
};

var map        = "";
var map_scale  = 5;
var map_object = [];
var map_img    = new Image();
var cur_rt     = this.runtime;

(function () {
	var pluginProto = cr.plugins_.armaldio_minimap.prototype;

	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function (plugin) {
		this.plugin  = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	typeProto.onCreate = function () {
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function (type) {
		this.type    = type;
		this.runtime = type.runtime;
	};

	var instanceProto = pluginProto.Instance.prototype;

	instanceProto.onCreate = function () {
		var rt     = this.runtime;
		var screen = {
			width : self.width,
			height: self.height
		};
		var layout = {
			width : rt.running_layout.width,
			height: rt.running_layout.height
		};

		var instanceObj = rt.objectsByUid;
		$.each(instanceObj, function (index, object) {

			//Create a new minimap object
			var minimap_obj = {
				show      : true,
				pos       : {
					x: 0,
					y: 0
				},
				image     : null,
				name      : object.type.name,
				discovered: true,
				uid       : object.uid,
				raw       : object,
				scale     : -1,
				size      : {
					width : object.width,
					height: object.height
				}

			};

			minimap_obj.pos = {
				x: remap(object.x, 0, layout.width, 0, map_img.width),
				y: remap(object.y, 0, layout.height, 0, map_img.height)
			};


			if (object.instance_var_names) {
				var varnames = object.instance_var_names;
				var values   = object.instance_vars;

				minimap_obj.activated = activatedOnMinimap(varnames, values);

				if (minimap_obj.activated) {
					console.log(minimap_obj.name + " is activated");

					//for each instance variables
					$.each(varnames, function (i, variable) {
						//debugger;
						var v = values[i];

						if (variable === "minimap_discover") {
							minimap_obj.discovered = (v == 0);
						}
						if (variable === "minimap_scale")
							minimap_obj.scale = v;
					});

					//console.log("Minimap obj", minimap_obj);
					map_object.push(minimap_obj);
				}
			}
		});
		console.log("--- Map init done. ---");
	};

	function remap(value, low1, high1, low2, high2) {
		return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
	}

	function activatedOnMinimap(varnames, values) {
		var ret = false;
		$.each(varnames, function (i, variable) {
			var v = values[i];
			if (variable === "minimap" && v === 1) {
				ret = true;
				return false;
			}
		});
		return ret;
	}

	function getRealObject(uid) {
		var instanceObj = cur_rt.objectsByUid;
		var ret         = {
			x: 0,
			y: 0
		};

		$.each(instanceObj, function (index, object) {
			if (object.uid === uid) {
				ret = object;
				return (false);
			}
		});

		return (ret);
	}

	instanceProto.draw = function (ctx) {
		var rt = this.runtime;
		cur_rt = rt;

		ctx.save();
		var self   = this;
		var myx    = this.x;
		var myy    = this.y;
		var screen = {
			width : self.width,
			height: self.height
		};
		var layout = {
			width : rt.running_layout.width,
			height: rt.running_layout.height
		};


		if (rt.pixel_rounding) {
			myx = Math.round(myx);
			myy = Math.round(myy);
		}

		ctx.translate(myx, myy);
		ctx.rotate(this.angle);

		/**
		 * Draw map
		 */
		ctx.globalAlpha = this.opacity;
		ctx.drawImage(map_img,
			-screen.width / 2,
			-screen.height / 2,
			screen.width,
			screen.height);

		/**
		 * Draw objects
		 */

		$.each(map_object, function (index, object) {

			var real_object = getRealObject(object.uid);
			var p           = new Image();
			p.src           = real_object.curFrame.getDataUri();

			object.image = p;

			if (object.show && object.image !== null && object.discovered) {
				//console.log("Showing ", object.name, object);

				//update position
				if (real_object.x > 0 && real_object.y > 0 && real_object.x < layout.width && real_object.y < layout.height) {
					object.pos = {
						x: remap(real_object.x, 0, layout.width, 0, map_img.width),
						y: remap(real_object.y, 0, layout.height, 0, map_img.height)
					};
				}

				ctx.drawImage(object.image,
					(object.pos.x - (map_img.width / 2)) * (self.width / map_img.width),
					(object.pos.y - (map_img.height / 2)) * (self.height / map_img.height),
					object.size.width * (object.size.width / layout.width) * (object.scale === -1) ? map_scale : object.scale,
					object.size.height * (object.size.height / layout.height) * (object.scale === -1) ? map_scale : object.scale);

				rt.redraw = true;
			}
		});
		ctx.restore();
	};

	instanceProto.drawGL = function (glw) {
//		console.log(glw);

		if (glw.gl.canvas.getContext("2d") !== null) {
			console.log("lol");
			return this.draw(glw.gl.canvas.getContext("2d"));
		}
		else return;

		var map_texture   = glw.gl.createTexture();
		map_texture.image = map_img;

		glw.setTexture(map_texture);
		glw.setOpacity(map.opacity);

		var q = this.bquad;

		if (this.runtime.pixel_rounding) {
			var ox = Math.round(this.x) - this.x;
			var oy = Math.round(this.y) - this.y;

			glw.quad(q.tlx + ox, q.tly + oy, q.trx + ox, q.try_ + oy, q.brx + ox, q.bry + oy, q.blx + ox, q.bly + oy);
		}
		else {
			glw.quad(q.tlx, q.tly, q.trx, q.try_, q.brx, q.bry, q.blx, q.bly);
		}
	};

	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections) {
		propsections.push({});
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {
	};

	Cnds.prototype.CookiesEnabled = function () {
	};


	pluginProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {
	};

	Acts.prototype.LoadMap = function (_map) {
		map                 = _map;
		map_img.src         = map;
		this.runtime.redraw = true;
	};

	Acts.prototype.LoadMapB64 = function (_map) {
		map                 = _map;
		map_img.src         = map;
		this.runtime.redraw = true;
	};

	function getMinimapObjectIndex(uid) {
		var ret = -1;

		$.each(map_object, function (index, object) {
			console.log("Obj uid", object.uid, "uid searched", uid);
			if (object.uid === uid) {
				ret = index;
				return (false);
			}
		});

		return (ret);
	}

	Acts.prototype.DiscoverObject = function (uid) {
		var object                    = getMinimapObjectIndex(uid);
		map_object[object].discovered = true;
	};

	pluginProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {
	};

	Exps.prototype.URL = function (ret) {
		ret.set_string(this.runtime.isDomFree ? "" : window.location.toString());
	};

	pluginProto.exps = new Exps();

}());