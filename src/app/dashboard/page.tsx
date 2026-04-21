"use client";

import React from 'react';
import { Card, Row, Col, Typography, Table, Tag, Button } from 'antd';
import { 
  VideoCameraOutlined, 
  RiseOutlined, 
  ThunderboltOutlined, 
  WalletOutlined,
  DownloadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const { Title, Text } = Typography;

// Mock Data for Area Chart
const chartData = [
  { name: 'Mon', views: 4000, conversions: 240 },
  { name: 'Tue', views: 3000, conversions: 139 },
  { name: 'Wed', views: 2000, conversions: 980 },
  { name: 'Thu', views: 2780, conversions: 390 },
  { name: 'Fri', views: 1890, conversions: 480 },
  { name: 'Sat', views: 2390, conversions: 380 },
  { name: 'Sun', views: 3490, conversions: 430 },
];

export default function DashboardPage() {
  // Define Table Columns
  const tableColumns = [
    {
      title: 'Project Name',
      dataIndex: 'project',
      key: 'project',
      render: (text: string) => <span className="font-semibold text-slate-800">{text}</span>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Audience',
      dataIndex: 'audience',
      key: 'audience',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = status === 'Published' ? 'success' : status === 'Generating' ? 'processing' : 'default';
        return <Tag color={color} className="uppercase text-[10px] m-0 border-0 bg-transparent px-0 font-bold">{status}</Tag>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => <Text className="text-slate-500 text-sm">{text}</Text>
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Button type="text" icon={<EyeOutlined />} size="small" className="text-slate-500 hover:text-indigo-600" />
          <Button type="text" icon={<DownloadOutlined />} size="small" disabled={record.status !== 'Published'} className="text-slate-500 hover:text-indigo-600" />
        </div>
      ),
    },
  ];

  // Mock Data for Table
  const tableData = [
    {
      key: '1',
      project: 'Lumina Glow Serum (TikTok)',
      category: 'Beauty',
      audience: 'Women',
      status: 'Published',
      date: 'Today, 09:42 AM',
    },
    {
      key: '2',
      project: 'Urban Sneakers Alpha',
      category: 'Fashion',
      audience: 'Men',
      status: 'Generating',
      date: 'Today, 08:15 AM',
    },
    {
      key: '3',
      project: 'Pro Sonic Toothbrush',
      category: 'Health',
      audience: 'Unisex',
      status: 'Published',
      date: 'Yesterday, 14:30 PM',
    },
    {
      key: '4',
      project: 'Kids Wonder Tablet',
      category: 'Electronics',
      audience: 'Children',
      status: 'Published',
      date: 'Oct 24, 11:20 AM',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto pb-12 animate-in fade-in duration-500">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-sm border-slate-200" styles={{ body: { padding: '24px' } }}>
          <div className="flex items-center justify-between mb-4">
            <Text className="text-slate-500 font-medium">Total Videos Generated</Text>
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
              <VideoCameraOutlined className="text-indigo-600" />
            </div>
          </div>
          <Title level={2} className="m-0 text-slate-800">128</Title>
          <div className="mt-2 text-sm">
            <span className="text-emerald-500 font-medium">+14%</span> <span className="text-slate-400">from last month</span>
          </div>
        </Card>

        <Card className="shadow-sm border-slate-200" styles={{ body: { padding: '24px' } }}>
          <div className="flex items-center justify-between mb-4">
            <Text className="text-slate-500 font-medium">Avg. Conversion Rate</Text>
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
              <RiseOutlined className="text-emerald-600" />
            </div>
          </div>
          <Title level={2} className="m-0 text-slate-800">4.2%</Title>
          <div className="mt-2 text-sm">
            <span className="text-emerald-500 font-medium">+0.8%</span> <span className="text-slate-400">from last month</span>
          </div>
        </Card>

        <Card className="shadow-sm border-slate-200" styles={{ body: { padding: '24px' } }}>
          <div className="flex items-center justify-between mb-4">
            <Text className="text-slate-500 font-medium">Active Campaigns</Text>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <ThunderboltOutlined className="text-blue-600" />
            </div>
          </div>
          <Title level={2} className="m-0 text-slate-800">12</Title>
          <div className="mt-2 text-sm">
            <span className="text-slate-400">Across 3 platforms</span>
          </div>
        </Card>

        <Card className="shadow-sm border-slate-200" styles={{ body: { padding: '24px' } }}>
          <div className="flex items-center justify-between mb-4">
            <Text className="text-slate-500 font-medium">Monthly Credits</Text>
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
              <WalletOutlined className="text-amber-600" />
            </div>
          </div>
          <Title level={2} className="m-0 text-slate-800">850<span className="text-lg text-slate-400">/1000</span></Title>
          <div className="mt-2 text-sm">
            <span className="text-amber-500 font-medium">Runs out in 8 days</span>
          </div>
        </Card>
      </div>

      <Row gutter={[24, 24]}>
        {/* Chart Column */}
        <Col xs={24} xl={16}>
          <Card 
            className="shadow-sm border-slate-200 h-full" 
            title={<span className="font-semibold text-slate-800">Performance Over Time</span>}
          >
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="views" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                  <Area type="monotone" dataKey="conversions" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorConversions)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Quick Actions / Tips Column */}
        <Col xs={24} xl={8}>
          <Card 
            className="shadow-sm border-slate-200 h-full bg-gradient-to-br from-indigo-50 to-white" 
            styles={{ body: { padding: '32px' } }}
          >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
              <ThunderboltOutlined className="text-xl text-indigo-600" />
            </div>
            <Title level={3} className="text-slate-800 mb-2 mt-0">Generate your next viral video</Title>
            <Text className="text-slate-600 block mb-6 text-base">
              Got a new product? Skip the expensive set design and editing. Let AI generate your 4-step hook-to-closure pipeline in minutes.
            </Text>
            <Button type="primary" size="large" href="/studio" className="bg-indigo-600 hover:bg-indigo-500 border-0 shadow-md">
              Go to Video Studio
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity Table */}
      <div className="mt-8">
        <Card 
          className="shadow-sm border-slate-200" 
          title={<span className="font-semibold text-slate-800">Recent Generations</span>}
          styles={{ body: { padding: '0px' } }}
        >
          <Table 
            columns={tableColumns} 
            dataSource={tableData} 
            pagination={false}
            className="custom-table"
          />
        </Card>
      </div>

    </div>
  );
}
