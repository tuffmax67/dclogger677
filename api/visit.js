
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    const {
        consent,
        username,
        country
    } = req.body || {};

    if (consent !== true) {
        return res.status(400).json({
            error: "Consent required"
        });
    }

    const webhook = process.env.DISCORD_WEBHOOK;

    if (!webhook) {
        return res.status(500).json({
            error: "Webhook not configured"
        });
    }

    const message = {
        content:
            "New consenting visitor!\n" +
            "Username: " + (username || "Not provided") +
            "\nCountry: " + (country || "Not provided")
    };

    try {
        const response = await fetch(webhook, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(message)
        });

        if (!response.ok) {
            throw new Error("Discord request failed");
        }

        return res.status(200).json({
            success: true
        });

    } catch (error) {
        console.error(error);

        return res.status(502).json({
            error: "Notification failed"
        });
    }
}
