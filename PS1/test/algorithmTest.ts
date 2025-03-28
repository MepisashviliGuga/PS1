import assert from "assert";
import { AnswerDifficulty, Flashcard, BucketMap } from "../src/flashcards";
import {
  toBucketSets,
  getBucketRange,
  practice,
  update,
  getHint,
  computeProgress,
} from "../src/algorithm";
import { expect } from "chai";
import { createGeneralCard } from "../src/utils";

describe("toBucketSets()", () => {
  it("when given empty BucketMap then should return empty array", () => {
    const buckets: BucketMap = new Map();

    expect(toBucketSets(buckets)).to.deep.equal([]);
  });

  it("when given BucketMap with single set of flashcards with index = 0 then should correctly convert", () => {
    const buckets: BucketMap = new Map();
    const card1 = createGeneralCard("Card1");
    buckets.set(0, new Set([card1]));

    expect(toBucketSets(buckets)).to.deep.equal([new Set([card1])]);
  });

  it("when given BucketMap with single set of flashcards with index > 0 then should correctly convert", () => {
    const buckets: BucketMap = new Map();
    const card1 = createGeneralCard("Card1");
    buckets.set(2, new Set([card1]));

    expect(toBucketSets(buckets)).to.deep.equal([new Set([]), new Set([]), new Set([card1])]);
  });

  it("it should handle multiple buckets with non-sequential indices",() => {
    const buckets: BucketMap = new Map();
    const card1 = createGeneralCard("card1");
    const card2 = createGeneralCard("card2");

    buckets.set(1, new Set([card1]));
    buckets.set(3, new Set([card2]));

    expect(toBucketSets(buckets)).to.deep.equal([new Set([]), new Set([card1]), new Set([]), new Set([card2])]);

  });

  it("it should return an array of empty sets if all buckets are empty", () => {
    const buckets: BucketMap = new Map();
    buckets.set(0, new Set([]));
    buckets.set(1, new Set([]));

    expect(toBucketSets(buckets)).to.deep.equal([new Set(), new Set()]);

  });
});

/*
 * Testing strategy for getBucketRange():
 *
 * I am going to check following situations, when given:
 * 1. empty array
 * 2. array with empty sets
 * 3. array with only one set with flashcard in it.
 * 4. array with multiple non-empty sets, which starts and ends with sequence of empty sets
 */
describe("getBucketRange()", () => {
  it("it should return undefined when given empty array", () => {
    const buckets :Array<Set<Flashcard>> = [];
    
    expect(getBucketRange(buckets)).to.deep.equal(undefined);
  });

  it("it should return undefined again when given array with empty sets", () => {
    const buckets :Array<Set<Flashcard>> = [new Set([]), new Set([])];
    
    expect(getBucketRange(buckets)).to.deep.equal(undefined);
  });

  it("it should return correct index when given array with only one non-empty set", () => {
    const card1 = createGeneralCard("card1");
    const card2 = createGeneralCard("card2");
    const buckets :Array<Set<Flashcard>> = [new Set([]), new Set([card1, card2]), new Set([])];
    
    expect(getBucketRange(buckets)).to.deep.equal({ minBucket: 1, maxBucket: 1});
  });

  it("it should return correct indeces when given array with multiple non-empty sets", () => {
    const card1 = createGeneralCard("card1");
    const card2 = createGeneralCard("card2");
    const card3 = createGeneralCard("card3");
    const card4 = createGeneralCard("card4");
    const buckets :Array<Set<Flashcard>> = [new Set([]), new Set([card1, card2]), new Set([]), new Set([card3, card4]), new Set([])];

    expect(getBucketRange(buckets)).to.deep.equal({ minBucket: 1, maxBucket: 3});
  });
});

/*
 * Testing strategy for practice():
 *
 * partitions for bucket:
 * 1. bucket is empty
 * 2. bucket is singe set
 * 3. bucket is multiple
 * 
 * partition for days:
 * 1. day = 0
 * 2. say = 2*n - 1
 * 3. day > 0
 */
describe("practice()", () => {
  it("should return empty set if there are no flashcards", () => {
    const buckets: Array<Set<Flashcard>> = [];

    expect(practice(buckets, 1)).to.deep.equal(new Set());
    expect(practice(buckets, 3)).to.deep.equal(new Set());
    expect(practice(buckets, 1)).to.deep.equal(new Set());
    expect(practice(buckets, 30)).to.deep.equal(new Set());
  });

  it("when we have only one set in bucket", () => {
    const card1 = createGeneralCard("card1");
    const card2 = createGeneralCard("card2");
    const card3 = createGeneralCard("card3");
    
    const zeroBucketList = new Set([card1, card2, card3]);
    const buckets: Array<Set<Flashcard>> = [
      new Set([card1, card2, card3]), // Bucket 0 (review daily)
    ];

    expect(practice(buckets, 1)).to.deep.equal(zeroBucketList);
    expect(practice(buckets, 3)).to.deep.equal(zeroBucketList);
    expect(practice(buckets, 23)).to.deep.equal(zeroBucketList);
  });

  it("where we have multiple sets in bucket", () => {
    const card1 = createGeneralCard("card1");
    const card2 = createGeneralCard("card2");
    const card3 = createGeneralCard("card3");
    const card4 = createGeneralCard("card4");
    const card5 = createGeneralCard("card5");
    const card6 = createGeneralCard("card6");
    const card7 = createGeneralCard("card7");
    
    const zeroBucketList = new Set([card1, card2, card3]);

    const thirdBucketList = new Set([card4, card5]);   

    const buckets: Array<Set<Flashcard>> = [
      zeroBucketList,
      new Set([card7]),
      thirdBucketList,
      new Set(),
      new Set([card6])
    ];

    expect(practice(buckets, 1)).to.deep.equal(zeroBucketList);
    expect(practice(buckets, 2)).to.deep.equal(new Set([card1, card2, card3, card7]));
    expect(practice(buckets, 3)).to.deep.equal(zeroBucketList);
    expect(practice(buckets, 32)).to.deep.equal(new Set([card1, card2, card3, card7, card4, card5, card6]));
  });
});

/*
 * Testing strategy for update():
 *
 * consider all updates:
 * 1. card put in bucket 0
 * 2. card moves up from bucket i to bucket i+1
 * 3. card moves down to bucket i - 1
 */
describe("update()", () => {
  it("when card puts in bucket 0 because answer was difficult", () => {
    const card1 = createGeneralCard("card1");
    const card2 = createGeneralCard("card2");
    const card3 = createGeneralCard("card3");
    const card4 = createGeneralCard("card4");
    const card5 = createGeneralCard("card5");
    const card6 = createGeneralCard("card6");

    const buckets: BucketMap = new Map();
    buckets.set(0, new Set([card1, card2, card3]));
    buckets.set(2, new Set([card4, card5]));
    buckets.set(4, new Set([card6]));

    const updatedBuckets = update(buckets, card4, AnswerDifficulty.Wrong);

    expect(updatedBuckets.get(2)?.has(card4)).to.deep.equal(false);
    expect(updatedBuckets.get(0)?.has(card4)).to.deep.equal(true);
  });

  it("when card moves up to bucket i + 1 because answered easy", () => {
    const card1 = createGeneralCard("card1");
    const card2 = createGeneralCard("card2");
    const card3 = createGeneralCard("card3");
    const card4 = createGeneralCard("card4");
    const card5 = createGeneralCard("card5");
    const card6 = createGeneralCard("card6");

    const buckets: BucketMap = new Map();
    buckets.set(0, new Set([card1, card2, card3]));
    buckets.set(2, new Set([card4, card5]));
    buckets.set(4, new Set([card6]));

    const updatedBuckets = update(buckets, card4, AnswerDifficulty.Easy);

    expect(updatedBuckets.get(2)?.has(card4)).to.deep.equal(false);
    expect(updatedBuckets.get(3)?.has(card4)).to.deep.equal(true);
  });

  it("when card moves down to bucket i - 1 because answered Hard", () => {
    const card1 = createGeneralCard("card1");
    const card2 = createGeneralCard("card2");
    const card3 = createGeneralCard("card3");
    const card4 = createGeneralCard("card4");
    const card5 = createGeneralCard("card5");
    const card6 = createGeneralCard("card6");

    const buckets: BucketMap = new Map();
    buckets.set(0, new Set([card1, card2, card3]));
    buckets.set(2, new Set([card4, card5]));
    buckets.set(4, new Set([card6]));

    const updatedBuckets = update(buckets, card4, AnswerDifficulty.Hard);

    expect(updatedBuckets.get(2)?.has(card4)).to.deep.equal(false);
    expect(updatedBuckets.get(1)?.has(card4)).to.deep.equal(true);
  });


});

/*
 * Testing strategy for getHint():
 *
 * TODO: Describe your testing strategy for getHint() here.
 */
describe("getHint() - strong spec", () => {
  it("should return the first word of the front with ellipsis", () => {
    const card = new Flashcard("Capital of France?", "Paris", "not used", []);
    expect(getHint(card)).to.equal("Capital...");
  });

  it("should return full word with ellipsis when front is one word", () => {
    const card = new Flashcard("Photosynthesis", "Process", "not used", []);
    expect(getHint(card)).to.equal("Photosynthesis...");
  });
});


/*
 * Testing strategy for computeProgress():
 *
 * TODO: Describe your testing strategy for computeProgress() here.
 */
describe("computeProgress()", () => {
  it("should return correct stats for basic data", () => {
    const card1 = createGeneralCard("card1");
    const card2 = createGeneralCard("card2");
    const card3 = createGeneralCard("card3");

    const buckets: BucketMap = new Map();
    buckets.set(0, new Set([card1]));
    buckets.set(1, new Set([card2, card3]));

    const history = [
      { card: card1, difficulty: AnswerDifficulty.Easy },
      { card: card2, difficulty: AnswerDifficulty.Wrong },
      { card: card3, difficulty: AnswerDifficulty.Hard },
    ];

    const expected = {
      totalFlashcards: 3,
      bucketDistribution: { 0: 1, 1: 2 },
      accuracyRate: 2 / 3,
      reviewsPerBucket: { 0: 1, 1: 2 },
    };

    expect(computeProgress(buckets, history)).to.deep.equal(expected);
  });

  it("should return zero stats when everything is empty", () => {
    const buckets: BucketMap = new Map();
    const history: Array<{ card: Flashcard, difficulty: AnswerDifficulty }> = [];

    const expected = {
      totalFlashcards: 0,
      bucketDistribution: {},
      accuracyRate: 0,
      reviewsPerBucket: {},
    };

    expect(computeProgress(buckets, history)).to.deep.equal(expected);
  });
});