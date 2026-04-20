import {
  actionCardConfig,
  globalQuickPrompts,
  intentCatalog,
  publicMarketSnapshots,
  workflowDefinitions,
  type AgentActionType,
  type MarketSnapshot,
  type SuggestionOption,
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

export interface AgentSessionState {
  activeWorkflow: ActiveWorkflowState | null;
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

export interface AgentTurnResult {
  assistantMessage: AgentMessagePayload;
  sessionState: AgentSessionState;
}

const STOCK_KEYWORDS = ["股價", "股票", "報價", "price", "stock", "ticker", "quote"];
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

function isCancelCommand(input: string) {
  return isKeywordMatch(input, CANCEL_KEYWORDS);
}

function isRestartCommand(input: string) {
  return isKeywordMatch(input, RESTART_KEYWORDS);
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

function respondToGenericStockPrompt(sessionState: AgentSessionState): AgentTurnResult {
  return {
    sessionState,
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
  if (sessionState.activeWorkflow) {
    return continueWorkflow(input, sessionState, storage);
  }

  const matchedStock = findMarketSnapshot(input);

  if (matchedStock && (isStockLookup(input) || normalizeForMatch(input) === normalizeForMatch(matchedStock.symbol))) {
    return respondToStockLookup(matchedStock, sessionState, storage);
  }

  if (matchedStock && normalizeForMatch(input) === normalizeForMatch(matchedStock.name)) {
    return respondToStockLookup(matchedStock, sessionState, storage);
  }

  if (isStockLookup(input)) {
    return respondToGenericStockPrompt(sessionState);
  }

  return respondToIntent(input, sessionState, storage);
}