import { z } from "zod";

// Message types
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// Session types
export interface Session {
  id: string;
  scenarioId: string | null;
  scenarioName: string | null;
  messages: Message[];
  phase: string;
  createdAt: string;
}

// Scenario type
export interface Scenario {
  id: string;
  name: string;
  description: string;
  keywords: string[];
}

// User types
export interface User {
  id: string;
  username: string;
  password: string;
}

export interface InsertUser {
  username: string;
  password: string;
}

// Chat request schema
export const chatRequestSchema = z.object({
  message: z.string().min(1),
  sessionId: z.string().optional(),
  scenarioId: z.string().optional(),
});

// Chat response type
export type ChatResponse = {
  type: "meta" | "chunk" | "done" | "error";
  sessionId?: string;
  scenarioId?: string | null;
  scenarioName?: string | null;
  content?: string;
  phase?: string;
  message?: string;
};

// Scenarios data
export const scenarios: Scenario[] = [
  {
    id: "burnout",
    name: "День сурка",
    description: "Выгорание, апатия, отсутствие энергии и мотивации",
    keywords: ["выгорание", "апатия", "усталость", "нет сил", "день сурка", "рутина"],
  },
  {
    id: "anxiety",
    name: "Тревожный звоночек",
    description: "Паника, тревога, навязчивые мысли, беспокойство",
    keywords: ["тревога", "паника", "волнение", "страх", "навязчивые мысли", "беспокойство"],
  },
  {
    id: "loneliness",
    name: "Островок",
    description: "Одиночество, проблемы в отношениях, изоляция",
    keywords: ["одиночество", "одинокий", "изоляция", "нет друзей", "отношения"],
  },
  {
    id: "crossroads",
    name: "Перекресток",
    description: "Кризис самоопределения, поиск смысла, выбор пути",
    keywords: ["не знаю чего хочу", "смысл жизни", "самоопределение", "кто я", "выбор"],
  },
  {
    id: "trauma",
    name: "Груз прошлого",
    description: "Детские травмы, токсичная семья, психотравмы",
    keywords: ["травма", "детство", "прошлое", "родители", "токсичные отношения"],
  },
  {
    id: "loss",
    name: "После бури",
    description: "Утрата, развод, горе, потеря",
    keywords: ["потеря", "утрата", "развод", "горе", "расставание", "смерть"],
  },
  {
    id: "psychosomatic",
    name: "Тело взывает о помощи",
    description: "Психосоматические проявления, связь тела и психики",
    keywords: ["психосоматика", "болит тело", "физические симптомы", "здоровье"],
  },
  {
    id: "inner-critic",
    name: "Внутренний критик",
    description: "Низкая самооценка, перфекционизм, самокритика",
    keywords: ["самооценка", "перфекционизм", "критикую себя", "не достаточно хорош"],
  },
  {
    id: "anger",
    name: "На взводе",
    description: "Гнев, раздражительность, агрессия",
    keywords: ["гнев", "злость", "раздражение", "агрессия", "бешенство"],
  },
  {
    id: "boundaries",
    name: "Без якоря",
    description: "Проблемы с границами, неумение говорить 'нет'",
    keywords: ["границы", "не могу отказать", "используют", "манипуляция"],
  },
  {
    id: "decisions",
    name: "Выбор без выбора",
    description: "Паралич принятия решений, страх ошибки",
    keywords: ["не могу решить", "выбор", "решение", "сомневаюсь"],
  },
  {
    id: "parenting",
    name: "Родительский квест",
    description: "Детско-родительские отношения, воспитание",
    keywords: ["дети", "ребенок", "воспитание", "родитель", "материнство", "отцовство"],
  },
  {
    id: "social",
    name: "В тени социума",
    description: "Социальная тревожность, страх оценки",
    keywords: ["социофобия", "боюсь людей", "публичные выступления", "оценка"],
  },
  {
    id: "mood-swings",
    name: "Эмоциональные качели",
    description: "Нестабильность настроения, эмоциональные перепады",
    keywords: ["настроение", "перепады", "эмоции", "нестабильность"],
  },
  {
    id: "growth",
    name: "Просто жизнь",
    description: "Личностный рост, саморазвитие, общие вопросы",
    keywords: ["саморазвитие", "личностный рост", "хочу меняться", "стать лучше"],
  },
];
