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

  let whatsappLink = `https://wa.me/234XXXXXXXXXX?text=${encodeURIComponent(message)}`;

  document.body.innerHTML = `
    <div style="color:white; text-align:center; padding:50px;">
      <h1>✅ Payment Successful!</h1>
      <p>Redirecting you to WhatsApp...</p>
    </div>
  `;

  setTimeout(() => {
    window.location.href = whatsappLink;
  }, 3000);
}
  });

  handler.openIframe();
    }
