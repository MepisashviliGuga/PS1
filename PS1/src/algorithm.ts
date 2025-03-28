/**
 * Problem Set 1: Flashcards - Algorithm Functions
 *
 * This file contains the implementations for the flashcard algorithm functions
 * as described in the problem set handout.
 *
 * Please DO NOT modify the signatures of the exported functions in this file,
 * or you risk failing the autograder.
 */

import { Flashcard, AnswerDifficulty, BucketMap } from "./flashcards";
import { expect } from "chai";
import { createGeneralCard } from "../src/utils";
/**
 * Converts a Map representation of learning buckets into an Array-of-Set representation.
 *
 * @param buckets Map where keys are bucket numbers and values are sets of Flashcards.
 * @returns Array of Sets, where element at index i is the set of flashcards in bucket i.
 *          Buckets with no cards will have empty sets in the array.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
export function toBucketSets(buckets: BucketMap): Array<Set<Flashcard>> {
  if (buckets.size === 0)
    return [];

  const maxBucket = Math.max(...Array.from(buckets.keys()));

  const result: Array<Set<Flashcard>> = Array.from(
    { length: maxBucket + 1},
    () => new Set<Flashcard>()
  );

  buckets.forEach((cards, bucketIndex) => {
    result[bucketIndex] = cards;
  });

  return result;
}

/**
 * Finds the range of buckets that contain flashcards, as a rough measure of progress.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @returns object with minBucket and maxBucket properties representing the range,
 *          or undefined if no buckets contain cards.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
export function getBucketRange(
  buckets: Array<Set<Flashcard>>
): { minBucket: number; maxBucket: number } | undefined {
  let minBucket: number | undefined = undefined;
   let maxBucket: number | undefined = undefined;
 
   buckets.forEach((cards, bucketIndex) => {
     if (cards.size > 0) {
       if (minBucket === undefined) minBucket = bucketIndex;
       maxBucket = bucketIndex;
     }
   });
 
   return minBucket !== undefined && maxBucket !== undefined
     ? { minBucket, maxBucket }
     : undefined;
}

/**
 * Selects cards to practice on a particular day.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @param day current day number (starting from 0).
 * @returns a Set of Flashcards that should be practiced on day `day`,
 *          according to the Modified-Leitner algorithm.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
export function practice(
  buckets: Array<Set<Flashcard>>,
  day: number
): Set<Flashcard> {
  const reviewSet = new Set<Flashcard>();
 
   buckets.forEach((cards, bucketIndex) => {
     if ((day + 1) % 2 ** bucketIndex === 0) {
       cards.forEach((card) => reviewSet.add(card));
     }
   });
 
   return reviewSet;
}

/**
 * Updates a card's bucket number after a practice trial.
 *
 * @param buckets Map representation of learning buckets.
 * @param card flashcard that was practiced.
 * @param difficulty how well the user did on the card in this practice trial.
 * @returns updated Map of learning buckets.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
export function update(
  buckets: BucketMap,
  card: Flashcard,
  difficulty: AnswerDifficulty
): BucketMap {
  const updatedBuckets: BucketMap = new Map();
 
   for (const [index, cards] of buckets.entries()) {
     updatedBuckets.set(index, new Set(cards));
   }
 
   let currentBucket = -1;
   for (const [index, cards] of updatedBuckets.entries()) {
     if (cards.has(card)) {
       currentBucket = index;
       cards.delete(card); 
       break;
     }
   }
 
   let newBucket: number;
   if (difficulty === AnswerDifficulty.Wrong) {
     newBucket = 0;
   } else if (difficulty === AnswerDifficulty.Hard) {
     newBucket = Math.max(0, currentBucket - 1);
   } else { 
     newBucket = currentBucket + 1;
   }
 
   if (!updatedBuckets.has(newBucket)) {
     updatedBuckets.set(newBucket, new Set());
   }
 
   updatedBuckets.get(newBucket)!.add(card);
 
   return updatedBuckets;
}

/**
 * Generates a hint for a flashcard.
 *
 * @param card flashcard to hint
 * @returns a hint for the front of the flashcard.
 * @spec.requires card is a valid Flashcard.
 */
export function getHint(card: Flashcard): string {
  // TODO: Implement this function (and strengthen the spec!)
  throw new Error("Implement me!");
}

/**
 * Computes statistics about the user's learning progress.
 *
 * @param buckets representation of learning buckets.
 * @param history representation of user's answer history.
 * @returns statistics about learning progress.
 * @spec.requires [SPEC TO BE DEFINED]
 */
export function computeProgress(buckets: any, history: any): any {
  // Replace 'any' with appropriate types
  // TODO: Implement this function (and define the spec!)
  throw new Error("Implement me!");
}
