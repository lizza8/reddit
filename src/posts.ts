import { getDailySeed } from "./daily";

export type PostCategoryTag = "controversial" | "wholesome" | "novel" | "repost";

export type DailyGamePost = {
  id: string;
  title: string;
  subreddit: string;
  score: number;
  comments: number;
  hiddenTags: PostCategoryTag[];
};

const ALL_POSTS: DailyGamePost[] = [
  {
    id: "p001",
    title: "My cat learned to open doors and now runs the house",
    subreddit: "cats",
    score: 12845,
    comments: 612,
    hiddenTags: ["wholesome"],
  },
  {
    id: "p002",
    title: "I built a tiny library in a tree stump",
    subreddit: "DIY",
    score: 9342,
    comments: 311,
    hiddenTags: ["wholesome", "novel"],
  },
  {
    id: "p003",
    title: "Unpopular opinion: cereal is better without milk",
    subreddit: "unpopularopinion",
    score: 742,
    comments: 1983,
    hiddenTags: ["controversial"],
  },
  {
    id: "p004",
    title: "A year of daily sketches, one page per day",
    subreddit: "Art",
    score: 15892,
    comments: 438,
    hiddenTags: ["novel"],
  },
  {
    id: "p005",
    title: "My grandma's 100-year-old bread recipe",
    subreddit: "Baking",
    score: 6231,
    comments: 214,
    hiddenTags: ["wholesome"],
  },
  {
    id: "p006",
    title: "Is pineapple on pizza actually good?",
    subreddit: "AskReddit",
    score: 3121,
    comments: 5204,
    hiddenTags: ["controversial", "repost"],
  },
  {
    id: "p007",
    title: "I replaced my phone with a flip phone for 30 days",
    subreddit: "self",
    score: 8074,
    comments: 902,
    hiddenTags: ["novel"],
  },
  {
    id: "p008",
    title: "This diagram finally made taxes make sense",
    subreddit: "coolguides",
    score: 11932,
    comments: 455,
    hiddenTags: ["repost"],
  },
  {
    id: "p009",
    title: "I automated my plants with $20 in parts",
    subreddit: "homeautomation",
    score: 5423,
    comments: 286,
    hiddenTags: ["novel"],
  },
  {
    id: "p010",
    title: "My dog met snow for the first time",
    subreddit: "aww",
    score: 20311,
    comments: 988,
    hiddenTags: ["wholesome", "repost"],
  },
  {
    id: "p011",
    title: "I tried the 2-minute rule for a week",
    subreddit: "productivity",
    score: 4120,
    comments: 376,
    hiddenTags: ["novel"],
  },
  {
    id: "p012",
    title: "Hot take: spoilers are fine if the movie is old",
    subreddit: "movies",
    score: 583,
    comments: 1331,
    hiddenTags: ["controversial"],
  },
  {
    id: "p013",
    title: "My handmade keyboard from walnut and brass",
    subreddit: "MechanicalKeyboards",
    score: 9634,
    comments: 421,
    hiddenTags: ["novel"],
  },
  {
    id: "p014",
    title: "The safest way to reheat pizza",
    subreddit: "LifeProTips",
    score: 7112,
    comments: 271,
    hiddenTags: ["repost"],
  },
  {
    id: "p015",
    title: "I adopted a senior dog and here's how it's going",
    subreddit: "dogs",
    score: 10422,
    comments: 558,
    hiddenTags: ["wholesome"],
  },
  {
    id: "p016",
    title: "Why I stopped using social media for 6 months",
    subreddit: "DecidingToBeBetter",
    score: 3890,
    comments: 642,
    hiddenTags: ["controversial"],
  },
  {
    id: "p017",
    title: "I made a functional chess set out of paper clips",
    subreddit: "somethingimade",
    score: 4821,
    comments: 193,
    hiddenTags: ["novel"],
  },
  {
    id: "p018",
    title: "Best budget meal prep: five lunches under $10",
    subreddit: "EatCheapAndHealthy",
    score: 6033,
    comments: 354,
    hiddenTags: ["repost"],
  },
  {
    id: "p019",
    title: "My kid drew this comic and insisted I post it",
    subreddit: "MadeMeSmile",
    score: 14112,
    comments: 512,
    hiddenTags: ["wholesome"],
  },
  {
    id: "p020",
    title: "Am I the only one who hates brunch?",
    subreddit: "TooAfraidToAsk",
    score: 1210,
    comments: 2844,
    hiddenTags: ["controversial", "repost"],
  },
  {
    id: "p021",
    title: "I 3D-printed a lamp that looks like a moon",
    subreddit: "3Dprinting",
    score: 7345,
    comments: 299,
    hiddenTags: ["novel"],
  },
  {
    id: "p022",
    title: "This before/after of my tiny balcony garden",
    subreddit: "gardening",
    score: 9022,
    comments: 217,
    hiddenTags: ["wholesome"],
  },
  {
    id: "p023",
    title: "You should salt your pasta water more",
    subreddit: "Cooking",
    score: 5511,
    comments: 824,
    hiddenTags: ["controversial", "repost"],
  },
  {
    id: "p024",
    title: "I biked across my state without a map",
    subreddit: "adventure",
    score: 4699,
    comments: 188,
    hiddenTags: ["novel"],
  },
  {
    id: "p025",
    title: "My foster cat finally sat on my lap",
    subreddit: "cats",
    score: 16543,
    comments: 777,
    hiddenTags: ["wholesome"],
  },
  {
    id: "p026",
    title: "I ranked every chip flavor from worst to best",
    subreddit: "snacks",
    score: 2890,
    comments: 1104,
    hiddenTags: ["controversial"],
  },
  {
    id: "p027",
    title: "I restored a 1960s radio and it works perfectly",
    subreddit: "restoration",
    score: 8132,
    comments: 266,
    hiddenTags: ["novel"],
  },
  {
    id: "p028",
    title: "Most reusable grocery bags are worse than plastic",
    subreddit: "science",
    score: 3380,
    comments: 2092,
    hiddenTags: ["controversial"],
  },
  {
    id: "p029",
    title: "The tiniest pancake art you've ever seen",
    subreddit: "Food",
    score: 11202,
    comments: 402,
    hiddenTags: ["wholesome", "novel"],
  },
  {
    id: "p030",
    title: "I quit sugar for 30 days and here are the results",
    subreddit: "fitness",
    score: 4262,
    comments: 901,
    hiddenTags: ["repost"],
  },
  {
    id: "p031",
    title: "My neighbor's parrot learns three new words",
    subreddit: "parrots",
    score: 5320,
    comments: 248,
    hiddenTags: ["wholesome"],
  },
  {
    id: "p032",
    title: "This budget PC build beats my old console",
    subreddit: "buildapc",
    score: 6871,
    comments: 733,
    hiddenTags: ["novel"],
  },
  {
    id: "p033",
    title: "Should tipping be abolished?",
    subreddit: "changemyview",
    score: 1772,
    comments: 4033,
    hiddenTags: ["controversial"],
  },
  {
    id: "p034",
    title: "I made a map of every coffee shop in my town",
    subreddit: "dataisbeautiful",
    score: 9431,
    comments: 277,
    hiddenTags: ["novel"],
  },
  {
    id: "p035",
    title: "My friend bakes cakes for shelter dogs every week",
    subreddit: "HumansBeingBros",
    score: 13188,
    comments: 489,
    hiddenTags: ["wholesome"],
  },
  {
    id: "p036",
    title: "Why I think the office should be fully remote",
    subreddit: "WorkReform",
    score: 2081,
    comments: 2677,
    hiddenTags: ["controversial", "repost"],
  },
  {
    id: "p037",
    title: "I created a tiny desk organizer from scrap wood",
    subreddit: "woodworking",
    score: 5011,
    comments: 195,
    hiddenTags: ["novel"],
  },
  {
    id: "p038",
    title: "This plant survived my black thumb",
    subreddit: "houseplants",
    score: 12210,
    comments: 341,
    hiddenTags: ["wholesome"],
  },
  {
    id: "p039",
    title: "My take: memes are the new folk art",
    subreddit: "TrueOffMyChest",
    score: 1880,
    comments: 1567,
    hiddenTags: ["controversial"],
  },
  {
    id: "p040",
    title: "I knit a sweater from recycled yarn",
    subreddit: "knitting",
    score: 6123,
    comments: 223,
    hiddenTags: ["novel"],
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

function shuffleDeterministic<T>(items: T[], seed: string): T[] {
  const rng = createRng(seed);
  const output = items.slice();
  for (let i = output.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [output[i], output[j]] = [output[j], output[i]];
  }
  return output;
}

export function getDailyPosts(seed: string = getDailySeed()): DailyGamePost[] {
  const shuffled = shuffleDeterministic(ALL_POSTS, seed);
  return shuffled.slice(0, 20);
}
