"use client";

import React from 'react';
import { 
  Typography, 
  Card, 
  Table, 
  Tag, 
  Button, 
  Input, 
  Select, 
  DatePicker 
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  EyeOutlined,
  MoreOutlined
} from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function HistoryPage() {
  
  const columns = [
    {
      title: 'Project Name',
      dataIndex: 'project',
      key: 'project',
      render: (text: string, record: any) => (
        <Link href={`/history/${record.key}`} className="font-semibold text-indigo-600 hover:text-indigo-500">
          {text}
        </Link>
      ),
    },
    {
      title: 'Output Format',
      dataIndex: 'format',
      key: 'format',
      render: (format: { res: string, orient: string }) => (
        <div className="flex gap-2">
           <Tag className="m-0 border-0 bg-slate-100 text-slate-600 font-medium">{format.res}</Tag>
           <Tag className="m-0 border-0 bg-slate-100 text-slate-600 font-medium">{format.orient}</Tag>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = status === 'Completed' ? 'success' : status === 'Failed' ? 'error' : 'processing';
        return <Tag color={color} className="uppercase text-[10px] m-0 border-0 bg-transparent px-0 font-bold">{status}</Tag>;
      },
    },
    {
      title: 'Created At',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => <Text className="text-slate-500 text-sm">{text}</Text>
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Link href={`/history/${record.key}`}>
            <Button type="text" icon={<EyeOutlined />} size="small" className="text-indigo-600 hover:bg-indigo-50 bg-indigo-50/50">View Details</Button>
          </Link>
          <Button type="text" icon={<MoreOutlined />} size="small" className="text-slate-400 hover:text-slate-600" />
        </div>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      project: 'Lumina Glow Serum Launch',
      format: { res: '1080p', orient: '9:16' },
      category: 'Beauty',
      status: 'Completed',
      date: 'Oct 24, 2026 09:42 AM',
    },
    {
      key: '2',
      project: 'Urban Sneakers Alpha',
      format: { res: '4K', orient: '16:9' },
      category: 'Fashion',
      status: 'Processing',
      date: 'Oct 24, 2026 08:15 AM',
    },
    {
      key: '3',
      project: 'Pro Sonic Toothbrush',
      format: { res: '720p', orient: '1:1' },
      category: 'Health',
      status: 'Failed',
      date: 'Oct 23, 2026 14:30 PM',
    },
    {
      key: '4',
      project: 'Kids Wonder Tablet',
      format: { res: '1080p', orient: '16:9' },
      category: 'Electronics',
      status: 'Completed',
      date: 'Oct 21, 2026 11:20 AM',
    },
    {
      key: '5',
      project: 'Minimalist Desk setup',
      format: { res: '4K', orient: '9:16' },
      category: 'Home & Lifestyle',
      status: 'Completed',
      date: 'Oct 19, 2026 16:45 PM',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
         <div>
            <Title level={3} className="text-slate-900 tracking-tight m-0 mb-1">Generations History</Title>
            <Text className="text-slate-500">Review, download, and manage your past AI video pipelines.</Text>
         </div>
         <Button type="primary" href="/studio" className="bg-indigo-600 hover:bg-indigo-500 border-0 shadow-sm font-semibold">
           + New Generation
         </Button>
      </div>

      <Card className="border-slate-200 shadow-sm" styles={{ body: { padding: '20px' } }}>
        {/* Filters Toolbar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
           <Input 
             placeholder="Search projects..." 
             prefix={<SearchOutlined className="text-slate-400" />} 
             className="w-full lg:w-64 rounded-lg"
             size="large"
           />
           <div className="flex flex-wrap gap-4">
              <Select defaultValue="all" size="large" className="w-36 rounded-lg font-medium" options={[
                { value: 'all', label: 'All Categories' },
                { value: 'beauty', label: 'Beauty' },
                { value: 'fashion', label: 'Fashion' },
              ]} />
              <Select defaultValue="all" size="large" className="w-36 rounded-lg font-medium" options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'completed', label: 'Completed' },
                { value: 'processing', label: 'Processing' },
                { value: 'failed', label: 'Failed' },
              ]} />
              <RangePicker size="large" className="rounded-lg" />
              <Button size="large" icon={<FilterOutlined />} className="rounded-lg text-slate-500">More Filters</Button>
           </div>
        </div>

        {/* Data Table */}
        <Table 
          columns={columns} 
          dataSource={data} 
          className="custom-table border border-slate-100 rounded-lg overflow-hidden"
          pagination={{ pageSize: 10, showSizeChanger: false }}
        />
      </Card>
      
    </div>
  );
}
