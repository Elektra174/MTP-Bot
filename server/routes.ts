import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Cerebras from "@cerebras/cerebras_cloud_sdk";
import { chatRequestSchema, scenarios, type ChatResponse, type Message, type Session } from "@shared/schema";
import { randomUUID } from "crypto";

const client = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});

const sessions = new Map<string, Session>();

const MPT_SYSTEM_PROMPT = `Ты — опытный МПТ-терапевт (Мета-Персональная Терапия) мужского пола, ведущий психологическую сессию. Всегда используй мужской род в своих ответах (например, "я рад", "я понял", а не "я рада", "я поняла"). Работай строго в методологии и логике метода Мета-персональной терапии.

## БАЗОВЫЕ ПРИНЦИПЫ МПТ:
1. За любым действием стоит потребность. Потребность — это локомотив всех психических процессов.
2. Потребность невозможно отключить — можно только найти конструктивные способы её реализации.
3. Используй циркулярные вопросы для поиска глубинной потребности.
4. Работай с телесными ощущениями, эмоциями, образами и метафорами.
5. Веди клиента от осознания проблемы к интеграции и новым действиям.
6. Каждая сессия должна завершаться конкретным первым шагом.
7. Предлагай практики внедрения для закрепления результата.

## ЕСЛИ КЛИЕНТ ОТВЕЧАЕТ "НЕ ЗНАЮ":
Используй помогающие вопросы:
- "А если бы знал — на что бы это знание могло быть похоже?"
- "А если бы понимал — каким бы могло быть это понимание?"
- "А если бы чувствовал — каким бы могло быть это ощущение?"

## СТРУКТУРА РАБОТЫ ПО СКРИПТУ "ИССЛЕДОВАНИЕ СТРАТЕГИИ":

### 1. ИССЛЕДОВАНИЕ ЦЕЛЕЙ
- Есть ли область жизни, где не хватает энергии или привычные способы неэффективны?
- Как формулируются цели в этой сфере?
- Что сейчас происходит? Какие действия и результаты?
- Как клиент себя при этом чувствует?
- Насколько важно изменить это (оценка 1-10)?

### 2. ПОИСК ГЛУБИННОЙ ПОТРЕБНОСТИ
Задавай циркулярные вопросы многократно:
- "Какова цель твоих действий?"
- "Что ты хочешь получить, сделав это?"
- "К чему это приведёт тебя?"
- "Какую потребность ты тогда реализуешь?"
- "Есть ли что-то глубже этой потребности?"
Продолжай, пока не найдётся самая глубинная потребность — обычно это потребность как-то себя ощущать.

### 3. ЭНЕРГИЯ ПОТРЕБНОСТИ
- "Где в теле переживается эта потребность?"
- "Опиши это телесное ощущение — локализация, характеристики."
- "Если бы у тебя был образ или метафора этого ощущения — на что бы оно было похоже?"
- "Если бы ты мог стать этим ощущением — как бы ты себя почувствовал?"
- "Ощущаешь ли ты сколько в тебе энергии?"
- "Если бы ты мог стать самой этой энергией — что бы изменилось?"
- "Возникает ли импульс подвигаться?"

### 4. МЕТАПОЗИЦИЯ
- "Глазами этой энергии посмотри на свою жизнь."
- "Каким ты себя видишь?"
- "Как выглядит твоя ситуация?"
- "Какой выглядит твоя привычная стратегия действий?"
- "Насколько эта стратегия эффективна?"
- "Есть ли что-то, чего ты не видишь, но что очевидно глазами этой энергии?"

### 5. ИНТЕГРАЦИЯ
- "Если бы ты как энергия мог проявляться через тебя — как это могло бы ощущаться?"
- "Какое физическое движение могло бы родиться из этого ощущения?"
- "Позволь телу подвигаться, как ему хочется."
- "Что изменилось в ощущениях?"

### 6. НОВЫЕ ДЕЙСТВИЯ
- "Представь, что смотришь на свою ситуацию глазами этой новой целостности."
- "Чем отличается этот взгляд от привычного?"
- "Как ты можешь сформулировать новую цель?"
- "Какой новый способ действовать ты видишь?"
- "К каким результатам могут привести такие действия?"

### 7. КОНКРЕТНОЕ ДЕЙСТВИЕ
- "Хочется ли сделать что-то уже сегодня?"
- "Что именно?"
- "Хочешь реализовать это?"

### 8. ПРАКТИКИ ВНЕДРЕНИЯ
Предложи практики для закрепления результата.

## СЦЕНАРИИ РАБОТЫ:

1. "День сурка" (burnout) — выгорание, апатия, нет энергии
2. "Тревожный звоночек" (anxiety) — паника, тревога, навязчивые мысли  
3. "Островок" (loneliness) — одиночество, проблемы в отношениях
4. "Перекресток" (crossroads) — кризис самоопределения, поиск смысла
5. "Груз прошлого" (trauma) — детские травмы, токсичная семья
6. "После бури" (loss) — утрата, развод, горе
7. "Тело взывает о помощи" (psychosomatic) — психосоматика
8. "Внутренний критик" (inner-critic) — самооценка, перфекционизм
9. "На взводе" (anger) — гнев, раздражительность
10. "Без якоря" (boundaries) — границы, неумение говорить "нет"
11. "Выбор без выбора" (decisions) — паралич принятия решений
12. "Родительский квест" (parenting) — детско-родительские отношения
13. "В тени социума" (social) — социальная тревожность
14. "Эмоциональные качели" (mood-swings) — нестабильность настроения
15. "Просто жизнь" (growth) — личностный рост

## ТВОЙ СТИЛЬ:
- Веди себя как тёплый, принимающий, но профессиональный терапевт.
- **КРИТИЧЕСКИ ВАЖНО: ЗАДАВАЙ МАКСИМУМ 1-2 ВОПРОСА ЗА ОТВЕТ!** Никогда не задавай 3 или более вопросов в одном сообщении. Это перегружает клиента. Один глубокий вопрос лучше трёх поверхностных.
- Отражай чувства клиента, проявляй эмпатию.
- Двигайся по этапам скрипта последовательно и медленно — по одному вопросу за раз.
- Не торопи клиента, дай время осмыслить каждый вопрос.
- Используй имя клиента, если он его назвал.
- **ПИШИ ГРАМОТНО НА РУССКОМ ЯЗЫКЕ**: Соблюдай правила русской грамматики, правильно склоняй слова, согласуй падежи, роды и числа. Предложения должны быть логичными и понятными. Избегай корявых конструкций и стилистических ошибок.
- Твой ответ должен быть компактным: краткое отражение + 1-2 вопроса. Не пиши длинные монологи.

## НАЧАЛО СЕССИИ:
Если это первое сообщение сессии — тепло поприветствуй и спроси, что беспокоит клиента или над чем он хотел бы поработать сегодня. Например: "Привет! Рад тебя видеть. Расскажи, что тебя сейчас беспокоит или над чем хотел бы поработать?"

## ОБРАБОТКА НЕПОНЯТНЫХ СООБЩЕНИЙ:
Если клиент пишет бессмыслицу, набор букв, непонятный текст или что-то неразборчивое — не пытайся это интерпретировать или придумывать смысл. Вежливо попроси уточнить: "Извини, я не совсем понял. Можешь переформулировать или написать подробнее, что ты имеешь в виду?"`;

function detectScenario(message: string): { id: string; name: string } | null {
  const lowerMessage = message.toLowerCase();
  
  for (const scenario of scenarios) {
    for (const keyword of scenario.keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        return { id: scenario.id, name: scenario.name };
      }
    }
  }
  
  return null;
}

function getPhase(messages: Message[]): string {
  const count = messages.length;
  if (count <= 2) return "Исследование запроса";
  if (count <= 6) return "Исследование целей";
  if (count <= 10) return "Поиск потребности";
  if (count <= 14) return "Энергия потребности";
  if (count <= 18) return "Метапозиция";
  if (count <= 22) return "Интеграция";
  if (count <= 26) return "Новые действия";
  return "Практики внедрения";
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/chat", async (req, res) => {
    try {
      const parseResult = chatRequestSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: "Invalid request", 
          details: parseResult.error.errors 
        });
      }
      
      const { message, sessionId, scenarioId } = parseResult.data;
      
      let session: Session;
      
      if (sessionId && sessions.has(sessionId)) {
        session = sessions.get(sessionId)!;
      } else {
        const detectedScenario = scenarioId 
          ? scenarios.find(s => s.id === scenarioId) 
          : detectScenario(message);
        
        session = {
          id: randomUUID(),
          scenarioId: detectedScenario?.id || null,
          scenarioName: detectedScenario?.name || null,
          messages: [],
          phase: "Исследование запроса",
          createdAt: new Date().toISOString(),
        };
        sessions.set(session.id, session);
      }
      
      const userMessage: Message = {
        id: randomUUID(),
        role: "user",
        content: message,
        timestamp: new Date().toISOString(),
      };
      session.messages.push(userMessage);
      
      if (!session.scenarioId) {
        const detectedScenario = detectScenario(message);
        if (detectedScenario) {
          session.scenarioId = detectedScenario.id;
          session.scenarioName = detectedScenario.name;
        }
      }
      
      const conversationHistory = session.messages.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));
      
      let contextualPrompt = MPT_SYSTEM_PROMPT;
      if (session.scenarioId && session.scenarioName) {
        const scenario = scenarios.find(s => s.id === session.scenarioId);
        if (scenario) {
          contextualPrompt += `\n\n## ТЕКУЩИЙ СЦЕНАРИЙ: "${scenario.name}"\n${scenario.description}\nТипичные ключевые слова: ${scenario.keywords.join(", ")}`;
        }
      }
      
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");
      
      res.write(`data: ${JSON.stringify({ 
        type: "meta", 
        sessionId: session.id, 
        scenarioId: session.scenarioId, 
        scenarioName: session.scenarioName 
      })}\n\n`);
      
      const stream = await client.chat.completions.create({
        model: "qwen-3-235b-a22b-instruct-2507",
        messages: [
          { role: "system", content: contextualPrompt },
          ...conversationHistory,
        ],
        max_tokens: 2000,
        temperature: 0.7,
        top_p: 0.8,
        stream: true,
      });
      
      let fullContent = "";
      
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullContent += content;
          res.write(`data: ${JSON.stringify({ type: "chunk", content })}\n\n`);
        }
      }
      
      const assistantMessage: Message = {
        id: randomUUID(),
        role: "assistant",
        content: fullContent || "Произошла ошибка. Пожалуйста, попробуй ещё раз.",
        timestamp: new Date().toISOString(),
      };
      session.messages.push(assistantMessage);
      
      session.phase = getPhase(session.messages);
      
      res.write(`data: ${JSON.stringify({ 
        type: "done", 
        phase: session.phase 
      })}\n\n`);
      
      res.end();
      
    } catch (error) {
      console.error("Chat error:", error);
      if (!res.headersSent) {
        return res.status(500).json({ 
          error: "Internal server error",
          message: error instanceof Error ? error.message : "Unknown error"
        });
      } else {
        res.write(`data: ${JSON.stringify({ type: "error", message: error instanceof Error ? error.message : "Unknown error" })}\n\n`);
        res.end();
      }
    }
  });
  
  app.post("/api/sessions/new", (req, res) => {
    const { scenarioId } = req.body;
    
    const scenario = scenarioId 
      ? scenarios.find(s => s.id === scenarioId) 
      : null;
    
    const session: Session = {
      id: randomUUID(),
      scenarioId: scenario?.id || null,
      scenarioName: scenario?.name || null,
      messages: [],
      phase: "Исследование запроса",
      createdAt: new Date().toISOString(),
    };
    
    sessions.set(session.id, session);
    
    return res.json({
      sessionId: session.id,
      scenarioId: session.scenarioId,
      scenarioName: session.scenarioName,
      phase: session.phase,
    });
  });
  
  app.get("/api/scenarios", (req, res) => {
    return res.json(scenarios);
  });

  return httpServer;
}
