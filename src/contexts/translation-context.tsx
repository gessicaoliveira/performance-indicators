"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type Language = "pt" | "en";

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isHydrated: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

const translations = {
  pt: {
    // Header
    "header.title": "Empresa",
    "header.subtitle": "Indicadores de Performance Empresarial",
    "header.actions": "Ações",
    "header.language": "Idioma",

    // Tabs
    "tabs.history": "Histórico",
    "tabs.glossary": "Glossário",

    // Buttons
    "button.edit": "Editar",
    "button.edit.save": "Salvar",
    "button.save": "Salvar alterações",
    "button.cancel": "Cancelar",
    "button.add": "Adicionar Indicador",
    "button.export": "Exportar",
    "button.chart": "Gráfico",
    "button.delete": "Excluir",
    "button.saving": "Salvando...",
    "button.edit.saving": "Salvando...",

    // Table Headers - Glossary
    "table.indicator": "Indicador",
    "table.description": "Descrição",
    "table.formula": "Fórmula",
    "table.viewAs": "Visualizado em",
    "table.indicators": "INDICADORES",

    // Table Headers - History
    "table.financialIndicators": "INDICADORES FINANCEIROS",
    "table.indicatorsByCategory": "Indicadores por Categoria",
    "table.showAllLevels": "Mostrar todos os níveis",

    // Chart Modal
    "chart.analysisOf": "Análise de",
    "chart.visualizationType": "Tipo de Visualização",
    "chart.bars": "Barras",
    "chart.line": "Linha",
    "chart.period": "período",
    "chart.periods": "períodos",

    // Categories
    "category.endividamento": "Endividamento/Liquidez",
    "category.lucratividade": "Lucratividade",
    "category.eficiencia": "Eficiência Operacional",
    "category.crescimento": "Crescimento e Valor",
    "category.rentabilidade": "Rentabilidade",

    // Messages
    "message.noResults": "Nenhum resultado encontrado para sua busca.",
    "message.noIndicators":
      "Nenhum indicador encontrado - Clique no menu para cadastrar um indicador.",
    "message.noChanges": "Nenhuma alteração foi detectada.",
    "message.indicatorsUpdated": "indicador(es) atualizados com sucesso!",
    "message.errorSaving": "Erro ao salvar alterações",
    "message.dropHere": "Solte aqui",

    // Form
    "form.indicatorName": "Nome do Indicador",
    "form.description": "Descrição",
    "form.selectCategory": "Selecionar categoria",
    "form.addIndicator": "Adicionar Indicador",

    // Placeholders
    "placeholder.search": "Buscar indicadores...",
    "placeholder.indicatorName": "Digite o nome do indicador",
    "placeholder.description": "Digite a descrição do indicador",

    // Indicator Data - History Table
    "indicator.liquidezCorrente": "Liquidez Corrente",
    "indicator.margemLiquida": "Margem Líquida",
    "indicator.roe": "ROE",
    "indicator.giroAtivo": "Giro do Ativo",
    "indicator.crescimentoReceita": "Crescimento da Receita",

    // Indicator Descriptions - History Table
    "description.liquidezCorrente": "Capacidade de pagamento de curto prazo",
    "description.margemLiquida": "Percentual de lucro líquido sobre receita",
    "description.roe": "Retorno sobre patrimônio líquido",
    "description.giroAtivo": "Eficiência na utilização dos ativos",
    "description.crescimentoReceita": "Taxa de crescimento anual da receita",

    // Glossary Data - Indicators
    "glossary.ebitdaReceita": "EBITDA / RECEITA OPERACIONAL LIQUIDA",
    "glossary.ebitdaDespesas": "EBITDA / DESPESAS ESTRUTURAIS",
    "glossary.receitaOperacional": "RECEITA OPERACIONAL + 100",
    "glossary.ebitdaFinanceiras": "EBITDA / RECEITA FINANCEIRAS",
    "glossary.giroAtivo": "Giro do Ativo",
    "glossary.prazoRecebimento": "Prazo Médio de Recebimento",
    "glossary.crescimentoReceita": "Crescimento da Receita",
    "glossary.valorPatrimonial": "Valor Patrimonial por Ação",
    "glossary.roe": "ROE",
    "glossary.roa": "ROA",

    // Glossary Data - Descriptions
    "glossary.desc.ebitdaReceita":
      "Relação entre EBITDA e Receita Operacional Líquida",
    "glossary.desc.ebitdaDespesas":
      "Relação entre EBITDA e Despesas Estruturais",
    "glossary.desc.receitaOperacional":
      "Cálculo da Receita Operacional mais 100",
    "glossary.desc.ebitdaFinanceiras":
      "Relação entre EBITDA e Receita Financeira",
    "glossary.desc.giroAtivo": "Eficiência na utilização dos ativos",
    "glossary.desc.crescimentoReceita": "Descrição Crescimento da Receita",
    "glossary.desc.prazoRecebimento": "Tempo médio para receber vendas a prazo",
    "glossary.desc.valorPatrimonial": "Valor contábil por ação ordinária",
    "glossary.desc.roe":
      "Mede o retorno obtido sobre o patrimônio líquido investido",
    "glossary.desc.roa": "Retorno sobre os ativos totais da empresa",

    // View As Options
    "viewAs.decimal": "Decimal",
    "viewAs.monetary": "Monetário",
    "viewAs.percentage": "Porcentagem",

    // Indicator Sheet
    "sheet.title": "Cadastrar Indicador",
    "sheet.description":
      "Preencha os campos abaixo para cadastrar um novo indicador",
    "sheet.indicator": "Indicador",
    "sheet.indicatorDescription": "Descrição",
    "sheet.category": "Categoria do Indicador",
    "sheet.formula": "Fórmula",
    "sheet.viewAs": "Visualizar como:",
    "sheet.required": "*",
    "sheet.save": "Salvar",
    "sheet.cancel": "Cancelar",

    // Placeholders - Indicator Sheet
    "sheet.placeholder.indicator": "Digite o nome do indicador...",
    "sheet.placeholder.description": "Digite a descrição do indicador...",
    "sheet.placeholder.category": "Selecione a categoria",
    "sheet.placeholder.formula":
      "Busque indicadores, digite números e operadores (+ - * / % = () ^2 ^3)...",
    "sheet.placeholder.viewAs": "Selecione o tipo",
    "sheet.placeholder.formulaPreview": "Sua fórmula aparecerá aqui",

    // Formula translations
    "formula.ebitdaReceita": "EBITDA ÷ Receita Operacional Liquida",
    "formula.ebitdaDespesas": "EBITDA ÷ Despesas Estruturais",
    "formula.receitaOperacional": "Receita Operacional + 100",
    "formula.ebitdaFinanceiras": "EBITDA ÷ Receitas Financeiras",
    "formula.giroAtivo": "Receita Líquida ÷ Ativo Total",
    "formula.prazoRecebimento": "(Contas a Receber ÷ Receita Líquida) × 365",
    "formula.crescimentoReceita":
      "((Receita Atual - Receita Anterior) ÷ Receita Anterior) × 100",
    "formula.valorPatrimonial": "Patrimônio Líquido ÷ Número de Ações",
    "formula.roe": "(Lucro Líquido ÷ Patrimônio Líquido) × 100",
    "formula.roa": "(Lucro Líquido ÷ Ativo Total) × 100",
  },
  en: {
    // Header
    "header.title": "Company",
    "header.subtitle": "Business Performance Indicators",
    "header.actions": "Actions",
    "header.language": "Language",

    // Tabs
    "tabs.history": "History",
    "tabs.glossary": "Glossary",

    // Buttons
    "button.edit": "Edit",
    "button.edit.save": "Save",
    "button.save": "Save Changes",
    "button.cancel": "Cancel",
    "button.add": "Add Indicator",
    "button.export": "Export",
    "button.chart": "Chart",
    "button.delete": "Delete",
    "button.saving": "Saving...",
    "button.edit.saving": "Saving...",

    // Table Headers - Glossary
    "table.indicator": "Indicator",
    "table.description": "Description",
    "table.formula": "Formula",
    "table.viewAs": "View As",
    "table.indicators": "INDICATORS",

    // Table Headers - History
    "table.financialIndicators": "FINANCIAL INDICATORS",
    "table.indicatorsByCategory": "Indicators by Category",
    "table.showAllLevels": "Show all levels",

    // Chart Modal
    "chart.analysisOf": "Analysis of",
    "chart.visualizationType": "Visualization Type",
    "chart.bars": "Bars",
    "chart.line": "Line",
    "chart.period": "period",
    "chart.periods": "periods",

    // Categories
    "category.endividamento": "Debt/Liquidity",
    "category.lucratividade": "Profitability",
    "category.eficiencia": "Operational Efficiency",
    "category.crescimento": "Growth and Value",
    "category.rentabilidade": "Profitability",

    // Messages
    "message.noResults": "No results found for your search.",
    "message.noIndicators":
      "No indicators found - Click the menu to register an indicator.",
    "message.noChanges": "No changes were detected.",
    "message.indicatorsUpdated": "indicator(s) updated successfully!",
    "message.errorSaving": "Error saving changes",
    "message.dropHere": "Drop here",

    // Form
    "form.indicatorName": "Indicator Name",
    "form.description": "Description",
    "form.selectCategory": "Select category",
    "form.addIndicator": "Add Indicator",

    // Placeholders
    "placeholder.search": "Search indicators...",
    "placeholder.indicatorName": "Enter indicator name",
    "placeholder.description": "Enter indicator description",

    // Indicator Data - History Table
    "indicator.liquidezCorrente": "Current Liquidity",
    "indicator.margemLiquida": "Net Margin",
    "indicator.roe": "ROE",
    "indicator.giroAtivo": "Asset Turnover",
    "indicator.crescimentoReceita": "Revenue Growth",

    // Indicator Descriptions - History Table
    "description.liquidezCorrente": "Short-term payment capacity",
    "description.margemLiquida": "Net profit percentage over revenue",
    "description.roe": "Return on equity",
    "description.giroAtivo": "Efficiency in asset utilization",
    "description.crescimentoReceita": "Annual revenue growth rate",

    // Glossary Data - Indicators
    "glossary.ebitdaReceita": "EBITDA / NET OPERATING REVENUE",
    "glossary.ebitdaDespesas": "EBITDA / STRUCTURAL EXPENSES",
    "glossary.receitaOperacional": "OPERATING REVENUE + 100",
    "glossary.ebitdaFinanceiras": "EBITDA / FINANCIAL REVENUE",
    "glossary.giroAtivo": "Asset Turnover",
    "glossary.prazoRecebimento": "Average Collection Period",
    "glossary.crescimentoReceita": "Revenue Growth",
    "glossary.valorPatrimonial": "Book Value per Share",
    "glossary.roe": "ROE",
    "glossary.roa": "ROA",

    // Glossary Data - Descriptions
    "glossary.desc.ebitdaReceita":
      "Relationship between EBITDA and Net Operating Revenue",
    "glossary.desc.ebitdaDespesas":
      "Relationship between EBITDA and Structural Expenses",
    "glossary.desc.receitaOperacional":
      "Operating Revenue plus 100 calculation",
    "glossary.desc.ebitdaFinanceiras":
      "Relationship between EBITDA and Financial Revenue",
    "glossary.desc.giroAtivo": "Efficiency in asset utilization",
    "glossary.desc.crescimentoReceita": "Revenue Growth Description",
    "glossary.desc.prazoRecebimento": "Average time to receive credit sales",
    "glossary.desc.valorPatrimonial": "Book value per common share",
    "glossary.desc.roe": "Measures return obtained on invested equity",
    "glossary.desc.roa": "Return on total company assets",

    // View As Options
    "viewAs.decimal": "Decimal",
    "viewAs.monetary": "Monetary",
    "viewAs.percentage": "Percentage",

    // Indicator Sheet
    "sheet.title": "Register Indicator",
    "sheet.description": "Fill in the fields below to register a new indicator",
    "sheet.indicator": "Indicator",
    "sheet.indicatorDescription": "Description",
    "sheet.category": "Indicator Category",
    "sheet.formula": "Formula",
    "sheet.viewAs": "View as:",
    "sheet.required": "*",
    "sheet.save": "Save",
    "sheet.cancel": "Cancel",

    // Placeholders - Indicator Sheet
    "sheet.placeholder.indicator": "Enter indicator name...",
    "sheet.placeholder.description": "Enter indicator description...",
    "sheet.placeholder.category": "Select category",
    "sheet.placeholder.formula":
      "Search indicators, enter numbers and operators (+ - * / % = () ^2 ^3)...",
    "sheet.placeholder.viewAs": "Select type",
    "sheet.placeholder.formulaPreview": "Your formula will appear here",

    // Formula translations
    "formula.ebitdaReceita": "EBITDA ÷ Net Operating Revenue",
    "formula.ebitdaDespesas": "EBITDA ÷ Structural Expenses",
    "formula.receitaOperacional": "Operating Revenue + 100",
    "formula.ebitdaFinanceiras": "EBITDA ÷ Financial Revenue",
    "formula.giroAtivo": "Net Revenue ÷ Total Assets",
    "formula.prazoRecebimento": "(Accounts Receivable ÷ Net Revenue) × 365",
    "formula.crescimentoReceita":
      "((Current Revenue - Previous Revenue) ÷ Previous Revenue) × 100",
    "formula.valorPatrimonial": "Shareholders' Equity ÷ Number of Shares",
    "formula.roe": "(Net Income ÷ Shareholders' Equity) × 100",
    "formula.roa": "(Net Income ÷ Total Assets) × 100",
  },
};

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const savedLanguage = localStorage.getItem("app-language") as Language;
    if (savedLanguage && (savedLanguage === "pt" || savedLanguage === "en")) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("app-language", lang);
  };

  const t = (key: string): string => {
    return (
      translations[language][key as keyof (typeof translations)["pt"]] || key
    );
  };

  return (
    <TranslationContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t, isHydrated }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}
