import React, { useState } from 'react';
import {
  Camera,
  CheckCircle2,
  Image as ImageIcon,
  Link2,
  Sparkles,
} from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';
import { ProductCard } from '../shared/ProductCard';

export const VisualScanScreen: React.FC = () => {
  const { products, navigateTo, formatPrice, showToast } = useDeshiMart();
  const [scanMode, setScanMode] = useState<'camera' | 'gallery' | 'link'>('camera');
  const [externalUrl, setExternalUrl] = useState('');
  const [scannedTargetId, setScannedTargetId] = useState<string>(
    'prod-running-shoes-pro'
  );
  const [isScanning, setIsScanning] = useState(false);

  const targetProduct =
    products.find((p) => p.id === scannedTargetId) || products[3] || products[0];

  const triggerScanSimulation = (productId: string, label: string) => {
    setIsScanning(true);
    setTimeout(() => {
      setScannedTargetId(productId);
      setIsScanning(false);
      showToast(`Matched "${label}" with Verified Global Suppliers!`);
    }, 350);
  };

  const handleLinkLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!externalUrl.trim()) return;
    const lower = externalUrl.toLowerCase();
    if (lower.includes('watch')) {
      triggerScanSimulation('prod-smartwatch-pro', 'Smart Watch Pro');
    } else if (lower.includes('laptop') || lower.includes('victus')) {
      triggerScanSimulation('prod-hp-victus-laptop', 'HP Victus Gaming Laptop');
    } else if (lower.includes('earbud') || lower.includes('audio')) {
      triggerScanSimulation('prod-wireless-earbuds', 'Wireless Earbuds ANC');
    } else {
      triggerScanSimulation('prod-running-shoes-pro', 'Running Shoes Pro');
    }
  };

  return (
    <div className="p-4 space-y-4 pb-6">
      {/* Dark Emerald Visual Scanner Viewport (Matching Image 4 Screen 8) */}
      <div className="rounded-3xl bg-gradient-to-b from-[#0B3D2E] to-[#07261C] text-white p-4 space-y-4 shadow-lg">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-emerald-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#00C853]" />
            AI Visual & Link Landed Cost Finder
          </span>
          <span className="font-mono-num text-[11px] text-emerald-200/80">
            Instant Match
          </span>
        </div>

        {/* Viewfinder Frame */}
        <div className="relative w-full aspect-square max-h-60 mx-auto rounded-2xl bg-black/30 overflow-hidden flex items-center justify-center border border-white/15">
          <img
            src={targetProduct.image}
            alt={targetProduct.name}
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-all duration-200 ${
              isScanning ? 'scale-105 blur-xs opacity-60' : ' opacity-95'
            }`}
          />

          {/* Corner Viewfinder Brackets */}
          <div className="absolute top-4 left-4 w-7 h-7 border-t-3 border-l-3 border-[#00C853] rounded-tl-lg pointer-events-none" />
          <div className="absolute top-4 right-4 w-7 h-7 border-t-3 border-r-3 border-[#00C853] rounded-tr-lg pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-7 h-7 border-b-3 border-l-3 border-[#00C853] rounded-bl-lg pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-7 h-7 border-b-3 border-r-3 border-[#00C853] rounded-br-lg pointer-events-none" />

          {/* Bottom Match Tag */}
          <div className="absolute bottom-3 inset-x-3 bg-[#0B3D2E]/90 backdrop-blur-md border border-emerald-400/30 rounded-xl p-2.5 flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[10px] text-emerald-300 font-semibold block">
                {isScanning ? 'Scanning global factories...' : 'Matched Verified Item'}
              </span>
              <span className="text-xs font-extrabold text-white truncate block">
                {targetProduct.name}
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                navigateTo('product_detail', { productId: targetProduct.id })
              }
              className="px-3 py-1.5 rounded-lg bg-[#0EA75F] text-white font-mono-num text-xs font-bold shrink-0"
            >
              {formatPrice(targetProduct.totalLandedBdt)}
            </button>
          </div>
        </div>

        {/* 3 Mode Triggers: Photo / Gallery / Paste Link */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              setScanMode('camera');
              triggerScanSimulation('prod-running-shoes-pro', 'Running Shoes Pro');
            }}
            className={`py-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 text-xs font-semibold border transition-colors ${
              scanMode === 'camera'
                ? 'bg-[#0EA75F] text-white border-[#00C853]'
                : 'bg-white/10 text-emerald-100 border-white/10 hover:bg-white/15'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Photo Scan</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setScanMode('gallery');
              triggerScanSimulation('prod-smartwatch-pro', 'Smart Watch Pro');
            }}
            className={`py-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 text-xs font-semibold border transition-colors ${
              scanMode === 'gallery'
                ? 'bg-[#0EA75F] text-white border-[#00C853]'
                : 'bg-white/10 text-emerald-100 border-white/10 hover:bg-white/15'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Gallery</span>
          </button>

          <button
            type="button"
            onClick={() => setScanMode('link')}
            className={`py-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 text-xs font-semibold border transition-colors ${
              scanMode === 'link'
                ? 'bg-[#0EA75F] text-white border-[#00C853]'
                : 'bg-white/10 text-emerald-100 border-white/10 hover:bg-white/15'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Paste Link</span>
          </button>
        </div>

        {/* Sample Preset Thumbnails to Test Visual Scan */}
        <div>
          <span className="block text-[11px] text-emerald-200/90 mb-1.5">
            Tap any sample photo below to test instant visual factory matching:
          </span>
          <div className="grid grid-cols-4 gap-2">
            {products.slice(0, 4).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => triggerScanSimulation(p.id, p.name)}
                className={`p-1.5 rounded-xl bg-white/10 border text-center transition-all ${
                  p.id === targetProduct.id
                    ? 'border-[#00C853] ring-2 ring-[#00C853]/40'
                    : 'border-white/10 opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-full aspect-square rounded-lg object-cover mb-1"
                />
                <span className="block font-mono-num text-[10px] font-bold text-white truncate">
                  {formatPrice(p.totalLandedBdt)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Paste External Marketplace Link Resolver */}
      <form
        onSubmit={handleLinkLookup}
        className="bg-white rounded-2xl border border-slate-200/80 p-3.5 space-y-2.5"
      >
        <label className="block text-xs font-extrabold text-[#0B3D2E]">
          Paste AliExpress, Amazon, or Taobao Product Link
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            placeholder="https://aliexpress.com/item/smart-watch..."
            className="flex-1 h-10 px-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs text-[#0B3D2E] focus:outline-none focus:border-[#0EA75F]"
          />
          <button
            type="submit"
            className="h-10 px-3.5 rounded-xl bg-[#0EA75F] text-white text-xs font-bold shrink-0"
          >
            Calculate
          </button>
        </div>
        <p className="text-[11px] text-[#6B7280] flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#0EA75F]" />
          <span>Calculates exact Bangladesh customs duty + VAT in 1 click</span>
        </p>
      </form>

      {/* Similar Verified Products Grid */}
      <section>
        <h3 className="text-sm font-extrabold text-[#0B3D2E] mb-2.5">
          Similar Verified Products (Landed Cost Included)
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {products.slice(0, 4).map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>
    </div>
  );
};
