import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Toast } from '../common/Toast';
import { ConfirmModal } from '../common/ConfirmModal';
import { LoginPage } from '../auth/LoginPage';

// View Imports
import { DashboardView } from '../views/DashboardView';
import { ImportsView } from '../views/ImportsView';
import { ExportsView } from '../views/ExportsView';
import { StockView } from '../views/StockView';
import { WorkersView } from '../views/WorkersView';
import { AddworkersView } from '../views/AddworkersView';
import { ListworkersView } from '../views/ListworkersView';
import { AddagentsView } from '../views/AddagentsView';
import { ListagentsView } from '../views/ListagentsView';
import { AgentAccountsView } from '../views/AgentAccountsView';
import { AgentReportsView } from '../views/AgentReportsView';
import { AttendanceView } from '../views/AttendanceView';
import { PayrollView } from '../views/PayrollView';
import { SuppliersView } from '../views/SuppliersView';
import { ReportsView } from '../views/ReportsView';
import { AnalyticsView } from '../views/AnalyticsView';
import { SettingsView } from '../views/SettingsView';

// PDF Extended Modules View Imports
import { CustomersView } from '../views/CustomersView';
import { ProductsView } from '../views/ProductsView';
import { ProductionView } from '../views/ProductionView';
import { BOMView } from '../views/BOMView';
import { RawMaterialsView } from '../views/RawMaterialsView';
import { QualityControlView } from '../views/QualityControlView';
import { PackingView } from '../views/PackingView';
import { DispatchView } from '../views/DispatchView';
import { PurchasesView } from '../views/PurchasesView';
import { SafetyView } from '../views/SafetyView';
import { DocumentsView } from '../views/DocumentsView';
import { ApprovalsView } from '../views/ApprovalsView';
import { AuditLogView } from '../views/AuditLogView';
import { ShopItemsView } from '../views/ShopItemsView';
import { OtherExpensesView } from '../views/OtherExpensesView';
import { SalesView } from '../views/SalesView';
import { BillingView } from '../views/BillingView';
import { InventoryReportsView } from '../views/InventoryReportsView';

export const AppLayout = () => {
  const { isAuthenticated, currentTab, sidebarCollapsed, theme } = useApp();

  if (!isAuthenticated) {
    return <DashboardView />;
  }

  const renderCurrentView = () => {
    switch (currentTab) {
      case 'Billing':
        return <BillingView />;
      case 'InventoryReports':
        return <InventoryReportsView />;
      case 'Dashboard':
        return <DashboardView />;
      case 'Sales':
        return <SalesView />;
      case 'Customers':
        return <CustomersView />;
      case 'ShopItems':
      case 'ItemMaster':
      case 'Item Master':
        return <ShopItemsView />;
      case 'Products':
        return <ProductsView />;
      case 'Exports':
      case 'ExportsRegister':
      case 'ExportsStock':
        return <ExportsView />;

      case 'Dispatch':
        return <DispatchView />;
      case 'Production':
        return <ProductionView />;
      case 'BOM':
        return <BOMView />;
      case 'RawMaterials':
        return <RawMaterialsView />;
      case 'QualityControl':
        return <QualityControlView />;
      case 'Packing':
        return <PackingView />;
      case 'Stock':
        return <StockView />;
      case 'Imports':
      case 'ImportsAdd':
      case 'ImportsList':
        return <ImportsView />;

      case 'Purchases':
        return <PurchasesView />;
      case 'Suppliers':
        return <SuppliersView />;
      case 'Addagents':
        return <AddagentsView />;
      case 'Listagents':
      case 'Agents':
        return <ListagentsView />;
      case 'AgentAccounts':
        return <AgentAccountsView />;
      case 'AgentReports':
        return <AgentReportsView />;
      case 'Addworkers':
        return <AddworkersView />;
      case 'Listworkers':
        return <ListworkersView />;

      case 'Workers':
        return <WorkersView />;
      case 'Attendance':
        return <AttendanceView />;
      case 'Payroll':
        return <PayrollView />;
      case 'Safety':
        return <SafetyView />;
      case 'OtherExpenses':
        return <OtherExpensesView />;
      case 'Approvals':
        return <ApprovalsView />;
      case 'Documents':
        return <DocumentsView />;
      case 'AuditLog':
        return <AuditLogView />;
      case 'Analytics':
        return <AnalyticsView />;
      case 'Reports':
        return <ReportsView />;
      case 'Settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col relative selection:bg-orange-500 selection:text-slate-950 transition-colors duration-300 ${
      theme === 'light' ? 'light-theme bg-slate-50 text-slate-900' : 'bg-[#0b132b] text-slate-100'
    }`}>
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Fixed Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main
        className={`pt-24 pb-12 px-3 sm:px-6 lg:px-8 transition-all duration-300 min-h-screen ${
          sidebarCollapsed ? 'ml-0 md:ml-20' : 'ml-0 md:ml-64'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {renderCurrentView()}
        </div>
      </main>

      {/* Overlays */}
      <Toast />
      <ConfirmModal />
    </div>
  );
};
