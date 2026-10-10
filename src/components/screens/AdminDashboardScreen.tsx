import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  Edit3,
  Eye,
  PackageCheck,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';
import { CATEGORIES } from '../../data/catalogData';
import { calculateProductLandedQuote } from '../../services/pricingAndOrderEngine';
import { AppNotification, CategoryId, Product } from '../../types/deshimart';

type AdminTabId = 'overview' | 'orders' | 'catalog' | 'vouchers';

export const AdminDashboardScreen: React.FC = () => {
  const {
    user,
    switchUserRole,
    navigateTo,
    products,
    orders,
    promoVouchers,
    adminAuditLog,
    createPromoVoucher,
    togglePromoVoucher,
    adminAddProduct,
    adminUpdateProduct,
    adminDeleteProduct,
    adminAdvanceOrderStatus,
    adminBroadcastNotification,
    formatPrice,
    refreshCatalogFromApi,
    isLoadingProducts,
    language,
  } = useDeshiMart();

  const isBn = language === 'BN';

  const [activeTab, setActiveTab] = useState<AdminTabId>('overview');

  // Order filter state
  const [orderStatusFilter, setOrderStatusFilter] = useState<
    'All' | 'Processing' | 'Shipped' | 'Delivered'
  >('All');

  // Catalog search & filter state
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategory, setCatalogCategory] = useState<CategoryId>('all');

  // Product Modal (Add / Edit) docked in #mobile-sheet-root
  const [productSheetOpen, setProductSheetOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  //Destructive Delete Confirmation State
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const [formName, setFormName] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('Direct Factory Import');
  const [formCategory, setFormCategory] = useState<CategoryId>('electronics');
  const [formOrigin, setFormOrigin] = useState('Shenzhen, CN');
  const [formSupplier, setFormSupplier] = useState('Anker Official');
  const [formHsCode, setFormHsCode] = useState('8517.62.00');
  const [formBasePrice, setFormBasePrice] = useState('4500');
  const [formShipping, setFormShipping] = useState('450');
  const [formImage, setFormImage] = useState(
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80'
  );
  const [formInStock, setFormInStock] = useState(true);

  // Collapsible Voucher & Notice Forms to keep UI noise-free
  const [showNewVoucherForm, setShowNewVoucherForm] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherType, setVoucherType] = useState<'percent' | 'flat'>('percent');
  const [voucherValue, setVoucherValue] = useState('15');
  const [voucherMinOrder, setVoucherMinOrder] = useState('2000');
  const [voucherDesc, setVoucherDesc] = useState('15% off landed order total');

  const [showBroadcastForm, setShowBroadcastForm] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [broadcastType, setBroadcastType] =
    useState<AppNotification['type']>('promo');

  // Clean Store Metrics (Separates Gross Order Value, Delivered Settled Revenue, and Pending COD/Pipeline)
  const metrics = useMemo(() => {
    const totalRevenueBdt = orders.reduce((sum, o) => sum + o.totalBdt, 0);
    const settledRevenueBdt = orders
      .filter((o) => o.status === 'Delivered')
      .reduce((sum, o) => sum + o.totalBdt, 0);
    const pendingCodBdt = orders
      .filter((o) => o.status !== 'Delivered' && o.paymentMethod === 'cod')
      .reduce((sum, o) => sum + o.totalBdt, 0);
    const processingCount = orders.filter((o) => o.status === 'Processing').length;
    const shippedCount = orders.filter((o) => o.status === 'Shipped').length;
    const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;
    const inStockCount = products.filter((p) => p.inStock).length;
    const activeVouchersCount = promoVouchers.filter((v) => v.active).length;

    return {
      totalRevenueBdt,
      settledRevenueBdt,
      pendingCodBdt,
      processingCount,
      shippedCount,
      deliveredCount,
      inStockCount,
      activeVouchersCount,
    };
  }, [orders, products, promoVouchers]);

  const filteredOrders = useMemo(() => {
    if (orderStatusFilter === 'All') return orders;
    return orders.filter((o) => o.status === orderStatusFilter);
  }, [orders, orderStatusFilter]);

  const filteredCatalog = useMemo(() => {
    return products.filter((p) => {
      const matchesCat =
        catalogCategory === 'all' || p.category === catalogCategory;
      const q = catalogSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.supplierName.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [products, catalogCategory, catalogSearch]);

  // Screen-level Role Guard: Only authorized admins can access Admin Console
  if (!user.isLoggedIn || user.role !== 'admin') {
    return (
      <div className="p-6 flex-1 flex flex-col items-center justify-center text-center bg-app-bg space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div className="space-y-1 max-w-[280px]">
          <h2 className="text-base font-bold text-content-primary">
            {isBn ? 'অ্যাডমিন অ্যাক্সেস আবশ্যক' : 'Admin Access Required'}
          </h2>
          <p className="text-xs text-content-secondary leading-relaxed">
            {isBn
              ? 'এই কনসোলটি শুধুমাত্র অনুমোদিত DeshiMart স্টোর অ্যাডমিনিস্ট্রেটরদের জন্য সংরক্ষিত।'
              : 'This console is restricted to authorized DeshiMart store administrators.'}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="h-10 px-4 rounded-xl border border-app-border bg-white text-xs font-semibold text-content-primary"
          >
            {isBn ? 'হোমে ফিরুন' : 'Return Home'}
          </button>
          <button
            type="button"
            onClick={() => navigateTo('auth')}
            className="h-10 px-4 rounded-xl bg-brand-primary text-white text-xs font-semibold"
          >
            {isBn ? 'অ্যাডমিন লগইন' : 'Admin Sign In'}
          </button>
        </div>
      </div>
    );
  }

  const openAddProductModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSubtitle('Direct Factory Import');
    setFormCategory('electronics');
    setFormOrigin('Shenzhen, CN');
    setFormSupplier('DeshiMart Direct');
    setFormHsCode('8517.62.00');
    setFormBasePrice('3800');
    setFormShipping('420');
    setFormImage(
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80'
    );
    setFormInStock(true);
    setProductSheetOpen(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormSubtitle(prod.subtitle);
    setFormCategory(prod.category);
    setFormOrigin(prod.originLabel);
    setFormSupplier(prod.supplierName);
    setFormHsCode(prod.hsCode || '8517.62.00');
    setFormBasePrice(String(prod.productPriceBdt));
    setFormShipping(String(prod.shippingBdt));
    setFormImage(prod.image);
    setFormInStock(prod.inStock);
    setProductSheetOpen(true);
  };

  // Authoritative Landed Quote Preview via unified pricing engine (Zero inline formula duplication)
  const previewQuote = calculateProductLandedQuote({
    productId: editingProduct?.id || 'ADMIN-PREVIEW',
    category: formCategory,
    basePriceBdt: Math.max(50, Number(formBasePrice) || 0),
    shippingBdt: Math.max(0, Number(formShipping) || 0),
    hsCode: formHsCode,
  });

  const handleSaveProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const baseNum = Math.max(100, Number(formBasePrice) || 1500);
    const shipNum = Math.max(0, Number(formShipping) || 300);

    if (editingProduct) {
      const updatedQuote = calculateProductLandedQuote({
        productId: editingProduct.id,
        category: editingProduct.category,
        basePriceBdt: baseNum,
        shippingBdt: shipNum,
        hsCode: editingProduct.hsCode,
      });

      adminUpdateProduct(editingProduct.id, {
        name: formName.trim() || editingProduct.name,
        productPriceBdt: updatedQuote.basePriceBdt,
        shippingBdt: updatedQuote.freightBdt,
        importDutyBdt: updatedQuote.customsDutyBdt,
        vatBdt: updatedQuote.vatBdt,
        totalLandedBdt: updatedQuote.totalLandedBdt,
        inStock: formInStock,
      });
    } else {
      if (!formName.trim()) return;
      adminAddProduct({
        name: formName,
        subtitle: formSubtitle,
        category: formCategory,
        image: formImage,
        originLabel: formOrigin,
        supplierName: formSupplier,
        hsCode: formHsCode,
        productPriceBdt: baseNum,
        shippingBdt: shipNum,
        inStock: formInStock,
      });
    }
    setProductSheetOpen(false);
  };

  const handleCreateVoucherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;
    createPromoVoucher({
      code: voucherCode.trim().toUpperCase(),
      discountType: voucherType,
      value: Math.max(1, Number(voucherValue) || 10),
      minOrderBdt: Math.max(0, Number(voucherMinOrder) || 1000),
      maxDiscountBdt: voucherType === 'percent' ? 2000 : undefined,
      description: voucherDesc.trim() || 'Promotional discount',
      active: true,
    });
    setVoucherCode('');
    setShowNewVoucherForm(false);
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastBody.trim()) return;
    adminBroadcastNotification(broadcastTitle, broadcastBody, broadcastType);
    setBroadcastTitle('');
    setBroadcastBody('');
    setShowBroadcastForm(false);
  };

  return (
    <div className="p-4 space-y-4 pb-8 bg-app-bg">
      {/* 1. Clean Executive Header & Segmented Navigation */}
      <div className="rounded-2xl bg-white border border-app-border overflow-hidden">
        <div className="p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-brand-primary text-white font-bold text-sm flex items-center justify-center shrink-0">
              {user.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-content-primary truncate">
                {user.fullName}
              </h2>
              <p className="text-xs text-content-secondary truncate mt-0.5">
                {isBn ? 'অ্যাডমিন কনসোল' : 'Admin Account'} · {user.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => switchUserRole('customer')}
            className="min-h-[36px] px-3 rounded-lg bg-app-subtle hover:bg-slate-200/70 border border-app-border text-content-primary text-xs font-semibold shrink-0 transition-colors whitespace-nowrap"
          >
            {isBn ? 'কাস্টমার ভিউ' : 'Customer View'}
          </button>
        </div>

        {/* Clean 4-Tab Segmented Bar */}
        <div className="px-2 py-1.5 bg-app-subtle border-t border-app-border grid grid-cols-4 gap-1">
          {(
            [
              { id: 'overview', label: isBn ? 'ওভারভিউ' : 'Overview' },
              { id: 'orders', label: isBn ? 'অর্ডার' : 'Orders' },
              { id: 'catalog', label: isBn ? 'ক্যাটালগ' : 'Catalog' },
              { id: 'vouchers', label: isBn ? 'ভাউচার' : 'Vouchers' },
            ] as const
          ).map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-[36px] px-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  active
                    ? 'bg-brand-primary text-white'
                    : 'text-content-secondary hover:text-content-primary'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================== TAB 1: OVERVIEW ===================== */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Clean 2x2 Summary Grid (Single-Elevation, Zero Decorative Clutter) */}
          <div className="bg-white rounded-2xl border border-app-border overflow-hidden">
            <div className="grid grid-cols-2 divide-x divide-y divide-app-border">
              <div className="p-4">
                <p className="text-xs text-content-secondary">
                  {isBn ? 'মোট অর্ডার মূল্য' : 'Gross Order Volume'}
                </p>
                <p className="font-mono-num text-lg font-bold text-content-primary mt-1">
                  {formatPrice(metrics.totalRevenueBdt)}
                </p>
                <p className="text-[11px] text-content-secondary mt-0.5 tabular-nums">
                  Settled: {formatPrice(metrics.settledRevenueBdt)} · COD Due:{' '}
                  {formatPrice(metrics.pendingCodBdt)}
                </p>
              </div>

              <div className="p-4">
                <p className="text-xs text-content-secondary">
                  {isBn ? 'অর্ডার ফুলফিলমেন্ট' : 'Order Fulfillment'}
                </p>
                <p className="font-mono-num text-lg font-bold text-content-primary mt-1">
                  {metrics.processingCount} {isBn ? 'পেন্ডিং' : 'Pending'}
                </p>
                <p className="text-xs text-content-secondary mt-0.5">
                  {metrics.shippedCount} shipped · {metrics.deliveredCount} delivered
                </p>
              </div>

              <div className="p-4">
                <p className="text-xs text-content-secondary">
                  {isBn ? 'ক্যাটালগ স্টক' : 'Catalog Inventory'}
                </p>
                <p className="font-mono-num text-lg font-bold text-content-primary mt-1">
                  {metrics.inStockCount} {isBn ? 'স্টকে আছে' : 'In Stock'}
                </p>
                <p className="text-xs text-content-secondary mt-0.5">
                  {products.length} total products
                </p>
              </div>

              <div className="p-4">
                <p className="text-xs text-content-secondary">
                  {isBn ? 'সক্রিয় ভাউচার' : 'Active Vouchers'}
                </p>
                <p className="font-mono-num text-lg font-bold text-brand-primary mt-1">
                  {metrics.activeVouchersCount} {isBn ? 'সক্রিয়' : 'Active'}
                </p>
                <p className="text-xs text-content-secondary mt-0.5">
                  {promoVouchers.length} configured
                </p>
              </div>
            </div>
          </div>

          {/* Recent Orders Preview List */}
          <div className="bg-white rounded-2xl border border-app-border overflow-hidden">
            <div className="px-4 py-3.5 border-b border-app-border flex items-center justify-between">
              <h3 className="text-sm font-bold text-content-primary">
                {isBn ? 'সাম্প্রতিক অর্ডার' : 'Recent Orders'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className="text-xs font-semibold text-brand-primary hover:underline"
              >
                {isBn ? `সব দেখুন (${orders.length})` : `View All (${orders.length})`}
              </button>
            </div>
            <div className="divide-y divide-app-border">
              {orders.slice(0, 3).map((ord) => (
                <div
                  key={ord.id}
                  className="px-4 py-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="font-mono-num font-bold text-content-primary">
                        #{ord.id}
                      </span>
                      <span aria-hidden="true" className="text-content-muted">
                        ·
                      </span>
                      <span className="text-content-secondary truncate">
                        {ord.shippingAddress.fullName}
                      </span>
                    </div>
                    <p className="text-xs text-content-secondary mt-0.5">
                      {ord.status} · {ord.items.length} item(s)
                    </p>
                  </div>
                  <span className="font-mono-num text-xs font-bold text-content-primary shrink-0">
                    {formatPrice(ord.totalBdt)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Store Actions */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={openAddProductModal}
              className="min-h-[44px] px-4 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>{isBn ? 'পণ্য যোগ করুন' : 'Add Product'}</span>
            </button>

            <button
              type="button"
              disabled={isLoadingProducts}
              onClick={() => refreshCatalogFromApi()}
              className="min-h-[44px] px-4 rounded-xl bg-white hover:bg-app-subtle border border-app-border text-content-primary text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              <RefreshCw
                className={`w-4 h-4 text-brand-primary shrink-0 ${
                  isLoadingProducts ? 'animate-spin' : ''
                }`}
              />
              <span>{isBn ? 'ক্যাটালগ সিঙ্ক' : 'Sync Catalog'}</span>
            </button>
          </div>

          {/* Immutable Operations Audit Log */}
          <div className="bg-white rounded-2xl border border-app-border overflow-hidden">
            <div className="px-4 py-3 border-b border-app-border flex items-center justify-between">
              <h3 className="text-xs font-bold text-content-primary">
                {isBn ? 'অ্যাডমিন অপারেশন অডিট লগ' : 'Admin Operations Audit Trail'}
              </h3>
              <span className="text-[10px] font-mono-num text-content-muted">
                {adminAuditLog.length} events
              </span>
            </div>
            <div className="divide-y divide-app-border max-h-48 overflow-y-auto no-scrollbar">
              {adminAuditLog.slice(0, 8).map((entry) => (
                <div key={entry.id} className="px-4 py-2.5 text-xs space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono-num text-[10px] font-semibold text-brand-primary">
                      {entry.action}
                    </span>
                    <span className="text-[10px] font-mono-num text-content-muted">
                      {entry.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-content-primary leading-snug">
                    {entry.summary}
                  </p>
                  <p className="text-[10px] text-content-muted">
                    Actor: {entry.actorName} ({entry.actorRole})
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: ORDERS ===================== */}
      {activeTab === 'orders' && (
        <div className="space-y-3.5">
          {/* Status Filter Bar */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-app-border">
            {(['All', 'Processing', 'Shipped', 'Delivered'] as const).map(
              (st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setOrderStatusFilter(st)}
                  className={`flex-1 min-h-[36px] px-2.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                    orderStatusFilter === st
                      ? 'bg-brand-primary text-white'
                      : 'text-content-secondary hover:text-content-primary'
                  }`}
                >
                  {st}
                </button>
              )
            )}
          </div>

          <div className="space-y-3">
            {filteredOrders.map((ord) => {
              const isDelivered = ord.status === 'Delivered';
              const isShipped = ord.status === 'Shipped';
              return (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl border border-app-border p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-mono-num text-sm font-bold text-content-primary">
                          #{ord.id}
                        </span>
                        <span aria-hidden="true" className="text-content-muted">
                          ·
                        </span>
                        <span
                          className={`font-semibold flex items-center gap-1 ${
                            isDelivered
                              ? 'text-status-success'
                              : isShipped
                              ? 'text-status-transit'
                              : 'text-status-warning'
                          }`}
                        >
                          {isDelivered ? (
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          ) : isShipped ? (
                            <Truck className="w-3.5 h-3.5 shrink-0" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                          )}
                          <span>{ord.status}</span>
                        </span>
                      </div>
                      <p className="text-xs text-content-secondary mt-1 truncate">
                        {ord.shippingAddress.fullName} · {ord.shippingAddress.city}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-mono-num text-sm font-bold text-content-primary">
                        {formatPrice(ord.totalBdt)}
                      </p>
                      <p className="text-xs text-content-secondary mt-0.5">
                        {ord.items.length} item(s)
                      </p>
                    </div>
                  </div>

                  {/* Line Items */}
                  <div className="space-y-2 pt-2.5 border-t border-app-border">
                    {ord.items.map((item, idx) => (
                      <div
                        key={`${ord.id}-${idx}`}
                        className="flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-lg object-cover border border-app-border shrink-0"
                          />
                          <span className="text-content-primary font-medium truncate">
                            {item.quantity}x {item.name}
                          </span>
                        </div>
                        <span className="font-mono-num text-content-secondary shrink-0 ml-2">
                          {formatPrice(item.landedUnitBdt * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Fulfillment Actions */}
                  <div className="flex items-center gap-2 pt-2.5 border-t border-app-border">
                    <button
                      type="button"
                      onClick={() =>
                        navigateTo('order_tracking', { orderId: ord.id })
                      }
                      className="min-h-[38px] px-3 rounded-xl border border-app-border text-xs font-semibold text-content-primary hover:bg-app-subtle flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Eye className="w-3.5 h-3.5 text-content-secondary" />
                      <span>Track</span>
                    </button>

                    {!isDelivered ? (
                      <button
                        type="button"
                        onClick={() => adminAdvanceOrderStatus(ord.id)}
                        className="flex-1 min-h-[38px] px-3 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <PackageCheck className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {ord.status === 'Processing'
                            ? 'Mark Shipped'
                            : 'Mark Delivered'}
                        </span>
                      </button>
                    ) : (
                      <div className="flex-1 min-h-[38px] px-3 rounded-xl bg-brand-subtle text-brand-primary text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================== TAB 3: CATALOG ===================== */}
      {activeTab === 'catalog' && (
        <div className="space-y-3.5">
          <div className="bg-white rounded-2xl border border-app-border p-3.5 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 h-10 px-3 rounded-xl bg-app-subtle border border-app-border focus-within:border-brand-primary transition-colors">
                <Search className="w-4 h-4 text-content-secondary shrink-0" />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 bg-transparent border-0 outline-none text-xs text-content-primary"
                />
                {catalogSearch && (
                  <button
                    type="button"
                    onClick={() => setCatalogSearch('')}
                    className="text-content-muted hover:text-content-primary"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={openAddProductModal}
                className="h-10 px-3.5 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setCatalogCategory('all')}
                className={`min-h-[30px] px-2.5 rounded-lg text-xs font-semibold shrink-0 transition-colors whitespace-nowrap ${
                  catalogCategory === 'all'
                    ? 'bg-brand-primary text-white'
                    : 'bg-app-subtle text-content-secondary hover:text-content-primary'
                }`}
              >
                All ({products.length})
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCatalogCategory(cat.id)}
                  className={`min-h-[30px] px-2.5 rounded-lg text-xs font-semibold shrink-0 transition-colors whitespace-nowrap ${
                    catalogCategory === cat.id
                      ? 'bg-brand-primary text-white'
                      : 'bg-app-subtle text-content-secondary hover:text-content-primary'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-app-border divide-y divide-app-border overflow-hidden">
            {filteredCatalog.slice(0, 25).map((prod) => (
              <div key={prod.id} className="p-3.5 space-y-2.5">
                <div className="flex items-center gap-3">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    onClick={() =>
                      navigateTo('product_detail', { productId: prod.id })
                    }
                    className="w-12 h-12 rounded-xl object-cover border border-app-border shrink-0 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        onClick={() =>
                          navigateTo('product_detail', { productId: prod.id })
                        }
                        className="text-xs font-bold text-content-primary truncate cursor-pointer hover:underline"
                      >
                        {prod.name}
                      </h4>
                      <span className="font-mono-num text-xs font-bold text-content-primary shrink-0">
                        {formatPrice(prod.totalLandedBdt)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-0.5 text-xs text-content-secondary">
                      <span className="truncate">
                        {prod.supplierName} · {prod.originLabel}
                      </span>
                      <span
                        className={`font-medium shrink-0 ${
                          prod.inStock
                            ? 'text-status-success'
                            : 'text-promo-accent'
                        }`}
                      >
                        {prod.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditProductModal(prod)}
                      className="min-h-[32px] px-2.5 rounded-lg bg-app-subtle hover:bg-slate-200/70 text-xs font-semibold text-content-primary flex items-center gap-1 whitespace-nowrap"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Price</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        adminUpdateProduct(prod.id, { inStock: !prod.inStock })
                      }
                      className="min-h-[32px] px-2.5 rounded-lg border border-app-border text-xs font-medium text-content-secondary hover:text-content-primary whitespace-nowrap"
                    >
                      {prod.inStock ? 'Pause Stock' : 'Restock'}
                    </button>
                  </div>

                  <button
                    type="button"
                    aria-label={`Delete ${prod.name}`}
                    onClick={() => setDeletingProduct(prod)}
                    className="w-8 h-8 rounded-lg text-content-muted hover:text-promo-accent hover:bg-promo-subtle flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 4: VOUCHERS & ALERTS ===================== */}
      {activeTab === 'vouchers' && (
        <div className="space-y-4">
          {/* Vouchers List Card */}
          <div className="bg-white rounded-2xl border border-app-border overflow-hidden">
            <div className="p-4 border-b border-app-border flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-content-primary">
                  Promo Vouchers
                </h3>
                <p className="text-xs text-content-secondary mt-0.5">
                  Active codes apply directly in the Shopping Bag
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewVoucherForm((v) => !v)}
                className="min-h-[36px] px-3 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showNewVoucherForm ? 'Close' : 'New Voucher'}</span>
              </button>
            </div>

            {showNewVoucherForm && (
              <form
                onSubmit={handleCreateVoucherSubmit}
                className="p-4 bg-app-subtle/60 border-b border-app-border space-y-3"
              >
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-content-secondary mb-1">
                      Voucher Code
                    </label>
                    <input
                      type="text"
                      required
                      value={voucherCode}
                      onChange={(e) =>
                        setVoucherCode(e.target.value.toUpperCase())
                      }
                      placeholder="EID2026"
                      className="w-full h-10 px-3 rounded-xl bg-white border border-app-border font-mono-num text-xs font-bold text-content-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-content-secondary mb-1">
                      Discount Type
                    </label>
                    <select
                      value={voucherType}
                      onChange={(e) =>
                        setVoucherType(e.target.value as 'percent' | 'flat')
                      }
                      className="w-full h-10 px-3 rounded-xl bg-white border border-app-border text-xs text-content-primary"
                    >
                      <option value="percent">Percentage (%)</option>
                      <option value="flat">Flat BDT (৳)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-content-secondary mb-1">
                      {voucherType === 'percent' ? 'Percent (%)' : 'Amount (৳)'}
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={voucherValue}
                      onChange={(e) => setVoucherValue(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-white border border-app-border font-mono-num text-xs text-content-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-content-secondary mb-1">
                      Min Order (৳)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={voucherMinOrder}
                      onChange={(e) => setVoucherMinOrder(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-white border border-app-border font-mono-num text-xs text-content-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-content-secondary mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={voucherDesc}
                    onChange={(e) => setVoucherDesc(e.target.value)}
                    placeholder="15% off landed order total"
                    className="w-full h-10 px-3 rounded-xl bg-white border border-app-border text-xs text-content-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[40px] rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold transition-colors"
                >
                  Save Voucher
                </button>
              </form>
            )}

            <div className="divide-y divide-app-border">
              {promoVouchers.map((v) => (
                <div
                  key={v.code}
                  className="px-4 py-3.5 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono-num font-bold text-content-primary">
                        {v.code}
                      </span>
                      <span aria-hidden="true" className="text-content-muted">
                        ·
                      </span>
                      <span className="font-semibold text-brand-primary">
                        {v.discountType === 'percent'
                          ? `${v.value}% Off`
                          : `৳ ${v.value} Off`}
                      </span>
                    </div>
                    <p className="text-xs text-content-secondary mt-0.5 truncate">
                      {v.description} · Min {formatPrice(v.minOrderBdt)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => togglePromoVoucher(v.code)}
                    className={`min-h-[32px] px-3 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                      v.active
                        ? 'bg-brand-subtle text-brand-primary border border-brand-border'
                        : 'bg-app-subtle text-content-secondary border border-app-border'
                    }`}
                  >
                    {v.active ? 'Active' : 'Paused'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Notification Broadcast (Collapsible to keep screen clean) */}
          <div className="bg-white rounded-2xl border border-app-border overflow-hidden">
            <div className="p-4 flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-content-primary">
                  Customer Announcements
                </h3>
                <p className="text-xs text-content-secondary mt-0.5">
                  Send an order or deal update to the customer notification feed
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBroadcastForm((v) => !v)}
                className="min-h-[36px] px-3 rounded-xl border border-app-border hover:bg-app-subtle text-xs font-semibold text-content-primary shrink-0 whitespace-nowrap"
              >
                {showBroadcastForm ? 'Cancel' : 'New Alert'}
              </button>
            </div>

            {showBroadcastForm && (
              <form
                onSubmit={handleBroadcastSubmit}
                className="p-4 pt-0 space-y-3 border-t border-app-border bg-app-subtle/40"
              >
                <div className="pt-3 grid grid-cols-3 gap-1">
                  {(
                    [
                      { id: 'promo', label: 'Promotion' },
                      { id: 'price_drop', label: 'Price Drop' },
                      { id: 'arrival', label: 'Arrival' },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setBroadcastType(t.id)}
                      className={`min-h-[32px] rounded-lg text-xs font-semibold transition-colors ${
                        broadcastType === t.id
                          ? 'bg-brand-primary text-white'
                          : 'bg-white border border-app-border text-content-secondary'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-medium text-content-secondary mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    placeholder="Weekend Flash Drop: 15% Off Electronics"
                    className="w-full h-10 px-3 rounded-xl bg-white border border-app-border text-xs text-content-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-content-secondary mb-1">
                    Message
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={broadcastBody}
                    onChange={(e) => setBroadcastBody(e.target.value)}
                    placeholder="Use code DESHI10 at checkout for instant savings."
                    className="w-full p-3 rounded-xl bg-white border border-app-border text-xs text-content-primary resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[40px] rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Notification</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Viewport-Docked Add/Edit Product Bottom Sheet Modal (3-Zone Layout) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {productSheetOpen && (
              <div
                role="dialog"
                aria-modal="true"
                aria-label={editingProduct ? 'Edit Product' : 'Add Product'}
                className="pointer-events-auto absolute inset-0 z-50 flex items-end justify-center"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setProductSheetOpen(false)}
                  className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
                />
                <motion.form
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  onSubmit={handleSaveProductSubmit}
                  className="relative z-10 w-full max-h-[85%] flex flex-col bg-white rounded-t-3xl shadow-2xl border-t border-app-border overflow-hidden"
                >
                  {/* Zone 1: Pinned Header */}
                  <div className="px-4 pt-3 pb-3 border-b border-app-border shrink-0 bg-white">
                    <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-2.5" />
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-content-primary">
                        {editingProduct ? 'Edit Product Price' : 'Add New Product'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setProductSheetOpen(false)}
                        className="h-8 px-2.5 rounded-lg bg-app-subtle hover:bg-slate-200/70 text-xs font-semibold text-content-secondary hover:text-content-primary"
                      >
                        Close
                      </button>
                    </div>
                  </div>

                  {/* Zone 2: Scrollable Form Body */}
                  <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-3.5 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-content-secondary mb-1">
                        Product Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Sony WH-1000XM5 Wireless Headphones"
                        className="w-full h-10 px-3 rounded-xl bg-app-subtle border border-app-border text-xs text-content-primary"
                      />
                    </div>

                    {!editingProduct && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-content-secondary mb-1">
                            Category
                          </label>
                          <select
                            value={formCategory}
                            onChange={(e) =>
                              setFormCategory(e.target.value as CategoryId)
                            }
                            className="w-full h-10 px-3 rounded-xl bg-app-subtle border border-app-border text-xs text-content-primary"
                          >
                            {CATEGORIES.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-content-secondary mb-1">
                            Supplier
                          </label>
                          <input
                            type="text"
                            value={formSupplier}
                            onChange={(e) => setFormSupplier(e.target.value)}
                            placeholder="Anker Official"
                            className="w-full h-10 px-3 rounded-xl bg-app-subtle border border-app-border text-xs text-content-primary"
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-content-secondary mb-1">
                          Base Price (৳)
                        </label>
                        <input
                          type="number"
                          required
                          min={50}
                          value={formBasePrice}
                          onChange={(e) => setFormBasePrice(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl bg-app-subtle border border-app-border font-mono-num text-xs text-content-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-content-secondary mb-1">
                          Shipping (৳)
                        </label>
                        <input
                          type="number"
                          required
                          min={0}
                          value={formShipping}
                          onChange={(e) => setFormShipping(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl bg-app-subtle border border-app-border font-mono-num text-xs text-content-primary"
                        />
                      </div>
                    </div>

                    {/* Authoritative Landed Quote Summary */}
                    <div className="p-3 rounded-xl bg-brand-subtle border border-brand-border space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-content-primary">
                          Landed Total (incl. Duty & VAT)
                        </span>
                        <span className="font-mono-num text-sm font-bold text-brand-primary">
                          {formatPrice(previewQuote.totalLandedBdt)}
                        </span>
                      </div>
                      <p className="text-[11px] text-content-secondary tabular-nums">
                        Duty: {formatPrice(previewQuote.customsDutyBdt)} · VAT:{' '}
                        {formatPrice(previewQuote.vatBdt)} · Rule:{' '}
                        {previewQuote.ruleVersion}
                      </p>
                    </div>
                  </div>

                  {/* Zone 3: Pinned Footer */}
                  <div className="px-4 pt-3 pb-[max(0.875rem,env(safe-area-inset-bottom))] border-t border-app-border bg-white shrink-0 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setProductSheetOpen(false)}
                      className="flex-1 h-11 rounded-xl border border-app-border text-xs font-semibold text-content-primary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 h-11 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold transition-colors"
                    >
                      {editingProduct ? 'Save Changes' : 'Add Product'}
                    </button>
                  </div>
                </motion.form>
              </div>
            )}

            {/* Destructive Product Deletion Confirmation Sheet */}
            {deletingProduct && (
              <div
                role="alertdialog"
                aria-modal="true"
                aria-label="Confirm product deletion"
                className="pointer-events-auto absolute inset-0 z-50 flex items-end justify-center"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setDeletingProduct(null)}
                  className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
                />
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  className="relative z-10 w-full bg-white rounded-t-3xl p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl border-t border-app-border space-y-3.5"
                >
                  <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" />
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-content-primary">
                      Delete Product from Catalog?
                    </h3>
                    <p className="text-xs text-content-secondary leading-relaxed">
                      Are you sure you want to remove{' '}
                      <strong className="text-content-primary font-semibold">
                        {deletingProduct.name}
                      </strong>
                      ? This action will be recorded in the admin audit trail.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDeletingProduct(null)}
                      className="flex-1 h-11 rounded-xl border border-app-border text-xs font-semibold text-content-primary"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        adminDeleteProduct(deletingProduct.id);
                        setDeletingProduct(null);
                      }}
                      className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
                    >
                      Confirm Delete
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.getElementById('mobile-sheet-root') || document.body
        )}
    </div>
  );
};
