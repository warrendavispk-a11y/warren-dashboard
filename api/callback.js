export default function handler(req, res) {
  const code = req.query.code || '';
  const token = req.query.access_token || '';

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head><title>Gumroad Auth</title></head>
      <body style="font-family:sans-serif;padding:40px;max-width:600px;margin:auto">
        <h2>Your Gumroad Access Token</h2>
        ${code ? `<p><strong>Authorization Code:</strong></p><textarea rows="3" style="width:100%;font-size:14px">${code}</textarea>` : ''}
        ${token ? `<p><strong>Access Token:</strong></p><textarea rows="3" style="width:100%;font-size:14px">${token}</textarea>` : ''}
        ${!code && !token ? '<p>No token received. Try the auth flow again.</p>' : '<p>Copy the value above and send it to Claude.</p>'}
      </body>
    </html>
  `);
}
