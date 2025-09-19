import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, LineChart } from "lucide-react";
import {
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "@/contexts/translation-context";

interface ProcessedIndicator {
  id: number;
  name: string;
  description: string;
  visualizationType: number;
  fatherIndicator: number;
  values: { [year: string]: number };
}

interface ChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  indicator: ProcessedIndicator | null;
}

export function ChartModal({ isOpen, onClose, indicator }: ChartModalProps) {
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const { t } = useTranslation();

  if (!indicator) return null;

  const chartData = Object.entries(indicator.values)
    .map(([year, value]) => ({
      year,
      value,
    }))
    .sort((a, b) => Number(a.year) - Number(b.year));

  const formatValue = (value: number): string => {
    switch (indicator.visualizationType) {
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
        return value.toString();
    }
  };

  const getTranslatedIndicatorName = (name: string) => {
    if (name.startsWith("indicator.") || name.startsWith("glossary.")) {
      const translated = t(name);
      return translated !== name
        ? translated
        : name.replace(/^(indicator\.|glossary\.)/, "");
    }

    const indicatorMap: { [key: string]: string } = {
      "Liquidez Corrente": "indicator.liquidezCorrente",
      "Margem Líquida": "indicator.margemLiquida",
      ROE: "indicator.roe",
      "Giro do Ativo": "indicator.giroAtivo",
      "Crescimento da Receita": "indicator.crescimentoReceita",
      "EBITDA / RECEITA OPERACIONAL LIQUIDA": "glossary.ebitdaReceita",
      "EBITDA / DESPESAS ESTRUTURAIS": "glossary.ebitdaDespesas",
      "RECEITA OPERACIONAL + 100": "glossary.receitaOperacional",
      "EBITDA / RECEITA FINANCEIRAS": "glossary.ebitdaFinanceiras",
      "Prazo Médio de Recebimento": "glossary.prazoRecebimento",
      "Valor Patrimonial por Ação": "glossary.valorPatrimonial",
      ROA: "glossary.roa",
    };

    const translationKey = indicatorMap[name];
    if (translationKey) {
      const translated = t(translationKey);
      return translated !== translationKey ? translated : name;
    }

    return name;
  };

  const getTranslatedIndicatorDescription = (description: string) => {
    if (
      description.startsWith("description.") ||
      description.startsWith("glossary.desc.")
    ) {
      const translated = t(description);
      return translated !== description
        ? translated
        : description.replace(/^(description\.|glossary\.desc\.)/, "");
    }

    const descriptionMap: { [key: string]: string } = {
      "Capacidade de pagamento de curto prazo": "description.liquidezCorrente",
      "Percentual de lucro líquido sobre receita": "description.margemLiquida",
      "Retorno sobre patrimônio líquido": "description.roe",
      "Eficiência na utilização dos ativos": "description.giroAtivo",
      "Taxa de crescimento anual da receita": "description.crescimentoReceita",
      "DESCRIÇÃO EBITDA / RECEITA OPERACIONAL LIQUIDA":
        "glossary.desc.ebitdaReceita",
      DESCRIÇÃO: "glossary.desc.ebitdaDespesas",
      "DESCRIÇÃO RECEITA OPERACIONAL + 100": "glossary.desc.receitaOperacional",
      "DESCRIÇÃO DE RECEITA LIQUIDA": "glossary.desc.ebitdaFinanceiras",
      "Tempo médio para receber vendas a prazo":
        "glossary.desc.prazoRecebimento",
      "Valor contábil por ação ordinária": "glossary.desc.valorPatrimonial",
      "Mede o retorno obtido sobre o patrimônio líquido investido":
        "glossary.desc.roe",
      "Retorno sobre os ativos totais da empresa": "glossary.desc.roa",
    };

    const translationKey = descriptionMap[description];
    if (translationKey) {
      const translated = t(translationKey);
      return translated !== translationKey ? translated : description;
    }

    return description;
  };

  const translatedName = getTranslatedIndicatorName(indicator.name);
  const translatedDescription = getTranslatedIndicatorDescription(
    indicator.description
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto rounded-xl overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex-1">
            <DialogTitle className="text-xl font-semibold text-slate-900">
              {t("chart.analysisOf")} {translatedName}
            </DialogTitle>
            <p className="text-sm text-slate-600 mt-1">
              {translatedDescription}
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">
                {t("chart.visualizationType")}:
              </span>
              <div className="flex gap-1">
                <Button
                  variant={chartType === "bar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("bar")}
                  className="gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("chart.bars")}</span>
                </Button>
                <Button
                  variant={chartType === "line" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("line")}
                  className="gap-2"
                >
                  <LineChart className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("chart.line")}</span>
                </Button>
              </div>
            </div>
            <Badge variant="secondary">
              {chartData.length}{" "}
              {chartData.length === 1 ? t("chart.period") : t("chart.periods")}
            </Badge>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="h-80 sm:h-96">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "bar" ? (
                  <RechartsBarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="year"
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={{ stroke: "#cbd5e1" }}
                    />
                    <YAxis
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={{ stroke: "#cbd5e1" }}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        formatValue(value),
                        translatedName,
                      ]}
                      labelStyle={{ color: "#1e293b" }}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                ) : (
                  <RechartsLineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="year"
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={{ stroke: "#cbd5e1" }}
                    />
                    <YAxis
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={{ stroke: "#cbd5e1" }}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        formatValue(value),
                        translatedName,
                      ]}
                      labelStyle={{ color: "#1e293b" }}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, fill: "#059669" }}
                    />
                  </RechartsLineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
