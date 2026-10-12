import { SceneBuilder, at, caesar, floor, inside, makeLevel, on, shell, type LevelSpec } from "../builder";
import { itemName } from "../items";

const DIARY_BODY = [
  "Mon 12 Oct — Records Room: the fire report (Finch). Archives — box 47.",
  "Tue 13 Oct — 2 pm Mrs. Pell, Fenwick Lane. 9 pm Café Lune — a “friend of E.H.”?",
  "Wed 14 Oct — Hollowmere House while the light lasts. 6 pm Larkspur east gate — H.C. will meet me.",
];

/* ------------------------------------------------------------------ */
/* 11 · Detective's Office                                              */
/* ------------------------------------------------------------------ */
function l11(): LevelSpec {
  const s = new SceneBuilder("scene-c2-01");
  s.area("office", "Vance's Office", shell({ wall: "planks", floor: "boards", wallColor: "#4a3a2c", accent: "#c9a46a", floorColor: "#3a2a1c", darkness: 0.4, lights: [{ x: 420, y: 290, r: 160 }] }));
  s.decor("window", 650, 70, 130, 180, { variant: "rain" });
  const board = s.decor("corkboard", 300, 80, 230, 150);
  const filing = { x: 40, y: 290, w: 90, h: 170 };
  s.decor("filing", 140, 290, 90, 170, { tint: "#55606a" });
  const desk = s.decor("desk", 320, 300, 340, 170);
  s.place("lamp-desk", on(desk, 0, 0.1, 46, 58));
  s.place("typewriter", on(desk, 0, 0.62, 76, 50));
  s.place("telephone", on(desk, 0, 0.88, 52, 40));
  const hooks = s.decor("shelf-wall", 820, 150, 130, 20);
  s.decor("coat-rack", 860, 250, 70, 210);
  s.decor("hat", 862, 248, 66, 32);
  s.decor("chair", 230, 360, 64, 110);
  s.decor("rug-rect", 300, 480, 420, 80, { tint: "#3a2a20" });

  s.obj({
    id: "appointment-diary", name: "Appointment Diary", cat: "document", art: "pocket-diary", box: on(desk, 0, 0.32, 34, 44), required: true,
    desc: "Vance's desk diary, left open at last week.",
    doc: { title: "Desk diary — week of 12 October", style: "handwritten", body: DIARY_BODY, signature: "M.V." },
    ev: { id: "ev-appointment-diary", category: "document", significance: "Vance's planned movements for 12–14 October." },
    hint: "Vance's diary is on the desk.",
  });
  s.obj({
    id: "soft-pencil", name: "Soft Pencil", cat: "item", art: "pen", tint: "#3a3a30", box: at(686, 246, 60, 12), item: "soft-pencil", required: true,
    desc: "A soft drawing pencil on the window sill.",
    hint: "Something lies on the window sill.",
  });
  s.obj({
    id: "blank-notepad", name: "Blank Notepad", cat: "mechanism", art: "paper", box: on(desk, 0, 0.47, 44, 54),
    desc: "The top sheet is blank, but you can feel indentations from a page that was torn away.",
    lock: { kind: "item", item: "soft-pencil", consumes: false, lockedText: "There are indentations in the paper. Something soft to rub over them would bring the writing up." },
    openText: "You rub the pencil lightly across the page. Words appear in pale relief.",
    hint: "The blank notepad has writing pressed into it.",
  });
  s.obj({
    id: "pencil-rubbing", name: "Pencil Rubbing", cat: "evidence", art: "note", box: on(desk, 0, 0.47, 40, 50), required: true, hiddenUntil: ["opened:blank-notepad"],
    desc: "The rubbing reveals Vance's last note: “Plat. 4 — 23:50 — N. Halt.”",
    obs: ["Platform 4 at Wrenmoor Central serves only northbound trains."],
    ev: { id: "ev-pencil-rubbing", category: "document", significance: "Vance planned to catch the 23:50 from Platform 4 to “N. Halt”." },
  });
  s.obj({ id: "key-filing", name: "Small Silver Key", cat: "item", art: "key-small", tint: "#9aa3ae", box: on(hooks, 0, 0.2, 36, 16), item: "filing-key", required: true, desc: "A small key tagged “FILES — M.V.”", hint: "There are keys hanging on the hook board by the door." });
  s.obj({ id: "key-car", name: "Car Key", cat: "item", art: "key", tint: "#9aa3ae", box: on(hooks, 0, 0.5, 46, 18), item: "car-key", required: true, desc: "A car key on a leather fob: “Austin — WM 214.”" });
  s.obj({ id: "key-spare", name: "Spare Desk Key", cat: "environment", art: "key-small", box: on(hooks, 0, 0.8, 36, 16), desc: "A spare key for the desk you're standing next to. Nothing locked in it that matters." });
  s.obj({
    id: "filing-cabinet", name: "Locked Filing Cabinet", cat: "container", art: "filing", tint: "#55606a", box: filing, required: true,
    desc: "Vance's personal filing cabinet. The second drawer is locked.",
    lock: { kind: "item", item: "filing-key", lockedText: "Locked. The key would be small — Vance kept hers on the hook board." },
    openText: "The drawer slides out. One folder is thicker than the rest.",
    hint: "Vance's filing cabinet is locked.",
  });
  s.obj({
    id: "cold-case-file", name: "Hollowmere Cold Case File", cat: "document", art: "folder", box: on(filing, 0, 0.5, 60, 44), required: true, hiddenUntil: ["opened:filing-cabinet"],
    desc: "The cold-case folder Vance reopened.",
    doc: {
      title: "Case file — LARKSPUR FIRE (cold)",
      style: "typed",
      body: ["Reopened 1 October by Insp. M. Vance on new information (anonymous letter, postmarked Northreach).", "Superintendent's note, clipped to the cover: “Leave it alone, Margot. It was twenty years ago.”"],
    },
    ev: { id: "ev-cold-case-file", category: "record", significance: "Vance reopened the case after an anonymous letter posted from Northreach." },
  });
  s.obj({ id: "vance-board-office", name: "Office Corkboard", cat: "environment", art: "corkboard", box: board, desc: "Ordinary cases: a bicycle theft, a missing dog. One pin holds nothing — a page was taken down in a hurry." });
  s.obj({
    id: "father-photo-office", name: "Framed Photograph", cat: "evidence", art: "photo", box: on(desk, 0, 0.75, 40, 32),
    desc: "Vance as a young constable beside an older sergeant with the same jaw.",
    ev: { id: "ev-vance-father", category: "photograph", significance: "Vance's father was also a Wrenmoor police officer." },
  });
  s.token("token-c2-01", at(318, 202, 20, 20), "Pinned to the corner of the corkboard.");

  return {
    n: 11, id: "c2-01", title: "Detective's Office", location: "Wrenmoor C.I.D. · Vance's Office", difficulty: 2,
    description: "Vance's desk still holds her week — and the impression of her last note.",
    briefing: "Back in the city. Inspector Vance's office at headquarters has been left untouched since she vanished. Her diary, her keys and her files may tell you what she knew before she ever reached Hollowmere House.",
    objective: "Search Vance's office: her diary, her filing cabinet and the note she tore from her notepad.",
    facts: ["Several keys look alike. Read their tags.", "Vance went to Larkspur after Hollowmere House."],
    recall: ["ev-vance-chamber-note"],
    scene: s.build(),
    summary: "Vance's diary maps her week, the cold-case file shows an anonymous letter from Northreach started it all, and a pencil rubbing reveals her final plan: Platform 4, 23:50, “N. Halt.”",
    reveal: "Vance meant to take a northbound night train — and someone in Northreach wanted the case reopened.",
  };
}

/* ------------------------------------------------------------------ */
/* 12 · Case Archives                                                   */
/* ------------------------------------------------------------------ */
function l12(): LevelSpec {
  const s = new SceneBuilder("scene-c2-02");
  s.area("archives", "Police Archives", shell({ wall: "concrete", floor: "concrete", wallColor: "#4a4a48", accent: "#2a2a2a", floorColor: "#3e3d3a", darkness: 0.55, lights: [{ x: 300, y: 120, r: 140 }, { x: 720, y: 120, r: 140 }] }));
  s.decor("shelves-metal", 10, 220, 180, 230, { variant: "a" });
  const shelfB = s.decor("shelves-metal", 190, 220, 180, 230, { variant: "bbb" });
  s.decor("fence", 370, 230, 270, 210, { tint: "#2a2d31" });
  s.decor("shelves-metal", 640, 220, 180, 230, { variant: "cc" });
  s.decor("shelves-metal", 820, 220, 180, 230, { variant: "dddd" });
  s.decor("lantern", 290, 30, 24, 40);
  s.decor("lantern", 710, 30, 24, 40);
  const table = s.decor("table", 680, 450, 200, 100);
  const cage = { x: 450, y: 230, w: 110, h: 210 };

  s.obj({
    id: "archive-index", name: "Archive Index Ledger", cat: "document", art: "ledger", box: on(table, 0, 0.3, 64, 50), required: true,
    desc: "The archive index, open on the clerk's table.",
    doc: { title: "Archive index — H", style: "ledger", body: ["HOLLOWMERE, E. — Fire, Larkspur, 3 March — CAGE B, box 47.", "HOLT, R. — Fraud — Shelf 12, box 3.", "NOTE: Cage B combination for October is 2-9-1. Do not write it down. (Too late.)"] },
    ev: { id: "ev-archive-index", category: "record", significance: "The Larkspur fire file is in Cage B, box 47." },
    hint: "The index ledger is on the table to the right.",
  });
  s.obj({ id: "cage-door", name: "Cage B Door", cat: "puzzle", art: "door-metal", tint: "#4d5560", box: cage, desc: "A wire-mesh cage door with a three-dial combination padlock.", lock: { kind: "puzzle", puzzle: "cage-code" }, openText: "The padlock drops open.", hint: "Cage B is locked with a combination." });
  s.obj({ id: "box-47", name: "Box 47", cat: "container", art: "file-box", box: floor(505, 470, 76, 50), required: true, hiddenUntil: ["opened:cage-door"], desc: "Box 47: HOLLOWMERE / LARKSPUR — 3 MARCH. The lid's dust has two sets of fingerprints.", openText: "Inside: photographs and a sign-out sheet." });
  s.obj({
    id: "fire-photos", name: "Fire Scene Photographs", cat: "evidence", art: "photo", tint: "#3a3a30", box: floor(560, 486, 50, 40), required: true, hiddenUntil: ["opened:box-47"],
    desc: "Police photographs of the burned east wing. In one, the laboratory door's outer handle is wrapped in heavy chain.",
    obs: ["You can't chain a door shut from the inside."],
    ev: { id: "ev-chained-door-photo", category: "photograph", significance: "The laboratory door was chained shut from the corridor during the fire." },
  });
  s.obj({
    id: "signout-sheet", name: "Sign-out Sheet", cat: "document", art: "paper", box: floor(450, 486, 40, 50), required: true, hiddenUntil: ["opened:box-47"],
    desc: "A sign-out sheet clipped inside the lid.",
    doc: { title: "Box 47 — sign-out record", style: "ledger", body: ["5 March — H. Finch (fire investigator) with J. Reed (family representative). Returned 6 March — ONE ITEM SHORT.", "12 October — Insp. M. Vance."] },
    ev: { id: "ev-signout-sheet", category: "record", significance: "Finch and Julian Reed took the fire evidence out together; it came back one item short." },
  });
  s.obj({ id: "box-46", name: "Box 46", cat: "environment", art: "file-box", box: on(shelfB, 2, 0.5, 60, 40), desc: "Box 46: a burglary in Fenwick Lane. Nothing to do with Larkspur." });
  s.token("token-c2-02", at(840, 196, 20, 20), "Left on top of the far shelving.");

  return {
    n: 12, id: "c2-02", title: "Case Archives", location: "Wrenmoor C.I.D. · Basement Archives", difficulty: 2,
    description: "Rows of identical boxes, and one that was opened twice in twenty years.",
    briefing: "Vance's diary says she visited the archives on 12 October. The Larkspur fire file is down here somewhere among thousands of identical boxes.",
    objective: "Find the right box in the archives and examine what the original investigators kept.",
    facts: ["Similar boxes hold very different cases. Read the labels."],
    recall: ["ev-appointment-diary", "ev-gazette"],
    scene: s.build(),
    puzzles: [
      {
        id: "cage-code", kind: "code", title: "Cage B Padlock", charset: "digits", answer: "291", prompt: "A three-dial combination padlock.",
        clueRefs: ["archive-index"], hint: "Someone wrote this month's combination in the index ledger.", successText: "2 — 9 — 1. The padlock snaps open.",
      },
    ],
    summary: "Box 47's photographs show the laboratory door chained from the corridor. The sign-out sheet reveals that Finch and Julian Reed took the evidence out together — and it came back one item short.",
    reveal: "Someone chained Elias in. And Julian Reed handled the evidence afterwards.",
  };
}

/* ------------------------------------------------------------------ */
/* 13 · Witness Apartment                                               */
/* ------------------------------------------------------------------ */
function l13(): LevelSpec {
  const s = new SceneBuilder("scene-c2-03");
  s.area("flat", "Mrs. Pell's Flat", shell({ wall: "stripes", floor: "carpet", wallColor: "#4a3a2a", accent: "#d8c39a", floorColor: "#3a2a2a", darkness: 0.35, lights: [{ x: 200, y: 260, r: 140 }, { x: 640, y: 300, r: 150 }] }));
  s.decor("window", 60, 80, 120, 170, { variant: "dusk" });
  s.decor("clock-wall", 420, 110, 56, 56, { variant: "h2m05" });
  s.decor("portrait", 300, 100, 80, 100, { variant: "b", tint: "#3a4a3a" });
  s.decor("sofa", 40, 330, 280, 130, { tint: "#5a3a3a" });
  const table = s.decor("table-cloth", 400, 360, 230, 104, { tint: "#d8ccb0" });
  const side = s.decor("table", 700, 390, 120, 70);
  const cab = s.decor("cabinet", 840, 300, 140, 160, { tint: "#6d4a2c" });
  s.place("radio", on(cab, 0, 0.5, 70, 52));
  s.decor("plant", 640, 330, 60, 120);
  s.decor("rug", 360, 490, 340, 80, { tint: "#4a3a5a" });

  s.obj({ id: "teapot", name: "Teapot", cat: "environment", art: "teapot", box: on(table, 0, 0.25, 56, 44), desc: "Cold. Two cups' worth gone — she had a visitor." });
  s.obj({ id: "tea-caddy", name: "Tea Caddy", cat: "environment", art: "sample-jar", tint: "#3f5d3a", box: on(table, 0, 0.55, 30, 40), desc: "Tea. Only tea." });
  s.obj({ id: "sugar-jar", name: "Sugar Jar", cat: "container", art: "sample-jar", tint: "#efe4cc", box: on(table, 0, 0.72, 30, 40), required: true, item: "sewing-key", desc: "A sugar jar, the lid stuck with crystallised sugar.", openText: "Buried in the sugar: a tiny brass key.", hint: "Two jars look alike on the table. One isn't only for tea." });
  s.obj({
    id: "pell-statement", name: "Typewriter Carbon", cat: "document", art: "typewriter", box: on(side, 0, 0.5, 78, 52), required: true,
    desc: "A carbon copy still in the typewriter: a statement Mrs. Pell typed for Inspector Vance.",
    doc: {
      title: "Statement of Agnes Pell — 13 October (carbon)",
      style: "typed",
      body: [
        "On the night of the fire the master came home through the garden at a quarter past four in the morning, his coat burning at the cuffs.",
        "I stopped the bedroom clock so I would never forget the hour. Dr. Crane came before dawn and took him away in her car.",
        "At the inquest I said he never came home. God forgive me, I said it to keep him safe.",
      ],
      signature: "A. Pell",
    },
    ev: { id: "ev-pell-new-statement", category: "testimony", significance: "Pell told Vance that Elias came home at 4:15 a.m. and Helena Crane took him away." },
    hint: "The typewriter on the side table still holds a sheet.",
  });
  s.obj({ id: "sewing-box", name: "Sewing Box", cat: "container", art: "jewelry-box", tint: "#6d4a2c", box: on(cab, 0, 0.18, 56, 38), required: true, desc: "A wooden sewing box with a tiny brass lock.", lock: { kind: "item", item: "sewing-key", lockedText: "Locked with a very small lock." }, openText: "Under the threads lies a folded transcript.", hint: "The sewing box on the cabinet is locked." });
  s.obj({
    id: "inquest-transcript", name: "Inquest Transcript", cat: "document", art: "paper", box: on(cab, 0, 0.82, 40, 50), required: true, hiddenUntil: ["opened:sewing-box"],
    desc: "A page from the fire inquest, twenty years old.",
    doc: { title: "Inquest transcript — 9 March", style: "typed", body: ["CORONER: You saw the Professor that night?", "MRS. A. PELL: I saw him go into the laboratory at ten o'clock, sir. He never came home."] },
    ev: { id: "ev-pell-old-statement", category: "testimony", significance: "Pell swore at the inquest that Elias never came home." },
  });
  s.obj({ id: "cat", name: "Oberon the Cat", cat: "environment", art: "cat", box: inside({ x: 40, y: 330, w: 280, h: 130 }, 0.3, 0.42, 60, 46), desc: "Mrs. Pell's cat, Oberon. Unimpressed by detectives." });
  s.obj({
    id: "pell-crane-photo", name: "Christmas Photograph", cat: "evidence", art: "photo", box: on(cab, 0, 0.5, 40, 32), hiddenUntil: [],
    desc: "Agnes Pell and Dr. Helena Crane in the Hollowmere kitchen, wearing paper crowns. Written on the back: “Christmas — the year after.”",
    ev: { id: "ev-pell-crane-photo", category: "photograph", significance: "Pell and Helena Crane remained close after the fire." },
  });
  s.token("token-c2-03", floor(250, 470, 20, 20), "Under the sofa, where Oberon hides things.");

  return {
    n: 13, id: "c2-03", title: "Witness Apartment", location: "Fenwick Lane · Mrs. Pell's Flat", difficulty: 2,
    description: "The housekeeper told two stories, twenty years apart.",
    briefing: "Agnes Pell, Hollowmere's old housekeeper, now lives in a flat on Fenwick Lane. Vance interviewed her on 13 October. Mrs. Pell is away at her sister's, but she left her door on the latch for “the next police officer.”",
    objective: "Find both of Mrs. Pell's statements and work out why they disagree.",
    facts: ["Witness statements can contradict each other — and the physical evidence."],
    recall: ["ev-stopped-clock", "ev-pell-decoded"],
    scene: s.build(),
    deductions: [
      {
        id: "d-pell-lied", title: "Two Statements",
        question: "Why do Mrs. Pell's two statements contradict each other?",
        conclusions: [
          { id: "protect", text: "She lied at the inquest to protect Elias" },
          { id: "memory", text: "Her memory has failed with age" },
          { id: "reed", text: "Julian Reed told her what to say to Vance" },
        ],
        answer: "protect",
        evidence: ["ev-pell-old-statement", "ev-pell-new-statement", "ev-stopped-clock"],
        hint: "Her new statement names an exact hour. Does anything you found in the bedroom confirm it?",
        successText: "The stopped clock confirms her new account to the minute. Pell lied at the inquest to protect Elias — and Helena Crane spirited him away before dawn.",
        wrongConclusionText: "A failing memory wouldn't match a clock stopped at exactly 4:15.",
      },
    ],
    summary: "At the inquest Mrs. Pell swore Elias never came home. To Vance she admitted he returned at 4:15 a.m., burned, and that Dr. Helena Crane took him away. The stopped clock proves the second account.",
    reveal: "Helena Crane helped Elias disappear on the night of the fire.",
  };
}

/* ------------------------------------------------------------------ */
/* 14 · Police Records Room                                             */
/* ------------------------------------------------------------------ */
function l14(): LevelSpec {
  const s = new SceneBuilder("scene-c2-04");
  s.area("records", "Records Room", shell({ wall: "tiles", floor: "tiles", wallColor: "#5a6a5a", accent: "#2a3a2a", floorColor: "#6a6458", darkness: 0.35, lights: [{ x: 500, y: 120, r: 180, strength: 0.4 }] }));
  s.decor("clock-wall", 470, 60, 56, 56, { variant: "h9m30" });
  s.decor("notice-board", 600, 110, 140, 100);
  const cabinets = [s.decor("filing", 30, 280, 90, 170), s.decor("filing", 125, 280, 90, 170, { tint: "#55606a" })];
  const recCab = { x: 220, y: 280, w: 90, h: 170 };
  const catalog = s.decor("card-catalog", 780, 320, 130, 130);
  const counter = s.decor("counter", 330, 330, 330, 130);
  const hooks = s.decor("shelf-wall", 360, 200, 120, 18);

  s.obj({ id: "records-key", name: "Records Key", cat: "item", art: "key-ornate", box: on(hooks, 0, 0.4, 50, 20), item: "records-key", required: true, desc: "A heavy key labelled “RECORDS — B.”", hint: "A key hangs on the hook rail above the counter." });
  s.obj({
    id: "records-cabinet", name: "Records Cabinet B", cat: "container", art: "filing", tint: "#4a5560", box: recCab, required: true,
    desc: "Cabinet B — closed files. Locked.",
    lock: { kind: "item", item: "records-key", lockedText: "Locked. A label reads “B”." },
    openText: "You find the official fire report — with something tucked inside.",
    hint: "Cabinet B needs a key.",
  });
  s.obj({
    id: "official-report", name: "Official Fire Report", cat: "document", art: "folder", box: on(recCab, 0, 0.5, 60, 44), required: true, hiddenUntil: ["opened:records-cabinet"],
    desc: "The signed, official report into the Larkspur fire.",
    doc: { title: "Fire Investigation Report — Larkspur East Wing", style: "typed", body: ["Date of fire: 3 March. Investigator: H. Finch.", "CAUSE: Electrical fault in a laboratory heater.", "Laboratory door found OPEN. No suspicious circumstances.", "Signed: H. Finch, 6 March."] },
    ev: { id: "ev-official-report", category: "record", significance: "The official report: electrical fault, door open, no suspicion." },
  });
  s.obj({
    id: "bank-slip", name: "Bank Deposit Slip", cat: "evidence", art: "receipt", box: on(counter, 0, 0.12, 28, 44), required: true, hiddenUntil: ["opened:records-cabinet"],
    desc: "A bank slip that fell out of the report folder: H. FINCH — cash deposit £500 — 7 March.",
    ev: { id: "ev-finch-bank-slip", category: "record", significance: "Finch banked £500 in cash the day after signing the report." },
  });
  s.obj({
    id: "taped-envelope", name: "Envelope Taped Under the Counter", cat: "document", art: "envelope", box: inside(counter, 0.86, 0.92, 52, 30), required: true, obscured: true,
    desc: "An envelope taped beneath the counter's lip, marked in Vance's hand: “Original draft — M.V.”",
    doc: { title: "DRAFT — 4 March — H. Finch (not for file)", style: "typed", body: ["East-wing laboratory door chained from the corridor side.", "Traces of accelerant at the threshold. A brass lighter recovered at the point of origin.", "CAUSE: DELIBERATE. Refer to C.I.D."], signature: "H.F." },
    ev: { id: "ev-draft-report", category: "document", significance: "Finch's own draft called the fire deliberate and noted a lighter at the origin." },
    hint: "Vance hid something low down, under the counter.",
  });
  s.obj({
    id: "reading-desk", name: "Comparison Desk", cat: "puzzle", art: "lamp-desk", box: on(counter, 0, 0.55, 50, 62),
    desc: "A reading lamp on the counter — enough light to lay two documents side by side.",
    requires: { flags: ["found:official-report", "found:taped-envelope"], message: "You need both versions of the report to compare them." },
    lock: { kind: "puzzle", puzzle: "report-compare" },
    hint: "Compare the two reports under the lamp.",
  });
  void cabinets;
  s.token("token-c2-04", on(catalog, 0, 0.5, 20, 20), "On top of the card catalog.");

  return {
    n: 14, id: "c2-04", title: "Police Records Room", location: "Wrenmoor C.I.D. · Records Room", difficulty: 2,
    description: "Two versions of the same report. Only one was meant to survive.",
    briefing: "Vance read the fire report here on 12 October — and found something that made her hide a document under the counter rather than file it.",
    objective: "Find the official fire report and Vance's hidden draft, compare them, and decide why the report was changed.",
    facts: ["The fire scene photographs show the door chained from outside.", "Finch and Reed signed the evidence out together."],
    recall: ["ev-chained-door-photo", "ev-signout-sheet"],
    scene: s.build(),
    puzzles: [
      {
        id: "report-compare", kind: "choice", title: "Comparing the Reports",
        prompt: "Lay the draft beside the official report.",
        question: "What changed between Finch's draft and the official report?",
        options: [
          { id: "date", text: "The date of the fire" },
          { id: "cause", text: "The cause and the door: “chained, deliberate” became “open, electrical”" },
          { id: "name", text: "The investigator's name" },
          { id: "place", text: "Where the fire started" },
        ],
        answer: "cause",
        clueRefs: ["official-report", "taped-envelope"],
        hint: "Read what each version says about the door and the cause.",
        successText: "Everything that pointed to murder was removed: the chain, the accelerant, the lighter.",
        reward: { evidence: { id: "ev-altered-report", name: "The Altered Report", category: "record", description: "Finch's draft (chained door, accelerant, lighter, deliberate) was rewritten as an accidental electrical fire.", significance: "The official finding was deliberately falsified.", related: ["ev-draft-report", "ev-official-report"] } },
      },
    ],
    deductions: [
      {
        id: "d-finch-paid", title: "The Investigator",
        question: "Why was the Larkspur fire ruled an accident?",
        conclusions: [
          { id: "paid", text: "Finch was paid to change his findings" },
          { id: "mistake", text: "Finch made an honest mistake" },
          { id: "electrical", text: "It really was an electrical fault" },
        ],
        answer: "paid",
        evidence: ["ev-altered-report", "ev-finch-bank-slip", "ev-signout-sheet"],
        hint: "A rewritten report, a cash deposit, and who Finch was with when the evidence went missing.",
        successText: "Finch rewrote his report, banked £500 the next day, and handled the evidence with Julian Reed — after which an item went missing. Someone paid for that fire to be an accident.",
        wrongConclusionText: "An honest mistake doesn't come with a £500 deposit and a rewritten draft.",
      },
    ],
    summary: "Finch's draft called the fire deliberate — a chained door, accelerant, a lighter at the origin. The official report says electrical fault. He banked £500 the next day.",
    reveal: "The Larkspur fire was murder, covered up with a bribe. Vance hid the proof here.",
  };
}

/* ------------------------------------------------------------------ */
/* 15 · Underground Parking Area                                        */
/* ------------------------------------------------------------------ */
function l15(): LevelSpec {
  const s = new SceneBuilder("scene-c2-05");
  s.area("garage", "Headquarters Garage", shell({ wall: "concrete", floor: "concrete", wallColor: "#55555a", accent: "#2a2a2a", floorColor: "#36363a", darkness: 0.55, lights: [{ x: 260, y: 60, r: 150 }, { x: 760, y: 60, r: 150 }] }));
  s.decor("pipes", 0, 20, 1000, 40);
  s.decor("pillar", 250, 80, 46, 380);
  s.decor("pillar", 760, 80, 46, 380);
  s.decor("car", 820, 340, 260, 120, { tint: "#4a4a50", flip: true });
  s.decor("car", -110, 350, 260, 120, { tint: "#5a2a2a" });
  s.decor("extinguisher", 768, 260, 26, 64);
  const car = { x: 330, y: 300, w: 380, h: 160 };

  s.obj({
    id: "vance-car", name: "Vance's Austin", cat: "container", art: "car", tint: "#2a3a4a", box: car, required: true,
    desc: "A dark-blue Austin, registration WM 214. Locked.",
    lock: { kind: "item", item: "car-key", consumes: false, lockedText: "Locked. You'll need Vance's car key." },
    openText: "The driver's door opens. The car smells of coffee and wet wool.",
    hint: "Vance's car is the dark-blue one in the middle.",
  });
  s.obj({
    id: "red-clay", name: "Red Clay on the Tyres", cat: "evidence", art: "stain", tint: "#8a3a2a", box: inside(car, 0.18, 0.86, 54, 22), required: true,
    desc: "Red clay packed into the tyre treads. The only red clay near Wrenmoor is on the Larkspur estate road.",
    ev: { id: "ev-red-clay", category: "environmental", significance: "Vance's car had been driven to Larkspur." },
    hint: "Look closely at the front tyre.",
  });
  s.obj({
    id: "cafe-receipt", name: "Café Lune Receipt", cat: "evidence", art: "receipt", box: inside(car, 0.38, 0.2, 26, 40), required: true, hiddenUntil: ["opened:vance-car"],
    desc: "A receipt on the dashboard: Café Lune, Harbour Street — 13 Oct, 9:12 p.m. — two coffees, table 5.",
    ev: { id: "ev-cafe-receipt", category: "record", significance: "Vance had coffee with someone at Café Lune at 9:12 p.m. on 13 October." },
  });
  s.obj({ id: "boot-release", name: "Boot Release Lever", cat: "mechanism", art: "lever", box: inside(car, 0.46, 0.55, 28, 44), required: true, hiddenUntil: ["opened:vance-car"], desc: "The lever that releases the boot.", openText: "With a clunk, the boot springs open." });
  s.obj({
    id: "burned-letter", name: "Half-burned Letter", cat: "document", art: "paper-burnt", box: inside(car, 0.86, 0.3, 46, 50), required: true, hiddenUntil: ["opened:boot-release"],
    desc: "A letter, half burned, wrapped in an evidence bag in the boot.",
    doc: { title: "Half-burned letter (no envelope)", style: "handwritten", body: ["…know what was done at Larkspur, and I know he did not die there. Meet me at the café — nine o'clock, the thirteenth. Come alone. I will…", "…a friend of E.H."] },
    ev: { id: "ev-burned-letter", category: "document", significance: "A 'friend of E.H.' summoned Vance to Café Lune on the 13th." },
  });
  s.obj({ id: "oil-drips", name: "Oil Drips", cat: "environment", art: "stain", tint: "#1a1a1a", box: floor(890, 520, 80, 24), desc: "Fresh oil under the grey saloon. Not Vance's car — hers doesn't leak." });
  s.token("token-c2-05", at(258, 300, 20, 20), "Wedged in a crack in the pillar.");

  return {
    n: 15, id: "c2-05", title: "Underground Parking Area", location: "Wrenmoor C.I.D. · Garage", difficulty: 2,
    description: "Vance's car never left the garage on the night she vanished.",
    briefing: "Vance's Austin is still parked under headquarters. She must have travelled by other means on the 14th — but the car remembers where it had been before.",
    objective: "Open Vance's car, search it thoroughly, and work out who she met at Café Lune.",
    facts: ["You carry Vance's car key from her office."],
    recall: ["ev-cafe-matchbook", "ev-appointment-diary"],
    carry: [{ item: "car-key", from: "c2-01" }],
    scene: s.build(),
    deductions: [
      {
        id: "d-cafe-meeting", title: "The Café Appointment",
        question: "Who asked Vance to meet at Café Lune?",
        conclusions: [
          { id: "friend", text: "Someone claiming to be a friend of Elias Hollowmere" },
          { id: "super", text: "Her superintendent" },
          { id: "reed", text: "Julian Reed, openly" },
        ],
        answer: "friend",
        evidence: ["ev-cafe-receipt", "ev-burned-letter"],
        hint: "The letter names the place and time. The receipt proves she went.",
        successText: "Someone signing themselves “a friend of E.H.” summoned Vance, and she kept the appointment: two coffees at 9:12 p.m.",
      },
    ],
    summary: "Red clay on the tyres shows Vance had driven to Larkspur. A half-burned letter from “a friend of E.H.” summoned her to Café Lune on the 13th — and her receipt proves she went.",
    reveal: "Someone who knew Elias was alive reached out to Vance. The answer is at Café Lune.",
  };
}

/* ------------------------------------------------------------------ */
/* 16 · Storage Unit                                                    */
/* ------------------------------------------------------------------ */
function l16(): LevelSpec {
  const s = new SceneBuilder("scene-c2-06");
  s.area("corridor", "Storage Corridor", shell({ wall: "brick", floor: "concrete", wallColor: "#6a4a3a", accent: "#2a2a2a", floorColor: "#3a3836", darkness: 0.5, lights: [{ x: 500, y: 40, r: 170 }] }));
  s.decor("lantern", 488, 20, 24, 40);
  s.obj({ id: "unit-12", name: "Unit 12", cat: "environment", art: "roll-door", box: at(40, 250, 180, 200), desc: "Unit 12. The padlock is rusted solid. Nobody has opened this in years." });
  s.obj({ id: "unit-13", name: "Unit 13", cat: "environment", art: "roll-door", box: at(290, 250, 180, 200), desc: "Unit 13. A rental notice is glued over the lock." });
  const unit14 = { x: 540, y: 250, w: 180, h: 200 };
  s.obj({
    id: "unit-14", name: "Unit 14", cat: "exit", art: "roll-door", box: unit14, exitTo: "unit", required: true,
    desc: "Unit 14. A new padlock — and a small chalk “M” on the frame.",
    lock: { kind: "item", item: "storage-key", lockedText: "A shiny new padlock. Its key would be tagged 14." },
    openText: "The shutter rattles up.",
    hint: "Only one of these units has a new padlock.",
  });
  s.obj({ id: "chalk-m", name: "Chalk Mark", cat: "evidence", art: "chalk-mark", box: inside(unit14, 0.94, 0.15, 26, 26), required: true, desc: "A small chalk “M” on the frame of unit 14 — Vance's way of marking her places.", ev: { id: "ev-chalk-m", category: "environmental", significance: "Unit 14 is Vance's." }, hint: "Look for a small mark on one of the door frames." });
  s.obj({ id: "loose-brick", name: "Loose Brick", cat: "container", art: "brick", tint: "#7a4a3a", box: at(812, 330, 40, 20), required: true, item: "storage-key", desc: "A brick that doesn't sit flush with the others.", openText: "Behind the brick: a padlock key tagged “14”.", hint: "One brick in the right-hand wall is loose." });
  s.decor("extinguisher", 900, 300, 28, 68);

  s.area("unit", "Unit 14", shell({ wall: "metal", floor: "concrete", wallColor: "#4d5560", accent: "#2a2d31", floorColor: "#3a3836", darkness: 0.5, lights: [{ x: 500, y: 250, r: 180 }] }), { flags: ["opened:unit-14"], message: "Unit 14 is padlocked." });
  const shelves = s.decor("shelves-metal", 30, 210, 200, 240, { variant: "vance" });
  const board = s.decor("corkboard", 340, 90, 300, 190, { variant: "plain" });
  const table = s.decor("table", 330, 370, 320, 100);
  s.place("lamp-desk", on(table, 0, 0.12, 44, 56));
  s.decor("boxes-stack", 740, 360, 100, 100);
  s.decor("crate", 860, 390, 100, 80);
  s.obj({
    id: "case-copies", name: "Carbon Copies", cat: "evidence", art: "file-box", box: on(table, 0, 0.62, 70, 46), required: true,
    desc: "Box after box of carbon copies: every document Vance read about the fire, duplicated and hidden here.",
    ev: { id: "ev-case-copies", category: "record", significance: "Vance didn't trust headquarters with her evidence." },
  });
  s.obj({ id: "week-board", name: "Vance's Week", cat: "puzzle", art: "corkboard", box: board, desc: "Index cards describing Vance's last days, pinned in no particular order.", lock: { kind: "puzzle", puzzle: "vance-week" }, hint: "Put Vance's week in order on the board." });
  s.obj({ id: "thermos", name: "Thermos", cat: "environment", art: "thermos", box: on(shelves, 1, 0.3, 22, 52), desc: "Empty, still faintly warm-smelling of coffee. She was here recently." });
  s.token("token-c2-06", on(shelves, 2, 0.75, 20, 20), "Between two box files.");

  return {
    n: 16, id: "c2-06", title: "Storage Unit", location: "Harbour Street · Storage Units", difficulty: 3,
    description: "Identical doors, one new padlock, and the week Vance couldn't keep at headquarters.",
    briefing: "Vance rented a storage unit under her mother's maiden name. Somewhere in this row of identical shutters is where she kept the copies she didn't trust to headquarters.",
    objective: "Find Vance's unit, get inside, and reconstruct her last week in order.",
    facts: ["Timelines must agree with every dated clue in your notebook."],
    recall: ["ev-appointment-diary", "ev-cafe-receipt", "ev-pencil-rubbing"],
    scene: s.build(),
    puzzles: [
      {
        id: "vance-week", kind: "timeline", title: "Vance's Last Week",
        prompt: "Order the index cards from earliest to latest.",
        events: [
          { id: "hollowmere", text: "Searched Hollowmere House" },
          { id: "records", text: "Read the fire report in the Records Room" },
          { id: "train", text: "Caught the 23:50 from Platform 4" },
          { id: "cafe", text: "Met a “friend of E.H.” at Café Lune" },
          { id: "gate", text: "Went to the Larkspur east gate" },
          { id: "pell", text: "Interviewed Agnes Pell" },
        ],
        answer: ["records", "pell", "cafe", "hollowmere", "gate", "train"],
        clueRefs: ["ev-appointment-diary", "ev-cafe-receipt", "ev-pencil-rubbing"],
        hint: "Her diary gives the days and hours; the café receipt and the pencil rubbing fix the evening events.",
        successText: "Monday the records; Tuesday Pell, then the café at nine; Wednesday Hollowmere, the Larkspur gate at six — and the 23:50 north.",
        reward: { evidence: { id: "ev-vance-timeline", name: "Vance's Last Week", category: "record", description: "12 Oct: Records Room. 13 Oct: Agnes Pell (2 p.m.), Café Lune (9 p.m.). 14 Oct: Hollowmere House, Larkspur east gate (6 p.m.), the 23:50 from Platform 4.", significance: "Vance's movements up to the night train, in order.", related: ["ev-appointment-diary", "ev-pencil-rubbing"] } },
      },
    ],
    summary: "Behind unit 14's new padlock, Vance kept copies of everything. Her week, in order: the records, Agnes Pell, the café, Hollowmere House, the Larkspur gate — and the 23:50 train north.",
    reveal: "Vance's last known stop before the train was the Larkspur east gate.",
  };
}

/* ------------------------------------------------------------------ */
/* 17 · Evidence Locker                                                 */
/* ------------------------------------------------------------------ */
function l17(): LevelSpec {
  const s = new SceneBuilder("scene-c2-07");
  s.area("locker", "Evidence Room", shell({ wall: "metal", floor: "concrete", wallColor: "#4a5560", accent: "#2a2d31", floorColor: "#3a3d40", darkness: 0.45, lights: [{ x: 300, y: 200, r: 150 }, { x: 760, y: 120, r: 130, strength: 0.35 }] }));
  for (let i = 0; i < 5; i++) s.decor("locker", 20 + i * 52, 280, 50, 170);
  const desk = s.decor("desk", 300, 330, 260, 140, { tint: "#4a4a4a" });
  s.place("lamp-desk", on(desk, 0, 0.12, 40, 50));
  const chair = s.decor("chair", 570, 350, 64, 110, { tint: "#3a3a3a" });
  const coat = s.decor("coat", 566, 330, 70, 110, { tint: "#2a3a4a" });
  const cage = { x: 690, y: 220, w: 120, h: 230 };
  s.decor("fence", 650, 210, 340, 240, { tint: "#2a2d31" });
  s.decor("notice-board", 330, 120, 150, 110);

  s.obj({ id: "access-card", name: "Card in the Coat Pocket", cat: "item", art: "card-access", tint: "#7a2a2a", box: inside(coat, 0.62, 0.55, 36, 24), item: "clerk-card", required: true, desc: "The night clerk's access card, left in his coat while he takes his break.", hint: "The clerk's coat is on the chair." });
  s.obj({ id: "card-reader", name: "Cage Card Reader", cat: "container", art: "card-reader", box: at(820, 300, 30, 44), required: true, desc: "A card reader guarding the evidence cage.", lock: { kind: "item", item: "clerk-card", lockedText: "The reader blinks red. It needs an evidence-room card." }, openText: "The reader turns green and the cage door clicks.", hint: "The cage has a card reader beside it." });
  s.obj({ id: "fire-box", name: "Larkspur Exhibits Box", cat: "container", art: "file-box", tint: "#8a6a44", box: inside(cage, 0.5, 0.82, 80, 52), required: true, hiddenUntil: ["opened:card-reader"], desc: "A box marked LARKSPUR — EXHIBITS.", openText: "Inside: a length of chain, and the exhibit list." });
  s.obj({ id: "door-chain", name: "Length of Chain", cat: "evidence", art: "chain", box: inside(cage, 0.3, 0.6, 64, 22), required: true, hiddenUntil: ["opened:fire-box"], desc: "Heavy chain, blackened by fire, with two exhibit tags tied to it.", ev: { id: "ev-door-chain", category: "physical", significance: "The chain that held the lab door shut still exists." } });
  s.obj({
    id: "exhibit-log", name: "Exhibit List", cat: "document", art: "paper", box: inside(cage, 0.72, 0.58, 40, 50), required: true, hiddenUntil: ["opened:fire-box"],
    desc: "The exhibit list from the Larkspur fire.",
    doc: { title: "Exhibit list — Larkspur fire", style: "ledger", body: ["1 — Chain, outer door handle (collected 4 March).", "2 — Heater element, burned.", "3 — Ash sample, threshold.", "4 — Brass lighter, engraved — REMOVED 5 March by H. Finch “for analysis”. NOT RETURNED."] },
    ev: { id: "ev-exhibit-log", category: "record", significance: "An engraved brass lighter from the fire was removed by Finch and never returned." },
  });
  s.obj({
    id: "tag-rules", name: "Evidence Rules Poster", cat: "document", art: "notice-board", box: at(330, 120, 150, 110), required: true,
    desc: "A poster of evidence-room rules.",
    doc: { title: "Evidence handling rules", style: "typed", body: ["Rule 3: All exhibit tags are stamped in RED ink on the day of collection.", "Rule 4: Tags may never be replaced."] },
    ev: { id: "ev-tag-rules", category: "document", significance: "Genuine tags are stamped in red on the day of collection." },
  });
  s.obj({ id: "tag-bench", name: "Exhibit Tags", cat: "puzzle", art: "luggage-tag", box: inside(cage, 0.3, 0.42, 40, 26), hiddenUntil: ["opened:fire-box"], requires: { flags: ["found:door-chain"], message: "Look at the chain first." }, desc: "Two tags on the chain disagree with each other.", lock: { kind: "puzzle", puzzle: "genuine-tag" }, hint: "Compare the two tags on the chain." });
  void chair;
  s.token("token-c2-07", on(desk, 0, 0.85, 20, 20), "On the clerk's desk.");

  return {
    n: 17, id: "c2-07", title: "Evidence Locker", location: "Wrenmoor C.I.D. · Evidence Room", difficulty: 3,
    description: "The physical evidence from the fire still exists — most of it.",
    briefing: "If the Larkspur exhibits survived, they're in the evidence cage. The night clerk is on his break. You have a few minutes.",
    objective: "Get into the evidence cage, examine the Larkspur exhibits, and decide which tag is genuine.",
    facts: ["Finch's draft mentioned a brass lighter at the fire's origin."],
    recall: ["ev-draft-report", "ev-signout-sheet"],
    scene: s.build(),
    puzzles: [
      {
        id: "genuine-tag", kind: "choice", title: "Two Exhibit Tags",
        prompt: "Two tags are tied to the chain.",
        question: "Which tag is genuine?",
        options: [
          { id: "a", text: "Tag A — red stamp, 4 March: “Outer door handle, east wing”" },
          { id: "b", text: "Tag B — blue stamp, 6 March: “Found loose on lab floor”" },
        ],
        answer: "a",
        clueRefs: ["tag-rules", "exhibit-log"],
        hint: "The rules say what colour genuine stamps are, and the exhibit list gives the collection date.",
        successText: "Tag A is genuine. Tag B was added later to make the chain look like lab clutter.",
        reward: { evidence: { id: "ev-genuine-tag", name: "The Genuine Tag", category: "physical", description: "Red-stamped tag, 4 March: chain recovered from the OUTER door handle. A forged blue tag dated 6 March claims it lay loose on the floor.", significance: "Someone forged a tag to hide that the door was chained from outside.", related: ["ev-door-chain", "ev-chained-door-photo"] } },
      },
    ],
    summary: "The chain from the laboratory door survives, with a genuine tag proving it was taken from the outer handle. A forged tag tried to say otherwise — and the engraved brass lighter was removed by Finch and never returned.",
    reveal: "Someone tampered with the evidence. The lighter at the fire's origin vanished in Finch's hands.",
  };
}

/* ------------------------------------------------------------------ */
/* 18 · Abandoned Café                                                  */
/* ------------------------------------------------------------------ */
function l18(): LevelSpec {
  const napkinCipher = caesar("LARKSPUR TUNNEL", 5);
  const s = new SceneBuilder("scene-c2-08");
  s.area("cafe", "Café Lune", shell({ wall: "stripes", floor: "checker", wallColor: "#3a2f2a", accent: "#c9a46a", floorColor: "#d8d0bc", darkness: 0.5, lights: [{ x: 520, y: 280, r: 150 }, { x: 160, y: 140, r: 100, strength: 0.3 }] }));
  s.decor("window", 50, 80, 150, 180, { variant: "rain" });
  s.decor("blackboard", 300, 80, 200, 120);
  s.decor("chandelier", 470, 0, 130, 80);
  const counter = s.decor("counter", 650, 320, 340, 140, { tint: "#4a2f1d" });
  const reg = { ...on(counter, 0, 0.3, 70, 58), art: "register" };
  s.place("pots", on(counter, 0, 0.75, 70, 46));
  const table = s.decor("table-cloth", 360, 370, 230, 100, { tint: "#efe4cc" });
  s.decor("chair", 300, 360, 64, 110, { tint: "#3a2a1a" });
  s.decor("chair", 590, 360, 64, 110, { tint: "#3a2a1a", flip: true });
  s.decor("table-cloth", 40, 400, 170, 90, { tint: "#d8ccb0" });

  s.obj({ id: "table-card", name: "Table Number Card", cat: "evidence", art: "card-calling", box: on(table, 0, 0.12, 30, 20), required: true, desc: "A little folded card: TABLE 5.", ev: { id: "ev-table-five", category: "environmental", significance: "Vance's meeting was at table five." }, hint: "There's a number card on the middle table." });
  s.obj({ id: "cups", name: "Two Coffee Cups", cat: "environment", art: "teacup", box: on(table, 0, 0.35, 44, 28), desc: "Two cups, never cleared. Vance's shade of lipstick on one rim." });
  s.obj({
    id: "napkin", name: "Napkin with Letters", cat: "document", art: "note", box: on(table, 0, 0.62, 34, 40), required: true,
    desc: "A napkin covered in neat capitals that make no sense.",
    doc: { title: "Napkin", style: "handwritten", body: [napkinCipher, "For M.V. — count on by our table number."] },
    ev: { id: "ev-napkin", category: "document", significance: "A coded message left for Vance at the café." },
    hint: "A napkin on the table is covered in letters.",
  });
  s.obj({ id: "menu-back", name: "Back of a Menu", cat: "puzzle", art: "paper", box: on(table, 0, 0.85, 36, 46), desc: "Vance started decoding on the back of a menu, then stopped.", lock: { kind: "puzzle", puzzle: "napkin-cipher" }, hint: "Finish decoding on the back of the menu." });
  s.obj({ id: "cash-register", name: "Cash Register", cat: "container", art: "register", box: reg, required: true, desc: "The café's brass register. The drawer isn't locked.", openText: "Under the cash tray: the café's tab book.", hint: "Check the register on the counter." });
  s.obj({
    id: "tab-book", name: "Tab Book", cat: "document", art: "ledger", box: on(counter, 0, 0.12, 50, 40), required: true, hiddenUntil: ["opened:cash-register"],
    desc: "The book of customer accounts.",
    doc: { title: "Café Lune — accounts", style: "ledger", body: ["13 Oct, 9:12 p.m. — Table 5 — two coffees — on the account of DR. H. CRANE.", "Note: Doctor asked for the back table, as always."] },
    ev: { id: "ev-cafe-tab", category: "record", significance: "Dr. Helena Crane paid for Vance's coffee meeting at table five." },
  });
  s.token("token-c2-08", on(table, 0, 0.47, 20, 20), "It was under a saucer — left for whoever sat at table five.");

  return {
    n: 18, id: "c2-08", title: "Abandoned Café", location: "Harbour Street · Café Lune", difficulty: 3,
    description: "Two cups, a coded napkin and a tab that names the stranger.",
    briefing: "Café Lune closed its doors the week Vance disappeared. The chairs are still out. Whoever she met here on the 13th left more behind than two coffee cups.",
    objective: "Decode the napkin, find out who paid for the meeting, and identify the “friend of E.H.”",
    facts: ["Vance met someone at table five at 9:12 p.m. on 13 October."],
    recall: ["ev-burned-letter", "ev-cafe-receipt"],
    scene: s.build(),
    puzzles: [
      {
        id: "napkin-cipher", kind: "cipher", title: "The Napkin Code", cipherText: napkinCipher, shift: 5, answer: "LARKSPUR TUNNEL",
        prompt: "Decode the napkin's message.",
        clueRefs: ["napkin", "table-card"],
        hint: "“Count on by our table number.” The table card says 5. Shift each letter back by five.",
        successText: "LARKSPUR TUNNEL.",
        reward: { evidence: { id: "ev-napkin-decoded", name: "Decoded Napkin", category: "document", description: "The napkin reads: LARKSPUR TUNNEL.", significance: "Vance's contact pointed her to a tunnel beneath Larkspur.", related: ["ev-napkin"] } },
      },
    ],
    deductions: [
      {
        id: "d-friend", title: "The Friend of E.H.",
        question: "Who was the “friend of E.H.” that Vance met at Café Lune?",
        conclusions: [
          { id: "crane", text: "Dr. Helena Crane" },
          { id: "reed", text: "Julian Reed" },
          { id: "pell", text: "Agnes Pell" },
        ],
        answer: "crane",
        evidence: ["ev-cafe-tab", "ev-burned-letter", "ev-napkin-decoded"],
        hint: "The letter set up the meeting, the tab says who paid, and the napkin says what only Elias's rescuer would know.",
        successText: "Helena Crane wrote to Vance, paid for the coffee, and told her about the Larkspur tunnel — the way Elias escaped.",
        wrongConclusionText: "Check the tab book: whose account paid for table five?",
      },
    ],
    summary: "Dr. Helena Crane paid for the meeting at table five, and her coded napkin pointed Vance to the Larkspur tunnel — the route Elias used to escape the fire.",
    reveal: "Helena Crane is Elias's protector, and she trusted Vance with his secret.",
  };
}

/* ------------------------------------------------------------------ */
/* 19 · Detective's Safehouse                                           */
/* ------------------------------------------------------------------ */
function l19(): LevelSpec {
  const s = new SceneBuilder("scene-c2-09");
  s.area("safehouse", "Vance's Safehouse", shell({ wall: "brick", floor: "boards", wallColor: "#5a3a30", accent: "#2a1a14", floorColor: "#4a3020", darkness: 0.45, lights: [{ x: 480, y: 300, r: 160 }] }));
  s.decor("window", 60, 90, 110, 160, { variant: "rain" });
  s.decor("cot", 30, 400, 230, 76);
  const map = s.decor("map-wall", 300, 90, 240, 160);
  const table = s.decor("table", 330, 370, 280, 100);
  s.place("lamp-desk", on(table, 0, 0.88, 44, 56));
  s.place("radio", on(table, 0, 0.6, 60, 44));
  const shelf = s.decor("shelf-wall", 700, 220, 220, 22);
  s.place("bottle", on(shelf, 0, 0.15, 16, 46));
  s.decor("coat-rack", 880, 260, 70, 200);
  s.decor("rug-rect", 300, 490, 360, 70, { tint: "#3a2a2a" });

  s.obj({ id: "father-photo", name: "Framed Photograph", cat: "evidence", art: "photo", box: on(table, 0, 0.32, 46, 36), required: true, desc: "A framed photograph of an older police sergeant. Inscribed: “Sgt. T. Vance — Badge 2214. Proud of you, Margot.”", ev: { id: "ev-badge-photo", category: "photograph", significance: "Vance's father's badge number was 2214." }, hint: "There's a framed photo on the table." });
  s.obj({ id: "telephone-pad", name: "Telephone Notepad", cat: "document", art: "paper", box: on(shelf, 0, 0.55, 40, 50), required: true, desc: "Notes scribbled beside a telephone number.", doc: { title: "Notepad", style: "handwritten", body: ["Rang Larkspur 13 Oct. Dr. Crane's secretary: “Doctor will meet you at the east gate, six o'clock.”", "Ask about the tunnel. Don't say it on the telephone."] }, ev: { id: "ev-phone-pad", category: "document", significance: "Crane arranged to meet Vance at the east gate at six." } });
  s.obj({ id: "route-map", name: "Route Map", cat: "evidence", art: "map-wall", box: map, required: true, desc: "Vance's map: red string from Hollowmere House to Larkspur, then to Wrenmoor Central station — and on, north, to a pin labelled only “N.”", ev: { id: "ev-route-map", category: "document", significance: "Vance's route ran from Larkspur to the station and north to “N.”" } });
  s.obj({ id: "loose-board", name: "Loose Floorboard", cat: "container", art: "floorboard", box: floor(780, 540, 120, 22), required: true, desc: "One floorboard sits a little proud of the rest.", openText: "Beneath the board is a small floor safe.", hint: "A floorboard by the coat rack is loose." });
  s.obj({ id: "floor-safe", name: "Floor Safe", cat: "puzzle", art: "safe", box: floor(780, 548, 70, 60), hiddenUntil: ["opened:loose-board"], desc: "A small safe set into the joists, with a four-digit dial.", lock: { kind: "puzzle", puzzle: "safe-code" }, openText: "The safe holds a single sealed envelope." });
  s.obj({
    id: "vance-letter", name: "Letter: “To Whoever Follows”", cat: "document", art: "sealed-envelope", box: floor(860, 556, 56, 36), required: true, hiddenUntil: ["opened:floor-safe"],
    desc: "A sealed envelope in Vance's hand: “To whoever follows me.”",
    doc: {
      title: "To whoever follows me",
      style: "handwritten",
      body: [
        "If you're reading this, I didn't come back. Don't trust headquarters with what you find — someone there has been paid before.",
        "H.C. is a friend. J.R. is not.",
        "The Larkspur east gate code is 407. If the gatehouse log says I left on foot for the station, believe it.",
        "I'm following E.H. If I'm right, he's been nearer than anyone thinks — and further.",
      ],
      signature: "Margot Vance",
    },
    ev: { id: "ev-vance-letter", category: "document", significance: "Vance trusted Crane, distrusted Reed, and left the east gate code: 407." },
  });
  s.token("token-c2-09", on(shelf, 0, 0.85, 20, 20), "On the shelf beside the bottle.");

  return {
    n: 19, id: "c2-09", title: "Detective's Safehouse", location: "Dock Road · A Rented Room", difficulty: 3,
    description: "The room Vance rented under another name, and the letter she left in the floor.",
    briefing: "The storage unit's rental papers led to a second address: a room on Dock Road, rented in the same false name. Vance spent her nights here, not at home.",
    objective: "Search the safehouse, open Vance's hidden safe, and read what she left for whoever came after her.",
    facts: ["Vance's father was also a police officer."],
    recall: ["ev-vance-father", "ev-vance-timeline"],
    scene: s.build(),
    puzzles: [
      { id: "safe-code", kind: "code", title: "Floor Safe", charset: "digits", answer: "2214", prompt: "A four-digit dial.", clueRefs: ["father-photo"], hint: "Vance used a number that mattered to her family.", successText: "2 — 2 — 1 — 4. Her father's badge number." },
    ],
    summary: "Vance's safe held a letter for whoever followed her: Helena Crane is a friend, Julian Reed is not, headquarters can't be trusted — and the Larkspur east gate code is 407.",
    reveal: "Vance knew she was being watched, and she named Julian Reed as the danger.",
  };
}

/* ------------------------------------------------------------------ */
/* 20 · The Missing Detective's Last Location                           */
/* ------------------------------------------------------------------ */
function l20(): LevelSpec {
  const s = new SceneBuilder("scene-c2-10");
  s.area("gate", "Larkspur East Gate", shell({ kind: "exterior", wall: "brick", floor: "cobbles", wallColor: "#4a3a30", accent: "#2a2a2a", floorColor: "#4a4a50", sky: "storm", weather: "rain", darkness: 0.5, lights: [{ x: 140, y: 120, r: 170 }] }));
  s.decor("tree-pine", 880, 140, 130, 320);
  s.decor("streetlamp", 120, 180, 44, 280);
  const gateBox = { x: 380, y: 240, w: 260, h: 210 };
  s.decor("gate", gateBox.x, gateBox.y, gateBox.w, gateBox.h);
  s.decor("fence", 640, 330, 240, 120, { tint: "#1d1f22" });
  s.decor("fence", 140, 330, 240, 120, { tint: "#1d1f22" });
  s.decor("sign-post", 300, 270, 80, 190, { tint: "#2c3e5c", variant: "LARKSPUR|EAST GATE|PRIVATE" });
  s.decor("puddle", 420, 520, 200, 30);
  s.decor("puddle", 120, 560, 140, 24);

  s.obj({ id: "vance-glove", name: "Glove on the Fence", cat: "evidence", art: "glove", box: at(700, 316, 34, 42), rotate: 20, required: true, desc: "A woman's leather glove caught on the fence spikes. Size six — Vance's size.", ev: { id: "ev-vance-glove", category: "physical", significance: "Vance was at the Larkspur east gate." }, hint: "Something is snagged on the right-hand fence." });
  s.obj({ id: "saloon-tracks", name: "Tyre Tracks", cat: "evidence", art: "tire-track", box: floor(760, 560, 200, 30), required: true, desc: "Wide tyre tracks from a heavy saloon that waited here with its engine running — a puddle of oil where it idled.", ev: { id: "ev-saloon-tracks", category: "environmental", significance: "A large car waited outside the gate while Vance was inside." }, hint: "Look at the ground on the right." });
  s.obj({ id: "gate-keypad", name: "Gate Keypad", cat: "exit", art: "keypad", box: at(646, 300, 34, 46), exitTo: "gatehouse", desc: "A brass keypad beside the east gate.", lock: { kind: "puzzle", puzzle: "gate-code" }, openText: "The gate unlatches. You slip through to the gatehouse.", hint: "The keypad needs the code Vance left you." });
  s.token("token-c2-10", at(180, 450, 20, 20), "At the foot of the streetlamp.");

  s.area("gatehouse", "Gatehouse", shell({ wall: "planks", floor: "boards", wallColor: "#4a3a2c", accent: "#2a1a14", floorColor: "#3a2a1c", darkness: 0.45, lights: [{ x: 450, y: 280, r: 150 }] }), { flags: ["opened:gate-keypad"], message: "The gate is locked." });
  s.decor("window", 640, 90, 130, 170, { variant: "rain" });
  const desk = s.decor("desk", 300, 310, 300, 160, { tint: "#4a3a2c" });
  s.place("lamp-desk", on(desk, 0, 0.12, 44, 56));
  s.place("radio", on(desk, 0, 0.85, 60, 44));
  s.decor("coat-rack", 820, 260, 70, 200);
  s.decor("chair", 610, 360, 64, 110);
  s.obj({
    id: "visitor-log", name: "Visitor Log", cat: "document", art: "ledger", box: on(desk, 0, 0.4, 64, 50), required: true,
    desc: "The gatehouse visitor log.",
    doc: { title: "East Gate — visitor log", style: "ledger", body: ["14 Oct, 18:10 — Visitor 7 (Insp. M. Vance). Escort: Dr. H. Crane.", "14 Oct, 19:40 — Visitor 7 out, on foot, toward the station road. Dr. Crane remained."] },
    ev: { id: "ev-gate-log", category: "record", significance: "Vance left Larkspur on foot for the station at 19:40; Crane was the last known person with her." },
    hint: "The visitor log is on the desk.",
  });
  s.obj({
    id: "guard-note", name: "Guard's Note", cat: "document", art: "note", box: on(desk, 0, 0.62, 34, 42), required: true,
    desc: "A note left for the day guard.",
    doc: { title: "Night guard's note", style: "handwritten", body: ["Black saloon parked outside the east gate 18:00–19:45. Driver never got out. Pulled away after the lady left on foot.", "Plate started MU- … couldn't see the rest in the rain."] },
    ev: { id: "ev-black-saloon", category: "testimony", significance: "A black saloon (plate MU-…) waited for Vance and followed when she left." },
  });

  return {
    n: 20, id: "c2-10", title: "The Missing Detective's Last Location", location: "Larkspur Institute · East Gate", difficulty: 3,
    description: "The last place anyone in Wrenmoor admits to seeing Margot Vance.",
    briefing: "Wednesday, 14 October, six o'clock: Vance came to the Larkspur east gate to meet Dr. Helena Crane. After that, the police trail goes dark. Tonight it's raining again.",
    objective: "Search the gate, use Vance's code to reach the gatehouse, and establish who last saw her.",
    facts: ["Vance's letter gives the east gate code.", "A heavy car seems to have been here."],
    recall: ["ev-vance-letter", "ev-red-clay", "ev-phone-pad"],
    scene: s.build(),
    puzzles: [
      { id: "gate-code", kind: "code", title: "East Gate Keypad", charset: "digits", answer: "407", prompt: "Enter the three-digit gate code.", clueRefs: ["ev-vance-letter"], hint: "Vance wrote the code in her letter from the safehouse.", successText: "4 — 0 — 7. The gate unlatches." },
    ],
    deductions: [
      {
        id: "d-last-seen", title: "Last Seen",
        question: "Who was the last person known to have seen Vance in the city?",
        conclusions: [
          { id: "crane", text: "Dr. Helena Crane, at the Larkspur east gate" },
          { id: "reed", text: "Julian Reed, at the museum" },
          { id: "pell", text: "Agnes Pell, at her flat" },
        ],
        answer: "crane",
        evidence: ["ev-gate-log", "ev-vance-glove"],
        hint: "Her glove proves she was here. The gatehouse log says who escorted her.",
        successText: "Helena Crane escorted Vance in at 18:10 and saw her leave at 19:40. And a black saloon was waiting.",
      },
    ],
    summary: "Vance came to the Larkspur east gate, met Dr. Helena Crane, and left on foot toward the station at 19:40. A black saloon with a plate beginning MU- waited outside — and pulled away when she did.",
    reveal: "Someone was following Vance. To learn what Crane told her, you'll have to get inside Larkspur.",
  };
}

export const CH2_LEVELS = [l11(), l12(), l13(), l14(), l15(), l16(), l17(), l18(), l19(), l20()].map((s) => makeLevel(s, "ch2", itemName));
