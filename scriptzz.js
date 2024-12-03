document.addEventListener("DOMContentLoaded", () => {
    const timerElement = document.getElementById("timer");
    const voteButtons = document.querySelectorAll(".vote-btn");
    const contestantCards = document.querySelectorAll(".contestant-card");
    const totalVotesElement = document.getElementById("total-votes");
    const voteEndDate = new Date("2024-12-16T00:00:00");
    let totalVotes = 0;

    // Use the page URL or a unique identifier for this page
    const pageId = window.location.pathname;

    // Simulated "server" to store votes (replace this with a real backend if needed)
    let simulatedServer = {
        "Bitware Prince willz ft Vic tumz": 0,
        "Budget Vic tumz ft torino": 0,
        "Nzikakane Doro weiyz ft prince willz": 0,
        "Wandeka tall man ft prince willz": 0,
    };

    // Initialize vote counts from localStorage or simulated server 
    contestantCards.forEach(card => {
        const contestantName = card.getAttribute("data-name");
        const storedVotes = parseInt(localStorage.getItem(contestantName) || "0");
        const voteCountElement = card.querySelector(".vote-count");

        // Update votes in the simulated server
        simulatedServer[contestantName] = storedVotes;

        voteCountElement.textContent = storedVotes;
        card.setAttribute("data-votes", storedVotes);
        totalVotes += storedVotes;
    });

    totalVotesElement.textContent = totalVotes;

    // Timer countdown logic
    function updateTimer() {
        const now = new Date();
        const timeRemaining = voteEndDate - now;

        if (timeRemaining > 0) {
            const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

            timerElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else {
            timerElement.textContent = "Voting has ended.";
            voteButtons.forEach(button => button.disabled = true);
        }
    }
    setInterval(updateTimer, 1000);

    // Function to update the total vote counts
    function updateVoteDisplay() {
        totalVotes = 0; // Reset total votes before recounting
        contestantCards.forEach(card => {
            const name = card.getAttribute("data-name");
            const voteCountElement = card.querySelector(".vote-count");
            const votes = simulatedServer[name]; // Get votes from the simulated server
            voteCountElement.textContent = votes;
            totalVotes += votes;
        });
        totalVotesElement.textContent = totalVotes;
    }

    // Voting logic
    voteButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const card = event.target.closest(".contestant-card");
            const contestantName = card.getAttribute("data-name");
            const voteCountElement = card.querySelector(".vote-count");

            // Check if the user has already voted on this page
            if (sessionStorage.getItem(`voted-${pageId}`)) {
                alert("You have already voted for a contestant on this page! You cannot vote again.");
                return;
            }

            // Confirm the vote
            const confirmation = confirm(`Are you sure you want to vote for ${contestantName}?`);
            if (!confirmation) {
                return; // Exit if the user cancels
            }

            const currentVotes = parseInt(simulatedServer[contestantName]);
            const newVotes = currentVotes + 1;

            // Update votes in the simulated server
            simulatedServer[contestantName] = newVotes;

            // Save votes to localStorage (for persistence)
            localStorage.setItem(contestantName, newVotes);

            // Mark this page as voted in sessionStorage
            sessionStorage.setItem(`voted-${pageId}`, "true");

            // Update vote display
            updateVoteDisplay();

            alert(`Thank you for voting for ${contestantName}!`);
        });
    });

    // Initialize the vote display
    updateVoteDisplay();
});
