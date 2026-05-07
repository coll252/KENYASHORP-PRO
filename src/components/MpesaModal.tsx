import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, Smartphone, AlertCircle, Settings } from 'lucide-react';
import { formatKsh } from '@/data/products';
import { supabase } from '@/lib/supabase';

type Status = 'idle' | 'initiating' | 'awaiting' | 'success' | 'failed' | 'timeout' | 'config-missing';

interface Props {
  open: boolean;
  onClose: () => void;
  amount: number;
  phone: string;
  email?: string;
  customerName?: string;
  orderId?: string;
  onSuccess: (receipt: { mpesaReceiptNumber?: string; reference?: string; checkoutRequestId?: string }) => void;
}

const MpesaModal: React.FC<Props> = ({ open, onClose, amount, phone, email, customerName, orderId, onSuccess }) => {
  const [status, setStatus] = useState<Status>('idle');
  const [countdown, setCountdown] = useState(90);
  const [checkoutId, setCheckoutId] = useState<string>('');
  const [merchantId, setMerchantId] = useState<string>('');
  const [reference, setReference] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [receipt, setReceipt] = useState<string>('');
  const pollRef = useRef<number | null>(null);
  const countRef = useRef<number | null>(null);

  const stopTimers = () => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    if (countRef.current) { clearInterval(countRef.current); countRef.current = null; }
  };

  useEffect(() => () => stopTimers(), []);

  useEffect(() => {
    if (!open) { stopTimers(); setStatus('idle'); return; }
    initiate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const initiate = async () => {
    stopTimers();
    setStatus('initiating');
    setErrorMsg('');
    setReceipt('');
    setCountdown(90);

    try {
      const { data, error } = await supabase.functions.invoke('mpesa-stk-push', {
        body: {
          phone,
          amount,
          email,
          customerName,
          orderId,
          description: 'KenyaShop Pro',
          reference: orderId || `KS${Date.now()}`,
        },
      });

      if (error) {
        setStatus('failed');
        setErrorMsg(error.message || 'Could not reach M-Pesa service');
        return;
      }

      if (!data?.success) {
        const msg = (data?.error || '').toString();
        if (msg.toLowerCase().includes('not configured') || msg.toLowerCase().includes('credentials')) {
          setStatus('config-missing');
          setErrorMsg(msg);
        } else {
          setStatus('failed');
          setErrorMsg(msg || 'STK Push failed');
        }
        return;
      }

      setCheckoutId(data.checkoutRequestId);
      setMerchantId(data.merchantRequestId);
      setReference(data.reference);
      setStatus('awaiting');
      startPolling(data.checkoutRequestId);
      startCountdown();
    } catch (e: any) {
      setStatus('failed');
      setErrorMsg(e?.message || 'Network error');
    }
  };

  const startCountdown = () => {
    countRef.current = window.setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          stopTimers();
          setStatus(prev => prev === 'awaiting' ? 'timeout' : prev);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const startPolling = (id: string) => {
    pollRef.current = window.setInterval(async () => {
      try {
        const { data } = await supabase.functions.invoke('mpesa-status', {
          body: { checkoutRequestId: id },
        });
        if (!data?.success) return;

        if (data.status === 'success') {
          stopTimers();
          setReceipt(data.mpesaReceiptNumber || '');
          setStatus('success');
          setTimeout(() => onSuccess({
            mpesaReceiptNumber: data.mpesaReceiptNumber,
            reference: data.reference,
            checkoutRequestId: data.checkoutRequestId,
          }), 1800);
        } else if (data.status === 'failed') {
          stopTimers();
          setErrorMsg(data.resultDesc || 'Transaction failed');
          setStatus('failed');
        }
      } catch {
        // keep polling on transient errors
      }
    }, 3000);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { stopTimers(); onClose(); } }}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white p-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-white/20 grid place-items-center mb-3 backdrop-blur">
            {status === 'success' ? <CheckCircle2 className="w-10 h-10" /> :
             status === 'failed' || status === 'timeout' ? <AlertCircle className="w-10 h-10" /> :
             status === 'config-missing' ? <Settings className="w-10 h-10" /> :
             <Smartphone className="w-10 h-10" />}
          </div>
          <h2 className="text-xl font-bold">M-Pesa Payment</h2>
          <p className="text-green-100 text-sm mt-1">{formatKsh(amount)} via Safaricom Daraja</p>
        </div>

        <div className="p-6">
          {status === 'initiating' && (
            <div className="text-center py-6">
              <Loader2 className="w-10 h-10 animate-spin mx-auto text-green-700 mb-3" />
              <h3 className="font-semibold">Initiating STK Push…</h3>
              <p className="text-sm text-slate-500 mt-1">Authenticating with Safaricom Daraja</p>
              <div className="bg-slate-50 mt-4 p-3 rounded text-xs font-mono text-left text-slate-600">
                <div>POST /oauth/v1/generate</div>
                <div>POST /mpesa/stkpush/v1/processrequest</div>
                <div className="text-green-700 mt-1">PhoneNumber: {phone}</div>
                <div className="text-green-700">Amount: KSh {amount}</div>
              </div>
            </div>
          )}

          {status === 'awaiting' && (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <Smartphone className="w-8 h-8 mx-auto text-green-700 mb-2" />
                <h3 className="font-semibold text-slate-900">Check your phone</h3>
                <p className="text-sm text-slate-600 mt-1">An M-Pesa prompt was sent to <strong>{phone}</strong>. Enter your M-Pesa PIN to authorise the {formatKsh(amount)} payment.</p>
              </div>
              <div className="text-sm text-slate-500 mb-1">Waiting for confirmation…</div>
              <div className="text-3xl font-mono font-bold text-green-700">
                {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
              </div>
              <div className="bg-slate-50 mt-4 p-3 rounded text-xs font-mono text-left text-slate-600 break-all">
                <div>CheckoutRequestID:</div>
                <div className="text-green-700">{checkoutId}</div>
                <div className="mt-2 text-slate-500">MerchantRequestID:</div>
                <div className="text-slate-700">{merchantId}</div>
                <div className="mt-2">Status: <span className="text-orange-600">Polling Daraja callback…</span></div>
              </div>
              <p className="text-[11px] text-slate-400 mt-3">If you don't receive a prompt, check that your number is M-Pesa-registered and try again.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-100 grid place-items-center mb-3">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-green-700">Payment Received!</h3>
              {receipt && (
                <div className="mt-2 inline-block bg-green-50 px-3 py-1 rounded font-mono text-sm text-green-800">
                  M-Pesa Ref: {receipt}
                </div>
              )}
              <p className="text-sm text-slate-600 mt-3">Confirmation SMS sent to {phone}</p>
              <p className="text-xs text-slate-400 mt-3">Redirecting to order tracking…</p>
            </div>
          )}

          {status === 'failed' && (
            <div className="text-center py-4">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900">Payment Failed</h3>
              <p className="text-sm text-slate-600 mt-1">{errorMsg || 'The transaction was cancelled or failed.'}</p>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button onClick={initiate} className="bg-green-700 hover:bg-green-800">Try Again</Button>
                <Button onClick={onClose} variant="outline">Cancel</Button>
              </div>
            </div>
          )}

          {status === 'timeout' && (
            <div className="text-center py-4">
              <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900">Request Timed Out</h3>
              <p className="text-sm text-slate-600 mt-1">No PIN was entered within 90 seconds. The STK prompt may have expired.</p>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button onClick={initiate} className="bg-green-700 hover:bg-green-800">Resend Prompt</Button>
                <Button onClick={onClose} variant="outline">Cancel</Button>
              </div>
            </div>
          )}

          {status === 'config-missing' && (
            <div className="py-2">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="font-semibold text-amber-900 flex items-center gap-2"><Settings className="w-4 h-4" /> M-Pesa not configured yet</h3>
                <p className="text-sm text-amber-800 mt-2">{errorMsg}</p>
                <p className="text-xs text-amber-700 mt-3">An admin must add the following secrets to the edge functions:</p>
                <ul className="text-xs font-mono text-amber-900 bg-amber-100 rounded p-2 mt-2 space-y-0.5">
                  <li>MPESA_CONSUMER_KEY</li>
                  <li>MPESA_CONSUMER_SECRET</li>
                  <li>MPESA_SHORTCODE (e.g. 174379)</li>
                  <li>MPESA_PASSKEY</li>
                  <li>MPESA_CALLBACK_URL</li>
                  <li>MPESA_ENV (sandbox or production)</li>
                </ul>
                <p className="text-xs text-amber-700 mt-3">Get these from the Safaricom Daraja portal at <span className="font-mono">developer.safaricom.co.ke</span></p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button onClick={initiate} className="bg-green-700 hover:bg-green-800">Retry</Button>
                <Button onClick={onClose} variant="outline">Close</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MpesaModal;
