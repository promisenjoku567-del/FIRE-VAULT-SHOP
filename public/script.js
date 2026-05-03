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
  let phone = document.getElementById("phone").value;

  if (!uid || !phone) {
    alert("Please enter UID and WhatsApp number");
    return;
  }

  document.getElementById("summaryText").innerText =
    "Loading payment gateway...";

  let handler = PaystackPop.setup({
    key: "pk_test_3759303d3db8720fd0eb95b29004450980f0a4db",
    email: "test@gmail.com",
    amount: amount * 100,
    currency: "NGN",

    callback: function(response) {

      ////////////////////////////////////////////////////
      // SAVE ORDER TO FIREBASE
      ////////////////////////////////////////////////////

      db.ref("orders").push({
        uid: uid,
        package: packageName,
        phone: phone,
        reference: response.reference,
        status: "paid",
        time: new Date().toLocaleString()
      });

      ////////////////////////////////////////////////////
      // SEND EMAIL RECEIPT
      ////////////////////////////////////////////////////

      emailjs.send("service_zjapyfh", "template_478nbiy", {
        uid: uid,
        package: packageName,
        reference: response.reference,
        phone: phone
      });

      ////////////////////////////////////////////////////
      // WHATSAPP RECEIPT
      ////////////////////////////////////////////////////

      let message = `🔥 FIRE VAULT RECEIPT

UID: ${uid}
Package: ${packageName}
Reference: ${response.reference}
Status: PAID

Thank you for your order`;

      ////////////////////////////////////////////////////
      // SUCCESS SCREEN
      ////////////////////////////////////////////////////

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
    },

    onClose: function () {
      document.getElementById("summaryText").innerText =
        "Payment cancelled";
    }
  });

  handler.openIframe();
}

////////////////////////////////////////////////////
// ORDER SUMMARY
////////////////////////////////////////////////////

function updateSummary() {
  let uid = document.getElementById("uid").value;
  let pkg = document.getElementById("package").value;

  document.getElementById("summaryText").innerText =
    `UID: ${uid || "-"} | Package: ${pkg || "-"}`;
}

document.addEventListener("DOMContentLoaded", function () {

  const uidInput = document.getElementById("uid");
  const packageInput = document.getElementById("package");

  if (uidInput) {
    uidInput.addEventListener("input", updateSummary);
  }

  if (packageInput) {
    packageInput.addEventListener("change", updateSummary);
  }
});

////////////////////////////////////////////////////
// POPUP
////////////////////////////////////////////////////

function showPopup(packageName, price) {
  document.getElementById("popup").style.display = "block";
  document.getElementById("popupTitle").innerText = packageName;
  document.getElementById("popupPrice").innerText = price;
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

////////////////////////////////////////////////////
// WHATSAPP MANUAL ORDER
////////////////////////////////////////////////////

function submitOrder() {
  let uid = document.getElementById("uid").value;
  let pkg = document.getElementById("package").value;
  let phone = document.getElementById("phone").value;

  if (!uid || !phone) {
    alert("Please fill all fields");
    return;
  }

  let message = `🔥 Fire Vault Order

UID: ${uid}
Package: ${pkg}
WhatsApp: ${phone}`;

  window.open(
    "https://wa.me/2349011567827?text=" +
    encodeURIComponent(message),
    "_blank"
  );
}
