////////////////////////////////////////////////////
// FIREBASE CONFIG
////////////////////////////////////////////////////

const firebaseConfig = {
  apiKey: "AIzaSyDnwV4nIVyl1roL2jtgc1_YLcvyYCGKj2Y",
  authDomain: "fire-vault-22555.firebaseapp.com",
  databaseURL: "https://fire-vault-22555-default-rtdb.firebaseio.com",
  projectId: "fire-vault-22555",
  storageBucket: "fire-vault-22555.firebasestorage.app",
  messagingSenderId: "589168743870",
  appId: "1:589168743870:web:38210ca30165a196d515ef"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

////////////////////////////////////////////////////
// EMAILJS
////////////////////////////////////////////////////

emailjs.init("VDr9l4ponPdlPMFLS");

////////////////////////////////////////////////////
// PAYSTACK PAYMENT
////////////////////////////////////////////////////

function payWithPaystack(amount, packageName) {

  let uid = document.getElementById("uid").value;

  if (!uid) {
    alert("Please enter your UID");
    return;
  }

  let handler = PaystackPop.setup({
    key: "pk_test_3759303d3db8720fd0eb95b29004450980f0a4db",
    email: "test@gmail.com",
    amount: amount * 100,
    currency: "NGN",

    callback: function(response) {

      alert("Payment successful: " + response.reference);

      // SAVE TO FIREBASE
      firebase.database().ref("orders").push({
        uid: uid,
        package: packageName,
        reference: response.reference,
        status: "paid"
      });

      let message = `Fire Vault Order:
UID: ${uid}
Package: ${packageName}
Ref: ${response.reference}`;

      window.location.href =
        "https://wa.me/2349011567827?text=" +
        encodeURIComponent(message);
    }
  });

  handler.openIframe();
}
