"use client";

import React, { useEffect, useState, useCallback } from 'react';
import {
  Typography,
  Card,
  Table,
  Tag,
  Button,
  Input,
  Select,
  Spin,
  Popconfirm,
  App,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
  ReloadOutlined,
  StopOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { apiListJobs, apiDeleteJob, apiCancelJob, ApiError, type JobSummary } from '@/lib/api';

const { Title, Text } = Typography;

const STATUS_COLOR: Record<string, string> = {
  completed:  'success',
  processing: 'processing',
  pending:    'default',
  failed:     'error',
  cancelled:  'warning',
};

export default function HistoryPage() {
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const { message } = App.useApp();

  const fetchJobs = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const data = await apiListJobs(p, 20);
      setJobs(data.jobs);
      setTotal(data.total);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to load jobs.';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleDelete = async (jobId: string) => {
    setDeletingId(jobId);
    try {
      await apiDeleteJob(jobId);
      message.success('Job deleted.');
      fetchJobs();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to delete job.';
      message.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancel = async (jobId: string) => {
    setCancellingId(jobId);
    try {
      await apiCancelJob(jobId);
      message.success('Job cancellation requested.');
      fetchJobs();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to cancel job.';
      message.error(msg);
    } finally {
      setCancellingId(null);
    }
  };

  // Client-side filter (search + status)
  const filtered = jobs.filter(j => {
    const matchStatus = statusFilter === 'all' || j.status === statusFilter;
    const matchSearch = !search || j.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const columns = [
    {
      title: 'Job ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <Link href={`/history/${id}`} className="font-mono text-indigo-600 hover:text-indigo-500 text-sm">
          {id.slice(0, 8)}…
        </Link>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={STATUS_COLOR[status] ?? 'default'} className="uppercase text-[10px] font-bold border-0 bg-transparent px-0">
          {status}
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (ts: string) => (
        <Text className="text-slate-500 text-sm">
          {new Date(ts).toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_: unknown, record: JobSummary) => (
        <div className="flex gap-2 flex-wrap">
          <Link href={`/history/${record.id}`}>
            <Button type="text" icon={<EyeOutlined />} size="small" className="text-indigo-600 hover:bg-indigo-50">
              View
            </Button>
          </Link>

          {/* Cancel — only for pending/processing */}
          {(record.status === 'pending' || record.status === 'processing') && (
            <Popconfirm
              title="Cancel this job?"
              description="The current step will finish before the job stops."
              onConfirm={() => handleCancel(record.id)}
              okText="Cancel Job"
              okButtonProps={{ danger: true }}
              cancelText="Keep Running"
            >
              <Button
                type="text"
                icon={<StopOutlined />}
                size="small"
                className="text-orange-500 hover:bg-orange-50"
                loading={cancellingId === record.id}
              >
                Cancel
              </Button>
            </Popconfirm>
          )}

          {/* Delete — for completed, failed, or cancelled */}
          {(record.status === 'completed' || record.status === 'failed' || record.status === 'cancelled') && (
            <Popconfirm
              title="Delete this job?"
              description="This action cannot be undone."
              onConfirm={() => handleDelete(record.id)}
              okText="Delete"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                size="small"
                danger
                loading={deletingId === record.id}
              />
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-500">

      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Title level={3} className="text-slate-900 tracking-tight m-0 mb-1">Generation History</Title>
          <Text className="text-slate-500">Review and manage your past AI video pipelines.</Text>
        </div>
        <div className="flex gap-3">
          <Button icon={<ReloadOutlined />} onClick={() => fetchJobs()} loading={loading}>
            Refresh
          </Button>
          <Button type="primary" href="/studio" className="bg-indigo-600 hover:bg-indigo-500 border-0 shadow-sm font-semibold">
            + New Generation
          </Button>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm" styles={{ body: { padding: '20px' } }}>
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <Input
            placeholder="Search by job ID…"
            prefix={<SearchOutlined className="text-slate-400" />}
            className="w-full lg:w-64 rounded-lg"
            size="large"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            size="large"
            className="w-44 rounded-lg font-medium"
            options={[
              { value: 'all',        label: 'All Statuses' },
              { value: 'completed',  label: 'Completed' },
              { value: 'processing', label: 'Processing' },
              { value: 'pending',    label: 'Pending' },
              { value: 'failed',     label: 'Failed' },
              { value: 'cancelled',  label: 'Cancelled' },
            ]}
          />
        </div>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filtered}
            rowKey="id"
            className="custom-table border border-slate-100 rounded-lg overflow-hidden"
            pagination={{
              current: page,
              total,
              pageSize: 20,
              showSizeChanger: false,
              onChange: (p) => { setPage(p); fetchJobs(p); },
            }}
          />
        </Spin>
      </Card>
    </div>
  );
}
