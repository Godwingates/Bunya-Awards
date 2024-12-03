import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set, update, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    databaseURL: "your-database-url",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
    const timerElement = document.getElementById("timer");
    const voteButtons = document.querySelectorAll(".vote-btn");
    const contestantCards = document.querySelectorAll(".contestant-card");
    const totalVotesElement = document.getElementById("total-votes");
    const voteEndDate = new Date("2024-12-16T00:00:00");
    const votesRef = ref(database, "votes");
    let totalVotes = 0;

    // Timer countdown logic
    function updateTimer() {
        const now = new Date();
        const timeRemaining = voteEndDate - now;

        if (timeRemaining > 0) {
            const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000)) / 1000);

            timerElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else {
            timerElement.textContent = "Voting has ended.";
            voteButtons.forEach(button => button.disabled = true);
        }
    }
    setInterval(updateTimer, 1000);

    // Initialize votes from Firebase
    onValue(votesRef, (snapshot) => {
        const votes = snapshot.val() || {};
        totalVotes = 0;

        contestantCards.forEach(card => {
            const name = card.getAttribute("data-name");
            const voteCountElement = card.querySelector(".vote-count");
            const voteCount = votes[name] || 0;

            card.setAttribute("data-votes", voteCount);
            voteCountElement.textContent = voteCount;
            totalVotes += voteCount;
        });

        totalVotesElement.textContent = totalVotes;
    });

    // Voting logic
    voteButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const card = event.target.closest(".contestant-card");
            const name = card.getAttribute("data-name");

            // Prevent double voting
            if (sessionStorage.getItem(`voted-${name}`)) {
                alert("You have already voted for this contestant!");
                return;
            }

            // Confirm the vote
            const confirmation = confirm(`Are you sure you want to vote for ${name}?`);
            if (!confirmation) return;

            const currentVotes = parseInt(card.getAttribute("data-votes")) || 0;
            const newVotes = currentVotes + 1;

            // Update Firebase
            update(votesRef, { [name]: newVotes });

            // Mark as voted
            sessionStorage.setItem(`voted-${name}`, "true");

            alert(`Thank you for voting for ${name}!`);
        });
    });
});