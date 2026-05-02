// 🔥 Firebase config (PASTE YOUR OWN HERE)
const firebaseConfig = {
  apiKey: "AIzaSyDnwV4nIVyl1roL2jtgc1_YLcvyYCGKj2Y",
  authDomain: "fire-vault-22555.firebaseapp.com",
  projectId: "fire-vault-22555",
  storageBucket: "fire-vault-22555.firebasestorage.app",
  messagingSenderId: "589168743870",
  appId: "1:589168743870:web:38210ca30165a196d515ef"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let orders = [];
let total = 0;
let pending = 0;
let revenue = 0;
function payWithPaystack(amount, packageName) {

  let playerId = document.getElementById("playerId").value;

  if (playerId === "") {
    alert("Please enter your Player ID");
    return;
  }

  let handler = PaystackPop.setup({
    key: 'pk_test_3759303d3db8720fd0eb95b29004450980f0a4db',
    email: "customer@email.com",
    amount: amount * 100,
    currency: "NGN",

    metadata: {
      custom_fields: [
        {
          display_name: "Player ID",
          variable_name: "player_id",
          value: playerId
        }
      ]
    },

    callback: function(response) {

      let message = `🔥 FIRE VAULT ORDER
💎 Package: ${packageName}
🆔 Player ID: ${playerId}
💳 Ref: ${response.reference}`;

      db.collection("orders").add({
        playerId: playerId,
        package: packageName,
        reference: response.reference,
        amount: amount,
        status: "Pending",
        time: Date.now()
      });

      document.body.innerHTML = `
        <div style="color:white; text-align:center; padding:50px;">
          <h1>✅ Payment Successful!</h1>
          <p>Redirecting to WhatsApp...</p>
        </div>
      `;

      setTimeout(() => {
        window.location.href =
          "https://wa.me/2349011567827?text=" +
          encodeURIComponent(message);
      }, 3000);

    }
  });

  handler.openIframe();
}
