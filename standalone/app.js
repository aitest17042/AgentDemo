(function () {
  var root = document.getElementById('root');

  if (!root) {
    return;
  }

  var ICONS = {
    sparkles:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"></path></svg>',
    bell:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 17h5l-1.4-1.4c-.4-.4-.6-.9-.6-1.4V11a6 6 0 0 0-4-5.7V4a2 2 0 1 0-4 0v1.3A6 6 0 0 0 6 11v3.2c0 .5-.2 1-.6 1.4L4 17h5"></path><path d="M9 17v1a3 3 0 0 0 6 0v-1"></path></svg>',
    bot:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v4"></path><rect x="4" y="8" width="16" height="12" rx="3"></rect><path d="M8 16h8"></path><circle cx="9" cy="13" r="1"></circle><circle cx="15" cy="13" r="1"></circle></svg>',
    user:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21a8 8 0 0 0-16 0"></path><circle cx="12" cy="7" r="4"></circle></svg>',
    loader:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.2-8.6"></path></svg>',
    send:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2L11 13"></path><path d="M22 2L15 22l-4-9-9-4 20-7z"></path></svg>',
    chevronRight:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>',
    userPlus:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M19 8v6"></path><path d="M22 11h-6"></path></svg>',
    wallet:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 7H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path><path d="M16 13h.01"></path><path d="M6 7V5a2 2 0 0 1 2-2h10"></path></svg>',
    building:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 22V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v18"></path><path d="M6 12H4a1 1 0 0 0-1 1v9"></path><path d="M18 9h2a1 1 0 0 1 1 1v12"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>',
    exchange:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3 4 7l4 4"></path><path d="M4 7h16"></path><path d="m16 21 4-4-4-4"></path><path d="M20 17H4"></path></svg>',
    funding:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"></path></svg>',
    landmark:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 22h18"></path><path d="M6 18V9"></path><path d="M10 18V9"></path><path d="M14 18V9"></path><path d="M18 18V9"></path><path d="M12 2 3 7h18l-9-5z"></path></svg>',
    growth:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m22 7-8.5 8.5-5-5L2 17"></path><path d="M16 7h6v6"></path></svg>'
  };

  var GLOBAL_QUICK_PROMPTS = [
    { label: '開立商業戶口', prompt: '我想開立新的商業戶口' },
    { label: '安排跨境轉賬', prompt: '我想安排一筆跨境轉賬' },
    { label: '設定薪資發放', prompt: '我想設定公司薪資發放流程' },
    { label: '規劃外匯對沖', prompt: '我想規劃外匯對沖' },
    { label: '查 AAPL 股價', prompt: '查 AAPL 股價' }
  ];

  var PUBLIC_MARKET_SNAPSHOTS = [
    { symbol: '700.HK', name: 'Tencent Holdings', aliases: ['700', 'tencent', '騰訊', '腾讯'], exchange: 'HKEX', price: 481.2, currency: 'HKD', changePercent: 1.8, updatedAt: '2026-04-20 15:40 HKT' },
    { symbol: '0005.HK', name: 'HSBC Holdings', aliases: ['0005', '5.hk', 'hsbc', '匯豐', '汇丰'], exchange: 'HKEX', price: 70.3, currency: 'HKD', changePercent: 0.6, updatedAt: '2026-04-20 15:40 HKT' },
    { symbol: '9988.HK', name: 'Alibaba Group', aliases: ['9988', 'alibaba', '阿里巴巴'], exchange: 'HKEX', price: 76.45, currency: 'HKD', changePercent: -0.5, updatedAt: '2026-04-20 15:40 HKT' },
    { symbol: 'AAPL', name: 'Apple Inc.', aliases: ['apple', '蘋果', '苹果'], exchange: 'NASDAQ', price: 198.35, currency: 'USD', changePercent: 0.7, updatedAt: '2026-04-20 03:55 EDT' },
    { symbol: 'MSFT', name: 'Microsoft', aliases: ['microsoft', '微軟', '微软'], exchange: 'NASDAQ', price: 415.2, currency: 'USD', changePercent: 0.4, updatedAt: '2026-04-20 03:55 EDT' }
  ];

  var ACTION_CARD_CONFIG = {
    ACCOUNT_OPENING: { title: '匯豐商業戶口申請', description: '以多步流程收集公司資料、預估交易量與所需服務。', actionLabel: '開始開戶流程', prompt: '我想開立新的商業戶口', icon: 'userPlus', tone: 'tone-red' },
    TRANSFER: { title: '智能轉賬設定', description: '逐步確認轉賬類型、幣種、付款用途與批核安排。', actionLabel: '開始轉賬流程', prompt: '我想安排一筆跨境轉賬', icon: 'wallet', tone: 'tone-blue' },
    PAYROLL_SETUP: { title: '企業薪資發放規劃', description: '整理員工人數、付款日期、幣種與批核模式。', actionLabel: '開始薪資流程', prompt: '我想設定公司薪資發放流程', icon: 'building', tone: 'tone-amber' },
    FX_HEDGE: { title: '外匯對沖規劃', description: '梳理外幣風險敞口、對沖期限與換匯節奏。', actionLabel: '開始外匯流程', prompt: '我想規劃外匯對沖', icon: 'exchange', tone: 'tone-slate' },
    WORKING_CAPITAL: { title: '營運資金融資規劃', description: '收集資金用途、所需額度與營運週期後再配對方案。', actionLabel: '開始融資流程', prompt: '我想規劃營運資金融資', icon: 'funding', tone: 'tone-emerald' },
    COLLECTIONS: { title: '商戶收款與對賬', description: '定義收款渠道、日均金額與對賬格式需求。', actionLabel: '開始收款流程', prompt: '我想規劃商戶收款與對賬', icon: 'landmark', tone: 'tone-purple' },
    INVESTMENT_PLANNING: { title: '企業閒置資金投資規劃', description: '把公開市場查價轉成可執行的資金配置與投資步驟。', actionLabel: '開始投資規劃', prompt: '我想規劃企業閒置資金投資', icon: 'growth', tone: 'tone-rose' }
  };

  var WORKFLOW_DEFINITIONS = {
    ACCOUNT_OPENING: {
      title: '商業戶口開立',
      intro: '可以，現在開始為您整理商業戶口申請所需資料。我會逐步收集必要資訊，之後方便您核對、補文件或提交。',
      completionLead: '商業戶口開立資料已整理完成，我已把申請摘要準備好，方便您下一步核對與補交文件。',
      actionType: 'ACCOUNT_OPENING',
      steps: [
        { id: 'companyName', label: '公司名稱', prompt: '第 1 步：請提供公司註冊名稱。' },
        { id: 'registrationNumber', label: '商業登記號碼', prompt: '第 2 步：請提供商業登記號碼或公司註冊編號。' },
        { id: 'businessNature', label: '業務性質', prompt: '第 3 步：請描述主要業務性質，例如電商、批發、專業服務。' },
        { id: 'monthlyTurnover', label: '預計每月交易量', prompt: '第 4 步：預計每月交易金額或交易筆數大概是多少？' },
        { id: 'bankingNeeds', label: '主要銀行需求', prompt: '第 5 步：您最需要哪些服務？例如收款、轉賬、薪資、外匯或融資。' }
      ],
      suggestions: [
        { label: '安排收款對賬', prompt: '我想規劃商戶收款與對賬' },
        { label: '設定薪資發放', prompt: '我想設定公司薪資發放流程' },
        { label: '規劃營運融資', prompt: '我想規劃營運資金融資' }
      ]
    },
    TRANSFER: {
      title: '轉賬與付款安排',
      intro: '可以，我會用多步流程為您整理這筆付款安排，之後您可再決定是否提交或加入常用收款人。',
      completionLead: '轉賬安排已整理完成，金額、幣種與付款用途都已記錄，方便您下一步批核或重複使用。',
      actionType: 'TRANSFER',
      steps: [
        { id: 'transferType', label: '轉賬類型', prompt: '第 1 步：這是本地轉賬、海外匯款，還是定期付款？' },
        { id: 'destination', label: '收款地或收款人', prompt: '第 2 步：請提供收款地區或收款人名稱。' },
        { id: 'currencyAmount', label: '幣種與金額', prompt: '第 3 步：請輸入付款幣種與金額。' },
        { id: 'paymentPurpose', label: '付款用途', prompt: '第 4 步：這筆款項的用途是什麼？例如供應商貨款、租金或薪資。' },
        { id: 'approvalTiming', label: '批核安排', prompt: '第 5 步：您希望何時批核或執行這筆付款？' }
      ],
      suggestions: [
        { label: '加入外匯對沖', prompt: '我想規劃外匯對沖' },
        { label: '設定收款對賬', prompt: '我想規劃商戶收款與對賬' },
        { label: '檢視營運資金', prompt: '我想規劃營運資金融資' }
      ]
    },
    PAYROLL_SETUP: {
      title: '薪資發放流程',
      intro: '可以，我會先為您整理薪資發放流程，逐步確認員工規模、付款日與內部批核方式。',
      completionLead: '薪資發放流程已整理完成，您現在可以按這份摘要再補員工清單或設定重複批次。',
      actionType: 'PAYROLL_SETUP',
      steps: [
        { id: 'headcount', label: '員工人數', prompt: '第 1 步：目前需要發薪的員工大概有多少人？' },
        { id: 'payrollDate', label: '發薪日期', prompt: '第 2 步：通常每月什麼日期發薪？' },
        { id: 'payrollCurrencies', label: '發薪幣種', prompt: '第 3 步：薪資主要使用哪些幣種？' },
        { id: 'approvalModel', label: '批核模式', prompt: '第 4 步：需要單一批核，還是雙重批核？' },
        { id: 'fileFormat', label: '匯入方式', prompt: '第 5 步：您打算以 Excel、ERP 匯出，還是 API 方式匯入？' }
      ],
      suggestions: [
        { label: '安排轉賬付款', prompt: '我想安排一筆跨境轉賬' },
        { label: '補做收款對賬', prompt: '我想規劃商戶收款與對賬' },
        { label: '分析現金流', prompt: '幫我分析最近的現金流狀況' }
      ]
    },
    FX_HEDGE: {
      title: '外匯對沖規劃',
      intro: '可以，我先為您整理外匯對沖規劃，逐步確認幣種敞口、時間跨度與換匯節奏。',
      completionLead: '外匯對沖規劃已整理完成，您可根據這份摘要評估遠期、分段換匯或自然對沖安排。',
      actionType: 'FX_HEDGE',
      steps: [
        { id: 'exposureCurrencies', label: '風險敞口幣種', prompt: '第 1 步：您主要面對哪些外幣風險？例如 USD、EUR、JPY。' },
        { id: 'monthlyExposure', label: '每月外幣金額', prompt: '第 2 步：平均每月涉及多少外幣收支？' },
        { id: 'hedgeHorizon', label: '對沖期限', prompt: '第 3 步：您想覆蓋多長時間？例如 1 個月、3 個月或半年。' },
        { id: 'settlementPattern', label: '結算節奏', prompt: '第 4 步：外幣收支是集中結算，還是分散在每月不同時點？' },
        { id: 'objective', label: '管理目標', prompt: '第 5 步：您更重視鎖定成本、保留升值空間，還是降低波動？' }
      ],
      suggestions: [
        { label: '安排跨境轉賬', prompt: '我想安排一筆跨境轉賬' },
        { label: '規劃投資配置', prompt: '我想規劃企業閒置資金投資' },
        { label: '檢視營運融資', prompt: '我想規劃營運資金融資' }
      ]
    },
    WORKING_CAPITAL: {
      title: '營運資金融資',
      intro: '可以，我會先為您整理營運資金需求，再按金額、週期與用途配對較合適的融資方向。',
      completionLead: '營運資金融資規劃已完成，您現在可按摘要準備文件、收入紀錄與未來提款安排。',
      actionType: 'WORKING_CAPITAL',
      steps: [
        { id: 'fundingNeed', label: '資金用途', prompt: '第 1 步：這筆資金主要用於什麼？例如採購、擴張、營運周轉。' },
        { id: 'amount', label: '所需額度', prompt: '第 2 步：大概需要多少融資金額？' },
        { id: 'monthlyRevenue', label: '月營業額', prompt: '第 3 步：公司平均每月營業額大概是多少？' },
        { id: 'cashCycle', label: '現金回籠週期', prompt: '第 4 步：通常多久可以回款？例如 30、60 或 90 天。' },
        { id: 'supportingDocs', label: '可提供文件', prompt: '第 5 步：目前可以提供哪些文件？例如發票、報表、合約或抵押資料。' }
      ],
      suggestions: [
        { label: '整理收款對賬', prompt: '我想規劃商戶收款與對賬' },
        { label: '規劃外匯對沖', prompt: '我想規劃外匯對沖' },
        { label: '檢視現金配置', prompt: '我想規劃企業閒置資金投資' }
      ]
    },
    COLLECTIONS: {
      title: '商戶收款與對賬',
      intro: '可以，我先為您整理收款與對賬流程，再根據渠道、交易量與結算要求提出安排。',
      completionLead: '收款與對賬流程已整理完成，您可以按這份摘要再決定是否接入收款渠道或自動對賬。',
      actionType: 'COLLECTIONS',
      steps: [
        { id: 'collectionChannel', label: '收款渠道', prompt: '第 1 步：您主要用網站、門市、支付連結，還是 B2B 轉賬收款？' },
        { id: 'averageTicketSize', label: '平均每筆金額', prompt: '第 2 步：平均每筆交易金額是多少？' },
        { id: 'monthlyCollectionVolume', label: '每月收款量', prompt: '第 3 步：每月大概有多少筆或多少金額的收款？' },
        { id: 'settlementNeed', label: '結算時效', prompt: '第 4 步：您希望即日、次日，還是按週結算？' },
        { id: 'reconciliationFormat', label: '對賬格式', prompt: '第 5 步：您需要 CSV、Excel，還是與 ERP 對接的對賬格式？' }
      ],
      suggestions: [
        { label: '設定薪資發放', prompt: '我想設定公司薪資發放流程' },
        { label: '規劃營運融資', prompt: '我想規劃營運資金融資' },
        { label: '安排供應商付款', prompt: '我想安排一筆跨境轉賬' }
      ]
    },
    INVESTMENT_PLANNING: {
      title: '企業閒置資金投資規劃',
      intro: '可以，我會把公開市場查價延伸成企業投資規劃，先整理可動用資金、投資目標與風險承受度。',
      completionLead: '企業投資規劃已整理完成，您現在可按這份摘要再決定是否進一步建立投資清單或換匯安排。',
      actionType: 'INVESTMENT_PLANNING',
      steps: [
        { id: 'surplusCash', label: '可動用資金', prompt: '第 1 步：目前大概有多少閒置資金可用作投資？' },
        { id: 'investmentGoal', label: '投資目標', prompt: '第 2 步：您希望追求資本增值、收息，還是短期停泊資金？' },
        { id: 'timeHorizon', label: '投資期限', prompt: '第 3 步：打算持有多久？例如 3 個月、1 年或更長。' },
        { id: 'riskPreference', label: '風險承受度', prompt: '第 4 步：風險偏好偏向保守、平衡，還是進取？' },
        { id: 'preferredMarkets', label: '偏好市場', prompt: '第 5 步：有沒有偏好的市場或資產類別？例如港股、美股、債券或貨幣市場工具。' }
      ],
      suggestions: [
        { label: '查另一隻股票', prompt: '查 700.HK 股價' },
        { label: '規劃外匯對沖', prompt: '我想規劃外匯對沖' },
        { label: '檢視可動用餘額', prompt: '我想查公司戶口餘額' }
      ]
    }
  };

  var INTENT_CATALOG = [
    { id: 'ACCOUNT_OPENING', keywords: ['開戶', '申請戶口', '商業戶口', 'business account', 'account opening'], response: '我可以直接為您啟動商業戶口開立流程，逐步整理公司資料、預計交易量與主要銀行需求。', actionType: 'ACCOUNT_OPENING', workflowId: 'ACCOUNT_OPENING', suggestions: [{ label: '開始開戶流程', prompt: '我想開立新的商業戶口' }, { label: '同時規劃收款', prompt: '我想規劃商戶收款與對賬' }, { label: '設定薪資流程', prompt: '我想設定公司薪資發放流程' }] },
    { id: 'TRANSFER', keywords: ['轉賬', '轉帳', '匯款', '付款', 'payment', 'transfer', 'wire'], response: '我可以為您整理轉賬流程，逐步確認轉賬類型、收款地、金額、用途與批核時間。', actionType: 'TRANSFER', workflowId: 'TRANSFER', suggestions: [{ label: '開始轉賬流程', prompt: '我想安排一筆跨境轉賬' }, { label: '加入外匯對沖', prompt: '我想規劃外匯對沖' }, { label: '設定定期付款', prompt: '我想安排一筆定期付款' }] },
    { id: 'BALANCE_OVERVIEW', keywords: ['餘額', '結餘', '余额', 'balance', '現金', 'cash'], response: '您目前的「SME Power」港幣戶口可動用結餘為 HK$2,450,890.00。若這筆資金短期未動用，我建議同時評估付款排程、定期存放，或把一部分配置到投資工具。', actionType: 'INVESTMENT_PLANNING', suggestions: [{ label: '規劃閒置資金投資', prompt: '我想規劃企業閒置資金投資' }, { label: '分析現金流狀況', prompt: '幫我分析最近的現金流狀況' }, { label: '安排供應商付款', prompt: '我想安排一筆跨境轉賬' }] },
    { id: 'PAYROLL_SETUP', keywords: ['薪資', '出糧', '發薪', 'payroll', 'salary'], response: '我可以立即為您整理薪資發放流程，包括員工數量、付款日、幣種與批核安排。', actionType: 'PAYROLL_SETUP', workflowId: 'PAYROLL_SETUP', suggestions: [{ label: '開始薪資流程', prompt: '我想設定公司薪資發放流程' }, { label: '安排轉賬付款', prompt: '我想安排一筆跨境轉賬' }, { label: '補做收款對賬', prompt: '我想規劃商戶收款與對賬' }] },
    { id: 'FX_HEDGE', keywords: ['外匯', 'fx', '換匯', '對沖', 'hedge', 'currency'], response: '我可以為您啟動外匯對沖規劃，逐步整理幣種敞口、換匯節奏與風險目標。', actionType: 'FX_HEDGE', workflowId: 'FX_HEDGE', suggestions: [{ label: '開始外匯流程', prompt: '我想規劃外匯對沖' }, { label: '安排跨境轉賬', prompt: '我想安排一筆跨境轉賬' }, { label: '規劃投資配置', prompt: '我想規劃企業閒置資金投資' }] },
    { id: 'WORKING_CAPITAL', keywords: ['貸款', '融資', '借錢', 'working capital', 'finance', 'loan'], response: '我可以先為您整理營運資金需求，再根據金額、回款周期與可提供文件配對融資方案。', actionType: 'WORKING_CAPITAL', workflowId: 'WORKING_CAPITAL', suggestions: [{ label: '開始融資流程', prompt: '我想規劃營運資金融資' }, { label: '分析現金流狀況', prompt: '幫我分析最近的現金流狀況' }, { label: '規劃收款對賬', prompt: '我想規劃商戶收款與對賬' }] },
    { id: 'COLLECTIONS', keywords: ['收款', '對賬', 'merchant', 'collection', 'payment link', 'qr'], response: '我可以為您整理商戶收款與對賬需求，再配對合適的收款渠道與結算安排。', actionType: 'COLLECTIONS', workflowId: 'COLLECTIONS', suggestions: [{ label: '開始收款流程', prompt: '我想規劃商戶收款與對賬' }, { label: '規劃營運融資', prompt: '我想規劃營運資金融資' }, { label: '設定薪資流程', prompt: '我想設定公司薪資發放流程' }] },
    { id: 'INVESTMENT_PLANNING', keywords: ['投資', '理財', '配置資金', 'wealth', 'invest'], response: '我可以把企業閒置資金規劃成較可執行的投資方案，逐步確認資金規模、期限與風險承受度。', actionType: 'INVESTMENT_PLANNING', workflowId: 'INVESTMENT_PLANNING', suggestions: [{ label: '開始投資規劃', prompt: '我想規劃企業閒置資金投資' }, { label: '查匯豐股價', prompt: '查 0005.HK 股價' }, { label: '規劃外匯對沖', prompt: '我想規劃外匯對沖' }] },
    { id: 'CASHFLOW_ADVISORY', keywords: ['現金流', '開支', 'cash flow', 'expense', '支出'], response: '根據近期交易模式，您可以把應付帳款、薪資與收款節奏拆開管理，這樣更容易看出可動用營運資金與短期閒置現金。', actionType: 'WORKING_CAPITAL', suggestions: [{ label: '規劃營運融資', prompt: '我想規劃營運資金融資' }, { label: '安排轉賬付款', prompt: '我想安排一筆跨境轉賬' }, { label: '規劃投資配置', prompt: '我想規劃企業閒置資金投資' }] },
    { id: 'GREETING', keywords: ['你好', '您好', 'hello', 'hi'], response: '您好，我可以協助您處理多步驟業務銀行流程，包括開戶、轉賬、薪資、融資、收款、外匯與投資規劃。', actionType: null, suggestions: GLOBAL_QUICK_PROMPTS }
  ];

  var DEFAULT_STORAGE = { kind: 'local-file', label: '目前工作區檔案', path: 'local-data/agent-state.json' };
  var STORAGE_KEY = 'hsbc-business-agent-state';
  var API_ENDPOINT = '/api/local-agent-state';
  var STOCK_KEYWORDS = ['股價', '股票', '報價', 'price', 'stock', 'ticker', 'quote'];
  var CANCEL_KEYWORDS = ['取消', '停止', '不要了', 'cancel', 'stop'];
  var RESTART_KEYWORDS = ['重新開始', '重來', 'restart', 'reset'];
  var RECORD_PREFIX = {
    ACCOUNT_OPENING: 'ACCT',
    TRANSFER: 'PAY',
    PAYROLL_SETUP: 'PAYROLL',
    FX_HEDGE: 'FX',
    WORKING_CAPITAL: 'WC',
    COLLECTIONS: 'COLLECT',
    INVESTMENT_PLANNING: 'INVEST'
  };

  var state = {
    messages: [],
    sessionState: { activeWorkflow: null, savedRecords: [] },
    isLoading: false,
    hydrated: false,
    storage: DEFAULT_STORAGE
  };

  root.innerHTML =
    '<div class="standalone-app">' +
    '  <header class="standalone-header">' +
    '    <div class="standalone-brand">' +
    '      <div class="standalone-logo" aria-hidden="true"><div class="standalone-logo-mark"></div></div>' +
    '      <span class="standalone-brand-label is-desktop">HSBC Business</span>' +
    '      <span class="standalone-brand-label is-mobile">HSBC</span>' +
    '    </div>' +
    '    <div class="standalone-header-actions">' +
    '      <div class="standalone-status-pill"><span class="standalone-status-pill-icon">' + ICONS.sparkles + '</span><span>AI 助手已啟動</span></div>' +
    '      <button class="standalone-icon-button" type="button" aria-label="Notifications">' + ICONS.bell + '<span class="standalone-notification-dot" aria-hidden="true"></span></button>' +
    '      <div class="standalone-divider" aria-hidden="true"></div>' +
    '      <div class="standalone-account">' +
    '        <div class="standalone-account-avatar">JD</div>' +
    '        <span class="standalone-account-name">Joy Digital Ltd.</span>' +
    '      </div>' +
    '    </div>' +
    '  </header>' +
    '  <main class="standalone-main">' +
    '    <div class="standalone-chat-shell">' +
    '      <div class="standalone-chat-header">' +
    '        <div class="standalone-assistant-id">' +
    '          <div class="standalone-assistant-avatar" aria-hidden="true">' + ICONS.bot + '</div>' +
    '          <div class="standalone-title-block">' +
    '            <h1>匯豐中小企 AI 助手</h1>' +
    '            <div class="standalone-live-status"><span class="standalone-live-dot" aria-hidden="true"></span><span>隨時準備為您的業務提供支援</span></div>' +
    '          </div>' +
    '        </div>' +
    '        <div class="standalone-beta-badge">Beta - 智能虛擬助手</div>' +
    '      </div>' +
    '      <section class="standalone-chat-card">' +
    '        <div class="standalone-messages" id="standalone-messages" aria-live="polite" aria-label="Chat messages"></div>' +
    '        <div class="standalone-composer">' +
    '          <form class="standalone-form" id="standalone-chat-form">' +
    '            <input id="standalone-chat-input" class="standalone-input" type="text" autocomplete="off" placeholder="例如：我想設定薪資發放、規劃外匯對沖或查 AAPL 股價..." />' +
    '            <button class="standalone-send-button" id="standalone-send-button" type="submit" aria-label="Send message">' + ICONS.send + '</button>' +
    '          </form>' +
    '        </div>' +
    '      </section>' +
    '    </div>' +
    '  </main>' +
    '</div>';

  var messagesContainer = document.getElementById('standalone-messages');
  var chatForm = document.getElementById('standalone-chat-form');
  var chatInput = document.getElementById('standalone-chat-input');
  var sendButton = document.getElementById('standalone-send-button');
  function createElement(tagName, className) {
    var element = document.createElement(tagName);

    if (className) {
      element.className = className;
    }

    return element;
  }

  function createMessageId(prefix) {
    return (prefix || 'msg') + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  }

  function normalizeForMatch(text) {
    return String(text || '')
      .normalize('NFKC')
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[\u3000\u2000-\u200b]/g, '')
      .replace(/[.,!?;:'"`~@#$%^&*()_+\-=[\]{}\\|<>/?，。！？；：「」『』（）【】《》、】【、]/g, '');
  }

  function isKeywordMatch(input, keywords) {
    var normalizedInput = normalizeForMatch(input);

    return keywords.some(function (keyword) {
      var normalizedKeyword = normalizeForMatch(keyword);

      if (!normalizedKeyword) {
        return false;
      }

      return normalizedInput.indexOf(normalizedKeyword) !== -1 || normalizedKeyword.indexOf(normalizedInput) !== -1;
    });
  }

  function isStockLookup(input) {
    return isKeywordMatch(input, STOCK_KEYWORDS);
  }

  function isCancelCommand(input) {
    return isKeywordMatch(input, CANCEL_KEYWORDS);
  }

  function isRestartCommand(input) {
    return isKeywordMatch(input, RESTART_KEYWORDS);
  }

  function createUserMessage(content) {
    return {
      id: createMessageId('user'),
      role: 'user',
      content: content
    };
  }

  function createAssistantMessage(payload) {
    return {
      id: createMessageId('assistant'),
      role: 'model',
      type: payload.type || 'text',
      content: payload.content,
      actionData: payload.actionData,
      suggestions: payload.suggestions,
      workflow: payload.workflow
    };
  }

  function createWelcomeMessage(storage) {
    return createAssistantMessage({
      content:
        '您好！我是您的匯豐中小企 AI 助手。\n\n我可以協助您處理開戶、轉賬、薪資、營運融資、收款對賬、外匯對沖與企業投資規劃。',
      suggestions: GLOBAL_QUICK_PROMPTS
    });
  }

  function findMarketSnapshot(input) {
    var normalizedInput = normalizeForMatch(input);

    if (!normalizedInput) {
      return null;
    }

    return PUBLIC_MARKET_SNAPSHOTS.find(function (snapshot) {
      return [snapshot.symbol, snapshot.name].concat(snapshot.aliases).some(function (alias) {
        var normalizedAlias = normalizeForMatch(alias);
        return normalizedInput === normalizedAlias || normalizedInput.indexOf(normalizedAlias) !== -1 || normalizedAlias.indexOf(normalizedInput) !== -1;
      });
    }) || null;
  }

  function buildFlowControlSuggestions(title) {
    return [
      { label: '重新開始此流程', prompt: '重新開始' + title },
      { label: '取消目前流程', prompt: '取消目前流程' }
    ];
  }

  function buildWorkflowPreview(workflowId, stepIndex, values, storage, status, recordId) {
    var workflow = WORKFLOW_DEFINITIONS[workflowId];
    var collectedFields = workflow.steps.filter(function (step) {
      return values[step.id];
    }).map(function (step) {
      return {
        label: step.label,
        value: values[step.id]
      };
    });

    return {
      title: workflow.title,
      status: status,
      progressLabel: status === 'completed'
        ? '已完成 ' + workflow.steps.length + '/' + workflow.steps.length
        : '第 ' + Math.min(stepIndex + 1, workflow.steps.length) + ' / ' + workflow.steps.length + ' 步',
      currentQuestion: status === 'in-progress' ? workflow.steps[stepIndex].prompt : undefined,
      collectedFields: collectedFields,
      recordId: recordId,
      storageLabel: storage.path || storage.label
    };
  }

  function formatWorkflowSummary(workflowId, values) {
    var workflow = WORKFLOW_DEFINITIONS[workflowId];

    return workflow.steps.map(function (step) {
      return '- ' + step.label + '：' + (values[step.id] || '未提供');
    }).join('\n');
  }

  function createRecordId(workflowId, existingRecords) {
    var dateSegment = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    var count = existingRecords.filter(function (record) {
      return record.workflowId === workflowId;
    }).length + 1;
    return RECORD_PREFIX[workflowId] + '-' + dateSegment + '-' + String(count).padStart(2, '0');
  }

  function startWorkflow(workflowId, sessionState, storage) {
    var workflow = WORKFLOW_DEFINITIONS[workflowId];
    var stepsList = workflow.steps.map(function (step, index) {
      return (index + 1) + '. ' + step.label;
    }).join('\n');

    return {
      sessionState: {
        activeWorkflow: {
          workflowId: workflowId,
          stepIndex: 0,
          values: {},
          startedAt: new Date().toISOString()
        },
        savedRecords: sessionState.savedRecords
      },
      assistantMessage: {
        content: workflow.intro + '\n\n流程會分 ' + workflow.steps.length + ' 步完成：\n' + stepsList + '\n\n第 1 步 / 共 ' + workflow.steps.length + ' 步：\n' + workflow.steps[0].prompt,
        type: 'action',
        actionData: {
          type: workflow.actionType,
          prompt: ACTION_CARD_CONFIG[workflow.actionType].prompt
        },
        suggestions: buildFlowControlSuggestions(workflow.title),
        workflow: buildWorkflowPreview(workflowId, 0, {}, storage, 'in-progress')
      }
    };
  }

  function continueWorkflow(input, sessionState, storage) {
    var activeWorkflow = sessionState.activeWorkflow;

    if (!activeWorkflow) {
      return {
        sessionState: sessionState,
        assistantMessage: {
          content: '目前沒有進行中的流程。您可以告訴我想處理哪一項業務銀行服務。',
          suggestions: GLOBAL_QUICK_PROMPTS
        }
      };
    }

    var workflow = WORKFLOW_DEFINITIONS[activeWorkflow.workflowId];

    if (isCancelCommand(input)) {
      return {
        sessionState: {
          activeWorkflow: null,
          savedRecords: sessionState.savedRecords
        },
        assistantMessage: {
          content: '已取消「' + workflow.title + '」流程。如需稍後重開，我可隨時再為您整理一次。',
          suggestions: GLOBAL_QUICK_PROMPTS
        }
      };
    }

    if (isRestartCommand(input)) {
      return startWorkflow(activeWorkflow.workflowId, sessionState, storage);
    }

    var currentStep = workflow.steps[activeWorkflow.stepIndex];
    var nextValues = Object.assign({}, activeWorkflow.values);
    nextValues[currentStep.id] = input.trim();
    var nextStepIndex = activeWorkflow.stepIndex + 1;

    if (nextStepIndex < workflow.steps.length) {
      return {
        sessionState: {
          activeWorkflow: {
            workflowId: activeWorkflow.workflowId,
            stepIndex: nextStepIndex,
            values: nextValues,
            startedAt: activeWorkflow.startedAt
          },
          savedRecords: sessionState.savedRecords
        },
        assistantMessage: {
          content: '已記下「' + currentStep.label + '」：' + input.trim() + '。\n\n第 ' + (nextStepIndex + 1) + ' 步 / 共 ' + workflow.steps.length + ' 步：\n' + workflow.steps[nextStepIndex].prompt,
          suggestions: buildFlowControlSuggestions(workflow.title),
          workflow: buildWorkflowPreview(activeWorkflow.workflowId, nextStepIndex, nextValues, storage, 'in-progress')
        }
      };
    }

    var recordId = createRecordId(activeWorkflow.workflowId, sessionState.savedRecords);
    var summary = formatWorkflowSummary(activeWorkflow.workflowId, nextValues);
    var savedRecord = {
      id: recordId,
      workflowId: activeWorkflow.workflowId,
      title: workflow.title,
      savedAt: new Date().toISOString(),
      summary: summary,
      values: nextValues
    };

    return {
      sessionState: {
        activeWorkflow: null,
        savedRecords: [savedRecord].concat(sessionState.savedRecords).slice(0, 20)
      },
      assistantMessage: {
        content: workflow.completionLead + '\n\n摘要：\n' + summary + '\n\n如需調整細節，我可以即時為您更新。',
        suggestions: workflow.suggestions,
        workflow: buildWorkflowPreview(activeWorkflow.workflowId, workflow.steps.length - 1, nextValues, storage, 'completed', recordId)
      }
    };
  }

  function respondToStockLookup(snapshot, sessionState, storage) {
    var changePrefix = snapshot.changePercent >= 0 ? '+' : '';
    var secondaryPrompt = snapshot.currency === 'USD' ? '我想規劃外匯對沖' : '我想查公司戶口餘額';

    return {
      sessionState: {
        activeWorkflow: null,
        savedRecords: sessionState.savedRecords
      },
      assistantMessage: {
        content:
          snapshot.symbol + ' ' + snapshot.name + ' 的最新公開市場價格為 ' + snapshot.currency + ' ' + snapshot.price.toFixed(2) + '，日內變動 ' + changePrefix + snapshot.changePercent.toFixed(1) + '%。\n\n如果您現在查看股票價格，我建議不要只停留在查價；可以同時評估企業閒置資金是否適合做投資配置，以及是否需要處理相關換匯風險。',
        type: 'action',
        actionData: {
          type: 'INVESTMENT_PLANNING',
          prompt: ACTION_CARD_CONFIG.INVESTMENT_PLANNING.prompt
        },
        suggestions: [
          { label: '開始投資規劃', prompt: '我想規劃企業閒置資金投資' },
          { label: snapshot.currency === 'USD' ? '規劃美元對沖' : '檢視公司餘額', prompt: secondaryPrompt },
          { label: '查另一隻股票', prompt: snapshot.symbol === 'AAPL' ? '查 700.HK 股價' : '查 AAPL 股價' }
        ],
        workflow: {
          title: '公開市場查價',
          status: 'completed',
          progressLabel: '公開資料',
          collectedFields: [
            { label: '股票代號', value: snapshot.symbol },
            { label: '市場', value: snapshot.exchange },
            { label: '更新時間', value: snapshot.updatedAt }
          ],
          storageLabel: storage.path || storage.label
        }
      }
    };
  }

  function respondToGenericStockPrompt(sessionState) {
    return {
      sessionState: sessionState,
      assistantMessage: {
        content: '我可以先提供公開市場股價參考。請輸入股票代號或公司名稱，例如 700.HK、0005.HK、AAPL 或 Microsoft。',
        suggestions: [
          { label: '查 700.HK 股價', prompt: '查 700.HK 股價' },
          { label: '查 0005.HK 股價', prompt: '查 0005.HK 股價' },
          { label: '查 AAPL 股價', prompt: '查 AAPL 股價' }
        ]
      }
    };
  }

  function respondToIntent(input, sessionState, storage) {
    var matchedIntent = INTENT_CATALOG.find(function (intent) {
      return isKeywordMatch(input, intent.keywords);
    });

    if (!matchedIntent) {
      return {
        sessionState: sessionState,
        assistantMessage: {
          content: '我可以協助您處理多步驟業務銀行流程，包括開戶、轉賬、薪資、融資、收款、外匯對沖與企業投資規劃。您想先處理哪一項？',
          suggestions: GLOBAL_QUICK_PROMPTS
        }
      };
    }

    if (matchedIntent.workflowId) {
      return startWorkflow(matchedIntent.workflowId, sessionState, storage);
    }

    return {
      sessionState: sessionState,
      assistantMessage: {
        content: matchedIntent.response,
        type: matchedIntent.actionType ? 'action' : 'text',
        actionData: matchedIntent.actionType ? { type: matchedIntent.actionType, prompt: ACTION_CARD_CONFIG[matchedIntent.actionType].prompt } : null,
        suggestions: matchedIntent.suggestions
      }
    };
  }

  function runAgentTurn(input, sessionState, storage) {
    if (sessionState.activeWorkflow) {
      return continueWorkflow(input, sessionState, storage);
    }

    var matchedStock = findMarketSnapshot(input);

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

  function createActionCard(actionType, prompt) {
    var config = ACTION_CARD_CONFIG[actionType];

    if (!config) {
      return null;
    }

    var card = createElement('div', 'standalone-action-card ' + config.tone);
    var top = createElement('div', 'standalone-action-top');
    var icon = createElement('div', 'standalone-action-icon');
    var copy = createElement('div', 'standalone-action-copy');
    var title = document.createElement('h4');
    var description = document.createElement('p');
    var button = createElement('button', 'standalone-action-button');
    var label = document.createElement('span');
    var chevron = document.createElement('span');

    icon.innerHTML = ICONS[config.icon];
    title.textContent = config.title;
    description.textContent = config.description;
    label.textContent = config.actionLabel;
    chevron.innerHTML = ICONS.chevronRight;

    copy.appendChild(title);
    copy.appendChild(description);
    top.appendChild(icon);
    top.appendChild(copy);

    button.type = 'button';
    button.appendChild(label);
    button.appendChild(chevron);
    button.addEventListener('click', function () {
      submitPrompt(prompt || config.prompt);
    });

    card.appendChild(top);
    card.appendChild(button);

    return card;
  }

  function createWorkflowCard(workflow) {
    var card = createElement('div', 'standalone-workflow-card');
    var header = createElement('div', 'standalone-workflow-header');
    var copy = createElement('div', 'standalone-workflow-copy');
    var kicker = createElement('p', 'standalone-workflow-kicker');
    var title = document.createElement('h4');
    var badge = createElement('span', 'standalone-workflow-badge');

    kicker.textContent = workflow.status === 'completed' ? '已完成摘要' : '進行中流程';
    title.textContent = workflow.title;
    badge.textContent = workflow.progressLabel;

    copy.appendChild(kicker);
    copy.appendChild(title);
    header.appendChild(copy);
    header.appendChild(badge);
    card.appendChild(header);

    if (workflow.currentQuestion) {
      var question = createElement('p', 'standalone-workflow-question');
      question.textContent = workflow.currentQuestion;
      card.appendChild(question);
    }

    if (Array.isArray(workflow.collectedFields) && workflow.collectedFields.length > 0) {
      var list = createElement('div', 'standalone-workflow-list');

      workflow.collectedFields.forEach(function (field) {
        var row = createElement('div', 'standalone-workflow-row');
        var label = createElement('span', 'standalone-workflow-label');
        var value = createElement('span', 'standalone-workflow-value');

        label.textContent = field.label;
        value.textContent = field.value;
        row.appendChild(label);
        row.appendChild(value);
        list.appendChild(row);
      });

      card.appendChild(list);
    }

    return card;
  }

  function createSuggestionRow(suggestions) {
    var row = createElement('div', 'standalone-suggestion-row');

    suggestions.forEach(function (suggestion) {
      var button = createElement('button', 'standalone-suggestion-chip');
      button.type = 'button';
      button.textContent = suggestion.label;
      button.disabled = state.isLoading;
      button.addEventListener('click', function () {
        submitPrompt(suggestion.prompt);
      });
      row.appendChild(button);
    });

    return row;
  }

  function createMessageNode(message) {
    var row = createElement('div', 'standalone-message-row ' + (message.role === 'user' ? 'is-user' : 'is-model'));
    var avatar = createElement('div', 'standalone-message-avatar ' + (message.role === 'user' ? 'is-user' : 'is-model'));
    var body = createElement('div', 'standalone-message-body');
    var bubble = createElement('div', 'standalone-bubble');

    avatar.innerHTML = message.role === 'user' ? ICONS.user : ICONS.bot;
    bubble.textContent = message.content;
    body.appendChild(bubble);

    if (message.type === 'action' && message.actionData && message.actionData.type) {
      var actionCard = createActionCard(message.actionData.type, message.actionData.prompt);
      if (actionCard) {
        body.appendChild(actionCard);
      }
    }

    if (message.workflow) {
      body.appendChild(createWorkflowCard(message.workflow));
    }

    if (message.role === 'model' && Array.isArray(message.suggestions) && message.suggestions.length > 0) {
      body.appendChild(createSuggestionRow(message.suggestions));
    }

    row.appendChild(avatar);
    row.appendChild(body);

    return row;
  }

  function createLoadingNode() {
    var row = createElement('div', 'standalone-message-row is-model');
    var avatar = createElement('div', 'standalone-message-avatar is-model standalone-loader-avatar');
    var bubble = createElement('div', 'standalone-loading-bubble');

    avatar.innerHTML = ICONS.loader;

    for (var index = 0; index < 3; index += 1) {
      bubble.appendChild(createElement('span', 'standalone-loading-dot'));
    }

    row.appendChild(avatar);
    row.appendChild(bubble);

    return row;
  }

  function syncMeta() {
    return;
  }

  function syncComposerState() {
    chatInput.disabled = state.isLoading || !state.hydrated;
    sendButton.disabled = state.isLoading || !state.hydrated;
  }

  function renderMessages() {
    var stack = createElement('div', 'standalone-message-stack');

    messagesContainer.innerHTML = '';

    state.messages.forEach(function (message) {
      stack.appendChild(createMessageNode(message));
    });

    if (state.isLoading) {
      stack.appendChild(createLoadingNode());
    }

    messagesContainer.appendChild(stack);
    syncMeta();
    syncComposerState();

    window.requestAnimationFrame(function () {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
  }

  function createEmptyPersistedState() {
    return {
      version: 1,
      messages: [],
      sessionState: { activeWorkflow: null, savedRecords: [] },
      updatedAt: new Date(0).toISOString()
    };
  }

  function normalizeMessages(messages) {
    if (!Array.isArray(messages)) {
      return [];
    }

    return messages.map(function (message) {
      return {
        id: typeof message.id === 'string' ? message.id : createMessageId('rehydrated'),
        role: message.role === 'user' ? 'user' : 'model',
        content: typeof message.content === 'string' ? message.content : '',
        type: message.type === 'action' ? 'action' : 'text',
        actionData: message.actionData || null,
        suggestions: Array.isArray(message.suggestions) ? message.suggestions : undefined,
        workflow: message.workflow || undefined
      };
    });
  }

  function normalizeSessionState(sessionState) {
    if (!sessionState || typeof sessionState !== 'object') {
      return { activeWorkflow: null, savedRecords: [] };
    }

    return {
      activeWorkflow: sessionState.activeWorkflow && typeof sessionState.activeWorkflow === 'object'
        ? {
            workflowId: sessionState.activeWorkflow.workflowId,
            stepIndex: typeof sessionState.activeWorkflow.stepIndex === 'number' ? sessionState.activeWorkflow.stepIndex : 0,
            values: sessionState.activeWorkflow.values && typeof sessionState.activeWorkflow.values === 'object' ? sessionState.activeWorkflow.values : {},
            startedAt: typeof sessionState.activeWorkflow.startedAt === 'string' ? sessionState.activeWorkflow.startedAt : new Date().toISOString()
          }
        : null,
      savedRecords: Array.isArray(sessionState.savedRecords) ? sessionState.savedRecords : []
    };
  }

  function normalizePersistedState(payload) {
    if (!payload || typeof payload !== 'object') {
      return createEmptyPersistedState();
    }

    return {
      version: typeof payload.version === 'number' ? payload.version : 1,
      messages: normalizeMessages(payload.messages),
      sessionState: normalizeSessionState(payload.sessionState),
      updatedAt: typeof payload.updatedAt === 'string' ? payload.updatedAt : new Date().toISOString()
    };
  }

  async function loadPersistedState() {
    try {
      var response = await fetch(API_ENDPOINT, {
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to load local state');
      }

      var payload = await response.json();
      return {
        state: normalizePersistedState(payload.state),
        storage: payload.storage
      };
    } catch (error) {
      var raw = null;

      try {
        raw = window.localStorage.getItem(STORAGE_KEY);
      } catch (storageError) {
        raw = null;
      }

      return {
        state: raw ? normalizePersistedState(JSON.parse(raw)) : createEmptyPersistedState(),
        storage: { kind: 'browser-local-storage', label: '瀏覽器本地儲存' }
      };
    }
  }

  async function savePersistedState(payload) {
    var normalizedPayload = normalizePersistedState(payload);

    try {
      var response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: normalizedPayload })
      });

      if (!response.ok) {
        throw new Error('Failed to save local state');
      }

      var result = await response.json();
      return result.storage;
    } catch (error) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedPayload));
      } catch (storageError) {
        // Ignore localStorage quota or availability errors.
      }

      return { kind: 'browser-local-storage', label: '瀏覽器本地儲存' };
    }
  }

  async function submitPrompt(prompt) {
    var nextInput = String(prompt || chatInput.value || '').trim();

    if (!nextInput || state.isLoading || !state.hydrated) {
      return;
    }

    var userMessage = createUserMessage(nextInput);

    state.messages = state.messages.concat(userMessage);
    chatInput.value = '';
    state.isLoading = true;
    renderMessages();

    window.setTimeout(async function () {
      var result = runAgentTurn(nextInput, state.sessionState, state.storage);
      var assistantMessage = createAssistantMessage(result.assistantMessage);

      state.messages = state.messages.concat(assistantMessage);
      state.sessionState = result.sessionState;
      state.isLoading = false;

      var updatedStorage = await savePersistedState({
        version: 1,
        messages: state.messages,
        sessionState: state.sessionState,
        updatedAt: new Date().toISOString()
      });

      state.storage = updatedStorage;
      renderMessages();
    }, 850);
  }

  async function hydrateState() {
    var loaded = await loadPersistedState();

    state.storage = loaded.storage;
    state.sessionState = loaded.state.sessionState;
    state.messages = loaded.state.messages.length > 0 ? loaded.state.messages : [createWelcomeMessage(loaded.storage)];
    state.hydrated = true;
    renderMessages();
  }

  chatForm.addEventListener('submit', function (event) {
    event.preventDefault();
    submitPrompt();
  });

  syncComposerState();
  renderMessages();
  hydrateState();
})();