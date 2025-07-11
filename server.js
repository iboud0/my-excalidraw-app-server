const express = require('express');
const app = express();

app.use(express.json());

app.post('/send-elements', (req, res) => {
  const elements = req.body.elements || [];
  console.log('Received elements:', elements);
  res.status(200).send({ message: 'Elements received successfully' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
