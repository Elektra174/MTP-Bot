import { scenarios, Scenario } from "@shared/schema";
import { ScenarioCard } from "@/components/scenario-card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Brain, MessageSquarePlus } from "lucide-react";

interface AppSidebarProps {
  selectedScenarioId: string | null;
  onSelectScenario: (scenario: Scenario | null) => void;
  onNewSession: () => void;
}

export function AppSidebar({ selectedScenarioId, onSelectScenario, onNewSession }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">МПТ Терапевт</h1>
            <p className="text-xs text-muted-foreground">Мета-персональная терапия</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <div className="px-4 pt-4">
            <Button 
              className="w-full justify-start" 
              variant={selectedScenarioId === null ? "default" : "outline"}
              onClick={() => {
                onSelectScenario(null);
                onNewSession();
              }}
              data-testid="button-free-request"
            >
              <MessageSquarePlus className="w-4 h-4 mr-2" />
              Свободный запрос
            </Button>
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-4">Сценарии терапии</SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[calc(100vh-220px)]">
              <div className="flex flex-col gap-2 px-4 pb-4">
                {scenarios.map((scenario) => (
                  <ScenarioCard
                    key={scenario.id}
                    scenario={scenario}
                    isSelected={selectedScenarioId === scenario.id}
                    onClick={() => {
                      onSelectScenario(scenario);
                      onNewSession();
                    }}
                  />
                ))}
              </div>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
