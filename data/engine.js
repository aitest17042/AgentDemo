// 流程引擎 - 管理對話流程
class ConversationEngine {
  constructor(flowData) {
    this.flowData = flowData;
    this.currentFlow = null;
    this.currentNodeId = null;
    this.history = [];
    this.userProgress = {};
    this.initFlow();
  }

  initFlow() {
    const isLoggedIn = localStorage.getItem('hsbcLogin') === 'true';
    this.currentFlow = isLoggedIn ? this.flowData.flows.loggedIn : this.flowData.flows.public;
    this.currentNodeId = this.currentFlow.start;
  }

  getCurrentNode() {
    return this.currentFlow[this.currentNodeId];
  }

  goToNode(nodeId) {
    if (this.currentFlow[nodeId]) {
      this.history.push(this.currentNodeId);
      this.currentNodeId = nodeId;
      return this.getCurrentNode();
    }
    return null;
  }

  goBack() {
    if (this.history.length > 0) {
      this.currentNodeId = this.history.pop();
      return this.getCurrentNode();
    }
    return null;
  }

  handleNodeResponse(nodeType, userResponse) {
    const currentNode = this.getCurrentNode();
    
    if (nodeType === 'options' && currentNode.options) {
      const selectedOption = currentNode.options.find(opt => opt.label === userResponse);
      if (selectedOption && selectedOption.next) {
        return this.goToNode(selectedOption.next);
      }
    }
    
    if (nodeType === 'steps' && currentNode.nextAfterSteps) {
      return this.goToNode(currentNode.nextAfterSteps);
    }
    
    if (nodeType === 'text' && currentNode.next) {
      return this.goToNode(currentNode.next);
    }
    
    return currentNode;
  }

  getButtons() {
    const node = this.getCurrentNode();
    
    if (node.type === 'options' && node.options) {
      return node.options.map(opt => opt.label);
    }
    
    return [];
  }

  isStepNode() {
    return this.getCurrentNode().type === 'steps';
  }

  getSteps() {
    const node = this.getCurrentNode();
    return node.type === 'steps' ? node.steps : [];
  }

  trackStepProgress(stepNumber) {
    const nodeId = this.currentNodeId;
    if (!this.userProgress[nodeId]) {
      this.userProgress[nodeId] = {};
    }
    this.userProgress[nodeId].currentStep = stepNumber;
  }

  getCurrentStepProgress() {
    const nodeId = this.currentNodeId;
    return this.userProgress[nodeId]?.currentStep || 0;
  }
}

// 全局引擎實例
let conversationEngine = null;

// 初始化引擎
async function initializeEngine() {
  try {
    console.log('Starting to load conversation engine...');
    const response = await fetch('data/questionFlow.json');
    console.log('Fetch response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }
    
    const flowData = await response.json();
    console.log('Flow data loaded successfully:', flowData);
    
    conversationEngine = new ConversationEngine(flowData);
    console.log('Conversation engine initialized');
    return true;
  } catch (error) {
    console.error('Failed to load question flow:', error);
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    console.error('Stack:', error.stack);
    return false;
  }
}

// 獲取當前節點內容
function getCurrentContent() {
  if (!conversationEngine) return '';
  const node = conversationEngine.getCurrentNode();
  
  if (node.type === 'steps') {
    return node.content;
  }
  return node.content || '';
}

// 獲取當前按鈕
function getCurrentButtons() {
  if (!conversationEngine) return [];
  
  const node = conversationEngine.getCurrentNode();
  if (node.type === 'options' && node.options) {
    return node.options.map(opt => opt.label);
  }
  
  return [];
}

// 處理用戶點擊按鈕
function handleButtonClick(buttonText) {
  if (!conversationEngine) return '';
  
  const currentNode = conversationEngine.getCurrentNode();
  
  // 添加用戶消息
  addMessage(buttonText, true);
  
  // 移動到下一節點
  const nextNode = conversationEngine.handleNodeResponse(currentNode.type, buttonText);
  
  if (nextNode) {
    // 簡短延遲後顯示回復
    setTimeout(() => {
      displayCurrentNode();
    }, 300);
  }
}

// 顯示當前節點
function displayCurrentNode() {
  if (!conversationEngine) return;
  
  const node = conversationEngine.getCurrentNode();
  
  if (node.type === 'steps') {
    displaySteps(node);
  } else if (node.type === 'options') {
    addMessage(node.content);
    // 顯示選項按鈕需等回覆動畫結束
    setTimeout(() => {
      displayOptionsButtons(node.options);
    }, 800);
  } else if (node.type === 'text') {
    addMessage(node.content);
    // 顯示繼續/返回按鈕需等回覆動畫結束
    if (node.next) {
      setTimeout(() => {
        displayContinueButton(node.next);
      }, 800);
    }
  }
}

// 顯示繼續按鈕
function displayContinueButton(nextNodeId) {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  
  // 檢查是否還有進一步的節點
  const isLoggedIn = localStorage.getItem('hsbcLogin') === 'true';
  const mainMenuId = isLoggedIn ? 'q_logged_welcome' : 'q_welcome';
  
  // 如果沒有 nextNodeId 或 nextNodeId 等於主菜單，視為流程結束
  const isEndOfFlow = !nextNodeId || nextNodeId === mainMenuId;
  
  // 創建按鈕容器
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'flex items-start message-fade-in';
  buttonContainer.innerHTML = '<div class="w-8 h-8 flex-shrink-0"></div>';
  
  const buttonDiv = document.createElement('div');
  buttonDiv.className = 'flex flex-wrap gap-2 ml-3';
  
  const btn = document.createElement('button');
  btn.className = 'px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors';
  btn.textContent = isEndOfFlow ? '返回主菜單' : '繼續';
  btn.onclick = () => handleContinueClick(nextNodeId || mainMenuId);
  buttonDiv.appendChild(btn);
  
  buttonContainer.appendChild(buttonDiv);
  chatMessages.appendChild(buttonContainer);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 處理繼續按鈕點擊
function handleContinueClick(nextNodeId) {
  conversationEngine.goToNode(nextNodeId);
  setTimeout(() => {
    displayCurrentNode();
  }, 300);
}

// 顯示選項按鈕
function displayOptionsButtons(options) {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  
  // 創建選項容器
  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'flex items-start message-fade-in';
  optionsContainer.innerHTML = '<div class="w-8 h-8 flex-shrink-0"></div>';
  
  const optionsDiv = document.createElement('div');
  optionsDiv.className = 'flex flex-wrap gap-2 ml-3';
  
  options.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors';
    btn.textContent = option.label;
    btn.onclick = () => handleOptionClick(option.label);
    optionsDiv.appendChild(btn);
  });
  
  optionsContainer.appendChild(optionsDiv);
  chatMessages.appendChild(optionsContainer);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 處理選項點擊
function handleOptionClick(label) {
  addMessage(label, true);
  const currentNode = conversationEngine.getCurrentNode();
  conversationEngine.handleNodeResponse(currentNode.type, label);
  setTimeout(() => {
    displayCurrentNode();
  }, 300);
}

// 顯示步驟
function displaySteps(node) {
  addMessage(node.content);
  let stepIndex = 0;
  const chatMessages = document.getElementById('chatMessages');

  function showStep() {
    if (stepIndex < node.steps.length) {
      const step = node.steps[stepIndex];
      const stepContent = `【步驟 ${step.step}】${step.title}\n${step.content}\n${step.feedback}`;
      addMessage(stepContent);

      // 等待回覆動畫結束再顯示按鈕
      setTimeout(() => {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flex items-start message-fade-in';
        buttonContainer.innerHTML = '<div class="w-8 h-8 flex-shrink-0"></div>';

        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'flex flex-wrap gap-2 ml-3';

        const continueBtn = document.createElement('button');
        continueBtn.className = 'px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors';
        continueBtn.textContent = '繼續';
        continueBtn.onclick = () => {
          stepIndex++;
          showStep();
        };

        buttonDiv.appendChild(continueBtn);
        buttonContainer.appendChild(buttonDiv);

        if (chatMessages) {
          chatMessages.appendChild(buttonContainer);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }
      }, 800);
    } else {
      // 所有步驟完成
      addMessage('✓ 所有步驟已完成！');
      setTimeout(() => {
        conversationEngine.handleNodeResponse('steps', null);
        displayCurrentNode();
      }, 400);
    }
  }

  showStep();
}

// 重新開始對話
function restartConversation() {
  if (conversationEngine) {
    conversationEngine.initFlow();
    displayCurrentNode();
  }
}

// 新增：延遲回覆與打字動畫
function addMessage(content, isUser = false) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex items-start message-fade-in ${isUser ? 'flex-row-reverse' : ''}`;
    let avatar, bgColor;
    if (isUser) {
        avatar = `<div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center ml-3 flex-shrink-0"><i class="fa fa-user text-white text-sm"></i></div>`;
        bgColor = 'bg-primary text-white rounded-lg rounded-tr-none';
    } else {
        avatar = `<div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0"><i class="fa fa-robot text-primary text-sm"></i></div>`;
        bgColor = 'bg-neutral rounded-lg rounded-tl-none';
    }
    const formattedContent = content.replace(/\n/g, '<br>');

    if (!isUser) {
        addTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            messageDiv.innerHTML = `${avatar}<div class=\"${bgColor} px-4 py-3 max-w-[80%]\"><p class=\"${isUser ? 'text-white' : 'text-gray-800'}\">${formattedContent}</p></div>`;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 500);
    } else {
        messageDiv.innerHTML = `${avatar}<div class=\"${bgColor} px-4 py-3 max-w-[80%]\"><p class=\"${isUser ? 'text-white' : 'text-gray-800'}\">${formattedContent}</p></div>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// 打字動畫
function addTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    removeTypingIndicator();
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typingIndicator';
    typingDiv.className = 'flex items-start message-fade-in';
    typingDiv.innerHTML = `<div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0"><i class="fa fa-robot text-primary text-sm"></i></div><div class="bg-neutral rounded-lg rounded-tl-none px-4 py-3"><span class="text-gray-400">...</span></div>`;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) typingIndicator.remove();
}
