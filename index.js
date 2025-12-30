require('dotenv').config();
const express = require('express');
const { middleware, errorMiddleware } = require('@envoy/envoy-integrations-sdk');


const app = express();
app.use(middleware());
app.use(express.json());

console.log("Beginning NOW")

app.post('/visitor-sign-out', async (req, res) => {
  try {
    const { event, installation } = req.envoy;
    console.log("Visitor Signed Out");

    if (!event || event.type !== 'visitor.sign_out') {
      return res.sendStatus(200);
    }

    const visit = event.data.visit;

    // 🔍 log settings explicitly
    console.log("Installation settings:", installation.settings);

    const maxMinutes = installation.settings.max_minutes;

    const start = new Date(visit.started_at);
    const end = new Date(visit.signed_out_at);
    const durationMinutes = (end - start) / 60000;

    const message =
      durationMinutes > maxMinutes
        ? "User stayed past their allotted time."
        : "User was great.";

    console.log({ durationMinutes, maxMinutes, message });

    return res.status(200).json({ message });

  } catch (err) {
    console.error("Handler error:", err);
    return res.sendStatus(500);
  }
});

  
  /**
   * SDK error handling
   */
  app.use(errorMiddleware());
  
  app.listen(process.env.PORT, () => {
    console.log('Envoy app running on port env');
  });



