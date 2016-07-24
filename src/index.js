'use strict';

var StateUpdater = require('state-updater');

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
