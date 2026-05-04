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
// PAYSTACK
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

      const orderData = {
        uid: uid,
        package: packageName,
        reference: response.reference,
        status: "paid",
        time: new Date().toLocaleString()
      };

      db.ref("orders").push(orderData)
      .then(() => {

        emailjs.send(
          "service_zjapyfh",
          "template_478nbiy",
          orderData
        );

        alert("Payment successful and order saved!");

        let message = `🔥 FIRE VAULT ORDER

UID: ${uid}
Package: ${packageName}
Reference: ${response.reference}
Status: PAID`;

        window.location.href =
          "https://wa.me/2349011567827?text=" +
          encodeURIComponent(message);

      })
      .catch((error) => {
        alert("Firebase save failed: " + error.message);
        console.log(error);
      });
    },

    onClose: function() {
      alert("Payment cancelled");
    }
  });

  handler.openIframe();
}
