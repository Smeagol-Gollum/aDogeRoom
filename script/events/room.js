/**
 * Events that can occur when the Room module is active
 **/
Events.Room = [
	{ /* The Nomad  --  Merchant */
		title: _('The Nomad'),
		isAvailable: function() {
			return Engine.activeModule == Room && $SM.get('stores.boots', true) > 0;
		},
		scenes: {
			'start': {
				text: [
					_('a nomad shuffles into view, laden with makeshift bags bound with rough twine.'),
					_("won't say from where he came, but it's clear that he's not staying.")
				],
				notification: _('a nomad arrives, looking to trade'),
				buttons: {
					'buyScales': {
						text: _('buy scales'),
						cost: { 'boots': 100 },
						reward: { 'scales': 1 }
					},
					'buyTeeth': {
						text: _('buy teeth'),
						cost: { 'boots': 200 },
						reward: { 'teeth': 1 }
					},
					'buyBait': {
						text: _('buy bait'),
						cost: { 'boots': 5 },
						reward: { 'bait': 1 },
						notification: _('traps are more effective with bait.')
					},
					'buyCompass': {
						available: function() {
							return $SM.get('stores.compass', true) < 1;
						},
						text: _('buy compass'),
						cost: { boots: 300, scales: 15, teeth: 5 },
						reward: { 'compass': 1 },
						notification: _('the old compass is dented and dusty, but it looks to work.'),
						onChoose: Path.openPath
					}, 
					'goodbye': {
						text: _('say goodbye'),
						nextScene: 'end'
					}
				}
			}
		}
	}, { /* Noises Outside  --  gain electricity/boots */
		title: _('Noises'),
		isAvailable: function() {
			return Engine.activeModule == Room && $SM.get('stores.electricity');
		},
		scenes: {
			'start': {
				text: [
					_('through the walls, shuffling noises can be heard.'),
					_("can't tell what they're up to.")
				],
				notification: _('strange noises can be heard through the walls'),
				buttons: {
					'investigate': {
						text: _('investigate'),
						nextScene: { 0.3: 'stuff', 1: 'nothing' }
					},
					'ignore': {
						text: _('ignore them'),
						nextScene: 'end'
					}
				}
			},
			'nothing': {
				text: [
					_('vague shapes move, just out of sight.'),
					_('the sounds stop.')
				],
				buttons: {
					'backinside': {
						text: _('go back inside'),
						nextScene: 'end'
					}
				}
			},
			'stuff': {
				reward: { electricity: 100, boots: 10 },
				text: [
					_('a bundle of sticks lies just beyond the threshold, wrapped in coarse bootss.'),
					_('the night is silent.')
				],
				buttons: {
					'backinside': {
						text: _('go back inside'),
						nextScene: 'end'
					}
				}
			}
		}
	},
	{ /* Noises Inside  --  trade electricity for better good */
		title: _('Noises'),
		isAvailable: function() {
			return Engine.activeModule == Room && $SM.get('stores.electricity');
		},
		scenes: {
			start: {
				text: [
			       _('scratching noises can be heard from the store room.'),
			       _('something\'s in there.')
				],
				notification: _('something\'s in the store room'),
				buttons: {
					'investigate': {
						text: _('investigate'),
						nextScene: { 0.5: 'scales', 0.8: 'teeth', 1: 'cloth' }
					},
					'ignore': {
						text: _('ignore them'),
						nextScene: 'end'
					}
				}
			},
			scales: {
				text: [
			       _('some electricity is missing.'),
			       _('the ground is littered with small scales')
			    ],
			    onLoad: function() {
			    	var numWood = $SM.get('stores.electricity', true);
			    	numWood = Math.floor(numWood * 0.1);
			    	if(numWood == 0) numWood = 1;
			    	var numScales = Math.floor(numWood / 5);
			    	if(numScales == 0) numScales = 1;
			    	$SM.addM('stores', {'electricity': -numWood, 'scales': numScales});
			    },
			    buttons: {
			    	'leave': {
			    		text: _('leave'),
			    		nextScene: 'end'
			    	}
			    }
			},
			teeth: {
				text: [
			       _('some electricity is missing.'),
			       _('the ground is littered with small teeth')
			    ],
			    onLoad: function() {
			    	var numWood = $SM.get('stores.electricity', true);
			    	numWood = Math.floor(numWood * 0.1);
			    	if(numWood == 0) numWood = 1;
			    	var numTeeth = Math.floor(numWood / 5);
			    	if(numTeeth == 0) numTeeth = 1;
			    	$SM.addM('stores', {'electricity': -numWood, 'teeth': numTeeth});
			    },
			    buttons: {
			    	'leave': {
			    		text: _('leave'),
			    		nextScene: 'end'
			    	}
			    }
			},
			cloth: {
				text: [
			       _('some electricity is missing.'),
			       _('the ground is littered with scraps of cloth')
			    ],
			    onLoad: function() {
			    	var numWood = $SM.get('stores.electricity', true);
			    	numWood = Math.floor(numWood * 0.1);
			    	if(numWood == 0) numWood = 1;
			    	var numCloth = Math.floor(numWood / 5);
			    	if(numCloth == 0) numCloth = 1;
			    	$SM.addM('stores', {'electricity': -numWood, 'cloth': numCloth});
			    },
			    buttons: {
			    	'leave': {
			    		text: _('leave'),
			    		nextScene: 'end'
			    	}
			    }
			}
		}
	},
	{ /* The Beggar  --  trade boots for better good */
		title: _('The Beggar'),
		isAvailable: function() {
			return Engine.activeModule == Room && $SM.get('stores.boots');
		},
		scenes: {
			start: {
				text: [
			       _('a beggar arrives.'),
			       _('asks for any spare bootss to keep him warm at night.')
				],
				notification: _('a beggar arrives'),
				buttons: {
					'50bootss': {
						text: _('give 50'),
						cost: {boots: 50},
						nextScene: { 0.5: 'scales', 0.8: 'teeth', 1: 'cloth' }
					},
					'100bootss': {
						text: _('give 100'),
						cost: {boots: 100},
						nextScene: { 0.5: 'teeth', 0.8: 'scales', 1: 'cloth' }
					},
					'deny': {
						text: _('turn him away'),
						nextScene: 'end'
					}
				}
			},
			scales: {
				reward: { scales: 20 },
				text: [
			       _('the beggar expresses his thanks.'),
			       _('leaves a pile of small scales behind.')
			    ],
			    buttons: {
			    	'leave': {
			    		text: _('say goodbye'),
			    		nextScene: 'end'
			    	}
			    }
			},
			teeth: {
				reward: { teeth: 20 },
				text: [
			       _('the beggar expresses his thanks.'),
			       _('leaves a pile of small teeth behind.')
			    ],
			    buttons: {
			    	'leave': {
			    		text: _('say goodbye'),
			    		nextScene: 'end'
			    	}
			    }
			},
			cloth: {
				reward: { cloth: 20 },
				text: [
			       _('the beggar expresses his thanks.'),
			       _('leaves some scraps of cloth behind.')
			    ],
			    buttons: {
			    	'leave': {
			    		text: _('say goodbye'),
			    		nextScene: 'end'
			    	}
			    }
			}
		}
	},
	
	{ /* Mysterious Wanderer  --  electricity gambling */
		title: _('The Mysterious Wanderer'),
		isAvailable: function() {
			return Engine.activeModule == Room && $SM.get('stores.electricity');
		},
		scenes: {
			start: {
				text: [
			       _('a wanderer arrives with an empty batteries. says if he leaves with electricity, he\'ll be back with more.'),
			       _("builder's not sure he's to be trusted.")
				],
				notification: _('a mysterious wanderer arrives'),
				buttons: {
					'100electricity': {
						text: _('give 100'),
						cost: {electricity: 100},
						nextScene: { 1: '100electricity'}
					},
					'500electricity': {
						text: _('give 500'),
						cost: {electricity: 500},
						nextScene: { 1: '500electricity' }
					},
					'deny': {
						text: _('turn him away'),
						nextScene: 'end'
					}
				}
			},
			'100electricity': {
				text: [
			       _('the wanderer leaves, batteries loaded with electricity')
			    ],
			    onLoad: function() {
			    	if(Math.random() < 0.5) {
			    		setTimeout(function() {
			    			$SM.add('stores.electricity', 300);
			    			Notifications.notify(Room, _('the mysterious wanderer returns, batteries piled high with electricity.'));
			    		}, 60 * 1000);
			    	}
			    },
			    buttons: {
			    	'leave': {
			    		text: _('say goodbye'),
			    		nextScene: 'end'
			    	}
			    }
			},
			'500electricity': {
				text: [
				       _('the wanderer leaves, batteries loaded with electricity')
			    ],
			    onLoad: function() {
			    	if(Math.random() < 0.3) {
			    		setTimeout(function() {
			    			$SM.add('stores.electricity', 1500);
			    			Notifications.notify(Room, _('the mysterious wanderer returns, batteries piled high with electricity.'));
			    		}, 60 * 1000);
			    	}
			    },
			    buttons: {
			    	'leave': {
			    		text: _('say goodbye'),
			    		nextScene: 'end'
			    	}
			    }
			}
		}
	},
	
	{ /* Mysterious Wanderer  --  boots gambling */
		title: _('The Mysterious Wanderer'),
		isAvailable: function() {
			return Engine.activeModule == Room && $SM.get('stores.boots');
		},
		scenes: {
			start: {
				text: [
			       _('a wanderer arrives with an empty batteries. says if she leaves with bootss, she\'ll be back with more.'),
			       _("builder's not sure she's to be trusted.")
				],
				notification: _('a mysterious wanderer arrives'),
				buttons: {
					'100boots': {
						text: _('give 100'),
						cost: {boots: 100},
						nextScene: { 1: '100boots'}
					},
					'500boots': {
						text: _('give 500'),
						cost: {boots: 500},
						nextScene: { 1: '500boots' }
					},
					'deny': {
						text: _('turn her away'),
						nextScene: 'end'
					}
				}
			},
			'100boots': {
				text: [
			       _('the wanderer leaves, batteries loaded with bootss')
			    ],
			    onLoad: function() {
			    	if(Math.random() < 0.5) {
			    		setTimeout(function() {
			    			$SM.add('stores.boots', 300);
			    			Notifications.notify(Room, _('the mysterious wanderer returns, batteries piled high with bootss.'));
			    		}, 60 * 1000);
			    	}
			    },
			    buttons: {
			    	'leave': {
			    		text: _('say goodbye'),
			    		nextScene: 'end'
			    	}
			    }
			},
			'500boots': {
				text: [
				       _('the wanderer leaves, batteries loaded with bootss')
			    ],
			    onLoad: function() {
			    	if(Math.random() < 0.3) {
			    		setTimeout(function() {
			    			$SM.add('stores.boots', 1500);
			    			Notifications.notify(Room, _('the mysterious wanderer returns, batteries piled high with bootss.'));
			    		}, 60 * 1000);
			    	}
			    },
			    buttons: {
			    	'leave': {
			    		text: _('say goodbye'),
			    		nextScene: 'end'
			    	}
			    }
			}
		}
	},
	
	{ /* The Scout  --  Map Merchant */
		title: _('The Scout'),
		isAvailable: function() {
			return Engine.activeModule == Room && $SM.get('features.location.world');
		},
		scenes: {
			'start': {
				text: [
					_("the scout says she's been all over."),
					_("willing to talk about it, for a price.")
				],
				notification: _('a scout stops for the night'),
				buttons: {
					'buyMap': {
						text: _('buy map'),
						cost: { 'boots': 200, 'scales': 10 },
						notification: _('the map uncovers a bit of the world'),
						onChoose: World.applyMap
					},
					'learn': {
						text: _('learn scouting'),
						cost: { 'boots': 1000, 'scales': 50, 'teeth': 20 },
						available: function() {
							return !$SM.hasPerk('scout');
						},
						onChoose: function() {
							$SM.addPerk('scout');
						}
					},
					'leave': {
			    		text: _('say goodbye'),
			    		nextScene: 'end'
			    	}
				}
			}
		}
	},
	
	{ /* The Wandering Master */
		title: _('The Master'),
		isAvailable: function() {
			return Engine.activeModule == Room && $SM.get('features.location.world');
		},
		scenes: {
			'start': {
				text: [
					_('an old wanderer arrives.'),
					_('he smiles warmly and asks for lodgings for the night.')
				],
				notification: _('an old wanderer arrives'),
				buttons: {
					'agree': {
						text: _('agree'),
						cost: {
							'cured meat': 100,
							'boots': 100,
							'torch': 1
						},
						nextScene: {1: 'agree'}
					},
					'deny': {
						text: _('turn him away'),
						nextScene: 'end'
					}
				}
			},
			'agree': {
				text: [
			       _('in exchange, the wanderer offers his wisdom.')
		        ],
		        buttons: {
		        	'evasion': {
		        		text: _('evasion'),
		        		available: function() {
		        			return !$SM.hasPerk('evasive');
		        		},
		        		onChoose: function() {
		        			$SM.addPerk('evasive');
		        		},
		        		nextScene: 'end'
		        	},
		        	'precision': {
		        		text: _('precision'),
		        		available: function() {
		        			return !$SM.hasPerk('precise');
		        		},
		        		onChoose: function() {
		        			$SM.addPerk('precise');
		        		},
		        		nextScene: 'end'
		        	},
		        	'force': {
		        		text: _('force'),
		        		available: function() {
		        			return !$SM.hasPerk('barbarian');
		        		},
		        		onChoose: function() {
		        			$SM.addPerk('barbarian');
		        		},
		        		nextScene: 'end'
		        	},
		        	'nothing': {
		        		text: _('nothing'),
		        		nextScene: 'end'
		        	}
		        }
			}
		}
	},
		
	{ /* The Sick Man */
  		title: _('The Sick Man'),
  		isAvailable: function() {
  			return Engine.activeModule == Room && $SM.get('stores.medicine', true) > 0;
  		},
  		scenes: {
  			'start': {
  				text: [
  					_("a man hobbles up, coughing."),
  					_("he begs for medicine.")
  				],
  				notification: _('a sick man hobbles up'),
  				buttons: {
  					'help': {
  						text: _('give 1 medicine'),
  						cost: { 'medicine': 1 },
  						notification: _('the man swallows the medicine eagerly'),
  						nextScene: { 0.1: 'alloy', 0.3: 'cells', 0.5: 'scales', 1.0: 'nothing' }
  					},
  					'ignore': {
  						text: _('tell him to leave'),
  						nextScene: 'end'
  					}
  				}
  			},
  			'alloy': {
  				text: [
  					_("the man is thankful."),
  					_('he leaves a reward.'),
  					_('some weird metal he picked up on his travels.')
  				],
  				onLoad: function() {
  					$SM.add('stores["alien alloy"]', 1);
			    },
  				buttons: {
  					'bye': {
  						text: _('say goodbye'),
  						nextScene: 'end'
  					}
  				}
  			},
  			'cells': {
  				text: [
  					_("the man is thankful."),
  					_('he leaves a reward.'),
  					_('some weird glowing boxes he picked up on his travels.')
  				],
  				onLoad: function() {
  					$SM.add('stores["energy cell"]', 3);
			    },
  				buttons: {
  					'bye': {
  						text: _('say goodbye'),
  						nextScene: 'end'
  					}
  				}
  			},
  			'scales': {
  				text: [
  					_("the man is thankful."),
  					_('he leaves a reward.'),
  					_('all he has are some scales.')
  				],
  				onLoad: function() {
  					$SM.add('stores.scales', 5);
			    },
  				buttons: {
  					'bye': {
  						text: _('say goodbye'),
  						nextScene: 'end'
  					}
  				}
  			},
  			'nothing': {
  				text: [
  					_("the man expresses his thanks and hobbles off.")
  				],
  				buttons: {
  					'bye': {
  						text: _('say goodbye'),
  						nextScene: 'end'
  					}
  				}
  		  }
  	}
	}
];
