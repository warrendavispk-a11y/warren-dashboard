import { ShoppingBag, CheckCircle, XCircle } from 'lucide-react';
import { products } from '../data.js';

const platformColors = { 'Etsy + Shopify': 'var(--green)', Etsy: 'var(--orange)', Shopify: 'var(--blue)' };

export default function ProductsPanel({ compact }) {
  const totalRevenue = products.reduce((s, p) => s + parseFloat(p.revenue.replace('$', '').replace(',', '')), 0);
  const totalSales = products.reduce((s, p) => s + p.sales, 0);

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title"><ShoppingBag size={12} /> DIGITAL PRODUCTS</span>
        <div style={{ display: 'flex', gap: 12 }}>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{totalSales} sales</span>
          <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 700 }}>${totalRevenue.toFixed(2)} revenue</span>
        </div>
      </div>

      <div className="table-header" style={{ gridTemplateColumns: compact ? '2fr 60px 80px' : '2fr 80px 80px 80px 60px 60px' }}>
        <span>Product</span>
        <span>Price</span>
        {!compact && <span>Platform</span>}
        {!compact && <span>Sales</span>}
        {!compact && <span>Images</span>}
        <span>Status</span>
      </div>

      {products.map(p => (
        <div key={p.id} className="table-row" style={{ gridTemplateColumns: compact ? '2fr 60px 80px' : '2fr 80px 80px 80px 60px 60px' }}>
          <div>
            <div style={{ color: 'var(--text-primary)', fontSize: 12, fontWeight: 600 }}>{p.name}</div>
            {!compact && <div style={{ color: 'var(--text-muted)', fontSize: 10 }}>{p.sku}</div>}
          </div>
          <span style={{ color: 'var(--green)', fontSize: 12, fontWeight: 700 }}>{p.price}</span>
          {!compact && <span style={{ fontSize: 10, color: platformColors[p.platform] || 'var(--text-muted)' }}>{p.platform}</span>}
          {!compact && <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{p.sales}</span>}
          {!compact && (
            <span style={{ display: 'flex', gap: 4 }}>
              {p.image
                ? <CheckCircle size={12} style={{ color: 'var(--green)' }} />
                : <XCircle size={12} style={{ color: 'var(--red)' }} />}
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>img</span>
            </span>
          )}
          <span className={`badge badge-${p.status === 'active' ? 'green' : 'yellow'}`}>{p.status}</span>
        </div>
      ))}

      {!compact && (
        <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'flex-end', gap: 16, borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>XCircle = needs Canva mockup image</span>
        </div>
      )}
    </div>
  );
}
