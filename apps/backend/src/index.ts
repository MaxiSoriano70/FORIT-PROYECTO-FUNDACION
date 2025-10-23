import 'dotenv/config';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (_req, res) => {
    res.send('Hello, World!');
})

app.listen(PORT, () => {
    console.log(`Server ready on http://localhost:${PORT}`);
});
