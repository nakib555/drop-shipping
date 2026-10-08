import React, { useState } from 'react';
import {
  Camera,
  CheckCircle2,
  Image as ImageIcon,
  Link2,
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
    const matched = products.find(
      (p) =>
        lower.includes(p.name.toLowerCase().split(' ')[0]) ||
        lower.includes(p.category.split('_')[0])
    );
    if (matched) {
      triggerScanSimulation(matched.id, matched.name);
    } else if (lower.includes('watch')) {
      triggerScanSimulation('prod-smartwatch-pro', 'Smart Watch Pro');
    } else if (lower.includes('laptop') || lower.includes('victus')) {
      triggerScanSimulation('prod-hp-victus-laptop', 'HP Victus Gaming Laptop');
    } else {
      triggerScanSimulation(products[0].id, products[0].name);
    }
  };

  return (
    <div className="p-4 space-y-4 pb-6 bg-[#F8FAFC]">
      {/* Dark Slate Visual Scanner Viewport */}
      <div className="rounded-2xl bg-slate-900 text-white p-4 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-white">
            Visual & Link Landed Cost Finder
          </span>
          <span className="font-mono-num text-[11px] text-emerald-400">
            Instant Match
          </span>
        </div>

        {/* Viewfinder Frame */}
        <div className="relative w-full aspect-square max-h-60 mx-auto rounded-xl bg-white overflow-hidden flex items-center justify-center p-4 border border-slate-700">
          <img
            src={targetProduct.image}
            alt={targetProduct.name}
            referrerPolicy="no-referrer"
            className={`w-full h-full object-contain transition-all duration-200 ${
              isScanning ? 'scale-105 blur-xs opacity-60' : 'opacity-95'
            }`}
          />

          {/* Continuous Sweeping Laser Scan Line */}
          <div className="absolute top-2 inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-[#059669] to-transparent shadow-[0_0_12px_2px_rgba(5,150,105,0.85)] animate-scan-laser pointer-events-none" />

          {/* Corner Viewfinder Brackets */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl-md pointer-events-none" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr-md pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl-md pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br-md pointer-events-none" />

          {/* Bottom Match Tag */}
          <div className="absolute bottom-3 inset-x-3 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-2.5 flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[10px] text-emerald-400 font-medium block">
                {isScanning ? 'Scanning global factories...' : 'Matched Verified Item'}
              </span>
              <span className="text-xs font-semibold text-white truncate block">
                {targetProduct.name}
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                navigateTo('product_detail', { productId: targetProduct.id })
              }
              className="px-3 py-1.5 rounded-lg bg-[#059669] text-white font-mono-num text-xs font-semibold shrink-0"
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
            className={`py-2.5 rounded-xl flex flex-col items-center justify-center gap-1 text-xs font-medium border transition-colors ${
              scanMode === 'camera'
                ? 'bg-[#059669] text-white border-[#059669]'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
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
            className={`py-2.5 rounded-xl flex flex-col items-center justify-center gap-1 text-xs font-medium border transition-colors ${
              scanMode === 'gallery'
                ? 'bg-[#059669] text-white border-[#059669]'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Gallery</span>
          </button>

          <button
            type="button"
            onClick={() => setScanMode('link')}
            className={`py-2.5 rounded-xl flex flex-col items-center justify-center gap-1 text-xs font-medium border transition-colors ${
              scanMode === 'link'
                ? 'bg-[#059669] text-white border-[#059669]'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Paste Link</span>
          </button>
        </div>

        {/* Sample Preset Thumbnails */}
        <div>
          <span className="block text-[11px] text-slate-400 mb-1.5">
            Tap any sample item to test visual factory matching:
          </span>
          <div className="grid grid-cols-4 gap-2">
            {products.slice(0, 4).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => triggerScanSimulation(p.id, p.name)}
                className={`p-1.5 rounded-xl bg-slate-800 border text-center transition-all ${
                  p.id === targetProduct.id
                    ? 'border-emerald-400'
                    : 'border-slate-700 opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-full aspect-square rounded-lg object-cover mb-1"
                />
                <span className="block font-mono-num text-[10px] font-semibold text-white truncate">
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
        className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2.5"
      >
        <label className="block text-xs font-semibold text-slate-900">
          Paste AliExpress, Amazon, or Taobao Product Link
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            placeholder="https://aliexpress.com/item/smart-watch..."
            className="flex-1 h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
          />
          <button
            type="submit"
            className="h-10 px-3.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shrink-0"
          >
            Calculate
          </button>
        </div>
        <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
          <span>Calculates exact Bangladesh customs duty + VAT in 1 click</span>
        </p>
      </form>

      {/* Similar Verified Products Grid */}
      <section className="space-y-2.5">
        <h3 className="text-sm font-semibold text-slate-900">
          Matched Global Catalog (Landed Price)
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {products.slice(0, 6).map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>
    </div>
  );
};
