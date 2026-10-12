import type { InventoryItemDefinition, ItemCategory } from "../types";

function item(id: string, name: string, art: string, category: ItemCategory, description: string, consumable = false, tint?: string): InventoryItemDefinition {
  return { id, name, art, category, description, consumable, tint };
}

/* Chapter 1 — The Abandoned Mansion */
const CH1 = [
  item("brass-key", "Brass Key", "key", "key", "A small brass key, warm from the lamp. The bow is stamped with a wren.", true),
  item("wardrobe-key", "Wardrobe Key", "key-small", "key", "A tiny key wrapped in a slip of paper marked “W.”", true),
  item("oil-lantern", "Empty Lantern", "lantern", "tool", "A hurricane lantern with oil but no flame.", true),
  item("matches", "Café Lune Matchbook", "matchbook", "tool", "Half the matches are gone. Café Lune, Harbour Street.", true),
  item("lit-lantern", "Lit Lantern", "lantern", "tool", "The wick takes. Warm light spills across the floorboards."),
  item("basement-key", "Basement Key", "key-ornate", "key", "An iron key tagged “CELLAR” in faded ink.", true),
  item("flashlight-empty", "Flashlight (no battery)", "flashlight", "tool", "A police-issue flashlight. The battery compartment is empty.", true),
  item("battery", "Battery", "battery", "component", "A fresh dry-cell battery.", true),
  item("flashlight", "Flashlight", "flashlight", "tool", "Working now — a strong, steady beam."),
  item("crowbar", "Crowbar", "crowbar", "tool", "Heavy, rusted, still strong.", false),
  item("photo-frag-a", "Photo Fragment (left)", "photo-torn", "fragment", "The left third of a torn photograph: a man in a grey coat.", true),
  item("photo-frag-b", "Photo Fragment (middle)", "photo-torn", "fragment", "The middle of a torn photograph: a woman in a lab coat.", true),
  item("photo-frag-c", "Photo Fragment (right)", "photo-torn", "fragment", "The right third of a torn photograph: a man in a hat.", true),
  item("photo-ab", "Partial Photograph", "photo", "fragment", "Two pieces of the photograph, matched along the tear.", true),
  item("photo-set", "Complete Photo Pieces", "photo", "fragment", "All three pieces. They need careful reassembly."),
  item("brass-gear", "Large Brass Gear", "gear", "component", "A toothed brass wheel, the size of a palm.", true),
  item("small-gear", "Small Steel Gear", "gear", "component", "A smaller gear with a square axle hole.", true, "#9aa3ae"),
  item("gear-assembly", "Gear Assembly", "gear", "component", "The two gears pinned together on one axle.", true),
];

/* Chapter 2 — The Missing Detective */
const CH2 = [
  item("soft-pencil", "Soft Pencil", "pen", "tool", "A soft 6B drawing pencil. Good for rubbing over indentations.", false, "#3a3a30"),
  item("filing-key", "Filing Cabinet Key", "key-small", "key", "A small key tagged “FILES — M.V.”", true, "#9aa3ae"),
  item("car-key", "Car Key", "key", "key", "A car key on a leather fob: “Austin — WM 214.”", true, "#9aa3ae"),
  item("sewing-key", "Tiny Brass Key", "key-small", "key", "A tiny key, found in the sugar bowl.", true),
  item("records-key", "Records Room Key", "key-ornate", "key", "A heavy key on a brass ring: “RECORDS — B.”", true),
  item("storage-key", "Padlock Key", "key-small", "key", "A padlock key with a cardboard tag: “14”.", true, "#9aa3ae"),
  item("clerk-card", "Clerk's Access Card", "card-access", "card", "An evidence-room access card belonging to the night clerk.", true, "#7a2a2a"),
];

/* Chapter 3 — The Secret Laboratory */
const CH3 = [
  item("visitor-card", "Visitor Card", "card-access", "card", "LARKSPUR INSTITUTE — VISITOR 9. The magnetic stripe still works.", false, "#3f7a5a"),
  item("chemstore-key", "Chemical Store Key", "key-ornate", "key", "A key with a red enamel tag: “CHEM STORE — HAZARD”.", true, "#c85a4a"),
  item("lily-extract", "Lily Extract", "vial", "component", "A pale extract distilled from midnight lilies.", true, "#e8e0f0"),
  item("solvent", "Ethanol Solvent", "bottle", "component", "A small bottle of laboratory ethanol.", true, "#9fc3d1"),
  item("lantern-reagent", "Lantern Reagent", "vial", "tool", "Elias's “Lantern” reagent. A drop turns invisible iron-gall ink dark and legible.", false, "#5fa58a"),
  item("rubber-gloves", "Rubber Gloves", "glove", "tool", "Thick laboratory gloves.", false, "#c9a040"),
  item("vacuum-valve", "Vacuum Valve", "test-tube", "component", "A glass amplifier valve, filament intact.", true, "#d8c39a"),
  item("tape-reel", "Tape Reel “E.H. 4/3”", "reel-tape", "component", "A reel of recording tape labelled “E.H. — 4 March”.", true),
  item("screwdriver", "Screwdriver", "screwdriver", "tool", "A long-shafted screwdriver."),
];

/* Chapter 4 — The Midnight Witness */
const CH4 = [
  item("magnet", "Horseshoe Magnet", "lens", "tool", "A strong horseshoe magnet from a child's toy.", true, "#b02a2a"),
  item("string", "Ball of String", "rope", "tool", "Garden twine, still on its ball.", true, "#c9b48a"),
  item("magnet-line", "Magnet on a String", "lens", "tool", "A magnet tied to a length of twine — for fishing in drains.", false, "#b02a2a"),
  item("drawer-key", "Till Drawer Key", "key-small", "key", "Found under the shop cat's bowl.", true),
  item("notice-key", "Notice Case Key", "key-small", "key", "A small key stamped WRENMOOR TRANSPORT.", true, "#9aa3ae"),
  item("suitcase-key", "Suitcase Key", "key-small", "key", "A suitcase key, hidden under a mattress.", true),
  item("mailbox-key", "Mailbox Key No. 6", "key-small", "key", "A brass key on a tag: 6. (Or is it 9? It's 6.)", true),
  item("saloon-keys", "Museum Car Keys", "keyring", "key", "Keys on a ring stamped WRENMOOR MUSEUM — MU 1.", true),
  item("note-piece-a", "Torn Note (piece)", "note-torn", "fragment", "A torn piece of a handwritten note.", true),
  item("note-piece-b", "Torn Note (piece)", "note-torn", "fragment", "Another torn piece of the same note.", true),
  item("note-pieces", "Torn Note Pieces", "note-torn", "fragment", "The pieces of the note, ready to be laid out."),
  item("porter-key", "Porter's Key", "key-ornate", "key", "A heavy railway key: LAMP ROOM — PLATFORM 4.", true),
];

export const ITEM_LIST: InventoryItemDefinition[] = [...CH1, ...CH2, ...CH3, ...CH4];

export const ITEMS: Record<string, InventoryItemDefinition> = Object.fromEntries(ITEM_LIST.map((i) => [i.id, i]));

export function getItem(id: string): InventoryItemDefinition | undefined {
  return ITEMS[id];
}

export function itemName(id: string): string {
  return ITEMS[id]?.name ?? id;
}
