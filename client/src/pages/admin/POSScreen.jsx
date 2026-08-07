import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Trash2, Scissors, Package, CreditCard, DollarSign, QrCode, CheckCircle2 } from 'lucide-react';
import API from '../../services/api';
import ReceiptModal from '../../components/ReceiptModal';

export default function POSScreen() {
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cart State
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('Walk-in Client');
  const [customerPhone, setCustomerPhone] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  // Checkout Status & Receipt Modal
  const [submitting, setSubmitting] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, pRes] = await Promise.all([
        API.get('/services'),
        API.get('/products'),
      ]);
      setServices(sRes.data);
      setProducts(pRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item, itemType) => {
    const existingIndex = cart.findIndex((c) => c.itemId === item._id && c.itemType === itemType);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          itemId: item._id,
          name: item.name,
          price: item.price,
          quantity: 1,
          itemType,
        },
      ]);
    }
  };

  const updateQuantity = (index, delta) => {
    const updated = [...cart];
    updated[index].quantity += delta;
    if (updated[index].quantity <= 0) {
      updated.splice(index, 1);
    }
    setCart(updated);
  };

  const removeFromCart = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = Math.max(0, subtotal - Number(discount || 0));

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Your POS cart is empty. Add services or retail products first.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerName: customerName || 'Walk-in Client',
        customerPhone,
        items: cart,
        discount: Number(discount || 0),
        paymentMethod,
      };

      const res = await API.post('/sales', payload);
      setCompletedSale(res.data.sale);
      setCart([]);
      setDiscount(0);
      setCustomerName('Walk-in Client');
      setCustomerPhone('');
      fetchData(); // Refresh product stock!
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Receipt Modal */}
      {completedSale && (
        <ReceiptModal sale={completedSale} onClose={() => setCompletedSale(null)} />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">RECEPTION POS & WALK-IN SALES</h1>
          <p className="text-xs text-zinc-400">Ring up walk-in haircuts & retail grooming products with stock updates</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Item Selector Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Haircut Services Grid */}
          <div className="bg-dark-800 border border-zinc-800 p-5 rounded-2xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Scissors className="w-4 h-4 text-gold-400" /> Walk-in Services Menu
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {services.map((s) => (
                <div
                  key={s._id}
                  onClick={() => addToCart(s, 'Service')}
                  className="bg-dark-900 border border-zinc-800 p-3 rounded-xl hover:border-gold-500 cursor-pointer transition-all flex flex-col justify-between group"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-gold-400">{s.name}</h4>
                    <p className="text-[11px] text-zinc-500">{s.durationMinutes} mins</p>
                  </div>
                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-zinc-800/80">
                    <span className="text-xs font-black text-gold-400">${s.price}</span>
                    <span className="p-1 rounded bg-gold-500/10 text-gold-400 group-hover:bg-gold-500 group-hover:text-black">
                      <Plus className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Retail Products Grid */}
          <div className="bg-dark-800 border border-zinc-800 p-5 rounded-2xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-gold-400" /> Retail Grooming Products (Auto Stock Update)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {products.map((p) => (
                <div
                  key={p._id}
                  onClick={() => p.stock > 0 && addToCart(p, 'Product')}
                  className={`bg-dark-900 border p-3 rounded-xl transition-all flex flex-col justify-between group ${
                    p.stock > 0 ? 'border-zinc-800 hover:border-gold-500 cursor-pointer' : 'border-zinc-800/40 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-white group-hover:text-gold-400">{p.name}</h4>
                    </div>
                    <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded ${
                      p.stock > 5 ? 'bg-emerald-500/10 text-emerald-400' : p.stock > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      Stock: {p.stock} left
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-zinc-800/80">
                    <span className="text-xs font-black text-gold-400">${p.price}</span>
                    {p.stock > 0 && (
                      <span className="p-1 rounded bg-gold-500/10 text-gold-400 group-hover:bg-gold-500 group-hover:text-black">
                        <Plus className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Shopping Cart & Checkout Panel */}
        <div className="bg-dark-800 border border-zinc-800 p-5 rounded-2xl space-y-4 flex flex-col justify-between h-fit sticky top-24">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-gold-400" /> POS Cart</span>
              <span className="text-xs px-2.5 py-1 rounded bg-gold-500/10 text-gold-400 font-extrabold">{cart.length} items</span>
            </h2>

            {/* Customer Contact Details */}
            <div className="space-y-2 text-xs">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer Name"
                className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-zinc-700 text-white"
              />
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Phone (optional)"
                className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-zinc-700 text-white"
              />
            </div>

            {/* Cart Items List */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="py-8 text-center text-zinc-500 text-xs">
                  Cart is empty. Click services or products on the left to add items.
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="bg-dark-900 border border-zinc-800 p-2.5 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{item.name}</div>
                      <div className="text-[10px] text-gold-400">{item.itemType} • ${item.price} each</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-zinc-800 rounded px-1.5 py-0.5">
                        <button onClick={() => updateQuantity(idx, -1)} className="text-zinc-400 hover:text-white font-bold text-sm">-</button>
                        <span className="px-1 font-bold text-white">{item.quantity}</span>
                        <button onClick={() => updateQuantity(idx, 1)} className="text-zinc-400 hover:text-white font-bold text-sm">+</button>
                      </div>
                      <button onClick={() => removeFromCart(idx)} className="text-rose-400 hover:text-rose-300">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Discounts & Payment Method */}
            {cart.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-zinc-800 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1">Apply Discount ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-zinc-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Payment Method</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['Cash', 'Card', 'UPI'].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2 rounded-lg font-bold border transition-all ${
                          paymentMethod === method
                            ? 'bg-gold-500 text-black border-gold-400'
                            : 'bg-dark-900 text-zinc-400 border-zinc-800 hover:text-white'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pricing Totals & Checkout Button */}
          {cart.length > 0 && (
            <div className="pt-4 border-t border-zinc-800 space-y-3">
              <div className="space-y-1 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {Number(discount) > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount:</span>
                    <span>-${Number(discount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-zinc-800">
                  <span>Total Due:</span>
                  <span className="text-gold-400">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={submitting}
                className="w-full py-3.5 rounded-xl gold-gradient text-black font-extrabold text-sm shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? 'Processing Transaction...' : 'Complete POS Sale & Print Receipt'}
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
