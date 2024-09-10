// fetchExpenses.js
fetch('/api/expenses')
  .then(response => response.json())
  .then(data => {
    console.log(data); // Check if the data is correct
    // Handle data display here
  })
  .catch(error => console.error('Error fetching data:', error));