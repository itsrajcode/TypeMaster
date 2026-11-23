export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface PracticeText {
  id: number;
  category: string;
  difficulty: DifficultyLevel;
  text: string;
}

export const practiceTexts: PracticeText[] = [
  // ── EASY MODE (Simple vocabulary, smooth rhythm, 20-35 words) ──
  {
    id: 101,
    category: "Daily Life",
    difficulty: "easy",
    text: "The sun rose gently over the calm green hills, bringing warmth and light to the quiet town below. Birds sang sweet morning songs from the tall oak trees."
  },
  {
    id: 102,
    category: "Nature",
    difficulty: "easy",
    text: "A clean river flows through the quiet forest, carrying fresh cool water down to the blue ocean. Fish swim happily among the smooth grey river stones."
  },
  {
    id: 103,
    category: "Motivation",
    difficulty: "easy",
    text: "Every small step you take each day brings you closer to your biggest dreams. Keep your focus clear, stay positive, and never stop learning new things."
  },
  {
    id: 104,
    category: "Friendship",
    difficulty: "easy",
    text: "True friends stand beside you through sunny days and stormy nights. A kind word or a warm smile can easily brighten someone's entire day."
  },
  {
    id: 105,
    category: "Adventure",
    difficulty: "easy",
    text: "Pack your bag, lace up your shoes, and take the first step on an exciting journey. The wide world is full of wonderful places waiting to be explored."
  },

  // ── MEDIUM MODE (Balanced paragraphs, 40-55 words) ──
  {
    id: 201,
    category: "Technology",
    difficulty: "medium",
    text: "Artificial intelligence and machine learning are revolutionizing the way we interact with technology. From smart assistants to autonomous vehicles, these innovations are shaping our future in unprecedented ways as we advance into a connected world."
  },
  {
    id: 202,
    category: "Nature",
    difficulty: "medium",
    text: "The Amazon rainforest, often called the Earth's lungs, produces about twenty percent of the world's oxygen. This vast ecosystem is home to millions of species, demonstrating nature's remarkable ability to create balance and lasting harmony."
  },
  {
    id: 203,
    category: "Literature",
    difficulty: "medium",
    text: "In the realm of classic literature, each carefully chosen word paints vivid pictures in our minds. The power of storytelling transcends time, connecting readers across generations through shared human experiences and imaginative journeys."
  },
  {
    id: 204,
    category: "Space",
    difficulty: "medium",
    text: "The James Webb Space Telescope peers deeper into space than ever before, revealing ancient galaxies and stellar nurseries. Its infrared sensors allow astronomers to see through cosmic dust clouds and observe distant habitable exoplanets."
  },
  {
    id: 205,
    category: "Programming",
    difficulty: "medium",
    text: "Clean code is not just about making a program work. It is about crafting software that is readable, maintainable, and scalable. Good developers write code that humans can understand, following clean architectural principles."
  },

  // ── HARD MODE (Advanced vocabulary, complex syntax, 60-80 words) ──
  {
    id: 301,
    category: "Quantum Physics",
    difficulty: "hard",
    text: "Quantum physics challenges our fundamental understanding of reality. The concept of quantum entanglement suggests that microscopic particles can remain instantaneously correlated across macroscopic distances, defying conventional classical physics and prompting Einstein to famously designate the phenomenon as spooky action at a distance."
  },
  {
    id: 302,
    category: "Philosophy",
    difficulty: "hard",
    text: "Epistemological inquiry encourages thinkers to systematically interrogate foundational presuppositions regarding human cognition and empirical perception. Through rigorous dialectical argumentation, ancient philosophers dismantled cognitive dogmatism and established comprehensive methodological frameworks for modern analytical skepticism."
  },
  {
    id: 303,
    category: "Software Architecture",
    difficulty: "hard",
    text: "Distributed asynchronous architectures demand fault-tolerant consensus protocols, idempotent message brokers, and deterministic replication topologies. Engineering high-throughput microservices requires meticulous synchronization primitives, non-blocking input-output pipelines, and proactive circuit breakers to effectively mitigate catastrophic cascading network failures."
  },
  {
    id: 304,
    category: "Biochemistry",
    difficulty: "hard",
    text: "Ribosomal macromolecular complexes orchestrate high-fidelity enzymatic translation of messenger ribonucleic acid templates into dynamic polymorphic polypeptide conformations, regulated by stereochemical affinity thresholds and post-translational mitochondrial phosphorylation cascades."
  },
  {
    id: 305,
    category: "Economics",
    difficulty: "hard",
    text: "Macroeconomic equilibrium fluctuates continuously under the multifaceted pressures of sovereign debt obligations, algorithmic liquidity arbitrage, fractional-reserve monetary expansion, and cross-border currency volatility governed by geopolitical realignment."
  }
];
