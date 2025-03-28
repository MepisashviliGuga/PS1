// This file is for utility functions that might be helpful
// for both implementation and testing code.
// Place any reusable helper functions here.
import { Flashcard } from "./flashcards";
// Example utility function (you can remove this):
/**
 * Adds two numbers together.
 * @param a first number
 * @param b second number
 * @returns sum of a and b
 */
export function add(a: number, b: number): number {
  return a + b;
}
export function createGeneralCard(name: string): Flashcard{
  return new Flashcard(name, "general", "general", [])
}