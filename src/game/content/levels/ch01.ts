import { SceneBuilder, at, caesar, floor, inside, makeLevel, on, shell, type LevelSpec } from "../builder";
import { itemName } from "../items";

/* ------------------------------------------------------------------ */
/* 1 · The Empty Study                                                  */
/* ------------------------------------------------------------------ */
function l01(): LevelSpec {
  const s = new SceneBuilder("scene-c1-01");
  s.area("study", "The Study", shell({ wall: "damask", floor: "boards", wallColor: "#4a1f26", accent: "#d9b26a", floorColor: "#5a3a22", darkness: 0.35, lights: [{ x: 430, y: 270, r: 170 }, { x: 140, y: 160, r: 90, strength: 0.25 }] }));
  s.decor("rug", 300, 470, 420, 100);
  const shelf = s.decor("bookshelf", 20, 100, 190, 340);
  s.decor("window", 232, 80, 110, 160, { variant: "rain" });
  s.decor("curtain", 212, 64, 36, 210);
  s.decor("curtain", 326, 64, 36, 210, { flip: true });
  s.decor("clock-wall", 500, 112, 60, 60, { variant: "h11m40" });
  const desk = s.decor("desk", 370, 300, 310, 170);
  s.place("lamp-desk", on(desk, 0, 0.14, 50, 62));
  s.place("book", on(desk, 0, 0.88, 56, 30), { tint: "#2c3e5c" });
  const fire = s.decor("fireplace", 740, 240, 200, 200);
  s.decor("painting", 770, 92, 140, 110);
  const chair = s.decor("armchair", 680, 350, 150, 150);

  s.obj({
    id: "vance-card", name: "Vance's Calling Card", cat: "evidence", art: "card-calling", box: on(desk, 0, 0.6, 46, 28), required: true,
    desc: "A calling card: INSPECTOR MARGOT VANCE, Wrenmoor C.I.D. The edges are crisp and dust-free — it hasn't lain here long.",
    ev: { id: "ev-vance-card", category: "physical", significance: "Places Inspector Vance inside Hollowmere House recently." },
    hint: "Check the top of the desk, beside the lamp.",
  });
  s.obj({
    id: "fresh-candle", name: "Fresh Candle Stub", cat: "evidence", art: "candle-stub", box: on(fire, 0, 0.78, 28, 28), required: true,
    desc: "A candle stub on the mantel. The wax is still soft at the edge — it was burned within the last few days.",
    obs: ["Every other candle in the house is grey with dust."],
    ev: { id: "ev-fresh-candle", category: "environmental", significance: "Someone has been using the house after dark." },
    hint: "Look along the mantelpiece above the fireplace.",
  });
  s.obj({
    id: "gazette", name: "Wrenmoor Gazette", cat: "document", art: "newspaper", box: inside(chair, 0.5, 0.6, 62, 44), required: true,
    desc: "Tuesday's Gazette, folded open to page four.",
    doc: {
      title: "Wrenmoor Gazette — Tuesday 13 October",
      style: "newspaper",
      body: [
        "HOLLOWMERE FIRE: TWENTY YEARS ON",
        "Twenty years ago, on the night of 3 March, fire tore through the east wing of the Larkspur Institute. Its founder, Professor Elias Hollowmere, was declared lost in the blaze.",
        "The fire investigator, Mr. H. Finch, ruled the fire accidental. No remains were ever formally identified.",
        "Mr. Julian Reed, once the Professor's private secretary and today Curator of the Wrenmoor Museum, said: “Elias would want us to look forward, not back.”",
      ],
    },
    ev: { id: "ev-gazette", category: "document", significance: "The fire was ruled accidental by H. Finch; Elias's body was never identified." },
    hint: "A folded newspaper rests on the armchair.",
  });
  s.obj({
    id: "brass-key", name: "Brass Key", cat: "item", art: "key", box: floor(735, 522, 46, 18), item: "brass-key", required: true,
    desc: "A small brass key, dropped beside the armchair. The bow is stamped with a wren.",
    hint: "Something small glints on the floor by the armchair.",
  });
  s.obj({
    id: "desk-drawer", name: "Locked Desk Drawer", cat: "container", art: "drawer", box: inside(desk, 0.17, 0.28, 74, 41), tint: "#5a3a24", required: true,
    desc: "The top drawer of the desk. Its brass lock has a wren engraved above the keyhole.",
    lock: { kind: "item", item: "brass-key", lockedText: "The drawer is locked. A wren is engraved above the keyhole." },
    openText: "The brass key turns smoothly. Inside lies a page torn from a police notebook.",
    hint: "The left-hand desk drawer is locked.",
  });
  s.obj({
    id: "vance-page", name: "Torn Notebook Page", cat: "document", art: "note", box: on(desk, 0, 0.17, 40, 50), required: true, hiddenUntil: ["opened:desk-drawer"],
    desc: "A page torn from a pocket notebook, written in a quick, slanting hand.",
    doc: {
      title: "Notebook page — M. Vance",
      style: "handwritten",
      body: [
        "14 Oct. Hollowmere House. Back door forced years ago — but the study has been used. Fresh candles. Somebody keeps this place.",
        "Gazette says no body was ever formally identified. Then who did they bury?",
        "Library next. Mrs. Pell, the old housekeeper, mentioned letters signed “J.R.”",
      ],
      signature: "M.V.",
    },
    ev: { id: "ev-vance-page-1", category: "document", significance: "Vance doubted that Elias Hollowmere died in the fire.", related: ["ev-gazette"] },
  });
  s.obj({ id: "study-fireplace", name: "Cold Fireplace", cat: "environment", art: "fireplace", box: inside(fire, 0.5, 0.75, 100, 90), desc: "The grate is cold, but someone swept the hearth. The ash bucket is empty." });
  s.token("token-c1-01", on(shelf, 1, 0.82, 22, 22), "This one was tucked between two atlases.");

  return {
    n: 1, id: "c1-01", title: "The Empty Study", location: "Hollowmere House · Study", difficulty: 1,
    description: "Vance's trail begins in a study that should have been empty for twenty years.",
    briefing: "Inspector Margot Vance has not reported in for three days. Her last logged destination: Hollowmere House, empty since its owner died in a laboratory fire twenty years ago. Start where she would have started — the study.",
    objective: "Search the study for signs of Inspector Vance and open the locked desk drawer.",
    facts: ["Vance went missing on the night of 14 October.", "Hollowmere House has been shut since Professor Elias Hollowmere's death.", "Tap or click objects in the scene to inspect them."],
    scene: s.build(),
    summary: "Vance was here within the last few days. The Gazette marks twenty years since the Larkspur fire, and Vance's notes show she doubted that Elias Hollowmere ever died in it.",
    reveal: "Somebody has been keeping Hollowmere House. Vance thought it might be its dead owner.",
  };
}

/* ------------------------------------------------------------------ */
/* 2 · The Dusty Library                                                */
/* ------------------------------------------------------------------ */
function l02(): LevelSpec {
  const s = new SceneBuilder("scene-c1-02");
  s.area("library", "The Library", shell({ wall: "panels", floor: "boards", wallColor: "#2c3e3a", accent: "#4a2f1d", floorColor: "#4a2e1c", darkness: 0.4, lights: [{ x: 560, y: 300, r: 160 }, { x: 455, y: 150, r: 110, strength: 0.3 }] }));
  s.decor("rug", 330, 480, 400, 90, { tint: "#2c3e5c" });
  const shelfA = s.decor("bookshelf", 20, 60, 170, 380, { variant: "a" });
  s.decor("bookshelf", 190, 60, 170, 380, { variant: "bb" });
  const win = s.decor("window", 400, 70, 110, 170, { variant: "rain" });
  s.decor("bookshelf", 780, 60, 210, 380, { variant: "ccc" });
  s.decor("chandelier", 430, 0, 160, 100);
  const table = s.decor("table", 380, 340, 240, 130);
  s.place("lamp-desk", on(table, 0, 0.88, 46, 58));
  const cat = s.decor("card-catalog", 640, 316, 120, 124);
  s.place("globe", on(cat, 0, 0.5, 56, 76));
  const ladder = s.decor("ladder", 300, 110, 60, 340, { rotate: 4 });

  s.obj({
    id: "jr-letter", name: "Letter Signed J.R.", cat: "document", art: "book-open", box: on(table, 0, 0.35, 84, 46), required: true,
    desc: "A bound volume of Hollowmere correspondence lies open. A loose letter has been slipped between the pages.",
    doc: {
      title: "Letter tucked into “Collected Correspondence”",
      style: "handwritten",
      body: [
        "Elias —",
        "The buyers from the capital are patient. I am not. Sign the transfer of the collection and this ends quietly, between gentlemen.",
        "Burn this.",
      ],
      signature: "J.R.",
    },
    ev: { id: "ev-jr-letter", category: "document", significance: "J.R. pressured Elias to hand over the Hollowmere collection.", related: ["ev-gazette"] },
    hint: "A book lies open on the reading table.",
  });
  s.obj({
    id: "cid-pencil", name: "Police Pencil", cat: "evidence", art: "pen", tint: "#c9a040", box: floor(352, 476, 58, 12), required: true,
    desc: "A stub of pencil stamped WRENMOOR C.I.D. — police issue.",
    ev: { id: "ev-cid-pencil", category: "physical", significance: "A police officer searched the library." },
    hint: "Something fell at the foot of the ladder.",
  });
  s.obj({
    id: "handprint", name: "Handprint on the Pane", cat: "evidence", art: "fingerprint", box: inside(win, 0.32, 0.42, 30, 38), tint: "#dfe9ee", required: true,
    desc: "A small, gloved handprint on the inside of the dusty window. Someone leaned here to watch the drive.",
    ev: { id: "ev-handprint", category: "environmental", significance: "A small gloved hand touched the glass — recently, since the dust hasn't settled." },
    hint: "Look closely at the window glass.",
  });
  s.obj({
    id: "catalog-drawer", name: "Catalog Drawer “H”", cat: "container", art: "drawer", tint: "#6d4a2c", box: inside(cat, 0.4, 0.53, 30, 20), required: true,
    desc: "A card-catalog drawer labelled H. It slides out stiffly.",
    openText: "The drawer squeals open. One card has been pulled up so it stands proud of the rest.",
    hint: "The card catalog has a drawer marked with Hollowmere's initial.",
  });
  s.obj({
    id: "catalog-card", name: "Catalog Card", cat: "document", art: "card-calling", box: inside(cat, 0.4, 0.3, 42, 26), required: true, hiddenUntil: ["opened:catalog-drawer"],
    desc: "An index card, the typing faded.",
    doc: { title: "Card catalog — HOLLOWMERE, E.", style: "typed", body: ["HOLLOWMERE, E. — Private papers, laboratory notebooks, correspondence.", "REMOVED to the Family Archive (east attic), 4 March, by order of J. Reed, Secretary."] },
    ev: { id: "ev-catalog-card", category: "record", significance: "Julian Reed had Elias's papers moved the day after the fire.", related: ["ev-jr-letter"] },
  });
  s.obj({ id: "library-ladder", name: "Library Ladder", cat: "environment", art: "ladder", box: { x: ladder.x + 8, y: ladder.y + 20, w: 44, h: 200 }, desc: "The rungs are dusty except where a shoe has scuffed them — someone climbed to the top shelves." });
  s.token("token-c1-02", at(80, 38, 22, 22), "It sat on top of the bookcase, out of sight from the floor.");
  void shelfA;

  return {
    n: 2, id: "c1-02", title: "The Dusty Library", location: "Hollowmere House · Library", difficulty: 1,
    description: "Vance came looking for letters signed J.R.",
    briefing: "Vance's page sent her to the library in search of letters signed “J.R.” If she found them, there may be traces of her search — and of what she read.",
    objective: "Find signs of who searched the library, the J.R. letter, and Elias's catalog card. Then make your first deduction.",
    facts: ["Vance was in the study within the last few days.", "Mrs. Pell, the old housekeeper, mentioned letters signed J.R."],
    recall: ["ev-vance-page-1"],
    scene: s.build(),
    deductions: [
      {
        id: "d-who-searched",
        title: "The Library Searcher",
        question: "Who has been searching the library?",
        conclusions: [
          { id: "vance", text: "Inspector Vance, within the last few days" },
          { id: "burglar", text: "A burglar after the Hollowmere valuables" },
          { id: "nobody", text: "No one — the dust is decades old" },
        ],
        answer: "vance",
        evidence: ["ev-cid-pencil", "ev-handprint"],
        hint: "Police-issue stationery, and a small gloved hand in dust that hasn't resettled.",
        successText: "Vance searched these shelves within the last week. A police pencil and a fresh handprint don't lie.",
        wrongConclusionText: "A burglar wouldn't carry a C.I.D. pencil, and the dust has clearly been disturbed.",
      },
    ],
    summary: "Vance searched the library and found what she came for: a letter in which J.R. pressured Elias to sign over his collection, and a catalog card showing Julian Reed removed Elias's papers the day after the fire.",
    reveal: "J.R. — Julian Reed — wanted the Hollowmere collection, and he moved Elias's papers the morning after the fire.",
  };
}

/* ------------------------------------------------------------------ */
/* 3 · The Locked Bedroom                                               */
/* ------------------------------------------------------------------ */
function l03(): LevelSpec {
  const s = new SceneBuilder("scene-c1-03");
  s.area("bedroom", "Elias's Bedroom", shell({ wall: "stripes", floor: "carpet", wallColor: "#22304a", accent: "#8aa0c0", floorColor: "#3a2a3a", darkness: 0.45, lights: [{ x: 140, y: 170, r: 110, strength: 0.35 }, { x: 760, y: 280, r: 140 }] }));
  s.decor("rug", 240, 480, 420, 90, { tint: "#4a2f4f" });
  s.decor("window", 70, 80, 120, 170, { variant: "rain" });
  s.decor("curtain", 50, 64, 38, 220);
  s.decor("curtain", 172, 64, 38, 220, { flip: true });
  s.decor("portrait", 380, 104, 90, 115, { variant: "b", tint: "#4a3a5a" });
  const bed = s.decor("bed", 260, 320, 300, 170);
  const stand = s.decor("table", 570, 392, 84, 64);
  s.place("candelabra", on(stand, 0, 0.7, 30, 44), { variant: "off" });
  const dresser = s.decor("cabinet", 690, 320, 140, 150);
  s.decor("mirror", 726, 140, 70, 110);
  s.place("lamp-desk", on(dresser, 0, 0.82, 40, 50));
  const wardrobeBox = { x: 860, y: 160, w: 130, h: 300 };

  s.obj({
    id: "grand-clock", name: "Stopped Grandfather Clock", cat: "evidence", art: "clock-grand", variant: "h4m15", box: at(196, 190, 60, 250), required: true,
    desc: "The pendulum has been pinned still with a hairpin. The hands are frozen at 4:15 — not wound down, but stopped deliberately.",
    ev: { id: "ev-stopped-clock", category: "environmental", significance: "Someone stopped Elias's bedroom clock at 4:15 on purpose." },
    hint: "A tall clock stands silent beside the window.",
  });
  s.obj({
    id: "bedside-note", name: "Bedside Note", cat: "document", art: "note", box: on(stand, 0, 0.3, 30, 38), required: true,
    desc: "A folded note, propped against the candlestick.",
    doc: { title: "Note on the nightstand", style: "handwritten", body: ["My box opens to the hour this house fell silent."], signature: "E." },
    ev: { id: "ev-bedside-note", category: "document", significance: "The jewellery box code is the time the house 'fell silent'." },
    hint: "Check the nightstand beside the bed.",
  });
  s.obj({
    id: "jewelry-box", name: "Jewellery Box", cat: "puzzle", art: "jewelry-box", box: on(dresser, 0, 0.32, 54, 38),
    desc: "A lacquered box fitted with a three-digit combination lock.",
    lock: { kind: "puzzle", puzzle: "box-code" },
    item: "wardrobe-key",
    openText: "The lid lifts. Inside: a signet ring and a tiny key marked “W.”",
    hint: "The dressing table holds a locked jewellery box.",
  });
  s.obj({
    id: "signet-ring", name: "Signet Ring", cat: "evidence", art: "ring", box: on(dresser, 0, 0.58, 26, 26), required: true, hiddenUntil: ["opened:jewelry-box"],
    desc: "A heavy gold signet ring. Its face shows a tiny orrery — rings around a sun.",
    ev: { id: "ev-signet-ring", category: "physical", significance: "Elias's personal emblem was an orrery." },
  });
  s.obj({
    id: "wardrobe", name: "Locked Wardrobe", cat: "container", art: "wardrobe", box: wardrobeBox, required: true,
    desc: "A tall mahogany wardrobe with a small brass keyhole.",
    lock: { kind: "item", item: "wardrobe-key", lockedText: "The wardrobe is locked. The keyhole is tiny." },
    openText: "The doors swing open on the smell of smoke.",
    hint: "The wardrobe on the right is locked.",
  });
  s.obj({
    id: "scorched-coat", name: "Scorched Lab Coat", cat: "evidence", art: "coat", variant: "scorched", tint: "#d8d0bc", box: inside(wardrobeBox, 0.5, 0.48, 70, 120), required: true, hiddenUntil: ["opened:wardrobe"],
    desc: "A Larkspur lab coat, its cuffs and hem scorched black. The name tape reads E. HOLLOWMERE. It was hung up carefully — after the fire.",
    ev: { id: "ev-scorched-coat", category: "physical", significance: "Elias's lab coat came home from the fire and was hung up — he may have survived." },
  });
  s.obj({
    id: "hatpin", name: "Silver Hatpin", cat: "evidence", art: "pen", tint: "#c8c8c8", box: floor(500, 528, 44, 10),
    desc: "A silver hatpin with a jet bead — a modern style. Vance wears hats.",
    ev: { id: "ev-hatpin", category: "physical", significance: "Vance probably searched the bedroom too." },
  });
  s.token("token-c1-03", floor(330, 498, 22, 22), "It had rolled under the bed.");
  void bed;

  return {
    n: 3, id: "c1-03", title: "The Locked Bedroom", location: "Hollowmere House · Master Bedroom", difficulty: 1,
    description: "A stopped clock, a coded note and a wardrobe that smells of smoke.",
    briefing: "Elias Hollowmere's bedroom was sealed after his death. The seal is broken. Vance's notes suggest she believed Elias never came home — the room may say otherwise.",
    objective: "Find the clue to the jewellery box combination, open it, and see what Elias kept locked away.",
    facts: ["Code locks open when you enter the right digits. The clue is always somewhere you can find it."],
    recall: ["ev-vance-page-1", "ev-gazette"],
    scene: s.build(),
    puzzles: [
      {
        id: "box-code", kind: "code", title: "Jewellery Box Lock", charset: "digits", answer: "415",
        prompt: "Three brass dials, each numbered 0–9.",
        clueRefs: ["bedside-note", "grand-clock"],
        hint: "Elias's note mentions the hour the house fell silent. Which clock in this room has fallen silent?",
        successText: "4 — 1 — 5. The lock clicks open.",
      },
    ],
    summary: "Elias's jewellery box opened to the time his clock was stopped. Inside was the key to his wardrobe — where a lab coat scorched in the Larkspur fire had been hung up afterwards.",
    reveal: "The coat Elias wore in the fire came home. Someone survived that night and stood in this room.",
  };
}

/* ------------------------------------------------------------------ */
/* 4 · The Forgotten Hallway                                            */
/* ------------------------------------------------------------------ */
function l04(): LevelSpec {
  const s = new SceneBuilder("scene-c1-04");
  s.area("hallway", "The East Hallway", shell({ wall: "panels", floor: "carpet", wallColor: "#2f3a2c", accent: "#4a2f1d", floorColor: "#4a1f26", darkness: 0.5, lights: [{ x: 260, y: 300, r: 150 }, { x: 400, y: 70, r: 110, strength: 0.35 }] }));
  s.decor("rug-rect", 120, 470, 620, 90, { tint: "#5a2430" });
  s.decor("door", 50, 230, 90, 210);
  s.decor("portrait", 190, 112, 80, 100, { tint: "#2a3a4a" });
  s.decor("portrait", 330, 100, 90, 115, { variant: "b" });
  s.decor("portrait", 640, 112, 80, 100, { tint: "#4a2a2a" });
  s.decor("door", 500, 230, 90, 210);
  s.decor("door", 860, 230, 90, 210);
  s.decor("chandelier", 330, 0, 140, 90);
  const side = s.decor("table", 190, 360, 170, 90);
  s.place("lamp-desk", on(side, 0, 0.8, 40, 50));
  s.decor("coat-rack", 410, 250, 70, 210);
  const coat = s.decor("coat", 404, 262, 62, 120, { tint: "#3a3a30" });
  s.decor("umbrella", 474, 384, 24, 72);

  s.obj({
    id: "lantern", name: "Hurricane Lantern", cat: "item", art: "lantern", variant: "off", box: on(side, 0, 0.32, 34, 56), item: "oil-lantern", required: true,
    desc: "A hurricane lantern, still half full of oil. The wick is dry.",
    hint: "There's a lantern on the side table.",
  });
  s.obj({
    id: "matchbook", name: "Matchbook in a Coat Pocket", cat: "evidence", art: "matchbook", box: inside(coat, 0.6, 0.62, 26, 20), item: "matches", required: true,
    desc: "In the pocket of a coat on the rack: a matchbook from Café Lune, Harbour Street. The coat is a man's, but the matchbook is new.",
    ev: { id: "ev-cafe-matchbook", category: "physical", significance: "Someone who visits Café Lune hung a coat in Hollowmere House." },
    hint: "Check the pockets of the coat on the rack.",
  });
  s.obj({
    id: "dark-alcove", name: "Dark End of the Hall", cat: "mechanism", art: "shadow", box: at(690, 50, 400, 600), hit: { kind: "rect", x: 760, y: 150, w: 240, h: 420 },
    desc: "The far end of the hallway is pitch black. The bulbs have long since failed.",
    lock: { kind: "item", item: "lit-lantern", consumes: false, lockedText: "It's too dark to see anything down there. You need a light." },
    openArt: "light-beam",
    openText: "Lantern light pushes back the dark. There are footprints on the boards.",
    hint: "The far right of the hallway is too dark to search.",
  });
  s.obj({
    id: "footprints", name: "Muddy Footprints", cat: "evidence", art: "footprint", box: floor(860, 572, 64, 34), required: true, hiddenUntil: ["opened:dark-alcove"],
    desc: "Muddy prints — a small shoe with a narrow heel — leading to the cellar door and back again.",
    ev: { id: "ev-footprints", category: "environmental", significance: "Vance went down to the cellar." },
  });
  s.obj({
    id: "basement-key", name: "Cellar Key", cat: "item", art: "key-ornate", box: floor(930, 476, 52, 20), item: "basement-key", required: true, hiddenUntil: ["opened:dark-alcove"],
    desc: "An iron key tagged “CELLAR,” left on the floor by the cellar door.",
  });
  s.obj({ id: "family-portrait", name: "Portrait of Mrs. Hollowmere", cat: "environment", art: "portrait", variant: "b", box: at(330, 100, 90, 115), desc: "Eleanor Hollowmere, Elias's late wife. The brass plate is polished — recently." });
  s.token("token-c1-04", at(392, 74, 18, 18), "It hung from the chandelier on a thread.");

  return {
    n: 4, id: "c1-04", title: "The Forgotten Hallway", location: "Hollowmere House · East Hallway", difficulty: 1,
    description: "A hallway too dark to search — unless you can make light.",
    briefing: "The east hallway leads toward the cellar. Its lights died years ago. Whatever Vance found down there, she had to cross this dark first.",
    objective: "Make a light, search the dark end of the hallway and find the way to the cellar.",
    facts: ["You can combine two inventory items: select one, then choose “Combine” and pick the other."],
    recall: ["ev-vance-page-1"],
    scene: s.build(),
    recipes: [{ id: "light-lantern", inputs: ["oil-lantern", "matches"], output: "lit-lantern", text: "Light the lantern with a Café Lune match. The wick takes at once." }],
    summary: "With the lantern lit, the dark end of the hall gave up its secrets: a small woman's footprints leading to the cellar, and the cellar key she left behind.",
    reveal: "Vance went down to the cellar. And a man who drinks at Café Lune hangs his coat in a house that's supposed to be empty.",
  };
}

/* ------------------------------------------------------------------ */
/* 5 · The Sealed Basement                                              */
/* ------------------------------------------------------------------ */
function l05(): LevelSpec {
  const s = new SceneBuilder("scene-c1-05");
  s.area("stairs", "Cellar Stairs", shell({ wall: "stone", floor: "stone", wallColor: "#5a544c", accent: "#3a3530", floorColor: "#3e3a34", darkness: 0.55, lights: [{ x: 735, y: 220, r: 120 }] }));
  s.decor("staircase", 0, 190, 300, 250, { flip: true });
  s.decor("lantern", 720, 196, 30, 50);
  s.decor("pipes", 0, 20, 1000, 40);
  const door = { x: 580, y: 230, w: 100, h: 210 };
  s.obj({
    id: "cellar-door", name: "Cellar Door", cat: "exit", art: "door", tint: "#3a2618", box: door, exitTo: "cellar", required: true,
    desc: "A heavy oak door bound in iron. Fresh scratches around the keyhole.",
    lock: { kind: "item", item: "basement-key", lockedText: "Locked. The keyhole is large and old-fashioned." },
    openText: "The cellar key turns with a groan.",
    hint: "The cellar door needs the key you found in the hallway.",
  });
  s.obj({ id: "raincoat", name: "Old Raincoat", cat: "environment", art: "coat", tint: "#4a4a3a", box: at(430, 226, 54, 100), desc: "A heavy raincoat on a hook, stiff with age. Elias's size, by the look of it." });
  s.obj({ id: "light-switch", name: "Light Switch", cat: "environment", art: "switch", box: at(740, 280, 24, 36), desc: "Click. Nothing. The cellar has had no power in years." });

  s.area("cellar", "The Cellar", shell({ wall: "stone", floor: "stone", wallColor: "#4a4540", accent: "#2a2520", floorColor: "#36322c", darkness: 0.7, lights: [{ x: 160, y: 300, r: 130, strength: 0.3 }] }), { flags: ["opened:cellar-door"], message: "The cellar door is locked." });
  s.decor("pipes", 0, 40, 1000, 50);
  const shelves = s.decor("shelves-metal", 30, 230, 210, 220, { tint: "#6a5040", variant: "cellar" });
  const barrel = s.decor("barrel", 270, 370, 72, 92);
  s.decor("barrel", 340, 382, 72, 92);
  s.decor("stove", 470, 300, 110, 150);
  s.decor("wine-rack", 600, 230, 120, 210);
  s.decor("crate", 700, 380, 90, 76);
  const crateBox = { x: 820, y: 360, w: 130, h: 110 };
  s.obj({
    id: "flashlight", name: "Police Flashlight", cat: "item", art: "flashlight", box: on(shelves, 1, 0.35, 58, 22), item: "flashlight-empty", required: true,
    desc: "A police-issue flashlight, standard C.I.D. pattern. The battery is missing.",
    hint: "Check the shelves on the left.",
  });
  s.obj({
    id: "toolbox", name: "Toolbox", cat: "container", art: "toolbox", box: on(shelves, 2, 0.62, 66, 40), required: true,
    desc: "A red metal toolbox. The catch isn't locked.",
    openText: "Inside, among rusted spanners, is a battery still in its paper wrapper.",
  });
  s.obj({ id: "battery", name: "Battery", cat: "item", art: "battery", box: on(shelves, 2, 0.22, 40, 20), item: "battery", required: true, hiddenUntil: ["opened:toolbox"], desc: "A fresh battery. Someone brought it here recently." });
  s.obj({ id: "crowbar", name: "Crowbar", cat: "item", art: "crowbar", box: on(barrel, 0, 0.5, 92, 22), item: "crowbar", required: true, desc: "A heavy crowbar resting on a barrel lid." });
  s.obj({
    id: "dark-corner", name: "Unlit Corner", cat: "mechanism", art: "shadow", box: at(640, 150, 440, 520), hit: { kind: "rect", x: 760, y: 240, w: 240, h: 330 },
    desc: "The far corner swallows the light completely.",
    lock: { kind: "item", item: "flashlight", consumes: false, lockedText: "Too dark. You'll need a proper light to search there." },
    openArt: "light-beam",
    openText: "The beam finds a crate stencilled LARKSPUR — and a handkerchief on the floor.",
    hint: "Something is hidden in the dark right-hand corner.",
  });
  s.obj({
    id: "vance-hanky", name: "Monogrammed Handkerchief", cat: "evidence", art: "handkerchief", box: floor(760, 540, 48, 34), required: true, hiddenUntil: ["opened:dark-corner"],
    desc: "A white handkerchief embroidered M.V. A smear of grey dust across it, as if used to wipe a label.",
    ev: { id: "ev-vance-hanky", category: "physical", significance: "Vance wiped dust from something in the cellar." },
  });
  s.obj({
    id: "lab-crate", name: "Stencilled Crate", cat: "container", art: "crate", variant: "stamp", box: crateBox, required: true, hiddenUntil: ["opened:dark-corner"],
    desc: "A packing crate. The stencil, wiped clean, reads: LARKSPUR INSTITUTE — EAST WING — 3 MARCH. The lid is nailed shut.",
    lock: { kind: "item", item: "crowbar", consumes: false, lockedText: "The lid is nailed down tight. You need leverage." },
    openText: "The nails screech free. Inside are scorched laboratory notebooks.",
  });
  s.obj({
    id: "lab-notebooks", name: "Scorched Lab Notebooks", cat: "evidence", art: "journal", tint: "#2a2018", box: inside(crateBox, 0.5, -0.18, 64, 44), required: true, hiddenUntil: ["opened:lab-crate"],
    desc: "Laboratory notebooks from the burned east wing, edges charred. Someone carried them out of the fire and hid them here.",
    obs: ["The last entry is dated 3 March, 11:15 p.m. — less than an hour before the alarm was raised."],
    ev: { id: "ev-larkspur-crate", category: "physical", significance: "The east-wing notebooks were rescued from the fire and hidden at the house.", related: ["ev-scorched-coat"] },
  });
  s.token("token-c1-05", on(barrel, 0, 0.15, 20, 20), "It was resting on the barrel beside the crowbar.");

  return {
    n: 5, id: "c1-05", title: "The Sealed Basement", location: "Hollowmere House · Cellar", difficulty: 2,
    description: "Footprints lead down into the dark. You'll need more than a lantern.",
    briefing: "Vance's footprints led to the cellar. The key she dropped opens the door — but the cellar has had no power for twenty years.",
    objective: "Unlock the cellar, make a working light, and find out what Vance uncovered in the dark corner.",
    facts: ["You carry the cellar key from the hallway.", "Rooms are listed in tabs above the scene once you can reach them."],
    recall: ["ev-footprints"],
    carry: [{ item: "basement-key", from: "c1-04" }],
    scene: s.build(),
    recipes: [{ id: "load-flashlight", inputs: ["flashlight-empty", "battery"], output: "flashlight", text: "Load the battery into the flashlight. The beam is strong and steady." }],
    summary: "In the dark corner of the cellar, beside Vance's handkerchief, stood a crate from Larkspur's burned east wing. The laboratory notebooks inside were rescued from the fire — and hidden here.",
    reveal: "Someone carried Elias's notebooks out of the fire. Vance found them first.",
  };
}

/* ------------------------------------------------------------------ */
/* 6 · The Conservatory                                                 */
/* ------------------------------------------------------------------ */
function l06(): LevelSpec {
  const s = new SceneBuilder("scene-c1-06");
  s.area("conservatory", "The Conservatory", shell({ kind: "exterior", wall: "glass", floor: "tiles", wallColor: "#9fc3d1", accent: "#2a3328", floorColor: "#7a4a30", sky: "night", weather: "rain", darkness: 0.35, lights: [{ x: 500, y: 330, r: 160, strength: 0.4 }] }));
  s.decor("glass-roof", 0, 0, 1000, 120, { tint: "#2a3328" });
  s.decor("vines", 0, 60, 130, 320);
  s.decor("vines", 880, 60, 130, 320, { flip: true });
  const planterL = s.decor("planter-box", 40, 380, 300, 100);
  const planterR = s.decor("planter-box", 660, 380, 300, 100);
  s.decor("plant", 360, 300, 80, 140);
  s.decor("plant", 580, 290, 90, 150, { tint: "#4f7a46" });
  s.decor("pipes", 300, 244, 400, 30, { tint: "#6a5a4a" });
  const bench = s.decor("workbench", 400, 370, 200, 90, { tint: "#6d4a2c" });
  s.place("pots", on(bench, 0, 0.62, 60, 40));

  s.obj({
    id: "gardener-note", name: "Gardener's Note", cat: "document", art: "note", box: on(bench, 0, 0.25, 34, 42), required: true,
    desc: "A note weighted under a flowerpot, in old-fashioned copperplate.",
    doc: { title: "Note on the potting bench", style: "handwritten", body: ["Water them as she taught me: first the lily, then the rose, and the fern last of all. Never the moss."], signature: "E." },
    ev: { id: "ev-gardener-note", category: "document", significance: "The order for the irrigation valves: lily, rose, fern." },
    hint: "There's a note on the potting bench.",
  });
  s.obj({
    id: "irrigation-valves", name: "Irrigation Valves", cat: "puzzle", art: "valves", box: at(440, 196, 120, 60),
    desc: "Four valve wheels on the old irrigation pipe — lily, rose, fern and moss, by their painted tags. Opening them in the wrong order jams the drain.",
    lock: { kind: "puzzle", puzzle: "valve-order" },
    openText: "Water gurgles away beneath the floor and a drain cover lifts on its hinge.",
    hint: "The valves on the pipe above the bench must be turned in the right order.",
  });
  s.obj({
    id: "planting-log", name: "Hidden Planting Log", cat: "document", art: "journal", tint: "#3f5d3a", box: floor(520, 548, 52, 64), required: true, hiddenUntil: ["opened:irrigation-valves"],
    desc: "A waterproofed planting log, wedged beneath the drain cover.",
    doc: {
      title: "Planting log — Hollowmere conservatory",
      style: "handwritten",
      body: [
        "2 April — The midnight lilies took. Their sap still reveals the ink.",
        "9 May — H. says the tunnel holds and no one has asked questions. I must not stay much longer.",
        "June — Leaving the garden to Agnes. If anyone reads this: I am not dead, only hidden.",
      ],
      signature: "E.H.",
    },
    ev: { id: "ev-planting-log", category: "document", significance: "Entries in Elias's hand dated months after the fire.", related: ["ev-scorched-coat"] },
  });
  s.obj({
    id: "vance-umbrella", name: "Damp Umbrella", cat: "evidence", art: "umbrella", box: at(348, 384, 26, 72), rotate: 10, required: true,
    desc: "A black umbrella leaning on the planter, monogrammed M.V. on the handle. Still damp at the hinge.",
    ev: { id: "ev-vance-umbrella", category: "physical", significance: "Vance came through the conservatory in the rain." },
    hint: "Something leans against the left planter.",
  });
  s.obj({
    id: "midnight-lily", name: "Midnight Lily", cat: "evidence", art: "rose", tint: "#e8e0f0", box: on(planterR, 0, 0.32, 26, 54),
    desc: "A pale lily that only opens after dark. A label reads: “Reagent stock — do not cut.”",
    ev: { id: "ev-midnight-lily", category: "physical", significance: "Elias grew a plant whose sap reveals hidden ink." },
  });
  s.token("token-c1-06", on(planterL, 0, 0.72, 22, 22), "It was half-buried in the planter soil.");

  return {
    n: 6, id: "c1-06", title: "The Conservatory", location: "Hollowmere House · Conservatory", difficulty: 2,
    description: "Rain on glass, a gardener's rule, and a log that should not exist.",
    briefing: "Elias grew rare plants for his experiments. Mrs. Pell kept the conservatory after he died — or after he was declared dead. Vance came this way in the rain.",
    objective: "Work out the gardener's watering order, open the hidden drain and recover what's beneath it.",
    facts: ["Sequence mechanisms need actions in a specific order. Look for written instructions."],
    recall: ["ev-scorched-coat"],
    scene: s.build(),
    puzzles: [
      {
        id: "valve-order", kind: "sequence", title: "Irrigation Valves",
        prompt: "Turn the valves in the correct order.",
        symbols: [
          { id: "rose", label: "Rose" },
          { id: "fern", label: "Fern" },
          { id: "moss", label: "Moss" },
          { id: "lily", label: "Lily" },
        ],
        answer: ["lily", "rose", "fern"],
        clueRefs: ["gardener-note"],
        hint: "The gardener's note gives the order — and tells you which valve never to touch.",
        successText: "Lily, rose, fern. The drain gurgles and the cover lifts.",
      },
    ],
    summary: "The irrigation valves opened a hiding place under the conservatory floor. Elias's planting log continues for months after the fire, ending: “I am not dead, only hidden.”",
    reveal: "Elias Hollowmere survived the fire. “H.” helped him hide.",
  };
}

/* ------------------------------------------------------------------ */
/* 7 · The Portrait Gallery                                             */
/* ------------------------------------------------------------------ */
function l07(): LevelSpec {
  const s = new SceneBuilder("scene-c1-07");
  s.area("gallery", "The Portrait Gallery", shell({ wall: "stripes", floor: "checker", wallColor: "#34402f", accent: "#c9b48a", floorColor: "#d8d0bc", darkness: 0.4, lights: [{ x: 300, y: 160, r: 120, strength: 0.35 }, { x: 760, y: 160, r: 120, strength: 0.35 }] }));
  const p1 = s.decor("portrait", 60, 100, 90, 115, { tint: "#2a3a4a" });
  s.decor("portrait", 200, 100, 90, 115, { variant: "empty" });
  s.decor("portrait", 340, 100, 90, 115, { variant: "b", tint: "#4a2a3a" });
  s.decor("painting", 590, 110, 130, 100);
  s.decor("portrait", 760, 100, 90, 115, { tint: "#3a2a2a" });
  s.decor("portrait", 890, 100, 90, 115, { variant: "b", tint: "#2a2a3a" });
  s.decor("spotlight", 220, 0, 180, 460);
  s.decor("rope", 60, 404, 330, 50);
  const statue = s.decor("statue", 500, 210, 76, 250);
  const bench = s.decor("bench", 650, 404, 210, 76, { tint: "#4a2f1d" });

  s.obj({ id: "elias-portrait", name: "Portrait of Elias Hollowmere", cat: "environment", art: "portrait", tint: "#2a3a4a", box: { x: p1.x, y: p1.y, w: 70, h: 80 }, desc: "Professor Elias Hollowmere, painted in his fifties. A ring with an orrery emblem on his hand." });
  s.obj({
    id: "frag-a", name: "Photo Fragment", cat: "item", art: "photo-torn", box: inside(p1, 0.86, 0.92, 30, 32), item: "photo-frag-a", required: true,
    desc: "A torn corner of a photograph tucked into the portrait frame: a man in a grey coat.",
    hint: "Something is tucked into the corner of a frame on the far left.",
  });
  s.obj({
    id: "frag-b", name: "Photo Fragment", cat: "item", art: "photo-torn", box: floor(700, 492, 30, 32), rotate: -20, item: "photo-frag-b", required: true,
    desc: "The middle of a torn photograph, kicked under the bench: a woman in a lab coat.",
    hint: "Look beneath the bench.",
  });
  s.obj({
    id: "frag-c", name: "Photo Fragment", cat: "item", art: "photo-torn", box: inside(statue, 0.5, 0.9, 30, 32), flip: true, item: "photo-frag-c", required: true,
    desc: "A torn piece of a photograph wedged under the statue's base: a man in a hat.",
    hint: "Check the base of the statue.",
  });
  s.obj({
    id: "reed-plaque", name: "Plaque Beneath an Empty Frame", cat: "evidence", art: "plaque", box: at(205, 224, 80, 26), required: true,
    desc: "A pale rectangle on the wallpaper where a portrait once hung. The brass plaque remains: JULIAN REED, PRIVATE SECRETARY.",
    obs: ["The nail is bright — the portrait was taken down recently, not years ago."],
    ev: { id: "ev-reed-plaque", category: "environmental", significance: "Someone recently removed Julian Reed's portrait from the gallery." },
    hint: "One frame on the wall is missing its portrait.",
  });
  s.obj({
    id: "restoration-easel", name: "Restorer's Easel", cat: "puzzle", art: "easel", box: at(390, 290, 90, 170),
    desc: "A restorer's easel with a glass plate — perfect for laying out torn pieces.",
    requires: { flags: ["combined:photo-2"], message: "You'll need all the photograph pieces before you can lay them out." },
    lock: { kind: "puzzle", puzzle: "trio-reconstruct" },
    hint: "Lay the photograph pieces out on the easel.",
  });
  s.token("token-c1-07", on(bench, 0, 0.75, 20, 20), "It sat on the bench seat.");

  return {
    n: 7, id: "c1-07", title: "The Portrait Gallery", location: "Hollowmere House · Portrait Gallery", difficulty: 2,
    description: "A torn photograph, scattered across the gallery — and one face missing from the walls.",
    briefing: "Someone tore a photograph into three pieces and hid them in the gallery. Someone else took down a portrait. In a house full of faces, find the ones that were meant to disappear.",
    objective: "Gather and combine the photograph pieces, reconstruct the picture, and find the missing portrait.",
    facts: ["Reconstruction puzzles: swap tiles until the picture is restored."],
    recall: ["ev-jr-letter", "ev-catalog-card"],
    scene: s.build(),
    recipes: [
      { id: "photo-1", inputs: ["photo-frag-a", "photo-frag-b"], output: "photo-ab", text: "Match the left and middle pieces along the tear." },
      { id: "photo-2", inputs: ["photo-ab", "photo-frag-c"], output: "photo-set", text: "Add the final piece. Now lay them out properly." },
    ],
    puzzles: [
      {
        id: "trio-reconstruct", kind: "reconstruct", title: "The Torn Photograph", picture: "trio", cols: 3, rows: 2, start: [4, 0, 5, 2, 1, 3],
        prompt: "Swap the pieces until the photograph is whole.",
        clueRefs: ["frag-a", "frag-b", "frag-c"],
        hint: "Start with the lettering along the top edge, then match the figures' coats.",
        successText: "The photograph is whole: three colleagues outside the Larkspur Institute.",
        reward: {
          evidence: {
            id: "ev-trio-photo", name: "Photograph: Three Colleagues", category: "photograph",
            description: "Elias Hollowmere, Dr. Helena Crane and Julian Reed outside the Larkspur Institute on opening day. Reed wears a cufflink engraved J.R.",
            significance: "Links Elias, Helena Crane and Julian Reed to the Larkspur Institute.",
            related: ["ev-jr-letter", "ev-reed-plaque"],
          },
        },
      },
    ],
    summary: "The torn photograph shows Elias Hollowmere, Dr. Helena Crane and Julian Reed outside the Larkspur Institute. Reed's own portrait was recently removed from the gallery.",
    reveal: "Three people stood at the start of Larkspur. One of them doesn't want to be remembered here.",
  };
}

/* ------------------------------------------------------------------ */
/* 8 · The Servants' Quarters                                           */
/* ------------------------------------------------------------------ */
function l08(): LevelSpec {
  const s = new SceneBuilder("scene-c1-08");
  s.area("quarters", "Servants' Quarters", shell({ wall: "plaster", floor: "boards", wallColor: "#6a5e4e", accent: "#3a2a1a", floorColor: "#5a4a36", darkness: 0.45, lights: [{ x: 520, y: 300, r: 150 }, { x: 800, y: 380, r: 110, strength: 0.35, color: "#f39a3c" }] }));
  s.decor("bed", 30, 340, 230, 130, { tint: "#5a4a36" });
  s.decor("window", 300, 96, 90, 130);
  const shelf = s.decor("shelf-wall", 440, 200, 220, 26);
  s.place("bottle", on(shelf, 0, 0.12, 18, 50));
  s.place("teacup", on(shelf, 0, 0.55, 34, 22));
  const table = s.decor("table", 420, 360, 240, 100);
  s.place("candelabra", on(table, 0, 0.9, 30, 44));
  s.decor("chair", 670, 350, 64, 110);
  const stove = s.decor("stove", 780, 300, 110, 150, { variant: "lit" });
  s.decor("rug", 300, 490, 340, 70, { tint: "#5a3a2a" });

  s.obj({
    id: "coded-diary", name: "Mrs. Pell's Diary", cat: "document", art: "journal", tint: "#5a2a2a", box: on(table, 0, 0.28, 44, 54), required: true,
    desc: "A housekeeper's diary. Most entries are plain — menus, linen — but one is written in nonsense letters.",
    doc: { title: "Diary of Agnes Pell — 5 March", style: "handwritten", body: ["Coal 2 cwt. Linen to the laundry.", "WKH PDVWHU OLYHV", "Say nothing. Burn the coat."], signature: "A.P." },
    ev: { id: "ev-pell-diary", category: "document", significance: "Agnes Pell wrote a coded line two days after the fire." },
    hint: "A diary lies on the table.",
  });
  s.obj({
    id: "pell-rule", name: "Recipe Card", cat: "document", art: "note", box: on(shelf, 0, 0.85, 34, 40), required: true,
    desc: "A recipe card propped on the shelf. Below the recipe for seed cake, a line in the same hand as the diary.",
    doc: { title: "Recipe card", style: "handwritten", body: ["Seed cake: 8 oz flour, 6 oz butter, caraway to taste.", "Mrs. Pell's rule for the private book: every letter three steps on."] },
    ev: { id: "ev-pell-rule", category: "document", significance: "Mrs. Pell's cipher: each letter is shifted three steps on." },
    hint: "There's a card on the wall shelf.",
  });
  s.obj({
    id: "cipher-wheel", name: "Cipher Wheel", cat: "puzzle", art: "cipher-wheel", box: on(table, 0, 0.62, 44, 44),
    desc: "A brass cipher wheel, the kind sold for children's codes. Mrs. Pell used it for something more serious.",
    lock: { kind: "puzzle", puzzle: "pell-cipher" },
    hint: "Use the cipher wheel on the table to decode the diary.",
  });
  s.obj({ id: "bell-board", name: "Service Bell Board", cat: "environment", art: "notice-board", box: at(110, 160, 120, 90), desc: "The bell board: Study, Library, Bedroom, Gallery, Conservatory. The Study bell's spring is newer than the rest." });
  s.obj({
    id: "pell-photo", name: "Photograph of Agnes Pell", cat: "evidence", art: "photo", box: on(shelf, 0, 0.35, 44, 34),
    desc: "Agnes Pell in her housekeeper's black, standing beside a younger Elias in the conservatory.",
    ev: { id: "ev-pell-photo", category: "photograph", significance: "Agnes Pell was devoted to Elias." },
  });
  s.token("token-c1-08", on(stove, 0, 0.3, 20, 20), "It was warming on top of the stove.");

  return {
    n: 8, id: "c1-08", title: "The Servants' Quarters", location: "Hollowmere House · Servants' Quarters", difficulty: 2,
    description: "The housekeeper kept house — and a secret, in code.",
    briefing: "Agnes Pell kept Hollowmere House for thirty years. Vance spoke to her before she disappeared. Pell's old rooms may explain why the stove here is still warm.",
    objective: "Decode Mrs. Pell's diary and draw a conclusion about what the household knew.",
    facts: ["Cipher puzzles: find the rule, then shift each letter to reveal the message."],
    recall: ["ev-scorched-coat", "ev-planting-log"],
    scene: s.build(),
    puzzles: [
      {
        id: "pell-cipher", kind: "cipher", title: "Mrs. Pell's Code", cipherText: caesar("THE MASTER LIVES", 3), shift: 3, answer: "THE MASTER LIVES",
        prompt: "Decode the coded line from the diary.",
        clueRefs: ["coded-diary", "pell-rule"],
        hint: "The recipe card says every letter was moved three steps on. Move each letter three steps back.",
        successText: "WKH PDVWHU OLYHV — “THE MASTER LIVES.”",
        reward: { evidence: { id: "ev-pell-decoded", name: "Decoded Diary Entry", category: "document", description: "Agnes Pell, 5 March: “THE MASTER LIVES. Say nothing. Burn the coat.”", significance: "The housekeeper knew Elias survived the fire.", related: ["ev-pell-diary"] } },
      },
    ],
    deductions: [
      {
        id: "d-household", title: "What the House Knew",
        question: "What happened to Elias Hollowmere on the night of the fire?",
        conclusions: [
          { id: "survived", text: "He survived and was hidden by people he trusted" },
          { id: "died", text: "He died in the fire, as the report says" },
          { id: "pell", text: "Agnes Pell started the fire" },
        ],
        answer: "survived",
        evidence: ["ev-pell-decoded", "ev-scorched-coat", "ev-planting-log"],
        requires: ["solved:pell-cipher"],
        hint: "You've seen his coat, his handwriting after the fire, and now the housekeeper's secret. Your notebook keeps evidence from earlier rooms.",
        successText: "Elias survived. His coat came home, he kept writing for months, and Agnes Pell knew it. The official story is a lie.",
        wrongConclusionText: "That conclusion ignores the coat, the later log entries and Mrs. Pell's message.",
      },
    ],
    summary: "Mrs. Pell's coded diary reads “THE MASTER LIVES.” With Elias's scorched coat and his later planting log, it's certain: Elias Hollowmere survived the Larkspur fire and went into hiding.",
    reveal: "The household covered for Elias. The question is who he was hiding from.",
  };
}

/* ------------------------------------------------------------------ */
/* 9 · The Hidden Workshop                                              */
/* ------------------------------------------------------------------ */
function l09(): LevelSpec {
  const s = new SceneBuilder("scene-c1-09");
  s.area("workshop", "The Hidden Workshop", shell({ wall: "planks", floor: "concrete", wallColor: "#5a4632", accent: "#8a6a44", floorColor: "#4a4540", darkness: 0.4, lights: [{ x: 430, y: 290, r: 160 }, { x: 790, y: 300, r: 120, strength: 0.35 }] }));
  const shelves = s.decor("shelves-metal", 30, 200, 200, 250, { tint: "#6a5040" });
  s.decor("toolboard", 300, 140, 220, 140);
  const bench = s.decor("workbench", 260, 330, 360, 140);
  s.place("lamp-desk", on(bench, 0, 0.12, 46, 58));
  s.place("microscope", on(bench, 0, 0.4, 40, 60));
  s.decor("blackboard", 640, 90, 200, 120);
  s.decor("crate", 640, 400, 90, 76);
  s.decor("pipes", 0, 40, 1000, 30, { tint: "#6a5a4a" });

  s.obj({ id: "brass-gear", name: "Large Brass Gear", cat: "item", art: "gear", box: on(shelves, 1, 0.3, 38, 38), item: "brass-gear", required: true, desc: "A brass gear on the shelf, teeth freshly oiled.", hint: "A brass gear sits on the metal shelving." });
  s.obj({ id: "bench-drawer", name: "Workbench Drawer", cat: "container", art: "drawer", tint: "#7a5a34", box: inside(bench, 0.76, 0.5, 72, 30), required: true, desc: "A shallow drawer under the workbench.", openText: "The drawer holds watchmaker's tools and a small steel gear." });
  s.obj({ id: "small-gear", name: "Small Steel Gear", cat: "item", art: "gear", tint: "#9aa3ae", box: on(bench, 0, 0.78, 28, 28), item: "small-gear", required: true, hiddenUntil: ["opened:bench-drawer"], desc: "A small gear with a square axle hole." });
  s.obj({
    id: "wall-clockwork", name: "Wall Clockwork", cat: "mechanism", art: "gear", box: at(700, 250, 120, 120),
    desc: "A clockwork mechanism set into the wall. Two gears are missing from its train.",
    lock: { kind: "item", item: "gear-assembly", lockedText: "Two gears are missing from the train. You'd need both, pinned together." },
    openText: "The gears mesh, the train turns, and a slot opens beneath the clockwork.",
    hint: "The clockwork on the wall is missing parts.",
  });
  s.obj({
    id: "orrery-sketch", name: "Orrery Blueprint", cat: "document", art: "blueprint", box: at(728, 378, 70, 52), required: true, hiddenUntil: ["opened:wall-clockwork"],
    desc: "A blueprint slid from the slot below the clockwork, signed E.H.",
    doc: {
      title: "Blueprint — “The Orrery”",
      style: "typed",
      body: [
        "THE ORRERY is not an ornament. It is a key.",
        "Only the true Orrery turns the lock of my archive. Copies will jam the wards.",
        "To set any of my dials: the night comes first — Moon, then Star; the Sun returns at dawn; and the Eye watches over all.",
      ],
      signature: "E.H.",
    },
    ev: { id: "ev-orrery-sketch", category: "document", significance: "The Orrery is the key to Elias's archive; only the true one works." },
  });
  s.obj({
    id: "symbol-dial", name: "Symbol Dial", cat: "puzzle", art: "symbol-dial", box: at(860, 250, 100, 100),
    desc: "A brass dial set with four symbols: Sun, Moon, Star and Eye.",
    requires: { flags: ["found:orrery-sketch"], message: "The symbols mean nothing yet. There must be instructions somewhere in the workshop." },
    lock: { kind: "puzzle", puzzle: "dial-sequence" },
    hint: "The symbol dial follows the rule on the blueprint.",
  });
  s.obj({
    id: "orrery-ring", name: "Spare Orrery Ring", cat: "evidence", art: "orrery-part", box: at(888, 380, 44, 44), required: true, hiddenUntil: ["opened:symbol-dial"],
    desc: "A spare brass ring from the Orrery, with a small blue planet. Stamped inside: E.H. No. 1 — THE ONLY ONE.",
    ev: { id: "ev-orrery-ring", category: "physical", significance: "The true Orrery has a matching blue planet ring; Elias made only one.", related: ["ev-orrery-sketch"] },
  });
  s.token("token-c1-09", at(470, 196, 20, 20), "It hung on the pegboard among the tools.");

  return {
    n: 9, id: "c1-09", title: "The Hidden Workshop", location: "Hollowmere House · Hidden Workshop", difficulty: 2,
    description: "Elias's workshop, where he built something that was never meant to be decorative.",
    briefing: "Behind the conservatory, a door hidden in the panelling leads to Elias's private workshop. His signet ring bore an orrery. Here, perhaps, is why.",
    objective: "Repair the wall clockwork, recover the blueprint and use it to open the symbol dial.",
    facts: ["Some mechanisms need assembled components. Combine parts before using them."],
    recall: ["ev-signet-ring"],
    scene: s.build(),
    recipes: [{ id: "gears", inputs: ["brass-gear", "small-gear"], output: "gear-assembly", text: "Pin the two gears onto one axle." }],
    puzzles: [
      {
        id: "dial-sequence", kind: "sequence", title: "The Symbol Dial",
        prompt: "Press the symbols in the right order.",
        symbols: [
          { id: "sun", label: "Sun", art: "symbol-tile" },
          { id: "moon", label: "Moon", art: "symbol-tile" },
          { id: "star", label: "Star", art: "symbol-tile" },
          { id: "eye", label: "Eye", art: "symbol-tile" },
        ],
        answer: ["moon", "star", "sun", "eye"],
        clueRefs: ["orrery-sketch"],
        hint: "“The night comes first.” Which symbols belong to night, and which comes at dawn?",
        successText: "Moon, Star, Sun, Eye. The dial unlocks with a soft chime.",
      },
    ],
    summary: "Elias's blueprint reveals the Orrery is a key: only the true Orrery opens his archive. A spare ring proves he made just one.",
    reveal: "Whoever holds the true Orrery holds the key to everything Elias hid.",
  };
}

/* ------------------------------------------------------------------ */
/* 10 · The Mansion's Secret Chamber                                    */
/* ------------------------------------------------------------------ */
function l10(): LevelSpec {
  const s = new SceneBuilder("scene-c1-10");
  s.area("corner", "Library Corner", shell({ wall: "damask", floor: "boards", wallColor: "#2a1a20", accent: "#c9a46a", floorColor: "#4a2e1c", darkness: 0.5, lights: [{ x: 700, y: 300, r: 140 }] }));
  s.decor("rug", 280, 480, 420, 90);
  s.decor("bookshelf", 40, 60, 220, 380, { variant: "dd" });
  const shelf = s.decor("bookshelf", 300, 60, 260, 380, { variant: "eeee" });
  s.decor("bookshelf", 600, 60, 200, 380, { variant: "ff" });
  s.decor("armchair", 820, 330, 150, 150);
  s.decor("lamp-floor", 810, 240, 50, 200);

  s.obj({
    id: "vance-chalk", name: "Note Pinned to the Shelf", cat: "document", art: "note", box: inside(shelf, 0.88, 0.14, 34, 40), required: true,
    desc: "A note pinned to the side of the bookcase, in Vance's hand.",
    doc: { title: "Pinned note — M. Vance", style: "handwritten", body: ["Mrs. Pell says the lever is “the book that tells the time.”", "Clever old girl. Took me an hour."], signature: "M.V." },
    ev: { id: "ev-vance-lever-note", category: "document", significance: "The secret lever is the book that 'tells the time'." },
    hint: "Vance pinned a note to the middle bookcase.",
  });
  s.obj({
    id: "hidden-shelf", name: "Middle Bookcase", cat: "exit", art: "bookshelf", tint: "#5a3a24", variant: "eeee", box: { x: shelf.x, y: shelf.y, w: shelf.w, h: shelf.h }, exitTo: "chamber", required: true,
    desc: "Four shelves of old books. One spine is worn smooth — but which?",
    lock: { kind: "puzzle", puzzle: "book-choice" },
    openText: "With a click, the whole bookcase swings inward.",
    hint: "One book on the middle bookcase is a lever.",
  });

  s.area("chamber", "The Secret Chamber", shell({ wall: "stone", floor: "stone", wallColor: "#4a443e", accent: "#2a2520", floorColor: "#3a3530", darkness: 0.55, lights: [{ x: 480, y: 330, r: 170 }] }), { flags: ["opened:hidden-shelf"], message: "The way into the chamber is hidden." });
  const board = s.decor("corkboard", 340, 110, 280, 190);
  const table = s.decor("table", 330, 360, 300, 110);
  s.place("candelabra", on(table, 0, 0.9, 34, 50));
  s.decor("crate", 60, 380, 100, 80);
  s.decor("boxes-stack", 160, 360, 90, 100);

  s.obj({
    id: "vance-board", name: "Vance's Pinboard", cat: "evidence", art: "corkboard", box: board,
    desc: "Vance's own investigation board: the Larkspur photo, a clipping (FIRE RULED ACCIDENT — H. FINCH), a map with a red line from this house to the Institute, and a question: “Who barred the door?”",
    required: true,
    ev: { id: "ev-vance-board", category: "document", significance: "Vance suspected someone barred the laboratory door during the fire.", related: ["ev-gazette", "ev-trio-photo"] },
    hint: "Vance's board fills the wall behind the table.",
  });
  s.obj({
    id: "larkspur-card", name: "Larkspur Access Card", cat: "evidence", art: "card-access", box: on(table, 0, 0.28, 52, 34), required: true,
    desc: "An access card: LARKSPUR INSTITUTE — VISITOR 7 — EAST WING. Issued 12 October.",
    ev: { id: "ev-larkspur-card", category: "physical", significance: "Vance had arranged access to the Larkspur Institute." },
    hint: "Check the table under the candles.",
  });
  s.obj({
    id: "vance-chamber-note", name: "Vance's Last Note", cat: "document", art: "note", box: on(table, 0, 0.6, 40, 50), required: true,
    desc: "A note weighted with a candlestick.",
    doc: {
      title: "Note in the chamber — M. Vance",
      style: "handwritten",
      body: [
        "E.H. did not die in that fire. Someone barred the door from the corridor.",
        "Larkspur first — ask H.C. about the night of 3 March.",
        "If I'm not back by Friday, whoever finds this: keep going.",
      ],
      signature: "M.V.",
    },
    ev: { id: "ev-vance-chamber-note", category: "document", significance: "Vance planned to go to Larkspur and question H.C. — Helena Crane." },
  });
  s.obj({ id: "orrery-socket", name: "Round Socket in the Wall", cat: "environment", art: "vault-door", box: at(760, 190, 170, 170), desc: "A circular brass socket set into the stone, shaped to receive something like an orrery. It is empty, and the wards inside are stiff with disuse." });
  s.token("token-c1-10", on(table, 0, 0.08, 20, 20), "Vance left this one on the table — perhaps for you.");

  return {
    n: 10, id: "c1-10", title: "The Mansion's Secret Chamber", location: "Hollowmere House · Secret Chamber", difficulty: 2,
    description: "Behind the library lies the room where Vance worked out the truth.",
    briefing: "Mrs. Pell told Vance about a hidden room behind the library. Vance found it, and used it. Whatever she concluded here sent her out of this house for the last time.",
    objective: "Open the hidden bookcase, search Vance's chamber, and deduce where she went next.",
    facts: ["Elias survived the fire.", "Julian Reed wanted the Hollowmere collection.", "The Orrery is the key to Elias's archive."],
    recall: ["ev-trio-photo", "ev-pell-decoded", "ev-orrery-sketch"],
    scene: s.build(),
    puzzles: [
      {
        id: "book-choice", kind: "choice", title: "The Lever Book",
        prompt: "Pull the right book.",
        question: "Which book is the lever?",
        options: [
          { id: "birds", text: "Birds of the Northern Moors" },
          { id: "verse", text: "Collected Verse, Vol. II" },
          { id: "clockwork", text: "A Treatise on Clockwork" },
          { id: "chem", text: "Principles of Chemistry" },
        ],
        answer: "clockwork",
        clueRefs: ["vance-chalk"],
        hint: "Mrs. Pell's riddle: the book that tells the time.",
        successText: "You tilt “A Treatise on Clockwork.” Something clicks behind the shelf.",
      },
    ],
    deductions: [
      {
        id: "d-where-vance", title: "Vance's Next Move",
        question: "Where did Vance go after Hollowmere House?",
        conclusions: [
          { id: "larkspur", text: "The Larkspur Institute, to question Helena Crane" },
          { id: "station", text: "Straight to the railway station" },
          { id: "office", text: "Back to her office at headquarters" },
        ],
        answer: "larkspur",
        evidence: ["ev-larkspur-card", "ev-vance-chamber-note", "ev-trio-photo"],
        hint: "She had an access card, she wrote down her plan, and you know who “H.C.” is from the photograph.",
        successText: "Vance went to Larkspur to question Dr. Helena Crane — the H.C. in the photograph, and very likely the “H.” who helped Elias hide.",
        wrongConclusionText: "Her own note says where she was going first.",
      },
    ],
    summary: "In the secret chamber, Vance's board asks who barred the laboratory door. Her last note and a Larkspur access card show she left to question Dr. Helena Crane about the night of 3 March.",
    reveal: "Vance believed the fire was deliberate. Her trail now leads back to the city — and to Larkspur.",
  };
}

export const CH1_LEVELS = [l01(), l02(), l03(), l04(), l05(), l06(), l07(), l08(), l09(), l10()].map((s) => makeLevel(s, "ch1", itemName));
