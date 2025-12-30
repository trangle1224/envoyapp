require('dotenv').config();
const express = require('express');
const { middleware, errorMiddleware } = require('@envoy/envoy-integrations-sdk');

const app = express();
app.use(middleware());
app.use(errorMiddleware());

app.post('/webhooks', async (req, res) => {
    const { event, installation } = req.envoy;
  
    if (event.type !== 'visitor.sign_out') {
      return res.sendStatus(200);
    }
  
    const visit = event.data.visit;
    const maxMinutes = installation.settings.max_minutes;
  
    const start = new Date(visit.started_at);
    const end = new Date(visit.signed_out_at);
    const durationMinutes = (end - start) / 60000;
  
    const overstayed = durationMinutes > maxMinutes;
  
    const message = overstayed
      ? `⚠️ Visitor overstayed by ${Math.round(durationMinutes - maxMinutes)} minutes.`
      : `✅ Visitor stayed within the allowed ${maxMinutes} minutes.`;
  
    await installation.api.visits.addMessage(visit.id, {
      message
    });
  
    res.sendStatus(200);
  });
  
  /**
   * SDK error handling
   */
  app.use(errorMiddleware());
  
  app.listen(3000, () => {
    console.log('Envoy app running on port 3000');
  });



  
app.post('/hello-options', (req, res) => {
    res.send([
      {
        label: 'Hello',
        value: 'Hello',
      },
      {
        label: 'Hola',
        value: 'Hola',
      },
      {
        label: 'Aloha',
        value: 'Aloha',
      },
    ]);
  });