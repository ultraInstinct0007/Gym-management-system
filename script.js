import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {
  getFirestore, collection, doc,
  getDoc, setDoc,
  onSnapshot, addDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

//
//  Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBv8bTwBRO0F71EseB_UzzM_uPPls5by2A",
  authDomain: "gym-2751e.firebaseapp.com",
  projectId: "gym-2751e",
  storageBucket: "gym-2751e.appspot.com",
  messagingSenderId: "85520312094",
  appId: "1:85520312094:web:3043af4d40c653bdb2cb0f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sidebar setup
const navDashboard = document.getElementById("navDashboard");
const navNotify    = document.getElementById("navNotify");
const dashboardSection = document.getElementById("dashboardSection");
const membersSection   = document.getElementById("membersSection");
const notifySection    = document.getElementById("notifySection");

navDashboard.addEventListener("click", () => switchTo('dash'));
navNotify.addEventListener("click", () => switchTo('notify'));

function switchTo(section) {
  navDashboard.classList.toggle("active", section === 'dash');
  navNotify.classList.toggle("active", section === 'notify');
  dashboardSection.style.display = section === 'dash' ? 'block' : 'none';
  membersSection.style.display   = section === 'dash' ? 'block' : 'none';
  notifySection.style.display    = section === 'notify' ? 'block' : 'none';
}

//  Auth state listener to save user in Firestore
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Admin not logged in");
    window.location.href = "login.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      name: user.displayName || user.email.split("@")[0],
      membership: "Basic",
      status: "Active",
      createdAt: new Date()
    });
    console.log("✅ New user saved to Firestore:", user.uid);
  }

  // You can optionally update some UI here with admin info
});

//  Members list and stats
const memberTable = document.getElementById("memberTable");
const totalMembersDiv = document.getElementById("totalMembers");
const activeMembersDiv = document.getElementById("activeMembers");

onSnapshot(collection(db, "users"), snap => {
  memberTable.innerHTML = "";
  let total = 0, active = 0;

  snap.forEach(doc => {
    const d = doc.data();
    total++;
    if (d.status === "Active") active++;

    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${d.name}</td><td>${d.status}</td><td>${d.membership}</td>`;
    memberTable.appendChild(tr);
  });

  totalMembersDiv.textContent = `Total Members: ${total}`;
  activeMembersDiv.textContent = `Active: ${active}`;
});

// ▶️ Notify users
document.getElementById("sendNotify").onclick = async () => {
  const msg = document.getElementById("notifyText").value.trim();
  if (!msg) return alert("Type a message first");

  try {
    const docRef = await addDoc(collection(db, "notifications"), {
      message: msg,
      timestamp: new Date()
    });
    console.log("✅ Notification sent with ID:", docRef.id);
    alert("Notification sent!");
    document.getElementById("notifyText").value = "";
  } catch (err) {
    console.error("❌ Error sending notification:", err);
    alert("Failed to send notification: " + err.message);
  }
};
