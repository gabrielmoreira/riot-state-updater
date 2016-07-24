(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["RiotStateUpdater"] = factory();
	else
		root["RiotStateUpdater"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var StateUpdater = __webpack_require__(2);

	function GenericMixin(getState, subscribe) {
		return {
			bindState: function state_manager_connect(config) {
				var me = this;
				me.__$updater = StateUpdater(config);
				me.updateState();

				function unsubscribe() {
					if (me.__$unsubscribe && typeof(me.__$unsubscribe) === 'function')
						me.__$unsubscribe();
				}
				unsubscribe();
				if (subscribe)
					me.__$unsubscribe = subscribe(me.updateState.bind(me));

				me.on('mount', me.updateState);
				me.on('unmount', unsubscribe);
			},

			updateState: function state_manager_update_state() {
				if (this.__$updater.update(getState(), this)) {
					this.update();
				}
			}
		};
	}

	function StoreMixin(store) {
		return GenericMixin(
			store.getState.bind(store),
			store.subscribe.bind(store)
		);
	}

	module.exports.GenericMixin = GenericMixin;
	module.exports.StoreMixin = StoreMixin;


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	function selectString(selector) {
		var tokens = [];
		selector.replace(/[^\[\]\.]+/g, function(item) {
			tokens.push(item);
		});
		return function string_selector(data) {
			return tokens.reduce(function string_selector_reducer(value, token) {
				return value && value[token];
			}, data);
		}
	}

	function selectObject(object) {
		if (!object.select) throw new Error('select is required');
		if (!object.value) object.value = function get_value(state) { return state };
		var selectors = typeof(object.select) === 'string' ? [object.select] : object.select;
		selectors = selectors.map(function(options) {
			return select(options);
		});
		var selector = function object_selector(data) {
			var values = selectors.map(function object_selector_map(selector) {
				return selector(data);
			});
			var value = object.value.apply(object, values);
			return value;
		}
		return selector;
	}

	function select(options) {
		switch (typeof(options)) {
			case 'string':
				return selectString(options);
			case 'object':
				return selectObject(options);
			case 'function':
				return options;
		}
		throw new Error('options not supported: ' + options);
	}


	module.exports = select;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var select = __webpack_require__(1);

	function updater(config) {
		var selectors = {};
	  	var properties = Object.keys(config);
		properties.forEach(function each_property(property) {
			selectors[property] = select(config[property]);
		});
		return {
			update: function updater_update(state, instance) {
				var updated = false;
				properties.forEach(function each_property(property) {
					var value = selectors[property](state);
					if (instance[property] !== value) {
						instance[property] = value;
						updated = true;
					}
				});
				return updated;
			}
		}
	}

	module.exports = updater;


/***/ }
/******/ ])
});
;