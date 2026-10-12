import type { ChapterDefinition } from "../types";

/**
 * Story spine (for authors):
 *
 * Twenty years ago Professor Elias Hollowmere "died" when the east-wing
 * laboratory of his Larkspur Institute burned. In truth his secretary,
 * Julian Reed, had been selling pieces of the Hollowmere collection and
 * replacing them with forgeries. When Elias found out, Reed barred the lab
 * door and set the fire, taking the Hollowmere Orrery — the key to
 * Elias's private archive. Elias escaped through the service tunnel and,
 * with the help of his partner Dr. Helena Crane, hid at the Northreach
 * research station. A bribed fire investigator (Harold Finch) ruled the
 * fire an accident.
 *
 * Now Reed is curator of the Wrenmoor Museum. Inspector Margot Vance
 * reopened the cold case, found Elias's trail at Hollowmere House and took
 * the northbound night train to Northreach on 14 October. Reed followed
 * her, then paid night porter Thomas Webb to swear she had gone south.
 * Vance found Elias; together they returned in secret to the Hidden
 * Archive beneath the city, where Elias's evidence lies sealed behind an
 * orrery lock. To keep it shut, Reed staged the theft of the Orrery from
 * his own exhibition. The player follows Vance's trail, recovers the
 * Orrery, opens the archive and proves the whole truth.
 */
export const CHAPTERS: ChapterDefinition[] = [
  {
    id: "ch1",
    number: 1,
    title: "The Abandoned Mansion",
    subtitle: "Hollowmere House",
    summary:
      "Inspector Margot Vance has vanished. Her last known stop was Hollowmere House, shut up since its owner died in a laboratory fire twenty years ago. Someone has been inside recently.",
    closing:
      "Vance was not chasing ghosts. She believed the Larkspur fire was no accident — and she carried a Larkspur access card when she left the mansion.",
    prerequisites: [],
    accent: "#8e2f2f",
  },
  {
    id: "ch2",
    number: 2,
    title: "The Missing Detective",
    subtitle: "Retracing Margot Vance",
    summary: "Return to the city and retrace Vance's final week: her office, her witnesses, her car, and the safehouse nobody knew she kept.",
    closing:
      "Vance learned that the official fire report had been rewritten. Her last stop in the city was the gate of the Larkspur Institute — where Dr. Helena Crane still works.",
    prerequisites: ["c1-10"],
    accent: "#2c5a7a",
  },
  {
    id: "ch3",
    number: 3,
    title: "The Secret Laboratory",
    subtitle: "Larkspur Institute",
    summary: "The institute Elias Hollowmere founded still runs behind locked doors. Its records hold the night of the fire.",
    closing:
      "The fire started outside a door that was barred from the corridor. The entry log puts J.R. in the east wing minutes before — and the hidden laboratory shows Elias walked away alive.",
    prerequisites: ["c2-10"],
    accent: "#3f7a5a",
  },
  {
    id: "ch4",
    number: 4,
    title: "The Midnight Witness",
    subtitle: "Thomas Webb's statement",
    summary: "A night porter swears he saw Vance board the southbound train at midnight on 14 October. The rain, the clocks and the timetables disagree.",
    closing:
      "Webb lied. Vance went north, and someone paid for his silence with an envelope bearing the museum's stamp.",
    prerequisites: ["c3-10"],
    accent: "#4a5a8a",
  },
  {
    id: "ch5",
    number: 5,
    title: "Secrets of the Manor",
    subtitle: "Hollowmere House revisited",
    summary: "Back at Hollowmere House with the Larkspur reagent, invisible ink becomes legible. The family archive remembers what Julian Reed did.",
    closing:
      "Elias discovered forgeries in his own collection and planned to expose Reed. His final note names the Orrery as the key to his archive — and Northreach as his refuge.",
    prerequisites: ["c4-10"],
    accent: "#7a5a2a",
  },
  {
    id: "ch6",
    number: 6,
    title: "The Last Train",
    subtitle: "The Northern Night Mail",
    summary: "The 23:50 northbound night mail kept its manifests. Vance travelled in sleeper 7. Someone else boarded carriage 3.",
    closing:
      "Reed was on the train. Vance stepped off at Northreach Halt; Reed rode back to the city, where the Orrery was about to go on display.",
    prerequisites: ["c5-10"],
    accent: "#5a2a3a",
  },
  {
    id: "ch7",
    number: 7,
    title: "The Stolen Artifact",
    subtitle: "Wrenmoor Museum",
    summary: "On opening night the Hollowmere Orrery disappears from its case. Curator Julian Reed blames professional thieves.",
    closing:
      "The theft was staged with the curator's own key. You recover the true Orrery from Reed's vault before it can vanish for good.",
    prerequisites: ["c6-10"],
    accent: "#b8924a",
  },
  {
    id: "ch8",
    number: 8,
    title: "The Frozen Evidence",
    subtitle: "Northreach Station",
    summary: "At the snowbound research station Elias hid for twenty years, the trail turns cold — and so does the evidence he preserved.",
    closing:
      "In the sealed chamber Elias kept the lighter found at the fire's origin, engraved J.R. Vance's last note says she has taken Elias to the archive beneath the city.",
    prerequisites: ["c7-10"],
    accent: "#6a9ab0",
  },
  {
    id: "ch9",
    number: 9,
    title: "The Hidden Archive",
    subtitle: "Beneath the Records Hall",
    summary: "Everything Elias gathered for twenty years is filed beneath Wrenmoor. Your earlier discoveries are the keys.",
    closing:
      "The original case file is restored: Finch's bribe, Reed's sales ledger and Elias's sworn account. Only the final proof — and Vance herself — remain.",
    prerequisites: ["c8-10"],
    accent: "#6b4a7a",
  },
  {
    id: "ch10",
    number: 10,
    title: "The Final Truth",
    subtitle: "Every clue tells a story",
    summary: "Return to every place the case has taken you. Assemble the proof. Find Margot Vance. Name the person responsible.",
    closing: "The case of Hollowmere House is closed.",
    prerequisites: ["c9-10"],
    accent: "#e0c27a",
  },
];
