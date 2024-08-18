document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const expenseForm = document.getElementById('expenseForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const expenseList = document.getElementById('expenseList').getElementsByTagName('tbody')[0]; // Access tbody directly

    // Register User
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch('https://expense-tracker-6e3c.onrender.com/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password })
                });

                if (res.ok) {
                    const data = await res.json();
                    alert('Registration successful. Please log in.');
                    window.location.href = 'login.html';
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
                const res = await fetch('https://expense-tracker-6e3c.onrender.com/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                if (res.ok) {
                    const data = await res.json();
                    localStorage.setItem('token', data.token);
                    window.location.href = 'dashboard.html';
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
            const token = localStorage.getItem('token');

            try {
                const res = await fetch('https://expense-tracker-6e3c.onrender.com/api/expenses', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ title, amount, date })
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
        const token = localStorage.getItem('token');

        try {
            const res = await fetch('https://expense-tracker-6e3c.onrender.com/api/expenses', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const expenses = await res.json();
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
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        });
    }
});
