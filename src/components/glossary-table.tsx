import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  FiChevronUp,
  FiChevronDown,
  FiX,
  FiCheck,
  FiMove,
} from "react-icons/fi";
import {
  DndProvider,
  useDrag,
  useDrop,
  type DragSourceMonitor,
} from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import {
  MultiBackend,
  TouchTransition,
  MouseTransition,
} from "react-dnd-multi-backend";
import { Button } from "./ui/button";
import { toast } from "sonner";
import CardGlossaryEditable, { type TableMeta } from "./card-glossary-editable";

const HTML5toTouch = {
  backends: [
    {
      id: "html5",
      backend: HTML5Backend,
      transition: MouseTransition,
    },
    {
      id: "touch",
      backend: TouchBackend,
      options: {
        enableMouseEvents: false,
        delayTouchStart: 100,
        delayMouseStart: 0,
        touchSlop: 10,
        ignoreContextMenu: true,
        enableHoverOutsideTarget: true,
        enableKeyboardEvents: false,
      },
      preview: true,
      transition: TouchTransition,
    },
  ],
};

interface GlossaryItem {
  id: number;
  indicator: string;
  description: string;
  formula: string;
  viewAs: string;
  fatherIndicator?: number;
  formulaId?: number;
}

interface GroupedOption {
  label: string;
  value: string;
}

const fatherIndicatorNames: { [key: number]: string } = {
  1: "Endividamento/Liquidez",
  2: "Lucratividade",
  3: "Eficiência Operacional",
  4: "Crescimento e Valor",
  5: "Rentabilidade",
};

const categoryConfig: {
  [key: number]: { bgColor: string; color: string; icon: React.JSX.Element };
} = {
  1: {
    bgColor: "bg-blue-50",
    color: "text-blue-700",
    icon: <div className="w-3 h-3 bg-blue-500 rounded-full"></div>,
  },
  2: {
    bgColor: "bg-green-50",
    color: "text-green-700",
    icon: <div className="w-3 h-3 bg-green-500 rounded-full"></div>,
  },
  3: {
    bgColor: "bg-orange-50",
    color: "text-orange-700",
    icon: <div className="w-3 h-3 bg-orange-500 rounded-full"></div>,
  },
  4: {
    bgColor: "bg-purple-50",
    color: "text-purple-700",
    icon: <div className="w-3 h-3 bg-purple-500 rounded-full"></div>,
  },
  5: {
    bgColor: "bg-red-50",
    color: "text-red-700",
    icon: <div className="w-3 h-3 bg-red-500 rounded-full"></div>,
  },
};

interface GlossaryTableProps {
  data: GlossaryItem[];
  searchValue?: string;
  isEditMode?: boolean;
  setIsEditMode?: (editMode: boolean) => void;
  onDataChange?: (data: GlossaryItem[]) => void;
  onHistoryRefresh?: () => Promise<void>;
}

interface DraggableIndicatorRowProps {
  item: GlossaryItem;
  index: number;
  fatherId: number;
  onMoveToGroup: (itemId: number, newFatherId: number) => void;
  meta: TableMeta;
  columnWidths: { [key: string]: string };
}

const DraggableMobileCard: React.FC<{
  item: GlossaryItem;
  index: number;
  fatherId: number;
  onMoveToGroup: (itemId: number, newFatherId: number) => void;
  meta: TableMeta;
}> = ({ item, index, fatherId, onMoveToGroup, meta }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: "INDICATOR",
    item: { id: item.id, currentFatherId: fatherId },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => meta.isEditMode,
  });

  useEffect(() => {
    if (isDragging) {
      setIsDragActive(true);
    } else {
      setIsDragActive(false);
    }
  }, [isDragging]);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "INDICATOR",
    drop: (draggedItem: { id: number; currentFatherId: number }) => {
      if (
        draggedItem.id !== item.id &&
        draggedItem.currentFatherId !== fatherId
      ) {
        onMoveToGroup(draggedItem.id, fatherId);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const cardRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  drag(dragHandleRef);
  drop(cardRef);
  dragPreview(cardRef);

  return (
    <div
      ref={cardRef}
      className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm transition-all duration-200 ${
        isDragging ? "opacity-50 scale-95 z-50" : ""
      } ${isOver && canDrop ? "bg-blue-50 border-blue-300 shadow-lg" : ""} ${
        isDragActive ? "shadow-xl" : ""
      }`}
      style={{
        touchAction: "manipulation",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    >
      <div className="space-y-3">
        {meta.isEditMode && (
          <div className="flex justify-center mb-2">
            <div
              ref={dragHandleRef}
              className="cursor-move p-3 text-gray-400 hover:text-gray-600 active:text-gray-800 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded-lg touch-manipulation select-none transition-colors"
              style={{
                touchAction: "none",
                userSelect: "none",
                WebkitUserSelect: "none",
                WebkitTouchCallout: "none",
                minHeight: "48px",
                minWidth: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onTouchStart={(e) => {
                e.preventDefault();
              }}
            >
              <FiMove className="w-5 h-5" />
            </div>
          </div>
        )}

        <div style={{ pointerEvents: isDragActive ? "none" : "auto" }}>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Indicador
          </label>
          <CardGlossaryEditable
            item={item}
            index={index}
            field="indicator"
            meta={meta}
          />
        </div>

        <div style={{ pointerEvents: isDragActive ? "none" : "auto" }}>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Descrição
          </label>
          <CardGlossaryEditable
            item={item}
            index={index}
            field="description"
            meta={meta}
          />
        </div>

        <div style={{ pointerEvents: isDragActive ? "none" : "auto" }}>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            Fórmula
          </label>
          <CardGlossaryEditable
            item={item}
            index={index}
            field="formula"
            meta={meta}
          />
        </div>

        <div style={{ pointerEvents: isDragActive ? "none" : "auto" }}>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Visualizado em
          </label>
          <CardGlossaryEditable
            item={item}
            index={index}
            field="viewAs"
            meta={meta}
          />
        </div>
      </div>
    </div>
  );
};

const DraggableIndicatorRow: React.FC<DraggableIndicatorRowProps> = ({
  item,
  index,
  fatherId,
  onMoveToGroup,
  meta,
  columnWidths,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "INDICATOR",
    item: { id: item.id, currentFatherId: fatherId },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "INDICATOR",
    drop: (draggedItem: { id: number; currentFatherId: number }) => {
      if (
        draggedItem.id !== item.id &&
        draggedItem.currentFatherId !== fatherId
      ) {
        onMoveToGroup(draggedItem.id, fatherId);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const ref = useRef<HTMLTableRowElement>(null);
  drag(drop(ref));

  return (
    <tr
      ref={ref}
      className={`transition-colors duration-150 hover:bg-blue-50/50 ${
        isDragging ? "opacity-50" : ""
      } ${isOver ? "bg-blue-100" : ""} ${
        index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
      }`}
    >
      {meta.isEditMode && (
        <td className="px-4 py-4 text-center w-8">
          <div className="cursor-move text-gray-400 hover:text-gray-600 flex justify-center">
            <FiMove className="w-4 h-4" />
          </div>
        </td>
      )}
      <td
        className={`px-4 py-4 text-sm text-gray-700 border-r border-gray-100 last:border-r-0 ${
          columnWidths.indicator || ""
        }`}
      >
        <CardGlossaryEditable
          item={item}
          index={index}
          field="indicator"
          meta={meta}
        />
      </td>
      <td
        className={`px-4 py-4 text-sm text-gray-700 border-r border-gray-100 last:border-r-0 ${
          columnWidths.description || ""
        }`}
      >
        <CardGlossaryEditable
          item={item}
          index={index}
          field="description"
          meta={meta}
        />
      </td>
      <td
        className={`px-4 py-4 text-sm text-gray-700 border-r border-gray-100 last:border-r-0 ${
          columnWidths.formula || ""
        }`}
      >
        <CardGlossaryEditable
          item={item}
          index={index}
          field="formula"
          meta={meta}
        />
      </td>
      <td
        className={`px-4 py-4 text-sm text-gray-700 border-r border-gray-100 last:border-r-0 ${
          columnWidths.viewAs || ""
        }`}
      >
        <CardGlossaryEditable
          item={item}
          index={index}
          field="viewAs"
          meta={meta}
        />
      </td>
    </tr>
  );
};

const GlossaryTable: React.FC<GlossaryTableProps> = ({
  data = [],
  searchValue = "",
  isEditMode = false,
  setIsEditMode,
  onDataChange,
  onHistoryRefresh,
}) => {
  const [tableData, setTableData] = useState<GlossaryItem[]>(data);
  const [originalData, setOriginalData] = useState<GlossaryItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [openGroups, setOpenGroups] = useState<{ [key: number]: boolean }>({});
  const [groupedData, setGroupedData] = useState<{
    [key: number]: GlossaryItem[];
  }>({});

  const dreOptions: GroupedOption[] = [];
  const dfcOptions: GroupedOption[] = [];
  const ncgOptions: GroupedOption[] = [];
  const launchOptions: GroupedOption[] = [];

  const groupDataByFatherIndicator = useCallback((data: GlossaryItem[]) => {
    const grouped: { [key: number]: GlossaryItem[] } = {};

    data.forEach((item) => {
      const fatherId = item.fatherIndicator || 0;
      if (!grouped[fatherId]) {
        grouped[fatherId] = [];
      }
      grouped[fatherId].push(item);
    });

    return grouped;
  }, []);

  const handleToggleGroup = (fatherId: number) => {
    setOpenGroups((prev) => ({
      ...prev,
      [fatherId]: !prev[fatherId],
    }));
  };

  const moveItemToGroup = (itemId: number, newFatherId: number) => {
    setTableData((prevData) => {
      const newData = prevData.map((item) =>
        item.id === itemId ? { ...item, fatherIndicator: newFatherId } : item
      );

      const newGrouped = groupDataByFatherIndicator(newData);
      setGroupedData(newGrouped);

      setTimeout(() => {
        detectChanges(newData);
      }, 0);

      return newData;
    });
  };

  const detectChanges = useCallback(
    (newData: GlossaryItem[]) => {
      if (!isEditMode || originalData.length === 0) {
        setHasChanges(false);
        return;
      }

      const hasAnyChanges = newData.some((row) => {
        const original = originalData.find((orig) => orig.id === row.id);
        if (!original) return true;
        return Object.keys(row).some((key) => {
          if (key === "id" || key === "formulaId") return false;
          return (
            row[key as keyof GlossaryItem] !==
            original[key as keyof GlossaryItem]
          );
        });
      });

      setHasChanges(hasAnyChanges);
    },
    [isEditMode, originalData]
  );

  const filteredData = useMemo(() => {
    if (!searchValue) return data;

    return data.filter(
      (item) =>
        item.indicator.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.description.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.formula.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [data, searchValue]);

  useEffect(() => {
    const newData = JSON.parse(JSON.stringify(filteredData));
    setTableData(newData);

    const grouped = groupDataByFatherIndicator(newData);
    setGroupedData(grouped);

    const initialOpenState: { [key: number]: boolean } = {};
    Object.keys(grouped).forEach((key) => {
      initialOpenState[Number.parseInt(key)] = true;
    });
    setOpenGroups(initialOpenState);

    if (!isEditMode) {
      setOriginalData(JSON.parse(JSON.stringify(newData)));
    }
  }, [filteredData, isEditMode, groupDataByFatherIndicator]);

  const handleGlossaryChange = useCallback(
    (rowIndex: number, columnId: string, value: string) => {
      setTableData((prevData) => {
        const newData = [...prevData];
        if (
          newData[rowIndex] &&
          newData[rowIndex][columnId as keyof GlossaryItem] !== value
        ) {
          newData[rowIndex] = { ...newData[rowIndex], [columnId]: value };

          const newGrouped = groupDataByFatherIndicator(newData);
          setGroupedData(newGrouped);

          setTimeout(() => {
            detectChanges(newData);
          }, 0);
        }
        return newData;
      });
    },
    [detectChanges, groupDataByFatherIndicator]
  );

  const handleCancelEdit = useCallback(() => {
    if (hasChanges) {
      const restoredData = JSON.parse(JSON.stringify(originalData));
      setTableData(restoredData);
    }
    setIsEditMode?.(false);
    setHasChanges(false);
  }, [hasChanges, originalData, setIsEditMode]);

  const handleSaveGlossary = async () => {
    const changedItems = tableData.filter((item) => {
      const original = originalData.find((orig) => orig.id === item.id);
      if (!original) {
        return true;
      }
      const hasChanges = Object.keys(item).some((key) => {
        if (key === "id") return false;
        const itemValue = item[key as keyof GlossaryItem];
        const originalValue = original[key as keyof GlossaryItem];
        const changed = itemValue !== originalValue;
        return changed;
      });
      return hasChanges;
    });

    if (changedItems.length === 0) {
      toast.warning("Nenhuma alteração foi detectada.");
      return;
    }

    setIsSaving(true);
    try {
      toast.success(
        `${changedItems.length} indicador(es) atualizado(s) com sucesso!`
      );
      setOriginalData(JSON.parse(JSON.stringify(tableData)));
      if (onDataChange) {
        onDataChange(tableData);
      }
      if (onHistoryRefresh) {
        await onHistoryRefresh();
      }
      setIsEditMode?.(false);
      setHasChanges(false);
    } catch (error) {
      console.error("Erro ao atualizar os indicadores:", error);
      toast.error("Erro ao salvar alterações");
    } finally {
      setIsSaving(false);
    }
  };

  const columnWidths = {
    indicator: "w-[250px] min-w-[250px]",
    description: "w-[250px] min-w-[250px]",
    formula: "w-[300px] min-w-[300px]",
    viewAs: "w-[150px] min-w-[100px]",
  };

  const MobileGroupHeader: React.FC<{
    fatherId: number;
    config: any;
    isOpen: boolean;
    onToggle: () => void;
    onDrop: (itemId: number, newFatherId: number) => void;
  }> = ({ fatherId, config, isOpen, onToggle, onDrop }) => {
    const [{ isOver, canDrop }, drop] = useDrop({
      accept: "INDICATOR",
      drop: (draggedItem: { id: number; currentFatherId: number }) => {
        if (draggedItem.currentFatherId !== fatherId) {
          onDrop(draggedItem.id, fatherId);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    });

    const headerRef = useRef<HTMLDivElement>(null);
    drop(headerRef);

    return (
      <div
        ref={headerRef}
        className={`${
          config.bgColor
        } rounded-lg p-4 cursor-pointer border-l-4 border-l-blue-500 transition-all ${
          isOver && canDrop
            ? "bg-blue-100 border-l-blue-600 shadow-lg scale-105"
            : ""
        }`}
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {config.icon}
            <span className={`font-semibold ${config.color}`}>
              {fatherIndicatorNames[fatherId] || `Grupo ${fatherId}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isOver && canDrop && (
              <div className="text-blue-600 text-sm font-medium">
                Solte aqui
              </div>
            )}
            {isOpen ? (
              <FiChevronUp className="text-gray-600" />
            ) : (
              <FiChevronDown className="text-gray-600" />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <div className="flex flex-col w-full h-full bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200 rounded-t-lg">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-bold text-[#494949]">
                    INDICADORES ({tableData.length})
                  </div>
                </div>
              </div>
              {isEditMode && (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="hidden md:flex px-4 text-sm text-black bg-gray-200 hover:bg-gray-300"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                  >
                    Cancelar
                  </Button>
                  <button
                    className="hidden md:flex px-4 text-sm text-white justify-center items-center bg-blue-600 rounded hover:bg-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    onClick={handleSaveGlossary}
                    disabled={isSaving || !hasChanges}
                  >
                    {isSaving ? "Salvando..." : "Salvar Alterações"}
                  </button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="md:hidden p-2 text-black bg-gray-200 hover:bg-gray-300"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                  >
                    <FiX className="w-4 h-4" />
                  </Button>
                  <button
                    className="md:hidden p-2 text-white bg-blue-600 rounded hover:bg-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    onClick={handleSaveGlossary}
                    disabled={isSaving || !hasChanges}
                  >
                    <FiCheck className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="hidden md:block md:h-[calc(100vh-320px)] flex-grow max-w-[100%]">
          <div className="h-full overflow-auto">
            <table className="w-full text-sm border-collapse">
              {Object.keys(groupedData).length > 0 && (
                <thead className="sticky top-0 bg-white z-20 border-b border-gray-200">
                  <tr className="bg-gradient-to-r from-gray-50 to-slate-50">
                    {isEditMode && (
                      <th className="px-2 py-4 w-8">
                        <div className="w-4 h-4"></div>
                      </th>
                    )}
                    <th
                      className={`px-4 py-4 text-left border-r border-gray-100 ${columnWidths.indicator}`}
                    >
                      <Button
                        variant="ghost"
                        className="p-0 hover:bg-transparent text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2"
                      >
                        <span className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Indicador
                        </span>
                      </Button>
                    </th>
                    <th
                      className={`px-4 py-4 text-left border-r border-gray-100 ${columnWidths.description}`}
                    >
                      <Button
                        variant="ghost"
                        className="p-0 hover:bg-transparent text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2"
                      >
                        <span className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Descrição
                        </span>
                      </Button>
                    </th>
                    <th
                      className={`px-4 py-4 text-left border-r border-gray-100 ${columnWidths.formula}`}
                    >
                      <Button
                        variant="ghost"
                        className="p-0 hover:bg-transparent text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2"
                      >
                        <span className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          Fórmula
                        </span>
                      </Button>
                    </th>
                    <th
                      className={`px-4 py-4 text-left border-r border-gray-100 last:border-r-0 ${columnWidths.viewAs}`}
                    >
                      <Button
                        variant="ghost"
                        className="p-0 hover:bg-transparent text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2 whitespace-nowrap"
                      >
                        <span className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          Visualizado em
                        </span>
                      </Button>
                    </th>
                  </tr>
                </thead>
              )}
              <tbody className="divide-y divide-gray-100">
                {Object.keys(groupedData).length > 0 ? (
                  Object.entries(groupedData).map(([fatherId, items]) => {
                    const fatherIdNum = Number.parseInt(fatherId);
                    const isOpen = openGroups[fatherIdNum];
                    const config = categoryConfig[fatherIdNum] || {
                      bgColor: "bg-gray-50",
                      color: "text-gray-700",
                      icon: (
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      ),
                    };

                    return (
                      <React.Fragment key={fatherId}>
                        <tr
                          className={`${config.bgColor} cursor-pointer font-semibold border-b-2 border-gray-200`}
                          onClick={() => handleToggleGroup(fatherIdNum)}
                        >
                          {isEditMode && <td className="px-2 py-3 w-8"></td>}
                          <td className={`px-4 py-3 ${config.color}`}>
                            <div className="flex items-center gap-2">
                              {config.icon}
                              <span className="font-semibold">
                                {fatherIndicatorNames[fatherIdNum] ||
                                  `Grupo ${fatherId}`}
                              </span>
                              {isOpen ? (
                                <FiChevronUp className="ml-auto" />
                              ) : (
                                <FiChevronDown className="ml-auto" />
                              )}
                            </div>
                          </td>
                          <td
                            colSpan={3}
                            className="px-4 py-3 text-sm text-gray-500"
                          ></td>
                        </tr>

                        {isOpen &&
                          items.map((item, index) => (
                            <DraggableIndicatorRow
                              key={item.id}
                              item={item}
                              index={index}
                              fatherId={fatherIdNum}
                              onMoveToGroup={moveItemToGroup}
                              meta={
                                {
                                  updateData: handleGlossaryChange,
                                  isEditMode,
                                  dreOptions,
                                  dfcOptions,
                                  ncgOptions,
                                  launchOptions,
                                } as TableMeta
                              }
                              columnWidths={columnWidths}
                            />
                          ))}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="h-24 text-center">
                      {searchValue
                        ? "Nenhum resultado encontrado para sua busca."
                        : "Nenhum indicador encontrado - Clique no menu para cadastrar um indicador."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="md:hidden flex-grow">
          <div className="overflow-auto p-4 space-y-4">
            {Object.keys(groupedData).length > 0 ? (
              Object.entries(groupedData).map(([fatherId, items]) => {
                const fatherIdNum = Number.parseInt(fatherId);
                const isOpen = openGroups[fatherIdNum];
                const config = categoryConfig[fatherIdNum] || {
                  bgColor: "bg-gray-50",
                  color: "text-gray-700",
                  icon: (
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  ),
                };

                return (
                  <div key={fatherId} className="space-y-3">
                    <MobileGroupHeader
                      fatherId={fatherIdNum}
                      config={config}
                      isOpen={isOpen}
                      onToggle={() => handleToggleGroup(fatherIdNum)}
                      onDrop={moveItemToGroup}
                    />

                    {isOpen && (
                      <div className="space-y-3 pl-4">
                        {items.map((item, index) => (
                          <DraggableMobileCard
                            key={item.id}
                            item={item}
                            index={index}
                            fatherId={fatherIdNum}
                            onMoveToGroup={moveItemToGroup}
                            meta={
                              {
                                updateData: handleGlossaryChange,
                                isEditMode,
                                dreOptions,
                                dfcOptions,
                                ncgOptions,
                                launchOptions,
                              } as TableMeta
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center h-full text-center text-gray-500">
                {searchValue
                  ? "Nenhum resultado encontrado para sua busca."
                  : "Nenhum indicador encontrado - Clique no menu para cadastrar um indicador."}
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export { GlossaryTable };
export default GlossaryTable;
