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

/*
 * Testing strategy for toBucketSets():
 *
 * TODO: Describe your testing strategy for toBucketSets() here.
 */
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
 * TODO: Describe your testing strategy for getBucketRange() here.
 */
describe("getBucketRange()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});

/*
 * Testing strategy for practice():
 *
 * TODO: Describe your testing strategy for practice() here.
 */
describe("practice()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});

/*
 * Testing strategy for update():
 *
 * TODO: Describe your testing strategy for update() here.
 */
describe("update()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});

/*
 * Testing strategy for getHint():
 *
 * TODO: Describe your testing strategy for getHint() here.
 */
describe("getHint()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});

/*
 * Testing strategy for computeProgress():
 *
 * TODO: Describe your testing strategy for computeProgress() here.
 */
describe("computeProgress()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});
