function payWithPaystack(amount, packageName) {

  let playerId = document.getElementById("playerId").value;

  if (playerId === "") {
    alert("Please enter your Player ID");
    return;
  }

  let handler = PaystackPop.setup({
    key: 'YOUR_PUBLIC_KEY_HERE',
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

      let message = `Hello, I just paid for ${packageName} Diamonds.
Player ID: ${playerId}
Payment Ref: ${response.reference}`;

      let whatsappLink = `https://wa.me/2349136828076?text=${encodeURIComponent(message)}`;

      // Redirect to WhatsApp
      window.location.href = whatsappLink;
    },

    onClose: function() {
      alert("Transaction cancelled");
    }
  });

  handler.openIframe();
    }
