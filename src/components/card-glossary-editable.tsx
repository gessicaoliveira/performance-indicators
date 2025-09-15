import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { FiMove } from "react-icons/fi";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface GlossaryItem {
  id: number;
  indicator: string;
  description: string;
  formula: string;
  viewAs: string;
  fatherIndicator?: number;
  formulaId?: number;
}

interface OptionType {
  value: string;
  label: string;
}

export type TableMeta = {
  updateData: (rowIndex: number, columnId: string, value: string) => void;
  isEditMode: boolean;
  dreOptions?: OptionType[];
  dfcOptions?: OptionType[];
  ncgOptions?: OptionType[];
  launchOptions?: OptionType[];
};

interface CardGlossaryEditableProps {
  item: GlossaryItem;
  index: number;
  field: keyof GlossaryItem;
  meta: TableMeta;
}

const CardGlossaryEditable: React.FC<CardGlossaryEditableProps> = ({
  item,
  index,
  field,
  meta,
}) => {
  const [isActivelyEditing, setIsActivelyEditing] = useState(false);
  const [localValue, setLocalValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isEditing = meta.isEditMode;

  const options: OptionType[] = [
    { value: "Decimal", label: "Decimal" },
    { value: "Monetário", label: "Monetário" },
    { value: "Porcentagem", label: "Porcentagem" },
  ];

  const currentValue = isActivelyEditing ? localValue : (item[field] as string);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedUpdate = useCallback(
    (newValue: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        meta.updateData(index, field, newValue);
      }, 300);
    },
    [meta, index, field]
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedUpdate(newValue);
  };

  const handleSelectChange = (value: string) => {
    meta.updateData(index, field, value);
  };

  const handleFocus = () => {
    setIsActivelyEditing(true);
    setLocalValue(item[field] as string);
  };

  const handleBlur = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    meta.updateData(index, field, localValue);
    setIsActivelyEditing(false);
  };

  if (isEditing) {
    const tabIndex =
      index * 4 +
      (field === "indicator"
        ? 1
        : field === "description"
        ? 2
        : field === "formula"
        ? 3
        : field === "viewAs"
        ? 4
        : 1);

    if (field === "formula") {
      return (
        <div className="whitespace-normal break-words w-full">
          <Textarea
            value={currentValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-normal text-[#5F5F5F] min-h-[100px] md:min-h-[120px] resize-none"
            rows={3}
            tabIndex={tabIndex}
            placeholder="Digite a fórmula..."
          />
        </div>
      );
    }

    if (field === "viewAs") {
      return (
        <div className="whitespace-normal break-words w-full">
          <Select value={currentValue} onValueChange={handleSelectChange}>
            <SelectTrigger className="w-full text-sm h-10">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (field === "indicator") {
      return (
        <div className="whitespace-normal break-words w-full">
          <div className="flex flex-col items-center gap-2">
            <FiMove
              className="hidden md:block cursor-move text-gray-400 bg-gray-100 p-1 rounded touch-manipulation"
              size={20}
            />
            <Textarea
              ref={textareaRef}
              value={currentValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-normal text-[#5F5F5F] min-h-[80px] md:min-h-[120px] resize-none"
              rows={2}
              tabIndex={tabIndex}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="whitespace-normal break-words w-full">
        <Textarea
          ref={textareaRef}
          value={currentValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-normal text-[#5F5F5F] min-h-[80px] md:min-h-[120px] resize-none"
          rows={2}
          tabIndex={tabIndex}
        />
      </div>
    );
  }

  if (field === "formula") {
    return (
      <div className="whitespace-normal break-words w-full">
        <div className="text-sm text-gray-700">{currentValue}</div>
      </div>
    );
  }

  return (
    <div className="whitespace-normal break-words w-full">
      <div className="break-words whitespace-normal text-sm text-gray-700">
        {currentValue}
      </div>
    </div>
  );
};

export default CardGlossaryEditable;
