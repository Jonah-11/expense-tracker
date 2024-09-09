document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const expenseForm = document.getElementById('expenseForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const expenseList = document.getElementById('expenseList')?.getElementsByTagName('tbody')[0]; // Access tbody if it exists
    const apiUrl = 'https://expense-tracker-production-557f.up.railway.app/api';

    // Register User
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch(`${apiUrl}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password })
                });

                if (res.ok) {
                    alert('Registration successful. Please log in.');
                    window.location.href = './login.html'; // Ensure path is correct
                } else {
                    const data = await res.json();
                    alert(`Error: ${data.message}`);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    // Login User
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch(`${apiUrl}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password }),
                    credentials: 'include' // Include cookies for session handling
                });

                if (res.ok) {
                    window.location.href = './dashboard.html'; // Ensure path is correct
                } else {
                    const data = await res.json();
                    alert(`Error: ${data.message}`);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    // Add Expense
    if (expenseForm) {
        expenseForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const title = document.getElementById('title').value;
            const amount = document.getElementById('amount').value;
            const date = document.getElementById('date').value;

            try {
                const res = await fetch(`${apiUrl}/expenses`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title, amount, date }),
                    credentials: 'include' // Include cookies for session handling
                });

                if (res.ok) {
                    alert('Expense added successfully');
                    loadExpenses();
                    expenseForm.reset();
                } else {
                    const data = await res.json();
                    alert(`Error: ${data.message}`);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    // Load Expenses
    async function loadExpenses() {
        try {
            const res = await fetch(`${apiUrl}/expenses`, {
                method: 'GET',
                credentials: 'include' // Include cookies for session handling
            });

            if (res.ok) {
                const expenses = await res.json();
                if (expenseList) {
                    expenseList.innerHTML = '';
                    expenses.forEach(expense => {
                        const formattedDate = new Date(expense.date).toLocaleDateString('en-GB'); // Format date as dd/mm/yyyy
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${expense.title}</td>
                            <td>KSh ${expense.amount}</td>
                            <td>${formattedDate}</td>
                        `;
                        expenseList.appendChild(row);
                    });
                }
            } else {
                const data = await res.json();
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            fetch(`${apiUrl}/auth/logout`, {
                method: 'POST',
                credentials: 'include' // Include cookies for session handling
            }).then(() => {
                window.location.href = './login.html'; // Ensure path is correct
            }).catch(error => {
                console.error('Error:', error);
            });
        });
    }

    // Load expenses on dashboard load
    if (window.location.pathname.includes('dashboard.html')) {
        loadExpenses();
    }
});
