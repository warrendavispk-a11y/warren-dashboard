// Warren Davis Digital — Business Data
// Update these numbers weekly as actuals come in

export const debtMission = {
  totalDebt: 300000,
  startDate: '2026-05-22',
  targetDate: '2027-05-22',
  monthlyTarget: 25000,
  paidToDate: 0,
  currentBalance: 300000,
  monthsCompleted: 0,
  currentMonth: 1,
};

export const incomeStreams = [
  { id: 1, name: 'Verizon Commission', type: 'primary', monthlyEstimate: 0, ytd: 0, status: 'active' },
  { id: 2, name: 'Etsy Store', type: 'digital', monthlyEstimate: 0, ytd: 0, status: 'live' },
  { id: 3, name: 'Shopify Store', type: 'digital', monthlyEstimate: 0, ytd: 0, status: 'live' },
  { id: 4, name: 'Affiliate Income', type: 'passive', monthlyEstimate: 0, ytd: 0, status: 'building' },
];

export const products = [
  { id: 1, name: 'Wireless Sales Script Bundle', sku: 'WSS-001', price: '$27.00', platform: 'Etsy + Shopify', status: 'active', sales: 0, revenue: '$0.00', image: true, description: true },
  { id: 2, name: 'Sales Objection Crusher', sku: 'SOC-002', price: '$17.00', platform: 'Etsy + Shopify', status: 'active', sales: 0, revenue: '$0.00', image: true, description: true },
  { id: 3, name: 'Monthly Budget Planner', sku: 'MBP-003', price: '$7.00', platform: 'Etsy + Shopify', status: 'active', sales: 0, revenue: '$0.00', image: true, description: true },
  { id: 4, name: 'Debt Payoff Tracker', sku: 'DPT-004', price: '$9.00', platform: 'Etsy + Shopify', status: 'active', sales: 0, revenue: '$0.00', image: false, description: true },
  { id: 5, name: 'Daily Sales Planner', sku: 'DSP-005', price: '$9.00', platform: 'Etsy + Shopify', status: 'active', sales: 0, revenue: '$0.00', image: false, description: true },
  { id: 6, name: 'Sales & Finance Bundle', sku: 'BDL-001', price: '$37.00', platform: 'Etsy + Shopify', status: 'active', sales: 0, revenue: '$0.00', image: false, description: true },
];

export const contentPipeline = [
  { id: 1, platform: 'tiktok', title: 'Origin story — "$300K in debt, here\'s the plan"', status: 'queued', scheduled: 'Day 1' },
  { id: 2, platform: 'tiktok', title: '"I need to think about it" — say THIS', status: 'queued', scheduled: 'Day 2' },
  { id: 3, platform: 'tiktok', title: 'I made money while at work — how', status: 'queued', scheduled: 'Day 3' },
  { id: 4, platform: 'instagram', title: 'Origin story reel (repost)', status: 'queued', scheduled: 'Day 1' },
  { id: 5, platform: 'youtube', title: 'Stop saying "what can I help you with"', status: 'queued', scheduled: 'Day 2' },
  { id: 6, platform: 'pinterest', title: 'Sales Script Bundle product pin', status: 'queued', scheduled: 'Day 1' },
  { id: 7, platform: 'twitter', title: 'Thread: $300K debt payoff plan', status: 'queued', scheduled: 'Day 1' },
  { id: 8, platform: 'tiktok', title: 'Trade-in close — price objection handler', status: 'queued', scheduled: 'Day 4' },
];

export const socialFollowers = [
  { platform: 'TikTok', handle: '@warrendavisdigital', followers: 0, goal: 1000, status: 'setup' },
  { platform: 'Instagram', handle: '@warrendavisdigital', followers: 0, goal: 500, status: 'setup' },
  { platform: 'YouTube', handle: '@warrendavisdigital', followers: 0, goal: 500, status: 'setup' },
  { platform: 'Pinterest', handle: '@warrendavisdigital', followers: 0, goal: 200, status: 'setup' },
  { platform: 'Twitter/X', handle: '@warrendavisdigital', followers: 0, goal: 300, status: 'setup' },
];

export const priorityActions = [
  { id: 1, urgency: 'critical', title: 'Create Canva mockup images for all 5 products', detail: 'Each listing needs 4 mockup images before going fully live. See image direction in each product\'s listings/etsy.md file.', category: 'store', due: 'TODAY', assignee: 'Warren' },
  { id: 2, urgency: 'critical', title: 'Set up all 6 social media profiles', detail: '@warrendavisdigital on TikTok, Instagram, YouTube, Pinterest, Twitter/X, Facebook. Full copy-paste bios ready.', category: 'social', due: 'TODAY', assignee: 'Warren' },
  { id: 3, urgency: 'high', title: 'Film and post first 3 TikTok videos', detail: 'Scripts #1, #2, #5 are written and ready. Film today — use your sales energy. Post same day.', category: 'content', due: 'TODAY', assignee: 'Warren' },
  { id: 4, urgency: 'high', title: 'Create Linktree and connect product links', detail: 'linktr.ee — add all 5 product Etsy links + Shopify. Add to every platform bio.', category: 'store', due: 'TODAY', assignee: 'Warren' },
  { id: 5, urgency: 'high', title: 'Set up Mailchimp + 3-email welcome sequence', detail: 'Lead magnet: "3 Free Sales Scripts" PDF. Welcome sequence auto-sells the bundle on Day 7.', category: 'email', due: 'This week', assignee: 'Warren' },
  { id: 6, urgency: 'medium', title: 'Connect Pinterest to Etsy (auto-pins listings)', detail: 'Pinterest > Settings > Claim > Claim your Etsy. Takes 5 minutes. Fully passive after that.', category: 'social', due: 'This week', assignee: 'Warren' },
  { id: 7, urgency: 'medium', title: 'Install Metricool for cross-platform scheduling', detail: 'metricool.com — connect all accounts. Schedule a full week every Sunday in one sitting.', category: 'automation', due: 'This week', assignee: 'Warren' },
  { id: 8, urgency: 'low', title: 'Add Canva images to DPT-004 and DSP-005', detail: 'Debt Payoff Tracker and Daily Sales Planner listings are missing mockup images. Needs visuals to convert.', category: 'store', due: 'This week', assignee: 'Warren' },
];

export const systemStatus = [
  { id: 1, name: 'Hermes Agent', host: '142.93.118.208', status: 'online', detail: 'Telegram connected', lastCheck: 'live' },
  { id: 2, name: 'Hermes Dashboard', host: '142.93.118.208:9119', status: 'online', detail: 'Chat UI running', lastCheck: 'live', url: 'http://142.93.118.208:9119' },
  { id: 3, name: 'Telegram Gateway', host: 'DM: Warren Davis', status: 'online', detail: 'Claude Code linked in', lastCheck: 'live' },
  { id: 4, name: 'Etsy Store', host: 'etsy.com', status: 'live', detail: '5 products listed', lastCheck: 'manual' },
  { id: 5, name: 'Shopify Store', host: 'shopify.com', status: 'live', detail: '5 products listed', lastCheck: 'manual' },
  { id: 6, name: 'WarrenOS Dashboard', host: 'vercel.app', status: 'online', detail: 'This site', lastCheck: 'live' },
];

export const monthlyUpdates = [];
