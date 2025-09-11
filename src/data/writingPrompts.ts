export interface WritingPrompt {
  id: string;
  text: string;
  category: string;
}

export interface PromptCategory {
  id: string;
  label: string;
  description: string;
  prompts: WritingPrompt[];
}

export const WRITING_PROMPTS: PromptCategory[] = [
  {
    id: 'creative',
    label: 'Creative Writing',
    description: 'Imaginative stories, characters, and fictional worlds',
    prompts: [
      {
        id: 'creative-1',
        text: 'Write about a character who can taste emotions in food',
        category: 'creative'
      },
      {
        id: 'creative-2',
        text: 'Describe a library where books write themselves based on visitors\' thoughts',
        category: 'creative'
      },
      {
        id: 'creative-3',
        text: 'Tell the story of the last two people on Earth who discover they\'re not alone',
        category: 'creative'
      },
      {
        id: 'creative-4',
        text: 'Write about a world where memories can be traded like currency. What would be most valuable?',
        category: 'creative'
      },
      {
        id: 'creative-5',
        text: 'Describe a character who finds a mysterious key that opens doors to memories',
        category: 'creative'
      },
      {
        id: 'creative-6',
        text: 'Write about a town where every person\'s shadow has its own personality',
        category: 'creative'
      },
      {
        id: 'creative-7',
        text: 'Describe a museum where the exhibits come alive after closing time',
        category: 'creative'
      },
      {
        id: 'creative-8',
        text: 'Write about someone who can see the lifespan of objects by touching them',
        category: 'creative'
      }
    ]
  },
  {
    id: 'personal',
    label: 'Personal Reflection',
    description: 'Self-discovery, memories, and personal growth',
    prompts: [
      {
        id: 'personal-1',
        text: 'What advice would you give to yourself from 5 years ago, and why?',
        category: 'personal'
      },
      {
        id: 'personal-2',
        text: 'Describe a moment when you changed someone\'s day for the better',
        category: 'personal'
      },
      {
        id: 'personal-3',
        text: 'Write about a fear you overcame and how it changed you',
        category: 'personal'
      },
      {
        id: 'personal-4',
        text: 'Describe a moment when you realized you were stronger than you thought',
        category: 'personal'
      },
      {
        id: 'personal-5',
        text: 'Write about a place that holds special meaning for you and why',
        category: 'personal'
      },
      {
        id: 'personal-6',
        text: 'Describe a conversation that completely changed your perspective',
        category: 'personal'
      },
      {
        id: 'personal-7',
        text: 'Write about a skill or talent you wish you had, and what you\'d do with it',
        category: 'personal'
      },
      {
        id: 'personal-8',
        text: 'Describe the most important lesson someone taught you without meaning to',
        category: 'personal'
      }
    ]
  },
  {
    id: 'academic',
    label: 'Academic',
    description: 'Analysis, arguments, and intellectual exploration',
    prompts: [
      {
        id: 'academic-1',
        text: 'Argue whether artificial intelligence will ultimately benefit or harm human creativity',
        category: 'academic'
      },
      {
        id: 'academic-2',
        text: 'Explain climate change solutions to a skeptical audience',
        category: 'academic'
      },
      {
        id: 'academic-3',
        text: 'Analyze how social media has changed the way we form relationships',
        category: 'academic'
      },
      {
        id: 'academic-4',
        text: 'Discuss the ethical implications of genetic engineering in humans',
        category: 'academic'
      },
      {
        id: 'academic-5',
        text: 'Examine whether universal basic income would solve or create problems',
        category: 'academic'
      },
      {
        id: 'academic-6',
        text: 'Analyze the role of failure in learning and personal development',
        category: 'academic'
      },
      {
        id: 'academic-7',
        text: 'Discuss how remote work is reshaping the future of cities and communities',
        category: 'academic'
      },
      {
        id: 'academic-8',
        text: 'Examine the balance between individual privacy and collective security',
        category: 'academic'
      }
    ]
  },
  {
    id: 'business',
    label: 'Business',
    description: 'Professional scenarios, strategy, and leadership',
    prompts: [
      {
        id: 'business-1',
        text: 'Design a strategy to help a struggling local business compete with online retailers',
        category: 'business'
      },
      {
        id: 'business-2',
        text: 'Write about how you would lead a team through a major organizational change',
        category: 'business'
      },
      {
        id: 'business-3',
        text: 'Describe your approach to building trust in a remote work environment',
        category: 'business'
      },
      {
        id: 'business-4',
        text: 'Analyze the pros and cons of a four-day work week for businesses',
        category: 'business'
      },
      {
        id: 'business-5',
        text: 'Write about how to balance innovation with maintaining quality standards',
        category: 'business'
      },
      {
        id: 'business-6',
        text: 'Describe strategies for effective communication across different generations in the workplace',
        category: 'business'
      },
      {
        id: 'business-7',
        text: 'Outline your approach to making difficult decisions with incomplete information',
        category: 'business'
      },
      {
        id: 'business-8',
        text: 'Write about building a company culture that encourages creative risk-taking',
        category: 'business'
      }
    ]
  },
  {
    id: 'journal',
    label: 'Journal',
    description: 'Daily reflection, planning, and mindfulness',
    prompts: [
      {
        id: 'journal-1',
        text: 'What are three things you\'re grateful for today, and why do they matter?',
        category: 'journal'
      },
      {
        id: 'journal-2',
        text: 'Describe how you want to feel at the end of this week, and what would make that happen',
        category: 'journal'
      },
      {
        id: 'journal-3',
        text: 'Write about a recent challenge and what it taught you about yourself',
        category: 'journal'
      },
      {
        id: 'journal-4',
        text: 'What would you do today if you knew you couldn\'t fail?',
        category: 'journal'
      },
      {
        id: 'journal-5',
        text: 'Describe a moment from today that you want to remember and why',
        category: 'journal'
      },
      {
        id: 'journal-6',
        text: 'Write about something you\'re looking forward to and how you can prepare for it',
        category: 'journal'
      },
      {
        id: 'journal-7',
        text: 'What\'s one small change you could make that would improve your daily routine?',
        category: 'journal'
      },
      {
        id: 'journal-8',
        text: 'Reflect on a recent interaction that went well - what made it positive?',
        category: 'journal'
      }
    ]
  },
  {
    id: 'free',
    label: 'Free Writing',
    description: 'No prompt - write whatever comes to mind',
    prompts: [
      {
        id: 'free-1',
        text: 'Write whatever comes to mind - no rules, no structure, just let your thoughts flow',
        category: 'free'
      }
    ]
  }
];

// Helper functions
export function getRandomPrompt(categoryId?: string): WritingPrompt {
  if (categoryId) {
    const category = WRITING_PROMPTS.find(cat => cat.id === categoryId);
    if (category && category.prompts.length > 0) {
      const randomIndex = Math.floor(Math.random() * category.prompts.length);
      return category.prompts[randomIndex];
    }
  }
  
  // Get random prompt from any category except free writing
  const categoriesWithPrompts = WRITING_PROMPTS.filter(cat => cat.id !== 'free');
  const allPrompts = categoriesWithPrompts.flatMap(cat => cat.prompts);
  const randomIndex = Math.floor(Math.random() * allPrompts.length);
  return allPrompts[randomIndex];
}

export function getCategoryById(categoryId: string): PromptCategory | undefined {
  return WRITING_PROMPTS.find(cat => cat.id === categoryId);
}

export function getPromptById(promptId: string): WritingPrompt | undefined {
  for (const category of WRITING_PROMPTS) {
    const prompt = category.prompts.find(p => p.id === promptId);
    if (prompt) return prompt;
  }
  return undefined;
}