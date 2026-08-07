import React from 'react';
import { X, Printer, Scissors, CheckCircle } from 'lucide-react';

export default function ReceiptModal({ sale, onClose }) {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white text-zinc-900 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
        
        <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-black text-amber-500 flex items-center justify-center font-bold">
              <Scissors className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg tracking-wide">ROBOCUTZ RECEIPT</span>
          </div>
          <button onClick={onClose} className="p-1 rounded text-zinc-400 hover:text-black">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Area */}
        <div id="printable-receipt" className="space-y-4 font-mono text-xs">
          <div className="text-center border-b border-dashed border-zinc-300 pb-3">
            <h2 className="text-base font-bold uppercase">RoboCutz Barber Studio</h2>
            <p>742 Evergreen Terrace, Suite 10</p>
            <p>Phone: +1 (555) 019-ROBO</p>
            <p className="mt-1 text-[11px] text-zinc-500">Date: {new Date(sale.createdAt || Date.now()).toLocaleString()}</p>
            <p className="text-[11px] font-bold text-amber-600">Receipt No: {sale.receiptNo}</p>
          </div>

          <div className="space-y-1">
            <p><strong>Customer:</strong> {sale.customerName}</p>
            {sale.customerPhone && <p><strong>Phone:</strong> {sale.customerPhone}</p>}
            <p><strong>Payment Method:</strong> {sale.paymentMethod}</p>
          </div>

          <table className="w-full text-left border-t border-b border-zinc-300 py-2 my-2">
            <thead>
              <tr className="border-b border-zinc-200">
                <th className="py-1">Item</th>
                <th className="py-1 text-center">Qty</th>
                <th className="py-1 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {sale.items?.map((item, idx) => (
                <tr key={idx} className="border-b border-zinc-100">
                  <td className="py-1 pr-2">{item.name}</td>
                  <td className="py-1 text-center">{item.quantity || 1}</td>
                  <td className="py-1 text-right">${(item.price * (item.quantity || 1)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="space-y-1 text-right font-sans">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal:</span>
              <span>${sale.subtotal?.toFixed(2)}</span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount:</span>
                <span>-${sale.discount?.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-black pt-1 border-t border-zinc-300">
              <span>Total Paid:</span>
              <span>${sale.total?.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-center pt-3 border-t border-dashed border-zinc-300 text-[10px] text-zinc-500">
            Thank you for choosing RoboCutz!
            <br />
            Visit again soon for your next clean cut!
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 rounded-xl bg-black text-amber-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-zinc-800 shadow"
          >
            <Printer className="w-4 h-4" /> Print Receipt
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-zinc-200 text-zinc-800 text-xs font-semibold hover:bg-zinc-300"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
