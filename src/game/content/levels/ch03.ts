import { SceneBuilder, at, floor, inside, makeLevel, on, shell, type LevelSpec } from "../builder";
import { itemName } from "../items";

const LAB = { wall: "tiles" as const, wallColor: "#b9c7bf", accent: "#3a5a4a" };

/* ------------------------------------------------------------------ */
/* 21 · Laboratory Entrance                                             */
/* ------------------------------------------------------------------ */
function l21(): LevelSpec {
  const s = new SceneBuilder("scene-c3-01");
  s.area("foyer", "Entrance Foyer", shell({ wall: "stone", floor: "checker", wallColor: "#8a8478", accent: "#c9a46a", floorColor: "#d8d0bc", darkness: 0.35, lights: [{ x: 500, y: 100, r: 200, strength: 0.4 }] }));
  s.decor("column", 40, 60, 60, 390);
  s.decor("column", 900, 60, 60, 390);
  s.decor("chandelier", 430, 0, 150, 90);
  const booth = s.decor("counter", 120, 330, 240, 120, { tint: "#3a3f4a" });
  s.place("lamp-desk", on(booth, 0, 0.2, 40, 50));
  s.decor("plant", 400, 340, 60, 110);
  s.decor("door-metal", 700, 230, 90, 210, { tint: "#4a6a5a" });
  s.decor("door-metal", 790, 230, 90, 210, { tint: "#4a6a5a" });
  s.decor("rug-rect", 360, 480, 360, 80, { tint: "#2c3e3a" });

  s.obj({
    id: "founders-plaque", name: "Founders' Plaque", cat: "evidence", art: "plaque", box: at(150, 150, 170, 60), required: true,
    desc: "LARKSPUR INSTITUTE — founded by Prof. E. Hollowmere, Dr. H. Crane, and Mr. J. Reed (Secretary & Treasurer).",
    ev: { id: "ev-founders-plaque", category: "environmental", significance: "Julian Reed controlled Larkspur's money as treasurer." },
    hint: "A brass plaque hangs above the security booth.",
  });
  s.obj({
    id: "memorial", name: "Memorial and Flowers", cat: "evidence", art: "rose", tint: "#e8e0f0", box: at(500, 330, 40, 90), required: true,
    desc: "A small memorial to Elias Hollowmere with fresh midnight lilies. The card reads: “Still with us. — H.”",
    ev: { id: "ev-memorial-card", category: "physical", significance: "Someone signing 'H.' leaves fresh lilies and writes that Elias is 'still with us'." },
    hint: "Fresh flowers stand by the memorial in the middle of the foyer.",
  });
  s.obj({ id: "memorial-plaque", name: "Memorial Plaque", cat: "environment", art: "plaque", box: at(470, 240, 100, 36), desc: "PROFESSOR ELIAS HOLLOWMERE — lost in the east wing, 3 March. “He lit the way.”" });
  s.obj({ id: "visitor-card", name: "Spare Visitor Card", cat: "item", art: "card-access", tint: "#3f7a5a", box: on(booth, 0, 0.55, 46, 30), item: "visitor-card", required: true, desc: "A spare visitor card in the booth's tray.", hint: "Check the tray in the security booth." });
  s.obj({ id: "inner-reader", name: "Card Reader", cat: "exit", art: "card-reader", box: at(890, 300, 30, 44), exitTo: "hall", required: true, desc: "A card reader controlling the inner doors.", lock: { kind: "item", item: "visitor-card", consumes: false, lockedText: "The reader blinks red. It needs a Larkspur card." }, openText: "The doors hiss open.", hint: "Use a card on the reader by the inner doors." });

  s.area("hall", "Main Hall", shell({ ...LAB, floor: "tiles", floorColor: "#8a948a", darkness: 0.3, lights: [{ x: 500, y: 80, r: 200, strength: 0.35 }] }), { flags: ["opened:inner-reader"], message: "The inner doors need a card." });
  for (let i = 0; i < 4; i++) s.decor("locker", 40 + i * 52, 280, 50, 170, { tint: "#3a5a4a" });
  s.decor("notice-board", 420, 120, 160, 110);
  s.decor("pipes", 600, 400, 300, 26, { tint: "#8a8a8a" });
  s.decor("door-metal", 760, 230, 90, 210, { tint: "#4a6a5a" });
  s.obj({ id: "staff-notice", name: "Staff Notice", cat: "document", art: "paper", box: at(470, 140, 50, 64), required: true, desc: "A typed notice, newer than the rest.", doc: { title: "Notice to staff", style: "typed", body: ["The EAST WING remains closed to all staff and visitors.", "Any enquiries from the police are to be referred to the Director personally."], signature: "H. Crane, Director" }, ev: { id: "ev-staff-notice", category: "document", significance: "Crane personally controls police access and keeps the east wing shut." } });
  s.obj({ id: "visitor7-badge", name: "Visitor Badge No. 7", cat: "evidence", art: "id-badge", box: floor(690, 436, 34, 44), rotate: 15, required: true, desc: "A visitor badge, number 7, dropped behind the radiator pipe — the badge issued to Vance.", ev: { id: "ev-visitor7-badge", category: "physical", significance: "Vance was taken inside Larkspur, not just to the gate." }, hint: "Something fell behind the radiator pipes." });
  s.token("token-c3-01", on({ x: 40, y: 280, w: 50, h: 170, art: "locker" }, 0, 0.5, 20, 20), "On top of the lockers.");

  return {
    n: 21, id: "c3-01", title: "Laboratory Entrance", location: "Larkspur Institute · Foyer", difficulty: 3,
    description: "The institute Elias founded still works behind its card readers.",
    briefing: "Larkspur Institute, founded by three people in a photograph: Elias Hollowmere, Helena Crane and Julian Reed. Twenty years after the fire it still runs — behind locked doors.",
    objective: "Get past the entrance, and find proof that Vance came further inside than the gate.",
    facts: ["Vance was escorted in by Dr. Crane on 14 October.", "Access cards open card readers when used on them."],
    recall: ["ev-trio-photo", "ev-gate-log"],
    scene: s.build(),
    summary: "Julian Reed was Larkspur's treasurer. Fresh lilies at Elias's memorial are signed “Still with us. — H.”, and Vance's visitor badge lay inside the main hall.",
    reveal: "Vance got inside Larkspur. Someone here still believes Elias is alive.",
  };
}

/* ------------------------------------------------------------------ */
/* 22 · Reception Desk                                                  */
/* ------------------------------------------------------------------ */
function l22(): LevelSpec {
  const s = new SceneBuilder("scene-c3-02");
  s.area("reception", "Reception", shell({ wall: "panels", floor: "carpet", wallColor: "#2c3e3a", accent: "#5a3a24", floorColor: "#2a4038", darkness: 0.35, lights: [{ x: 460, y: 280, r: 160 }] }));
  s.decor("window", 60, 80, 130, 180, { variant: "dusk" });
  s.decor("clock-wall", 470, 80, 56, 56, { variant: "h3m20" });
  const desk = s.decor("counter", 320, 320, 330, 140, { tint: "#5a3a24" });
  s.place("telephone", on(desk, 0, 0.88, 54, 42));
  s.place("lamp-desk", on(desk, 0, 0.08, 40, 50));
  s.decor("sofa", 40, 370, 220, 100, { tint: "#3a4a3a" });
  s.decor("plant", 680, 330, 70, 130);
  const cab = { x: 780, y: 170, w: 120, h: 150 };
  s.decor("control-panel", 790, 360, 120, 90);

  s.obj({
    id: "phone-directory", name: "Internal Directory", cat: "document", art: "paper", box: on(desk, 0, 0.3, 44, 56), required: true,
    desc: "A typed list of internal telephone extensions.",
    doc: { title: "Larkspur — internal extensions", style: "typed", body: ["Security ......... 100", "Mr. J. Reed (former) .... 209 — disconnected", "Dr. H. Crane, Director .... 317", "Chemical Store .... 450", "Sample Archive .... 512"] },
    ev: { id: "ev-directory", category: "record", significance: "The Director's extension is 317." },
    hint: "The directory is on the reception counter.",
  });
  s.obj({ id: "cabinet-label", name: "Cabinet Label", cat: "document", art: "card-calling", box: at(808, 150, 64, 24), required: true, desc: "A label above the key cabinet.", doc: { title: "Label", style: "typed", body: ["KEY CABINET — combination is the Director's extension. Do not share."] }, ev: { id: "ev-cabinet-label", category: "document", significance: "The key cabinet uses the Director's extension as its code." } });
  s.obj({ id: "key-cabinet", name: "Key Cabinet", cat: "puzzle", art: "cabinet", tint: "#4a4a4a", box: cab, item: "chemstore-key", desc: "A wall cabinet of keys with a three-digit lock.", lock: { kind: "puzzle", puzzle: "key-cabinet-code" }, openText: "Rows of keys. You take the chemical store key — red tag, HAZARD.", hint: "The key cabinet is on the right-hand wall." });
  s.obj({
    id: "message-slips", name: "Message Slips", cat: "document", art: "receipt", box: on(desk, 0, 0.55, 28, 44), required: true,
    desc: "A spike of telephone message slips.",
    doc: { title: "WHILE YOU WERE OUT", style: "handwritten", body: ["For: Dr. Crane. From: Mr. J. Reed. 15 Oct, 9:05 a.m. — “About the Inspector.” Left no number.", "Again 11:40. Again 4:15 p.m. “He says it's urgent.”"] },
    ev: { id: "ev-reed-calls", category: "record", significance: "Reed rang Crane three times the day after Vance vanished, 'about the Inspector'." },
  });
  s.obj({
    id: "appointment-book", name: "Director's Appointment Book", cat: "document", art: "ledger", box: on(desk, 0, 0.72, 50, 40), required: true,
    desc: "The Director's appointment book.",
    doc: { title: "Director's appointments — 14 October", style: "handwritten", body: ["18:00 — Insp. Vance, east gate. Director to escort personally. Make no record."], signature: "(secretary)" },
    ev: { id: "ev-director-appointment", category: "record", significance: "Crane met Vance personally and asked for no record to be kept." },
  });
  s.token("token-c3-02", at(116, 236, 20, 20), "On the window sill.");

  return {
    n: 22, id: "c3-02", title: "Reception Desk", location: "Larkspur Institute · Reception", difficulty: 3,
    description: "Every visitor passes reception — and every telephone call is written down.",
    briefing: "Larkspur's reception keeps the keys, the telephone messages and the Director's diary. What happened here the day after Vance disappeared?",
    objective: "Search reception, open the key cabinet for the chemical store key, and find who was calling about the Inspector.",
    facts: ["Similar-looking entries in a list can hide the one you need."],
    recall: ["ev-gate-log", "ev-staff-notice"],
    scene: s.build(),
    puzzles: [
      { id: "key-cabinet-code", kind: "code", title: "Key Cabinet", charset: "digits", answer: "317", prompt: "Three digits.", clueRefs: ["cabinet-label", "phone-directory"], hint: "The label says the code is the Director's extension. Find it in the directory.", successText: "3 — 1 — 7. The cabinet swings open." },
    ],
    summary: "Crane met Vance personally and kept no record. The morning after Vance vanished, Julian Reed rang Crane three times “about the Inspector.” You took the chemical store key.",
    reveal: "Reed knew something had happened to Vance before anyone reported her missing.",
  };
}

/* ------------------------------------------------------------------ */
/* 23 · Research Laboratory                                             */
/* ------------------------------------------------------------------ */
function l23(): LevelSpec {
  const s = new SceneBuilder("scene-c3-03");
  s.area("lab", "Research Laboratory", shell({ ...LAB, floor: "tiles", floorColor: "#9aa49a", darkness: 0.25, lights: [{ x: 300, y: 100, r: 180, strength: 0.35 }, { x: 720, y: 100, r: 180, strength: 0.35 }] }));
  s.decor("blackboard", 360, 70, 260, 140);
  s.decor("window", 830, 70, 130, 170, { variant: "night" });
  const shelves = s.decor("shelves-metal", 30, 200, 190, 250, { tint: "#7a8a80", variant: "jars" });
  const bench1 = s.decor("lab-bench", 260, 330, 300, 130);
  const bench2 = s.decor("lab-bench", 620, 330, 300, 130);
  s.place("microscope", on(bench1, 0, 0.15, 40, 60));
  s.place("flasks", on(bench2, 0, 0.82, 70, 56));

  s.obj({
    id: "protocol", name: "Protocol L", cat: "document", art: "paper", box: on(bench1, 0, 0.42, 44, 56), required: true,
    desc: "A typed laboratory protocol, initialled E.H.",
    doc: { title: "Protocol L (“Lantern”)", style: "typed", body: ["To distil the extract: first Heat the flask, then Filter the distillate, then Cool it, and finally Seal the vial. Never Stir — it clouds the extract.", "Mix the extract with ethanol to make the reagent. One drop reveals iron-gall ink invisible to the eye."], signature: "E.H." },
    ev: { id: "ev-protocol-l", category: "document", significance: "How to make Elias's Lantern reagent, which reveals invisible ink." },
    hint: "The protocol is on the left-hand bench.",
  });
  s.obj({ id: "lily-jar", name: "Jar of Pressed Lilies", cat: "evidence", art: "sample-jar", tint: "#e8e0f0", box: on(shelves, 1, 0.3, 34, 46), required: true, desc: "A jar of pressed midnight lilies, labelled “from H.H. conservatory — this season.”", ev: { id: "ev-lily-jar", category: "physical", significance: "Lilies from Hollowmere's conservatory are still being supplied to Larkspur." }, hint: "Look on the shelves for the lilies." });
  s.obj({ id: "distiller", name: "Distillation Apparatus", cat: "puzzle", art: "flasks", tint: "#e8e0f0", box: on(bench2, 0, 0.35, 90, 70), requires: { flags: ["found:lily-jar"], message: "You need something to distil first." }, item: "lily-extract", desc: "A small still with four labelled controls.", lock: { kind: "puzzle", puzzle: "distil" }, openText: "A few pale drops collect in a vial: lily extract.", hint: "Run the still in the order the protocol gives." });
  s.obj({ id: "solvent", name: "Ethanol Bottle", cat: "item", art: "bottle", tint: "#9fc3d1", box: on(shelves, 2, 0.72, 20, 54), item: "solvent", required: true, desc: "A small bottle of laboratory ethanol.", hint: "Ethanol is on the lower shelf." });
  s.obj({ id: "blank-page", name: "Pinned Blank Page", cat: "mechanism", art: "paper", box: at(560, 230, 44, 56), required: true, desc: "A blank page pinned beside the blackboard, headed only “TEST — E.H.”", lock: { kind: "item", item: "lantern-reagent", consumes: false, lockedText: "The page looks blank. Elias's reagent might show what's written on it." }, openText: "A drop of reagent and dark letters bloom across the page.", hint: "The blank page next to the blackboard hides invisible ink." });
  s.obj({
    id: "ink-message", name: "Revealed Writing", cat: "document", art: "note", box: at(562, 232, 40, 50), required: true, hiddenUntil: ["opened:blank-page"],
    desc: "Writing revealed by the reagent.",
    doc: { title: "Revealed ink — TEST, E.H.", style: "handwritten", body: ["If you can read this, the reagent works.", "The rest of my notes are where no one will think to look: beneath the east wing."], signature: "E.H." },
    ev: { id: "ev-invisible-ink", category: "document", significance: "Elias hid his notes beneath the east wing." },
  });
  s.token("token-c3-03", on(shelves, 0, 0.75, 20, 20), "Behind the specimen jars.");

  return {
    n: 23, id: "c3-03", title: "Research Laboratory", location: "Larkspur Institute · Research Laboratory", difficulty: 3,
    description: "Elias's “Lantern” reagent can still be made — if you follow his protocol.",
    briefing: "Elias's research was about recovering faded and hidden writing. His formula, “Lantern”, is still taught here. Made correctly, it could read secrets he left behind.",
    objective: "Distil the lily extract, make the Lantern reagent, and use it on the blank test page.",
    facts: ["Sequential mechanisms must be operated in order.", "Combine ingredients in your inventory."],
    recall: ["ev-midnight-lily"],
    scene: s.build(),
    puzzles: [
      {
        id: "distil", kind: "sequence", title: "Distillation", prompt: "Operate the still.",
        symbols: [
          { id: "stir", label: "Stir" },
          { id: "cool", label: "Cool" },
          { id: "heat", label: "Heat" },
          { id: "seal", label: "Seal" },
          { id: "filter", label: "Filter" },
        ],
        answer: ["heat", "filter", "cool", "seal"],
        clueRefs: ["protocol"],
        hint: "Protocol L lists the steps in order — and one to avoid.",
        successText: "Heat, filter, cool, seal. A vial of pale extract.",
      },
    ],
    recipes: [{ id: "make-reagent", inputs: ["lily-extract", "solvent"], output: "lantern-reagent", text: "Mix the extract into the ethanol. The Lantern reagent glows faintly green." }],
    summary: "Following Protocol L, you distilled the lily extract and made Elias's Lantern reagent. On the blank test page it revealed his message: the rest of his notes are beneath the east wing.",
    reveal: "You now carry the Lantern reagent — and Elias's secrets lie under the east wing.",
  };
}

/* ------------------------------------------------------------------ */
/* 24 · Chemical Storage                                                */
/* ------------------------------------------------------------------ */
function l24(): LevelSpec {
  const s = new SceneBuilder("scene-c3-04");
  s.area("anteroom", "Anteroom", shell({ wall: "metal", floor: "grate", wallColor: "#5d6f6a", accent: "#2a3a34", floorColor: "#3a4440", darkness: 0.45, lights: [{ x: 300, y: 200, r: 150 }] }));
  s.decor("sign-post", 120, 250, 90, 200, { tint: "#8e2f2f", variant: "DANGER|CHEMICALS" });
  for (let i = 0; i < 3; i++) s.decor("locker", 260 + i * 52, 280, 50, 170, { tint: "#6a7a70" });
  const bench = s.decor("bench", 470, 400, 180, 60, { tint: "#4a4a4a" });
  s.decor("pipes", 0, 60, 1000, 40, { tint: "#6a6a6a" });
  s.obj({ id: "gloves", name: "Rubber Gloves", cat: "item", art: "glove", tint: "#c9a040", box: at(520, 372, 36, 40), item: "rubber-gloves", required: true, desc: "Thick laboratory gloves on the bench.", hint: "Gloves lie on the bench." });
  s.obj({ id: "vent-switch", name: "Ventilation Switch", cat: "mechanism", art: "switch", box: at(700, 260, 28, 42), required: true, desc: "A big switch: VENTILATION — must be ON before entry.", openText: "Fans rumble into life behind the grilles.", hint: "Switch on the ventilation before going in." });
  s.obj({
    id: "store-door", name: "Chemical Store Door", cat: "exit", art: "door-metal", tint: "#7a3a2a", box: at(780, 230, 100, 210), exitTo: "store", required: true,
    desc: "A heavy door marked HAZARD.",
    requires: { flags: ["opened:vent-switch"], message: "Fumes seep under the door. Switch on the ventilation first." },
    lock: { kind: "item", item: "chemstore-key", lockedText: "Locked. The key has a red enamel tag." },
    openText: "The lock turns. The air inside smells of solvent.",
  });

  s.area("store", "Chemical Store", shell({ wall: "metal", floor: "grate", wallColor: "#4d5d58", accent: "#2a3a34", floorColor: "#343c38", darkness: 0.5, lights: [{ x: 500, y: 120, r: 180 }] }), { flags: ["opened:store-door"], message: "The store is locked." });
  const sh1 = s.decor("shelves-metal", 20, 200, 200, 250, { tint: "#6a7a70", variant: "chem" });
  s.decor("shelves-metal", 230, 200, 200, 250, { tint: "#6a7a70", variant: "chem2" });
  const desk = s.decor("table", 470, 380, 200, 80, { tint: "#4a4a4a" });
  const acid = { x: 740, y: 260, w: 150, h: 190 };
  s.obj({
    id: "naphtha-ledger", name: "Solvent Register", cat: "document", art: "ledger", box: on(desk, 0, 0.4, 60, 46), required: true,
    desc: "The store's solvent register — volumes going back decades.",
    doc: { title: "Solvent register — March (twenty years ago)", style: "ledger", body: ["3 March, 21:05 — NAPHTHA, 2 litres — signed J. Reed — “cleaning east-wing glassware.”", "3 March — no glassware cleaning recorded by the east wing."] },
    ev: { id: "ev-naphtha-log", category: "record", significance: "Julian Reed signed out two litres of naphtha three hours before the fire." },
    hint: "The register is open on the table.",
  });
  s.obj({ id: "acid-cabinet", name: "Corrosives Cabinet", cat: "container", art: "cabinet", tint: "#7a3a2a", box: acid, required: true, desc: "A cabinet with an acid-crusted handle.", lock: { kind: "item", item: "rubber-gloves", consumes: false, lockedText: "The handle is crusted with acid. You need protection to touch it." }, openText: "Behind the acids, a scorched tin wrapped in a sack." });
  s.obj({ id: "naphtha-tin", name: "Scorched Naphtha Tin", cat: "evidence", art: "barrel", tint: "#5a4a3a", box: inside(acid, 0.5, 0.55, 50, 64), required: true, hiddenUntil: ["opened:acid-cabinet"], desc: "An empty naphtha tin, scorched, stencilled EAST WING. A label: “Retained — H.C.”", ev: { id: "ev-naphtha-tin", category: "physical", significance: "Crane secretly kept the scorched naphtha tin from the fire." } });
  s.token("token-c3-04", on(sh1, 0, 0.5, 20, 20), "Among the bottles on the first shelf.");

  return {
    n: 24, id: "c3-04", title: "Chemical Storage", location: "Larkspur Institute · Chemical Store", difficulty: 3,
    description: "Every litre of solvent in Larkspur was signed for — including two that never reached a laboratory.",
    briefing: "Finch's draft mentioned accelerant at the threshold. If it came from Larkspur's own store, someone signed for it.",
    objective: "Get into the chemical store safely and find out who drew accelerant on 3 March.",
    facts: ["You carry the chemical store key from reception.", "Some objects can only be used once a condition is met."],
    recall: ["ev-draft-report"],
    carry: [{ item: "chemstore-key", from: "c3-02" }],
    scene: s.build(),
    summary: "The solvent register shows Julian Reed signed out two litres of naphtha at 21:05 on 3 March — for glassware that was never cleaned. Crane kept the scorched tin hidden in the acid cabinet.",
    reveal: "Reed took the accelerant. Crane kept the proof.",
  };
}

/* ------------------------------------------------------------------ */
/* 25 · Security Room                                                   */
/* ------------------------------------------------------------------ */
function l25(): LevelSpec {
  const s = new SceneBuilder("scene-c3-05");
  s.area("security", "Security Room", shell({ wall: "plaster", floor: "tiles", wallColor: "#5a5a52", accent: "#2a2a2a", floorColor: "#6a6458", darkness: 0.4, lights: [{ x: 400, y: 260, r: 160 }] }));
  s.decor("window", 60, 80, 120, 170, { variant: "night" });
  s.decor("control-panel", 220, 150, 160, 110, { variant: "on" });
  const desk = s.decor("desk", 220, 320, 300, 150, { tint: "#4a4a4a" });
  s.place("radio", on(desk, 0, 0.82, 60, 44));
  s.decor("time-clock", 600, 160, 60, 84);
  const rack = { x: 690, y: 150, w: 110, h: 130 };
  const board = s.decor("corkboard", 820, 120, 160, 120, { variant: "plain" });
  for (let i = 0; i < 2; i++) s.decor("locker", 820 + i * 52, 280, 50, 170);

  s.obj({ id: "card-rack", name: "Old Time-card Rack", cat: "container", art: "card-rack", box: rack, required: true, desc: "A rack of time cards from twenty years ago, kept for the insurance claim.", openText: "The old cards are still in their slots.", hint: "The old time-card rack is beside the time clock." });
  s.obj({ id: "card-eh", name: "Time Card — E.H.", cat: "environment", art: "punch-card", box: at(560, 300, 60, 28), hiddenUntil: ["opened:card-rack"], desc: "E. HOLLOWMERE — EAST WING — IN 22:00. No OUT punch." });
  s.obj({ id: "card-hc", name: "Time Card — H.C.", cat: "environment", art: "punch-card", box: at(630, 300, 60, 28), hiddenUntil: ["opened:card-rack"], desc: "H. CRANE — MAIN BUILDING — OUT 18:30." });
  s.obj({ id: "card-jr", name: "Time Card — J.R.", cat: "evidence", art: "punch-card", box: at(700, 300, 60, 28), required: true, hiddenUntil: ["opened:card-rack"], desc: "J. REED — EAST WING — IN 23:40, OUT 23:58. He had no reason to be there at night.", ev: { id: "ev-punch-card", category: "record", significance: "Reed punched into the east wing at 23:40 and out at 23:58 on the night of the fire." } });
  s.obj({ id: "guard-log", name: "Guard's Logbook", cat: "document", art: "ledger", box: on(desk, 0, 0.35, 60, 46), required: true, desc: "The night guard's logbook for March, twenty years ago.", doc: { title: "Night guard log — 3/4 March", style: "ledger", body: ["00:10 — FIRE ALARM, east wing.", "00:14 — Brigade telephoned.", "00:40 — East-wing door found chained. Brigade cut chain."] }, ev: { id: "ev-guard-log", category: "record", significance: "The alarm sounded at 00:10; the brigade had to cut a chain off the door." } });
  s.obj({ id: "incident-board", name: "Incident Board", cat: "puzzle", art: "corkboard", box: board, requires: { flags: ["found:card-jr", "found:guard-log"], message: "You need the night's records before you can reconstruct it." }, desc: "A blank board for reconstructing incidents.", lock: { kind: "puzzle", puzzle: "fire-night" }, hint: "Reconstruct the night of the fire on the board." });
  s.token("token-c3-05", on(desk, 0, 0.1, 20, 20), "Beside the guard's lamp.");

  return {
    n: 25, id: "c3-05", title: "Security Room", location: "Larkspur Institute · Security Office", difficulty: 3,
    description: "Every door in Larkspur was punched in and out — even on the night of the fire.",
    briefing: "Larkspur's guards kept time cards for everyone who entered the east wing. If someone else was there that night, the time clock remembered.",
    objective: "Find the night's time cards and guard log, then reconstruct the night of the fire in order.",
    facts: ["Several time cards look the same. Read each one.", "Your notebook holds times from earlier cases."],
    recall: ["ev-pell-old-statement", "ev-larkspur-crate", "ev-stopped-clock"],
    scene: s.build(),
    puzzles: [
      {
        id: "fire-night", kind: "timeline", title: "The Night of the Fire",
        prompt: "Order the events of 3–4 March.",
        events: [
          { id: "alarm", text: "The fire alarm is raised" },
          { id: "jr-in", text: "J.R. punches in to the east wing" },
          { id: "home", text: "Elias reaches Hollowmere House" },
          { id: "enter", text: "Elias enters the laboratory" },
          { id: "jr-out", text: "J.R. punches out" },
          { id: "entry", text: "Elias's last notebook entry" },
        ],
        answer: ["enter", "entry", "jr-in", "jr-out", "alarm", "home"],
        clueRefs: ["ev-pell-old-statement", "ev-larkspur-crate", "card-jr", "guard-log", "ev-stopped-clock"],
        hint: "22:00 (Pell), 23:15 (the notebooks), 23:40 and 23:58 (the time card), 00:10 (the alarm), 4:15 (the clock).",
        successText: "22:00 Elias enters. 23:15 his last entry. 23:40 Reed in. 23:58 Reed out. 00:10 alarm. 4:15 Elias home.",
        reward: { evidence: { id: "ev-fire-timeline", name: "Timeline of the Fire", category: "record", description: "22:00 Elias enters the lab; 23:15 last notebook entry; 23:40 Reed enters the east wing; 23:58 Reed leaves; 00:10 alarm; 04:15 Elias reaches home.", significance: "Reed left the east wing twelve minutes before the alarm.", related: ["ev-punch-card", "ev-guard-log"] } },
      },
    ],
    summary: "Julian Reed punched into the east wing at 23:40 and out at 23:58. Twelve minutes later the alarm sounded, and the brigade had to cut a chain off the laboratory door.",
    reveal: "Reed was in the east wing minutes before the fire — with no reason to be there.",
  };
}

/* ------------------------------------------------------------------ */
/* 26 · Equipment Workshop                                              */
/* ------------------------------------------------------------------ */
function l26(): LevelSpec {
  const s = new SceneBuilder("scene-c3-06");
  s.area("workshop", "Equipment Workshop", shell({ wall: "metal", floor: "concrete", wallColor: "#4a4038", accent: "#2a2420", floorColor: "#3e3a36", darkness: 0.45, lights: [{ x: 460, y: 280, r: 170 }] }));
  s.decor("toolboard", 280, 120, 240, 150);
  const bench = s.decor("workbench", 240, 330, 400, 140);
  s.place("lamp-desk", on(bench, 0, 0.06, 44, 56));
  const shelves = s.decor("shelves-metal", 20, 200, 190, 250, { variant: "parts" });
  const parts = { x: 700, y: 200, w: 120, h: 160 };
  s.decor("crate", 860, 390, 110, 80);
  s.decor("boxes-stack", 690, 380, 90, 90);
  const deckBox = on(bench, 0, 0.62, 120, 80);

  s.obj({ id: "wiring-diagram", name: "Wiring Diagram", cat: "document", art: "blueprint", box: at(540, 160, 70, 52), required: true, desc: "A wiring diagram pinned beside the toolboard.", doc: { title: "Parts cabinet — wiring", style: "typed", body: ["To release the parts cabinet: connect Red, then Yellow, then Black. Never Blue — it trips the alarm."] }, ev: { id: "ev-wiring", category: "document", significance: "The parts cabinet wires: Red, Yellow, Black." }, hint: "A diagram is pinned near the toolboard." });
  s.obj({ id: "parts-cabinet", name: "Parts Cabinet", cat: "puzzle", art: "cabinet", tint: "#5d6670", box: parts, item: "vacuum-valve", desc: "A steel cabinet with four coloured wire terminals instead of a lock.", lock: { kind: "puzzle", puzzle: "wires" }, openText: "The cabinet releases. Inside, in cotton wool: a vacuum valve.", hint: "Wire the parts cabinet as the diagram says." });
  s.obj({ id: "dust-sheet", name: "Dust Sheet", cat: "container", art: "cloth", tint: "#a89878", box: on(shelves, 2, 0.5, 80, 46), required: true, item: "tape-reel", desc: "Something round under a dust sheet on the bottom shelf.", openText: "Under the sheet: a tape reel labelled “E.H. — 4 March”.", hint: "Something is hidden under a dust sheet." });
  s.obj({ id: "recorder", name: "Reel-to-reel Recorder", cat: "mechanism", art: "tape-recorder", box: deckBox, required: true, desc: "A heavy reel-to-reel recorder. One valve socket is empty.", lock: { kind: "item", item: "vacuum-valve", lockedText: "It won't power up. A valve is missing from its socket." }, openText: "The valves glow orange. The machine hums, ready for a reel." , hint: "The recorder on the bench needs a part." });
  s.obj({ id: "recorder-deck", name: "Recorder Spindles", cat: "mechanism", art: "reel-tape", box: { x: deckBox.x + 10, y: deckBox.y - 4, w: 36, h: 36 }, required: true, hiddenUntil: ["opened:recorder"], desc: "The empty spindles, waiting for a reel.", lock: { kind: "item", item: "tape-reel", lockedText: "There's nothing on the spindles to play." }, openText: "The reel turns. A tired voice fills the workshop." });
  s.obj({
    id: "recording", name: "Recording: “E.H. — 4 March”", cat: "document", art: "paper", box: on(bench, 0, 0.92, 40, 50), required: true, hiddenUntil: ["opened:recorder-deck"],
    desc: "Your transcript of the recording.",
    doc: { title: "Transcript — tape “E.H. 4 March”", style: "typed", body: ["“This is Elias Hollowmere, the morning after. Last night Julian came to the east wing. I told him I had seen the forged pieces in my collection.", "He left. Then I heard the chain go round the handle, and smelled naphtha under the door.", "I got out through the service hatch into the old tunnel. If anything happens to me, Helena has this tape.”"] },
    ev: { id: "ev-elias-recording", category: "testimony", significance: "Elias's own account: Reed chained the door after Elias confronted him about forgeries." },
  });
  s.token("token-c3-06", on(shelves, 0, 0.6, 20, 20), "Among the spare parts.");

  return {
    n: 26, id: "c3-06", title: "Equipment Workshop", location: "Larkspur Institute · Equipment Workshop", difficulty: 3,
    description: "A broken recorder, a missing valve, and a voice from twenty years ago.",
    briefing: "Larkspur's workshop repairs everything from microscopes to wireless sets. Helena Crane kept a tape here, under a dust sheet, waiting for someone to fix the machine that could play it.",
    objective: "Find the tape and the missing part, repair the recorder, and play the recording.",
    facts: ["Mechanisms can need several parts in a particular order."],
    recall: ["ev-fire-timeline"],
    scene: s.build(),
    puzzles: [
      {
        id: "wires", kind: "sequence", title: "Parts Cabinet Wiring", prompt: "Connect the terminals.",
        symbols: [
          { id: "red", label: "Red" },
          { id: "blue", label: "Blue" },
          { id: "yellow", label: "Yellow" },
          { id: "black", label: "Black" },
        ],
        answer: ["red", "yellow", "black"],
        clueRefs: ["wiring-diagram"],
        hint: "The diagram gives the order — and the colour never to touch.",
        successText: "Red, yellow, black. The cabinet unlatches.",
      },
    ],
    summary: "With a new valve fitted, the recorder played Elias's own account from the morning after: he confronted Julian Reed about forgeries, then heard the chain on the door and smelled naphtha. He escaped through a service hatch.",
    reveal: "Elias named his attacker on tape twenty years ago: Julian Reed.",
  };
}

/* ------------------------------------------------------------------ */
/* 27 · Sample Archive                                                  */
/* ------------------------------------------------------------------ */
function l27(): LevelSpec {
  const s = new SceneBuilder("scene-c3-07");
  s.area("samples", "Sample Archive", shell({ wall: "tiles", floor: "tiles", wallColor: "#b8c8d0", accent: "#4a5a66", floorColor: "#8a96a0", darkness: 0.3, lights: [{ x: 500, y: 100, r: 220, strength: 0.35, color: "#cfe6ef" }] }));
  for (let i = 0; i < 4; i++) s.decor("locker", 30 + i * 62, 240, 60, 210, { tint: "#d8dde0" });
  const shelves = s.decor("shelves-metal", 300, 200, 220, 250, { tint: "#8a96a0", variant: "jars" });
  const bench = s.decor("lab-bench", 560, 330, 260, 130, { tint: "#e0e4e2" });
  s.place("microscope", on(bench, 0, 0.12, 40, 60));
  const freezer = { x: 840, y: 220, w: 130, h: 230 };

  s.obj({ id: "sample-index", name: "Sample Index", cat: "document", art: "ledger", box: on(bench, 0, 0.42, 60, 46), required: true, desc: "The sample archive's index book.", doc: { title: "Sample index — restricted", style: "ledger", body: ["Freezer bank C — Ash, east-wing threshold (duplicate of police exhibit 3). Retained by E.H.", "Freezer bank C combination: 3-0-3 — the date we lost the east wing."] }, ev: { id: "ev-sample-index", category: "record", significance: "A duplicate ash sample from the fire is kept in freezer bank C." }, hint: "The index is on the bench." });
  s.obj({ id: "jar-soil", name: "Sample Jar: Soil", cat: "environment", art: "sample-jar", tint: "#7a5a3a", box: on(shelves, 1, 0.2, 30, 40), desc: "LARKSPUR GARDEN SOIL — routine." });
  s.obj({ id: "jar-root", name: "Sample Jar: Lily Root", cat: "environment", art: "sample-jar", tint: "#e8e0f0", box: on(shelves, 1, 0.5, 30, 40), desc: "LILY ROOT — Protocol L stock." });
  s.obj({ id: "freezer-c", name: "Freezer Bank C", cat: "puzzle", art: "locker", tint: "#cfd6da", box: freezer, desc: "A frosted freezer bank with a three-digit lock.", lock: { kind: "puzzle", puzzle: "freezer-code" }, openText: "Cold air rolls out. Inside, a sealed ash sample and an analysis card.", hint: "Freezer bank C is on the right." });
  s.obj({ id: "ash-sample", name: "Threshold Ash Sample", cat: "evidence", art: "sample-jar", tint: "#4a4a4a", box: inside(freezer, 0.35, 0.5, 34, 44), required: true, hiddenUntil: ["opened:freezer-c"], desc: "A sealed jar of grey ash: EAST WING — THRESHOLD — 4 March.", ev: { id: "ev-ash-sample", category: "physical", significance: "A duplicate of the threshold ash survived the police 'loss'." } });
  s.obj({ id: "analysis-card", name: "Analysis Card", cat: "document", art: "card-calling", box: inside(freezer, 0.68, 0.5, 46, 30), required: true, hiddenUntil: ["opened:freezer-c"], desc: "An analysis card in Elias's hand.", doc: { title: "Analysis — threshold ash", style: "handwritten", body: ["Naphtha residue throughout. The fire began OUTSIDE the door, at the threshold, and burned inward.", "Analysed at Northreach, two years after."], signature: "E.H." }, ev: { id: "ev-ash-analysis", category: "record", significance: "Naphtha at the threshold: the fire started outside the lab door." } });
  s.token("token-c3-07", on(shelves, 2, 0.8, 20, 20), "Tucked behind the jars.");

  return {
    n: 27, id: "c3-07", title: "Sample Archive", location: "Larkspur Institute · Sample Archive", difficulty: 3,
    description: "The police lost the ash sample. Elias kept a copy.",
    briefing: "The police exhibit list included an ash sample from the threshold. Elias was a scientist: he would have kept his own.",
    objective: "Find the duplicate ash sample and its analysis, then decide how the fire was started.",
    facts: ["Many sample jars look alike."],
    recall: ["ev-exhibit-log", "ev-naphtha-log", "ev-naphtha-tin"],
    scene: s.build(),
    puzzles: [{ id: "freezer-code", kind: "code", title: "Freezer Bank C", charset: "digits", answer: "303", prompt: "Three digits.", clueRefs: ["sample-index"], hint: "The index gives the combination — and why it was chosen.", successText: "3 — 0 — 3. The seal cracks open." }],
    deductions: [
      {
        id: "d-how-started", title: "How the Fire Started",
        question: "How was the Larkspur fire started?",
        conclusions: [
          { id: "naphtha", text: "Naphtha poured at the threshold outside the door and lit" },
          { id: "heater", text: "A faulty laboratory heater" },
          { id: "experiment", text: "An experiment that went wrong inside the lab" },
        ],
        answer: "naphtha",
        evidence: ["ev-naphtha-log", "ev-ash-analysis", "ev-naphtha-tin"],
        hint: "Who drew accelerant, where its residue was found, and what Crane hid.",
        successText: "Reed signed out naphtha, the threshold ash is full of it, and the scorched tin survives. The fire was set outside a chained door.",
      },
    ],
    summary: "Elias's duplicate ash sample proves naphtha was poured at the threshold, outside the door. With Reed's signature in the solvent register and the scorched tin, the method is clear.",
    reveal: "The fire was set deliberately, from the corridor, with naphtha Reed signed for.",
  };
}

/* ------------------------------------------------------------------ */
/* 28 · Restricted Corridor                                             */
/* ------------------------------------------------------------------ */
function l28(): LevelSpec {
  const s = new SceneBuilder("scene-c3-08");
  s.area("corridor", "East-wing Corridor", shell({ wall: "plaster", floor: "tiles", wallColor: "#6a6458", accent: "#2a2420", floorColor: "#5a544a", darkness: 0.55, lights: [{ x: 200, y: 90, r: 140, strength: 0.4 }] }));
  s.decor("sign-post", 60, 240, 90, 210, { tint: "#8e2f2f", variant: "EAST WING|CLOSED" });
  s.decor("door", 180, 230, 90, 210, { tint: "#5a5a50" });
  const labDoor = { x: 470, y: 220, w: 110, h: 220 };
  s.decor("door", labDoor.x, labDoor.y, labDoor.w, labDoor.h, { tint: "#3a3a30" });
  s.decor("chair", 330, 360, 60, 100, { tint: "#4a4a4a" });
  s.decor("pipes", 0, 40, 1000, 30, { tint: "#5a5a5a" });

  s.obj({ id: "door-bracket", name: "Iron Brackets", cat: "evidence", art: "chain", box: inside(labDoor, 1.08, 0.48, 40, 20), required: true, desc: "On the corridor side of the doorframe: two iron brackets, crudely added — exactly where a chain would be wrapped to hold the door shut.", ev: { id: "ev-door-bracket", category: "environmental", significance: "Brackets for a chain were fixed on the corridor side of the lab door." }, hint: "Look closely at the side of the laboratory door." });
  s.obj({ id: "scorch", name: "Scorch Pattern", cat: "evidence", art: "ash", box: floor(525, 470, 150, 34), required: true, desc: "Under the new floor tiles, the old boards show a scorch pattern spreading from the corridor side into the room.", ev: { id: "ev-scorch-pattern", category: "environmental", significance: "The fire spread from the corridor into the lab." } });
  s.obj({ id: "screwdriver", name: "Screwdriver", cat: "item", art: "screwdriver", box: inside({ x: 330, y: 360, w: 60, h: 100 }, 0.5, 0.56, 58, 14), item: "screwdriver", required: true, desc: "A screwdriver left on the chair seat by a workman.", hint: "A tool lies on the chair." });
  const panel = at(780, 270, 90, 110);
  s.obj({ id: "wall-panel", name: "Wall Panel", cat: "container", art: "wall-panel", tint: "#6a6458", box: panel, required: true, desc: "A wooden panel held by four screws. The screw heads are bright — recently turned.", lock: { kind: "item", item: "screwdriver", consumes: false, lockedText: "Screwed tight to the wall." }, openText: "The panel comes away. Behind it: an iron hatch.", hint: "One wall panel has bright, recently turned screws." });
  s.obj({ id: "service-hatch", name: "Service Hatch", cat: "exit", art: "hatch", box: inside(panel, 0.5, 0.6, 70, 28), exitTo: "tunnel", required: true, hiddenUntil: ["opened:wall-panel"], desc: "An iron service hatch leading down into the dark.", openText: "You lift the hatch and climb down into the old service tunnel." });

  s.area("tunnel", "Service Tunnel", shell({ kind: "tunnel", wall: "stone", floor: "stone", wallColor: "#4a443e", accent: "#2a2520", floorColor: "#3a3530", darkness: 0.65, lights: [{ x: 500, y: 260, r: 160 }] }), { flags: ["opened:service-hatch"], message: "The hatch is hidden." });
  s.decor("pipes", 60, 120, 880, 30, { tint: "#5a4a3a" });
  s.decor("lantern", 480, 180, 30, 50);
  s.obj({ id: "coat-scrap", name: "Scrap of Lab Coat", cat: "evidence", art: "cloth", tint: "#d8d0bc", box: at(260, 300, 40, 30), required: true, desc: "A scorched scrap of lab-coat cotton snagged on a nail. The weave matches the coat in Elias's wardrobe.", ev: { id: "ev-coat-scrap", category: "physical", significance: "Elias came through this tunnel, still in his burning coat." }, hint: "Something is caught on a nail on the left wall." });
  s.obj({ id: "tunnel-sign", name: "Painted Arrow", cat: "evidence", art: "plaque", box: at(640, 240, 120, 40), required: true, desc: "A painted arrow on the brickwork: HOLLOWMERE — 2 MILES.", ev: { id: "ev-tunnel-sign", category: "environmental", significance: "The service tunnel leads to Hollowmere House." } });
  s.token("token-c3-08", floor(820, 520, 20, 20), "In the tunnel's gutter.");

  return {
    n: 28, id: "c3-08", title: "Restricted Corridor", location: "Larkspur Institute · East Wing", difficulty: 4,
    description: "The rebuilt corridor hides the old door's fittings — and a way out nobody mentioned.",
    briefing: "The east wing was rebuilt after the fire and closed for twenty years. Crane's napkin said “Larkspur tunnel.” If Elias escaped, the way out began here.",
    objective: "Examine the old laboratory door, find the hidden hatch, and follow Elias's escape route.",
    facts: ["Elias said he escaped through a service hatch."],
    recall: ["ev-napkin-decoded", "ev-elias-recording"],
    scene: s.build(),
    deductions: [
      {
        id: "d-escape", title: "The Escape",
        question: "How did Elias escape the fire?",
        conclusions: [
          { id: "tunnel", text: "Through the service tunnel to Hollowmere House" },
          { id: "front", text: "Out through the front entrance in the confusion" },
          { id: "never", text: "He didn't — he died in the east wing" },
        ],
        answer: "tunnel",
        evidence: ["ev-coat-scrap", "ev-tunnel-sign", "ev-scorched-coat"],
        hint: "A scrap of his coat, where the tunnel leads, and the coat itself.",
        successText: "Elias crawled through the service tunnel to Hollowmere House in his burning coat — the coat Agnes Pell hung in his wardrobe.",
      },
    ],
    summary: "The lab door had chain brackets fitted on the corridor side, and the scorch spread inward. Behind a panel, a hatch opens on the service tunnel, where a scrap of Elias's coat still hangs on a nail. The tunnel leads to Hollowmere House.",
    reveal: "Elias's escape route is found: two miles of tunnel, from fire to home.",
  };
}

/* ------------------------------------------------------------------ */
/* 29 · Research Director's Office                                      */
/* ------------------------------------------------------------------ */
function l29(): LevelSpec {
  const s = new SceneBuilder("scene-c3-09");
  s.area("director", "Director's Office", shell({ wall: "panels", floor: "carpet", wallColor: "#2a2a3a", accent: "#5a3a24", floorColor: "#3a2a3a", darkness: 0.4, lights: [{ x: 470, y: 280, r: 160 }] }));
  s.decor("bookshelf", 30, 70, 200, 370, { variant: "director" });
  s.decor("window", 260, 70, 130, 180, { variant: "night" });
  const desk = s.decor("desk", 330, 310, 330, 160, { tint: "#4a2f1d" });
  s.place("lamp-desk", on(desk, 0, 0.88, 44, 56));
  s.place("globe", on({ x: 700, y: 330, w: 120, h: 120, art: "cabinet" }, 0, 0.5, 56, 76));
  s.decor("cabinet", 700, 330, 120, 120);
  s.decor("armchair", 840, 340, 140, 140, { tint: "#2c3e5c" });
  const painting = { x: 700, y: 110, w: 170, h: 130 };

  s.obj({ id: "crane-note", name: "Note on the Blotter", cat: "document", art: "note", box: on(desk, 0, 0.3, 34, 42), required: true, desc: "A note in Helena Crane's hand, tucked under the blotter.", doc: { title: "Note", style: "handwritten", body: ["My safe opens to the minute I can never forget — the minute he walked into the east wing."], signature: "H." }, ev: { id: "ev-crane-note", category: "document", significance: "Crane's safe code is the minute Reed entered the east wing." }, hint: "A note is tucked under the desk blotter." });
  s.obj({ id: "painting", name: "Moorland Painting", cat: "container", art: "painting", tint: "#5a6a4a", box: painting, required: true, desc: "A painting of the northern moors, hanging slightly crooked.", openText: "The painting swings out on a hinge, revealing a wall safe.", hint: "One painting hangs crooked." });
  s.obj({ id: "wall-safe", name: "Wall Safe", cat: "puzzle", art: "safe", box: inside(painting, 0.5, 0.5, 80, 80), hiddenUntil: ["opened:painting"], desc: "A four-digit wall safe.", lock: { kind: "puzzle", puzzle: "crane-safe" }, openText: "The safe opens on a telegram and a ledger." });
  s.obj({ id: "crane-telegram", name: "Telegram from Northreach", cat: "document", art: "telegram", box: on(desk, 0, 0.55, 56, 40), required: true, hiddenUntil: ["opened:wall-safe"], desc: "A telegram, folded small.", doc: { title: "Telegram — 17 October — from NORTHREACH", style: "telegram", body: ["THE INSPECTOR FOUND ME STOP WE ARE SAFE FOR NOW STOP SOMEONE FOLLOWED HER NORTH STOP DO NOT WRITE STOP", "— E"] }, ev: { id: "ev-crane-telegram", category: "document", significance: "Elias telegraphed from Northreach: Vance found him, and someone followed her north." } });
  s.obj({ id: "payments-ledger", name: "Private Ledger", cat: "document", art: "ledger", tint: "#4a2f4f", box: on(desk, 0, 0.72, 56, 44), required: true, hiddenUntil: ["opened:wall-safe"], desc: "Helena Crane's personal account book.", doc: { title: "Private account — H. Crane", style: "ledger", body: ["Every month for twenty years: “Northreach supplies — E.”", "Coal, medicine, paper, lilies. Never more than she could afford."] }, ev: { id: "ev-crane-payments", category: "record", significance: "Crane paid for Elias's supplies at Northreach for twenty years." } });
  s.obj({ id: "reed-letter", name: "Letter from J. Reed", cat: "document", art: "letter", box: on(desk, 0, 0.12, 56, 38), required: true, desc: "A letter on Wrenmoor Museum paper.", doc: { title: "Wrenmoor Museum — Office of the Curator — 16 October", style: "handwritten", body: ["Helena — The Inspector's interest in the old business is unhealthy for us both. I trust you told her nothing. Let the dead stay dead."], signature: "J." }, ev: { id: "ev-reed-warning", category: "document", significance: "Reed warned Crane off the day after Vance vanished." } });
  s.token("token-c3-09", on({ x: 30, y: 70, w: 200, h: 370, art: "bookshelf" }, 1, 0.7, 20, 20), "On a shelf among the journals.");

  return {
    n: 29, id: "c3-09", title: "Research Director's Office", location: "Larkspur Institute · Director's Office", difficulty: 4,
    description: "Helena Crane's office: payments, telegrams and a safe set to the worst minute of her life.",
    briefing: "Dr. Helena Crane hid Elias, met Vance and wrote to her in code. But Reed calls her, writes to her, and her money flows north every month. Whose side is she on?",
    objective: "Open Crane's safe and decide where her loyalty lies.",
    facts: ["Codes can come from evidence found in earlier cases."],
    recall: ["ev-punch-card", "ev-cafe-tab", "ev-pell-new-statement"],
    scene: s.build(),
    puzzles: [{ id: "crane-safe", kind: "code", title: "Crane's Wall Safe", charset: "digits", answer: "2340", prompt: "Four digits.", clueRefs: ["crane-note", "ev-punch-card"], hint: "The minute Reed walked into the east wing is on his time card.", successText: "2 — 3 — 4 — 0. The bolts withdraw." }],
    deductions: [
      {
        id: "d-crane-side", title: "Helena Crane",
        question: "Whose side is Helena Crane on?",
        conclusions: [
          { id: "protector", text: "Elias's protector — she has hidden and supported him for twenty years" },
          { id: "accomplice", text: "Reed's accomplice in the fire" },
          { id: "blackmail", text: "A blackmailer paying for silence" },
        ],
        answer: "protector",
        evidence: ["ev-crane-telegram", "ev-crane-payments", "ev-pell-new-statement"],
        hint: "Who took Elias away that night, who pays for his supplies, and who he writes to.",
        successText: "Helena Crane took Elias away on the night of the fire, has funded his hiding for twenty years, and is the one he trusts with news. She is his protector.",
        wrongConclusionText: "Read what the payments are for — and who Elias writes to when he's afraid.",
      },
    ],
    summary: "Crane's safe held a telegram from Elias at Northreach: Vance found him, and someone followed her north. Twenty years of payments for his supplies prove Crane is his protector — while Reed was warning her to keep quiet.",
    reveal: "Vance reached Elias at Northreach. Someone followed her there.",
  };
}

/* ------------------------------------------------------------------ */
/* 30 · Hidden Laboratory                                               */
/* ------------------------------------------------------------------ */
function l30(): LevelSpec {
  const s = new SceneBuilder("scene-c3-10");
  s.area("hidden-lab", "Hidden Laboratory", shell({ wall: "stone", floor: "stone", wallColor: "#4a5048", accent: "#2a302a", floorColor: "#3a3e38", darkness: 0.5, lights: [{ x: 420, y: 280, r: 170 }, { x: 820, y: 220, r: 120, strength: 0.35 }] }));
  const map = s.decor("map-wall", 320, 90, 240, 160);
  s.decor("blackboard", 640, 90, 200, 120);
  const bench = s.decor("lab-bench", 280, 330, 360, 130, { tint: "#8a8478" });
  s.place("flasks", on(bench, 0, 0.12, 64, 52));
  s.place("lamp-desk", on(bench, 0, 0.9, 44, 56));
  const shelves = s.decor("shelves-metal", 20, 200, 200, 250, { tint: "#5a5a50", variant: "elias" });
  s.decor("cot", 700, 400, 260, 70, { tint: "#4a5a4a" });
  const caseBox = on({ x: 700, y: 400, w: 260, h: 70, art: "cot" }, 0, 0.5, 120, 46);

  s.obj({
    id: "forgeries-journal", name: "Journal: “The Forgeries”", cat: "document", art: "journal", tint: "#3a2a1a", box: on(bench, 0, 0.4, 46, 56), required: true,
    desc: "Elias's private journal, its title underlined twice.",
    doc: {
      title: "“The Forgeries” — E.H.",
      style: "handwritten",
      body: [
        "The Ming bowl — sold through J.R. to a buyer in the capital; a copy put in its place. The Delft tiles — the same. The Persian astrolabe — the same.",
        "J.R. kept the books. He has been selling my collection for years and replacing it with fakes.",
        "He wanted the Orrery most of all. I refused. 3 March, evening — I told him I knew.",
      ],
      signature: "E.H.",
    },
    ev: { id: "ev-forgeries-journal", category: "document", significance: "Reed sold Elias's collection and replaced it with forgeries; Elias confronted him on 3 March." },
    hint: "Elias's journal is on the bench.",
  });
  s.obj({ id: "orrery-case", name: "Empty Orrery Case", cat: "evidence", art: "trunk", tint: "#4a2f1d", variant: "open", box: caseBox, required: true, desc: "A fitted case lined in blue velvet, shaped for the Orrery. It's empty. A paper tag is tied to the handle.", ev: { id: "ev-orrery-case", category: "physical", significance: "The Orrery was taken from Elias's possession." }, hint: "Something lies open on the cot." });
  s.obj({ id: "orrery-tag", name: "Case Tag", cat: "mechanism", art: "luggage-tag", box: { x: caseBox.x + caseBox.w - 10, y: caseBox.y - 18, w: 40, h: 26 }, required: true, requires: { flags: ["found:orrery-case"], message: "Look at the case first." }, desc: "A tag that reads only “TAKEN — 3 March”. The paper is thicker than it needs to be.", lock: { kind: "item", item: "lantern-reagent", consumes: false, lockedText: "There's nothing more to see — unless something's written in invisible ink." }, openText: "The reagent darkens a second message beneath the first." });
  s.obj({ id: "tag-ink", name: "Hidden Message on the Tag", cat: "document", art: "note", box: { x: caseBox.x + caseBox.w + 30, y: caseBox.y - 40, w: 34, h: 42 }, required: true, hiddenUntil: ["opened:orrery-tag"], desc: "Ink revealed by the Lantern reagent.", doc: { title: "Revealed ink — case tag", style: "handwritten", body: ["Julian took the Orrery from my bench as the smoke came under the door. Without it my archive stays shut."], signature: "E.H." }, ev: { id: "ev-orrery-taken", category: "document", significance: "Reed took the Orrery during the fire." } });
  s.obj({ id: "vance-map-note", name: "Pencil Note on the Map", cat: "document", art: "note", box: inside(map, 0.86, 0.3, 32, 40), required: true, desc: "A note pinned to Elias's map, in Vance's hand.", doc: { title: "Note — M. Vance, 14 Oct", style: "handwritten", body: ["Crane brought me down here. He's at Northreach.", "Taking the 23:50 tonight. If H.C. is right, J.R. has been watching her for years."], signature: "M.V." }, ev: { id: "ev-vance-lab-note", category: "document", significance: "Vance learned Elias was at Northreach and left on the 23:50 that night." } });
  s.token("token-c3-10", on(shelves, 1, 0.6, 20, 20), "On Elias's shelves.");

  return {
    n: 30, id: "c3-10", title: "Hidden Laboratory", location: "Beneath the East Wing", difficulty: 4,
    description: "Elias's secret laboratory, where Crane brought Vance on her last night in Wrenmoor.",
    briefing: "Beneath the east wing, past the tunnel junction, is the laboratory Elias used in secret before he went north. Crane brought Vance here on 14 October. You carry the Lantern reagent.",
    objective: "Search Elias's hidden laboratory, reveal what the Orrery's case conceals, and establish what happened on 3 March.",
    facts: ["You carry the Lantern reagent from the research laboratory."],
    recall: ["ev-punch-card", "ev-naphtha-log", "ev-elias-recording"],
    carry: [{ item: "lantern-reagent", from: "c3-03" }],
    scene: s.build(),
    deductions: [
      {
        id: "d-east-wing", title: "3 March",
        question: "What happened in the east wing on the night of 3 March?",
        conclusions: [
          { id: "reed", text: "Julian Reed chained the door, set the fire and took the Orrery" },
          { id: "accident", text: "An electrical accident, as the report says" },
          { id: "faked", text: "Elias started the fire to fake his own death" },
        ],
        answer: "reed",
        evidence: ["ev-punch-card", "ev-naphtha-log", "ev-elias-recording", "ev-orrery-taken"],
        hint: "When Reed was there, what he signed out, what Elias heard, and what Reed carried away.",
        successText: "Reed entered the east wing at 23:40 with two litres of naphtha he'd signed for, chained the door on Elias, set the fire, and took the Orrery from the bench as he left.",
        wrongConclusionText: "Elias's recording and the time card both put someone else at that door.",
      },
    ],
    summary: "Elias's journal reveals Reed's forgeries; the reagent shows Reed took the Orrery during the fire. With Reed's time card, the naphtha register and Elias's recording, the crime is clear. Vance's note: Elias is at Northreach, and she took the 23:50 north.",
    reveal: "Julian Reed tried to kill Elias Hollowmere and stole the key to his archive. Vance went north to find him.",
  };
}

export const CH3_LEVELS = [l21(), l22(), l23(), l24(), l25(), l26(), l27(), l28(), l29(), l30()].map((s) => makeLevel(s, "ch3", itemName));
