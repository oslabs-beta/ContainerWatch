import express from 'express';

const app = express();

app.get('/hello', (req, res) => {
  console.log('ouch', Date.now());
  res.send('hello world from the server');
});

export default app;
