import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertTriangle, CheckCheck } from 'lucide-react';

export default function StatusBadge({ status }) {
  switch (status) {
    case 'confirmed':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Confirmed
        </span>
      );
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
          <CheckCheck className="w-3.5 h-3.5" />
          Completed
        </span>
      );
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
          <Clock className="w-3.5 h-3.5" />
          Pending
        </span>
      );
    case 'cancelled':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold">
          <XCircle className="w-3.5 h-3.5" />
          Cancelled
        </span>
      );
    case 'no-show':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-700/50 text-zinc-400 border border-zinc-600 text-xs font-semibold">
          <AlertTriangle className="w-3.5 h-3.5" />
          No Show
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-medium capitalize">
          {status}
        </span>
      );
  }
}
