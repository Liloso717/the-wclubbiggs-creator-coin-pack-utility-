import React, { useState } from 'react';
import { Lock, Wallet, ArrowRight, CheckCircle2 } from 'lucide-react';

interface GatekeeperProps {
  onUnlock: () => void;
}

export const Gatekeeper: React.FC<GatekeeperProps> = ({ onUnlock }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 1000);
  };

  const handlePay = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      onUnlock();
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center animate-fade-in">
      <div className="glass-panel p-8 md:p-12 rounded-3xl max-w-lg w-full shadow-2xl border-t border-purple-500/20">
        
        <div className="mb-6 flex justify-center">
          <div className="bg-purple-900/30 p-4 rounded-full border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <Lock className="w-10 h-10 text-purple-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-3">Restricted Access</h1>
        <p className="text-gray-400 mb-8">
          The Pack Curator is reserved for members only.
          You must pay in <span className="text-purple-400 font-bold">$THEWCLUBBIGGS</span> to proceed.
        </p>

        <div className="space-y-4">
          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full group relative flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-100 transition-all disabled:opacity-50"
            >
              {isConnecting ? (
                <span>Connecting...</span>
              ) : (
                <>
                  <Wallet className="w-5 h-5" />
                  Connect Wallet
                </>
              )}
            </button>
          ) : (
            <div className="space-y-4 animate-slide-up">
              <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Wallet Connected
                </span>
                <span className="font-mono opacity-70">0x71...3A9f</span>
              </div>

              <button
                onClick={handlePay}
                disabled={isPaying}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-lg transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPaying ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    Processing Transaction...
                  </span>
                ) : (
                  <>
                    Pay 1,000 $THEWCLUBBIGGS
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500">
                Transaction will be simulated for this demo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
