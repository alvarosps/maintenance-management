const express = require('express');
const path = require('path');

const app = express();
const { PORT = 3000, LOCAL_ADDRESS = '0.0.0.0' } = process.env;
console.log('PORT', PORT);
console.log('LOCAL_ADDRESS', LOCAL_ADDRESS);
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, LOCAL_ADDRESS, () => {
  console.log(`Server is listening on port ${PORT}`);
});
