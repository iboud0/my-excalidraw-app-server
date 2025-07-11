const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://my-excalidraw-app.vercel.app'], 
  methods: ['GET', 'POST'],
  credentials: false
}));

app.use(express.json());

const clients = new Set();

app.get('/events', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.flushHeaders(); 

  clients.add(res);
  console.log('Client connected. Total clients:', clients.size); 

  req.on('close', () => {
    clients.delete(res);
    console.log('Client disconnected. Total clients:', clients.size); 
  });
});

app.post('/send-elements', (req, res) => {
  const elements = req.body.elements || [];
  console.log('Received elements:', elements);
  
  console.log(`Broadcasting to ${clients.size} client(s)`);
  clients.forEach(client => {
    client.write(`data: ${JSON.stringify(elements)}\n\n`);
  });

  res.status(200).send({ message: 'Elements received and broadcasted successfully' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
