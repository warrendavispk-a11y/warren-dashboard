// Secure delivery page — verifies Gumroad sale_id before serving PDF
// Gumroad appends: ?sale_id=XXX&product_id=XXX&email=XXX after purchase

const GUMROAD_TOKEN = "pagcW9AjOB5hJGlCo353bT7tQ5JYhFs5BrtVurbI9-g";
const BASE = "https://warren-dashboard-fresh.vercel.app/downloads";

const PRODUCTS = {
  "wireless-sales-script-bundle": {
    title: "Wireless Sales Script Bundle",
    uuid: "d525c4ccf42845cd932bec44ab6354d2",
    filename: "Wireless-Sales-Script-Bundle.pdf",
  },
  "sales-objection-crusher": {
    title: "Sales Objection Crusher",
    uuid: "32dba230449f4ed483b15d4d52e49a51",
    filename: "Sales-Objection-Crusher.pdf",
  },
  "monthly-budget-planner": {
    title: "Monthly Budget Planner",
    uuid: "61415c475522444a8b98927b539ba36f",
    filename: "Monthly-Budget-Planner.pdf",
  },
  "debt-payoff-tracker": {
    title: "Debt Payoff Tracker",
    uuid: "35973118d8a54340b202ffd99f7bafcc",
    filename: "Debt-Payoff-Tracker.pdf",
  },
  "daily-sales-planner": {
    title: "Daily Sales Planner",
    uuid: "86ca3bbaa441442fbf0586caa87269df",
    filename: "Daily-Sales-Planner.pdf",
  },
};

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

function downloadPage(title, fileUrl, filename) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Warren Davis Digital</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #fff; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .card { background: #111; border: 1px solid #222; border-radius: 16px; padding: 48px 40px; max-width: 480px; width: 100%; text-align: center; }
    .badge { display: inline-block; background: rgba(57,211,83,0.15); border: 1px solid rgba(57,211,83,0.3); color: #39d353; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; margin-bottom: 24px; }
    h1 { font-size: 24px; font-weight: 700; margin-bottom: 12px; line-height: 1.3; }
    p { color: #888; font-size: 14px; line-height: 1.6; margin-bottom: 32px; }
    .btn { display: inline-flex; align-items: center; gap: 8px; background: #39d353; color: #000; font-weight: 700; font-size: 16px; padding: 14px 32px; border-radius: 10px; text-decoration: none; }
    .btn:hover { opacity: 0.9; }
    .note { margin-top: 24px; font-size: 12px; color: #555; }
    .logo { font-size: 13px; color: #444; margin-top: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">✓ Purchase Verified</div>
    <h1>${title}</h1>
    <p>Your download is ready. Click below to save your PDF. Print it, use it, own it forever.</p>
    <a href="${fileUrl}" download="${filename}" class="btn">↓ Download Your PDF</a>
    <div class="note">Having trouble? Email warrendavis1015@gmail.com</div>
    <div class="logo">Warren Davis Digital</div>
  </div>
</body>
</html>`;
}

export default async function handler(req, res) {
  const { product, sale_id } = req.query;
  const p = PRODUCTS[product];

  if (!p) {
    res.setHeader("Content-Type", "text/html");
    return res.status(404).send(errorPage("Product not found."));
  }

  // Require a sale_id — Gumroad passes this automatically after purchase
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
    // If Gumroad API is down, still serve — don't block paying customers
    console.error("Gumroad verification error:", err);
  }

  const fileUrl = `${BASE}/${p.uuid}.pdf`;
  res.setHeader("Content-Type", "text/html");
  return res.status(200).send(downloadPage(p.title, fileUrl, p.filename));
}
