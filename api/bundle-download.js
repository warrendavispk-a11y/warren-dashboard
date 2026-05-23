// Secure bundle delivery — verifies Gumroad sale_id before serving all 4 PDFs

const GUMROAD_TOKEN = "pagcW9AjOB5hJGlCo353bT7tQ5JYhFs5BrtVurbI9-g";
const BASE = "https://warren-dashboard-fresh.vercel.app/downloads";

const FILES = [
  { title: "Wireless Sales Script Bundle", uuid: "d525c4ccf42845cd932bec44ab6354d2", filename: "Wireless-Sales-Script-Bundle.pdf", desc: "7 word-for-word scripts for wireless sales reps" },
  { title: "Sales Objection Crusher", uuid: "32dba230449f4ed483b15d4d52e49a51", filename: "Sales-Objection-Crusher.pdf", desc: "25 responses to the objections costing you commission" },
  { title: "Monthly Budget Planner", uuid: "61415c475522444a8b98927b539ba36f", filename: "Monthly-Budget-Planner.pdf", desc: "Zero-based budgeting printable — give every dollar a name" },
  { title: "Debt Payoff Tracker", uuid: "35973118d8a54340b202ffd99f7bafcc", filename: "Debt-Payoff-Tracker.pdf", desc: "Complete debt elimination roadmap" },
];

function errorPage(message) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Access Denied — Warren Davis Digital</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #fff; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .card { background: #111; border: 1px solid #222; border-radius: 16px; padding: 48px 40px; max-width: 440px; width: 100%; text-align: center; }
    h1 { font-size: 20px; font-weight: 700; margin-bottom: 12px; color: #ff4444; }
    p { color: #888; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
    a { color: #39d353; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Access Denied</h1>
    <p>${message}</p>
    <p>Questions? Email <a href="mailto:warrendavis1015@gmail.com">warrendavis1015@gmail.com</a></p>
  </div>
</body>
</html>`;
}

export default async function handler(req, res) {
  const { sale_id } = req.query;

  if (!sale_id) {
    res.setHeader("Content-Type", "text/html");
    return res.status(403).send(errorPage("No purchase record found. Please complete your purchase on Gumroad first."));
  }

  // Verify the sale with Gumroad API
  try {
    const verifyRes = await fetch(
      `https://api.gumroad.com/v2/sales/${encodeURIComponent(sale_id)}?access_token=${GUMROAD_TOKEN}`
    );
    const data = await verifyRes.json();

    if (!data.success) {
      res.setHeader("Content-Type", "text/html");
      return res.status(403).send(errorPage("Purchase could not be verified. If you believe this is an error, please contact us."));
    }
  } catch (err) {
    console.error("Gumroad verification error:", err);
  }

  const rows = FILES.map(f => `
    <div class="row">
      <div class="info">
        <div class="name">${f.title}</div>
        <div class="desc">${f.desc}</div>
      </div>
      <a href="${BASE}/${f.uuid}.pdf" download="${f.filename}" class="btn">↓ Download</a>
    </div>
  `).join("");

  res.setHeader("Content-Type", "text/html");
  return res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sales & Finance Starter Pack — Warren Davis Digital</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #fff; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .card { background: #111; border: 1px solid #222; border-radius: 16px; padding: 40px; max-width: 560px; width: 100%; }
    .badge { display: inline-block; background: rgba(57,211,83,0.15); border: 1px solid rgba(57,211,83,0.3); color: #39d353; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; margin-bottom: 20px; }
    h1 { font-size: 22px; font-weight: 700; margin-bottom: 6px; }
    .subtitle { color: #666; font-size: 13px; margin-bottom: 28px; }
    .row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 0; border-bottom: 1px solid #1a1a1a; }
    .row:last-child { border-bottom: none; }
    .name { font-size: 14px; font-weight: 600; margin-bottom: 3px; }
    .desc { font-size: 12px; color: #666; }
    .btn { flex-shrink: 0; background: #39d353; color: #000; font-weight: 700; font-size: 13px; padding: 8px 16px; border-radius: 8px; text-decoration: none; }
    .btn:hover { opacity: 0.9; }
    .note { margin-top: 24px; font-size: 12px; color: #444; text-align: center; }
    .logo { font-size: 12px; color: #333; text-align: center; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">✓ Purchase Verified — 4 PDFs Ready</div>
    <h1>The Sales & Finance Starter Pack</h1>
    <div class="subtitle">Download all 4 files below. They're yours forever — print unlimited copies.</div>
    ${rows}
    <div class="note">Having trouble? Email warrendavis1015@gmail.com</div>
    <div class="logo">Warren Davis Digital</div>
  </div>
</body>
</html>`);
}
