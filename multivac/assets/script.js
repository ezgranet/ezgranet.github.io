const apiKey = ${{OPENAI_API_KEY}};

async function sendMessageToOpenAI(message) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',  // or 'gpt-4' if you have access
            messages: [{ role: 'user', content: message }]
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}

document.getElementById('chat-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const inputMessage = document.getElementById('chat-input').value;
    
    if (!inputMessage) return;
    
    // Append user message to chat
    addMessageToChat('User', inputMessage);
    
    // Send message to OpenAI and append the response
    const aiResponse = await sendMessageToOpenAI(inputMessage);
    addMessageToChat('AI', aiResponse);
    
    // Clear the input field
    document.getElementById('chat-input').value = '';
});

// Helper function to add messages to the chat display
function addMessageToChat(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    messageElement.classList.add(sender.toLowerCase());
    messageElement.textContent = `${sender}: ${message}`;
    chatBox.appendChild(messageElement);
}


// JavaScript for Ask Multivac
window.onload = () => {
  const outputTape = document.getElementById('output-tape');
  // Start the animation when the page loads
  outputTape.style.animation = 'slideIn 2s forwards';
};

document.querySelector('#chat-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const userInput = document.querySelector('#user-input').value.trim();
  const chatWindow = document.querySelector('#output-tape');

  // Clear previous output
  chatWindow.textContent = '';

  // Custom response logic for entropy questions
  if (/can (entropy|disorder|thermodynamics).*?(be|ever be)? (reversed|reversible|stopped|halted|turned back|prevented|undone)\??/i.test(userInput)) {
    typePunchCardEffect(chatWindow, 'THERE IS YET INSUFFICIENT DATA TO ANSWER', 1000);
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
    typePunchCardEffect(chatWindow, data.reply, 1000);
  } catch (error) {
    console.error('Error:', error);
    typePunchCardEffect(chatWindow, 'Error: Unable to connect to Multivac.', 1000);
  }
});
async function typePunchCardEffect(container, text, speed = 1000, maxCharsPerLine = 30) {
  const typingSound = document.getElementById('typing-sound');
  const carriageSound = new Audio('assets/carriage.mp3'); // Load the carriage return sound
  const returnSound = new Audio('assets/return.mp3'); // Load the carriage return sound

  // Play the typing sound continuously
  typingSound.loop = true;
  typingSound.currentTime = 0;
  typingSound.play();

  // Create the initial printer and tape
  let currentPrinter = createNewPrinter(container);
  let currentTape = createNewTape(currentPrinter);

  // Adjust tape position as characters are added
  let offset = 0;

  // Loop through each character in the text
  for (let i = 0; i < text.length; i++) {
    // Check if the current line has reached the maximum characters
    if (i > 0 && i % maxCharsPerLine === 0) {
      // Play the carriage return sound
      typingSound.pause();
      carriageSound.play();
      await pause(1000); // Pause for the carriage return effect
      typingSound.play();

      // Create a new printer and tape for the next line
      currentPrinter = createNewPrinter(container);
      currentTape = createNewTape(currentPrinter);
      offset = 0; // Reset the offset for the new tape
    }

    // Add the character to the current tape
    const charSpan = document.createElement('span');
    charSpan.textContent = text.charAt(i);
    currentTape.appendChild(charSpan);

    // Shift the tape content to simulate leftward movement
    offset -= 20; // Move left by 20px per character
    currentTape.style.transform = `translateX(${offset}px)`;

    await pause(speed); // Pause before adding the next character
  }

  // Stop the typing sound
  typingSound.loop = false;
  typingSound.pause();
  returnSound.play()
}

function createNewPrinter(container) {
  const printer = document.createElement('div');
  printer.classList.add('printer');
  container.appendChild(printer);
  return printer;
}

function createNewTape(printer) {
  const tape = document.createElement('div');
  tape.classList.add('tape-line');
  printer.appendChild(tape);
  return tape;
}

function pause(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}
