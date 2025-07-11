const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());

app.use(express.json());
app.use(cors({
  origin: 'https://my-excalidraw-app.vercel.app'
}));

const clients = new Set();

app.get('/events', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  clients.add(res);

  req.on('close', () => {
    clients.delete(res);
  });
});

app.post('/send-elements', (req, res) => {
  const elements = req.body.elements || [];
  console.log('Received elements:', elements);
  clients.forEach(client => {
    client.write(`data: ${JSON.stringify(elements)}\n\n`);
  });
  res.status(200).send({ message: 'Elements received successfully' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
