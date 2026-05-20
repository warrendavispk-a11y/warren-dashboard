export const shopifyMetrics = {
  sessions: { value: 4821, delta: +12.4, label: 'Sessions' },
  revenue: { value: '$3,247', delta: +8.1, label: 'Revenue' },
  orders: { value: 89, delta: +5.3, label: 'Orders' },
  conversionRate: { value: '1.85%', delta: -0.2, label: 'Conv. Rate' },
};

export const products = [
  { id: 1, name: 'Vintage Chrome Wall Clock', sku: 'WC-001', price: '$34.99', stock: 42, image: true, description: true, status: 'active', revenue: '$1,049.70' },
  { id: 2, name: 'Minimalist Desk Organizer', sku: 'DO-007', price: '$22.50', stock: 18, image: true, description: false, status: 'active', revenue: '$787.50' },
  { id: 3, name: 'Bamboo Phone Stand', sku: 'PS-012', price: '$15.99', stock: 0, image: false, description: false, status: 'draft', revenue: '$0.00' },
  { id: 4, name: 'Leather Cable Organizer', sku: 'CO-003', price: '$19.99', stock: 67, image: true, description: true, status: 'active', revenue: '$519.74' },
  { id: 5, name: 'Geometric Planter Set', sku: 'GP-021', price: '$44.00', stock: 9, image: true, description: false, status: 'active', revenue: '$396.00' },
  { id: 6, name: 'Wireless Charging Pad', sku: 'CP-008', price: '$28.00', stock: 33, image: false, description: true, status: 'active', revenue: '$280.00' },
];

export const contentPipeline = [
  { id: 1, platform: 'tiktok', title: 'Product unboxing: Chrome Wall Clock', status: 'posted', scheduled: '2026-05-18 14:00', views: '12.4K', engagement: '4.2%', tags: ['#aesthetic', '#home'] },
  { id: 2, platform: 'tiktok', title: '5 desk setup upgrades under $50', status: 'queued', scheduled: '2026-05-21 18:00', views: null, engagement: null, tags: ['#desksetup', '#productivity'] },
  { id: 3, platform: 'instagram', title: 'Minimalist morning routine flat lay', status: 'draft', scheduled: null, views: null, engagement: null, tags: ['#minimalism', '#lifestyle'] },
  { id: 4, platform: 'instagram', title: 'Behind the scenes: packing orders', status: 'posted', scheduled: '2026-05-17 10:00', views: '2.1K', engagement: '6.8%', tags: ['#smallbusiness', '#bts'] },
  { id: 5, platform: 'pinterest', title: 'Home office inspo board — Summer 2026', status: 'queued', scheduled: '2026-05-22 09:00', views: null, engagement: null, tags: ['#homeoffice', '#interiordesign'] },
  { id: 6, platform: 'pinterest', title: 'Gift ideas under $30 — organized', status: 'posted', scheduled: '2026-05-15 12:00', views: '8.7K', engagement: '2.1%', tags: ['#giftideas'] },
  { id: 7, platform: 'tiktok', title: 'POV: your desk before & after upgrade', status: 'draft', scheduled: null, views: null, engagement: null, tags: ['#transformation'] },
  { id: 8, platform: 'instagram', title: 'Customer review spotlight — May', status: 'queued', scheduled: '2026-05-23 15:00', views: null, engagement: null, tags: ['#reviews', '#testimonial'] },
];

export const appointments = [
  { id: 1, name: 'Jordan Lee', company: 'Apex Retail Co.', role: 'Head of Procurement', type: 'linkedin_lead', status: 'responded', linkedinUrl: '#', notes: 'Interested in bulk order of organizers. Asked for catalog.', date: '2026-05-19' },
  { id: 2, name: 'Sarah Kim', company: 'HomeGoods Direct', role: 'Buyer', type: 'scheduled_call', status: 'confirmed', callTime: '2026-05-21 11:00 AM EST', notes: 'Intro call — she found us via TikTok.', date: '2026-05-21' },
  { id: 3, name: 'Marcus Wade', company: 'Urban Loft Stores', role: 'CEO', type: 'linkedin_lead', status: 'pending', linkedinUrl: '#', notes: 'Sent connection request. No reply yet.', date: '2026-05-17' },
  { id: 4, name: 'Priya Nair', company: 'Nomad Goods', role: 'Sourcing Manager', type: 'scheduled_call', status: 'confirmed', callTime: '2026-05-22 2:00 PM EST', notes: 'Wants to discuss white-label options.', date: '2026-05-22' },
  { id: 5, name: 'Tom Adler', company: 'Shelf & Co.', role: 'Director of Ops', type: 'linkedin_lead', status: 'responded', linkedinUrl: '#', notes: 'Requested samples. Address sent.', date: '2026-05-18' },
  { id: 6, name: 'Elena Vasquez', company: 'Studio Nova', role: 'Creative Director', type: 'scheduled_call', status: 'pending', callTime: '2026-05-24 10:00 AM EST', notes: 'Collaborative branding discussion.', date: '2026-05-24' },
];

export const systemStatus = [
  { id: 1, name: 'VPS — Primary Node', host: 'vps-01.hetzner.cloud', status: 'online', uptime: '99.98%', cpu: 34, ram: 61, disk: 48, lastCheck: '30s ago', location: 'Frankfurt' },
  { id: 2, name: 'Hermes Agent', host: 'internal service', status: 'online', uptime: '100%', cpu: 8, ram: 22, disk: null, lastCheck: '30s ago', location: 'VPS' },
  { id: 3, name: 'AutoDS', host: 'app.autods.com', status: 'online', uptime: '99.1%', cpu: null, ram: null, disk: null, lastCheck: '2m ago', location: 'Cloud' },
  { id: 4, name: 'n8n Automation', host: 'n8n.internal:5678', status: 'degraded', uptime: '97.4%', cpu: 71, ram: 84, disk: 55, lastCheck: '1m ago', location: 'VPS' },
  { id: 5, name: 'Shopify Storefront', host: 'mystore.myshopify.com', status: 'online', uptime: '99.99%', cpu: null, ram: null, disk: null, lastCheck: '1m ago', location: 'Cloud' },
  { id: 6, name: 'Database (Postgres)', host: 'db-01.internal:5432', status: 'online', uptime: '99.95%', cpu: 12, ram: 45, disk: 62, lastCheck: '30s ago', location: 'VPS' },
];

export const priorityActions = [
  { id: 1, urgency: 'critical', title: 'Fix n8n workflow — order sync broken', detail: 'AutoDS→Shopify order pipeline not firing. Last success: 18h ago. ~14 orders may be unprocessed.', category: 'system', due: 'NOW', assignee: 'You' },
  { id: 2, urgency: 'high', title: 'Add description & images to Bamboo Phone Stand', detail: 'SKU PS-012 has 0 stock, no images, no description. Draft status. Needs full product page before launch.', category: 'store', due: 'Today', assignee: 'You' },
  { id: 3, urgency: 'high', title: 'Follow up: Marcus Wade (Urban Loft)', detail: 'LinkedIn connection request sent 3 days ago, no reply. Send a direct message with value prop.', category: 'leads', due: 'Today', assignee: 'You' },
  { id: 4, urgency: 'medium', title: 'Finalize Instagram draft — minimalist flat lay', detail: 'Content created, needs caption edits and hashtag research before scheduling.', category: 'content', due: 'Tomorrow', assignee: 'You' },
  { id: 5, urgency: 'medium', title: 'Prep deck for Sarah Kim call (May 21)', detail: 'HomeGoods Direct intro call. Prepare catalog PDF, pricing tiers, and MOQ info.', category: 'leads', due: 'May 21', assignee: 'You' },
  { id: 6, urgency: 'medium', title: 'Restock Geometric Planter Set (9 units left)', detail: 'SKU GP-021 nearing stockout. Place AutoDS reorder for 50+ units.', category: 'store', due: 'This week', assignee: 'You' },
  { id: 7, urgency: 'low', title: 'Add images to Wireless Charging Pad listing', detail: 'SKU CP-008 has description but missing product images. Sales may be impacted.', category: 'store', due: 'This week', assignee: 'You' },
  { id: 8, urgency: 'low', title: 'Draft TikTok POV video script', detail: '"Before & after desk upgrade" concept. Write script + shot list for recording session.', category: 'content', due: 'This week', assignee: 'You' },
];
