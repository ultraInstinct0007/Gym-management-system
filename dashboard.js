import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBv8bTwBRO0F71EseB_UzzM_uPPls5by2A",
  authDomain: "gym-2751e.firebaseapp.com",
  projectId: "gym-2751e",
  appId: "1:85520312094:web:3043af4d40c653bdb2cb0f",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Fetch and display current user
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("userName").textContent = user.email.split("@")[0];
  } else {
    alert("User not logged in");
    window.location.href = "login.html"; // Redirect to login if not signed in
  }
});

// ✅ Accordion behavior
const accordions = document.getElementsByClassName("accordion");
for (let acc of accordions) {
  acc.addEventListener("click", function () {
    this.classList.toggle("active");
    const panel = this.nextElementSibling;
    panel.style.display = panel.style.display === "block" ? "none" : "block";
  });
}
