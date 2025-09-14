import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, LineChart, X } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto rounded-xl overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex-1">
            <DialogTitle className="text-xl font-semibold text-slate-900">
              Análise de {indicator.name}
            </DialogTitle>
            <p className="text-sm text-slate-600 mt-1">
              {indicator.description}
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">
                Tipo de Visualização:
              </span>
              <div className="flex gap-1">
                <Button
                  variant={chartType === "bar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("bar")}
                  className="gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Barras</span>
                </Button>
                <Button
                  variant={chartType === "line" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("line")}
                  className="gap-2"
                >
                  <LineChart className="w-4 h-4" />
                  <span className="hidden sm:inline">Linha</span>
                </Button>
              </div>
            </div>
            <Badge variant="secondary">
              {chartData.length}{" "}
              {chartData.length === 1 ? "período" : "períodos"}
            </Badge>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="h-80 sm:h-96">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "bar" ? (
                  <BarChart
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
                        indicator.name,
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
                  </BarChart>
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
                        indicator.name,
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
