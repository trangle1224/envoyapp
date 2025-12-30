require('dotenv').config();
const express = require('express');
const { middleware, errorMiddleware } = require('@envoy/envoy-integrations-sdk');

const app = express();
app.use(middleware());
app.use(express.json());

console.log("Beginning NOW")

app.post('/visitor-sign-out', async (req, res) => {
  try {
    const envoy = req.envoy;
    console.log(envoy)

    const job = envoy.job;
    const meta = envoy.meta;

    const visitor = envoy.payload;
    const attributes = visitor.attributes;

    const startedAt = attributes['signed-in-at'];
    const signedOutAt = attributes['signed-out-at'];

    const maxMinutes = meta.config.Minutes;
    if (typeof maxMinutes !== 'number') {
      console.error('Invalid maxMinutes config:', maxMinutes);
      return res.status(500).json({ error: 'Invalid maxMinutes setting' });
    }

    const start = new Date(startedAt);
    const end = new Date(signedOutAt);
    const durationMinutes = (end - start) / 60000;
    console.log(durationMinutes)

    const message = durationMinutes > maxMinutes
      ? "User stayed past their allotted time."
      : "User left on time.";

    console.log({ durationMinutes, maxMinutes, message });

    await job.attach({ label: 'Sign Out:', value: message });

    res.send({ message });

  } catch (err) {
    console.error('Handler error:', err);
    res.sendStatus(500);
  }
});

  app.use(errorMiddleware());
  
  app.listen(process.env.PORT, () => {
    console.log(`Envoy app running on port ${process.env.PORT}`);
  });



