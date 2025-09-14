import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface GlossaryItem {
  id: number;
  indicator: string;
  description: string;
  formula: string;
  viewAs: string;
  fatherIndicator?: number;
  formulaId?: number;
}

interface IndicatorSheetProps {
  onAddIndicator: (indicator: Omit<GlossaryItem, "id">) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const categories = [
  { value: "1", label: "Endividamento/Liquidez" },
  { value: "2", label: "Lucratividade" },
  { value: "3", label: "Eficiência Operacional" },
  { value: "4", label: "Crescimento e Valor" },
  { value: "5", label: "Rentabilidade" },
];

const visualizationTypes = [
  { value: "Decimal", label: "Decimal" },
  { value: "Monetário", label: "Monetário" },
  { value: "Porcentagem", label: "Porcentagem" },
];

export function IndicatorSheet({
  onAddIndicator,
  open,
  onOpenChange,
}: IndicatorSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const [formData, setFormData] = useState({
    indicator: "",
    description: "",
    fatherIndicator: "",
    formula: "",
    viewAs: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.indicator ||
      !formData.description ||
      !formData.fatherIndicator ||
      !formData.viewAs
    ) {
      return;
    }

    onAddIndicator({
      indicator: formData.indicator,
      description: formData.description,
      formula: formData.formula,
      viewAs: formData.viewAs,
      fatherIndicator: Number.parseInt(formData.fatherIndicator),
      formulaId: Date.now(),
    });

    setFormData({
      indicator: "",
      description: "",
      fatherIndicator: "",
      formula: "",
      viewAs: "",
    });

    setIsOpen(false);
  };

  const handleCancel = () => {
    setFormData({
      indicator: "",
      description: "",
      fatherIndicator: "",
      formula: "",
      viewAs: "",
    });
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-[600px] sm:max-w-[600px] p-6">
        <SheetHeader>
          <SheetTitle>Cadastrar Indicador</SheetTitle>
          <SheetDescription>
            Preencha os campos abaixo para cadastrar um novo indicador
          </SheetDescription>
        </SheetHeader>

        <div className="px-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="indicator" className="text-sm font-medium">
                Indicador <span className="text-red-500">*</span>
              </Label>
              <Input
                id="indicator"
                placeholder="Digite o nome do indicador..."
                value={formData.indicator}
                onChange={(e) =>
                  setFormData({ ...formData, indicator: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Descrição <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Digite a descrição do indicador..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Categoria do Indicador <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.fatherIndicator}
                onValueChange={(value) =>
                  setFormData({ ...formData, fatherIndicator: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="formula" className="text-sm font-medium">
                Fórmula <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Textarea
                  id="formula"
                  placeholder="Busque indicadores, digite números e operadores (+ - * / % = () ^2 ^3)..."
                  value={formData.formula}
                  onChange={(e) =>
                    setFormData({ ...formData, formula: e.target.value })
                  }
                  rows={2}
                />
                <div className="mt-2 p-3 bg-gray-50 rounded-md border">
                  <p className="text-sm text-gray-600">
                    {formData.formula || "Sua fórmula aparecerá aqui"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="viewAs" className="text-sm font-medium">
                Visualizar como: <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.viewAs}
                onValueChange={(value) =>
                  setFormData({ ...formData, viewAs: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {visualizationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Salvar
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
