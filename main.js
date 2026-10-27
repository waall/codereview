
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
    throw new Error('ADMIN_PASSWORD must be configured');
}

let adminPassword = ADMIN_PASSWORD;
const tokens = new Map();

app.get('/admin', (req, res) => {
    const auth = req.headers.authorization || '';

    if (!auth.startsWith('Basic ')) {
        res.set('WWW-Authenticate', 'Basic realm="Admin"');
        return res.status(401).send('Authentication required');
    }

    let credentials;
    try {
        credentials = Buffer.from(auth.slice(6), 'base64').toString();
    } catch {
        return res.status(401).send('Invalid credentials');
    }

    const separator = credentials.indexOf(':');
    const username = credentials.slice(0, separator);
    const password = credentials.slice(separator + 1);

    if (separator < 0 || username !== 'admin' ||
        password !== adminPassword) {
        return res.status(401).send('Invalid credentials');
    }

    res.send('FL4G');
});

app.post('/reset-password', async (req, res) => {
    const { email } = req.body;

    if (email !== 'admin@example.com') {
        return res.status(200).send('If the account exists, a reset link was sent.');
    }

    const token = crypto.randomBytes(24).toString('hex');
    tokens.set(token, Date.now() + 10 * 60 * 1000);

    // Intentionally vulnerable: Host controls the generated URL.
    const resetLink =
        `http://${req.headers.host}/reset-password?token=${token}`;

    console.log(`[MOCK EMAIL] To: ${email}`);
    console.log(`[MOCK EMAIL] Reset link: ${resetLink}`);

    // Simulate the user clicking the reset link.
    try {
        const response = await fetch(resetLink, {
            signal: AbortSignal.timeout(5000),
            redirect: 'manual'
        });

        console.log(`[SIMULATED CLICK] HTTP ${response.status}`);
        await response.body?.cancel();
    } catch (err) {
        console.error(`[SIMULATED CLICK] ${err.message}`);
    }

    res.send('Reset flow simulated.');
});

app.post('/reset-password/complete', (req, res) => {
    const { token, password } = req.body;
    const expiresAt = tokens.get(token);

    if (!expiresAt || expiresAt < Date.now()) {
        return res.status(400).send('Invalid or expired token');
    }

    if (typeof password !== 'string' || password.length < 8) {
        return res.status(400).send('Password must have at least 8 characters');
    }

    adminPassword = password;
    tokens.delete(token);

    res.send('Admin password updated.');
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Application listening on port 3000');
});

