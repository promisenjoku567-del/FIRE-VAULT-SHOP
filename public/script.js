////////////////////////////////////////////////////
// 🔥 FIREBASE CONFIG
////////////////////////////////////////////////////

const firebaseConfig = {
  apiKey: "AIzaSyDnwV4nIVyl1roL2jtgc1_YLcvyYCGKj2Y",
  authDomain: "fire-vault-22555.firebaseapp.com",
  projectId: "fire-vault-22555",
  storageBucket: "fire-vault-22555.firebasestorage.app",
  messagingSenderId: "589168743870",
  appId: "1:589168743870:web:38210ca30165a196d515ef"
};

firebase.initializeApp(firebaseConfig);

// ✔ USE REALTIME DATABASE (NOT FIRESTORE)
const db = firebase.database();

////////////////////////////////////////////////////
// 💳 PAYSTACK PAYMENT
////////////////////////////////////////////////////

function payWithPaystack(amount, packageName) {

  let uid = document.getElementById("uid").value;
  let phone = document.getElementById("phone").value;

  let message = `🔥 Fire Vault Order:
UID: ${uid}
Package: ${packageName}
Reference: PAYMENT
Status: PAID`;

  let handler = PaystackPop.setup({
    key: "pk_test_3759303d3db8720fd0eb95b29004450980f0a4db",
    email: "test@gmail.com",
    amount: amount * 100,
    currency: "NGN",

    callback: function(response) {

      ////////////////////////////////////////////////////
      // 💾 SAVE TO FIREBASE
      ////////////////////////////////////////////////////

      db.ref("orders").push({
        uid: uid,
        package: packageName,
        phone: phone,
        reference: response.reference,
        status: "paid"
      });

      ////////////////////////////////////////////////////
      // 📧 EMAILJS RECEIPT
      ////////////////////////////////////////////////////

      emailjs.send("service_zjapyfh", "template_478nbiy", {
        uid: uid,
        package: packageName,
        reference: response.reference,
        phone: phone
      });

      ////////////////////////////////////////////////////
      // 📱 SUCCESS SCREEN
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
    }
  });

  handler.openIframe();
}

////////////////////////////////////////////////////
// 📊 SUMMARY UPDATE
////////////////////////////////////////////////////

function updateSummary() {
  let uid = document.getElementById("uid").value;
  let pkg = document.getElementById("package").value;

  document.getElementById("summaryText").innerText =
    `UID: ${uid || "-"} | Package: ${pkg || "-"}`;
}

document.getElementById("uid").addEventListener("input", updateSummary);
document.getElementById("package").addEventListener("change", updateSummary);

////////////////////////////////////////////////////
// 📦 POPUP
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
// 📱 WHATSAPP ORDER (MANUAL OPTION)
////////////////////////////////////////////////////

function submitOrder() {
  let uid = document.getElementById("uid").value;
  let pkg = document.getElementById("package").value;
  let phone = document.getElementById("phone").value;

  let message = `Fire Vault Order:
UID: ${uid}
Package: ${pkg}
Phone: ${phone}`;

  window.open(
    "https://wa.me/2349011567827?text=" + encodeURIComponent(message),
    "_blank"
  );
}
