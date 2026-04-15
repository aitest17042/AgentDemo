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
    // 顯示選項按鈕
    setTimeout(() => {
      displayOptionsButtons(node.options);
    }, 300);
  } else if (node.type === 'text') {
    addMessage(node.content);
    // 對於 text 類型，顯示"返回"按鈕
    if (node.next) {
      setTimeout(() => {
        displayContinueButton(node.next);
      }, 300);
    }
  }
}

// 顯示繼續按鈕
function displayContinueButton(nextNodeId) {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  
  // 創建按鈕容器
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'flex items-start message-fade-in';
  buttonContainer.innerHTML = '<div class="w-8 h-8 flex-shrink-0"></div>';
  
  const buttonDiv = document.createElement('div');
  buttonDiv.className = 'flex flex-wrap gap-2 ml-3';
  
  const btn = document.createElement('button');
  btn.className = 'px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors';
  btn.textContent = '繼續';
  btn.onclick = () => handleContinueClick(nextNodeId);
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
  addMessage(node.content + '\n\n--- 流程開始 ---');
  
  let stepIndex = 0;
  const chatMessages = document.getElementById('chatMessages');
  
  function showStep() {
    if (stepIndex < node.steps.length) {
      const step = node.steps[stepIndex];
      const stepContent = `**第 ${step.step} 步: ${step.title}**\n\n${step.content}\n\n${step.feedback}`;
      addMessage(stepContent);
      
      // 創建「繼續」按鈕 - 直接在聊天框中
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
      }, 300);
    } else {
      // 所有步驟完成
      addMessage('✓ 所有步驟已完成！');
      setTimeout(() => {
        conversationEngine.handleNodeResponse('steps', null);
        displayCurrentNode();
      }, 500);
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
