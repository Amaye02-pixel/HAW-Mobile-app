/**************************************************
 FIREBASE CONFIG
**************************************************/
const firebaseConfig = {
  apiKey: "AIzaSyBwguVAdW5cZAPQek2RdaiAqm-N0Zl6vJQ",
  authDomain: "hawk-mobile-app.firebaseapp.com",
  projectId: "hawk-mobile-app",
  storageBucket: "hawk-mobile-app.firebasestorage.app",
  messagingSenderId: "642975225461",
  appId: "1:642975225461:web:c607678f9ea5b78373ca3c",
  measurementId: "G-XJ2M0W3LQB"
};

let auth = null;
let db = null;

/**************************************************
 INIT
**************************************************/
document.addEventListener("DOMContentLoaded", () => {
  if (!window.firebase) {
    console.error("Firebase not loaded");
    return;
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  auth = firebase.auth();
  db = firebase.firestore();

  window.auth = auth;
  window.db = db;

  /**************************************************
   AUTH STATE
  **************************************************/
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      document.body.classList.remove("logged-in", "admin");
      showLogin();
      return;
    }

    document.body.classList.add("logged-in");

    const ref = db.collection("users").doc(user.uid);
    const snap = await ref.get();

    if (!snap.exists) {
      await ref.set({
        email: user.email,
        role: "user",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }

    const data = (await ref.get()).data();

    if (data && data.role === "admin") {
      document.body.classList.add("admin");
    } else {
      document.body.classList.remove("admin");
    }

    showApp();
  });
});

/**************************************************
 AUTH FUNCTIONS (GLOBAL)
**************************************************/
window.login = (email, password) => {
  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  auth
    .signInWithEmailAndPassword(email, password)
    .catch(err => alert(err.message));
};

window.signup = (email, password) => {
  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  auth
    .createUserWithEmailAndPassword(email, password)
    .then(res => {
      return db.collection("users").doc(res.user.uid).set({
        email: res.user.email,
        role: "user",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .catch(err => alert(err.message));
};

window.forgotPassword = (email) => {
  if (!email) {
    alert("Enter email first");
    return;
  }

  auth
    .sendPasswordResetEmail(email)
    .then(() => alert("Password reset email sent"))
    .catch(err => alert(err.message));
};

window.googleLogin = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .catch(err => alert(err.message));
};

window.logout = () => {
  auth.signOut();
};

/**************************************************
 IFRAME → PARENT MESSAGE HANDLER
**************************************************/
window.addEventListener("message", (event) => {
  if (!event || !event.data) return;

  const { type, email, password } = event.data;

  if (type === "login") login(email, password);
  if (type === "signup") signup(email, password);
  if (type === "reset") forgotPassword(email);
  if (type === "google") googleLogin();
});

/**************************************************
 MOBILE APP SHELL CONTROL (mobile.html)
**************************************************/
function showLogin() {
  const loginFrame = document.getElementById("login-frame");
  const appRoot = document.getElementById("app");

  if (loginFrame) loginFrame.style.display = "block";
  if (appRoot) appRoot.style.display = "none";
}

function showApp() {
  const loginFrame = document.getElementById("login-frame");
  const appRoot = document.getElementById("app");

  if (loginFrame) loginFrame.style.display = "none";
  if (appRoot) appRoot.style.display = "flex";
}