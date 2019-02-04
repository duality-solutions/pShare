(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"loading_test_2_atlas_", frames: [[0,132,90,104],[92,132,90,52],[184,75,45,78],[184,0,60,73],[184,155,24,52],[0,0,90,130],[92,0,90,130]]}
];


// symbols:



(lib.CachedTexturedBitmap_1 = function() {
	this.initialize(ss["loading_test_2_atlas_"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedTexturedBitmap_2 = function() {
	this.initialize(ss["loading_test_2_atlas_"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedTexturedBitmap_3 = function() {
	this.initialize(ss["loading_test_2_atlas_"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedTexturedBitmap_4 = function() {
	this.initialize(ss["loading_test_2_atlas_"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedTexturedBitmap_5 = function() {
	this.initialize(ss["loading_test_2_atlas_"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedTexturedBitmap_6 = function() {
	this.initialize(ss["loading_test_2_atlas_"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedTexturedBitmap_7 = function() {
	this.initialize(ss["loading_test_2_atlas_"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.tail_mc_Layer_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedTexturedBitmap_5();
	this.instance.parent = this;
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.tail_mc_Layer_1, null, null);


(lib.mask_mc_Layer_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedTexturedBitmap_4();
	this.instance.parent = this;
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.mask_mc_Layer_1, null, null);


(lib.Path_Layer_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedTexturedBitmap_2();
	this.instance.parent = this;
	this.instance.setTransform(0.8,0,1.8526,1.8526);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.Path_Layer_1, null, null);


(lib.Path_1_Layer_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedTexturedBitmap_3();
	this.instance.parent = this;
	this.instance.setTransform(0,0,1.8526,1.8526);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.Path_1_Layer_1, null, null);


(lib.tail_mc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1_obj_
	this.Layer_1 = new lib.tail_mc_Layer_1();
	this.Layer_1.name = "Layer_1";
	this.Layer_1.parent = this;
	this.Layer_1.setTransform(6,13,1,1,0,0,0,6,13);
	this.Layer_1.depth = 0;
	this.Layer_1.isAttachedToCamera = 0
	this.Layer_1.isAttachedToMask = 0
	this.Layer_1.layerDepth = 0
	this.Layer_1.layerIndex = 0
	this.Layer_1.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Layer_1).wait(1));

}).prototype = getMCSymbolPrototype(lib.tail_mc, new cjs.Rectangle(0,0,12,26), null);


(lib.Scene_1_p_mask = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// p_mask
	this.instance = new lib.tail_mc();
	this.instance.parent = this;
	this.instance.setTransform(41.1,82.35,1,1,0,0,0,5.9,12.9);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({y:57.45},15,cjs.Ease.quadInOut).wait(1));

}).prototype = p = new cjs.MovieClip();


(lib.mask_mc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1_obj_
	this.Layer_1 = new lib.mask_mc_Layer_1();
	this.Layer_1.name = "Layer_1";
	this.Layer_1.parent = this;
	this.Layer_1.setTransform(15,18.2,1,1,0,0,0,15,18.2);
	this.Layer_1.depth = 0;
	this.Layer_1.isAttachedToCamera = 0
	this.Layer_1.isAttachedToMask = 0
	this.Layer_1.layerDepth = 0
	this.Layer_1.layerIndex = 0
	this.Layer_1.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Layer_1).wait(1));

}).prototype = getMCSymbolPrototype(lib.mask_mc, new cjs.Rectangle(0,0,30,36.5), null);


(lib.Path_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1_obj_
	this.Layer_1 = new lib.Path_1_Layer_1();
	this.Layer_1.name = "Layer_1";
	this.Layer_1.parent = this;
	this.Layer_1.setTransform(41.6,72.2,1,1,0,0,0,41.6,72.2);
	this.Layer_1.depth = 0;
	this.Layer_1.isAttachedToCamera = 0
	this.Layer_1.isAttachedToMask = 0
	this.Layer_1.layerDepth = 0
	this.Layer_1.layerIndex = 0
	this.Layer_1.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Layer_1).wait(1));

}).prototype = getMCSymbolPrototype(lib.Path_1, new cjs.Rectangle(0,0,83.4,144.5), null);


(lib.Path = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1_obj_
	this.Layer_1 = new lib.Path_Layer_1();
	this.Layer_1.name = "Layer_1";
	this.Layer_1.parent = this;
	this.Layer_1.setTransform(84.2,48.1,1,1,0,0,0,84.2,48.1);
	this.Layer_1.depth = 0;
	this.Layer_1.isAttachedToCamera = 0
	this.Layer_1.isAttachedToMask = 0
	this.Layer_1.layerDepth = 0
	this.Layer_1.layerIndex = 0
	this.Layer_1.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Layer_1).wait(1));

}).prototype = getMCSymbolPrototype(lib.Path, new cjs.Rectangle(0.8,0,166.79999999999998,96.4), null);


(lib.Tween2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.mask_mc();
	this.instance.parent = this;
	this.instance.setTransform(-11.35,19.3,1,1,0,0,0,15.1,18.2);

	this.instance_1 = new lib.Path();
	this.instance_1.parent = this;
	this.instance_1.setTransform(3.9,-24.35,0.2695,0.2699,0,0,0,83.9,48.9);
	this.instance_1.alpha = 0.0508;

	this.instance_2 = new lib.Path_1();
	this.instance_2.parent = this;
	this.instance_2.setTransform(15.15,-5.1,0.2695,0.2699,0,0,0,42.3,72.5);
	this.instance_2.alpha = 0.1016;

	this.instance_3 = new lib.CachedTexturedBitmap_7();
	this.instance_3.parent = this;
	this.instance_3.setTransform(-18.7,-37.55,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-26.4,-37.5,52.9,75.1);


(lib.Tween1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.mask_mc();
	this.instance.parent = this;
	this.instance.setTransform(-11.35,19.3,1,1,0,0,0,15.1,18.2);

	this.instance_1 = new lib.Path();
	this.instance_1.parent = this;
	this.instance_1.setTransform(3.9,-24.35,0.2695,0.2699,0,0,0,83.9,48.9);
	this.instance_1.alpha = 0.0508;

	this.instance_2 = new lib.Path_1();
	this.instance_2.parent = this;
	this.instance_2.setTransform(15.15,-5.1,0.2695,0.2699,0,0,0,42.3,72.5);
	this.instance_2.alpha = 0.1016;

	this.instance_3 = new lib.CachedTexturedBitmap_6();
	this.instance_3.parent = this;
	this.instance_3.setTransform(-18.7,-37.55,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-26.4,-37.5,52.9,75.1);


(lib.Scene_1_Logo = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Logo
	this.instance = new lib.Path();
	this.instance.parent = this;
	this.instance.setTransform(57.8,43.55,0.2695,0.2699,0,0,0,83.9,48.9);
	this.instance.alpha = 0.0508;

	this.instance_1 = new lib.Path_1();
	this.instance_1.parent = this;
	this.instance_1.setTransform(69.1,62.8,0.2695,0.2699,0,0,0,42.3,72.5);
	this.instance_1.alpha = 0.1016;

	this.instance_2 = new lib.CachedTexturedBitmap_1();
	this.instance_2.parent = this;
	this.instance_2.setTransform(35.2,30.35,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).to({state:[]},16).wait(1));

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Layer_9 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_9
	this.instance = new lib.Tween1("synched",0);
	this.instance.parent = this;
	this.instance.setTransform(57.6,56.2,1,1,0,0,0,3.7,-11.7);
	this.instance._off = true;

	this.instance_1 = new lib.Tween2("synched",0);
	this.instance_1.parent = this;
	this.instance_1.setTransform(57.5,56.4,1,1,0,0,0,3.6,-11.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},16).to({state:[{t:this.instance_1}]},29).wait(4));
	this.timeline.addTween(cjs.Tween.get(this.instance).wait(16).to({_off:false},0).to({_off:true,regX:3.6,regY:-11.5,rotation:360,x:57.5,y:56.4},29,cjs.Ease.quadInOut).wait(4));

}).prototype = p = new cjs.MovieClip();


// stage content:
(lib.loadingtest2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	this.___GetDepth___ = function(obj) {
		var depth = obj.depth;
		var cameraObj = this.___camera___instance;
		if(cameraObj && cameraObj.depth && obj.isAttachedToCamera)
		{
			depth += depth + cameraObj.depth;
		}
		return depth;
		}
	this.___needSorting___ = function() {
		for (var i = 0; i < this.getNumChildren() - 1; i++)
		{
			var prevDepth = this.___GetDepth___(this.getChildAt(i));
			var nextDepth = this.___GetDepth___(this.getChildAt(i + 1));
			if (prevDepth < nextDepth)
				return true;
		}
		return false;
	}
	this.___sortFunction___ = function(obj1, obj2) {
		return (this.exportRoot.___GetDepth___(obj2) - this.exportRoot.___GetDepth___(obj1));
	}
	this.on('tick', function (event){
		var curTimeline = event.currentTarget;
		if (curTimeline.___needSorting___()){
			this.sortChildren(curTimeline.___sortFunction___);
		}
	});

	// timeline functions:
	this.frame_48 = function() {
		this.___loopingOver___ = true;
		this.gotoAndPlay(17);
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(48).call(this.frame_48).wait(1));

	// Layer_9_obj_
	this.Layer_9 = new lib.Scene_1_Layer_9();
	this.Layer_9.name = "Layer_9";
	this.Layer_9.parent = this;
	this.Layer_9.depth = 0;
	this.Layer_9.isAttachedToCamera = 0
	this.Layer_9.isAttachedToMask = 0
	this.Layer_9.layerDepth = 0
	this.Layer_9.layerIndex = 0
	this.Layer_9.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Layer_9).wait(49));

	// p_mask_obj_
	this.p_mask = new lib.Scene_1_p_mask();
	this.p_mask.name = "p_mask";
	this.p_mask.parent = this;
	this.p_mask.setTransform(41.2,82.5,1,1,0,0,0,41.2,82.5);
	this.p_mask.depth = 0;
	this.p_mask.isAttachedToCamera = 0
	this.p_mask.isAttachedToMask = 0
	this.p_mask.layerDepth = 0
	this.p_mask.layerIndex = 1
	this.p_mask.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.p_mask).wait(15).to({_off:true},1).wait(33));

	// Logo_obj_
	this.Logo = new lib.Scene_1_Logo();
	this.Logo.name = "Logo";
	this.Logo.parent = this;
	this.Logo.setTransform(57.8,56.4,1,1,0,0,0,57.8,56.4);
	this.Logo.depth = 0;
	this.Logo.isAttachedToCamera = 0
	this.Logo.isAttachedToMask = 0
	this.Logo.layerDepth = 0
	this.Logo.layerIndex = 2
	this.Logo.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Logo).wait(16).to({_off:true},1).wait(32));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(56.5,64.7,58.7,49.39999999999999);
// library properties:
lib.properties = {
	id: '5A4863F863B74FBE91F162F13433CE81',
	width: 113,
	height: 132,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/loading_test_2_atlas_.png?1548927447414", id:"loading_test_2_atlas_"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['5A4863F863B74FBE91F162F13433CE81'] = {
	getStage: function() { return exportRoot.getStage(); },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


// Layer depth API : 

AdobeAn.Layer = new function() {
	this.getLayerZDepth = function(timeline, layerName)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline." + layerName + ".depth; else 0;";
		return eval(script);
	}
	this.setLayerZDepth = function(timeline, layerName, zDepth)
	{
		const MAX_zDepth = 10000;
		const MIN_zDepth = -5000;
		if(zDepth > MAX_zDepth)
			zDepth = MAX_zDepth;
		else if(zDepth < MIN_zDepth)
			zDepth = MIN_zDepth;
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline." + layerName + ".depth = " + zDepth + ";";
		eval(script);
	}
	this.removeLayer = function(timeline, layerName)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline.removeChild(timeline." + layerName + ");";
		eval(script);
	}
	this.addNewLayer = function(timeline, layerName, zDepth)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		zDepth = typeof zDepth !== 'undefined' ? zDepth : 0;
		var layer = new createjs.MovieClip();
		layer.name = layerName;
		layer.depth = zDepth;
		layer.layerIndex = 0;
		timeline.addChild(layer);
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;