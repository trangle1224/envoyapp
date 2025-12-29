const express = require('express');
const { middleware, errorMiddleware } = require('@envoy/envoy-integrations-sdk');

const app = express();
app.use(middleware());

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