import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RotateCcw, MessageSquare } from "lucide-react";

interface SessionHeaderProps {
  scenarioName: string | null;
  phase: string;
  onNewSession: () => void;
}

const phaseLabels: Record<string, string> = {
  "initial": "Начало сессии",
  "goals": "Исследование целей",
  "needs": "Поиск потребности",
  "energy": "Энергия потребности",
  "metaposition": "Метапозиция",
  "integration": "Интеграция",
  "actions": "Новые действия",
  "closing": "Завершение"
};

export function SessionHeader({ scenarioName, phase, onNewSession }: SessionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <span className="font-semibold text-lg truncate">
            {scenarioName || "МПТ Терапевт"}
          </span>
        </div>
        <Badge variant="secondary" className="flex-shrink-0" data-testid="badge-session-phase">
          {phaseLabels[phase] || phase}
        </Badge>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onNewSession}
        className="flex-shrink-0"
        data-testid="button-new-session"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Новая сессия
      </Button>
    </div>
  );
}
