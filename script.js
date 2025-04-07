// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyCBe9jh76fiYtjvRB3UdBX8mTbDmNoVzqQ",
    authDomain: "room-expensetracker-dsnr.firebaseapp.com",
    databaseURL: "https://room-expensetracker-dsnr-default-rtdb.firebaseio.com",
    projectId: "room-expensetracker-dsnr",
    storageBucket: "room-expensetracker-dsnr.firebasestorage.app",
    messagingSenderId: "1029815670820",
    appId: "1:1029815670820:web:5e2a91d7bdf4b0305960b1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Reference to database
const expenseRef = ref(db, "expenses");

// Form Handling
document.getElementById("expense-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const person = document.getElementById("person").value;
    const amount = document.getElementById("amount").value;

    if (person && amount) {
        push(expenseRef, { person, amount });
        document.getElementById("expense-form").reset();
    }
});

// Fetch and Display Data
onValue(expenseRef, (snapshot) => {
    const expenses = snapshot.val();
    const expenseList = document.getElementById("expense-list");
    let total = 0;

    expenseList.innerHTML = "";
    for (let id in expenses) {
        const item = expenses[id];
        total += parseFloat(item.amount);
        expenseList.innerHTML += `<li>${item.person}: ₹${item.amount}</li>`;
    }

    document.getElementById("balance").innerText = `₹${total}`;
});
