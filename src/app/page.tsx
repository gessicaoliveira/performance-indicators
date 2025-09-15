"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HistoryTable } from "@/components/history-table";
import { GlossaryTable } from "@/components/glossary-table";
import { ChartModal } from "@/components/chart-modal";
import { Menu, Edit, TrendingUp, Plus } from "lucide-react";
import { IndicatorSheet } from "@/components/indicator-sheet";

interface ProcessedIndicator {
  id: number;
  name: string;
  description: string;
  visualizationType: number;
  fatherIndicator: number;
  values: { [year: string]: number };
}

interface GlossaryItem {
  id: number;
  indicator: string;
  description: string;
  formula: string;
  viewAs: string;
  fatherIndicator?: number;
  formulaId?: number;
}

const mockIndicators: ProcessedIndicator[] = [
  {
    id: 1,
    name: "Liquidez Corrente",
    description: "Capacidade de pagamento de curto prazo",
    visualizationType: 1,
    fatherIndicator: 1,
    values: { "2024": 1.5, "2023": 1.3, "2022": 1.2, "2021": 1.1 },
  },
  {
    id: 2,
    name: "Margem Líquida",
    description: "Percentual de lucro líquido sobre receita",
    visualizationType: 3,
    fatherIndicator: 2,
    values: { "2024": 15.2, "2023": 12.8, "2022": 10.5, "2021": 8.9 },
  },
  {
    id: 3,
    name: "ROE",
    description: "Retorno sobre patrimônio líquido",
    visualizationType: 3,
    fatherIndicator: 5,
    values: { "2024": 18.5, "2023": 16.2, "2022": 14.1, "2021": 12.3 },
  },
  {
    id: 4,
    name: "Giro do Ativo",
    description: "Eficiência na utilização dos ativos",
    visualizationType: 1,
    fatherIndicator: 3,
    values: { "2024": 2.1, "2023": 1.9, "2022": 1.8, "2021": 1.7 },
  },
  {
    id: 5,
    name: "Crescimento da Receita",
    description: "Taxa de crescimento anual da receita",
    visualizationType: 3,
    fatherIndicator: 4,
    values: { "2024": 25.3, "2023": 18.7, "2022": 15.2, "2021": 12.1 },
  },
];

const mockGlossary: GlossaryItem[] = [
  {
    id: 1,
    indicator: "EBITDA / RECEITA OPERACIONAL LIQUIDA",
    description: "DESCRIÇÃO EBITDA / RECEITA OPERACIONAL LIQUIDA",
    formula: "EBITDA ÷ Receita Operacional Liquida",
    viewAs: "Decimal",
    fatherIndicator: 1,
    formulaId: 1,
  },
  {
    id: 2,
    indicator: "EBITDA / DESPESAS ESTRUTURAIS",
    description: "DESCRIÇÃO",
    formula: "EBITDA ÷ Despesas Estruturais",
    viewAs: "Decimal",
    fatherIndicator: 1,
    formulaId: 2,
  },
  {
    id: 3,
    indicator: "RECEITA OPERACIONAL + 100",
    description: "DESCRIÇÃO RECEITA OPERACIONAL + 100",
    formula: "Receita Operacional + 100",
    viewAs: "Monetário",
    fatherIndicator: 2,
    formulaId: 3,
  },
  {
    id: 4,
    indicator: "EBITDA / RECEITA FINANCEIRAS",
    description: "DESCRIÇÃO DE RECEITA LIQUIDA",
    formula: "EBITDA ÷ Receitas Financeiras",
    viewAs: "Monetário",
    fatherIndicator: 2,
    formulaId: 4,
  },
  {
    id: 5,
    indicator: "Giro do Ativo",
    description: "Eficiência na utilização dos ativos",
    formula: "Receita Líquida ÷ Ativo Total",
    viewAs: "Decimal",
    fatherIndicator: 3,
    formulaId: 5,
  },
  {
    id: 6,
    indicator: "Prazo Médio de Recebimento",
    description: "Tempo médio para receber vendas a prazo",
    formula: "(Contas a Receber ÷ Receita Líquida) × 365",
    viewAs: "Decimal",
    fatherIndicator: 3,
    formulaId: 6,
  },
  {
    id: 7,
    indicator: "Crescimento da Receita",
    description: "Taxa de crescimento anual da receita",
    formula: "((Receita Atual - Receita Anterior) ÷ Receita Anterior) × 100",
    viewAs: "Porcentagem",
    fatherIndicator: 4,
    formulaId: 7,
  },
  {
    id: 8,
    indicator: "Valor Patrimonial por Ação",
    description: "Valor contábil por ação ordinária",
    formula: "Patrimônio Líquido ÷ Número de Ações",
    viewAs: "Monetário",
    fatherIndicator: 4,
    formulaId: 8,
  },
  {
    id: 9,
    indicator: "ROE",
    description: "Mede o retorno obtido sobre o patrimônio líquido investido",
    formula: "(Lucro Líquido ÷ Patrimônio Líquido) × 100",
    viewAs: "Porcentagem",
    fatherIndicator: 5,
    formulaId: 9,
  },
  {
    id: 10,
    indicator: "ROA",
    description: "Retorno sobre os ativos totais da empresa",
    formula: "(Lucro Líquido ÷ Ativo Total) × 100",
    viewAs: "Porcentagem",
    fatherIndicator: 5,
    formulaId: 10,
  },
];

const years = ["2024", "2023", "2022", "2021"];

export default function FinancialDashboard() {
  const [activeTab, setActiveTab] = useState("history");
  const [searchValue, setSearchValue] = useState("");
  const [selectedIndicator, setSelectedIndicator] =
    useState<ProcessedIndicator | null>(null);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [glossaryData, setGlossaryData] =
    useState<GlossaryItem[]>(mockGlossary);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isIndicatorSheetOpen, setIsIndicatorSheetOpen] = useState(false);

  const handleIndicatorSelect = (indicator: ProcessedIndicator) => {
    setSelectedIndicator(indicator);
    setIsChartModalOpen(true);
  };

  const handleGlossaryDataChange = (newData: GlossaryItem[]) => {
    setGlossaryData(newData);
  };

  const handleAddIndicator = (newIndicator: Omit<GlossaryItem, "id">) => {
    const indicator: GlossaryItem = {
      ...newIndicator,
      id: Math.max(...glossaryData.map((item) => item.id)) + 1,
    };
    setGlossaryData([...glossaryData, indicator]);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 sm:py-6 gap-2">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="p-1.5 sm:p-2 bg-emerald-100 rounded-lg flex-shrink-0">
                <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-emerald-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold text-slate-900 truncate">
                  Início
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 hidden sm:block">
                  Indicadores de Performance Empresarial
                </p>
              </div>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-1 sm:gap-2 bg-transparent px-2 sm:px-3"
                  >
                    <Menu className="h-4 w-4" />
                    <span className="hidden sm:inline">Ações</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setIsIndicatorSheetOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4 hover:text-white" />
                    Cadastrar Indicador
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setActiveTab("glossary");
                      setIsEditMode(!isEditMode);
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4 hover:text-white" />
                    {isEditMode ? "Sair do Modo Edição" : "Editar"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <TabsList className="grid w-full sm:w-fit grid-cols-2 bg-white border border-slate-200">
              <TabsTrigger
                value="history"
                className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
              >
                Histórico
              </TabsTrigger>
              <TabsTrigger
                value="glossary"
                className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
              >
                Glossário
              </TabsTrigger>
            </TabsList>

            {activeTab === "glossary" && (
              <Input
                placeholder="Buscar..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full sm:w-80 border-gray-300"
              />
            )}
          </div>

          <TabsContent value="history" className="space-y-6">
            <HistoryTable
              indicators={mockIndicators}
              years={years}
              onIndicatorSelect={handleIndicatorSelect}
            />
          </TabsContent>

          <TabsContent value="glossary" className="space-y-6">
            <GlossaryTable
              data={glossaryData}
              searchValue={searchValue}
              onDataChange={handleGlossaryDataChange}
              isEditMode={isEditMode}
              setIsEditMode={setIsEditMode}
            />
          </TabsContent>
        </Tabs>

        <ChartModal
          isOpen={isChartModalOpen}
          onClose={() => setIsChartModalOpen(false)}
          indicator={selectedIndicator}
        />

        <IndicatorSheet
          onAddIndicator={handleAddIndicator}
          open={isIndicatorSheetOpen}
          onOpenChange={setIsIndicatorSheetOpen}
        />
      </div>
    </div>
  );
}
