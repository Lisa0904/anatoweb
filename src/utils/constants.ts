// src/utils/constants.ts

// Definiert alle möglichen Themengebiete in AnatoWeb
export type AnatomyTopic = 
  "Alle" 
  | "Muskeln" 
  | "Skelett" 
  | "Kreislaufsystem" 
  | "Organe"
  | "Ganzer Mensch";

// Array für die Anzeige/Filterung (Quiz, Flashcards, ModelPage)
export const TOPIC_OPTIONS_ALL: AnatomyTopic[] = [
  "Alle", 
  "Muskeln", 
  "Skelett", 
  "Kreislaufsystem", 
  "Organe"
];

// Speziell für die ModelPage, da "Alle" dort "Ganzer Mensch" bedeutet
export const TOPIC_OPTIONS_MODEL: AnatomyTopic[] = [
  "Ganzer Mensch", 
  "Muskeln", 
  "Skelett", 
  "Kreislaufsystem", 
  "Organe"
];