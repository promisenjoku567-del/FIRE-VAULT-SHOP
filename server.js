const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.static("public"));

let orders = [];

// Create order
app.post("/create-order", (req, res) => {
    const { playerId, packageName, price } = req.body;

    if (!playerId) {
        return res.json({ success: false, message: "Enter Player ID" });
    }

    const order = {
        id: Date.now(),
        playerId,
        packageName,
        price,
        status: "pending"
    };

    orders.push(order);
    res.json({ success: true, order });
});

// Simulate payment success
app.post("/pay", (req, res) => {
    const { orderId } = req.body;

    let order = orders.find(o => o.id == orderId);

    if (order) {
        order.status = "paid";
        return res.json({ success: true });
    }

    res.json({ success: false });
});

// Admin login
app.post("/admin/login", (req, res) => {
    if (req.body.password === "1234") {
        return res.json({ success: true });
    }
    res.json({ success: false });
});

// Orders
app.get("/admin/orders", (req, res) => {
    res.json(orders);
});

// Stats
app.get("/admin/stats", (req, res) => {
    let revenue = 0;
    let paid = 0;

    orders.forEach(o => {
        if (o.status === "paid") {
            revenue += Number(o.price);
            paid++;
        }
    });

    res.json({
        totalRevenue: revenue,
        totalOrders: orders.length,
        paidOrders: paid
    });
});

// Pages
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "public/admin.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Running on port " + PORT);
});
require("dotenv").config();
const axios = require("axios");
app.post("/paystack/init", async (req, res) => {
    const { email, amount, orderId } = req.body;

    try {
        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email,
                amount: amount * 100, // convert to kobo
                metadata: { orderId }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json(response.data);
    } catch (err) {
        res.json({ error: err.message });
    }
});
app.get("/paystack/verify/:ref", async (req, res) => {
    const ref = req.params.ref;

    try {
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${ref}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
                }
            }
        );

        const data = response.data.data;

        if (data.status === "success") {
            let order = orders.find(o => o.id == data.metadata.orderId);
            if (order) order.status = "paid";
        }

        res.json(response.data);
    } catch (err) {
        res.json({ error: err.message });
    }
});