// Get references to the DOM elements
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const responseContainer = document.getElementById('response');

const messages = [
  {
    role: 'system',
    content: 'You are a friendly Budget Travel Planner, specializing in cost-conscious travel advice. You help users find cheap flights, budget-friendly accommodations, affordable itineraries, and low-cost activities in their chosen destination. If a user\'s query is unrelated to budget travel, respond by stating that you do not know.'
  }
];

chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const prompt = userInput.value.trim();
  if (!prompt) {
    responseContainer.textContent = 'Please enter a question to ask WanderBot.';
    return;
  }

  messages.push({ role: 'user', content: prompt });
  responseContainer.textContent = 'Thinking...';
  userInput.value = '';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages
    })
  }).catch((error) => {
    console.error(error);
    responseContainer.textContent = 'Unable to reach the chat service. Please try again.';
    return null;
  });

  if (!response) {
    return;
  }

  if (!response.ok) {
    responseContainer.textContent = 'The chat service returned an error. Please try again.';
    return;
  }

  const result = await response.json();
  const message = result.choices?.[0]?.message?.content || 'No response received.';

  messages.push({ role: 'assistant', content: message });
  responseContainer.textContent = message;
});