/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DeshiMartProvider, useDeshiMart } from './context/DeshiMartContext';
import { MobileShell } from './components/layout/MobileShell';
import { SplashOnboarding } from './components/screens/SplashOnboarding';
import { HomeScreen } from './components/screens/HomeScreen';
import { CategoriesScreen } from './components/screens/CategoriesScreen';
import { ProductDetailScreen } from './components/screens/ProductDetailScreen';
import { PriceTrackerScreen } from './components/screens/PriceTrackerScreen';
import { SellerCompareScreen } from './components/screens/SellerCompareScreen';
import { CartScreen } from './components/screens/CartScreen';
import { CheckoutFlowScreen } from './components/screens/CheckoutFlowScreen';
import { OrdersTrackingScreen } from './components/screens/OrdersTrackingScreen';
import { AccountSupportScreen } from './components/screens/AccountSupportScreen';
import { AdminDashboardScreen } from './components/screens/AdminDashboardScreen';

const ScreenRouter: React.FC = () => {
  const { currentScreen } = useDeshiMart();

  switch (currentScreen) {
    case 'splash':
    case 'onboarding':
    case 'auth':
      return <SplashOnboarding />;
    case 'home':
      return <HomeScreen />;
    case 'categories':
    case 'category_products':
      return <CategoriesScreen />;
    case 'product_detail':
      return <ProductDetailScreen />;
    case 'price_tracker':
      return <PriceTrackerScreen />;
    case 'seller_compare':
    case 'spec_compare':
      return <SellerCompareScreen />;
    case 'cart':
      return <CartScreen />;
    case 'checkout_shipping':
    case 'checkout_payment':
    case 'checkout_review':
    case 'order_success':
      return <CheckoutFlowScreen />;
    case 'orders':
    case 'order_tracking':
      return <OrdersTrackingScreen />;
    case 'admin_dashboard':
      return <AdminDashboardScreen />;
    case 'account':
    case 'addresses':
    case 'payment_methods':
    case 'supplier_store':
    case 'wishlist':
    case 'notifications':
    case 'support':
    case 'settings':
    case 'guides':
      return <AccountSupportScreen />;
    default:
      return <HomeScreen />;
  }
};

export default function App() {
  return (
    <DeshiMartProvider>
      <MobileShell>
        <ScreenRouter />
      </MobileShell>
    </DeshiMartProvider>
  );
}
