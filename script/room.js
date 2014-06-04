/**
 * Module that registers the simple room functionality
 */
var Room = {
	// times in (minutes * seconds * milliseconds)
	_FIRE_COOL_DELAY: 5 * 60 * 1000, // time after a stoke before the fire cools
	_ROOM_WARM_DELAY: 30 * 1000, // time between room temperature updates
	_BUILDER_STATE_DELAY: 0.5 * 60 * 1000, // time between builder state updates
	_STOKE_COOLDOWN: 10, // cooldown to stoke the fire
	_NEED_ELECTRICITY_DELAY: 15 * 1000, // from when the stranger shows up, to when you need electricity
	
	fire:null,
	temperature:null,
	buttons:{},
	
	Craftables: {
		'trap': {
			name: _('trap'),
			button: null,
			maximum: 10,
			availableMsg: _('build-doge says she can set up trap stations to get things that people lose, for free!'),
			buildMsg: _('more traps to get more valuables!'),
			maxMsg: _("more traps won't help now"),
			type: 'building',
			cost: function() {
				var n = $SM.get('game.buildings["trap"]', true);
				return {
					'electricity': 10 + (n*10)
				};
			}
		},
		'cart': {
			name: _('high-capacity batteries'),
			button: null,
			maximum: 1,
			availableMsg: _('builder-doge says she found a wikiHow on making high-capacity batteries'),
			buildMsg: _('these new batteries can hold more electricity'),
			type: 'building',
			cost: function() {
				return {
					'electricity': 30
				};
			}
		},
		'hut': {
			name: _('doghouse'),
			button: null,
			maximum: 20,
			availableMsg: _("builder-doge says there are more shibas. says they'll work, too."),
			buildMsg: _('shibe builder puts up a hut, out in the forest. says word will get around.'),
			maxMsg: _('no more room for huts.'),
			type: 'building',
			cost: function() {
				var n = $SM.get('game.buildings["hut"]', true);
				return {
					'electricity': 100 + (n*50)
				};
			}
		},
		'lodge': {
			name: _('lodge'),
			button: null,
			maximum: 1,
			availableMsg: _('shibas could help hunt, given the means'),
			buildMsg: _('the hunting lodge stands in the forest, a ways out of town'),
			type: 'building',
			cost: function() {
				return {
					electricity: 200,
					fur: 10,
					meat: 5
				};
			}
		},
		'trading post': {
			name: _('trading post'),
			button: null,
			maximum: 1,
			availableMsg: _("a trading post would make commerce easier"),
			buildMsg: _("now the nomadoges have a place to set up shop, they might stick around a while"),
			type: 'building',
			cost: function() {
				return {
					'electricity': 400,
					'fur': 100
				};
			}
		},
		'tannery': {
			name: _('tannery'),
			button: null,
			maximum: 1,
			availableMsg: _("builder-doge says leather could be useful. says the villagers could make it."),
			buildMsg: _('tannery goes up quick, on the edge of the village'),
			type: 'building',
			cost: function() {
				return {
					'electricity': 500,
					'fur': 50
				};
			}
		},
		'smokehouse': {
			name: _('smokehouse'),
			button: null,
			maximum: 1,
			availableMsg: _("should cure the meat, or it'll spoil. builder-doge says she can fix something up."),
			buildMsg: _('builder-doge finishes the smokehouse. she looks hungry.'),
			type: 'building',
			cost: function() {
				return {
					'electricity': 600,
					'meat': 50
				};
			}
		},
		'workshop': {
			name: _('workshop'),
			button: null,
			maximum: 1,
			availableMsg: _("builder-doge says she could make finer things, if she had the tools"),
			buildMsg: _("workshop's finally ready. builder-doge is excited to get to it"),
			type: 'building',
			cost: function() {
				return {
					'electricity': 800,
					'leather': 100,
					'scales': 10
				};
			}
		},
		'steelworks': {
			name: _('steelworks'),
			button: null,
			maximum: 1,
			availableMsg: _("builder-doge says the villagers could make steel, given the tools"),
			buildMsg: _("a haze falls over the village as the steelworks fires up"),
			type: 'building',
			cost: function() {
				return {
					'electricity': 1500,
					'iron': 100,
					'coal': 100
				};
			}
		},
		'armoury': {
			name: _('armoury'),
			button: null,
			maximum: 1,
			availableMsg: _("builder-doge says it'd be useful to have a steady source of bullets"),
			buildMsg: _("armoury's done, welcoming back the weapons of the past."),
			type: 'building',
			cost: function() {
				return {
					'electricity': 3000,
					'steel': 100,
					'sulphur': 50
				};
			}
		},
		'torch': {
			name: _('torch'),
			button: null,
			type: 'tool',
			buildMsg: _('a torch to keep the dark away'),
			cost: function() {
				return {
					'electricity': 1,
					'cloth': 1
				};
			}
		},
		'waterskin': {
			name: _('waterskin'),
			button: null,
			type: 'upgrade',
			maximum: 1,
			buildMsg: _('this waterskin\'ll hold a bit of water, at least'),
			cost: function() {
				return {
					'leather': 50
				};
			}
		},
		'cask': {
			name: _('cask'),
			button: null,
			type: 'upgrade',
			maximum: 1,
			buildMsg: _('the cask holds enough water for longer expeditions'),
			cost: function() {
				return {
					'leather': 100,
					'iron': 20
				};
			}
		},
		'water tank': {
			name: _('water tank'),
			button: null,
			type: 'upgrade',
			maximum: 1,
			buildMsg: _('never go thirsty again'),
			cost: function() {
				return {
					'iron': 100,
					'steel': 50
				};
			}
		},
		'bone spear': {
			name: _('bone spear'),
			button: null,
			type: 'weapon',
			buildMsg: _("this spear's not elegant, but it's pretty good at stabbing"),
			cost: function() {
				return {
					'electricity': 100,
					'teeth': 5
				};
			}
		},
		'rucksack': {
			name: _('rucksack'),
			button: null,
			type: 'upgrade',
			maximum: 1,
			buildMsg: _('carrying more means longer expeditions to the wilds'),
			cost: function() {
				return {
					'leather': 200
				};
			}
		},
		'wagon': {
			name: _('wagon'),
			button: null,
			type: 'upgrade',
			maximum: 1,
			buildMsg: _('the wagon can carry a lot of supplies'),
			cost: function() {
				return {
					'electricity': 500,
					'iron': 100
				};
			}
		},
		'convoy': {
			name: _('convoy'),
			button: null,
			type: 'upgrade',
			maximum: 1,
			buildMsg: _('the convoy can haul mostly everything'),
			cost: function() {
				return {
					'electricity': 1000,
					'iron': 200,
					'steel': 100
				};
			}
		},
		'l armour': {
			name: _('l armour'),
			type: 'upgrade',
			maximum: 1,
			buildMsg: _("leather's not strong. better than rags, though."),
			cost: function() {
				return {
					'leather': 200,
					'scales': 20
				};
			}
		},
		'i armour': {
			name: _('i armour'),
			type: 'upgrade',
			maximum: 1,
			buildMsg: _("iron's stronger than leather"),
			cost: function() {
				return {
					'leather': 200,
					'iron': 100
				};
			}
		},
		's armour': {
			name: _('s armour'),
			type: 'upgrade',
			maximum: 1,
			buildMsg: _("steel's stronger than iron"),
			cost: function() {
				return {
					'leather': 200,
					'steel': 100
				};
			}
		},
		'iron sword': {
			name: _('iron sword'),
			button: null,
			type: 'weapon',
			buildMsg: _("sword is sharp. good protection out in the wilds."),
			cost: function() {
				return {
					'electricity': 200,
					'leather': 50,
					'iron': 20
				};
			}
		},
		'steel sword': {
			name: _('steel sword'),
			button: null,
			type: 'weapon',
			buildMsg: _("the steel is strong, and the blade true."),
			cost: function() {
				return {
					'electricity': 500,
					'leather': 100,
					'steel': 20
				};
			}
		},
		'rifle': {
			name: _('rifle'),
			type: 'weapon',
			buildMsg: _("black powder and bullets, like the old days."),
			cost: function() {
				return {
					'electricity': 200,
					'steel': 50,
					'sulphur': 50
				};
			}
		}
	},
	
	TradeGoods: {
		'scales': {
			type: 'good',
			cost: function() {
				return { fur: 150 };
			}
		},
		'teeth': {
			type: 'good',
			cost: function() {
				return { fur: 300 };
			}
		},
		'iron': {
			type: 'good',
			cost: function() {
				return {
					'fur': 150,
					'scales': 50
				};
			}
		},
		'coal': {
			type: 'good',
			cost: function() {
				return {
					'fur': 200,
					'teeth': 50
				};
			}
		},
		'steel': {
			type: 'good',
			cost: function() {
				return {
					'fur': 300,
					'scales': 50,
					'teeth': 50
				};
			}
		},
		'medicine': {
			type: 'good',
			cost: function() {
				return {
					'scales': 50, 'teeth': 30
				};
			}
		},
		'bullets': {
			type: 'good',
			cost: function() {
				return {
					'scales': 10
				};
			}
		},
		'energy cell': {
			type: 'good',
			cost: function() {
				return {
					'scales': 10,
					'teeth': 10
				};
			}
		},
		'bolas': {
			type: 'weapon',
			cost: function() {
				return {
					'teeth': 10
				};
			}
		},
		'grenade': {
			type: 'weapon',
			cost: function() {
				return {
					'scales': 100,
					'teeth': 50
				};
			}
		},
		'bayonet': {
			type: 'weapon',
			cost: function() {
				return {
					'scales': 500,
					'teeth': 250
				};
			}
		},
		'alien alloy': {
			type: 'good',
			cost: function() {
				return {
					'fur': 1500,
					'scales': 750,
					'teeth': 300
				};
			}
		},
		'compass': {
			type: 'upgrade',
			maximum: 1,
			cost: function() {
				return { 
					fur: 400, 
					scales: 20, 
					teeth: 10 
				};
			}
		}
	},
	
	MiscItems: {
	  'laser rifle': {
	    type: 'weapon'
	  }
	},
	
	name: _("Room"),
	init: function(options) {
		this.options = $.extend(
			this.options,
			options
		);
		
		if(Engine._debug) {
			this._ROOM_WARM_DELAY = 5000;
			this._BUILDER_STATE_DELAY = 5000;
			this._STOKE_COOLDOWN = 0;
			this._NEED_ELECTRICITY_DELAY = 5000;
		}
		
		if(typeof $SM.get('features.location.room') == 'undefined') {
			$SM.set('features.location.room', true);
			$SM.set('game.builder.level', -1);
		}
		
		Room.temperature = this.TempEnum.Cold;
		Room.fire = this.FireEnum.Dead;
		
		
		// Create the room tab
		this.tab = Header.addLocation(_("A Doge Room"), "room", Room);
		
		// Create the Room panel
		this.panel = $('<div>')
			.attr('id', "roomPanel")
			.addClass('location')
			.appendTo('div#locationSlider');
		
		Engine.updateSlider();
		
		// Create the light button
		new Button.Button({
			id: 'lightButton',
			text: _('turn on laptop'),
			click: Room.lightFire,
			cooldown: Room._STOKE_COOLDOWN,
			width: '80px',
			cost: {'electricity': 5}
		}).appendTo('div#roomPanel');
		
		// Create the stoke button
		new Button.Button({
			id: 'stokeButton',
			text: _("charge laptop"),
			click: Room.stokeFire,
			cooldown: Room._STOKE_COOLDOWN,
			width: '80px',
			cost: {'electricity': 1}
		}).appendTo('div#roomPanel');
		
		// Create the stores container
		$('<div>').attr('id', 'storesContainer').appendTo('div#roomPanel');
		
		//subscribe to stateUpdates
		$.Dispatch('stateUpdate').subscribe(Room.handleStateUpdates);
		
		Room.updateButton();
		Room.updateStoresView();
		Room.updateIncomeView();
		Room.updateBuildButtons();
		
		Room._fireTimer = setTimeout(Room.coolFire, Room._FIRE_COOL_DELAY);
		Room._tempTimer = setTimeout(Room.adjustTemp, Room._ROOM_WARM_DELAY);
		
		/*
		 * Builder states:
		 * 0 - Approaching
		 * 1 - Collapsed
		 * 2 - Shivering
		 * 3 - Sleeping
		 * 4 - Helping
		 */
		if($SM.get('game.builder.level') >= 0 && $SM.get('game.builder.level') < 3) {
			Room._builderTimer = setTimeout(Room.updateBuilderState, Room._BUILDER_STATE_DELAY);
		}
		if($SM.get('game.builder.level') == 1 && $SM.get('stores.electricity', true) < 0) {
			setTimeout(Room.unlockForest, Room._NEED_ELECTRICITY_DELAY);
		}
		setTimeout($SM.collectIncome, 1000);

		Notifications.notify(Room, _("the room is {0}", Room.temperature.text));
		Notifications.notify(Room, _("the laptop is {0}", Room.fire.text));
	},
	
	options: {}, // Nothing for now
	
	onArrival: function(transition_diff) {
		Room.setTitle();
		if(Room.changed) {
			Notifications.notify(Room, _("the laptop is {0}", Room.fire.text));
			Notifications.notify(Room, _("the room is {0}", Room.temperature.text));
			Room.changed = false;
		}
		if($SM.get('game.builder.level') == 3) {
			$SM.add('game.builder.level', 1);
			$SM.setIncome('builder', {
				delay: 10,
				stores: {'electricity' : 2 }
			});
			Room.updateIncomeView();
			Notifications.notify(Room, _("the stranger is standing by the fire. she says she can help. she was a builder-doge before."));
		}

		Engine.moveStoresView(null, transition_diff);
	},
	
	TempEnum: {
		fromInt: function(value) {
			for(var k in this) {
				if(typeof this[k].value != 'undefined' && this[k].value == value) {
					return this[k];
				}
			}
			return null;
		},
		Freezing: { value: 0, text: _('pitch-black') },
		Cold: { value: 1, text: _('dark') },
		Mild: { value: 2, text: _('lit by the glow of the screen') },
		Warm: { value: 3, text: _('lit by the glow of the screen') },
		Hot: { value: 4, text: _('lit by the glow of the screen') }
	},
	
	FireEnum: {
		fromInt: function(value) {
			for(var k in this) {
				if(typeof this[k].value != 'undefined' && this[k].value == value) {
					return this[k];
				}
			}
			return null;
		},
		Dead: { value: 0, text: _('dead (0%)') },
		Smoldering: { value: 1, text: _('25% charged') },
		Flickering: { value: 2, text: _('half charged (50%)') },
		Burning: { value: 3, text: _('charging quickly, and is 75% full') },
		Roaring: { value: 4, text: _('fully charged (100%)') }
	},
	
	setTitle: function() {
		var title = Room.fire.value < 2 ? _("A Doge Room") : _("A Screenlit Room");
		if(Engine.activeModule == this) {
			document.title = title;
		}
		$('div#location_room').text(title);
	},
	
	updateButton: function() {
		var light = $('#lightButton.button');
		var stoke = $('#stokeButton.button');
		if(Room.fire.value == Room.FireEnum.Dead.value && stoke.css('display') != 'none') {
			stoke.hide();
			light.show();
			if(stoke.hasClass('disabled')) {
				Button.cooldown(light);
			}
		} else if(light.css('display') != 'none') {
			stoke.show();
			light.hide();
			if(light.hasClass('disabled')) {
				Button.cooldown(stoke);
			}
		}
		
		if(!$SM.get('stores.electricity')) {
			light.addClass('free');
			stoke.addClass('free');
		} else {
			light.removeClass('free');
			stoke.removeClass('free');
		}
	},
	
	_fireTimer: null,
	_tempTimer: null,
	lightFire: function() {
		var electricity = $SM.get('stores.electricity');
		if(electricity < 5) {
			Notifications.notify(Room, _("not enough electricity to charge the laptop"));
			Button.clearCooldown($('#lightButton.button'));
			return;
		} else if(electricity > 4) {
			$SM.set('stores.electricity', electricity - 5);
		}
		Room.fire = Room.FireEnum.Burning;
		Room.onFireChange();
	},
	
	stokeFire: function() {
		var electricity = $SM.get('stores.electricity');
		if(electricity === 0) {
			Notifications.notify(Room, _("the battery packs have been drained of electricity"));
			Button.clearCooldown($('#stokeButton.button'));
			return;
		}
		if(electricity > 0) {
			$SM.set('stores.electricity', electricity - 1);
		}
		if(Room.fire.value < 4) {
			Room.fire = Room.FireEnum.fromInt(Room.fire.value + 1);
		}
		Room.onFireChange();
	},
	
	onFireChange: function() {
		if(Engine.activeModule != Room) {
			Room.changed = true;
		}
		Notifications.notify(Room, _("the laptop is {0}", Room.fire.text), true);
		if(Room.fire.value > 1 && $SM.get('game.builder.level') < 0) {
			$SM.set('game.builder.level', 0);
			Notifications.notify(Room, _("the light from the laptop's screen spills from the windows, out into the dark"));
			setTimeout(Room.updateBuilderState, Room._BUILDER_STATE_DELAY);
		}	
		window.clearTimeout(Room._fireTimer);
		Room._fireTimer = setTimeout(Room.coolFire, Room._FIRE_COOL_DELAY);
		Room.updateButton();
		Room.setTitle();
	},
	
	coolFire: function() {
		var electricity = $SM.get('stores.electricity');
		if(Room.fire.value <= Room.FireEnum.Flickering.value &&
			$SM.get('game.builder.level') > 3 && electricity > 0) {
			Notifications.notify(Room, _("builder-doge charges the laptop"), true);
			$SM.set('stores.electricity', electricity - 1);
			Room.fire = Room.FireEnum.fromInt(Room.fire.value + 1);
		}
		if(Room.fire.value > 0) {
			Room.fire = Room.FireEnum.fromInt(Room.fire.value - 1);
			Room._fireTimer = setTimeout(Room.coolFire, Room._FIRE_COOL_DELAY);
			Room.onFireChange();
		}
	},
	
	adjustTemp: function() {
		var old = Room.temperature.value;
		if(Room.temperature.value > 0 && Room.temperature.value > Room.fire.value) {
			Room.temperature = Room.TempEnum.fromInt(Room.temperature.value - 1);
			Notifications.notify(Room, _("the room is {0}" , Room.temperature.text), true);
		}
		if(Room.temperature.value < 4 && Room.temperature.value < Room.fire.value) {
			Room.temperature = Room.TempEnum.fromInt(Room.temperature.value + 1);
			Notifications.notify(Room, _("the room is {0}" , Room.temperature.text), true);
		}
		if(Room.temperature.value != old) {
			Room.changed = true;
		}
		Room._tempTimer = setTimeout(Room.adjustTemp, Room._ROOM_WARM_DELAY);
	},
	
	unlockForest: function() {
		$SM.set('stores.electricity', 4);
		Outside.init();
		Notifications.notify(Room, _("the wind howls outside, as if calling you"));
		Notifications.notify(Room, _("the electricity is running out"));
		Engine.event('progress', 'outside');
	},
	
	updateBuilderState: function() {
		var lBuilder = $SM.get('game.builder.level');
		if(lBuilder == 0) {
			Notifications.notify(Room, _("a ragged shiba stumbles through the door and collapses in the corner"));
			lBuilder = $SM.setget('game.builder.level', 1);
			setTimeout(Room.unlockForest, Room._NEED_ELECTRICITY_DELAY);
		} 
		else if(lBuilder < 3 && Room.temperature.value >= Room.TempEnum.Warm.value) {
			var msg = "";
			switch(lBuilder) {
			case 1:
				msg = _("the shibe stranger shivers, and mumbles quietly. her words are unintelligible.");
				break;
			case 2:
				msg = _("the stranger in the corner stops shivering. her panting eases and her tail begins to thump upon the floor");
				break;
			}
			Notifications.notify(Room, msg);
			if(lBuilder < 3) {
				lBuilder = $SM.setget('game.builder.level', lBuilder + 1);
			}
		}
		if(lBuilder < 3) {
			setTimeout(Room.updateBuilderState, Room._BUILDER_STATE_DELAY);
		}
		Engine.saveGame();
	},
	
	updateStoresView: function() {
		var stores = $('div#stores');
		var weapons = $('div#weapons');
		var needsAppend = false, wNeedsAppend = false, newRow = false;
		if(stores.length == 0) {
			stores = $('<div>').attr({
				id: 'stores'
			}).css('opacity', 0);
			needsAppend = true;
		}
		if(weapons.length == 0) {
			weapons = $('<div>').attr({
				id: 'weapons'
			}).css('opacity', 0);
			wNeedsAppend = true;
		}
		for(var k in $SM.get('stores')) {
			
			var type = null;
			if(Room.Craftables[k]) {
				type = Room.Craftables[k].type;
			} else if(Room.TradeGoods[k]) {
				type = Room.TradeGoods[k].type;
			} else if (Room.MiscItems[k]) {
			  type = Room.MiscItems[k].type;
			}
			
			var location;
			switch(type) {
			case 'upgrade':
				// Don't display upgrades on the Room screen
				continue;
			case 'weapon':
				location = weapons;
				break;
			default:
				location = stores;
				break;
			}
			
			var id = "row_" + k.replace(' ', '-');
			var row = $('div#' + id, location);
			var num = $SM.get('stores["'+k+'"]');
			
			if(typeof num != 'number' || isNaN(num)) {
				// No idea how counts get corrupted, but I have reason to believe that they occassionally do.
				// Build a little fence around it!
				num = 0;
				$SM.set('stores["'+k+'"]', 0);
			}
			
			
			// thieves?
			if(typeof $SM.get('game.thieves') == 'undefined' && num > 5000 && $SM.get('features.location.world')) {
				$SM.startThieves();
			}
			
			if(row.length == 0 && num > 0) {
				row = $('<div>').attr('id', id).addClass('storeRow');
				$('<div>').addClass('row_key').text(_(k)).appendTo(row);
				$('<div>').addClass('row_val').text(Math.floor(num)).appendTo(row);
				$('<div>').addClass('clear').appendTo(row);
				var curPrev = null;
				location.children().each(function(i) {
					var child = $(this);
					var cName = child.attr('id').substring(4).replace('-', ' ');
					if(cName < k && (curPrev == null || cName > curPrev)) {
						curPrev = cName;
					}
				});
				if(curPrev == null) {
					row.prependTo(location);
				} else {
					row.insertAfter(location.find('#row_' + curPrev.replace(' ', '-')));
				}
				newRow = true;
			} else if(num>= 0){
				$('div#' + row.attr('id') + ' > div.row_val', location).text(Math.floor(num));
			}
		}
		
		if(needsAppend && stores.children().length > 0) {
			stores.appendTo('div#storesContainer');
			stores.animate({opacity: 1}, 300, 'linear');
		}
		
		if(wNeedsAppend && weapons.children().length > 0) {
			weapons.appendTo('div#storesContainer');
			weapons.animate({opacity: 1}, 300, 'linear');
		}
		
		if(newRow) {
			Room.updateIncomeView();
		}

		if($("div#outsidePanel").length) {
			Outside.updateVillage();
		}
	},
	
	updateIncomeView: function() {
		var stores = $('div#stores');
		if(stores.length == 0 || typeof $SM.get('income') == 'undefined') return;
		$('div.storeRow', stores).each(function(index, el) {
			el = $(el);
			$('div.tooltip', el).remove();
			var tt = $('<div>').addClass('tooltip bottom right');
			var storeName = el.attr('id').substring(4).replace('-', ' ');
			for(var incomeSource in $SM.get('income')) {
				var income = $SM.get('income["'+incomeSource+'"]');
				for(var store in income.stores) {
					if(store == storeName && income.stores[store] != 0) {
						$('<div>').addClass('row_key').text(_(incomeSource)).appendTo(tt);
						$('<div>')
							.addClass('row_val')
							.text(Engine.getIncomeMsg(income.stores[store], income.delay))
							.appendTo(tt);
					}
				}
			}
			if(tt.children().length > 0) {
				tt.appendTo(el);
			}
		});
	},
	
	buy: function(buyBtn) {
		var thing = $(buyBtn).attr('buildThing');
		var good = Room.TradeGoods[thing];
		var numThings = $SM.get('stores["'+thing+'"]', true);
		if(numThings < 0) numThings = 0;
		if(good.maximum <= numThings) {
			return;
		}
		
		var storeMod = {};
		var cost = good.cost();
		for(var k in cost) {
			var have = $SM.get('stores["'+k+'"]', true);
			if(have < cost[k]) {
				Notifications.notify(Room, _("not enough " + k));
				return false;
			} else {
				storeMod[k] = have - cost[k];
			}
		}
		$SM.setM('stores', storeMod);
		
		Notifications.notify(Room, good.buildMsg);
		
		$SM.add('stores["'+thing+'"]', 1);
		
		if(thing == 'compass') {
			Path.openPath();
		}
	},
	
	build: function(buildBtn) {
		var thing = $(buildBtn).attr('buildThing');
		if(Room.temperature.value <= Room.TempEnum.Cold.value) {
			Notifications.notify(Room, _("builder-doge just shivers. the laptop isn't charged enough for her to google what she needs to do."));
			return false;
		}
		var craftable = Room.Craftables[thing];
		
		var numThings = 0; 
		switch(craftable.type) {
		case 'good':
		case 'weapon':
		case 'tool':
		case 'upgrade':
			numThings = $SM.get('stores["'+thing+'"]', true);
			break;
		case 'building':
			numThings = $SM.get('game.buildings["'+thing+'"]', true);
			break;
		}
		
		if(numThings < 0) numThings = 0;
		if(craftable.maximum <= numThings) {
			return;
		}
		
		var storeMod = {};
		var cost = craftable.cost();
		for(var k in cost) {
			var have = $SM.get('stores["'+k+'"]', true);
			if(have < cost[k]) {
				Notifications.notify(Room, _("not enough "+k));
				return false;
			} else {
				storeMod[k] = have - cost[k];
			}
		}
		$SM.setM('stores', storeMod);
		
		Notifications.notify(Room, craftable.buildMsg);
		
		switch(craftable.type) {
		case 'good':
		case 'weapon':
		case 'upgrade':
		case 'tool':
			$SM.add('stores["'+thing+'"]', 1);
			break;
		case 'building':
			$SM.add('game.buildings["'+thing+'"]', 1);
			break;
		}		
	},
	
	needsWorkshop: function(type) {
		return type == 'weapon' || type == 'upgrade' || type =='tool';
	},
	
	craftUnlocked: function(thing) {
		if(Room.buttons[thing]) {
			return true;
		}
		if($SM.get('game.builder.level') < 4) return false;
		var craftable = Room.Craftables[thing];
		if(Room.needsWorkshop(craftable.type) && $SM.get('game.buildings["'+'workshop'+'"]', true) == 0) return false;
		var cost = craftable.cost();
		
		//show button if one has already been built
		if($SM.get('game.buildings["'+thing+'"]') > 0){
			Room.buttons[thing] = true;
			return true;
		}
		// Show buttons if we have at least 1/2 the electricity, and all other components have been seen.
		if($SM.get('stores.electricity', true) < cost['electricity'] * 0.5) {
			return false;
		}
		for(var c in cost) {
			if(!$SM.get('stores["'+c+'"]')) {
				return false;
			}
		}
		
		Room.buttons[thing] = true;
		//don't notify if it has already been built before
		if(!$SM.get('game.buildings["'+thing+'"]')){
			Notifications.notify(Room, craftable.availableMsg);
		}
		return true;
	},
	
	buyUnlocked: function(thing) {
		if(Room.buttons[thing]) {
			return true;
		} else if($SM.get('game.buildings["trading post"]', true) > 0) {
			if(thing == 'compass' || typeof $SM.get('stores["'+thing+'"]') != 'undefined') {
				// Allow the purchase of stuff once you've seen it
				return true;
			}
		}
		return false;
	},
	
	updateBuildButtons: function() {
		var buildSection = $('#buildBtns');
		var needsAppend = false;
		if(buildSection.length == 0) {
			buildSection = $('<div>').attr('id', 'buildBtns').css('opacity', 0);
			needsAppend = true;
		}
		
		var craftSection = $('#craftBtns');
		var cNeedsAppend = false;
		if(craftSection.length == 0 && $SM.get('game.buildings["workshop"]', true) > 0) {
			craftSection = $('<div>').attr('id', 'craftBtns').css('opacity', 0);
			cNeedsAppend = true;
		}
		
		var buySection = $('#buyBtns');
		var bNeedsAppend = false;
		if(buySection.length == 0 && $SM.get('game.buildings["trading post"]', true) > 0) {
			buySection = $('<div>').attr('id', 'buyBtns').css('opacity', 0);
			bNeedsAppend = true;
		}
		
		for(var k in Room.Craftables) {
			craftable = Room.Craftables[k];
			var max = $SM.num(k, craftable) + 1 > craftable.maximum;
			if(craftable.button == null) {
				if(Room.craftUnlocked(k)) {
					var loc = Room.needsWorkshop(craftable.type) ? craftSection : buildSection;
					craftable.button = new Button.Button({
						id: 'build_' + k,
						cost: craftable.cost(),
						text: _(k),
						click: Room.build,
						width: '80px',
						ttPos: loc.children().length > 10 ? 'top right' : 'bottom right'
					}).css('opacity', 0).attr('buildThing', k).appendTo(loc).animate({opacity: 1}, 300, 'linear');
				}
			} else {
				// refresh the tooltip
				var costTooltip = $('.tooltip', craftable.button);
				costTooltip.empty();
				var cost = craftable.cost();
				for(var k in cost) {
					$("<div>").addClass('row_key').text(_(k)).appendTo(costTooltip);
					$("<div>").addClass('row_val').text(cost[k]).appendTo(costTooltip);
				}
				if(max && !craftable.button.hasClass('disabled')) {
					Notifications.notify(Room, craftable.maxMsg);
				}
			}
			if(max) {
				Button.setDisabled(craftable.button, true);
			} else {
				Button.setDisabled(craftable.button, false);
			}
		}
		
		for(var k in Room.TradeGoods) {
			good = Room.TradeGoods[k];
			var max = $SM.num(k, good) + 1 > good.maximum;
			if(good.button == null) {
				if(Room.buyUnlocked(k)) {
					good.button = new Button.Button({
						id: 'build_' + k,
						cost: good.cost(),
						text: _(k),
						click: Room.buy,
						width: '80px'
					}).css('opacity', 0).attr('buildThing', k).appendTo(buySection).animate({opacity:1}, 300, 'linear');
				}
			} else {
				// refresh the tooltip
				var costTooltip = $('.tooltip', good.button);
				costTooltip.empty();
				var cost = good.cost();
				for(var k in cost) {
					$("<div>").addClass('row_key').text(_(k)).appendTo(costTooltip);
					$("<div>").addClass('row_val').text(cost[k]).appendTo(costTooltip);
				}
				if(max && !good.button.hasClass('disabled')) {
					Notifications.notify(Room, good.maxMsg);
				}
			}
			if(max) {
				Button.setDisabled(good.button, true);
			} else {
				Button.setDisabled(good.button, false);
			}
		}
		
		if(needsAppend && buildSection.children().length > 0) {
			buildSection.appendTo('div#roomPanel').animate({opacity: 1}, 300, 'linear');
		}
		if(cNeedsAppend && craftSection.children().length > 0) {
			craftSection.appendTo('div#roomPanel').animate({opacity: 1}, 300, 'linear');
		}
		if(bNeedsAppend && buildSection.children().length > 0) {
			buySection.appendTo('div#roomPanel').animate({opacity: 1}, 300, 'linear');
		}
	},
	
	handleStateUpdates: function(e){
		if(e.category == 'stores'){
			Room.updateStoresView();
			Room.updateBuildButtons();
		} else if(e.category == 'income'){
			Room.updateStoresView();
			Room.updateIncomeView();
		} else if(e.stateName.indexOf('game.buildings') == 0){
			Room.updateBuildButtons();
		}
	}
};
