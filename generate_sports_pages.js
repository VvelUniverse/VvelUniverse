// Template generator for sports category pages
// This will help create all remaining pages with proper structure

const sportsCategories = [
  {
    key: 'track-sports',
    title: 'Track Sports',
    icon: '🏃',
    emoji: '🏃',
    gradient: 'linear-gradient(to bottom, #0a2541, #0d3a5c, #000000)',
    posts: [
      { name: 'Elliot Reyes', emoji: '🏃', content: 'World U20 final delivers historic 100m dead heat! Photo finish decided by thousandths. Replay the electric start-line drama.\n\n"Speed is not just about running fast, it\'s about running smart."' },
      { name: 'Maya Huang', emoji: '🏃‍♀️', content: 'Marathon course record shattered amid monsoon conditions! Tactical surges and negative splits make this a race for the ages.\n\nEndurance meets strategy in the ultimate test of willpower.' },
      { name: 'Jasper Lindholm', emoji: '🎯', content: 'Pole vault prodigy clears 6.25m under the lights! Technique breakdown and coach insights from the new record holder.\n\n"Every jump is a leap of faith in your training."' }
    ]
  },
  {
    key: 'stick-sports',
    title: 'Stick Sports',
    icon: '🏑',
    emoji: '🏑',
    gradient: 'linear-gradient(to bottom, #0c2e3f, #0d3a4f, #000000)',
    posts: [
      { name: 'Kari Petrov', emoji: '🏒', content: 'Overtime winner seals conference crown! Breakdown of the double-stack penalty kill that changed the game.\n\nIce hockey at its finest - strategy meets execution.' },
      { name: 'Sasha Rivera', emoji: '🏑', content: 'Desert Classic ends with historic 8-goal performance! Horse and rider harmony analyzed by biomechanical experts.\n\nPolo mastery on display - precision and partnership.' },
      { name: 'Helena Ma', emoji: '🥍', content: 'Final four showdown decided by face-off efficiency! Watch the decisive possessions and the gear innovations behind them.\n\nLacrosse excellence - speed, skill, and strategy.' }
    ]
  },
  {
    key: 'water-sports',
    title: 'Water Sports',
    icon: '🌊',
    emoji: '🌊',
    gradient: 'linear-gradient(to bottom, #042f49, #063d5c, #000000)',
    posts: [
      { name: 'Kai Matsuda', emoji: '🏄', content: 'Mega swell finals decide world title in Tahiti! Drone replays show perfect barrel selection and fin tweaks.\n\n"Riding the wave is about reading the ocean\'s rhythm."' },
      { name: 'Nila Steiner', emoji: '🏊', content: 'New 200m butterfly record stunned the crowd! Comparative stroke analysis versus the previous champ.\n\nSwimming excellence - technique meets determination.' },
      { name: 'Onda Syndicate', emoji: '⛵', content: 'Oceanic leg won with daring foiling strategy! Route data and wind forecasting secrets revealed.\n\nSailing mastery - where strategy meets the elements.' }
    ]
  },
  {
    key: 'motor-sports',
    title: 'Motor Sports',
    icon: '🏎️',
    emoji: '🏎️',
    gradient: 'linear-gradient(to bottom, #18181b, #1f2937, #000000)',
    posts: [
      { name: 'Luca Moretti', emoji: '🏎️', content: 'Strategy masterclass wins under safety car chaos! Undercut timing, tire degradation maps, and radio highlights.\n\nFormula 1 at its tactical best - every second counts.' },
      { name: 'Zara Singh', emoji: '🏍️', content: 'Last-lap overtake on slicks defied expectations! Lean angle telemetry and aero package tweaks explained.\n\nMotoGP brilliance - courage meets precision.' },
      { name: 'HyperDrive Factory', emoji: '🏁', content: '24-hour night stint decided by pit crew precision! Breakdown of the sub-2 second tire change that sealed the victory.\n\nEndurance racing - teamwork under pressure.' }
    ]
  },
  {
    key: 'gymnastics',
    title: 'Gymnastics',
    icon: '🤸',
    emoji: '🤸',
    gradient: 'linear-gradient(to bottom, #2e1065, #4c1d95, #000000)',
    posts: [
      { name: 'Amira Yoon', emoji: '🤸', content: 'Triple-twist sequence earns perfect artistry score! Coach commentary on musicality and upgraded difficulty value.\n\n"Gymnastics is poetry in motion."' },
      { name: 'Leila Novak', emoji: '🎀', content: 'New release combo raises start value to 6.9! Biomechanics breakdown of grip changes and swing tempo.\n\nRhythmic gymnastics - grace meets power.' },
      { name: 'Vault Solutions Lab', emoji: '🏋️', content: 'Breathtaking triple series lands with zero deductions! View the foot placement overlays and air-time analytics.\n\nTechnical perfection meets artistic expression.' }
    ]
  },
  {
    key: 'ice-sports',
    title: 'Ice Sports',
    icon: '⛸️',
    emoji: '⛸️',
    gradient: 'linear-gradient(to bottom, #0f172a, #0f766e, #000000)',
    posts: [
      { name: 'Isla Voronin', emoji: '⛸️', content: 'Quad-axel lands gracefully in record-setting free skate! Frame-by-frame look at air position and edge control.\n\nFigure skating artistry - precision meets beauty.' },
      { name: 'Jamil Torres', emoji: '🏒', content: 'Shootout classic capped off with no-look dagger! Goaltender scouting report and stick flex comparison.\n\nIce hockey excellence - reflexes meet strategy.' },
      { name: 'Lightning Glide', emoji: '⛸️', content: 'World record shattered on high-altitude oval! Aerodynamic suit innovations and pacing strategy decoded.\n\nSpeed skating mastery - power meets technique.' }
    ]
  },
  {
    key: 'animal-sports',
    title: 'Animal Sports',
    icon: '🐴',
    emoji: '🐴',
    gradient: 'linear-gradient(to bottom, #172e1f, #15803d, #000000)',
    posts: [
      { name: 'Celeste & Ember', emoji: '🐴', content: 'Grand prix dressage routine earns new artistry record! Choreography notes and partnership training secrets.\n\n"True partnership is when horse and rider move as one."' },
      { name: 'Horizon Racers', emoji: '🐎', content: 'Triple crown finale won with daring inside line! Stride analytics and jockey strategy dissected.\n\nHorse racing excellence - speed meets strategy.' },
      { name: 'Aiko & Kenzo', emoji: '🐕', content: 'Border collie duo claims world agility cup! Course layout and handler cues mapped in 3D.\n\nCanine agility - teamwork and trust in motion.' }
    ]
  },
  {
    key: 'contact-team-sport',
    title: 'Contact Team Sport',
    icon: '🛡️',
    emoji: '🛡️',
    gradient: 'linear-gradient(to bottom, #1e293b, #1e3a8a, #000000)',
    posts: [
      { name: 'Darius Makoa', emoji: '🏉', content: 'Late surge mauls the defense in cup semi-final! Lineout finesse and offload chains broken down frame by frame.\n\nRugby power - strength meets strategy.' },
      { name: 'Jules Turner', emoji: '🏈', content: 'Blitz package disrupts top-ranked offense! Protection shifts, coverage disguises, and sideline adjustments.\n\nAmerican football tactics - precision meets power.' },
      { name: 'Anja Ristic', emoji: '🤾', content: 'Last-second jump shot secures continental title! Set play schematics and goalkeeper read reacted in real time.\n\nHandball excellence - speed meets accuracy.' }
    ]
  }
];

// This is a reference template - actual files will be created separately
console.log('Sports categories defined. Use this to generate pages.');












