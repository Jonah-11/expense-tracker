document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const expenseForm = document.getElementById('expenseForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const expenseList = document.getElementById('expenseList')?.getElementsByTagName('tbody')[0];
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
                    window.location.href = './login.html';
                } else {
                    const data = await res.json();
                    alert(`Error: ${data.error || data.message}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during registration.');
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
                    body: JSON.stringify({ email, password })
                });

                if (res.ok) {
                    const data = await res.json();
                    localStorage.setItem('token', data.token); // Store JWT token in localStorage
                    window.location.href = './dashboard.html';
                } else {
                    const data = await res.json();
                    alert(`Error: ${data.error || data.message}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during login.');
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
                const token = localStorage.getItem('token'); // Retrieve JWT token from localStorage

                const res = await fetch(`${apiUrl}/expenses`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Include JWT token in headers
                    },
                    body: JSON.stringify({ title, amount, date })
                });

                if (res.ok) {
                    alert('Expense added successfully');
                    loadExpenses();
                    expenseForm.reset();
                } else {
                    const data = await res.json();
                    alert(`Error: ${data.error || data.message}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while adding the expense.');
            }
        });
    }

    // Load Expenses
    async function loadExpenses() {
        try {
            const token = localStorage.getItem('token'); // Retrieve JWT token from localStorage

            const res = await fetch(`${apiUrl}/expenses`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}` // Include JWT token in headers
                }
            });

            if (res.ok) {
                const expenses = await res.json();
                if (expenseList) {
                    expenseList.innerHTML = ''; // Clear existing rows
                    expenses.forEach(expense => {
                        const formattedDate = new Date(expense.date).toLocaleDateString('en-GB');
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${expense.title}</td>
                            <td>KSh ${expense.amount.toFixed(2)}</td>
                            <td>${formattedDate}</td>
                        `;
                        expenseList.appendChild(row);
                    });
                }
            } else {
                const data = await res.json();
                alert(`Error: ${data.error || data.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching expenses.');
        }
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await fetch(`${apiUrl}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Include JWT token in headers
                    }
                });
                localStorage.removeItem('token'); // Remove JWT token from localStorage
                window.location.href = './login.html';
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during logout.');
            }
        });
    }

    // Load expenses on dashboard load
    if (window.location.pathname.includes('dashboard.html')) {
        loadExpenses();
    }
});
