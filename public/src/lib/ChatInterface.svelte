<script>
  import { onMount } from 'svelte';
  import { marked } from 'marked';
  import { generateGeminiResponse } from './geminiService.js';
  
  // State variables
  let messages = $state([
    {
      role: 'assistant',
      content: 'Welcome to the Historical Event Simulator! Ask me about alternate history scenarios or historical what-ifs.'
    }
  ]);
  let userInput = $state('');
  let isTyping = $state(false);
  let chatContainer;
  let apiKeyMissing = $state(false);
  let darkMode = $state(false);
  let animationSpeed = $state(30); // ms per character for typing effect
  
  // Sample responses as fallback if API is not available
  const sampleResponses = [
    "In this alternate timeline, the outcome of the Battle of Waterloo was reversed, leading to Napoleon's continued rule in Europe.",
    "The historical simulation suggests that if the Industrial Revolution had begun in China instead of Britain, global power dynamics would have shifted dramatically eastward.",
    "I've analyzed your scenario where the Byzantine Empire never fell. The model suggests a continued Greek cultural dominance in the Eastern Mediterranean.",
    "Your alternate history where the printing press was invented 200 years earlier shows fascinating consequences for the Renaissance and Reformation.",
    "The simulation indicates that if the Mongol Empire had conquered Europe entirely, scientific exchange between East and West would have accelerated technological development.",
    "In the timeline where Columbus never reached the Americas, the model suggests indigenous American civilizations would have developed independently for several more centuries.",
    "The historical counterfactual where the Roman Empire never fell shows a significantly different technological progression timeline.",
    "Your scenario about a world where the Black Death never occurred indicates much slower social mobility and delayed end to feudalism."
  ];
  
  // Check if API key is available on mount and set theme based on user preference
  onMount(() => {
    scrollToBottom();
    apiKeyMissing = !import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKeyMissing) {
      console.warn("Gemini API key is missing. Using fallback responses.");
    }
    
    // Check for user's preferred color scheme
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    darkMode = prefersDarkMode;
    
    // Add event listener for theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      darkMode = e.matches;
    });
  });
  
  // Function to handle user message submission
  async function handleSubmit() {
    if (!userInput.trim()) return;
    
    // Add user message
    messages = [...messages, { role: 'user', content: userInput }];
    const currentInput = userInput;
    userInput = '';
    
    // Show typing indicator
    isTyping = true;
    
    // Scroll to bottom
    setTimeout(scrollToBottom, 100);
    
    try {
      let response;
      
      if (apiKeyMissing) {
        // Use fallback response generator if API key is missing
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
        response = generateFallbackResponse(currentInput);
      } else {
        // Use Gemini API for response generation
        response = await generateGeminiResponse(currentInput);
      }
      
      // Add assistant message with typing animation
      const typingMessage = { role: 'assistant', content: '', isTyping: true };
      messages = [...messages, typingMessage];
      
      // Animate the typing of the response
      await animateTyping(response, messages.length - 1);
      
    } catch (error) {
      console.error("Error generating response:", error);
      messages = [...messages, { 
        role: 'assistant', 
        content: "I'm having trouble processing your historical scenario. Please try again in a moment." 
      }];
    } finally {
      isTyping = false;
      
      // Scroll to bottom
      setTimeout(scrollToBottom, 100);
    }
  }
  
  // Function to animate typing effect
  async function animateTyping(fullText, messageIndex) {
  const words = fullText.split(' ');
  let currentText = '';

  for (let i = 0; i < words.length; i++) {
    if (i > 0) currentText += ' ';
    currentText += words[i];
    messages[messageIndex].content = currentText;
    messages[messageIndex].isTyping = true;
    messages = [...messages]; // Trigger reactivity

    // Adjust typing speed based on punctuation
    let delay = animationSpeed / 2; // Reduce delay for faster animation
    if (['.', '!', '?'].includes(words[i].slice(-1))) {
      delay = animationSpeed * 4;
    } else if ([',', ';', ':'].includes(words[i].slice(-1))) {
      delay = animationSpeed * 2;
    }

    await new Promise(resolve => setTimeout(resolve, delay));
    scrollToBottom();
  }

  messages[messageIndex].isTyping = false;
  messages = [...messages]; // Trigger reactivity
}

  
  // Fallback function to generate a response based on user input
  function generateFallbackResponse(input) {
    // Check for specific keywords to give contextual responses
    if (input.toLowerCase().includes('hello') || input.toLowerCase().includes('hi')) {
      return "Hello! I'm your Historical Event Simulator assistant. What alternate history scenario would you like to explore today?";
    }
    
    if (input.toLowerCase().includes('help')) {
      return "I can help you explore alternate historical timelines, simulate historical what-ifs, or analyze counterfactual scenarios. Just describe a historical event or turning point you'd like to explore!";
    }
    
    if (input.toLowerCase().includes('timeline') || input.toLowerCase().includes('history') || input.toLowerCase().includes('alternate')) {
      return "I've started simulating an alternate historical timeline based on your input. The divergence point has been set. Would you like to explore specific consequences or see how certain aspects of society developed differently?";
    }
    
    // Default to a random response from our sample list
    return sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
  }
  
  // Function to scroll chat to bottom
  function scrollToBottom() {
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }
  
  // Function to render markdown content safely
  function renderMarkdown(content) {
    return marked(content);
  }
  
  // Function to toggle dark mode
  function toggleDarkMode() {
    darkMode = !darkMode;
  }
</script>

<div class="chat-interface {darkMode ? 'dark-mode' : 'light-mode'}">
  <div class="chat-header">
    <h2>Historical Timeline Simulator</h2>
    <button class="theme-toggle" on:click={toggleDarkMode} aria-label="Toggle dark mode">
      {#if darkMode}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      {/if}
    </button>
  </div>

  {#if apiKeyMissing}
    <div class="api-key-warning">
      <p>⚠️ Gemini API key not found. Using fallback responses.</p>
      <p class="api-key-instructions">Create a <code>.env</code> file in the project root with <code>VITE_GEMINI_API_KEY=your_api_key_here</code></p>
    </div>
  {/if}
  
  <div class="chat-messages" bind:this={chatContainer}>
    {#each messages as message, i}
      <div class="message {message.role} {message.isTyping ? 'typing-message' : ''}" 
           style="--delay: {i * 0.1}s">
        <div class="message-avatar">
          {#if message.role === 'assistant'}
            <div class="assistant-avatar">AI</div>
          {:else}
            <div class="user-avatar">You</div>
          {/if}
        </div>
        <div class="message-content">
          {@html renderMarkdown(message.content)}
        </div>
      </div>
    {/each}
    
    {#if isTyping}
      <div class="message assistant typing">
        <div class="message-avatar">
          <div class="assistant-avatar">AI</div>
        </div>
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    {/if}
  </div>
  
  <form on:submit|preventDefault={handleSubmit} class="chat-input-container">
    <input 
      type="text" 
      bind:value={userInput} 
      placeholder="Ask about an alternate historical timeline..." 
      class="chat-input"
    />
    <button type="submit" class="send-button" aria-label="Send message">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
    </button>
  </form>
</div>

<style>
  .chat-interface {
    display: flex;
    flex-direction: column;
    height: 100%;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    flex: 1;
    position: relative;
    transition: all 0.3s ease;
  }
  
  .light-mode {
    background-color: white;
    color: #333;
  }
  
  .dark-mode {
    background-color: #1e1e2e;
    color: #e0e0e0;
  }
  
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid;
    transition: all 0.3s ease;
  }
  
  .light-mode .chat-header {
    background-color: #ff3e00;
    color: white;
    border-bottom-color: #e03600;
  }
  
  .dark-mode .chat-header {
    background-color: #2c2c44;
    color: #ff5e1f;
    border-bottom-color: #3a3a5a;
  }
  
  .chat-header h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  .theme-toggle {
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border-radius: 50%;
    transition: background-color 0.2s;
  }
  
  .light-mode .theme-toggle {
    color: white;
  }
  
  .light-mode .theme-toggle:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  .dark-mode .theme-toggle {
    color: #ff5e1f;
  }
  
  .dark-mode .theme-toggle:hover {
    background-color: rgba(255, 94, 31, 0.2);
  }
  
  .api-key-warning {
    padding: 0.75rem;
    border-bottom: 1px solid;
    font-size: 0.875rem;
    transition: all 0.3s ease;
  }
  
  .light-mode .api-key-warning {
    background-color: #fff3cd;
    color: #856404;
    border-bottom-color: #ffeeba;
  }
  
  .dark-mode .api-key-warning {
    background-color: #332b00;
    color: #ffdb72;
    border-bottom-color: #665500;
  }
  
  .api-key-instructions {
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }
  
  .light-mode .api-key-instructions {
    color: #666;
  }
  
  .dark-mode .api-key-instructions {
    color: #aaa;
  }
  
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: background-color 0.3s ease;
  }
  
  .light-mode .chat-messages {
    background-color: #f9f9f9;
  }
  
  .dark-mode .chat-messages {
    background-color: #1e1e2e;
  }
  
  .message {
    display: flex;
    margin-bottom: 0.5rem;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.5s forwards;
    animation-delay: var(--delay, 0s);
    max-width: 85%;
  }
  
  .message.user {
    align-self: flex-end;
    flex-direction: row-reverse;
  }
  
  .message.assistant {
    align-self: flex-start;
  }
  
  .message-avatar {
    display: flex;
    align-items: flex-start;
    margin: 0 0.5rem;
  }
  
  .assistant-avatar, .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: bold;
  }
  
  .light-mode .assistant-avatar {
    background-color: #ff3e00;
    color: white;
  }
  
  .dark-mode .assistant-avatar {
    background-color: #ff5e1f;
    color: #1e1e2e;
  }
  
  .light-mode .user-avatar {
    background-color: #3e8ed0;
    color: white;
  }
  
  .dark-mode .user-avatar {
    background-color: #5ea8ff;
    color: #1e1e2e;
  }
  
  .message-content {
    padding: 0.8rem 1.2rem;
    border-radius: 18px;
    line-height: 1.5;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }
  
  .light-mode .user .message-content {
    background-color: #3e8ed0;
    color: white;
    border-radius: 18px 18px 0 18px;
  }
  
  .dark-mode .user .message-content {
    background-color: #2c5c8f;
    color: #e0e0e0;
    border-radius: 18px 18px 0 18px;
  }
  
  .light-mode .assistant .message-content {
    background-color: #f0f0f0;
    color: #333;
    border-radius: 18px 18px 18px 0;
  }
  
  .dark-mode .assistant .message-content {
    background-color: #2c2c44;
    color: #e0e0e0;
    border-radius: 18px 18px 18px 0;
  }
  
  .typing-message .message-content {
    border-left: 3px solid;
  }
  
  .light-mode .typing-message .message-content {
    border-left-color: #ff3e00;
  }
  
  .dark-mode .typing-message .message-content {
    border-left-color: #ff5e1f;
  }
  
  .typing-indicator {
    display: flex;
    align-items: center;
    padding: 0.8rem 1.2rem;
    border-radius: 18px 18px 18px 0;
    transition: background-color 0.3s ease;
  }
  
  .light-mode .typing-indicator {
    background-color: #f0f0f0;
  }
  
  .dark-mode .typing-indicator {
    background-color: #2c2c44;
  }
  
  .typing-indicator span {
    height: 8px;
    width: 8px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 5px;
    animation: bounce 1.3s linear infinite;
  }
  
  .light-mode .typing-indicator span {
    background-color: #888;
  }
  
  .dark-mode .typing-indicator span {
    background-color: #aaa;
  }
  
  .typing-indicator span:nth-child(2) {
    animation-delay: 0.15s;
  }
  
  .typing-indicator span:nth-child(3) {
    animation-delay: 0.3s;
    margin-right: 0;
  }
  
  .chat-input-container {
    display: flex;
    padding: 1rem;
    border-top: 1px solid;
    transition: all 0.3s ease;
  }
  
  .light-mode .chat-input-container {
    background-color: white;
    border-top-color: #eee;
  }
  
  .dark-mode .chat-input-container {
    background-color: #2c2c44;
    border-top-color: #3a3a5a;
  }
  
  .chat-input {
    flex: 1;
    padding: 0.8rem 1rem;
    border: 1px solid;
    border-radius: 24px;
    font-size: 1rem;
    outline: none;
    transition: all 0.3s ease;
  }
  
  .light-mode .chat-input {
    background-color: white;
    color: #333;
    border-color: #ddd;
  }
  
  .light-mode .chat-input:focus {
    border-color: #ff3e00;
    box-shadow: 0 0 0 2px rgba(255, 62, 0, 0.2);
  }
  
  .dark-mode .chat-input {
    background-color: #1e1e2e;
    color: #e0e0e0;
    border-color: #3a3a5a;
  }
  
  .dark-mode .chat-input:focus {
    border-color: #ff5e1f;
    box-shadow: 0 0 0 2px rgba(255, 94, 31, 0.2);
  }
  
  .chat-input::placeholder {
    transition: color 0.3s ease;
  }
  
  .light-mode .chat-input::placeholder {
    color: #aaa;
  }
  
  .dark-mode .chat-input::placeholder {
    color: #777;
  }
  
  .send-button {
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    margin-left: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .light-mode .send-button {
    background-color: #ff3e00;
    color: white;
  }
  
  .light-mode .send-button:hover {
    background-color: #e03600;
  }
  
  .dark-mode .send-button {
    background-color: #ff5e1f;
    color: #1e1e2e;
  }
  
  .dark-mode .send-button:hover {
    background-color: #e54e0f;
  }
  
  .send-button svg {
    width: 18px;
    height: 18px;
  }
  
  @keyframes fadeInUp {
    from { 
      opacity: 0; 
      transform: translateY(20px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-4px); }
  }
  
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
  
  /* Make sure markdown content is properly styled */
  :global(.message-content p) {
    margin: 0;
  }
  
  :global(.message-content a) {
    text-decoration: underline;
    transition: color 0.3s ease;
  }
  
  :global(.light-mode .user .message-content a) {
    color: white;
  }
  
  :global(.dark-mode .user .message-content a) {
    color: #aadaff;
  }
  
  :global(.light-mode .assistant .message-content a) {
    color: #ff3e00;
  }
  
  :global(.dark-mode .assistant .message-content a) {
    color: #ff5e1f;
  }
  
  :global(.message-content code) {
    font-family: monospace;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-size: 0.9em;
    transition: all 0.3s ease;
  }
  
  :global(.light-mode .message-content code) {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  :global(.dark-mode .message-content code) {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  /* Scrollbar styling */
  .chat-messages::-webkit-scrollbar {
    width: 8px;
  }
  
  .light-mode .chat-messages::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  .light-mode .chat-messages::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 4px;
  }
  
  .light-mode .chat-messages::-webkit-scrollbar-thumb:hover {
    background: #ccc;
  }
  
  .dark-mode .chat-messages::-webkit-scrollbar-track {
    background: #2c2c44;
  }
  
  .dark-mode .chat-messages::-webkit-scrollbar-thumb {
    background: #3a3a5a;
    border-radius: 4px;
  }
  
  .dark-mode .chat-messages::-webkit-scrollbar-thumb:hover {
    background: #4a4a6a;
  }
</style>