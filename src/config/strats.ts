export type Strat = {
  id: string;
  title: string;
  description: string;
};

export const STRATS: Strat[] = [
  // --- Group 1: Team Behavior Rules ---
  {
    id: 'strat_01',
    title: 'BOTTOM FRAG TRIBUTE',
    description: 'After a player dies, all players have to give bottom frag a complement.',
  },
  {
    id: 'strat_02',
    title: 'TOP FRAG CATCHPHRASE',
    description: 'Everytime a player gets a kill, they have to repeat a phrase the top frag chooses.',
  },
  {
    id: 'strat_03',
    title: 'ETERNAL BACKSEAT',
    description: 'The player who dies first has to back seat all players for that round. You cannot perform an action not stated by the first dead.',
  },
  {
    id: 'strat_04',
    title: 'KNIFE ONLY ROUND',
    description: 'For the entire round, all players must use knife and until only.',
  },
  {
    id: 'strat_05',
    title: 'MISS AND SWITCH',
    description: 'If a player misses their first shot, they must use knife for the rest of the round.',
  },
  {
    id: 'strat_06',
    title: 'SPRAY BEFORE KILL',
    description: 'All players must spray before killing an enemy.',
  },
  {
    id: 'strat_07',
    title: 'SPIKE CARRIER ONLY',
    description: 'The spike carrier is default top frag and is the only person who can move. If the spike is dropped, next frag may retrieve. All players must wait in spawn until spike is planted.',
  },
  {
    id: 'strat_08',
    title: 'HAPPY BIRTHDAY PLANT',
    description: 'All players must sing happy birthday to planter in full while planting.',
  },
  {
    id: 'strat_09',
    title: 'FULL COMMS ROUND',
    description: 'All players must use comms in full throughout entire round.',
  },
  {
    id: 'strat_10',
    title: 'BOTTOM FRAG DJ',
    description: 'Bottom frag chooses a song which every player must sing throughout the entire round.',
  },
  {
    id: 'strat_11',
    title: 'GRIEF KNIFE MODE',
    description: 'If an ally is killed, every player must use knife until an enemy is killed, then they may switch back to weapon.',
  },
  {
    id: 'strat_12',
    title: 'ONE CHOSEN KILLER',
    description: 'For an entire round, everyone chooses one person and only they may get kills. All other players must support them. If the killer dies, the next frag is promoted.',
  },
  {
    id: 'strat_13',
    title: 'SPAWN SPIKE HOLD',
    description: 'All players must leave spike in spawn until first kill.',
  },
  {
    id: 'strat_14',
    title: 'VIP PROTECTION',
    description: 'One player is chosen to go the entire map while their teammates follow them around and protect them. If the person being protected dies, all other players may only use knife for the remainder of the round.',
  },
  {
    id: 'strat_15',
    title: 'JUMP SHOT ONLY',
    description: 'All players must jump when shooting.',
  },
  {
    id: 'strat_16',
    title: 'NO W KEY',
    description: 'All players must only use A and D keys to move.',
  },
  {
    id: 'strat_17',
    title: 'TEXT CHAT CALLOUTS',
    description: 'For the entire round, all call outs must be made in text chat, no pings are allowed.',
  },
  {
    id: 'strat_18',
    title: 'MANDATORY THANKS',
    description: 'All players, after every kill must type thank you in full. No copy and paste allowed.',
  },
  {
    id: 'strat_19',
    title: 'T-BAG EVERY KILL',
    description: 'After every kill you have to t-bag.',
  },
  {
    id: 'strat_20',
    title: 'T-BAG YOUR DEAD',
    description: 'If a teammate dies, all living teammates must t bag them before you\'re allowed to use your gun again.',
  },
  {
    id: 'strat_21',
    title: 'SPRAY COOLDOWN',
    description: 'After every kill, all teammates must spray before killing again. Must wait on cooldown before firing again.',
  },
  {
    id: 'strat_22',
    title: 'SPRAY KNIFE PENALTY',
    description: 'If somebody sprays, ally or enemy, every body must pull out their knife for 5 seconds before returning to gun.',
  },
  {
    id: 'strat_23',
    title: 'PISTOL OR KNIFE',
    description: 'For an entire round you can only use pistol and utility. If your pistol runs out of ammo, you may only use knife.',
  },
  {
    id: 'strat_24',
    title: 'DEFENDERS FALL',
    description: 'When defending, all players must take fall damage.',
  },
  {
    id: 'strat_25',
    title: 'ANIMAL KILL NOISES',
    description: 'When a player gets a kill they must make animal noises.',
  },
  {
    id: 'strat_26',
    title: 'BOTTOM FRAG ARMORY',
    description: 'Bottom frag chooses one type of gun everyone must use for the round.',
  },
  {
    id: 'strat_27',
    title: 'RED LIGHT GREEN LIGHT',
    description: 'After the first ally dies, they will say red light or green light. On red light all players must stop everything they\'re doing and not resume until player says green light.',
  },
  {
    id: 'strat_28',
    title: 'HOT AND COLD COMMS',
    description: 'All players must only use the terms "hotter" or "colder" for call outs.',
  },
  {
    id: 'strat_29',
    title: 'SIMON SAYS ROUND',
    description: 'First ally to die becomes "Simon". This player makes decisions for the entire team in a "Simon says" manner.',
  },
  {
    id: 'strat_30',
    title: 'PERMANENT CROUCH',
    description: 'Players must remain crouched the entire round.',
  },
  {
    id: 'strat_31',
    title: 'WALK BACKWARDS',
    description: 'Players must walk backwards the entire round.',
  },
  // --- Group 2: Fun Challenges ---
  {
    id: 'strat_32',
    title: 'KNIFE FIGHT INVITE',
    description: 'Try to get the enemies to knife fight in the center of the map!',
  },
  {
    id: 'strat_33',
    title: 'SUNGLASSES ON',
    description: 'Put on sunglasses for this round or squint!',
  },
  {
    id: 'strat_34',
    title: 'TARGET PRIORITY',
    description: 'Choose a target and be the first to kill them.',
  },
  {
    id: 'strat_35',
    title: 'EPIC SHOUTCASTER',
    description: 'The first person to die must become an epic shout caster!',
  },
  {
    id: 'strat_36',
    title: 'STICKY MOUSE',
    description: 'Your mouse has become sticky and you can only single fire now!',
  },
  {
    id: 'strat_37',
    title: 'PROTECT THE PRESIDENT',
    description: 'The president is in the 3rd position. Protect them at all cost!',
  },
  {
    id: 'strat_38',
    title: 'FORCE ECO',
    description: 'You have no money and cannot buy this round!',
  },
  {
    id: 'strat_39',
    title: 'FREEZE EVERY 15s',
    description: 'Every 15 seconds you have to stand completely still for 5 seconds!',
  },
  {
    id: 'strat_40',
    title: 'WRONG CALLOUTS',
    description: 'You no longer can use correct callouts!',
  },
  {
    id: 'strat_41',
    title: 'CREATE YOUR STRAT',
    description: 'Create your own wacky strat that you want to do!',
  },
  {
    id: 'strat_42',
    title: 'GUN PILE BAIT',
    description: 'Bait the enemy with a pile of guns.',
  },
  {
    id: 'strat_43',
    title: 'ANTI-TEAMWORK',
    description: 'Get and stay as far away from your teammates as possible!',
  },
  {
    id: 'strat_44',
    title: 'AVOID THE TOP',
    description: 'Whomever is at the top of the scoreboard is "it" avoid them at all costs!',
  },
  {
    id: 'strat_45',
    title: 'MID-AIR KILL',
    description: 'Try to kill someone while in mid air!',
  },
  {
    id: 'strat_46',
    title: 'BLIND NAVIGATOR',
    description: 'Close your eyes and let one of your teammates guide you to the bombsite!',
  },
  {
    id: 'strat_47',
    title: 'HOP EVERY 5s',
    description: 'You must hop every 5 seconds!',
  },
  {
    id: 'strat_48',
    title: 'ALT FIRE ONLY',
    description: 'You must purchase a gun (that has alt fire) and use its alt fire only!',
  },
  {
    id: 'strat_49',
    title: 'BUY A BULLDOG',
    description: 'Buy a Bulldog this round!',
  },
  {
    id: 'strat_50',
    title: 'PHANTOM OR GHOST',
    description: 'Buy a Phantom or a Ghost this round!',
  },
  {
    id: 'strat_51',
    title: 'RUSH MID',
    description: 'Rush all the way down mid!',
  },
  {
    id: 'strat_52',
    title: 'SOUND SHOOTER',
    description: 'Shoot at every sound you hear!',
  },
  {
    id: 'strat_53',
    title: 'OFF THE GROUND',
    description: 'To the best of your ability, stay off the ground!',
  },
  {
    id: 'strat_54',
    title: 'ENEMY SPAWN SNEAK',
    description: 'Try to sneak to the enemy\'s spawn!',
  },
  {
    id: 'strat_55',
    title: 'WAR CRY KILLS',
    description: 'Every time you kill an enemy, you must voice a mighty shout!',
  },
  {
    id: 'strat_56',
    title: 'PISTOL ROUND',
    description: 'You can only use a pistol this round!',
  },
  {
    id: 'strat_57',
    title: 'CROUCHED SHADOW',
    description: 'You must crouch and avoid line of sight this round!',
  },
  {
    id: 'strat_58',
    title: 'KNIFE BETRAYAL',
    description: 'Try to get the enemies to knife and betray their trust by shooting them!',
  },
  {
    id: 'strat_59',
    title: 'GIFT A GUN',
    description: 'Purchase a gun for your favorite player/agent!',
  },
  {
    id: 'strat_60',
    title: 'RUSH B NO STOP',
    description: 'RUSH B! DON\'T STOP!',
  },
  {
    id: 'strat_61',
    title: 'SPRAY TIL EMPTY',
    description: 'Everytime you shoot spray until you run out of bullets.',
  },
  {
    id: 'strat_62',
    title: 'WHISPER COMMS',
    description: 'Play the entire round while whispering to your team.',
  },
  {
    id: 'strat_63',
    title: 'ODIN HOLD ANGLE',
    description: 'Purchase an Odin or Aries and wait for the enemy to peak you.',
  },
  {
    id: 'strat_64',
    title: 'ONE EYE CLOSED',
    description: 'Keep one eye closed for the whole round.',
  },
  {
    id: 'strat_65',
    title: 'ABILITY FREE ROUND',
    description: 'Win the round without using any abilities.',
  },
  {
    id: 'strat_66',
    title: 'GHOST REQUEST',
    description: 'Ask a teammate to request a gun and then never buy it.',
  },
  {
    id: 'strat_67',
    title: 'MAX SENS CROSSHAIR',
    description: 'Your sensitivity is cut in half and your crosshair must be changed to max settings.',
  },
  {
    id: 'strat_68',
    title: 'SOLO PLANT',
    description: 'Go alone and sneakily plant the bomb.',
  },
  {
    id: 'strat_69',
    title: 'TAKE ME HOSTAGE',
    description: 'Try to get the enemies to take you hostage.',
  },
  {
    id: 'strat_70',
    title: 'SITE SWAP PLANT',
    description: 'Once you takeover a site, you must plant at a different site.',
  },
  // --- Group 3: Tactical Rules ---
  {
    id: 'strat_71',
    title: 'SAME GUN AS BEFORE',
    description: 'If possible, players must use the same weapon (or weapon type, if budget does not allow) that they held in the previous round.',
  },
  {
    id: 'strat_72',
    title: 'SWAP FIRE AND JUMP',
    description: 'Players must swap keybinds for Primary Fire and Jump.',
  },
  {
    id: 'strat_73',
    title: 'VOICE BY GENDER',
    description: 'All players using male characters must make callouts in a deep voice. All players using female characters must make callouts in falsetto.',
  },
  {
    id: 'strat_74',
    title: 'GUN BUDDY REQUIRED',
    description: 'Players may only use guns sporting a Gun Buddy. If a player has no equipped Buddies, they must use the Classic.',
  },
  {
    id: 'strat_75',
    title: 'ONE GUN DRAWN',
    description: 'Only one player at a time may have their primary weapon drawn.',
  },
  {
    id: 'strat_76',
    title: 'FORCE PISTOL ROUND',
    description: 'This round is a pistol round.',
  },
  {
    id: 'strat_77',
    title: 'NO SHARING ZONES',
    description: 'No two players may be at the same callout area at the same time.',
  },
  {
    id: 'strat_78',
    title: 'GEOGRAPHY CALLOUTS',
    description: 'All callouts must now include the name of a real-life city, country, or point of interest.',
  },
  {
    id: 'strat_79',
    title: 'ABILITIES BEFORE PLANT',
    description: 'Players must use all abilities before the spike is planted. Any abilities remaining after the plant must be used in the enemy spawn.',
  },
  {
    id: 'strat_80',
    title: 'LMG FULL RUSH',
    description: 'All players must buy an LMG and run straight to point from spawn.',
  },
  {
    id: 'strat_81',
    title: 'HOLD W UNTIL PLANT',
    description: 'Players must hold down the W key at all times until the spike has been planted.',
  },
  {
    id: 'strat_82',
    title: 'KNIFE WALK NO CROUCH',
    description: 'Players must always have a knife out while moving. Players are not allowed to crouch.',
  },
  {
    id: 'strat_83',
    title: 'ABILITIES ON EMPTY',
    description: 'Players may only use abilities when their clip is empty.',
  },
  {
    id: 'strat_84',
    title: 'POOREST BUDGET CAP',
    description: 'No player may spend more than the poorest player.',
  },
  {
    id: 'strat_85',
    title: 'FULL TEAM CROUCH',
    description: 'Players must remain crouched at all times.',
  },
  {
    id: 'strat_86',
    title: 'ULTIMATES BEFORE PLANT',
    description: 'All players with their ultimate ability available must use it before the spike is planted. If no player has their ultimate ability available, roll another strat.',
  },
  {
    id: 'strat_87',
    title: 'FIRE LOCK POST-PLANT',
    description: 'Players that fire their primary weapons before the spike is planted may not fire them afterward. Players that use abilities before the spike is planted may not use them afterwards.',
  },
  {
    id: 'strat_88',
    title: 'HOLD ONE POINT',
    description: 'Choose a point at random. All players must defend this point (and may not leave it) until the spike is planted.',
  },
  {
    id: 'strat_89',
    title: 'SHORTY FINISHING',
    description: 'All players must buy a Shorty. Players are allowed to harass and damage enemies with any weapon, but all kills must be completed with the Shorty. Players who score a kill by other means must return to tag spawn before firing their weapon again.',
  },
  {
    id: 'strat_90',
    title: 'PERSONAL NEMESIS',
    description: 'Each player must choose an agent from the enemy team, and cannot harm any other enemy until their target has been eliminated. Players also cannot kill any enemy still being targeted by a living teammate.',
  },
  {
    id: 'strat_91',
    title: 'GHOST COMMS ONLY',
    description: 'Only players who have been eliminated may use comms, preferably in a ghostly manner.',
  },
  {
    id: 'strat_92',
    title: 'DOUBLE SENSITIVITY',
    description: 'All players must double their in-game mouse sensitivity.',
  },
  {
    id: 'strat_93',
    title: 'DEFEND FROM SPAWN',
    description: 'On defense, Players must remain in spawn until the spike is planted.',
  },
  {
    id: 'strat_94',
    title: 'ALL ABILITIES SPENT',
    description: 'All players must full-buy their abilities. The team must completely use all possible abilities before the spike is planted.',
  },
  {
    id: 'strat_95',
    title: 'ONE SHOT CALLER',
    description: 'Choose one player at random. All callouts must be made by this player. Other players may make use of the whisper system to keep them informed.',
  },
  {
    id: 'strat_96',
    title: 'SCAVENGER ROUND',
    description: 'After each kill, players must retrieve the downed enemy\'s weapon and use it for the next kill.',
  },
];
