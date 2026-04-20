import {
  createEmptySessionState,
  createMessageId,
  type AgentSessionState,
  type LocalChatMessage,
  type SavedWorkflowRecord,
  type StorageDetails,
} from "./agentEngine";

export interface PersistedAgentState {
  version: number;
  messages: LocalChatMessage[];
  sessionState: AgentSessionState;
  updatedAt: string;
}

const API_ENDPOINT = "/api/local-agent-state";
const LOCAL_STORAGE_KEY = "hsbc-business-agent-state";

const BROWSER_STORAGE: StorageDetails = {
  kind: "browser-local-storage",
  label: "瀏覽器本地儲存",
};

function createEmptyPersistedState(): PersistedAgentState {
  return {
    version: 1,
    messages: [],
    sessionState: createEmptySessionState(),
    updatedAt: new Date(0).toISOString(),
  };
}

function normalizeSavedRecords(input: unknown): SavedWorkflowRecord[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .filter((item): item is SavedWorkflowRecord => Boolean(item && typeof item === "object"))
    .map((record) => ({
      id: typeof record.id === "string" ? record.id : createMessageId("record"),
      workflowId: record.workflowId,
      title: typeof record.title === "string" ? record.title : "未命名流程",
      savedAt: typeof record.savedAt === "string" ? record.savedAt : new Date().toISOString(),
      summary: typeof record.summary === "string" ? record.summary : "",
      values: record.values && typeof record.values === "object" ? record.values : {},
    }));
}

function normalizeMessages(input: unknown): LocalChatMessage[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .filter((item): item is Partial<LocalChatMessage> => Boolean(item && typeof item === "object"))
    .map((message) => ({
      id: typeof message.id === "string" ? message.id : createMessageId("rehydrated"),
      role: message.role === "user" ? "user" : "model",
      content: typeof message.content === "string" ? message.content : "",
      type: message.type === "action" ? "action" : "text",
      actionData: message.actionData,
      suggestions: Array.isArray(message.suggestions) ? message.suggestions : undefined,
      workflow: message.workflow,
    }));
}

function normalizeSessionState(input: unknown): AgentSessionState {
  if (!input || typeof input !== "object") {
    return createEmptySessionState();
  }

  const partial = input as Partial<AgentSessionState>;

  return {
    activeWorkflow:
      partial.activeWorkflow && typeof partial.activeWorkflow === "object"
        ? {
            workflowId: partial.activeWorkflow.workflowId,
            stepIndex:
              typeof partial.activeWorkflow.stepIndex === "number"
                ? partial.activeWorkflow.stepIndex
                : 0,
            values:
              partial.activeWorkflow.values && typeof partial.activeWorkflow.values === "object"
                ? partial.activeWorkflow.values
                : {},
            startedAt:
              typeof partial.activeWorkflow.startedAt === "string"
                ? partial.activeWorkflow.startedAt
                : new Date().toISOString(),
          }
        : null,
    savedRecords: normalizeSavedRecords(partial.savedRecords),
  };
}

function normalizePersistedState(input: unknown): PersistedAgentState {
  if (!input || typeof input !== "object") {
    return createEmptyPersistedState();
  }

  const partial = input as Partial<PersistedAgentState>;

  return {
    version: typeof partial.version === "number" ? partial.version : 1,
    messages: normalizeMessages(partial.messages),
    sessionState: normalizeSessionState(partial.sessionState),
    updatedAt:
      typeof partial.updatedAt === "string" ? partial.updatedAt : new Date().toISOString(),
  };
}

export async function loadPersistedAgentState(): Promise<{
  state: PersistedAgentState;
  storage: StorageDetails;
}> {
  try {
    const response = await fetch(API_ENDPOINT, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to load local state: ${response.status}`);
    }

    const payload = await response.json();

    return {
      state: normalizePersistedState(payload.state),
      storage: payload.storage,
    };
  } catch {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(LOCAL_STORAGE_KEY) : null;

    return {
      state: raw ? normalizePersistedState(JSON.parse(raw)) : createEmptyPersistedState(),
      storage: BROWSER_STORAGE,
    };
  }
}

export async function savePersistedAgentState(
  state: PersistedAgentState,
): Promise<StorageDetails> {
  const normalizedState = normalizePersistedState(state);

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ state: normalizedState }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save local state: ${response.status}`);
    }

    const payload = await response.json();
    return payload.storage;
  } catch {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(normalizedState));
    }

    return BROWSER_STORAGE;
  }
}