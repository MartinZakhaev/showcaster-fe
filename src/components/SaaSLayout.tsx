"use client";

import React, { useState } from 'react';
import { Layout, Menu, ConfigProvider, Avatar, Dropdown } from 'antd';
import {
  VideoCameraOutlined,
  DashboardOutlined,
  SettingOutlined,
  UserOutlined,
  BarChartOutlined,
  WalletOutlined,
  HistoryOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

const { Header, Sider, Content } = Layout;

export default function SaaSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  // Enterprise color palette
  const enterpriseTheme = {
    token: {
      colorPrimary: '#4F46E5', // Indigo 600
      colorInfo: '#3B82F6',   // Blue 500
      colorSuccess: '#10B981', // Emerald 500
      colorWarning: '#F59E0B', // Amber 500
      colorError: '#EF4444',   // Red 500
      borderRadius: 8,
      fontFamily: 'var(--font-geist-sans), sans-serif',
      colorBgLayout: '#F8FAFC', // Slate 50
    },
    components: {
      Layout: {
        siderBg: '#ffffff',
        headerBg: '#ffffff',
      },
      Menu: {
        itemBg: '#ffffff',
        itemSelectedBg: '#EEF2FF', // Indigo 50
        itemSelectedColor: '#4F46E5', // Indigo 600
      },
    },
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">Dashboard</Link>,
    },
    {
      key: '/studio',
      icon: <VideoCameraOutlined />,
      label: <Link href="/studio">Video Studio</Link>,
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: <Link href="#">Analytics</Link>,
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link href="#">Settings</Link>,
    },
    {
      key: '/history',
      icon: <HistoryOutlined />,
      label: <Link href="/history">History</Link>,
    },
    {
      key: '/billing',
      icon: <WalletOutlined />,
      label: <Link href="/billing">Billing</Link>,
    },
  ];

  const userMenu = {
    items: [
      { key: '1', label: 'Profile' },
      { key: '2', label: <Link href="/billing">Billing</Link> },
      { type: 'divider' as const },
      {
        key: '3',
        label: 'Log out',
        icon: <LogoutOutlined />,
        danger: true,
        onClick: () => { logout(); router.push('/login'); },
      },
    ],
  };

  const getPageTitle = () => {
    switch(pathname) {
      case '/dashboard': return 'Dashboard Overview';
      case '/studio': return 'AI Video Studio';
      case '/billing': return 'Billing & Subscription';
      case '/history': return 'Generation History';
      default: return 'Overview';
    }
  }

  return (
    <ConfigProvider theme={enterpriseTheme}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider 
          collapsible 
          collapsed={collapsed} 
          onCollapse={(value) => setCollapsed(value)}
          theme="light"
          style={{ borderRight: '1px solid #E2E8F0' }}
          width={240}
        >
          <div className="flex items-center justify-center h-16 w-full border-b border-[#E2E8F0] gap-2">
            {!collapsed && <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm tracking-tighter">SC</span>
             </div>}
            <span className="text-xl font-bold text-slate-800 tracking-tight">
              {collapsed ? 'SC' : 'Showcaster'}
            </span>
          </div>
          <Menu 
            theme="light" 
            selectedKeys={[pathname]} 
            mode="inline" 
            items={menuItems} 
            className="mt-4 border-r-0 font-medium"
          />

          {/* Copyright Footer */}
          {!collapsed && (
            <div className="absolute bottom-10 left-0 right-0 px-5 py-4 border-t border-slate-100">
              <p className="text-[11px] text-slate-400 m-0 leading-relaxed text-center">
                © {new Date().getFullYear()} Terra. All rights reserved.
              </p>
            </div>
          )}
        </Sider>
        <Layout>
          <Header className="flex items-center justify-between px-8 bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
            <h1 className="text-xl font-semibold text-slate-800 m-0 tracking-tight">
              {getPageTitle()}
            </h1>
            <div className="flex items-center gap-4">
               <span className="text-sm text-slate-500 font-medium hidden md:inline-block border border-slate-200 px-3 flex items-center h-8 rounded-full bg-slate-50">
                 Jane Doe (Affiliator)
               </span>
               <Dropdown menu={userMenu as any} placement="bottomRight">
                 <Avatar icon={<UserOutlined />} className="cursor-pointer bg-indigo-600 shadow-sm" />
               </Dropdown>
            </div>
          </Header>
          <Content style={{ margin: '24px', minHeight: 280 }} className="flex flex-col">
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
