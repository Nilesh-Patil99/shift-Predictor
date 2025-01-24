
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    });
  }
  
// Function to format date as DD/MM/YYYY
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits for day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two digits for month (months are 0-indexed)
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Set the min date to the current date dynamically when the page loads
document.getElementById('dateInput').min = new Date().toISOString().split('T')[0];


// Function to get the day name from a date
function getDayName(date) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[date.getDay()];
}

// Function to predict shift
function predictShift() {
    const shiftSequenceOption = document.getElementById('shiftSequence').value;
    const currentShift = document.getElementById('currentShift').value;
    const weekOff = parseInt(document.getElementById('weekOff').value);  // Get the index of weekly off (0 for Sunday, 1 for Monday, etc.)
    const selectedDate = new Date(document.getElementById('dateInput').value);
    const today = new Date();

    // Define the shift sequences based on user selection
    const shiftSequence = shiftSequenceOption == '1' 
        ? ['night', 'evening', 'morning'] 
        : ['night', 'morning', 'evening'];

    // Check if the selected date is the weekly off day
    const selectedDay = selectedDate.getDay();
    if (selectedDay === weekOff) {
        document.getElementById('result').innerText = `The selected date is a weekly off day.`;
        return;
    }

    // Calculate the number of days between today and the selected date
    const daysDiff = Math.floor((selectedDate - today) / (1000 * 3600 * 24));

    // Initialize variables
    let shiftIndex = shiftSequence.indexOf(currentShift);
    let currentDayOfWeek = today.getDay();

    // Adjust the shift based on how many weekly offs have occurred between today and the selected date
    let shiftsChanged = 0;
    let currentDate = new Date(today);

    // Iterate through the days, checking each for a weekly off, and calculating the number of shifts
    for (let i = 0; i < Math.abs(daysDiff); i++) {
        currentDate.setDate(currentDate.getDate() + (daysDiff > 0 ? 1 : -1));

        // Check if the current day is the weekly off
        if (currentDate.getDay() === weekOff) {
            shiftsChanged++;
        }
    }

    // Calculate the number of shifts that should have occurred since today
    shiftIndex = (shiftIndex + shiftsChanged) % shiftSequence.length;

    // Determine the shift for the selected date
    let shift = shiftSequence[shiftIndex];

    // Output the predicted shift with the formatted date and day of the week
    const formattedDate = formatDate(selectedDate);
    const dayName = getDayName(selectedDate);
    document.getElementById('result').innerText = `Predicted shift for ${formattedDate} (${dayName}) is: ${shift.charAt(0).toUpperCase() + shift.slice(1)}`;
}
