import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  BadgeCheck,
  Bell,
  Box,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Edit3,
  Eye,
  FileCheck2,
  Filter,
  Globe,
  Layers,
  Package,
  PackageCheck,
  PackagePlus,
  Percent,
  Plane,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Tag,
  Trash2,
  TrendingUp,
  Truck,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';
import { CATEGORIES } from '../../data/catalogData';
import { AppNotification, CategoryId, Product } from '../../types/deshimart';

type AdminTabId = 'overview' | 'orders' | 'catalog' | 'marketing';

export const AdminDashboardScreen: React.FC = () => {
  const {
    user,
    switchUserRole,
    navigateTo,
    products,
    orders,
    promoVouchers,
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
  } = useDeshiMart();

  const [activeTab, setActiveTab] = useState<AdminTabId>('overview');

  // Order filter state
  const [orderStatusFilter, setOrderStatusFilter] = useState<
    'All' | 'Processing' | 'Shipped' | 'Delivered'
  >('All');

  // Catalog search & filter state
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategory, setCatalogCategory] = useState<CategoryId>('all');

  // Product Modal (Add / Edit) docked above BottomTabBar via #mobile-sheet-root
  const [productSheetOpen, setProductSheetOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formName, setFormName] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('Direct Factory Import · Pre-Cleared');
  const [formCategory, setFormCategory] = useState<CategoryId>('electronics');
  const [formOrigin, setFormOrigin] = useState('Shenzhen, CN');
  const [formSupplier, setFormSupplier] = useState('Anker Global Official');
  const [formHsCode, setFormHsCode] = useState('8517.62.00');
  const [formBasePrice, setFormBasePrice] = useState('4500');
  const [formShipping, setFormShipping] = useState('450');
  const [formImage, setFormImage] = useState(
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80'
  );
  const [formInStock, setFormInStock] = useState(true);

  // Promo Voucher Form State
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherType, setVoucherType] = useState<'percent' | 'flat'>('percent');
  const [voucherValue, setVoucherValue] = useState('15');
  const [voucherMinOrder, setVoucherMinOrder] = useState('2000');
  const [voucherDesc, setVoucherDesc] = useState(
    '15% off landed duties & air freight'
  );

  // Broadcast Alert Form State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [broadcastType, setBroadcastType] =
    useState<AppNotification['type']>('promo');

  // Operational Metrics
  const metrics = useMemo(() => {
    const totalGmvBdt = orders.reduce((sum, o) => sum + o.totalBdt, 0);
    const processingCount = orders.filter((o) => o.status === 'Processing').length;
    const shippedCount = orders.filter((o) => o.status === 'Shipped').length;
    const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;
    const inStockCount = products.filter((p) => p.inStock).length;
    const outOfStockCount = products.length - inStockCount;
    const verifiedSuppliersCount = new Set(
      products.filter((p) => p.verifiedSupplier).map((p) => p.supplierName)
    ).size;
    const estimatedDutyCollectedBdt = Math.round(totalGmvBdt * 0.21);

    return {
      totalGmvBdt,
      processingCount,
      shippedCount,
      deliveredCount,
      inStockCount,
      outOfStockCount,
      verifiedSuppliersCount,
      estimatedDutyCollectedBdt,
    };
  }, [orders, products]);

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
        p.supplierName.toLowerCase().includes(q) ||
        (p.hsCode && p.hsCode.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [products, catalogCategory, catalogSearch]);

  const openAddProductModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSubtitle('Direct Factory Import · Customs Pre-Cleared');
    setFormCategory('electronics');
    setFormOrigin('Shenzhen, CN');
    setFormSupplier('DeshiMart Verified Hub');
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

  const handleSaveProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const baseNum = Math.max(100, Number(formBasePrice) || 1500);
    const shipNum = Math.max(0, Number(formShipping) || 300);

    if (editingProduct) {
      const duty = Math.round(baseNum * 0.1);
      const vat = Math.round((baseNum + duty) * 0.15);
      adminUpdateProduct(editingProduct.id, {
        name: formName.trim() || editingProduct.name,
        productPriceBdt: baseNum,
        shippingBdt: shipNum,
        importDutyBdt: duty,
        vatBdt: vat,
        totalLandedBdt: baseNum + shipNum + duty + vat,
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
      description:
        voucherDesc.trim() || 'Verified Cross-Border Landed Discount',
      active: true,
    });
    setVoucherCode('');
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastBody.trim()) return;
    adminBroadcastNotification(broadcastTitle, broadcastBody, broadcastType);
    setBroadcastTitle('');
    setBroadcastBody('');
  };

  // Live preview of landed cost inside the Add/Edit modal
  const previewBase = Math.max(0, Number(formBasePrice) || 0);
  const previewShip = Math.max(0, Number(formShipping) || 0);
  const previewDuty = Math.round(previewBase * 0.1);
  const previewVat = Math.round((previewBase + previewDuty) * 0.15);
  const previewLanded = previewBase + previewShip + previewDuty + previewVat;

  return (
    <div className="p-4 space-y-4 pb-8 bg-app-bg">
      {/* 1. Admin Identity & Mode Switch Banner */}
      <div className="rounded-2xl bg-slate-900 text-white p-4 shadow-sm border border-slate-800 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold text-sm flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/25">
                  Admin Console
                </span>
                <span className="text-[11px] text-slate-400 truncate">
                  Dhaka Customs Hub
                </span>
              </div>
              <h2 className="text-sm font-bold text-white truncate mt-1">
                {user.fullName}
              </h2>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => switchUserRole('customer')}
            className="h-9 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 border border-white/10 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Customer View</span>
          </button>
        </div>

        {/* Sub-navigation Segmented Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-800/90 border border-slate-700/70">
          {(
            [
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'orders', label: `Orders (${orders.length})`, icon: Truck },
              { id: 'catalog', label: `Catalog (${products.length})`, icon: Box },
              { id: 'marketing', label: 'Promos', icon: Tag },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`h-9 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all ${
                  active
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================== TAB 1: EXECUTIVE OVERVIEW & CUSTOMS KPIs ===================== */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* 4-Card Executive Telemetry Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white rounded-xl border border-app-border p-3.5 space-y-1">
              <div className="flex items-center justify-between text-xs text-content-secondary">
                <span>Total Landed GMV</span>
                <TrendingUp className="w-4 h-4 text-brand-primary" />
              </div>
              <p className="font-mono-num text-lg font-bold text-content-primary">
                {formatPrice(metrics.totalGmvBdt)}
              </p>
              <p className="text-[11px] text-status-success font-medium">
                +18.4% vs last 30d · Escrow Verified
              </p>
            </div>

            <div className="bg-white rounded-xl border border-app-border p-3.5 space-y-1">
              <div className="flex items-center justify-between text-xs text-content-secondary">
                <span>Customs Queue</span>
                <Plane className="w-4 h-4 text-amber-500" />
              </div>
              <p className="font-mono-num text-lg font-bold text-content-primary">
                {metrics.processingCount} Pending
              </p>
              <p className="text-[11px] text-content-secondary">
                {metrics.shippedCount} In Transit · {metrics.deliveredCount} Delivered
              </p>
            </div>

            <div className="bg-white rounded-xl border border-app-border p-3.5 space-y-1">
              <div className="flex items-center justify-between text-xs text-content-secondary">
                <span>Active Global SKUs</span>
                <Layers className="w-4 h-4 text-brand-primary" />
              </div>
              <p className="font-mono-num text-lg font-bold text-content-primary">
                {metrics.inStockCount} / {products.length}
              </p>
              <p className="text-[11px] text-content-secondary">
                {metrics.verifiedSuppliersCount} Verified Factory Hubs
              </p>
            </div>

            <div className="bg-white rounded-xl border border-app-border p-3.5 space-y-1">
              <div className="flex items-center justify-between text-xs text-content-secondary">
                <span>BD Duty & VAT Settled</span>
                <FileCheck2 className="w-4 h-4 text-brand-primary" />
              </div>
              <p className="font-mono-num text-lg font-bold text-content-primary">
                {formatPrice(metrics.estimatedDutyCollectedBdt)}
              </p>
              <p className="text-[11px] text-status-success font-medium">
                100% Pre-Cleared HS-Codes
              </p>
            </div>
          </div>

          {/* Live Corridor Health Status */}
          <div className="bg-white rounded-xl border border-app-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-content-primary">
                  Global Import Corridor Telemetry
                </h3>
                <p className="text-xs text-content-secondary">
                  Real-time air freight & Dhaka HS-Code clearance SLA
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-brand-subtle text-brand-primary text-[11px] font-semibold">
                All Hubs Online
              </span>
            </div>

            <div className="space-y-2.5 pt-1">
              {[
                {
                  corridor: 'Shenzhen (SZX) → Dhaka (DAC)',
                  leadTime: '4.8 Days Avg',
                  clearanceRate: '99.4%',
                  activeLoads: '14 Air Pallets',
                },
                {
                  corridor: 'Guangzhou (CAN) → Chattogram / Dhaka',
                  leadTime: '6.2 Days Avg',
                  clearanceRate: '98.9%',
                  activeLoads: '9 Consolidated Containers',
                },
                {
                  corridor: 'Singapore / Tokyo Express Hub → DAC',
                  leadTime: '3.5 Days Avg',
                  clearanceRate: '99.8%',
                  activeLoads: '6 Priority Parcels',
                },
              ].map((hub) => (
                <div
                  key={hub.corridor}
                  className="p-3 rounded-xl bg-app-subtle border border-app-border flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-content-primary truncate">
                      {hub.corridor}
                    </p>
                    <p className="text-[11px] text-content-secondary mt-0.5">
                      {hub.activeLoads} · Lead time: {hub.leadTime}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono-num text-xs font-bold text-brand-primary">
                      {hub.clearanceRate}
                    </span>
                    <p className="text-[10px] text-content-secondary">On-Time SLA</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Operations Actions */}
          <div className="bg-white rounded-xl border border-app-border p-4 space-y-3">
            <h3 className="text-sm font-bold text-content-primary">
              Quick Merchandising & Operations
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={openAddProductModal}
                className="h-11 px-3 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <PackagePlus className="w-4 h-4" />
                <span>Add Global Product</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className="h-11 px-3 rounded-xl bg-app-subtle hover:bg-slate-200/70 border border-app-border text-content-primary text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Truck className="w-4 h-4 text-brand-primary" />
                <span>Dispatch Orders ({metrics.processingCount})</span>
              </button>

              <button
                type="button"
                disabled={isLoadingProducts}
                onClick={() => refreshCatalogFromApi()}
                className="h-11 px-3 rounded-xl bg-app-subtle hover:bg-slate-200/70 border border-app-border text-content-primary text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 text-brand-primary ${
                    isLoadingProducts ? 'animate-spin' : ''
                  }`}
                />
                <span>Sync Global API</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('marketing')}
                className="h-11 px-3 rounded-xl bg-app-subtle hover:bg-slate-200/70 border border-app-border text-content-primary text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Tag className="w-4 h-4 text-brand-primary" />
                <span>Manage Vouchers ({promoVouchers.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: ORDERS & CUSTOMS FULFILLMENT ===================== */}
      {activeTab === 'orders' && (
        <div className="space-y-3.5">
          <div className="bg-white rounded-xl border border-app-border p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-content-primary">
                  Customs & Courier Dispatch Queue
                </h3>
                <p className="text-xs text-content-secondary">
                  Advance milestones & issue Dhaka customs clearance
                </p>
              </div>
              <span className="font-mono-num text-xs font-bold text-brand-primary">
                {filteredOrders.length} Orders
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {(['All', 'Processing', 'Shipped', 'Delivered'] as const).map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setOrderStatusFilter(st)}
                    className={`h-8 px-3 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                      orderStatusFilter === st
                        ? 'bg-content-primary text-white'
                        : 'bg-app-subtle text-content-secondary hover:text-content-primary'
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="space-y-3">
            {filteredOrders.map((ord) => {
              const isDelivered = ord.status === 'Delivered';
              return (
                <div
                  key={ord.id}
                  className="bg-white rounded-xl border border-app-border p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono-num text-sm font-bold text-content-primary">
                          #{ord.id}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                            ord.status === 'Delivered'
                              ? 'bg-brand-subtle text-brand-primary'
                              : ord.status === 'Shipped'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-amber-50 text-amber-800'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-xs text-content-secondary mt-0.5">
                        Recipient: <strong className="text-content-primary">{ord.shippingAddress.fullName}</strong> · {ord.shippingAddress.city}
                      </p>
                      <p className="font-mono-num text-[11px] text-content-secondary">
                        Tracking: {ord.trackingCode} ({ord.courierName})
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-mono-num text-sm font-bold text-content-primary">
                        {formatPrice(ord.totalBdt)}
                      </p>
                      <p className="text-[11px] text-content-secondary uppercase">
                        {ord.paymentMethod} · {ord.shippingMethod}
                      </p>
                    </div>
                  </div>

                  {/* Order Line Items Summary */}
                  <div className="space-y-1.5 pt-2 border-t border-app-border">
                    {ord.items.map((item, idx) => (
                      <div
                        key={`${ord.id}-${idx}`}
                        className="flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-md object-cover border border-app-border shrink-0"
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

                  {/* Admin Fulfillment Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-app-border">
                    <button
                      type="button"
                      onClick={() =>
                        navigateTo('order_tracking', { orderId: ord.id })
                      }
                      className="h-9 px-3 rounded-lg border border-app-border text-xs font-semibold text-content-primary hover:bg-app-subtle flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Radar</span>
                    </button>

                    {!isDelivered ? (
                      <button
                        type="button"
                        onClick={() => adminAdvanceOrderStatus(ord.id)}
                        className="flex-1 h-9 px-3 rounded-lg bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <PackageCheck className="w-3.5 h-3.5" />
                        <span>
                          {ord.status === 'Processing'
                            ? 'Approve Customs & Dispatch Air Freight'
                            : 'Mark Delivered by eCourier'}
                        </span>
                      </button>
                    ) : (
                      <div className="flex-1 h-9 px-3 rounded-lg bg-brand-subtle text-brand-primary text-xs font-semibold flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Fulfilled & Tax Invoice Issued</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================== TAB 3: CATALOG & LANDED PRICING CONTROL ===================== */}
      {activeTab === 'catalog' && (
        <div className="space-y-3.5">
          <div className="bg-white rounded-xl border border-app-border p-3.5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-content-primary">
                  Global Catalog & Landed Cost Engine
                </h3>
                <p className="text-xs text-content-secondary">
                  Manage factory base cost, air freight, 10% duty & 15% VAT
                </p>
              </div>
              <button
                type="button"
                onClick={openAddProductModal}
                className="h-9 px-3 rounded-lg bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New SKU</span>
              </button>
            </div>

            {/* Search & Category Filter */}
            <div className="flex items-center gap-2 h-10 px-3 rounded-lg bg-app-subtle border border-app-border">
              <Search className="w-4 h-4 text-content-secondary shrink-0" />
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Search SKU name, supplier, or HS-Code..."
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

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setCatalogCategory('all')}
                className={`h-7 px-2.5 rounded-md text-[11px] font-semibold shrink-0 ${
                  catalogCategory === 'all'
                    ? 'bg-content-primary text-white'
                    : 'bg-app-subtle text-content-secondary'
                }`}
              >
                All ({products.length})
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCatalogCategory(cat.id)}
                  className={`h-7 px-2.5 rounded-md text-[11px] font-semibold shrink-0 ${
                    catalogCategory === cat.id
                      ? 'bg-content-primary text-white'
                      : 'bg-app-subtle text-content-secondary'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredCatalog.slice(0, 25).map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-xl border border-app-border p-3.5 space-y-2.5"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    onClick={() =>
                      navigateTo('product_detail', { productId: prod.id })
                    }
                    className="w-14 h-14 rounded-lg object-cover border border-app-border shrink-0 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        onClick={() =>
                          navigateTo('product_detail', { productId: prod.id })
                        }
                        className="text-xs font-bold text-content-primary truncate cursor-pointer hover:underline"
                      >
                        {prod.name}
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                          prod.inStock
                            ? 'bg-brand-subtle text-brand-primary'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {prod.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    <p className="text-[11px] text-content-secondary truncate">
                      {prod.supplierName} · {prod.originLabel} · HS:{' '}
                      <span className="font-mono-num">
                        {prod.hsCode || '8517.62'}
                      </span>
                    </p>

                    {/* Landed Cost Formula Breakdown */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-content-secondary font-mono-num">
                      <span>Base: {formatPrice(prod.productPriceBdt)}</span>
                      <span>Freight: {formatPrice(prod.shippingBdt)}</span>
                      <span>
                        Duty+VAT:{' '}
                        {formatPrice(prod.importDutyBdt + prod.vatBdt)}
                      </span>
                      <span className="font-bold text-content-primary">
                        Landed: {formatPrice(prod.totalLandedBdt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-app-border">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        adminUpdateProduct(prod.id, { inStock: !prod.inStock })
                      }
                      className="h-8 px-2.5 rounded-lg border border-app-border text-[11px] font-semibold text-content-primary hover:bg-app-subtle"
                    >
                      {prod.inStock ? 'Mark Out of Stock' : 'Restock SKU'}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditProductModal(prod)}
                      className="h-8 px-2.5 rounded-lg bg-app-subtle hover:bg-slate-200/70 text-[11px] font-semibold text-content-primary flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Landed Price</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    aria-label="Delete product"
                    onClick={() => adminDeleteProduct(prod.id)}
                    className="w-8 h-8 rounded-lg text-content-muted hover:text-promo-accent hover:bg-red-50 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 4: PROMO VOUCHERS & LIVE BROADCASTS ===================== */}
      {activeTab === 'marketing' && (
        <div className="space-y-4">
          {/* Create Promo Voucher Card */}
          <form
            onSubmit={handleCreateVoucherSubmit}
            className="bg-white rounded-xl border border-app-border p-4 space-y-3"
          >
            <div>
              <h3 className="text-sm font-bold text-content-primary">
                Create Customs / Freight Promo Voucher
              </h3>
              <p className="text-xs text-content-secondary">
                New codes immediately work in the customer Shopping Bag
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-content-secondary mb-1">
                  Voucher Code
                </label>
                <input
                  type="text"
                  required
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  placeholder="EID2026"
                  className="w-full h-10 px-3 rounded-lg bg-app-subtle border border-app-border font-mono-num text-xs font-bold uppercase text-content-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-content-secondary mb-1">
                  Discount Type
                </label>
                <select
                  value={voucherType}
                  onChange={(e) =>
                    setVoucherType(e.target.value as 'percent' | 'flat')
                  }
                  className="w-full h-10 px-3 rounded-lg bg-app-subtle border border-app-border text-xs text-content-primary"
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="flat">Flat BDT (৳)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-content-secondary mb-1">
                  {voucherType === 'percent'
                    ? 'Discount Percent (%)'
                    : 'Flat Discount (BDT)'}
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={voucherValue}
                  onChange={(e) => setVoucherValue(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-app-subtle border border-app-border font-mono-num text-xs text-content-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-content-secondary mb-1">
                  Min Order (BDT)
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={voucherMinOrder}
                  onChange={(e) => setVoucherMinOrder(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-app-subtle border border-app-border font-mono-num text-xs text-content-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-content-secondary mb-1">
                Campaign Description
              </label>
              <input
                type="text"
                value={voucherDesc}
                onChange={(e) => setVoucherDesc(e.target.value)}
                placeholder="15% off landed duties & air freight"
                className="w-full h-10 px-3 rounded-lg bg-app-subtle border border-app-border text-xs text-content-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full h-10 rounded-lg bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Promo Voucher</span>
            </button>
          </form>

          {/* Active Vouchers List */}
          <div className="bg-white rounded-xl border border-app-border p-4 space-y-3">
            <h3 className="text-sm font-bold text-content-primary">
              Configured Vouchers ({promoVouchers.length})
            </h3>
            <div className="space-y-2">
              {promoVouchers.map((v) => (
                <div
                  key={v.code}
                  className="p-3 rounded-xl bg-app-subtle border border-app-border flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-num text-xs font-bold px-2 py-0.5 rounded bg-white border border-app-border text-content-primary">
                        {v.code}
                      </span>
                      <span className="text-xs font-semibold text-brand-primary">
                        {v.discountType === 'percent'
                          ? `${v.value}% OFF`
                          : `৳ ${v.value} OFF`}
                      </span>
                    </div>
                    <p className="text-[11px] text-content-secondary mt-1 truncate">
                      {v.description} · Min {formatPrice(v.minOrderBdt)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => togglePromoVoucher(v.code)}
                    className={`h-8 px-3 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                      v.active
                        ? 'bg-brand-primary text-white'
                        : 'bg-slate-200 text-content-secondary'
                    }`}
                  >
                    {v.active ? 'Active' : 'Paused'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Broadcast Customer Push Notification */}
          <form
            onSubmit={handleBroadcastSubmit}
            className="bg-white rounded-xl border border-app-border p-4 space-y-3"
          >
            <div>
              <h3 className="text-sm font-bold text-content-primary">
                Broadcast Customer Alert
              </h3>
              <p className="text-xs text-content-secondary">
                Send a live price drop or customs flash update to Customer Notifications
              </p>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { id: 'promo', label: 'Flash Promo' },
                  { id: 'price_drop', label: 'Price Drop' },
                  { id: 'arrival', label: 'Hub Arrival' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setBroadcastType(t.id)}
                  className={`h-8 rounded-lg text-xs font-semibold border ${
                    broadcastType === t.id
                      ? 'bg-content-primary text-white border-content-primary'
                      : 'bg-app-subtle text-content-secondary border-app-border'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-content-secondary mb-1">
                Notification Headline
              </label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="Dhaka Air Freight Duty Drop: 15% Off Electronics"
                className="w-full h-10 px-3 rounded-lg bg-app-subtle border border-app-border text-xs text-content-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-content-secondary mb-1">
                Alert Message Body
              </label>
              <textarea
                rows={2}
                required
                value={broadcastBody}
                onChange={(e) => setBroadcastBody(e.target.value)}
                placeholder="All Shenzhen direct air parcels placed today include complimentary consolidated customs clearance."
                className="w-full p-3 rounded-lg bg-app-subtle border border-app-border text-xs text-content-primary resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full h-10 rounded-lg bg-content-primary hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Live Alert to Customers</span>
            </button>
          </form>
        </div>
      )}

      {/* Viewport-Docked Add/Edit Product Bottom Sheet Modal (Portaled into #mobile-sheet-root) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {productSheetOpen && (
              <div
                role="dialog"
                aria-modal="true"
                aria-label={
                  editingProduct ? 'Edit Global SKU' : 'Add New Global SKU'
                }
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
                  className="relative z-10 w-full max-h-[88%] overflow-y-auto bg-white rounded-t-2xl p-4 shadow-2xl space-y-3 border-t border-app-border"
                >
                  <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto -mt-1" />
                  <div className="flex items-center justify-between pb-2 border-b border-app-border">
                    <div>
                      <h3 className="text-sm font-bold text-content-primary">
                        {editingProduct
                          ? `Edit Landed Cost: ${editingProduct.name}`
                          : 'Add New Global Import SKU'}
                      </h3>
                      <p className="text-[11px] text-content-secondary">
                        Auto-calculates 10% BD Customs Duty + 15% VAT
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProductSheetOpen(false)}
                      className="text-xs font-semibold text-content-muted px-2 py-1"
                    >
                      Close
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-content-secondary mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Sony WH-1000XM5 Wireless ANC Headphones"
                      className="w-full h-10 px-3 rounded-lg bg-app-subtle border border-app-border text-xs text-content-primary"
                    />
                  </div>

                  {!editingProduct && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-content-secondary mb-1">
                            Category
                          </label>
                          <select
                            value={formCategory}
                            onChange={(e) =>
                              setFormCategory(e.target.value as CategoryId)
                            }
                            className="w-full h-10 px-3 rounded-lg bg-app-subtle border border-app-border text-xs text-content-primary"
                          >
                            {CATEGORIES.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-content-secondary mb-1">
                            BD Customs HS-Code
                          </label>
                          <input
                            type="text"
                            value={formHsCode}
                            onChange={(e) => setFormHsCode(e.target.value)}
                            className="w-full h-10 px-3 rounded-lg bg-app-subtle border border-app-border font-mono-num text-xs text-content-primary"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-content-secondary mb-1">
                            Origin Hub
                          </label>
                          <input
                            type="text"
                            value={formOrigin}
                            onChange={(e) => setFormOrigin(e.target.value)}
                            placeholder="Shenzhen, CN"
                            className="w-full h-10 px-3 rounded-lg bg-app-subtle border border-app-border text-xs text-content-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-content-secondary mb-1">
                            Verified Supplier
                          </label>
                          <input
                            type="text"
                            value={formSupplier}
                            onChange={(e) => setFormSupplier(e.target.value)}
                            placeholder="Anker Official Store"
                            className="w-full h-10 px-3 rounded-lg bg-app-subtle border border-app-border text-xs text-content-primary"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-content-secondary mb-1">
                        Factory Base Price (BDT)
                      </label>
                      <input
                        type="number"
                        required
                        min={50}
                        value={formBasePrice}
                        onChange={(e) => setFormBasePrice(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-app-subtle border border-app-border font-mono-num text-xs text-content-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-content-secondary mb-1">
                        Air Freight (BDT)
                      </label>
                      <input
                        type="number"
                        required
                        min={0}
                        value={formShipping}
                        onChange={(e) => setFormShipping(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-app-subtle border border-app-border font-mono-num text-xs text-content-primary"
                      />
                    </div>
                  </div>

                  {/* Live Landed Cost Preview Box */}
                  <div className="p-3 rounded-xl bg-brand-subtle/60 border border-brand-primary/20 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-content-secondary font-mono-num">
                      <span>Customs Duty (10%): {formatPrice(previewDuty)}</span>
                      <span>Import VAT (15%): {formatPrice(previewVat)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-brand-primary/15">
                      <span className="text-xs font-bold text-content-primary">
                        Guaranteed Landed Total
                      </span>
                      <span className="font-mono-num text-sm font-bold text-brand-primary">
                        {formatPrice(previewLanded)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs font-semibold text-content-primary">
                      Available In Stock for Immediate Import
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormInStock((v) => !v)}
                      className={`h-7 px-3 rounded-full text-xs font-semibold ${
                        formInStock
                          ? 'bg-brand-primary text-white'
                          : 'bg-slate-200 text-content-secondary'
                      }`}
                    >
                      {formInStock ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setProductSheetOpen(false)}
                      className="flex-1 h-11 rounded-lg border border-app-border text-xs font-semibold text-content-primary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 h-11 rounded-lg bg-brand-primary text-white text-xs font-semibold"
                    >
                      {editingProduct ? 'Save Changes' : 'Publish to Catalog'}
                    </button>
                  </div>
                </motion.form>
              </div>
            )}
          </AnimatePresence>,
          document.getElementById('mobile-sheet-root') || document.body
        )}
    </div>
  );
};
