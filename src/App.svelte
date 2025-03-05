<script>
  import ChatInterface from './lib/ChatInterface.svelte';
</script>

<main>
  <div class="app-container">
    <h2 class="title">
      <span class="title-word title-word-1">Generative Event Simulator</span>
    </h2>
    <ChatInterface />
  </div>
</main>

<style>
  .app-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .title {
    color: #ff3e00;
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2.5em;
    font-weight: 700;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .title-word {
    animation: color-animation 4s linear infinite;
  }
  
  .title-word-1 {
    --color-1: #ff3e00;
    --color-2: #ff5e1f;
    --color-3: #ff7e3f;
  }
  
  .title-word-2 {
    --color-1: #ff5e1f;
    --color-2: #ff7e3f;
    --color-3: #ff3e00;
    animation-delay: 1s;
  }
  
  .title-word-3 {
    --color-1: #ff7e3f;
    --color-2: #ff3e00;
    --color-3: #ff5e1f;
    animation-delay: 2s;
  }
  
  @keyframes color-animation {
    0%    {color: var(--color-1)}
    32%   {color: var(--color-1)}
    33%   {color: var(--color-2)}
    65%   {color: var(--color-2)}
    66%   {color: var(--color-3)}
    99%   {color: var(--color-3)}
    100%  {color: var(--color-1)}
  }

  main {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  :global(body) {
    background-color: #f9f9f9;
    color: #333;
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  @media (prefers-color-scheme: dark) {
    :global(body) {
      background-color: #1e1e2e;
      color: #e0e0e0;
    }
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .title {
      font-size: 2em;
    }
  }
  
  @media (max-width: 480px) {
    .title {
      font-size: 1.8em;
    }
    
    .app-container {
      padding: 0.5rem;
    }
  }
</style>