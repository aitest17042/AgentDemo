// Shared knowledge base and action card config for both React and standalone environments

export const knowledgeBase = [
  { keywords: ['開戶', '申請', '戶口'], response: "我可以協助您開始申請匯豐商業戶口。如果您已經準備好商業登記證（BR），我可以現在就為您初始化申請表。如果您是現有匯豐個人客戶，流程會更快。", action: 'ACCOUNT_OPENING' },
  { keywords: ['轉賬', '匯款', '交易', '付款'], response: "沒問題，我們可以立即安排轉賬。您是想進行本地轉賬還是海外匯款？我已為您準備好智能轉賬介面。", action: 'TRANSFER' },
  { keywords: ['餘額', '結餘', '余额', '查詢', '查询'], response: "您目前的「SME Power」港幣戶口結餘為 HK$2,450,890.00。需要我為您分析最近的開支趨勢嗎？", action: null },
  { keywords: ['貸款', '借錢'], response: "匯豐為 SME 提供靈活的融資方案。根據您的業務狀況，您可能有資格獲得高達 HK$2,000,000 的中小企融資擔保計劃貸款。", action: null },
  { keywords: ['你好', 'hello', 'hi'], response: "您好！我是您的匯豐中小企 AI 助手。今天有什麼可以幫到您的業務發展？", action: null },
];

export const actionCardConfig = {
  ACCOUNT_OPENING: {
    title: '匯豐商業戶口申請',
    description: '開始您的數碼銀行之旅。預計申請時間：5 分鐘。',
    actionLabel: '繼續申請項目',
    icon: 'userPlus',
    tone: 'tone-red'
  },
  TRANSFER: {
    title: '智能轉賬設定',
    description: '使用匯豐「轉數快」或電匯進行即時結算。',
    actionLabel: '初始化轉賬',
    icon: 'wallet',
    tone: 'tone-blue'
  }
};
