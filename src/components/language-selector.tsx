import { useTranslation } from "@/contexts/translation-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages } from "lucide-react";

export function LanguageSelector() {
  const { language, setLanguage, t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <Languages className="h-4 w-4 text-gray-600" />
      <Select
        value={language}
        onValueChange={(value: "pt" | "en") => setLanguage(value)}
      >
        <SelectTrigger className="w-20 h-8 text-xs border-gray-200">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pt">PT</SelectItem>
          <SelectItem value="en">EN</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
