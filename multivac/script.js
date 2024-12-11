// JavaScript for Ask Multivac
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
function pause(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function pause(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function typePunchCardEffect(container, text, speed = 1000) {
  const typingSound = document.getElementById('typing-sound');
  const returnSound = new Audio('assets/return.mp3'); // Load the return sound

  // Play the typing sound continuously
  typingSound.loop = true; // Ensure the typing sound keeps playing
  typingSound.currentTime = 0; // Reset sound
  typingSound.play();

  // Set the initial width of the container to 0 to simulate empty tape
  container.style.width = '0%';
  container.style.whiteSpace = 'nowrap'; // Prevent text from wrapping to a new line

  // Loop through each character in the text and wrap in <span>
  for (let i = 0; i < text.length; i++) {
    // Create a span for each character to add perforation
    const charSpan = document.createElement('span');
    charSpan.textContent = text.charAt(i);
    container.appendChild(charSpan); // Append the character to the container

    container.style.width = `${(i + 1) * (100 / text.length)}%`; // Increase width as characters are typed
    await pause(speed); // Pause for the specified duration (1 second here)
  }

  // Once typing is done, stop typing sound and play return sound
  typingSound.loop = false; // Stop looping the typing sound
  typingSound.pause();
  returnSound.play(); // Play return sound at the end
}
