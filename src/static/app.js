document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";
        // mark card with activity name for later DOM updates
        activityCard.dataset.activity = name;

        const spotsLeft = details.max_participants - details.participants.length;

          // Build participants HTML: chips with avatar initials and a delete button
          let participantsHTML = "";
          if (details.participants && details.participants.length) {
            participantsHTML = details.participants
              .map((p) => {
                const initials = (p || "")
                  .split(" ")
                  .map((s) => s[0] || "")
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                // include a delete button with data attributes
                return `<li class="participant"><span class="avatar">${initials}</span><span class="name">${p}</span><button class="delete-btn" data-email="${p}" data-activity="${name}" aria-label="Remove ${p}">✖</button></li>`;
              })
              .join("");
          } else {
            participantsHTML = `<li class="no-participants">No participants yet</li>`;
          }

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> <span class="spots-left">${spotsLeft}</span> spots left</p>
          <p><strong>Participants:</strong></p>
          <ul class="participant-list">
            ${participantsHTML}
          </ul>
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Event delegation for delete buttons (unregister)
  activitiesList.addEventListener("click", async (event) => {
    const btn = event.target.closest(".delete-btn");
    if (!btn) return;

    const email = btn.dataset.email;
    const activity = btn.dataset.activity;

    if (!email || !activity) return;

    // Ask backend to unregister (DELETE)
    try {
      const resp = await fetch(`/activities/${encodeURIComponent(activity)}/unregister?email=${encodeURIComponent(email)}`, {
        method: "DELETE",
      });

      const result = await resp.json().catch(() => ({}));

      if (resp.ok) {
        // remove participant element
        const li = btn.closest("li.participant");
        if (li) li.remove();

        // update spots left
        const card = btn.closest(".activity-card");
        if (card) {
          const spotsSpan = card.querySelector(".spots-left");
          if (spotsSpan) {
            const current = parseInt(spotsSpan.textContent, 10);
            spotsSpan.textContent = isNaN(current) ? "" : (current + 1).toString();
          }

          // if no participants left, show placeholder
          const participantList = card.querySelector(".participant-list");
          if (participantList && participantList.querySelectorAll("li.participant").length === 0) {
            participantList.innerHTML = `<li class="no-participants">No participants yet</li>`;
          }
        }
      } else {
        console.error("Failed to unregister:", result.detail || result.message || resp.statusText);
        // optional: show message to user
      }
    } catch (err) {
      console.error("Error unregistering:", err);
    }
  });

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
            // Update the UI immediately: add participant chip and decrement spots
            const card = activitiesList.querySelector(`.activity-card[data-activity="${activity}"]`);
            if (card) {
              const participantList = card.querySelector('.participant-list');

              // remove placeholder if present
              const placeholder = participantList.querySelector('.no-participants');
              if (placeholder) placeholder.remove();

              // create participant li (match rendering used in fetchActivities)
              const li = document.createElement('li');
              li.className = 'participant';
              const initials = (email || '')
                .split(' ')
                .map((s) => s[0] || '')
                .join('')
                .slice(0, 2)
                .toUpperCase();
              li.innerHTML = `<span class="avatar">${initials}</span><span class="name">${email}</span><button class="delete-btn" data-email="${email}" data-activity="${activity}" aria-label="Remove ${email}">✖</button>`;
              participantList.appendChild(li);

              // decrement spots-left
              const spotsSpan = card.querySelector('.spots-left');
              if (spotsSpan) {
                const current = parseInt(spotsSpan.textContent, 10);
                spotsSpan.textContent = isNaN(current) ? '' : Math.max(0, current - 1).toString();
              }
            }
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
