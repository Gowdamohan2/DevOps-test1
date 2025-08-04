const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'nodejs-secret-key',
  resave: false,
  saveUninitialized: true
}));

// In-memory user (for demo)
const user = { username: 'admin', password: 'admin123' };

// Home/Login page
app.get('/', (req, res) => {
  const html = `
    <html>
      <head>
        <title>Login</title>
        <style>
          body {
            font-family: Arial;
            background: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          form {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
          }
          input {
            display: block;
            width: 100%;
            margin-bottom: 15px;
            padding: 10px;
          }
          button {
            padding: 10px;
            width: 100%;
            background-color: #007bff;
            border: none;
            color: white;
            font-weight: bold;
            border-radius: 5px;
            cursor: pointer;
          }
          .error {
            color: red;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <form action="/login" method="post">
          <h2>Login</h2>
          ${req.query.error ? '<div class="error">Invalid credentials</div>' : ''}
          <input type="text" name="username" placeholder="Username" required/>
          <input type="password" name="password" placeholder="Password" required/>
          <button type="submit">Login</button>
        </form>
      </body>
    </html>
  `;
  res.send(html);
});

// Handle login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === user.username && password === user.password) {
    req.session.user = user;
    return res.redirect('/dashboard');
  }
  return res.redirect('/?error=1');
});

// Dashboard (after login)
app.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  res.send(`
    <html>
      <head>
        <title>Dashboard</title>
        <style>
          body { font-family: Arial; background: #eef; padding: 40px; }
          a { text-decoration: none; background: #f00; color: white; padding: 10px 20px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>Welcome, ${req.session.user.username}!</h1>
        <p>This is a protected dashboard page.</p>
        <a href="/logout">Logout</a>
      </body>
    </html>
  `);
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

// Start server
app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
