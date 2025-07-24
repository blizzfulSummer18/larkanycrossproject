const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const FORWARD_URL = process.env.FORWARD_URL || 'https://open-sg.larksuite.com/anycross/trigger/callback/MDU2YjFhM2IzY2Y5MTEzNGRjOTM2YmYxNWFjMTY2NGI1';

app.post('/webhook', async (req, res) => {
  const body = req.body;

  // Challenge check
  if (body?.type === 'url_verification' && body.challenge) {
    return res.status(200).json({ challenge: body.challenge });
  }

  // Forward to custom webhook
  try {
    await axios.post(FORWARD_URL, body);
    res.status(200).send('Forwarded');
  } catch (err) {
    console.error('Forwarding failed:', err.message);
    res.status(500).send('Failed to forward');
  }
});

const PORT = process.env.PORT; //|| 3001;  👈 now defaults to port 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use((req, res) => {
  console.log('404 - Not Found:', req.method, req.url);
  res.status(404).send('Not found');
});
