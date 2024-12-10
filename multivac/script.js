// JavaScript for Ask Multivac
document.querySelector('#chat-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const userInput = document.querySelector('#user-input').value.trim();
  const chatWindow = document.querySelector('#chat-window');

  // Check for specific question
  if (/can entropy be reversed\?/i.test(userInput)) {
    chatWindow.innerHTML += `<div class="bot-message">THERE IS YET INSUFFICIENT DATA TO ANSWER</div>`;
    return; // Do not call the API
  }

  // Send the input to OpenAI API if no custom response matches
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: userInput }),
  });
  const data = await response.json();
  chatWindow.innerHTML += `<div class="bot-message">${data.reply}</div>`;
});
function typeEffect(element, text, speed) {
  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(interval);
    }
  }, speed);
}

const terminalOutput = document.getElementById('output');
typeEffect(terminalOutput, 'Welcome to AskMultivac...', 100);



document.querySelector('#chat-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const userInput = document.querySelector('#user-input').value.trim();
  const chatWindow = document.querySelector('#output-tape');

  // Clear previous output
  chatWindow.textContent = '';

  // Custom response logic for entropy questions
  if (/can (entropy|disorder|thermodynamics).*?(be|ever be)? (reversed|stopped|halted|turned back)\??/i.test(userInput)) {
    typePunchCardEffect(chatWindow, 'THERE IS YET INSUFFICIENT DATA TO ANSWER', 50);
    return; // Skip API call
  }

  // Call the backend API for other questions
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userInput }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch response from the server.');
    }

    const data = await response.json();
    typePunchCardEffect(chatWindow, data.reply, 50);
  } catch (error) {
    console.error('Error:', error);
    typePunchCardEffect(chatWindow, 'Error: Unable to connect to Multivac.', 50);
  }
});

// Function to simulate typewriter/punch card effect
function typePunchCardEffect(container, text, speed = 100) {
  const typingSound = document.getElementById('typing-sound');
  const returnSound = new Audio('assets/return.mp3'); // Load the return sound
  let i = 0;

  const interval = setInterval(() => {
    if (i < text.length) {
      container.textContent += text.charAt(i); // Append the next character
      typingSound.currentTime = 0; // Reset sound
      typingSound.play(); // Play typing sound
      i++;
    } else {

      clearInterval(interval); // Stop when all characters are displayed
      returnSound.play(); // Play return sound at the end
            typingSound.pause(); // Play typing sound


    }
  }, speed);
}