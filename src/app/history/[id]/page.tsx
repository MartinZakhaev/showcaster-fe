"use client";

import React, { useEffect, useState, useCallback } from 'react';
import {
  Typography,
  Card,
  Tag,
  Button,
  Breadcrumb,
  Row,
  Col,
  Spin,
  Popconfirm,
  App,
} from 'antd';
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  PlayCircleOutlined,
  DeleteOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  StopOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { apiGetJob, apiDeleteJob, apiCancelJob, ApiError, type JobResponse } from '@/lib/api';

const { Title, Text } = Typography;

const STEP_META: Record<string, { description: string }> = {
  Hook:     { description: 'Grabs immediate attention' },
  Problem:  { description: 'Establishes contextual empathy' },
  Solution: { description: 'Introduces product cleanly' },
  Closure:  { description: 'Strong call to action' },
};

const STATUS_COLOR: Record<string, string> = {
  completed:  'success',
  processing: 'processing',
  pending:    'default',
  failed:     'error',
  cancelled:  'warning',
};

export default function HistoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState<JobResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [pollInterval, setPollInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  const { message } = App.useApp();

  const fetchJob = useCallback(async () => {
    try {
      const data = await apiGetJob(jobId);
      setJob(data);
      // Stop polling once terminal
      if (data.status === 'completed' || data.status === 'failed' || data.status === 'cancelled') {
        setPollInterval(prev => { if (prev) clearInterval(prev); return null; });
      }
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to load job.';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  // Auto-poll while job is in progress
  useEffect(() => {
    if (!job) return;
    if (job.status === 'pending' || job.status === 'processing') {
      const id = setInterval(fetchJob, 5000);
      setPollInterval(id);
      return () => clearInterval(id);
    }
  }, [job?.status, fetchJob]);

  useEffect(() => {
    return () => { if (pollInterval) clearInterval(pollInterval); };
  }, [pollInterval]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiDeleteJob(jobId);
      message.success('Job deleted.');
      router.push('/history');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to delete job.';
      message.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await apiCancelJob(jobId);
      message.success('Job cancellation requested.');
      fetchJob();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to cancel job.';
      message.error(msg);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20">
        <Title level={4} className="text-slate-500">Job not found</Title>
        <Link href="/history"><Button type="primary" className="mt-4">Back to History</Button></Link>
      </div>
    );
  }

  const isInProgress = job.status === 'pending' || job.status === 'processing';
  const canDelete = job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled';

  return (
    <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-500 pb-12">

      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Breadcrumb className="mb-2" items={[
            { title: <Link href="/history" className="text-slate-400 hover:text-indigo-600"><ArrowLeftOutlined className="mr-1" />History</Link> },
            { title: 'Job Details' },
          ]} />
          <div className="flex items-center gap-3 flex-wrap">
            <Title level={2} className="text-slate-900 tracking-tight m-0 font-mono text-lg">
              {job.id}
            </Title>
            <Tag color={STATUS_COLOR[job.status] ?? 'default'} className="uppercase text-[10px] font-bold">
              {job.status}
            </Tag>
            {isInProgress && <SyncOutlined spin className="text-indigo-500" />}
          </div>
          <Text className="text-slate-500 mt-1 block">
            Created {new Date(job.createdAt).toLocaleString()}
          </Text>
        </div>

        <div className="flex gap-3">
          <Button icon={<ReloadOutlined />} onClick={fetchJob} loading={loading}>
            Refresh
          </Button>
          {isInProgress && (
            <Popconfirm
              title="Cancel this job?"
              description="The current step will finish before the job stops."
              onConfirm={handleCancel}
              okText="Cancel Job"
              okButtonProps={{ danger: true }}
              cancelText="Keep Running"
            >
              <Button
                icon={<StopOutlined />}
                loading={cancelling}
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                Cancel Job
              </Button>
            </Popconfirm>
          )}
          {canDelete && (
            <Popconfirm
              title="Delete this job?"
              description="This action cannot be undone."
              onConfirm={handleDelete}
              okText="Delete"
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<DeleteOutlined />} loading={deleting}>
                Delete
              </Button>
            </Popconfirm>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <Text className="font-semibold text-slate-700">Overall Progress</Text>
          <Text className="text-indigo-600 font-bold text-xl">{job.progress}%</Text>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${job.progress}%` }}
          />
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Step list */}
        <Col xs={24} lg={8}>
          <Card className="border-slate-200 shadow-sm h-full" styles={{ body: { padding: '24px' } }}>
            <Title level={5} className="text-slate-800 m-0 mb-4">Pipeline Steps</Title>
            <div className="space-y-3">
              {job.steps.map((step, i) => (
                <div key={step.name} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                    ${step.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      step.status === 'processing' ? 'bg-indigo-100 text-indigo-700' :
                      step.status === 'failed'     ? 'bg-red-100 text-red-700' :
                      'bg-slate-200 text-slate-500'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 m-0 text-sm">{step.name}</p>
                    <p className="text-xs text-slate-500 m-0">{STEP_META[step.name]?.description}</p>
                  </div>
                  <Tag
                    color={STATUS_COLOR[step.status] ?? 'default'}
                    className="uppercase text-[9px] font-bold border-0 bg-transparent px-0 m-0"
                  >
                    {step.status}
                  </Tag>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Video outputs */}
        <Col xs={24} lg={16}>
          <Card className="border-slate-200 shadow-sm h-full" styles={{ body: { padding: '24px' } }}>
            <Title level={4} className="text-slate-800 m-0 mb-2">Generated Videos</Title>
            <Text className="text-slate-500 text-sm block mb-6">
              Videos become available as each step completes.
            </Text>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {job.steps.map((step, index) => {
                const isDone    = step.status === 'completed';
                const isActive  = step.status === 'processing';
                const isFailed  = step.status === 'failed';

                return (
                  <div
                    key={step.name}
                    className={`relative rounded-2xl overflow-hidden border flex flex-col bg-[#0F172A] aspect-video group
                      ${isActive  ? 'border-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)]' :
                        isDone    ? 'border-slate-700 shadow-md' :
                        isFailed  ? 'border-red-700' :
                        'border-slate-800 opacity-60'}`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      {isActive && (
                        <div className="flex flex-col items-center">
                          <SyncOutlined spin className="text-4xl text-indigo-400 mb-3" style={{ color: '#818cf8' }} />
                          <span className="text-indigo-300 text-sm font-medium animate-pulse">Rendering…</span>
                        </div>
                      )}
                      {isFailed && (
                        <div className="flex flex-col items-center">
                          <CloseCircleOutlined className="text-4xl text-red-400 mb-2" />
                          <span className="text-red-300 text-sm font-medium">Step failed</span>
                        </div>
                      )}
                      {isDone && step.videoUrl && (
                        <>
                          {/* Video thumbnail preview — plays on hover */}
                          <video
                            src={step.videoUrl}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            className="absolute inset-0 w-full h-full object-cover"
                            onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                            onMouseLeave={(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
                          <a href={step.videoUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center">
                            <PlayCircleOutlined className="text-6xl text-white opacity-80 group-hover:scale-110 drop-shadow-xl transition-all" style={{ color: '#ffffff' }} />
                          </a>
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <a href={step.videoUrl} download target="_blank" rel="noopener noreferrer">
                              <Button type="primary" shape="circle" icon={<DownloadOutlined />} className="bg-indigo-600 hover:bg-indigo-500 border-0 shadow-md" />
                            </a>
                          </div>
                        </>
                      )}
                      {isDone && !step.videoUrl && (
                        <div className="text-emerald-400 text-sm font-medium">Completed</div>
                      )}
                      {!isActive && !isDone && !isFailed && (
                        <div className="text-slate-500 text-sm">Waiting…</div>
                      )}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent flex justify-between items-end">
                      <div>
                        <h5 className="text-white m-0 font-semibold text-base drop-shadow-md">
                          {index + 1}. {step.name}
                        </h5>
                        <p className="text-slate-300 text-xs mt-0.5 mb-0 drop-shadow-md">
                          {STEP_META[step.name]?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
