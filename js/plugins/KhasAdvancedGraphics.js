//=====================================================================================================================
// * KhasAdvancedGraphics.js
//=====================================================================================================================

if (Khas && Khas.Core && Khas.Core.version >= 1.2) {
Khas.Graphics = {};
Khas.Graphics.version = 1.1;

/*:
 * @plugindesc [1.1] Adds lighting and procedurally generated fog.
 * 
 * @author Nilo K. (Khas - arcthunder.blogspot.com)
 * 
 * @param Custom Blending
 * @desc [ON/OFF] Uses a custom light blending equation.
 * This should match your game's graphic style.  
 * @default ON
 * 
 * @param Adaptive Exposure
 * @desc [ON/OFF] Simulates eye adaptation to change in lighting.
 * Remember to use an appropriate fade color!
 * @default ON
 * 
 * @param Adaptive Exposure - Pre-decay multiplier
 * @desc Pre-multiplies the difference in exposure value when
 * changing the ambient light, decays 1 each frame. Default: 1.7
 * @default 1.7
 * 
 * @param Adaptive Exposure - Post-decay multiplier
 * @desc Post-multiplies the final exposure difference value.
 * Default: 0.005
 * @default 0.005
 * 
 * @param Variable Fog Density
 * @desc [ON/OFF] If ON, fog will vary its density around the
 * player, being less dense the closer to the player.
 * @default ON
 * 
 * @param Zoom Compatibility
 * @desc [ON/OFF] If ON, this plugin is compatible with zoom
 * commands. Leave OFF if not used.
 * @default OFF
 * 
 * @help - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  * [MV] Khas Advanced Graphics (Lighting and Procedural Fog)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  * By Nilo K. (Khas)
 *  * Version 1.1
 *  * Released on 03.03.2017
 * 
 *  * Social Media
 * Blog: arcthunder.blogspot.com
 * Patreon: patreon.com/khas
 * Facebook: facebook.com/khasarc
 * Twitter: twitter.com/arcthunder
 * Youtube: youtube.com/c/khasarc
 * 
 *  * Khas Scripts at RPG Maker Web forums (official support!)
 * forums.rpgmakerweb.com/index.php?/forum/132-khas-scripts
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  * Support my work
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 * If you find my plugins useful and you would like to support my work, now
 * you can do it by becoming my patron! 
 * 
 * Please check my page at patreon.com/khas
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  * Terms of Use
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 * If you want to use this plugin with a free RPG Maker game, you can do it for
 * free and there's no need to contact me. I only ask you to give credit to
 * "Khas" or "Khas Custom Scripts" somewhere in your game. You may include 
 * my blog url if you want.
 * 
 * This plugin is NOT FREE for COMMERCIAL use. If you want to use it on a
 * commercial title, please email me (see "Contact" on my blog). Alternatively, 
 * you may help me to achieve a Patreon goal to make all of them free for 
 * commercial use!
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  * Instructions
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 * Please place this plugin after the "KhasCore" plugin. Additionally, please 
 * copy the img/lights folder to your project. If you want to create more 
 * lights, place the light images in that folder.
 * 
 * This system assumes two types of light sources: the ambient light and the
 * lights events are carrying. Thus, in order to see any light, you need to
 * reduce the ambient light first (it's intensity goes from 0 to 100). Please
 * read the instructions below on how to control the lights.
 * 
 * This plugin uses the same comment-command style used in my previous scripts!
 * You just need to place any of these commands inside a comment in any event,
 * or in any map's note. If you are not sure how to use them, please check the 
 * demo.
 * 
 * EVENT COMMANDS (use these as comments on any event - 1 per line)
 *      [light X]
 *      Creates a light while the current page is active. X is the light's name.
 * 
 *      [offset_x OX]
 *      [offset_y OY]
 *      Overrides the default offset specified for each light.
 * 
 * TILESET COMMANDS (use these in the tilesets's note - 1 per line)
 *      [tag_light T L]
 *      Assigns a light to a terrain tag. Then, a light will be added to 
 *      whichever tile has this tag. L is the light's name and T is
 *      the terrain tag number.
 * 
 * MAP COMMANDS (use these in the map's note - 1 per line)
 *      [ambient_light X] 
 *      Changes the current ambient light when entering the map. X can be a
 *      integer from 0 (dark) to 100 (bright).
 * 
 *      [fog X]
 *      Changes the current fog to X when entering the map. X can be either
 *      the fog's name or OFF to disable the fog.
 * 
 *      [region_light R L]
 *      Assigns a light to a region. Then, a light will be added to 
 *      any tile marked with this region. L is the light's name and R is
 *      the region number.
 * 
 * PLUGIN COMMANDS
 *      Lighting ON/OFF
 *      Use this command to turn ON/OFF the lighting.
 *      Example:
 *          Lighting ON
 *          Lighting OFF
 * 
 *      AmbientLight X Y
 *      Changes the ambient light when called. X is the ambient light value
 *      (an integer from 0 to 100) and Y is the time to process this change.
 *      If you omit Y, the change will happen instantly.
 *      Example:
 *          AmbientLight 20 60
 *          AmbientLight 100
 * 
 *      AutoAmbientLight ON/OFF
 *      Use this command to turn ON/OFF the automatic ambient light change
 *      when entering a map.
 *      Example:
 *          AutoAmbientLight ON
 *          AutoAmbientLight OFF
 *  
 *      PlayerLantern OFF/lightname
 *      Changes the player lantern to the given light. If you use OFF, the 
 *      lantern will be turned off.
 *      Example:
 *          PlayerLantern flashlight
 *          PlayerLantern torch
 *          PlayerLantern OFF
 * 
 *      Fog OFF/fogname
 *      Changes the current fog when called to the given fog. If you use OFF,
 *      the fog will be turned off.
 *      Example:
 *          Fog dense
 *          Fog medium
 *          Fog OFF
 * 
 *      AutoFog ON/OFF
 *      Use this command to turn ON/OFF the automatic fog change when entering
 *      a map.
 *      Example:
 *          AutoFog ON
 *          AutoFog OFF
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  * Warning!
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 * Old save files will not work correctly with this plugin! You will lose them.
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  * Default Lights and Fogs
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 * The following lights and fogs are available to use with this plugin. If you
 * want to create your own, please read the next section.
 * 
 * Lights - Artificial:
 *      halogen, tungsten, fluorescent, broken, flashlight
 * 
 * Lights - Candle:
 *      candle
 * 
 * Lights - Torch:
 *      torch, white_torch, red_torch, green_torch, blue_torch, pink_torch, 
 *      cyan_torch, yellow_torch, purple_torch
 * 
 * Lights - Colored:
 *      white, red, green, blue, pink, cyan, yellow, purple
 * 
 * Lights - Test (use this to test and adjust offset):
 *      test
 * 
 * Fogs:
 *      rare, medium, dense
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  * How to create custom content
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 * If you want to create custom lights/fogs, you will need to edit this plugin.
 * You can do that in notepad, but my recommendation is to use Notepad++ or
 * Microsoft Visual Studio Code.
 * 
 * Once you opened the plugin, search for "Custom Lights" or "Custom Fogs".
 * Then use the templates/examples there to create your custom content! Please
 * note that some programming experience is recommended.
 * 
 * If you are creating custom lights, do not forget to add your custom light
 * images to the img/lights folder.
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  * Log
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  * Version 1.1 (03.03.2017)
 * MV updated to 1.3.5
 * Requires Khas Core 1.2 
 * Added compatibility with zoom controls (zoom in only!)
 * Added compatibility with different tile sizes
 * Added Pixi.js version checking (requires v3 or later)
 * Fixed event not turning off light on page switch
 * Added commands to create lights with region tags and terrain tags
 * Fixed lighting/fog being applied to pictures
 * Performance tweaks
 * Fixed shader problems with opacity and exposure
 * 
 *  * Version 1.0.1 (01.24.2017)
 * Fixed inverted lighting/fog on menu screen
 * 
 *  * Version 1.0 (01.20.2017)
 * First release!
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 */

Khas.Graphics.cache = {};
Khas.Graphics.Settings = {};
Khas.Graphics.PARAMETERS = PluginManager.parameters("KhasAdvancedGraphics");

Khas.Graphics.Settings.CUSTOM_BLEND_MODE = Khas.Graphics.PARAMETERS["Custom Blending"].toLowerCase() == "on";
Khas.Graphics.Settings.ADAPTIVE_EXPOSURE = Khas.Graphics.PARAMETERS["Adaptive Exposure"].toLowerCase() == "on";
Khas.Graphics.Settings.ADAPTIVE_EXPOSURE_P1 = Number(Khas.Graphics.PARAMETERS["Adaptive Exposure - Pre-decay multiplier"]);
Khas.Graphics.Settings.ADAPTIVE_EXPOSURE_P2 = Number(Khas.Graphics.PARAMETERS["Adaptive Exposure - Post-decay multiplier"]);
Khas.Graphics.Settings.VARIABLE_FOG_DENSITY = Khas.Graphics.PARAMETERS["Variable Fog Density"].toLowerCase() == "on";
Khas.Graphics.Settings.ENABLE_ZOOM = Khas.Graphics.PARAMETERS["Zoom Compatibility"].toLowerCase() == "on";


//=====================================================================================================================
//                                             LIGHTS & FOGS
//=====================================================================================================================

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Lights
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Khas.Graphics.LIGHTS = {

    // ARTIFICIAL
    halogen: {
        fileName: "halogen",
        intensity: 100, variation: 0,
        offset_x: 0, offset_y: 0
    },

    tungsten: {
        fileName: "tungsten",
        intensity: 100, variation: 0,
        offset_x: 0, offset_y: 0  
    },

    fluorescent: {
        fileName: "fluorescent",
        intensity: 100, variation: 0,
        offset_x: 0, offset_y: 0  
    },

    broken: {
        fileName: "halogen", 
        intensity: 60, variation: 30,
        offset_x: 0, offset_y: 0
    },

    flashlight: {
        fileName: "flashlight", 
        intensity: 100, variation: 0,
        offset_x: {2: -12, 4: -72, 6: 72, 8: 16 }, offset_y: {2: 72, 4: 0, 6: 16, 8: -72 },
        syncWithDirection: true
    },

    // CANDLE
    candle: {
        fileName: "candle",
        intensity: 80, variation: 20,
        offset_x: 0, offset_y: 0  
    },

    // TORCH
    torch: {
        fileName: "torch",
        intensity: 80, variation: 20,
        offset_x: 0, offset_y: 0  
    },

    white_torch: {
        fileName: "white",
        intensity: 80, variation: 20,
        offset_x: 0, offset_y: 0  
    },

    red_torch: {
        fileName: "red",
        intensity: 80, variation: 20,
        offset_x: 0, offset_y: 0  
    },

    green_torch: {
        fileName: "green",
        intensity: 80, variation: 20,
        offset_x: 0, offset_y: 0  
    },

    blue_torch: {
        fileName: "blue",
        intensity: 80, variation: 20,
        offset_x: 0, offset_y: 0  
    },

    pink_torch: {
        fileName: "pink",
        intensity: 80, variation: 20,
        offset_x: 0, offset_y: 0  
    },

    cyan_torch: {
        fileName: "cyan",
        intensity: 80, variation: 20,
        offset_x: 0, offset_y: 0  
    },

    yellow_torch: {
        fileName: "yellow",
        intensity: 80, variation: 20,
        offset_x: 0, offset_y: 0  
    },
    
    purple_torch: {
        fileName: "purple",
        intensity: 80, variation: 20,
        offset_x: 0, offset_y: 0  
    },

    // COLORED 
    white: {
        fileName: "white",
        intensity: 100, variation: 0,
        offset_x: 0, offset_y: 0  
    },

    red: {
        fileName: "red",
        intensity: 100, variation: 0,
        offset_x: 0, offset_y: 0  
    },

    green: {
        fileName: "green",
        intensity: 100, variation: 0,
        offset_x: 0, offset_y: 0  
    },

    blue: {
        fileName: "blue",
        intensity: 100, variation: 0,
        offset_x: 0, offset_y: 0  
    },

    pink: {
        fileName: "pink",
        intensity: 100, variation: 0,
        offset_x: 0, offset_y: 0  
    },

    cyan: {
        fileName: "cyan",
        intensity: 100, variation: 0,
        offset_x: 0, offset_y: 0  
    },

    yellow: {
        fileName: "yellow",
        intensity: 100, variation: 0,
        offset_x: 0, offset_y: 0  
    },
    
    purple: {
        fileName: "purple",
        intensity: 100, variation: 0,
        offset_x: 0, offset_y: 0  
    },

    // TEST
    test: {
        fileName: "test",
        intensity: 100, variation: 0,
        offset_x: 0, offset_y: 0  
    },

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Custom Lights - Begin
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*
In order to create custom lights, copy any of the lights above and add them below. Check the two templates 
explained here and edit the copied light to achieve the effect you're looking for. 


Template 1:
How a simple light is created. Please note that the sum of intensity and variation must be equal or less than 100.

halogen: {               // This is the light name, must be lowercase. The name is used with the [light x] command.
    fileName: "halogen", // A String containing the name of the file in the img/lights folder.
    intensity: 100,      // The light's intensity, an integer from 0 to 100.
    variation: 0,        // The light's variation on intensity. A Random number from 0 to variation is added to the intensity.
    offset_x: 0,         // Offset the light's x position in pixels, use an integer.
    offset_y: 0          // Offset the light's y position in pixels, use an integer.
},


Template 2:
How a flashlight is created. The offsets for every direction are optional - if they are the same for all directions,
please use the offset as the template above.

flashlight: {
    fileName: "flashlight", 
    intensity: 100
    variation: 0,
    offset_x: {2: -12, 4: -72, 6: 72, 8: 16 }, // A Javascript object containing the x offset for each direction.
    offset_y: {2: 72, 4: 0, 6: 16, 8: -72 },   // A Javascript object containing the y offset for each direction.
    syncWithDirection: true                    // If you want the light's rotation to sync with the character's, use this as true.
},

PLACE YOUR CUSTOM LIGHTS HERE: */






// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Custom Lights - End
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Fogs
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Khas.Graphics.FOGS = {

    rare: {
        speed: {x: 0.2, y: 0.07},
        size: 1.0,
        ambientDensity: 20,
        playerDensity: 10,
        playerRange: 5
    },

    medium: {
        speed: {x: 0.2, y: 0.07}, 
        size: 1.0,
        ambientDensity: 55,
        playerDensity: 20,
        playerRange: 5
    },

    dense: {
        speed: {x: 0.2, y: 0.07}, 
        size: 1.0,
        ambientDensity: 90,
        playerDensity: 40,
        playerRange: 5
    },

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Custom Fogs - Begin
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*
In order to create custom fogs, copy any of the fogs above and add them below. Check the template
explained here and edit the copied fog to achieve the effect you're looking for. 


Template:
Please note that playerDensity and playerRange will only work if you enable "Variable Fog Density".

rare: {                       // This is the fog name, must be lowercase.
    speed: {x: 0.2, y: 0.07}, // The fog's speed, a float. Small values recommended for best effect (like 0.0 - 1.0).
    size: 1.0,                // Increases/decreases the fog size. The default is 1.0.
    ambientDensity: 20,       // The ambient fog density, an integer from 0 to 100.
    playerDensity: 10,        // The fog density around the player, an integer from 0 to 100.
    playerRange: 5            // The range the player sees through the fog (in tiles).
},

PLACE YOUR CUSTOM FOGS HERE: */






// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Custom Fogs - End
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
};


//=====================================================================================================================
//                                         CHECK PIXI.JS VERSION
//=====================================================================================================================

function PixiOutOfDateError() {
    this.name = 'Pixi.js out of date!';
    this.message = "Please update your RPG Maker MV and your project js folder in order to use Khas Advanced Graphics. It requires Pixi.js v3 or later.";
    this.stack = (new Error()).stack;
}
PixiOutOfDateError.prototype = new Error;


//=====================================================================================================================
//                                          RPG MAKER MV - CORE
//=====================================================================================================================

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Graphics
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Khas.AL_Graphics_createRenderer = Graphics._createRenderer;
Graphics._createRenderer = function() {
    Khas.AL_Graphics_createRenderer.call(this);
    if (typeof PIXI.BLEND_MODES != 'undefined') {
        if (Khas.Graphics.Settings.CUSTOM_BLEND_MODE) {
            var gl = this._renderer.gl;
            PIXI.BLEND_MODES.CUSTOM_KHAS = 77;
            this._renderer.state.blendModes[PIXI.BLEND_MODES.CUSTOM_KHAS] = [gl.SRC_ALPHA, gl.ONE];
        }
    } else {
        throw new PixiOutOfDateError();
    }
};


//=====================================================================================================================
//                                          RPG MAKER MV - MANAGERS
//=====================================================================================================================

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Image Manager
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

ImageManager.loadLight = function (filename) {
    return this.loadBitmap("img/lights/", filename, 0, true);
};


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Data Manager
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Khas.AL_DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
    Khas.AL_DataManager_extractSaveContents.call(this, contents);
    if ($gameMap.graphics) $gameMap.graphics.reload = true;
};


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Scene Manager
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Khas.AL_SceneManager_loadKhasPlugins = SceneManager.loadKhasPlugins;
SceneManager.loadKhasPlugins = function () {
    Khas.AL_SceneManager_loadKhasPlugins.call(this);
    this.loadLightCache();
    this.loadFilters();
};

SceneManager.loadLightCache = function () {
    var lightNames = Object.keys(Khas.Graphics.LIGHTS);
    for (var i = 0; i < lightNames.length; i++) {
        Khas.Graphics.cache[lightNames[i]] = ImageManager.loadLight(Khas.Graphics.LIGHTS[lightNames[i]].fileName);
    }
};

SceneManager.loadFilters = function () {
    Khas.Filters.COMPOSE_FILTER = new Khas.Graphics.ComposeFilter();
    Khas.Filters.COMPOSE_FOG_FILTER = new Khas.Graphics.ComposeFogFilter();
    Khas.Filters.FOG_FILTER = new Khas.Graphics.FogFilter();
}


//=====================================================================================================================
//                                          RPG MAKER MV - GAME CLASSES
//=====================================================================================================================

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Game Screen
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

if (Khas.Graphics.Settings.ENABLE_ZOOM) {
    Khas.AL_Game_Screen_startZoom = Game_Screen.prototype.startZoom;
    Game_Screen.prototype.startZoom = function(x, y, scale, duration) {
        Khas.AL_Game_Screen_startZoom.call(this, x, y, scale, duration);
        this.refreshFilterZoom();
    };

    Khas.AL_Game_Screen_setZoom = Game_Screen.prototype.setZoom;
    Game_Screen.prototype.setZoom = function(x, y, scale) {
        Khas.AL_Game_Screen_setZoom.call(this,x, y, scale);
        this.refreshFilterZoom();
    };

    Khas.AL_Game_Screen_clearZoom = Game_Screen.prototype.clearZoom;
    Game_Screen.prototype.clearZoom = function() {
        Khas.AL_Game_Screen_clearZoom.call(this);
        this.refreshFilterZoom();
    };

    Khas.AL_Game_Screen_updateZoom = Game_Screen.prototype.updateZoom;
    Game_Screen.prototype.updateZoom = function() {
        var refreshFilterZoom = this._zoomDuration > 0;
        Khas.AL_Game_Screen_updateZoom.call(this);
        if (refreshFilterZoom) this.refreshFilterZoom();
    };

    Game_Screen.prototype.refreshFilterZoom = function() {
        if (Khas.Filters.currentFilter) Khas.Filters.currentFilter.setZoom(this._zoomX, this._zoomY, this._zoomScale);
    };
}


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Game Map
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Object.defineProperties(Game_Map.prototype, {
    graphics: {
        get: function () {
            return this._graphics;
        }
    }
});

Khas.AL_Game_Map_initialize = Game_Map.prototype.initialize;
Game_Map.prototype.initialize = function() {
    this._graphics = new Khas_Graphics();
    Khas.AL_Game_Map_initialize.call(this);
};

Khas.AL_Game_Map_khasSetupMap = Game_Map.prototype.khasSetupMap;
Game_Map.prototype.khasSetupMap = function () {
    this._graphics.newScene();
    if ($gamePlayer.light) this._graphics.addLightCharacter($gamePlayer);
    this._terrainTagLights = {};
    this._regionTagLights = {};
    this._tileLights = {};
    Khas.AL_Game_Map_khasSetupMap.call(this);
};

Khas.AL_Game_Map_callKhasCommand = Game_Map.prototype.callKhasCommand;
Game_Map.prototype.callKhasCommand = function (command, value1, value2) {
    Khas.AL_Game_Map_callKhasCommand.call(this, command, value1, value2);
    if (!this.graphics.reload) {
        if (command == "ambient_light" && this.graphics.autoAmbientLight) this.graphics.ambientLight = Number(value1);
        if (command == "fog" && this.graphics.autoFog) this.graphics.fog = value1;
        if (command == "region_light") this._regionTagLights[value1] = value2;
    }
};

Khas.AL_Game_Map_callKhasTilesetCommand = Game_Map.prototype.callKhasTilesetCommand;
Game_Map.prototype.callKhasTilesetCommand = function (command, value1, value2) {
    Khas.AL_Game_Map_callKhasTilesetCommand.call(this, command, value1, value2);
    if (!this.graphics.reload) {
        if (command == "tag_light") this._terrainTagLights[value1] = value2;
    }
};

Game_Map.prototype.scanMapLights = function () {
    var width = $dataMap.width;
    var height = $dataMap.height;
    var lightId = "";
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            lightId = this._regionTagLights[this.regionId(x, y)];
            if (lightId) {
                if (Khas.Graphics.LIGHTS[lightId]) {
                    this.addTileLight(x, y, lightId);
                } else {
                    alert("Light not found: " + lightId + "\nCheck the region tags");
                }
            } else {
                lightId = this._terrainTagLights[this.terrainTag(x, y)];
                if (lightId) {
                    if (Khas.Graphics.LIGHTS[lightId]) {
                        this.addTileLight(x, y, lightId);
                    } else {
                        alert("Light not found: " + lightId + "\nCheck the tileset's terrain tags");
                    }   
                }
            }
        }
    }
};

Game_Map.prototype.addTileLight = function (x, y, lightId) {
    var id = x + "-" + y;
    if (!this._tileLights[id]) {
        this._tileLights[id] = new Game_TileLight(lightId, x, y);
        this._graphics.addLightTile(this._tileLights[id]);
    }
};

Khas.AL_Game_Map_khasPostScan = Game_Map.prototype.khasPostScan;
Game_Map.prototype.khasPostScan = function () {
    Khas.AL_Game_Map_khasPostScan.call(this);
    this.scanMapLights();
};


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Game CharacterBase
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Object.defineProperties(Game_CharacterBase.prototype, {
    light: {
        get: function () {
            return this._light;
        },
        set: function (light) {
            this.setLight(light);
        },
        configurable: true
    }
});

Khas.AL_Game_CharacterBase_initialize = Game_CharacterBase.prototype.initialize;
Game_CharacterBase.prototype.initialize = function () {
    Khas.AL_Game_CharacterBase_initialize.call(this);
    this._light = null;
};

Game_CharacterBase.prototype.setLight = function (light) {
    this.dropLight();
    if (light) this.holdLight(light);
};

Game_CharacterBase.prototype.dropLight = function () {
    if (this._light) {
        $gameMap.graphics.removeLightCharacter(this);
        this._light = null;
    }
};

Game_CharacterBase.prototype.holdLight = function (light) {
    this._light = light;
    $gameMap.graphics.addLightCharacter(this);
};


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Game Event
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Khas.AL_Game_Event_khasExtendSetup = Game_Event.prototype.khasExtendSetup;
Game_Event.prototype.khasExtendSetup = function () {
    Khas.AL_Game_Event_khasExtendSetup.call(this);
    this.dropLight();
};

Khas.AL_Game_Event_callKhasCommand = Game_Event.prototype.callKhasCommand;
Game_Event.prototype.callKhasCommand = function (command, value) {
    Khas.AL_Game_Event_callKhasCommand.call(this, command, value);
    if (command == "light") {
        if (Khas.Graphics.LIGHTS[value]) {
            this.light = new Game_Light(value, this);
        } else {
            alert("Light not found: " + value + "\nCheck the events");
        }
    } else if (command == "offset_x") {
        if (this.light) this.light.ox = Number(value);
    } else if (command == "offset_y") {
        if (this.light) this.light.oy = Number(value);
    }
};


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Game Interpreter
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Khas.AL_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    var handled = false;
    switch (command.toLowerCase()) {
        case "lighting":
            if (args[0].toLowerCase() == "on") $gameMap.graphics.lightingEnabled = true;
            if (args[0].toLowerCase() == "off") $gameMap.graphics.lightingEnabled = false;
            handled = true;
            break;

        case "ambientlight":
            if (args.length > 1) $gameMap.graphics.changeAmbientLight(Number(args[0]), Number(args[1]));
            else $gameMap.graphics.ambientLight = Number(args[0]);
            handled = true;
            break;

        case "autoambientlight":
            if (args[0].toLowerCase() == "on") $gameMap.graphics.autoAmbientLight = true;
            if (args[0].toLowerCase() == "off") $gameMap.graphics.autoAmbientLight = false;
            handled = true;
            break;

        case "playerlantern":
            if (args[0].toLowerCase() == "off") $gamePlayer.light = null;
            else $gamePlayer.light = new Game_Light(args[0].toLowerCase(), $gamePlayer);
            handled = true;
            break;

        case "fog":
            if (args[0].toLowerCase() == "off") $gameMap.graphics.fog = null;
            else $gameMap.graphics.fog = args[0].toLowerCase();
            handled = true;
            break;

        case "autofog":
            if (args[0].toLowerCase() == "on") $gameMap.graphics.autoFog = true;
            if (args[0].toLowerCase() == "off") $gameMap.graphics.autoFog = false;
            handled = true;
            break;
    }
    if (!handled) Khas.AL_Game_Interpreter_pluginCommand.call(this, command, args);
};


//=====================================================================================================================
//                                          RPG MAKER MV - SPRITE CLASSES
//=====================================================================================================================

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Spriteset Map
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Khas.AL_Spriteset_Map_initializeKhasGraphics = Spriteset_Map.prototype.initializeKhasGraphics;
Spriteset_Map.prototype.initializeKhasGraphics = function () {
    Khas.AL_Spriteset_Map_initializeKhasGraphics.call(this);
    this.lightMapTexture = new PIXI.RenderTexture.create(Graphics.width, Graphics.height);
    Khas.Filters.COMPOSE_FILTER.setResolution(Graphics.width, Graphics.height);
    Khas.Filters.COMPOSE_FOG_FILTER.setResolution(Graphics.width, Graphics.height);
    Khas.Filters.FOG_FILTER.setResolution(Graphics.width, Graphics.height);
    if (Khas.Graphics.Settings.ENABLE_ZOOM) {
        Khas.Filters.COMPOSE_FILTER.setZoom(0, 0, 1);
        Khas.Filters.COMPOSE_FOG_FILTER.setZoom(0, 0, 1);
        Khas.Filters.FOG_FILTER.setZoom(0, 0, 1);
    }
    Khas.Filters.COMPOSE_FILTER.setLightMap(this.lightMapTexture);
    Khas.Filters.COMPOSE_FOG_FILTER.setLightMap(this.lightMapTexture);
    Khas.Filters.currentFilter = null;
    var tw = $gameMap.tileWidth();
    var th = $gameMap.tileHeight();
    this._tilemap.filterArea = new Rectangle(-tw, -th, Graphics.width + tw * 2, Graphics.height + th * 2);
};

Spriteset_Map.prototype.setMapFilters = function (filters) {
    this._tilemap.filters = filters;
    this._parallax.filters = filters;
}

Spriteset_Map.prototype.refreshGraphics = function () {
    $gameMap.graphics.refreshFilter(this);
    this._lightingEnabled = $gameMap.graphics.lightingEnabled;
    this._fog = $gameMap.graphics.fog;
    if (Khas.Graphics.Settings.ENABLE_ZOOM) {
        zoomX = $gameScreen.zoomX();
        zoomY = $gameScreen.zoomY();
        zoomScale = $gameScreen.zoomScale();
        Khas.Filters.COMPOSE_FILTER.setZoom(zoomX, zoomY, zoomScale);
        Khas.Filters.COMPOSE_FOG_FILTER.setZoom(zoomX, zoomY, zoomScale);
        Khas.Filters.FOG_FILTER.setZoom(zoomX, zoomY, zoomScale);
    }
};

Khas.AL_Spriteset_Map_updateKhasGraphics = Spriteset_Map.prototype.updateKhasGraphics;
Spriteset_Map.prototype.updateKhasGraphics = function () {
    Khas.AL_Spriteset_Map_updateKhasGraphics.call(this);
    if (this._lightingEnabled != $gameMap.graphics.lightingEnabled || this._fog != $gameMap.graphics.fog) this.refreshGraphics();
     $gameMap.graphics.update();
    if (this._lightingEnabled) $gameMap.graphics.renderLights(this.lightMapTexture);
};


//=====================================================================================================================
//                                          RPG MAKER MV - SCENE CLASSES
//=====================================================================================================================

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Scene Map
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Khas.AL_Scene_Map_createSpriteset = Scene_Map.prototype.createSpriteset;
Scene_Map.prototype.createSpriteset = function () {
    $gameMap.graphics.restore();
    Khas.AL_Scene_Map_createSpriteset.call(this);
};

Khas.AL_Scene_Map_terminate = Scene_Map.prototype.terminate;
Scene_Map.prototype.terminate = function () {
    Khas.AL_Scene_Map_terminate.call(this);
    $gameMap.graphics.dispose();
};


//=====================================================================================================================
//                                                  NEW STUFF
//=====================================================================================================================

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Game Light
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

function Game_Light() { this.initialize.apply(this, arguments); }
Game_Light.prototype.constructor = Game_Light;

Game_Light.DIRECTION_ANGLE = {
    2: 0,
    4: 1.5708,
    6: 4.7124,
    8: 3.1416
}

Game_Light.prototype.initialize = function (name, character) {
    this._name = name;
    this._screenX = 0;
    this._screenY = 0;
    this._restored = false;
    this._intensity = this.data.intensity.clamp(0, 100);
    var c = 100 - (this._intensity + this.data.variation);
    this._variation = (c < 0 ? (this.data.variation + c) : this.data.variation);
    this._syncWithDirection = this.data.syncWithDirection ? true : false;
    this.ox = this.data.offset_x;
    this.oy = this.data.offset_y;
    if (this._syncWithDirection && typeof(this.ox) != "object") this.ox = {2: this.ox, 4: this.ox, 6: this.ox, 8: this.ox };
    if (this._syncWithDirection && typeof(this.oy) != "object") this.oy = {2: this.oy, 4: this.oy, 6: this.oy, 8: this.oy };
    this.restore(character);
};

Object.defineProperties(Game_Light.prototype, {
    name: {
        get: function () {
            return this._name;
        }
    },
    data: {
        get: function () {
            return Khas.Graphics.LIGHTS[this._name];
        }
    },
    character: {
        get: function () {
            return this._character;
        },
        set: function (character) {
            if (character) this._character = character;
        },
        configurable: true
    },
    sprite: {
        get: function () {
            return this._sprite;
        }
    },
    intensity: {
        get: function() {
            return this._intensity + Math.randomInt(this._variation);
        }
    },
    variation: {
        get: function() {
            return this._variation;
        }
    },
    screenX: {
        get: function() {
            return this._screenX;
        }
    },
    screenY: {
        get: function() {
            return this._screenY;
        }
    },
});

Game_Light.prototype.dispose = function () {
    this._sprite = null;
    this._character = null;
    this._restored = false;
};

Game_Light.prototype.restore = function (character) {
    if (!this._restored) {
        if (!this._sprite) this._sprite = new Sprite_Light(this);
        this.character = character;
        this._restored = true;
    }
};

Game_Light.prototype.update = function () {
    var tw = $gameMap.tileWidth();
    var th = $gameMap.tileHeight();
    if (this._syncWithDirection) {
        var d = this._character._direction;
        this._sprite.rotation = Game_Light.DIRECTION_ANGLE[d];
        this._screenX = Math.round($gameMap.adjustX(this._character._realX) * tw + tw * 0.5 + $gameScreen.shake()) + this.ox[d];
        this._screenY = Math.round($gameMap.adjustY(this._character._realY) * th + th * 0.5) + this.oy[d];
    } else {
        this._screenX = Math.round($gameMap.adjustX(this._character._realX) * tw + tw * 0.5 + $gameScreen.shake()) + this.ox;
        this._screenY = Math.round($gameMap.adjustY(this._character._realY) * th + th * 0.5) + this.oy;
    }
    this._sprite.update();
};


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Game TileLight
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

function Game_TileLight() {
    this.initialize.apply(this, arguments);
}

Game_TileLight.prototype = Object.create(Game_Light.prototype);
Game_TileLight.prototype.constructor = Game_TileLight;

Game_TileLight.prototype.initialize = function (name, tileX, tileY) {
    this._name = name;
    this._x = tileX;
    this._y = tileY;
    this._screenX = 0;
    this._screenY = 0;
    this._restored = false;
    this._intensity = this.data.intensity.clamp(0, 100);
    var c = 100 - (this._intensity + this.data.variation);
    this._variation = (c < 0 ? (this.data.variation + c) : this.data.variation);
    this.ox = this.data.offset_x;
    this.oy = this.data.offset_y;
    this.restore();
};

Game_TileLight.prototype.dispose = function () {
    this._sprite = null;
    this._restored = false;
};

Game_TileLight.prototype.restore = function () {
    if (!this._restored) {
        if (!this._sprite) this._sprite = new Sprite_Light(this);
        this._restored = true;
    }
};

Game_TileLight.prototype.update = function () {
    var tw = $gameMap.tileWidth();
    var th = $gameMap.tileHeight();
    this._screenX = Math.round($gameMap.adjustX(this._x) * tw + tw * 0.5 + $gameScreen.shake()) + this.ox;
    this._screenY = Math.round($gameMap.adjustY(this._y) * th + th * 0.5) + this.oy;
    this._sprite.update();
};


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Khas Graphics
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function Khas_Graphics() { this.initialize.apply(this, arguments); }
Khas_Graphics.prototype.constructor = Khas_Graphics;

Khas_Graphics.prototype.initialize = function () {
    this._lightingEnabled = true;
    this._restored = false;
    this.autoAmbientLight = true;
    this._ambientLight = 100;
    this._exposure = 0;
    this.reload = false;
    this._fog = null;
    this._fogTime = 0;
    this.autoFog = true;
};

Object.defineProperties(Khas_Graphics.prototype, {
    ambientLight: {
        get: function () {
            return this._ambientLight;
        },
        set: function (intensity) {
            intensity = intensity.clamp(0, 100);
            if (Khas.Graphics.Settings.ADAPTIVE_EXPOSURE) this.exposure = (intensity - this.ambientLight);
            this._ambientLight = intensity;
            this._ambientLightTimer = null;
        },
        configurable: true
    },
    exposure: {
        get: function () {
            return this._exposure;
        },
        set: function (exposure) {
            this._exposure = Math.round(exposure * Khas.Graphics.Settings.ADAPTIVE_EXPOSURE_P1);
        },
        configurable: true
    },
    lightingEnabled: {
        get: function () {
            return this._lightingEnabled;
        },
        set: function (state) {
            this._lightingEnabled = state;
            this._exposure = 0;
            Khas.Filters.COMPOSE_FILTER.setExposure(this._exposure);
            Khas.Filters.COMPOSE_FOG_FILTER.setExposure(this._exposure);
        },
        configurable: true
    },
    fog: {
        get: function () {
            return this._fog;
        },
        set: function (fog) {
            this._fog = (Khas.Graphics.FOGS[fog] ? fog : null);
        },
        configurable: true
    },
});

Khas_Graphics.prototype.newScene = function() {
    this._lightCharacters = [];
    this._lightTiles = [];
    this._lightContainer = new PIXI.Container();
    this._fogTime = Math.randomInt(10000);
};

Khas_Graphics.prototype.refreshFilter = function(spriteset) {
    var targetFilter = null;
    if (this._lightingEnabled) {
        if (this._fog) {
            targetFilter = Khas.Filters.COMPOSE_FOG_FILTER;
            var fogData = Khas.Graphics.FOGS[this._fog];
            targetFilter.setFogSpeed(fogData.speed.x, fogData.speed.y);
            targetFilter.setFogDensity(fogData.ambientDensity, fogData.playerDensity);
            targetFilter.setPlayerFogRange(fogData.playerRange);
            targetFilter.setFogSize(fogData.size);
        } else {
            targetFilter = Khas.Filters.COMPOSE_FILTER;
        }
    } else if (this._fog) {
        targetFilter = Khas.Filters.FOG_FILTER;
        var fogData = Khas.Graphics.FOGS[this._fog];
        targetFilter.setFogSpeed(fogData.speed.x, fogData.speed.y);
        targetFilter.setFogDensity(fogData.ambientDensity, fogData.playerDensity);
        targetFilter.setPlayerFogRange(fogData.playerRange);
        targetFilter.setFogSize(fogData.size);
    }
    if (Khas.Filters.currentFilter != targetFilter) {
        Khas.Filters.currentFilter = targetFilter;
        spriteset.setMapFilters(targetFilter ? [Khas.Filters.currentFilter] : null);
    }
}

Khas_Graphics.prototype.restore = function() {
    if (!this._restored) {
        if (this.reload) {
            for (var i = 0; i < this._lightCharacters.length; i++) {
                if (this._lightCharacters[i]._eventId) this._lightCharacters[i] = $gameMap._events[this._lightCharacters[i]._eventId];
                else this._lightCharacters[i] = $gamePlayer;
            }
            this.reload = false;
        }
        this._lightContainer = new PIXI.Container();
        for (var i = 0; i < this._lightCharacters.length; i++) {
            var light = this._lightCharacters[i].light;
            light.restore(this._lightCharacters[i]);
            this._lightContainer.addChild(light.sprite);
        }
        for (var i = 0; i < this._lightTiles.length; i++) {
            var light = this._lightTiles[i];
            light.restore();
            this._lightContainer.addChild(light.sprite);
        }
        this._restored = true;
    }
};

Khas_Graphics.prototype.dispose = function () {
    if (this._restored) {
        this._lightContainer = null;
        for (var i = 0; i < this._lightCharacters.length; i++) this._lightCharacters[i].light.dispose();
        for (var i = 0; i < this._lightTiles.length; i++) this._lightTiles[i].dispose();
        this._restored = false;
    }
};

Khas_Graphics.prototype.addLightCharacter = function (character) {
    this._lightCharacters.push(character);
    if (this._restored) this._lightContainer.addChild(character.light.sprite);
};

Khas_Graphics.prototype.removeLightCharacter = function (character) {
    this._lightCharacters.remove(character);
    if (this._restored) this._lightContainer.removeChild(character.light.sprite);
};

Khas_Graphics.prototype.addLightTile = function (light) {
    this._lightTiles.push(light);
    if (this._restored) this._lightContainer.addChild(light.sprite);
};

Khas_Graphics.prototype.removeLightTile = function (light) {
    this._lightTiles.remove(light);
    if (this._restored) this._lightContainer.removeChild(light.sprite);
};

Khas_Graphics.prototype.update = function () {
    if (this._lightingEnabled) {
        if (this._ambientLightTimer) {
            if (this._ambientLightTimer <= 0) {
                this._ambientLight = this._ambientLightTarget;
                this._ambientLightTimer = null;
            } else {
                this._ambientLight += this._ambientLightDelta;
                this._ambientLightTimer--;
            }
        }
        if (this._exposure != 0) {
            this._exposure += (this._exposure > 0 ? -1 : 1);
            Khas.Filters.currentFilter.setExposure(this._exposure);
        }
        for (var i = 0; i < this._lightCharacters.length; i++) this._lightCharacters[i].light.update();
        for (var i = 0; i < this._lightTiles.length; i++) this._lightTiles[i].update();
    }
    if (this._fog) {
        Khas.Filters.currentFilter.setFogTime(this._fogTime);
        Khas.Filters.currentFilter.setFogOffset($gameMap.displayX() * 48 - $gameScreen.shake(), $gameMap.displayY() * 48);
        Khas.Filters.currentFilter.setPlayerScreenPos($gamePlayer.screenX(), $gamePlayer.screenY())
        this._fogTime += 0.01;
    }
};

Khas_Graphics.prototype.renderLights = function (renderTexture) {
    Khas.Filters.currentFilter.setAmbientLight(this._ambientLight);
    Graphics._renderer.render(this._lightContainer, renderTexture);
};

Khas_Graphics.prototype.changeAmbientLight = function (intensity, time) {
    this._ambientLightTarget = intensity.clamp(0, 100);
    if (this._ambientLightTarget != this._ambientLight) {
        this._ambientLightDelta = (this._ambientLightTarget - this._ambientLight) / time;
        this._ambientLightTimer = time;
    }
}


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Sprite Light
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

function Sprite_Light() {
    this.initialize.apply(this, arguments);
};

Sprite_Light.prototype = Object.create(Sprite.prototype);
Sprite_Light.prototype.constructor = Sprite_Light;

Sprite_Light.prototype.initialize = function (light) {
    Sprite.prototype.initialize.call(this, Khas.Graphics.cache[light.name]);
    this.blendMode = Khas.Graphics.Settings.CUSTOM_BLEND_MODE ? PIXI.BLEND_MODES.CUSTOM_KHAS : PIXI.BLEND_MODES.SCREEN;
    this._light = light;
    this._dynamic_intensity = (this._light.variation > 0);
    this.alpha = this._light.intensity * 0.01;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
};

Sprite_Light.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this.x = this._light.screenX;
    this.y = this._light.screenY;
    if (this._dynamic_intensity) this.alpha = this._light.intensity * 0.01;
};


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Khas Filters
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Khas.Filters.Source.FRAGMENT_COMPOSE = [
    'varying vec2 vTextureCoord;',
    'uniform vec2 screenResolution;',
    'uniform sampler2D uSampler;',
    'uniform sampler2D lightMap;',
    'uniform float ambientLight;',
    'uniform float exposure;',
    (Khas.Graphics.Settings.ENABLE_ZOOM ? 'uniform vec2 zoom;' : ''),
    (Khas.Graphics.Settings.ENABLE_ZOOM ? 'uniform float zoomScale;' : ''),
    'void main(void) {',
        (Khas.Graphics.Settings.ENABLE_ZOOM ? 'vec2 zoomFragCoord = gl_FragCoord.xy / zoomScale - zoom * (1.0 - zoomScale) / zoomScale;' : ''),
        (Khas.Graphics.Settings.ENABLE_ZOOM ? 'vec2 screenSpaceCoords = zoomFragCoord.xy / screenResolution.xy;' : 'vec2 screenSpaceCoords = gl_FragCoord.xy / screenResolution.xy;'),
        'vec4 diffuse = texture2D(uSampler, vTextureCoord);',
        'vec4 light = texture2D(lightMap, screenSpaceCoords);',
        'gl_FragColor = diffuse * vec4(light.xyz * (1.0 - ambientLight) + ambientLight, 1.0) + vec4(exposure, exposure, exposure, 0.0);',
    '}'
].join('\n');

Khas.Filters.Source.FRAGMENT_FOG = [
    'varying vec2 vTextureCoord;',
    'uniform vec2 screenResolution;',
    'uniform sampler2D uSampler;',
    'uniform float fogTime;',
    'uniform vec2 fogSpeed;',
    'uniform vec2 fogOffset;',
    'uniform float fogSizeMultiplier;',
    (Khas.Graphics.Settings.ENABLE_ZOOM ? 'uniform vec2 zoom;' : ''),
    (Khas.Graphics.Settings.ENABLE_ZOOM ? 'uniform float zoomScale;' : ''),
    (Khas.Graphics.Settings.VARIABLE_FOG_DENSITY ? 'uniform vec2 playerScreenPos;' : ''),
    (Khas.Graphics.Settings.VARIABLE_FOG_DENSITY ? 'uniform vec2 fogDensity;' : 'uniform float fogDensity;'),
    (Khas.Graphics.Settings.VARIABLE_FOG_DENSITY ? 'uniform float playerFogMultiplier;' : ''),
    'float k1(vec2 v) { return fract(cos(dot(v, vec2(12.9898, 4.1414))) * 43758.5453); }',
    'float k2(vec2 v) { const vec2 d = vec2(0.0, 1.0); vec2 b = floor(v), f = smoothstep(vec2(0.0), vec2(1.0), fract(v));',
    'return mix(mix(k1(b), k1(b + d.yx), f.x), mix(k1(b + d.xy), k1(b + d.yy), f.x), f.y); }',
    'float k3(vec2 v) { float total = 0.0, amplitude = 1.0;',
    'for (int i = 0; i < 4; i++) { total += k2(v) * amplitude; v += v; amplitude *= 0.5; } return total; }',
    'void main(void) {',
        'const float c1 = 1.0, c2 = 0.7, c3 = 0.6, c4 = 0.8, c5 = 0.3, c6 = 0.6;',  
        (Khas.Graphics.Settings.ENABLE_ZOOM ? 'vec2 zoomFragCoord = gl_FragCoord.xy / zoomScale - zoom * (1.0 - zoomScale) / zoomScale;' : ''),
        (Khas.Graphics.Settings.ENABLE_ZOOM ? 'vec2 screenSpaceCoords = zoomFragCoord.xy / screenResolution.xy;' : 'vec2 screenSpaceCoords = gl_FragCoord.xy / screenResolution.xy;'),
        'vec2 v1 = (' + (Khas.Graphics.Settings.ENABLE_ZOOM ? 'zoomFragCoord' : 'gl_FragCoord.xy') + ' - fogOffset) * fogSizeMultiplier;',
        'float k = k3(v1 - fogTime * fogSpeed);',
        'vec2 v2 = vec2(k3(v1 + k + fogTime * fogSpeed * 0.9 - v1.x - v1.y), k3(v1 + k - fogTime * fogSpeed * 0.8));',
        'float fog = mix(c1, c2, k3(v1 + v2)) + mix(c3, c4, v2.x) - mix(c5, c6, v2.y);',
        (Khas.Graphics.Settings.VARIABLE_FOG_DENSITY ? 'float density = distance(playerScreenPos, gl_FragCoord.xy) * playerFogMultiplier' + (Khas.Graphics.Settings.ENABLE_ZOOM ? ' / zoomScale' : '') + ';' : ''),
        (Khas.Graphics.Settings.VARIABLE_FOG_DENSITY ? 'float fogBlend = clamp(density, fogDensity.x, fogDensity.y);' : 'float fogBlend = fogDensity;'),
        'vec4 diffuse = texture2D(uSampler, vTextureCoord);',
        'gl_FragColor = mix(diffuse, vec4(fog, fog, fog, 1.0), fogBlend);',
    '}'
].join('\n');

Khas.Filters.Source.FRAGMENT_COMPOSE_FOG = [
    'varying vec2 vTextureCoord;',
    'uniform vec2 screenResolution;',
    'uniform sampler2D uSampler;',
    'uniform sampler2D lightMap;',
    'uniform float ambientLight;',
    'uniform float exposure;',
    (Khas.Graphics.Settings.ENABLE_ZOOM ? 'uniform vec2 zoom;' : ''),
    (Khas.Graphics.Settings.ENABLE_ZOOM ? 'uniform float zoomScale;' : ''),
    'uniform float fogTime;',
    'uniform vec2 fogSpeed;',
    'uniform vec2 fogOffset;',
    'uniform float fogSizeMultiplier;',
    (Khas.Graphics.Settings.VARIABLE_FOG_DENSITY ? 'uniform vec2 playerScreenPos;' : ''),
    (Khas.Graphics.Settings.VARIABLE_FOG_DENSITY ? 'uniform vec2 fogDensity;' : 'uniform float fogDensity;'),
    (Khas.Graphics.Settings.VARIABLE_FOG_DENSITY ? 'uniform float playerFogMultiplier;' : ''),
    'float k1(vec2 v) { return fract(cos(dot(v, vec2(12.9898, 4.1414))) * 43758.5453); }',
    'float k2(vec2 v) { const vec2 d = vec2(0.0, 1.0); vec2 b = floor(v), f = smoothstep(vec2(0.0), vec2(1.0), fract(v));',
    'return mix(mix(k1(b), k1(b + d.yx), f.x), mix(k1(b + d.xy), k1(b + d.yy), f.x), f.y); }',
    'float k3(vec2 v) { float total = 0.0, amplitude = 1.0;',
    'for (int i = 0; i < 4; i++) { total += k2(v) * amplitude; v += v; amplitude *= 0.5; } return total; }',
    'void main(void) {',
        'const float c1 = 1.0, c2 = 0.7, c3 = 0.6, c4 = 0.8, c5 = 0.3, c6 = 0.6;',  
        (Khas.Graphics.Settings.ENABLE_ZOOM ? 'vec2 zoomFragCoord = gl_FragCoord.xy / zoomScale - zoom * (1.0 - zoomScale) / zoomScale;' : ''),
        (Khas.Graphics.Settings.ENABLE_ZOOM ? 'vec2 screenSpaceCoords = zoomFragCoord.xy / screenResolution.xy;' : 'vec2 screenSpaceCoords = gl_FragCoord.xy / screenResolution.xy;'),
        'vec2 v1 = (' + (Khas.Graphics.Settings.ENABLE_ZOOM ? 'zoomFragCoord' : 'gl_FragCoord.xy') + ' - fogOffset) * fogSizeMultiplier;',
        'float k = k3(v1 - fogTime * fogSpeed);',
        'vec2 v2 = vec2(k3(v1 + k + fogTime * fogSpeed * 0.9 - v1.x - v1.y), k3(v1 + k - fogTime * fogSpeed * 0.8));',
        'float fog = mix(c1, c2, k3(v1 + v2)) + mix(c3, c4, v2.x) - mix(c5, c6, v2.y);',
        (Khas.Graphics.Settings.VARIABLE_FOG_DENSITY ? 'float density = distance(playerScreenPos, gl_FragCoord.xy) * playerFogMultiplier' + (Khas.Graphics.Settings.ENABLE_ZOOM ? ' / zoomScale' : '') + ';' : ''),
        (Khas.Graphics.Settings.VARIABLE_FOG_DENSITY ? 'float fogBlend = clamp(density, fogDensity.x, fogDensity.y);' : 'float fogBlend = fogDensity;'),
        'vec4 diffuse = texture2D(uSampler, vTextureCoord);',
        'vec4 light = texture2D(lightMap, screenSpaceCoords);',
        'gl_FragColor = mix(diffuse, vec4(fog, fog, fog, 1.0), fogBlend) * vec4(light.xyz * (1.0 - ambientLight) + ambientLight, 1.0) + vec4(exposure, exposure, exposure, 0.0);',
    '}'
].join('\n');


// - - - - - - - - - - - - - 
// * Compose 
// - - - - - - - - - - - - - 

Khas.Graphics.ComposeFilter = function () {
    PIXI.Filter.call(this, Khas.Filters.Source.VERTEX_GENERAL, Khas.Filters.Source.FRAGMENT_COMPOSE);
};

Khas.Graphics.ComposeFilter.prototype = Object.create(PIXI.Filter.prototype);
Khas.Graphics.ComposeFilter.prototype.constructor = Khas.Graphics.ComposeFilter;

Khas.Graphics.ComposeFilter.prototype.setResolution = function (width, height) {
    this.uniforms.screenResolution.x = width;
    this.uniforms.screenResolution.y = height;
};

Khas.Graphics.ComposeFilter.prototype.setLightMap = function (lightMap) {
    this.uniforms.lightMap = lightMap;
};

Khas.Graphics.ComposeFilter.prototype.setAmbientLight = function (intensity) {
    this.uniforms.ambientLight = intensity * 0.01;
}

Khas.Graphics.ComposeFilter.prototype.setExposure = function (exposure) {
    this.uniforms.exposure = exposure * Khas.Graphics.Settings.ADAPTIVE_EXPOSURE_P2;
}

if (Khas.Graphics.Settings.ENABLE_ZOOM) {
    Khas.Graphics.ComposeFilter.prototype.setZoom = function(zoomX, zoomY, zoomScale) {
        this.uniforms.zoom.x = zoomX;
        this.uniforms.zoom.y = zoomY;
        this.uniforms.zoomScale = zoomScale;
    }
}


// - - - - - - - - - - - - - 
// * Compose Fog
// - - - - - - - - - - - - - 

Khas.Graphics.ComposeFogFilter = function () {
    PIXI.Filter.call(this, Khas.Filters.Source.VERTEX_GENERAL, Khas.Filters.Source.FRAGMENT_COMPOSE_FOG);
};

Khas.Graphics.ComposeFogFilter.prototype = Object.create(PIXI.Filter.prototype);
Khas.Graphics.ComposeFogFilter.prototype.constructor = Khas.Graphics.ComposeFogFilter;

Khas.Graphics.ComposeFogFilter.prototype.setResolution = function (width, height) {
    this.uniforms.screenResolution.x = width;
    this.uniforms.screenResolution.y = height;
};

Khas.Graphics.ComposeFogFilter.prototype.setLightMap = function (lightMap) {
    this.uniforms.lightMap = lightMap;
};

Khas.Graphics.ComposeFogFilter.prototype.setAmbientLight = function (intensity) {
    this.uniforms.ambientLight = intensity * 0.01;
}

Khas.Graphics.ComposeFogFilter.prototype.setExposure = function (exposure) {
    this.uniforms.exposure = exposure * Khas.Graphics.Settings.ADAPTIVE_EXPOSURE_P2;
}

Khas.Graphics.ComposeFogFilter.prototype.setFogTime = function(time) {
    this.uniforms.fogTime = time;
}

Khas.Graphics.ComposeFogFilter.prototype.setFogSpeed = function(sx, sy) {
    this.uniforms.fogSpeed.x = sx;
    this.uniforms.fogSpeed.y = sy;
}

Khas.Graphics.ComposeFogFilter.prototype.setFogOffset = function(ox, oy) {
    this.uniforms.fogOffset.x = -ox;
    this.uniforms.fogOffset.y = -oy;
}

Khas.Graphics.ComposeFogFilter.prototype.setPlayerScreenPos = function(sx, sy) {
    if (Khas.Graphics.Settings.VARIABLE_FOG_DENSITY) {
        this.uniforms.playerScreenPos.x = sx;
        this.uniforms.playerScreenPos.y = sy;
    }
}

Khas.Graphics.ComposeFogFilter.prototype.setPlayerFogRange = function(tiles) {
    if (Khas.Graphics.Settings.VARIABLE_FOG_DENSITY) this.uniforms.playerFogMultiplier = 1 / (tiles * 48);
}

Khas.Graphics.ComposeFogFilter.prototype.setFogDensity = function(ambientFog, playerFog) {
    if (Khas.Graphics.Settings.VARIABLE_FOG_DENSITY) {
        this.uniforms.fogDensity.x = playerFog * 0.01;
        this.uniforms.fogDensity.y = ambientFog * 0.01;
    } else {
        this.uniforms.fogDensity = ambientFog * 0.01;
    }
}

Khas.Graphics.ComposeFogFilter.prototype.setFogSize = function(size) {
    this.uniforms.fogSizeMultiplier = 8 / (1000 * size);
}

if (Khas.Graphics.Settings.ENABLE_ZOOM) {
    Khas.Graphics.ComposeFogFilter.prototype.setZoom = function(zoomX, zoomY, zoomScale) {
        this.uniforms.zoom.x = zoomX;
        this.uniforms.zoom.y = zoomY;
        this.uniforms.zoomScale = zoomScale;
    }
}


// - - - - - - - - - - - - - 
// * Fog
// - - - - - - - - - - - - - 

Khas.Graphics.FogFilter = function () {
    PIXI.Filter.call(this, Khas.Filters.Source.VERTEX_GENERAL, Khas.Filters.Source.FRAGMENT_FOG);
};

Khas.Graphics.FogFilter.prototype = Object.create(PIXI.Filter.prototype);
Khas.Graphics.FogFilter.prototype.constructor = Khas.Graphics.FogFilter;

Khas.Graphics.FogFilter.prototype.setResolution = function (width, height) {
    this.uniforms.screenResolution.x = width;
    this.uniforms.screenResolution.y = height;
};

Khas.Graphics.FogFilter.prototype.setFogTime = function(time) {
    this.uniforms.fogTime = time;
}

Khas.Graphics.FogFilter.prototype.setFogSpeed = function(sx, sy) {
    this.uniforms.fogSpeed.x = sx;
    this.uniforms.fogSpeed.y = sy;
}

Khas.Graphics.FogFilter.prototype.setFogOffset = function(ox, oy) {
    this.uniforms.fogOffset.x = -ox;
    this.uniforms.fogOffset.y = -oy;
}

Khas.Graphics.FogFilter.prototype.setPlayerScreenPos = function(sx, sy) {
    if (Khas.Graphics.Settings.VARIABLE_FOG_DENSITY) {
        this.uniforms.playerScreenPos.x = sx;
        this.uniforms.playerScreenPos.y = sy;
    }
}

Khas.Graphics.FogFilter.prototype.setPlayerFogRange = function(tiles) {
    if (Khas.Graphics.Settings.VARIABLE_FOG_DENSITY) this.uniforms.playerFogMultiplier = 1 / (tiles * 48);
}

Khas.Graphics.FogFilter.prototype.setFogDensity = function(ambientFog, playerFog) {
    if (Khas.Graphics.Settings.VARIABLE_FOG_DENSITY) {
        this.uniforms.fogDensity.x = playerFog * 0.01;
        this.uniforms.fogDensity.y = ambientFog * 0.01;
    } else {
        this.uniforms.fogDensity = ambientFog * 0.01;
    }
}

Khas.Graphics.FogFilter.prototype.setFogSize = function(size) {
    this.uniforms.fogSizeMultiplier = 8 / (1000 * size);
}

if (Khas.Graphics.Settings.ENABLE_ZOOM) {
    Khas.Graphics.FogFilter.prototype.setZoom = function(zoomX, zoomY, zoomScale) {
        this.uniforms.zoom.x = zoomX;
        this.uniforms.zoom.y = zoomY;
        this.uniforms.zoomScale = zoomScale;
    }
}


}; // if (Khas && Khas.Core)

//=====================================================================================================================
//                                                END OF PLUGIN
//=====================================================================================================================