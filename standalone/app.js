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
    wallet:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 7H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path><path d="M16 13h.01"></path><path d="M6 7V5a2 2 0 0 1 2-2h10"></path></svg>',
    userPlus:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M19 8v6"></path><path d="M22 11h-6"></path></svg>',
    chevronRight:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>'
  };

  // Shared knowledge base and action card config (auto-generated from lib/knowledgeBase.ts)
  var MOCK_KNOWLEDGE_BASE = [
    { keywords: ['開戶', '申請', '戶口'], response: "我可以協助您開始申請匯豐商業戶口。如果您已經準備好商業登記證（BR），我可以現在就為您初始化申請表。如果您是現有匯豐個人客戶，流程會更快。", action: 'ACCOUNT_OPENING' },
    { keywords: ['轉賬', '匯款', '交易', '付款'], response: "沒問題，我們可以立即安排轉賬。您是想進行本地轉賬還是海外匯款？我已為您準備好智能轉賬介面。", action: 'TRANSFER' },
    { keywords: ['餘額', '結餘', '余额', '查詢', '查询'], response: "您目前的「SME Power」港幣戶口結餘為 HK$2,450,890.00。需要我為您分析最近的開支趨勢嗎？", action: null },
    { keywords: ['貸款', '借錢'], response: "匯豐為 SME 提供靈活的融資方案。根據您的業務狀況，您可能有資格獲得高達 HK$2,000,000 的中小企融資擔保計劃貸款。", action: null },
    { keywords: ['你好', 'hello', 'hi'], response: "您好！我是您的匯豐中小企 AI 助手。今天有什麼可以幫到您的業務發展？", action: null },
  ];

  var ACTION_CARD_CONFIG = {
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

  var state = {
    messages: [
      {
        role: 'model',
        content:
          '您好！我是您的匯豐中小企 AI 助手。今天有什麼可以幫到您的業務發展？我可以協助您辦理開戶、跨境轉賬或查詢業務融資方案。'
      }
    ],
    isLoading: false
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
    '            <input id="standalone-chat-input" class="standalone-input" type="text" autocomplete="off" placeholder="例如：我想開立新的商業戶口..." />' +
    '            <button class="standalone-send-button" id="standalone-send-button" type="submit" aria-label="Send message">' + ICONS.send + '</button>' +
    '          </form>' +
    '          <p class="standalone-footnote">由匯豐生成式 AI 技術驅動。所有銀行操作均受匯豐安全加密技術保護。</p>' +
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

  function normalizeForMatch(text) {
    return String(text || '')
      .normalize('NFKC')
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[\u3000\u2000-\u200b]/g, '')
      .replace(/[.,!?;:'"`~@#$%^&*()_+\-=[\]{}\\|<>/?，。！？；：「」『』（）【】《》、]/g, '');
  }

  function findMatch(inputText) {
    var normalizedInput = normalizeForMatch(inputText);

    if (!normalizedInput) {
      return null;
    }

    return MOCK_KNOWLEDGE_BASE.find(function (item) {
      if (!item || !Array.isArray(item.keywords)) {
        return false;
      }

      return item.keywords.some(function (keyword) {
        var normalizedKeyword = normalizeForMatch(keyword);

        if (!normalizedKeyword) {
          return false;
        }

        return (
          normalizedInput.indexOf(normalizedKeyword) !== -1 ||
          normalizedKeyword.indexOf(normalizedInput) !== -1
        );
      });
    });
  }

  function createActionCard(actionType) {
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
      chatInput.value = config.title;
      chatInput.focus();
    });

    card.appendChild(top);
    card.appendChild(button);

    return card;
  }

  function createMessageNode(message) {
    var row = createElement(
      'div',
      'standalone-message-row ' + (message.role === 'user' ? 'is-user' : 'is-model')
    );
    var avatar = createElement(
      'div',
      'standalone-message-avatar ' + (message.role === 'user' ? 'is-user' : 'is-model')
    );
    var body = createElement('div', 'standalone-message-body');
    var bubble = createElement('div', 'standalone-bubble');

    avatar.innerHTML = message.role === 'user' ? ICONS.user : ICONS.bot;
    bubble.textContent = message.content;

    body.appendChild(bubble);

    if (message.type === 'action' && message.actionData && message.actionData.type) {
      var actionCard = createActionCard(message.actionData.type);

      if (actionCard) {
        body.appendChild(actionCard);
      }
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

  function syncComposerState() {
    chatInput.disabled = state.isLoading;
    sendButton.disabled = state.isLoading;
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

    window.requestAnimationFrame(function () {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
  }

  function handleSend(event) {
    if (event) {
      event.preventDefault();
    }

    var nextInput = chatInput.value.trim();

    if (!nextInput || state.isLoading) {
      return;
    }

    state.messages.push({ role: 'user', content: nextInput });
    chatInput.value = '';
    state.isLoading = true;
    syncComposerState();
    renderMessages();

    window.setTimeout(function () {
      var botResponse =
        '感謝您的查詢。目前我正在處理您的請求。雖然我是一個 AI 助手，但我可以引導您到正確的銀行服務。請問您是想查詢特定交易還是新的銀行服務？';
      var type = 'text';
      var actionData = null;
      var match = findMatch(nextInput);

      if (match) {
        botResponse = match.response;

        if (match.action) {
          type = 'action';
          actionData = { type: match.action };
        }
      }

      state.messages.push({
        role: 'model',
        content: botResponse,
        type: type,
        actionData: actionData
      });
      state.isLoading = false;
      syncComposerState();
      renderMessages();
    }, 900);
  }

  chatForm.addEventListener('submit', handleSend);
  syncComposerState();
  renderMessages();
})();