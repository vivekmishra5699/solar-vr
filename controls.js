/*import { planets } from './main.js';

const dateInput = document.getElementById('dateInput');
const playButton = document.getElementById('playButton');

let intervalId;
let isPlaying = false;

playButton.addEventListener('click', () => {
  if (!isPlaying) {
    // Start rapidly changing the month
    intervalId = setInterval(() => {
      const currentDate = new Date(dateInput.value);
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 2);
      dateInput.value = newDate.toISOString().slice(0, 10);

      // Set planets rotating property to true
      planets.forEach(planet => planet.rotating = true);
    }, 100); // Change the month every 100 milliseconds
    isPlaying = true;
    playButton.textContent = 'Stop';
  } else {
    // Stop changing the month
    clearInterval(intervalId);

    // Set planets rotating property to false
    planets.forEach(planet => planet.rotating = false);
    isPlaying = false;
    playButton.textContent = 'Play';
  }
});

// Set date input value to current date by default
const currentDate = new Date();
dateInput.value = currentDate.toISOString().slice(0, 10);
*/