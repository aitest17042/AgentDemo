import {
  actionCardConfig,
  clientBehaviorSignals,
  currencyReferences,
  globalQuickPrompts,
  intentCatalog,
  publicFxRateSnapshots,
  publicMarketSnapshots,
  workflowDefinitions,
  type AgentActionType,
  type ClientBehaviorSignal,
  type MarketSnapshot,
  type SuggestionOption,
  type SupportedCurrencyCode,
} from "./knowledgeBase";

export interface StorageDetails {
  kind: "local-file" | "browser-local-storage";
  label: string;
  path?: string;
}

export interface WorkflowFieldSummary {
  label: string;
  value: string;
}

export interface WorkflowPreview {
  title: string;
  status: "in-progress" | "completed";
  progressLabel: string;
  currentQuestion?: string;
  collectedFields: WorkflowFieldSummary[];
  recordId?: string;
  storageLabel?: string;
}

export interface LocalChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  type?: "text" | "action";
  actionData?: {
    type: AgentActionType;
    prompt?: string;
  };
  suggestions?: SuggestionOption[];
  workflow?: WorkflowPreview;
}

export interface SavedWorkflowRecord {
  id: string;
  workflowId: AgentActionType;
  title: string;
  savedAt: string;
  summary: string;
  values: Record<string, string>;
}

export interface ActiveWorkflowState {
  workflowId: AgentActionType;
  stepIndex: number;
  values: Record<string, string>;
  startedAt: string;
}

export interface PendingFxTransactionState {
  baseCurrency: SupportedCurrencyCode;
  quoteCurrency: SupportedCurrencyCode;
  sourceAmount: number;
  quoteAmount: number;
  rate: number;
  source: string;
  quotedAt: string;
  initiatedAt: string;
}

export interface AgentSessionState {
  activeWorkflow: ActiveWorkflowState | null;
  pendingFxTransaction: PendingFxTransactionState | null;
  savedRecords: SavedWorkflowRecord[];
}

export interface AgentMessagePayload {
  content: string;
  type?: "text" | "action";
  actionData?: {
    type: AgentActionType;
    prompt?: string;
  };
  suggestions?: SuggestionOption[];
  workflow?: WorkflowPreview;
}

export type AgentAssistantResponse = AgentMessagePayload | AgentMessagePayload[];

export interface AgentTurnResult {
  assistantMessage: AgentAssistantResponse;
  sessionState: AgentSessionState;
}

const STOCK_KEYWORDS = ["股價", "股票", "報價", "price", "stock", "ticker", "quote"];
const FX_RATE_KEYWORDS = ["匯率", "exchange rate", "fx rate", "fx quote", "貨幣對", "外幣報價"];
const FX_TRANSACTION_KEYWORDS = ["兌換外幣", "兑换外币", "換匯", "换汇", "fx transaction", "外幣交易"];
const FX_CONFIRM_KEYWORDS = ["確認", "确认", "confirm", "ok", "yes"];
const CANCEL_KEYWORDS = ["取消", "停止", "不要了", "cancel", "stop"];
const RESTART_KEYWORDS = ["重新開始", "重來", "restart", "reset"];

const RECORD_PREFIX: Record<AgentActionType, string> = {
  ACCOUNT_OPENING: "ACCT",
  TRANSFER: "PAY",
  PAYROLL_SETUP: "PAYROLL",
  FX_HEDGE: "FX",
  WORKING_CAPITAL: "WC",
  COLLECTIONS: "COLLECT",
  INVESTMENT_PLANNING: "INVEST",
};

export function createMessageId(prefix = "msg") {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createEmptySessionState(): AgentSessionState {
  return {
    activeWorkflow: null,
    pendingFxTransaction: null,
    savedRecords: [],
  };
}

export function createUserMessage(content: string): LocalChatMessage {
  return {
    id: createMessageId("user"),
    role: "user",
    content,
  };
}

export function createAssistantMessage(payload: AgentMessagePayload): LocalChatMessage {
  return {
    id: createMessageId("assistant"),
    role: "model",
    type: payload.type ?? "text",
    content: payload.content,
    actionData: payload.actionData,
    suggestions: payload.suggestions,
    workflow: payload.workflow,
  };
}

export function createWelcomeMessage(_storage: StorageDetails): LocalChatMessage {
  return createAssistantMessage({
    content:
      `您好！我是您的匯豐中小企 AI 助手。` +
      `\n\n我可以協助您處理開戶、轉賬、薪資、營運融資、收款對賬、外匯對沖與企業投資規劃。`,
    suggestions: globalQuickPrompts,
  });
}

export function normalizeForMatch(text: string) {
  return String(text || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[\u3000\u2000-\u200b]/g, "")
    .replace(/[.,!?;:'"`~@#$%^&*()_+\-=[\]{}\\|<>/?，。！？；：「」『』（）【】《》、】【、]/g, "");
}

interface FxPairQuery {
  baseCurrency: SupportedCurrencyCode;
  quoteCurrency: SupportedCurrencyCode;
}

interface FxTransactionRequest {
  baseCurrency: SupportedCurrencyCode;
  quoteCurrency: SupportedCurrencyCode;
  sourceAmount: number;
}

const supportedCurrencyCodes = new Set<SupportedCurrencyCode>(
  currencyReferences.map((currency) => currency.code),
);

function isKeywordMatch(input: string, keywords: string[]) {
  const normalizedInput = normalizeForMatch(input);

  return keywords.some((keyword) => {
    const normalizedKeyword = normalizeForMatch(keyword);

    if (!normalizedKeyword) {
      return false;
    }

    return (
      normalizedInput.includes(normalizedKeyword) || normalizedKeyword.includes(normalizedInput)
    );
  });
}

function isStockLookup(input: string) {
  return isKeywordMatch(input, STOCK_KEYWORDS);
}

function isFxRateKeywordQuery(input: string) {
  return isKeywordMatch(input, FX_RATE_KEYWORDS);
}

function isCancelCommand(input: string) {
  return isKeywordMatch(input, CANCEL_KEYWORDS);
}

function isRestartCommand(input: string) {
  return isKeywordMatch(input, RESTART_KEYWORDS);
}

function isFxConfirmationCommand(input: string) {
  return isKeywordMatch(input, FX_CONFIRM_KEYWORDS);
}

function isGenericFxTransactionPrompt(input: string) {
  return isKeywordMatch(input, FX_TRANSACTION_KEYWORDS);
}

function isSupportedCurrencyCode(code: string): code is SupportedCurrencyCode {
  return supportedCurrencyCodes.has(code as SupportedCurrencyCode);
}

function extractCurrencyMatches(input: string): Array<{
  code: SupportedCurrencyCode;
  index: number;
}> {
  const normalizedInput = normalizeForMatch(input);

  return currencyReferences
    .map((currency) => {
      const hitIndexes = [currency.code, currency.name, ...currency.aliases]
        .map((alias) => normalizeForMatch(alias))
        .map((alias) => normalizedInput.indexOf(alias))
        .filter((index) => index >= 0);

      if (hitIndexes.length === 0) {
        return null;
      }

      return {
        code: currency.code,
        index: Math.min(...hitIndexes),
      };
    })
    .filter((item): item is { code: SupportedCurrencyCode; index: number } => item !== null)
    .sort((left, right) => left.index - right.index);
}

function extractCurrencyCodes(input: string): SupportedCurrencyCode[] {
  const uniqueCodes: SupportedCurrencyCode[] = [];

  for (const match of extractCurrencyMatches(input)) {
    if (!uniqueCodes.includes(match.code)) {
      uniqueCodes.push(match.code);
    }

    if (uniqueCodes.length === 2) {
      break;
    }
  }

  return uniqueCodes;
}

function parseFxPairQuery(input: string): FxPairQuery | null {
  const upperInput = String(input || "").toUpperCase();
  const separatedMatch = upperInput.match(/([A-Z]{3})\s*[-/]\s*([A-Z]{3})/);

  if (separatedMatch) {
    const [, baseCurrency, quoteCurrency] = separatedMatch;

    if (
      isSupportedCurrencyCode(baseCurrency) &&
      isSupportedCurrencyCode(quoteCurrency) &&
      baseCurrency !== quoteCurrency
    ) {
      return { baseCurrency, quoteCurrency };
    }
  }

  const compactMatch = upperInput.match(/\b([A-Z]{6})\b/);

  if (compactMatch) {
    const [baseCurrency, quoteCurrency] = [compactMatch[1].slice(0, 3), compactMatch[1].slice(3, 6)];

    if (
      isSupportedCurrencyCode(baseCurrency) &&
      isSupportedCurrencyCode(quoteCurrency) &&
      baseCurrency !== quoteCurrency
    ) {
      return { baseCurrency, quoteCurrency };
    }
  }

  const extractedCodes = extractCurrencyCodes(input);

  if (extractedCodes.length >= 2 && extractedCodes[0] !== extractedCodes[1]) {
    return {
      baseCurrency: extractedCodes[0],
      quoteCurrency: extractedCodes[1],
    };
  }

  return null;
}

function isBareFxPairInput(input: string) {
  const trimmedInput = String(input || "").trim();

  return /^[A-Za-z]{3}\s*[-/]\s*[A-Za-z]{3}$/.test(trimmedInput) || /^[A-Za-z]{6}$/.test(trimmedInput);
}

function extractFirstAmount(input: string) {
  const amountMatch = String(input || "").match(/\d[\d,.]*(?:\.\d+)?/);

  if (!amountMatch) {
    return null;
  }

  const parsedAmount = Number(amountMatch[0].replace(/,/g, ""));

  return Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : null;
}

function parseFxTransactionRequest(input: string): FxTransactionRequest | null {
  const rawInput = String(input || "");

  if (!/(兌換|兑换|轉|转|to|->|至|換成|换成)/i.test(rawInput)) {
    return null;
  }

  const sourceAmount = extractFirstAmount(rawInput);
  const currencyMatches = extractCurrencyMatches(rawInput);

  if (!sourceAmount || currencyMatches.length < 2) {
    return null;
  }

  const uniqueCodes: SupportedCurrencyCode[] = [];

  for (const match of currencyMatches) {
    if (!uniqueCodes.includes(match.code)) {
      uniqueCodes.push(match.code);
    }

    if (uniqueCodes.length === 2) {
      break;
    }
  }

  if (uniqueCodes.length < 2 || uniqueCodes[0] === uniqueCodes[1]) {
    return null;
  }

  return {
    baseCurrency: uniqueCodes[0],
    quoteCurrency: uniqueCodes[1],
    sourceAmount,
  };
}

function findFxRateSnapshot(baseCurrency: SupportedCurrencyCode, quoteCurrency: SupportedCurrencyCode) {
  const directSnapshot = publicFxRateSnapshots.find(
    (snapshot) =>
      snapshot.baseCurrency === baseCurrency && snapshot.quoteCurrency === quoteCurrency,
  );

  if (directSnapshot) {
    return {
      snapshot: directSnapshot,
      resolvedRate: directSnapshot.rate,
    };
  }

  const reverseSnapshot = publicFxRateSnapshots.find(
    (snapshot) =>
      snapshot.baseCurrency === quoteCurrency && snapshot.quoteCurrency === baseCurrency,
  );

  if (reverseSnapshot) {
    return {
      snapshot: reverseSnapshot,
      resolvedRate: 1 / reverseSnapshot.rate,
    };
  }

  return null;
}

function findClientBehaviorSignal(baseCurrency: SupportedCurrencyCode, quoteCurrency: SupportedCurrencyCode) {
  return (
    clientBehaviorSignals.find((signal) => {
      return signal.triggerCurrencies.some((currency) => {
        return currency === baseCurrency || currency === quoteCurrency;
      });
    }) ?? null
  );
}

function formatFxRate(rate: number) {
  if (rate >= 100) {
    return rate.toFixed(2);
  }

  if (rate >= 1) {
    return rate.toFixed(4);
  }

  return rate.toFixed(6);
}

function formatTransactionAmount(amount: number, currency: SupportedCurrencyCode) {
  const fractionDigits = currency === "JPY" ? 0 : amount % 1 === 0 ? 0 : 2;

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(amount);
}

function createFxTransactionReference() {
  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);

  return `FXT-${timestamp}`;
}

function buildFxSuggestions(
  pair: FxPairQuery,
  signal: ClientBehaviorSignal | null,
): SuggestionOption[] {
  if (signal) {
    return signal.suggestions;
  }

  return [
    { label: "規劃外匯對沖", prompt: "我想規劃外匯對沖" },
    { label: "兌換外幣", prompt: "我想兌換外幣" },
    {
      label: `查 ${pair.quoteCurrency}-${pair.baseCurrency} 匯率`,
      prompt: `${pair.quoteCurrency}-${pair.baseCurrency} 匯率`,
    },
  ];
}

function findMarketSnapshot(input: string): MarketSnapshot | null {
  const normalizedInput = normalizeForMatch(input);

  if (!normalizedInput) {
    return null;
  }

  return (
    publicMarketSnapshots.find((snapshot) => {
      return [snapshot.symbol, snapshot.name, ...snapshot.aliases].some((alias) => {
        const normalizedAlias = normalizeForMatch(alias);
        return (
          normalizedInput === normalizedAlias ||
          normalizedInput.includes(normalizedAlias) ||
          normalizedAlias.includes(normalizedInput)
        );
      });
    }) ?? null
  );
}

function buildFlowControlSuggestions(title: string): SuggestionOption[] {
  return [
    { label: "重新開始此流程", prompt: `重新開始${title}` },
    { label: "取消目前流程", prompt: "取消目前流程" },
  ];
}

function buildWorkflowPreview(
  workflowId: AgentActionType,
  stepIndex: number,
  values: Record<string, string>,
  storage: StorageDetails,
  status: "in-progress" | "completed",
  recordId?: string,
): WorkflowPreview {
  const workflow = workflowDefinitions[workflowId];
  const collectedFields = workflow.steps
    .filter((step) => values[step.id])
    .map((step) => ({
      label: step.label,
      value: values[step.id],
    }));

  return {
    title: workflow.title,
    status,
    progressLabel:
      status === "completed"
        ? `已完成 ${workflow.steps.length}/${workflow.steps.length}`
        : `第 ${Math.min(stepIndex + 1, workflow.steps.length)} / ${workflow.steps.length} 步`,
    currentQuestion:
      status === "in-progress" ? workflow.steps[stepIndex]?.prompt : undefined,
    collectedFields,
    recordId,
    storageLabel: storage.path ?? storage.label,
  };
}

function formatWorkflowSummary(workflowId: AgentActionType, values: Record<string, string>) {
  const workflow = workflowDefinitions[workflowId];

  return workflow.steps
    .map((step) => `- ${step.label}：${values[step.id] ?? "未提供"}`)
    .join("\n");
}

function createRecordId(workflowId: AgentActionType, existingRecords: SavedWorkflowRecord[]) {
  const dateSegment = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const sequence = String(
    existingRecords.filter((record) => record.workflowId === workflowId).length + 1,
  ).padStart(2, "0");

  return `${RECORD_PREFIX[workflowId]}-${dateSegment}-${sequence}`;
}

function startWorkflow(
  workflowId: AgentActionType,
  sessionState: AgentSessionState,
  storage: StorageDetails,
): AgentTurnResult {
  const workflow = workflowDefinitions[workflowId];
  const nextState: AgentSessionState = {
    ...sessionState,
    pendingFxTransaction: null,
    activeWorkflow: {
      workflowId,
      stepIndex: 0,
      values: {},
      startedAt: new Date().toISOString(),
    },
  };
  const stepsList = workflow.steps.map((step, index) => `${index + 1}. ${step.label}`).join("\n");

  return {
    sessionState: nextState,
    assistantMessage: {
      content:
        `${workflow.intro}\n\n` +
        `流程會分 ${workflow.steps.length} 步完成：\n${stepsList}\n\n` +
        `第 1 步 / 共 ${workflow.steps.length} 步：\n${workflow.steps[0].prompt}`,
      type: "action",
      actionData: {
        type: workflow.actionType,
        prompt: actionCardConfig[workflow.actionType].prompt,
      },
      suggestions: buildFlowControlSuggestions(workflow.title),
      workflow: buildWorkflowPreview(workflowId, 0, {}, storage, "in-progress"),
    },
  };
}

function continueWorkflow(
  input: string,
  sessionState: AgentSessionState,
  storage: StorageDetails,
): AgentTurnResult {
  const activeWorkflow = sessionState.activeWorkflow;

  if (!activeWorkflow) {
    return {
      sessionState,
      assistantMessage: {
        content: "目前沒有進行中的流程。您可以告訴我想處理哪一項業務銀行服務。",
        suggestions: globalQuickPrompts,
      },
    };
  }

  const workflow = workflowDefinitions[activeWorkflow.workflowId];

  if (isCancelCommand(input)) {
    return {
      sessionState: {
        ...sessionState,
        activeWorkflow: null,
      },
      assistantMessage: {
        content: `已取消「${workflow.title}」流程。如需稍後重開，我可隨時再為您整理一次。`,
        suggestions: globalQuickPrompts,
      },
    };
  }

  if (isRestartCommand(input)) {
    return startWorkflow(activeWorkflow.workflowId, sessionState, storage);
  }

  const currentStep = workflow.steps[activeWorkflow.stepIndex];
  const nextValues = {
    ...activeWorkflow.values,
    [currentStep.id]: input.trim(),
  };
  const nextStepIndex = activeWorkflow.stepIndex + 1;

  if (nextStepIndex < workflow.steps.length) {
    const nextState: AgentSessionState = {
      ...sessionState,
      activeWorkflow: {
        ...activeWorkflow,
        stepIndex: nextStepIndex,
        values: nextValues,
      },
    };

    return {
      sessionState: nextState,
      assistantMessage: {
        content:
          `已記下「${currentStep.label}」：${input.trim()}。\n\n` +
          `第 ${nextStepIndex + 1} 步 / 共 ${workflow.steps.length} 步：\n${workflow.steps[nextStepIndex].prompt}`,
        suggestions: buildFlowControlSuggestions(workflow.title),
        workflow: buildWorkflowPreview(
          activeWorkflow.workflowId,
          nextStepIndex,
          nextValues,
          storage,
          "in-progress",
        ),
      },
    };
  }

  const recordId = createRecordId(activeWorkflow.workflowId, sessionState.savedRecords);
  const summary = formatWorkflowSummary(activeWorkflow.workflowId, nextValues);
  const savedRecord: SavedWorkflowRecord = {
    id: recordId,
    workflowId: activeWorkflow.workflowId,
    title: workflow.title,
    savedAt: new Date().toISOString(),
    summary,
    values: nextValues,
  };

  return {
    sessionState: {
      activeWorkflow: null,
      pendingFxTransaction: null,
      savedRecords: [savedRecord, ...sessionState.savedRecords].slice(0, 20),
    },
    assistantMessage: {
      content:
        `${workflow.completionLead}\n\n` +
        `摘要：\n${summary}\n\n` +
        `如需調整細節，我可以即時為您更新。`,
      suggestions: workflow.suggestions,
      workflow: buildWorkflowPreview(
        activeWorkflow.workflowId,
        workflow.steps.length - 1,
        nextValues,
        storage,
        "completed",
        recordId,
      ),
    },
  };
}

function respondToStockLookup(
  snapshot: MarketSnapshot,
  sessionState: AgentSessionState,
  storage: StorageDetails,
): AgentTurnResult {
  const changePrefix = snapshot.changePercent >= 0 ? "+" : "";
  const secondaryPrompt =
    snapshot.currency === "USD" ? "我想規劃外匯對沖" : "我想查公司戶口餘額";

  return {
    sessionState: {
      ...sessionState,
      activeWorkflow: null,
      pendingFxTransaction: null,
    },
    assistantMessage: {
      content:
        `${snapshot.symbol} ${snapshot.name} 的最新公開市場價格為 ` +
        `${snapshot.currency} ${snapshot.price.toFixed(2)}，` +
        `日內變動 ${changePrefix}${snapshot.changePercent.toFixed(1)}%。\n\n` +
        `如果您現在查看股票價格，我建議不要只停留在查價；可以同時評估企業閒置資金是否適合做投資配置，` +
        `以及是否需要處理相關換匯風險。`,
      type: "action",
      actionData: {
        type: "INVESTMENT_PLANNING",
        prompt: actionCardConfig.INVESTMENT_PLANNING.prompt,
      },
      suggestions: [
        { label: "開始投資規劃", prompt: "我想規劃企業閒置資金投資" },
        { label: snapshot.currency === "USD" ? "規劃美元對沖" : "檢視公司餘額", prompt: secondaryPrompt },
        { label: "查另一隻股票", prompt: snapshot.symbol === "AAPL" ? "查 700.HK 股價" : "查 AAPL 股價" },
      ],
      workflow: {
        title: "公開市場查價",
        status: "completed",
        progressLabel: "公開資料",
        collectedFields: [
          { label: "股票代號", value: snapshot.symbol },
          { label: "市場", value: snapshot.exchange },
          { label: "更新時間", value: snapshot.updatedAt },
        ],
      },
    },
  };
}

function respondToFxLookup(
  pair: FxPairQuery,
  sessionState: AgentSessionState,
): AgentTurnResult {
  const matchedSnapshot = findFxRateSnapshot(pair.baseCurrency, pair.quoteCurrency);

  if (!matchedSnapshot) {
    return respondToGenericFxPrompt(sessionState);
  }

  const signal = findClientBehaviorSignal(pair.baseCurrency, pair.quoteCurrency);
  const directRate = matchedSnapshot.resolvedRate;
  const inverseRate = 1 / directRate;

  // Always separate FX rate answer and client behavior signal into two messages if signal exists
  const fxRateMessage: AgentMessagePayload = {
    content:
      `截至 ${matchedSnapshot.snapshot.updatedAt}，${pair.baseCurrency}/${pair.quoteCurrency} 的公開參考匯率約為 ${formatFxRate(directRate)}。` +
      `\n\n換算參考：1 ${pair.baseCurrency} 約等於 ${formatFxRate(directRate)} ${pair.quoteCurrency}；1 ${pair.quoteCurrency} 約等於 ${formatFxRate(inverseRate)} ${pair.baseCurrency}。`,
    type: "text",
    workflow: {
      title: "公開匯率參考",
      status: "completed",
      progressLabel: "公開資料",
      collectedFields: [
        { label: "貨幣對", value: `${pair.baseCurrency}/${pair.quoteCurrency}` },
        {
          label: "參考匯率",
          value: `1 ${pair.baseCurrency} 約等於 ${formatFxRate(directRate)} ${pair.quoteCurrency}`,
        },
        { label: "更新時間", value: matchedSnapshot.snapshot.updatedAt },
        { label: "資料來源", value: matchedSnapshot.snapshot.source },
      ],
    },
  };

  // If there is a client behavior signal, show it as a separate message
  if (signal) {
    const signalMessage: AgentMessagePayload = {
      content: signal.message,
      type: "action",
      actionData: signal.actionType
        ? {
            type: signal.actionType,
            prompt: actionCardConfig[signal.actionType].prompt,
          }
        : undefined,
      suggestions: buildFxSuggestions(pair, signal),
    };
    return {
      sessionState: {
        ...sessionState,
        activeWorkflow: null,
        pendingFxTransaction: null,
      },
      assistantMessage: [fxRateMessage, signalMessage],
    };
  }

  // Otherwise, just return the FX rate message
  return {
    sessionState: {
      ...sessionState,
      activeWorkflow: null,
      pendingFxTransaction: null,
    },
    assistantMessage: fxRateMessage,
  };
}

function respondToGenericFxTransactionPrompt(sessionState: AgentSessionState): AgentTurnResult {
  return {
    sessionState: {
      ...sessionState,
      activeWorkflow: null,
      pendingFxTransaction: null,
    },
    assistantMessage: {
      content:
        "請直接輸入兌換指示，例如 10000 USD 轉 JPY。我會按現時公開參考匯率直接整理交易確認，再讓您回覆確認。",
      suggestions: [
        { label: "輸入 10000 USD 轉 JPY", prompt: "10000 USD 轉 JPY" },
        { label: "輸入 50000 HKD 轉 USD", prompt: "50000 HKD 轉 USD" },
        { label: "查 USD-JPY 匯率", prompt: "USD-JPY 匯率" },
      ],
    },
  };
}

function respondToFxTransactionQuote(
  request: FxTransactionRequest,
  sessionState: AgentSessionState,
): AgentTurnResult {
  const matchedSnapshot = findFxRateSnapshot(request.baseCurrency, request.quoteCurrency);

  if (!matchedSnapshot) {
    return respondToGenericFxTransactionPrompt(sessionState);
  }

  const quoteAmount = request.sourceAmount * matchedSnapshot.resolvedRate;
  const pendingFxTransaction: PendingFxTransactionState = {
    baseCurrency: request.baseCurrency,
    quoteCurrency: request.quoteCurrency,
    sourceAmount: request.sourceAmount,
    quoteAmount,
    rate: matchedSnapshot.resolvedRate,
    source: matchedSnapshot.snapshot.source,
    quotedAt: matchedSnapshot.snapshot.updatedAt,
    initiatedAt: new Date().toISOString(),
  };

  return {
    sessionState: {
      ...sessionState,
      activeWorkflow: null,
      pendingFxTransaction,
    },
    assistantMessage: {
      content:
        `你是否想兌換 ${formatTransactionAmount(request.sourceAmount, request.baseCurrency)} ${request.baseCurrency} 至 ${request.quoteCurrency}？` +
        `\n\n根據現時匯率 ${formatFxRate(matchedSnapshot.resolvedRate)}，` +
        `${formatTransactionAmount(request.sourceAmount, request.baseCurrency)} ${request.baseCurrency} 約相等於 ` +
        `${formatTransactionAmount(quoteAmount, request.quoteCurrency)} ${request.quoteCurrency}。` +
        `\n\n報價時間：${matchedSnapshot.snapshot.updatedAt}` +
        `\n資料來源：${matchedSnapshot.snapshot.source}` +
        `\n\n如確認交易，請直接回覆「確認」。`,
      suggestions: [
        { label: "確認交易", prompt: "確認" },
        { label: "取消交易", prompt: "取消" },
      ],
      workflow: {
        title: "外幣兌換確認",
        status: "completed",
        progressLabel: "待確認",
        collectedFields: [
          {
            label: "賣出幣種",
            value: `${formatTransactionAmount(request.sourceAmount, request.baseCurrency)} ${request.baseCurrency}`,
          },
          {
            label: "買入幣種",
            value: `${formatTransactionAmount(quoteAmount, request.quoteCurrency)} ${request.quoteCurrency}`,
          },
          {
            label: "參考匯率",
            value: `1 ${request.baseCurrency} 約等於 ${formatFxRate(matchedSnapshot.resolvedRate)} ${request.quoteCurrency}`,
          },
        ],
      },
    },
  };
}

function continuePendingFxTransaction(
  input: string,
  sessionState: AgentSessionState,
): AgentTurnResult {
  const pendingFxTransaction = sessionState.pendingFxTransaction;

  if (!pendingFxTransaction) {
    return {
      sessionState,
      assistantMessage: {
        content: "目前沒有待確認的外幣交易。您可直接輸入例如 10000 USD 轉 JPY。",
        suggestions: [
          { label: "輸入 10000 USD 轉 JPY", prompt: "10000 USD 轉 JPY" },
          { label: "查 USD-JPY 匯率", prompt: "USD-JPY 匯率" },
        ],
      },
    };
  }

  const replacementRequest = parseFxTransactionRequest(input);

  if (replacementRequest) {
    return respondToFxTransactionQuote(replacementRequest, {
      ...sessionState,
      pendingFxTransaction: null,
    });
  }

  if (isCancelCommand(input)) {
    return {
      sessionState: {
        ...sessionState,
        pendingFxTransaction: null,
      },
      assistantMessage: {
        content: "已取消本次外幣兌換指示。如需重新報價，請直接輸入新的兌換內容，例如 10000 USD 轉 JPY。",
        suggestions: [
          { label: "重新輸入兌換指示", prompt: "10000 USD 轉 JPY" },
          { label: "查 USD-JPY 匯率", prompt: "USD-JPY 匯率" },
        ],
      },
    };
  }

  if (!isFxConfirmationCommand(input)) {
    return {
      sessionState,
      assistantMessage: {
        content:
          `目前待確認交易為 ${formatTransactionAmount(pendingFxTransaction.sourceAmount, pendingFxTransaction.baseCurrency)} ${pendingFxTransaction.baseCurrency} ` +
          `兌換至 ${pendingFxTransaction.quoteCurrency}。如確認請回覆「確認」，如需更改可直接輸入新的兌換內容。`,
        suggestions: [
          { label: "確認交易", prompt: "確認" },
          { label: "取消交易", prompt: "取消" },
        ],
      },
    };
  }

  const transactionReference = createFxTransactionReference();
  const signal = findClientBehaviorSignal(
    pendingFxTransaction.baseCurrency,
    pendingFxTransaction.quoteCurrency,
  );
  const resultMessage: AgentMessagePayload = {
    content:
      `兌換成功。\n\n交易編號：${transactionReference}` +
      `\n賣出：${formatTransactionAmount(pendingFxTransaction.sourceAmount, pendingFxTransaction.baseCurrency)} ${pendingFxTransaction.baseCurrency}` +
      `\n買入：${formatTransactionAmount(pendingFxTransaction.quoteAmount, pendingFxTransaction.quoteCurrency)} ${pendingFxTransaction.quoteCurrency}` +
      `\n成交參考匯率：${formatFxRate(pendingFxTransaction.rate)}` +
      `\n報價時間：${pendingFxTransaction.quotedAt}` +
      `\n資料來源：${pendingFxTransaction.source}`,
    workflow: {
      title: "外幣兌換結果",
      status: "completed",
      progressLabel: "已完成",
      collectedFields: [
        { label: "交易編號", value: transactionReference },
        {
          label: "賣出幣種",
          value: `${formatTransactionAmount(pendingFxTransaction.sourceAmount, pendingFxTransaction.baseCurrency)} ${pendingFxTransaction.baseCurrency}`,
        },
        {
          label: "買入幣種",
          value: `${formatTransactionAmount(pendingFxTransaction.quoteAmount, pendingFxTransaction.quoteCurrency)} ${pendingFxTransaction.quoteCurrency}`,
        },
      ],
    },
  };

  const nextState: AgentSessionState = {
    ...sessionState,
    pendingFxTransaction: null,
  };

  if (!signal) {
    return {
      sessionState: nextState,
      assistantMessage: resultMessage,
    };
  }

  return {
    sessionState: nextState,
    assistantMessage: [
      resultMessage,
      {
        content: signal.message,
        type: "action",
        actionData: signal.actionType
          ? {
              type: signal.actionType,
              prompt: actionCardConfig[signal.actionType].prompt,
            }
          : undefined,
        suggestions: signal.suggestions,
      },
    ],
  };
}

function respondToGenericFxPrompt(sessionState: AgentSessionState): AgentTurnResult {
  return {
    sessionState: {
      ...sessionState,
      pendingFxTransaction: null,
    },
    assistantMessage: {
      content:
        "我可以先提供公開參考匯率。請輸入貨幣對，例如 JPY-USD、USD-JPY、USD-HKD 或 EUR-USD。",
      suggestions: [
        { label: "查 JPY-USD 匯率", prompt: "JPY-USD 匯率" },
        { label: "查 USD-JPY 匯率", prompt: "USD-JPY 匯率" },
        { label: "規劃外匯對沖", prompt: "我想規劃外匯對沖" },
      ],
    },
  };
}

function respondToGenericStockPrompt(sessionState: AgentSessionState): AgentTurnResult {
  return {
    sessionState: {
      ...sessionState,
      pendingFxTransaction: null,
    },
    assistantMessage: {
      content:
        "我可以先提供公開市場股價參考。請輸入股票代號或公司名稱，例如 700.HK、0005.HK、AAPL 或 Microsoft。",
      suggestions: [
        { label: "查 700.HK 股價", prompt: "查 700.HK 股價" },
        { label: "查 0005.HK 股價", prompt: "查 0005.HK 股價" },
        { label: "查 AAPL 股價", prompt: "查 AAPL 股價" },
      ],
    },
  };
}

function respondToIntent(
  input: string,
  sessionState: AgentSessionState,
  storage: StorageDetails,
): AgentTurnResult {
  const matchedIntent = intentCatalog.find((intent) => isKeywordMatch(input, intent.keywords));

  if (!matchedIntent) {
    return {
      sessionState,
      assistantMessage: {
        content:
          "我可以協助您處理多步驟業務銀行流程，包括開戶、轉賬、薪資、融資、收款、外匯對沖與企業投資規劃。您想先處理哪一項？",
        suggestions: globalQuickPrompts,
      },
    };
  }

  if (matchedIntent.workflowId) {
    return startWorkflow(matchedIntent.workflowId, sessionState, storage);
  }

  return {
    sessionState,
    assistantMessage: {
      content: matchedIntent.response,
      type: matchedIntent.actionType ? "action" : "text",
      actionData: matchedIntent.actionType
        ? {
            type: matchedIntent.actionType,
            prompt: actionCardConfig[matchedIntent.actionType].prompt,
          }
        : undefined,
      suggestions: matchedIntent.suggestions,
    },
  };
}

export function runAgentTurn(
  input: string,
  sessionState: AgentSessionState,
  storage: StorageDetails,
): AgentTurnResult {
  if (sessionState.pendingFxTransaction) {
    return continuePendingFxTransaction(input, sessionState);
  }

  if (sessionState.activeWorkflow) {
    return continueWorkflow(input, sessionState, storage);
  }

  const parsedFxTransaction = parseFxTransactionRequest(input);

  if (parsedFxTransaction) {
    return respondToFxTransactionQuote(parsedFxTransaction, sessionState);
  }

  if (isGenericFxTransactionPrompt(input)) {
    return respondToGenericFxTransactionPrompt(sessionState);
  }

  const matchedStock = findMarketSnapshot(input);

  if (matchedStock && (isStockLookup(input) || normalizeForMatch(input) === normalizeForMatch(matchedStock.symbol))) {
    return respondToStockLookup(matchedStock, sessionState, storage);
  }

  if (matchedStock && normalizeForMatch(input) === normalizeForMatch(matchedStock.name)) {
    return respondToStockLookup(matchedStock, sessionState, storage);
  }

  const matchedFxPair = parseFxPairQuery(input);

  if (matchedFxPair && (isFxRateKeywordQuery(input) || isBareFxPairInput(input))) {
    return respondToFxLookup(matchedFxPair, sessionState);
  }

  if (isFxRateKeywordQuery(input)) {
    return respondToGenericFxPrompt(sessionState);
  }

  if (isStockLookup(input)) {
    return respondToGenericStockPrompt(sessionState);
  }

  return respondToIntent(input, sessionState, storage);
}