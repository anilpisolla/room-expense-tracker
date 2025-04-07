// Import Firebase
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, push, onValue } from "firebase/database";

// Firebase configuration (Keep your API Key safe)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "room-expensetracker-dsnr.firebaseapp.com",
  databaseURL: "https://room-expensetracker-dsnr-default-rtdb.firebaseio.com",
  projectId: "room-expensetracker-dsnr",
  storageBucket: "room-expensetracker-dsnr.appspot.com",
  messagingSenderId: "1029815670820",
  appId: "1:1029815670820:web:5e2a91d7bdf4b0305960b1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Get HTML Elements
const expenseNameInput = document.getElementById("expense-name");
const expenseAmountInput = document.getElementById("expense-amount");
const addExpenseButton = document.getElementById("add-expense");
const expensesList = document.getElementById("expenses-list");
const totalCollectedText = document.getElementById("total-collected");
const remainingBalanceText = document.getElementById("remaining-balance");

// Load Initial Data from Firebase
function loadInitialData() {
    get(ref(db, "/")).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            totalCollectedText.innerText = `Total Collected: ₹${data.totalCollected}`;
            remainingBalanceText.innerText = `Remaining Balance: ₹${data.remainingBalance}`;
            displayExpenses(data.expenses || []);
        } else {
            console.log("No data found");
        }
    });
}

// Display Expenses List
function displayExpenses(expenses) {
    expensesList.innerHTML = "";
    expenses.forEach(expense => {
        const li = document.createElement("li");
        li.innerText = `${expense.name}: ₹${expense.amount}`;
        expensesList.appendChild(li);
    });
}

// Add New Expense
addExpenseButton.addEventListener("click", () => {
    const name = expenseNameInput.value.trim();
    const amount = parseInt(expenseAmountInput.value);

    if (name === "" || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid expense name and amount.");
        return;
    }

    get(ref(db, "/")).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const newBalance = data.remainingBalance - amount;

            if (newBalance < 0) {
                alert("Not enough balance! Collect money from roommates.");
                return;
            }

            // Add expense to Firebase
            const newExpenseRef = push(ref(db, "/expenses"));
            set(newExpenseRef, { name, amount });

            // Update Firebase balance
            set(ref(db, "/totalSpent"), data.totalSpent + amount);
            set(ref(db, "/remainingBalance"), newBalance);

            // Refresh UI
            loadInitialData();
            expenseNameInput.value = "";
            expenseAmountInput.value = "";
        }
    });
});

// Real-time Updates
onValue(ref(db, "/"), (snapshot) => {
    if (snapshot.exists()) {
        const data = snapshot.val();
        totalCollectedText.innerText = `Total Collected: ₹${data.totalCollected}`;
        remainingBalanceText.innerText = `Remaining Balance: ₹${data.remainingBalance}`;
        displayExpenses(data.expenses || []);
    }
});

// Load data on page load
loadInitialData();
