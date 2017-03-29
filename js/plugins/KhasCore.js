//=====================================================================================================================
// KhasCore.js
//=====================================================================================================================

var Khas = Khas || {};
Khas.Core = {};
Khas.Core.version = 1.2;

/*:
 * 
 * @plugindesc [1.2] Required by Khas plugins.
 * 
 * @author Nilo K. (Khas - arcthunder.blogspot.com)
 * 
 * @help - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  * [MV] Khas Core
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  * By Nilo K. (Khas)
 *  * Version 1.2
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
 * Just place this plugin before all the other Khas plugins. It requires no
 * configuration, as it only contains functionality required by other plugins.
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  * Log
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  * Version 1.2 (03.03.2017)
 * Added more REGEX expressions
 * Added more functionality to Game_Map
 * Added better Filter management
 * Added source code management
 * 
 *  * Version 1.1 (01.22.2017)
 * Fixed empty event/erase event bug.
 * 
 *  * Version 1.0 (01.20.2017)
 * First release!
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 */

//=====================================================================================================================
//                                                  NEW STUFF
//=====================================================================================================================

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Khas
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

// Filters
Khas.Filters = {};
Khas.Filters.Source = {};

// REGEX
Khas.REGEX_TAG = /\[([\w_\d]+)\]/;
Khas.REGEX_COMMAND = /\[([\w_\d]+)\s(-?[\w_\d]+)\]/;
Khas.REGEX_DOUBLE_COMMAND = /\[([\w_\d]+)\s(-?[\w_\d]+)\s(-?[\w_\d]+)\]/;


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Khas Filters
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Khas.Filters.Source.VERTEX_GENERAL = [
    'attribute vec2 aVertexPosition;',
    'attribute vec2 aTextureCoord;',
    'varying vec2 vTextureCoord;',
    'uniform mat3 projectionMatrix;',
    'void main(void) {',
        'vTextureCoord = aTextureCoord;',
        'gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);',
    '}'
].join('\n');


//=====================================================================================================================
//                                             JAVASCRIPT CLASSES
//=====================================================================================================================

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Array
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Array.prototype.remove = function (value) {
    var index = this.indexOf(value);
    if (index != -1) this.splice(index, 1);
};


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * String
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

String.prototype.khasTag = function () {
    return this.match(Khas.REGEX_TAG);
};

String.prototype.khasCommand = function () {
    return this.match(Khas.REGEX_COMMAND);
};

String.prototype.khasDoubleCommand = function () {
    return this.match(Khas.REGEX_DOUBLE_COMMAND);
};

//=====================================================================================================================
//                                               PIXI CLASSES
//=====================================================================================================================

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Filter
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

PIXI.Filter.prototype.copyUniforms = function(filter) {
    for (var uniform in filter.uniforms) {
        if (filter.uniforms.hasOwnProperty(uniform) && this.uniforms.hasOwnProperty(uniform)) {
            this.uniforms[uniform] = filter.uniforms[uniform];
        }
    }
}


//=====================================================================================================================
//                                          RPG MAKER MV - MANAGERS
//=====================================================================================================================

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Plugin Manager
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

PluginManager.loadSource = function(name) {
    var url = 'js/' + name;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.async = false;
    script.onerror = this.onError.bind(this);
    script._url = url;
    document.body.appendChild(script);
};


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Scene Manager
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Khas.AC_SceneManager_initialize = SceneManager.initialize;
SceneManager.initialize = function () {
    Khas.AC_SceneManager_initialize.call(this);
    this.loadKhasPlugins();
};

SceneManager.loadKhasPlugins = function () {};


//=====================================================================================================================
//                                          RPG MAKER MV - GAME CLASSES
//=====================================================================================================================

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Game Map
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Khas.AC_Game_Map_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function (mapId) {
    Khas.AC_Game_Map_setup.call(this, mapId);
    if ($dataMap) {
        this.khasExtendSetup();
        this.khasScanNote($dataMap.note.split('\n'));
        this.khasScanTilesetNote(this.tileset().note.split('\n'));
        this.khasPostScan();
    }
};

Khas.AC_Game_Map_setupEvents = Game_Map.prototype.setupEvents;
Game_Map.prototype.setupEvents = function () {
    this.khasSetupMap();
    Khas.AC_Game_Map_setupEvents.call(this);
};

Game_Map.prototype.khasScanNote = function (lines) {
    for (var i = 0, li = lines.length; i < li; i++) {
        var command = lines[i];
        if (khasTag = command.khasTag()) this.callKhasTag(khasTag[1]);
        else if (khasCommand = command.khasCommand()) this.callKhasCommand(khasCommand[1], khasCommand[2], null);
        else if (khasCommand = command.khasDoubleCommand()) this.callKhasCommand(khasCommand[1], khasCommand[2], khasCommand[3]);
    }
};

Game_Map.prototype.khasScanTilesetNote = function (lines) {
    for (var i = 0, li = lines.length; i < li; i++) {
        var command = lines[i];
        if (khasTag = command.khasTag()) this.callKhasTag(khasTag[1]);
        else if (khasCommand = command.khasCommand()) this.callKhasTilesetCommand(khasCommand[1], khasCommand[2], null);
        else if (khasCommand = command.khasDoubleCommand()) this.callKhasTilesetCommand(khasCommand[1], khasCommand[2], khasCommand[3]);
    }
};

Game_Map.prototype.khasSetupMap = function () {};
Game_Map.prototype.khasExtendSetup = function () {};
Game_Map.prototype.khasPostScan = function () {};
Game_Map.prototype.callKhasTag = function (tag) {};
Game_Map.prototype.callKhasCommand = function (command, value1, value2) {};
Game_Map.prototype.callKhasTilesetTag = function (tag) {};
Game_Map.prototype.callKhasTilesetCommand = function (command, value1, value2) {};


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Game Event
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Khas.AC_Game_Event_setupPage = Game_Event.prototype.setupPage;
Game_Event.prototype.setupPage = function () {
    Khas.AC_Game_Event_setupPage.call(this);
    this.khasExtendSetup();
    this.khasScanComments();
};

Game_Event.prototype.khasScanComments = function () {
    if (this.page()) {
        var list = this.list(), khasTag, khasCommand;
        if (list) {
            for (var i = 0, li = list.length; i < li; i++) {
                if (list[i] && (list[i].code == 108 || list[i].code == 408)) {
                    var command = list[i].parameters[0];
                    if (khasTag = command.khasTag()) this.callKhasTag(khasTag[1]);
                    else if (khasCommand = command.khasCommand()) this.callKhasCommand(khasCommand[1], khasCommand[2]);
                }
            }
        }
    }
};

Game_Event.prototype.khasExtendSetup = function () {};
Game_Event.prototype.callKhasTag = function (tag) {};
Game_Event.prototype.callKhasCommand = function (command, value) {};


//=====================================================================================================================
//                                          RPG MAKER MV - SPRITE CLASSES
//=====================================================================================================================

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// * Spriteset Map
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Khas.AC_Spriteset_Map_createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
Spriteset_Map.prototype.createUpperLayer = function () {
    Khas.AC_Spriteset_Map_createUpperLayer.call(this);
    this.initializeKhasGraphics();
};

Khas.AC_Spriteset_Map_update = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function () {
    Khas.AC_Spriteset_Map_update.call(this);
    this.updateKhasGraphics();
};

Spriteset_Map.prototype.initializeKhasGraphics = function() {};
Spriteset_Map.prototype.updateKhasGraphics = function() {};


//=====================================================================================================================
//                                                END OF PLUGIN
//=====================================================================================================================