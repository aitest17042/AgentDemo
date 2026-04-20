// Shared banking intent, workflow, and public market data config.

export interface SuggestionOption {
  label: string;
  prompt: string;
}

export interface WorkflowStepDefinition {
  id: string;
  label: string;
  prompt: string;
}

export type AgentActionType =
  | "ACCOUNT_OPENING"
  | "TRANSFER"
  | "PAYROLL_SETUP"
  | "FX_HEDGE"
  | "WORKING_CAPITAL"
  | "COLLECTIONS"
  | "INVESTMENT_PLANNING";

export interface WorkflowDefinition {
  id: AgentActionType;
  title: string;
  intro: string;
  completionLead: string;
  actionType: AgentActionType;
  steps: WorkflowStepDefinition[];
  suggestions: SuggestionOption[];
}

export interface IntentDefinition {
  id: string;
  keywords: string[];
  response: string;
  actionType: AgentActionType | null;
  workflowId?: AgentActionType;
  suggestions: SuggestionOption[];
}

export interface MarketSnapshot {
  symbol: string;
  name: string;
  aliases: string[];
  exchange: string;
  price: number;
  currency: "HKD" | "USD";
  changePercent: number;
  updatedAt: string;
}

export type SupportedCurrencyCode = "USD" | "JPY" | "HKD" | "EUR" | "CNH";

export interface CurrencyReference {
  code: SupportedCurrencyCode;
  name: string;
  aliases: string[];
}

export interface FxRateSnapshot {
  baseCurrency: SupportedCurrencyCode;
  quoteCurrency: SupportedCurrencyCode;
  rate: number;
  source: string;
  updatedAt: string;
}

export interface ClientBehaviorSignal {
  id: string;
  triggerCurrencies: SupportedCurrencyCode[];
  message: string;
  actionType: AgentActionType | null;
  suggestions: SuggestionOption[];
}

export const globalQuickPrompts: SuggestionOption[] = [
  { label: "開立商業戶口", prompt: "我想開立新的商業戶口" },
  { label: "安排跨境轉賬", prompt: "我想安排一筆跨境轉賬" },
  { label: "設定薪資發放", prompt: "我想設定公司薪資發放流程" },
  { label: "規劃外匯對沖", prompt: "我想規劃外匯對沖" },
  { label: "查 JPY-USD 匯率", prompt: "JPY-USD 匯率" },
  { label: "查 AAPL 股價", prompt: "查 AAPL 股價" },
];

export const publicMarketSnapshots: MarketSnapshot[] = [
  {
    symbol: "700.HK",
    name: "Tencent Holdings",
    aliases: ["700", "tencent", "騰訊", "腾讯"],
    exchange: "HKEX",
    price: 481.2,
    currency: "HKD",
    changePercent: 1.8,
    updatedAt: "2026-04-20 15:40 HKT",
  },
  {
    symbol: "0005.HK",
    name: "HSBC Holdings",
    aliases: ["0005", "5.hk", "hsbc", "匯豐", "汇丰"],
    exchange: "HKEX",
    price: 70.3,
    currency: "HKD",
    changePercent: 0.6,
    updatedAt: "2026-04-20 15:40 HKT",
  },
  {
    symbol: "9988.HK",
    name: "Alibaba Group",
    aliases: ["9988", "alibaba", "阿里巴巴"],
    exchange: "HKEX",
    price: 76.45,
    currency: "HKD",
    changePercent: -0.5,
    updatedAt: "2026-04-20 15:40 HKT",
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    aliases: ["apple", "蘋果", "苹果"],
    exchange: "NASDAQ",
    price: 198.35,
    currency: "USD",
    changePercent: 0.7,
    updatedAt: "2026-04-20 03:55 EDT",
  },
  {
    symbol: "MSFT",
    name: "Microsoft",
    aliases: ["microsoft", "微軟", "微软"],
    exchange: "NASDAQ",
    price: 415.2,
    currency: "USD",
    changePercent: 0.4,
    updatedAt: "2026-04-20 03:55 EDT",
  },
];

export const currencyReferences: CurrencyReference[] = [
  {
    code: "USD",
    name: "美元",
    aliases: ["usd", "美金", "us dollar", "dollar"],
  },
  {
    code: "JPY",
    name: "日圓",
    aliases: ["jpy", "日元", "yen", "円", "yen japanese"],
  },
  {
    code: "HKD",
    name: "港幣",
    aliases: ["hkd", "港元", "hk dollar"],
  },
  {
    code: "EUR",
    name: "歐元",
    aliases: ["eur", "欧元", "euro"],
  },
  {
    code: "CNH",
    name: "離岸人民幣",
    aliases: ["cnh", "cny", "人民幣", "人民币", "rmb", "yuan"],
  },
];

export const publicFxRateSnapshots: FxRateSnapshot[] = [
  {
    baseCurrency: "USD",
    quoteCurrency: "JPY",
    rate: 149.72,
    source: "公開市場參考",
    updatedAt: "2026-04-20 15:40 HKT",
  },
  {
    baseCurrency: "USD",
    quoteCurrency: "HKD",
    rate: 7.8086,
    source: "公開市場參考",
    updatedAt: "2026-04-20 15:40 HKT",
  },
  {
    baseCurrency: "EUR",
    quoteCurrency: "USD",
    rate: 1.0824,
    source: "公開市場參考",
    updatedAt: "2026-04-20 15:40 HKT",
  },
  {
    baseCurrency: "USD",
    quoteCurrency: "CNH",
    rate: 7.2368,
    source: "公開市場參考",
    updatedAt: "2026-04-20 15:40 HKT",
  },
];

export const clientBehaviorSignals: ClientBehaviorSignal[] = [
  {
    id: "JPY_SETTLEMENT_PATTERN",
    triggerCurrencies: ["JPY"],
    message:
      "另外，系統記錄顯示，您在過去 3 個月持續有 JPY 結算需求。若這類日圓付款屬固定週期，可考慮使用外匯對沖，預先鎖定部分成本波動。",
    actionType: "FX_HEDGE",
    suggestions: [
      { label: "開始外匯對沖", prompt: "我想規劃外匯對沖" },
      { label: "安排跨境轉賬", prompt: "我想安排一筆跨境轉賬" },
      { label: "查 USD-JPY 匯率", prompt: "USD-JPY 匯率" },
    ],
  },
];

export const actionCardConfig: Record<
  AgentActionType,
  {
    title: string;
    description: string;
    actionLabel: string;
    prompt: string;
    icon: string;
    tone: string;
  }
> = {
  ACCOUNT_OPENING: {
    title: "匯豐商業戶口申請",
    description: "以多步流程收集公司資料、預估交易量與所需服務。",
    actionLabel: "開始開戶流程",
    prompt: "我想開立新的商業戶口",
    icon: "userPlus",
    tone: "tone-red",
  },
  TRANSFER: {
    title: "智能轉賬設定",
    description: "逐步確認轉賬類型、幣種、付款用途與批核安排。",
    actionLabel: "開始轉賬流程",
    prompt: "我想安排一筆跨境轉賬",
    icon: "wallet",
    tone: "tone-blue",
  },
  PAYROLL_SETUP: {
    title: "企業薪資發放規劃",
    description: "整理員工人數、付款日期、幣種與批核模式。",
    actionLabel: "開始薪資流程",
    prompt: "我想設定公司薪資發放流程",
    icon: "building",
    tone: "tone-amber",
  },
  FX_HEDGE: {
    title: "外匯對沖規劃",
    description: "梳理外幣風險敞口、對沖期限與換匯節奏。",
    actionLabel: "開始外匯流程",
    prompt: "我想規劃外匯對沖",
    icon: "exchange",
    tone: "tone-slate",
  },
  WORKING_CAPITAL: {
    title: "營運資金融資規劃",
    description: "收集資金用途、所需額度與營運週期後再配對方案。",
    actionLabel: "開始融資流程",
    prompt: "我想規劃營運資金融資",
    icon: "funding",
    tone: "tone-emerald",
  },
  COLLECTIONS: {
    title: "商戶收款與對賬",
    description: "定義收款渠道、日均金額與對賬格式需求。",
    actionLabel: "開始收款流程",
    prompt: "我想規劃商戶收款與對賬",
    icon: "landmark",
    tone: "tone-purple",
  },
  INVESTMENT_PLANNING: {
    title: "企業閒置資金投資規劃",
    description: "把公開市場查價轉成可執行的資金配置與投資步驟。",
    actionLabel: "開始投資規劃",
    prompt: "我想規劃企業閒置資金投資",
    icon: "growth",
    tone: "tone-rose",
  },
};

export const workflowDefinitions: Record<AgentActionType, WorkflowDefinition> = {
  ACCOUNT_OPENING: {
    id: "ACCOUNT_OPENING",
    title: "商業戶口開立",
    intro:
      "可以，現在開始為您整理商業戶口申請所需資料。我會逐步收集必要資訊，之後方便您核對、補文件或提交。",
    completionLead:
      "商業戶口開立資料已整理完成，我已把申請摘要準備好，方便您下一步核對與補交文件。",
    actionType: "ACCOUNT_OPENING",
    steps: [
      { id: "companyName", label: "公司名稱", prompt: "第 1 步：請提供公司註冊名稱。" },
      { id: "registrationNumber", label: "商業登記號碼", prompt: "第 2 步：請提供商業登記號碼或公司註冊編號。" },
      { id: "businessNature", label: "業務性質", prompt: "第 3 步：請描述主要業務性質，例如電商、批發、專業服務。" },
      { id: "monthlyTurnover", label: "預計每月交易量", prompt: "第 4 步：預計每月交易金額或交易筆數大概是多少？" },
      { id: "bankingNeeds", label: "主要銀行需求", prompt: "第 5 步：您最需要哪些服務？例如收款、轉賬、薪資、外匯或融資。" },
    ],
    suggestions: [
      { label: "安排收款對賬", prompt: "我想規劃商戶收款與對賬" },
      { label: "設定薪資發放", prompt: "我想設定公司薪資發放流程" },
      { label: "規劃營運融資", prompt: "我想規劃營運資金融資" },
    ],
  },
  TRANSFER: {
    id: "TRANSFER",
    title: "轉賬與付款安排",
    intro:
      "可以，我會用多步流程為您整理這筆付款安排，之後您可再決定是否提交或加入常用收款人。",
    completionLead:
      "轉賬安排已整理完成，金額、幣種與付款用途都已記錄，方便您下一步批核或重複使用。",
    actionType: "TRANSFER",
    steps: [
      { id: "transferType", label: "轉賬類型", prompt: "第 1 步：這是本地轉賬、海外匯款，還是定期付款？" },
      { id: "destination", label: "收款地或收款人", prompt: "第 2 步：請提供收款地區或收款人名稱。" },
      { id: "currencyAmount", label: "幣種與金額", prompt: "第 3 步：請輸入付款幣種與金額。" },
      { id: "paymentPurpose", label: "付款用途", prompt: "第 4 步：這筆款項的用途是什麼？例如供應商貨款、租金或薪資。" },
      { id: "approvalTiming", label: "批核安排", prompt: "第 5 步：您希望何時批核或執行這筆付款？" },
    ],
    suggestions: [
      { label: "加入外匯對沖", prompt: "我想規劃外匯對沖" },
      { label: "設定收款對賬", prompt: "我想規劃商戶收款與對賬" },
      { label: "檢視營運資金", prompt: "我想規劃營運資金融資" },
    ],
  },
  PAYROLL_SETUP: {
    id: "PAYROLL_SETUP",
    title: "薪資發放流程",
    intro:
      "可以，我會先為您整理薪資發放流程，逐步確認員工規模、付款日與內部批核方式。",
    completionLead:
      "薪資發放流程已整理完成，您現在可以按這份摘要再補員工清單或設定重複批次。",
    actionType: "PAYROLL_SETUP",
    steps: [
      { id: "headcount", label: "員工人數", prompt: "第 1 步：目前需要發薪的員工大概有多少人？" },
      { id: "payrollDate", label: "發薪日期", prompt: "第 2 步：通常每月什麼日期發薪？" },
      { id: "payrollCurrencies", label: "發薪幣種", prompt: "第 3 步：薪資主要使用哪些幣種？" },
      { id: "approvalModel", label: "批核模式", prompt: "第 4 步：需要單一批核，還是雙重批核？" },
      { id: "fileFormat", label: "匯入方式", prompt: "第 5 步：您打算以 Excel、ERP 匯出，還是 API 方式匯入？" },
    ],
    suggestions: [
      { label: "安排轉賬付款", prompt: "我想安排一筆跨境轉賬" },
      { label: "補做收款對賬", prompt: "我想規劃商戶收款與對賬" },
      { label: "分析現金流", prompt: "幫我分析最近的現金流狀況" },
    ],
  },
  FX_HEDGE: {
    id: "FX_HEDGE",
    title: "外匯對沖規劃",
    intro:
      "可以，我先為您整理外匯對沖規劃，逐步確認幣種敞口、時間跨度與換匯節奏。",
    completionLead:
      "外匯對沖規劃已整理完成，您可根據這份摘要評估遠期、分段換匯或自然對沖安排。",
    actionType: "FX_HEDGE",
    steps: [
      { id: "exposureCurrencies", label: "風險敞口幣種", prompt: "第 1 步：您主要面對哪些外幣風險？例如 USD、EUR、JPY。" },
      { id: "monthlyExposure", label: "每月外幣金額", prompt: "第 2 步：平均每月涉及多少外幣收支？" },
      { id: "hedgeHorizon", label: "對沖期限", prompt: "第 3 步：您想覆蓋多長時間？例如 1 個月、3 個月或半年。" },
      { id: "settlementPattern", label: "結算節奏", prompt: "第 4 步：外幣收支是集中結算，還是分散在每月不同時點？" },
      { id: "objective", label: "管理目標", prompt: "第 5 步：您更重視鎖定成本、保留升值空間，還是降低波動？" },
    ],
    suggestions: [
      { label: "安排跨境轉賬", prompt: "我想安排一筆跨境轉賬" },
      { label: "規劃投資配置", prompt: "我想規劃企業閒置資金投資" },
      { label: "檢視營運融資", prompt: "我想規劃營運資金融資" },
    ],
  },
  WORKING_CAPITAL: {
    id: "WORKING_CAPITAL",
    title: "營運資金融資",
    intro:
      "可以，我會先為您整理營運資金需求，再按金額、週期與用途配對較合適的融資方向。",
    completionLead:
      "營運資金融資規劃已完成，您現在可按摘要準備文件、收入紀錄與未來提款安排。",
    actionType: "WORKING_CAPITAL",
    steps: [
      { id: "fundingNeed", label: "資金用途", prompt: "第 1 步：這筆資金主要用於什麼？例如採購、擴張、營運周轉。" },
      { id: "amount", label: "所需額度", prompt: "第 2 步：大概需要多少融資金額？" },
      { id: "monthlyRevenue", label: "月營業額", prompt: "第 3 步：公司平均每月營業額大概是多少？" },
      { id: "cashCycle", label: "現金回籠週期", prompt: "第 4 步：通常多久可以回款？例如 30、60 或 90 天。" },
      { id: "supportingDocs", label: "可提供文件", prompt: "第 5 步：目前可以提供哪些文件？例如發票、報表、合約或抵押資料。" },
    ],
    suggestions: [
      { label: "整理收款對賬", prompt: "我想規劃商戶收款與對賬" },
      { label: "規劃外匯對沖", prompt: "我想規劃外匯對沖" },
      { label: "檢視現金配置", prompt: "我想規劃企業閒置資金投資" },
    ],
  },
  COLLECTIONS: {
    id: "COLLECTIONS",
    title: "商戶收款與對賬",
    intro:
      "可以，我先為您整理收款與對賬流程，再根據渠道、交易量與結算要求提出安排。",
    completionLead:
      "收款與對賬流程已整理完成，您可以按這份摘要再決定是否接入收款渠道或自動對賬。",
    actionType: "COLLECTIONS",
    steps: [
      { id: "collectionChannel", label: "收款渠道", prompt: "第 1 步：您主要用網站、門市、支付連結，還是 B2B 轉賬收款？" },
      { id: "averageTicketSize", label: "平均每筆金額", prompt: "第 2 步：平均每筆交易金額是多少？" },
      { id: "monthlyCollectionVolume", label: "每月收款量", prompt: "第 3 步：每月大概有多少筆或多少金額的收款？" },
      { id: "settlementNeed", label: "結算時效", prompt: "第 4 步：您希望即日、次日，還是按週結算？" },
      { id: "reconciliationFormat", label: "對賬格式", prompt: "第 5 步：您需要 CSV、Excel，還是與 ERP 對接的對賬格式？" },
    ],
    suggestions: [
      { label: "設定薪資發放", prompt: "我想設定公司薪資發放流程" },
      { label: "規劃營運融資", prompt: "我想規劃營運資金融資" },
      { label: "安排供應商付款", prompt: "我想安排一筆跨境轉賬" },
    ],
  },
  INVESTMENT_PLANNING: {
    id: "INVESTMENT_PLANNING",
    title: "企業閒置資金投資規劃",
    intro:
      "可以，我會把公開市場查價延伸成企業投資規劃，先整理可動用資金、投資目標與風險承受度。",
    completionLead:
      "企業投資規劃已整理完成，您現在可按這份摘要再決定是否進一步建立投資清單或換匯安排。",
    actionType: "INVESTMENT_PLANNING",
    steps: [
      { id: "surplusCash", label: "可動用資金", prompt: "第 1 步：目前大概有多少閒置資金可用作投資？" },
      { id: "investmentGoal", label: "投資目標", prompt: "第 2 步：您希望追求資本增值、收息，還是短期停泊資金？" },
      { id: "timeHorizon", label: "投資期限", prompt: "第 3 步：打算持有多久？例如 3 個月、1 年或更長。" },
      { id: "riskPreference", label: "風險承受度", prompt: "第 4 步：風險偏好偏向保守、平衡，還是進取？" },
      { id: "preferredMarkets", label: "偏好市場", prompt: "第 5 步：有沒有偏好的市場或資產類別？例如港股、美股、債券或貨幣市場工具。" },
    ],
    suggestions: [
      { label: "查另一隻股票", prompt: "查 700.HK 股價" },
      { label: "檢視可動用餘額", prompt: "我想查公司戶口餘額" },
    ],
  },
};

export const intentCatalog: IntentDefinition[] = [
  {
    id: "ACCOUNT_OPENING",
    keywords: ["開戶", "申請戶口", "商業戶口", "business account", "account opening"],
    response:
      "我可以直接為您啟動商業戶口開立流程，逐步整理公司資料、預計交易量與主要銀行需求。",
    actionType: "ACCOUNT_OPENING",
    workflowId: "ACCOUNT_OPENING",
    suggestions: [
      { label: "開始開戶流程", prompt: "我想開立新的商業戶口" },
      { label: "同時規劃收款", prompt: "我想規劃商戶收款與對賬" },
      { label: "設定薪資流程", prompt: "我想設定公司薪資發放流程" },
    ],
  },
  {
    id: "TRANSFER",
    keywords: ["轉賬", "轉帳", "匯款", "付款", "payment", "transfer", "wire"],
    response:
      "我可以為您整理轉賬流程，逐步確認轉賬類型、收款地、金額、用途與批核時間。",
    actionType: "TRANSFER",
    workflowId: "TRANSFER",
    suggestions: [
      { label: "開始轉賬流程", prompt: "我想安排一筆跨境轉賬" },
      { label: "加入外匯對沖", prompt: "我想規劃外匯對沖" },
      { label: "設定定期付款", prompt: "我想安排一筆定期付款" },
    ],
  },
  {
    id: "BALANCE_OVERVIEW",
    keywords: ["餘額", "結餘", "余额", "balance", "現金", "cash"],
    response:
      "您目前的「SME Power」港幣戶口可動用結餘為 HK$2,450,890.00。若這筆資金短期未動用，我建議同時評估付款排程、定期存放，或把一部分配置到投資工具。",
    actionType: "INVESTMENT_PLANNING",
    suggestions: [
      { label: "規劃閒置資金投資", prompt: "我想規劃企業閒置資金投資" },
      { label: "分析現金流狀況", prompt: "幫我分析最近的現金流狀況" },
      { label: "安排供應商付款", prompt: "我想安排一筆跨境轉賬" },
    ],
  },
  {
    id: "PAYROLL_SETUP",
    keywords: ["薪資", "出糧", "發薪", "payroll", "salary"],
    response:
      "我可以立即為您整理薪資發放流程，包括員工數量、付款日、幣種與批核安排。",
    actionType: "PAYROLL_SETUP",
    workflowId: "PAYROLL_SETUP",
    suggestions: [
      { label: "開始薪資流程", prompt: "我想設定公司薪資發放流程" },
      { label: "安排轉賬付款", prompt: "我想安排一筆跨境轉賬" },
      { label: "補做收款對賬", prompt: "我想規劃商戶收款與對賬" },
    ],
  },
  {
    id: "FX_HEDGE",
    keywords: ["外匯", "fx", "換匯", "對沖", "hedge", "currency"],
    response:
      "我可以為您啟動外匯對沖規劃，逐步整理幣種敞口、換匯節奏與風險目標。",
    actionType: "FX_HEDGE",
    workflowId: "FX_HEDGE",
    suggestions: [
      { label: "開始外匯流程", prompt: "我想規劃外匯對沖" },
      { label: "安排跨境轉賬", prompt: "我想安排一筆跨境轉賬" },
      { label: "規劃投資配置", prompt: "我想規劃企業閒置資金投資" },
    ],
  },
  {
    id: "WORKING_CAPITAL",
    keywords: ["貸款", "融資", "借錢", "working capital", "finance", "loan"],
    response:
      "我可以先為您整理營運資金需求，再根據金額、回款周期與可提供文件配對融資方案。",
    actionType: "WORKING_CAPITAL",
    workflowId: "WORKING_CAPITAL",
    suggestions: [
      { label: "開始融資流程", prompt: "我想規劃營運資金融資" },
      { label: "分析現金流狀況", prompt: "幫我分析最近的現金流狀況" },
      { label: "規劃收款對賬", prompt: "我想規劃商戶收款與對賬" },
    ],
  },
  {
    id: "COLLECTIONS",
    keywords: ["收款", "對賬", "merchant", "collection", "payment link", "qr"],
    response:
      "我可以為您整理商戶收款與對賬需求，再配對合適的收款渠道與結算安排。",
    actionType: "COLLECTIONS",
    workflowId: "COLLECTIONS",
    suggestions: [
      { label: "開始收款流程", prompt: "我想規劃商戶收款與對賬" },
      { label: "規劃營運融資", prompt: "我想規劃營運資金融資" },
      { label: "設定薪資流程", prompt: "我想設定公司薪資發放流程" },
    ],
  },
  {
    id: "INVESTMENT_PLANNING",
    keywords: ["投資", "理財", "配置資金", "wealth", "invest"],
    response:
      "我可以把企業閒置資金規劃成較可執行的投資方案，逐步確認資金規模、期限與風險承受度。",
    actionType: "INVESTMENT_PLANNING",
    workflowId: "INVESTMENT_PLANNING",
    suggestions: [
      { label: "開始投資規劃", prompt: "我想規劃企業閒置資金投資" },
      { label: "查匯豐股價", prompt: "查 0005.HK 股價" },
      { label: "規劃外匯對沖", prompt: "我想規劃外匯對沖" },
    ],
  },
  {
    id: "CASHFLOW_ADVISORY",
    keywords: ["現金流", "開支", "cash flow", "expense", "支出"],
    response:
      "根據近期交易模式，您可以把應付帳款、薪資與收款節奏拆開管理，這樣更容易看出可動用營運資金與短期閒置現金。",
    actionType: "WORKING_CAPITAL",
    suggestions: [
      { label: "規劃營運融資", prompt: "我想規劃營運資金融資" },
      { label: "安排轉賬付款", prompt: "我想安排一筆跨境轉賬" },
      { label: "規劃投資配置", prompt: "我想規劃企業閒置資金投資" },
    ],
  },
  {
    id: "GREETING",
    keywords: ["你好", "您好", "hello", "hi"],
    response:
      "您好，我可以協助您處理多步驟業務銀行流程，包括開戶、轉賬、薪資、融資、收款、外匯與投資規劃。",
    actionType: null,
    suggestions: globalQuickPrompts,
  },
];

export const knowledgeBase = intentCatalog.map((item) => ({
  keywords: item.keywords,
  response: item.response,
  action: item.actionType,
}));
