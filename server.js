const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Contador Simple</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          background-color: #f5f5f5;
        }
        .container {
          text-align: center;
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .title {
          font-size: 24px;
          margin-bottom: 20px;
          color: #333;
        }
        .count {
          font-size: 48px;
          font-weight: bold;
          margin: 20px 0;
          color: #333;
        }
        .buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
        }
        .button {
          background: #007AFF;
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 8px;
          font-size: 24px;
          cursor: pointer;
          min-width: 60px;
        }
        .button:hover {
          background: #0056CC;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1 class="title">Contador Simple</h1>
        <div class="count" id="count">0</div>
        <div class="buttons">
          <button class="button" onclick="decrement()">-</button>
          <button class="button" onclick="increment()">+</button>
        </div>
      </div>

      <script>
        let count = 0;
        const countElement = document.getElementById('count');

        function updateDisplay() {
          countElement.textContent = count;
        }

        function increment() {
          count++;
          updateDisplay();
        }

        function decrement() {
          count--;
          updateDisplay();
        }
      </script>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Servidor funcionando en http://localhost:${port}`);
});