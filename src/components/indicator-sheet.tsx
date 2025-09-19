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
import { useTranslation } from "@/contexts/translation-context";

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

export function IndicatorSheet({
  onAddIndicator,
  open,
  onOpenChange,
}: IndicatorSheetProps) {
  const { t } = useTranslation();

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

  const categories = [
    { value: "1", label: t("category.endividamento") },
    { value: "2", label: t("category.lucratividade") },
    { value: "3", label: t("category.eficiencia") },
    { value: "4", label: t("category.crescimento") },
    { value: "5", label: t("category.rentabilidade") },
  ];

  const visualizationTypes = [
    { value: "Decimal", label: t("viewAs.decimal") },
    { value: "Monetário", label: t("viewAs.monetary") },
    { value: "Porcentagem", label: t("viewAs.percentage") },
  ];

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
      <SheetContent className="w-full sm:w-[600px] sm:max-w-[600px] p-4 sm:p-6 overflow-y-auto max-h-screen">
        <SheetHeader>
          <SheetTitle className="text-lg sm:text-xl">
            {t("sheet.title")}
          </SheetTitle>
          <SheetDescription className="text-sm sm:text-base">
            {t("sheet.description")}
          </SheetDescription>
        </SheetHeader>

        <div className="px-0 sm:px-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="indicator" className="text-sm font-medium">
                {t("sheet.indicator")}{" "}
                <span className="text-red-500">{t("sheet.required")}</span>
              </Label>
              <Input
                id="indicator"
                placeholder={t("sheet.placeholder.indicator")}
                value={formData.indicator}
                onChange={(e) =>
                  setFormData({ ...formData, indicator: e.target.value })
                }
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                {t("sheet.indicatorDescription")}{" "}
                <span className="text-red-500">{t("sheet.required")}</span>
              </Label>
              <Textarea
                id="description"
                placeholder={t("sheet.placeholder.description")}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                {t("sheet.category")}{" "}
                <span className="text-red-500">{t("sheet.required")}</span>
              </Label>
              <Select
                value={formData.fatherIndicator}
                onValueChange={(value) =>
                  setFormData({ ...formData, fatherIndicator: value })
                }
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("sheet.placeholder.category")} />
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
                {t("sheet.formula")}{" "}
                <span className="text-red-500">{t("sheet.required")}</span>
              </Label>
              <div className="relative">
                <Textarea
                  id="formula"
                  placeholder={t("sheet.placeholder.formula")}
                  value={formData.formula}
                  onChange={(e) =>
                    setFormData({ ...formData, formula: e.target.value })
                  }
                  rows={2}
                  className="w-full"
                />
                <div className="mt-2 p-3 bg-gray-50 rounded-md border">
                  <p className="text-sm text-gray-600 break-words">
                    {formData.formula || t("sheet.placeholder.formulaPreview")}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="viewAs" className="text-sm font-medium">
                {t("sheet.viewAs")}{" "}
                <span className="text-red-500">{t("sheet.required")}</span>
              </Label>
              <Select
                value={formData.viewAs}
                onValueChange={(value) =>
                  setFormData({ ...formData, viewAs: value })
                }
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("sheet.placeholder.viewAs")} />
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

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                {t("sheet.cancel")}
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto order-1 sm:order-2"
              >
                {t("sheet.save")}
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
