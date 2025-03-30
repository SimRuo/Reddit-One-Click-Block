import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 8080;

const CLIENT_ID = "5miTeKy7uOOMH1ut8CjXAQ";
const CLIENT_SECRET = ""; // Make sure to add your actual secret here
const REDIRECT_URI = "http://localhost:8080/callback"; // ✅ Correct endpoint

app.use(cors());

// Root endpoint (for debugging)
app.get("/", (req, res) => {
    res.send("Reddit OAuth server running.");
});

// Handle Reddit OAuth callback
app.get("/callback", async (req, res) => {
    const code = req.query.code;
    if (!code) {
        console.error("No code received in query params.");
        return res.status(400).send("Error: No code provided");
    }

    console.log("Received OAuth code:", code);

    try {
        const tokenResponse = await fetch("https://www.reddit.com/api/v1/access_token", {
            method: "POST",
            headers: {
                "Authorization": "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: REDIRECT_URI
            })
        });

        const tokenData = await tokenResponse.json();
        console.log("Token Data Received:", tokenData);

        if (tokenData.error) {
            console.error("Error from Reddit API:", tokenData.error);
            return res.status(400).send(`Error: ${tokenData.error}`);
        }

        res.send(`Access Token: ${tokenData.access_token}`);
    } catch (error) {
        console.error("Error fetching token:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
