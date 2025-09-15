import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  DollarSign,
  Target,
  BarChart3,
  TrendingUp,
  Activity,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface ProcessedIndicator {
  id: number;
  name: string;
  description: string;
  visualizationType: number;
  fatherIndicator: number;
  values: { [year: string]: number };
}

interface HistoryTableProps {
  indicators: ProcessedIndicator[];
  years: string[];
  onIndicatorSelect: (indicator: ProcessedIndicator) => void;
}

const categoryConfig = {
  1: {
    name: "Endividamento/Liquidez",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-l-blue-500",
    icon: <Target className="w-4 h-4 text-blue-500" />,
  },
  2: {
    name: "Lucratividade",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-l-emerald-500",
    icon: <DollarSign className="w-4 h-4 text-emerald-500" />,
  },
  3: {
    name: "Eficiência Operacional",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-l-orange-500",
    icon: <Activity className="w-4 h-4 text-orange-500" />,
  },
  4: {
    name: "Crescimento e Valor",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-l-purple-500",
    icon: <TrendingUp className="w-4 h-4 text-purple-500" />,
  },
  5: {
    name: "Rentabilidade",
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-l-red-500",
    icon: <Target className="w-4 h-4 text-red-500" />,
  },
};

export function HistoryTable({
  indicators,
  years,
  onIndicatorSelect,
}: HistoryTableProps) {
  const [showAllLevels, setShowAllLevels] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set([1, 2, 3, 4, 5])
  );

  const formatValue = (value: number, visualizationType: number): string => {
    if (value === 0) return "0,00";

    switch (visualizationType) {
      case 1:
        return value.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      case 2:
        return value.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      case 3:
        return `${value.toFixed(2)}%`;
      default:
        return value.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
    }
  };

  const toggleCategory = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const groupedIndicators = indicators.reduce((acc, indicator) => {
    const categoryId = indicator.fatherIndicator;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(indicator);
    return acc;
  }, {} as { [key: number]: ProcessedIndicator[] });

  return (
    <div className="flex flex-col w-full h-full bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200 rounded-t-lg">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700">
                Mostrar todos os níveis
              </span>
              <Switch
                checked={showAllLevels}
                onCheckedChange={(checked) => {
                  setShowAllLevels(checked);
                  if (checked) {
                    setExpandedCategories(new Set([1, 2, 3, 4, 5]));
                  } else {
                    setExpandedCategories(new Set());
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow max-w-[100%]">
        <div className="overflow-auto md:h-[calc(100vh-320px)]">
          <div className="hidden md:grid grid-cols-[2fr_repeat(4,1fr)] gap-4 p-4 bg-slate-100 border-b border-slate-200 font-semibold text-slate-700 text-sm sticky top-0 z-10">
            <div>INDICADORES FINANCEIROS</div>
            {years.map((year) => (
              <div key={year} className="text-center font-bold text-slate-900">
                {year}
              </div>
            ))}
          </div>

          <div className="divide-y divide-slate-200">
            {Object.entries(groupedIndicators)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([categoryId, categoryIndicators]) => {
                const categoryIdNum = Number(categoryId);
                const config =
                  categoryConfig[categoryIdNum as keyof typeof categoryConfig];
                const isExpanded = expandedCategories.has(categoryIdNum);

                return (
                  <div key={categoryId}>
                    <div
                      className={`${config.bgColor} ${config.borderColor} border-l-4 cursor-pointer hover:opacity-80 transition-opacity`}
                      onClick={() => toggleCategory(categoryIdNum)}
                    >
                      <div className="p-4">
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-slate-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                          )}
                          {config.icon}
                          <span className={`font-semibold ${config.color}`}>
                            {config.name} ({categoryIndicators.length})
                          </span>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="bg-white">
                        {categoryIndicators.map((indicator, index) => (
                          <div
                            key={indicator.id}
                            className={`${
                              index % 2 === 0 ? "bg-white" : "bg-slate-50"
                            } hover:bg-slate-100 transition-colors`}
                          >
                            <div className="md:hidden p-4 space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-slate-900">
                                    {indicator.name}
                                  </h4>
                                  <p className="text-sm text-slate-600 mt-1">
                                    {indicator.description}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onIndicatorSelect(indicator)}
                                  className="ml-2"
                                >
                                  <BarChart3 className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {years.map((year) => (
                                  <div
                                    key={year}
                                    className="flex justify-between p-2 bg-white rounded border"
                                  >
                                    <span className="text-sm font-medium text-slate-600">
                                      {year}
                                    </span>
                                    <span className="text-sm font-semibold text-slate-900">
                                      {formatValue(
                                        indicator.values[year] || 0,
                                        indicator.visualizationType
                                      )}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="hidden md:grid grid-cols-[2fr_repeat(4,1fr)] gap-4 p-4 items-center">
                              <div className="flex items-center justify-between pl-8">
                                <div className="flex items-center gap-3">
                                  <DollarSign className="w-3 h-3 text-slate-400" />
                                  <div>
                                    <div className="font-medium text-slate-900">
                                      {indicator.name}
                                    </div>
                                    <div className="text-sm text-slate-600">
                                      {indicator.description}
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onIndicatorSelect(indicator)}
                                >
                                  <BarChart3 className="w-4 h-4" />
                                </Button>
                              </div>
                              {years.map((year) => (
                                <div
                                  key={year}
                                  className="text-center font-medium text-slate-900"
                                >
                                  {formatValue(
                                    indicator.values[year] || 0,
                                    indicator.visualizationType
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
