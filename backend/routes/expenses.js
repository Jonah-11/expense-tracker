const express = require('express');
const { createExpense, getExpenses } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createExpense); 
router.get('/', protect, getExpenses); 

module.exports = router;
file://%20example%20of%20checking%20the%20fetched%20datafetch('/api/expenses')%20%20%20%20.then(response%20=%3E%20response.json())%20%20%20%20.then(data%20=%3E%20%7B%20%20%20%20%20%20%20%20console.log(data);%20//%20Check%20if%20the%20data%20is%20correct%20%20%20%20%20%20%20%20//%20Handle%20data%20display%20here%20%20%20%20%7D)%20%20%20%20.catch(error%20=%3E%20console.error('Error%20fetching%20data:',%20error));