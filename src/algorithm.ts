import { getDailySeed } from "./daily";

export type RuleId =
  | "score_weight"
  | "comment_weight"
  | "subreddit_bonus"
  | "novelty_bias";

export type ModifierId =
  | "wholesome_boost"
  | "controversy_penalty"
  | "repost_penalty"
  | "low_score_bonus";

export type AlgorithmRule = {
  id: RuleId;
  label: string;
};

export type AlgorithmModifier = {
  id: ModifierId;
  label: string;
};

export type DailyAlgorithm = {
  seed: string;
  primaryRule: AlgorithmRule;
  modifier: AlgorithmModifier;
};

const PRIMARY_RULES: AlgorithmRule[] = [
  {
    id: "score_weight",
    label: "Upvotes matter more than comments.",
  },
  {
    id: "comment_weight",
    label: "Comments matter more than upvotes.",
  },
  {
    id: "subreddit_bonus",
    label: "Certain subreddits get a quiet boost today.",
  },
  {
    id: "novelty_bias",
    label: "Newer-feeling content trends higher.",
  },
];

const MODIFIERS: AlgorithmModifier[] = [
  {
    id: "wholesome_boost",
    label: "Wholesome posts get a subtle lift.",
  },
  {
    id: "controversy_penalty",
    label: "Hot takes are held back a bit.",
  },
  {
    id: "repost_penalty",
    label: "Reposts are nudged downward.",
  },
  {
    id: "low_score_bonus",
    label: "Smaller posts can overperform.",
  },
];

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed: string): () => number {
  let state = hashSeed(seed) || 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}

function pickDeterministic<T>(items: T[], seed: string): T {
  const rng = createRng(seed);
  const index = Math.floor(rng() * items.length);
  return items[index];
}

export function getDailyAlgorithm(seed: string = getDailySeed()): DailyAlgorithm {
  const primaryRule = pickDeterministic(PRIMARY_RULES, `${seed}:rule`);
  const modifier = pickDeterministic(MODIFIERS, `${seed}:modifier`);

  return {
    seed,
    primaryRule,
    modifier,
  };
}
