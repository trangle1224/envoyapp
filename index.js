require('dotenv').config();
const express = require('express');
const { middleware, errorMiddleware } = require('@envoy/envoy-integrations-sdk');


const app = express();
app.use(middleware());
app.use(express.json());

console.log("Beginning NOW")

app.post('/visitor-sign-out', async (req, res) => {
  try {
    if (!req.envoy) {
      console.error('req.envoy is missing');
      return res.status(500).json({ error: 'Missing envoy context' });
    }

    const { event, installation, body } = req.envoy;

    console.log('req.envoy object:', req.envoy);
    console.log('event:', event);
    console.log('event.attach:', event?.attach);
    console.log('req.envoy.attach:', req.envoy?.attach);

    if (!body.meta || body.meta.event !== 'entry_sign_out') {
      return res.sendStatus(200);
    }

    const attributes = body.payload.attributes;
    const visit = {
      started_at: attributes['signed-in-at'],
      signed_out_at: attributes['signed-out-at'],
    };

    const maxMinutes = body.meta.config.Minutes;

    if (typeof maxMinutes !== 'number') {
      console.error('max_minutes setting missing or invalid:', maxMinutes);
      return res.status(500).json({ error: 'Invalid max_minutes setting' });
    }

    const start = new Date(visit.started_at);
    const end = new Date(visit.signed_out_at);
    const durationMinutes = (end - start) / 60000;

    const message =
      durationMinutes > maxMinutes
        ? "User stayed past their allotted time."
        : "User was great.";

    console.log({ durationMinutes, maxMinutes, message });

    if (event && typeof event.attach === 'function') {
      await event.attach({ label: 'Sign Out:', value: message });
    } else if (typeof req.envoy.attach === 'function') {
      await req.envoy.attach({ label: 'Sign Out:', value: message });
    } else {
      console.error('No attach method available on event or req.envoy');
      return res.status(500).json({ error: 'Attach method not found' });
    }

    res.send({ message });
    
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
    console.log(`Envoy app running on port ${process.env.PORT}`);
  });



