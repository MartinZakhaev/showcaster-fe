"use client";

import React, { useState, useRef, useCallback } from 'react';
import {
  Form,
  Input,
  Button,
  Typography,
  Select,
  Progress,
  Divider,
  Steps,
  App,
  Collapse,
} from 'antd';
import {
  VideoCameraAddOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ControlOutlined,
  PictureOutlined,
  AppstoreOutlined,
  PlaySquareOutlined,
  CloseCircleOutlined,
  BugOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import {
  apiUploadImage,
  apiCreateJob,
  apiGetJob,
  apiCancelJob,
  apiGenerateDebugPrompt,
  ApiError,
  type JobResponse,
  type CreateJobPayload,
  type ScenePromptResponse,
} from '@/lib/api';

const { Title, Text, Paragraph } = Typography;

// ── Prompt preview helpers ────────────────────────────────────────────────────

interface FormValues {
  productTitle?: string;
  productCategory?: string;
  targetAudience?: string;
  videoOrientation?: string;
  resolution?: string;
}

function buildPromptJson(stepName: string, values: FormValues): object {
  const stepIndex = ['Hook', 'Problem', 'Solution', 'Closure'].indexOf(stepName) + 1;
  const sceneId = `${stepName.toLowerCase()}_scene_0${stepIndex}`;

  const audienceMap: Record<string, string> = {
    man: 'stylish man', woman: 'stylish woman', children: 'child', unisex: 'person',
  };
  const subject = audienceMap[values.targetAudience ?? ''] ?? 'person';

  const visualPrompts: Record<string, string> = {
    Hook: `RAW photography, high detail, realistic style of a ${subject} holding a ${values.productTitle ?? '...'} (${values.productCategory ?? '...'}). The subject performs subtle micro-movements including head sways, eye blinks, and natural breathing. High-quality product texture visible. NO TEXT, NO WORDS, NO TYPOGRAPHY, NO LOGOS. The background, environment, and lighting must remain exactly the same as the reference image, maintaining a bright and clean aesthetic.`,
    Problem: `RAW photography, high detail, realistic style of a ${subject} experiencing a common problem that ${values.productTitle ?? '...'} solves. Authentic, relatable expression. Subtle micro-movements including slight frustration gestures and natural breathing. NO TEXT, NO WORDS, NO TYPOGRAPHY, NO LOGOS. The background, environment, and lighting must remain exactly the same as the reference image.`,
    Solution: `RAW photography, high detail, realistic style of a ${subject} using ${values.productTitle ?? '...'} (${values.productCategory ?? '...'}) and experiencing a positive transformation. Satisfied, confident expression. Subtle micro-movements including natural breathing and gentle product interaction. NO TEXT, NO WORDS, NO TYPOGRAPHY, NO LOGOS. The background, environment, and lighting must remain exactly the same as the reference image, maintaining a bright and clean aesthetic.`,
    Closure: `RAW photography, high detail, realistic style of a ${subject} confidently showcasing ${values.productTitle ?? '...'} (${values.productCategory ?? '...'}). Direct eye contact with camera, confident smile. Subtle micro-movements including natural breathing and gentle head nod. NO TEXT, NO WORDS, NO TYPOGRAPHY, NO LOGOS. The background, environment, and lighting must remain exactly the same as the reference image, maintaining a bright and clean aesthetic.`,
  };

  const voiceOvers: Record<string, string> = {
    Hook: `Lagi cari ${values.productCategory ?? 'produk'} yang bikin penampilan kamu makin keren? ${values.productTitle ?? '...'} ini pilihan tepat buat kamu!`,
    Problem: `Pernah ngerasa kesulitan dengan ${values.productCategory ?? 'produk'} yang ada? Kamu nggak sendirian — banyak yang ngerasain hal yang sama.`,
    Solution: `${values.productTitle ?? '...'} hadir sebagai solusi terbaik. Kualitas premium, hasil nyata yang bisa kamu rasain langsung!`,
    Closure: `Jangan sampai kehabisan! Dapatkan ${values.productTitle ?? '...'} sekarang dan rasain perbedaannya. Klik link di bio!`,
  };

  const cameraAngles: Record<string, string> = {
    Hook: 'eye-level, medium shot',
    Problem: 'slight low angle, medium close-up',
    Solution: 'eye-level, medium close-up',
    Closure: 'eye-level, close-up',
  };

  const intensities: Record<string, number> = {
    Hook: 0.3, Problem: 0.2, Solution: 0.3, Closure: 0.25,
  };

  return {
    scene_id: sceneId,
    title: `${values.productTitle ?? '...'} ${stepName} Scene`,
    duration: 8,
    visual_prompt: visualPrompts[stepName] ?? '',
    voice_over: voiceOvers[stepName] ?? '',
    voice_quality: 'Consistent Voice Tone, Same speaker through the video, Fixed pitch and stable speed, Clear studio Voice',
    motion_profile: {
      camera_angle: cameraAngles[stepName] ?? 'eye-level, medium shot',
      intensity: intensities[stepName] ?? 0.3,
      micro_movements: [
        'subtle head sways',
        'eye blinks',
        'natural breathing',
        'gentle shoulder movement',
      ],
    },
    is_generating_video: true,
    _meta: {
      model: 'veo-3.1-generate-preview',
      prompt_generated_by: 'gpt-4.1-nano',
      aspect_ratio: values.videoOrientation === 'portrait' ? '9:16' : '16:9',
      resolution: values.resolution ?? '720p',
    },
  };
}

interface PromptDebugPanelProps {
  values: FormValues;
  isFormComplete: boolean;
}

function PromptDebugPanel({ values, isFormComplete }: PromptDebugPanelProps) {
  const [copiedStep, setCopiedStep] = useState<string | null>(null);
  // AI-generated prompts keyed by step name
  const [aiPrompts, setAiPrompts] = useState<Record<string, ScenePromptResponse>>({});
  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const [errorStep, setErrorStep] = useState<Record<string, string>>({});

  const handleCopy = (stepName: string, json: string) => {
    navigator.clipboard.writeText(json);
    setCopiedStep(stepName);
    setTimeout(() => setCopiedStep(null), 1500);
  };

  const handleGenerateAI = async (stepName: string) => {
    if (!isFormComplete || loadingStep) return;
    setLoadingStep(stepName);
    setErrorStep(prev => ({ ...prev, [stepName]: '' }));
    try {
      const result = await apiGenerateDebugPrompt({
        stepName: stepName as 'Hook' | 'Problem' | 'Solution' | 'Closure',
        productName: values.productTitle ?? '',
        productCategory: values.productCategory ?? '',
        targetAudience: values.targetAudience ?? '',
        orientation: values.videoOrientation ?? '',
        resolution: values.resolution ?? '',
      });
      setAiPrompts(prev => ({ ...prev, [stepName]: result }));
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to generate prompt';
      setErrorStep(prev => ({ ...prev, [stepName]: msg }));
    } finally {
      setLoadingStep(null);
    }
  };

  const steps = ['Hook', 'Problem', 'Solution', 'Closure'];
  const stepColors: Record<string, string> = {
    Hook:     'border-indigo-400 bg-indigo-950',
    Problem:  'border-amber-400 bg-amber-950',
    Solution: 'border-emerald-400 bg-emerald-950',
    Closure:  'border-rose-400 bg-rose-950',
  };

  return (
    <div className="mt-6 border border-dashed border-slate-300 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 border-b border-slate-200">
        <BugOutlined className="text-slate-500" />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Debug — Prompt Preview</span>
        {!isFormComplete && (
          <span className="ml-auto text-[10px] text-slate-400 italic">Fill all fields to see prompts</span>
        )}
      </div>

      {!isFormComplete ? (
        <div className="p-4 text-center text-slate-400 text-sm">
          Complete the form above to preview the JSON prompts sent to Google Veo.
        </div>
      ) : (
        <div className="divide-y divide-slate-200">
          {steps.map((step) => {
            const localJson = JSON.stringify(buildPromptJson(step, values), null, 2);
            const aiJson = aiPrompts[step] ? JSON.stringify(aiPrompts[step], null, 2) : null;
            const displayJson = aiJson ?? localJson;
            const isCopied = copiedStep === step;
            const isLoading = loadingStep === step;
            const error = errorStep[step];
            const hasAI = !!aiJson;

            return (
              <div key={step} className="p-4">
                <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${stepColors[step]} text-white`}>
                      {step}
                    </span>
                    {hasAI && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-300">
                        AI ✓
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={() => handleGenerateAI(step)}
                      disabled={isLoading || !!loadingStep}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? (
                        <><SyncOutlined spin /> Generating…</>
                      ) : (
                        <><BugOutlined /> Generate via AI</>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(step, displayJson)}
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <CopyOutlined />
                      {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="mb-2 text-xs text-red-500 bg-red-50 border border-red-200 rounded px-2 py-1">
                    {error}
                  </div>
                )}
                <pre className="text-[11px] leading-relaxed text-slate-300 bg-slate-900 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-words font-mono">
                  {displayJson}
                </pre>
                {hasAI && (
                  <button
                    type="button"
                    onClick={() => setAiPrompts(prev => { const n = { ...prev }; delete n[step]; return n; })}
                    className="mt-1 text-[10px] text-slate-400 hover:text-slate-600"
                  >
                    ↩ Reset to local template
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Image upload dropzone ─────────────────────────────────────────────────────

interface ImageDropzoneProps {
  label: string;
  icon: React.ReactNode;
  value: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  onError: (msg: string) => void;
}

function ImageDropzone({ label, icon, value, onChange, disabled, onError }: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      onChange(file);
    } else {
      onError('Only JPEG and PNG files are accepted.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) onChange(file);
    e.target.value = '';
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed border-slate-200 bg-slate-50' :
          value ? 'border-indigo-400 bg-indigo-50' : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-indigo-50'}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
      {value ? (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={URL.createObjectURL(value)}
            alt="preview"
            className="w-12 h-12 object-cover rounded-lg border border-slate-200"
          />
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-medium text-slate-700 truncate">{value.name}</p>
            <p className="text-xs text-slate-400">{(value.size / 1024).toFixed(0)} KB</p>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(null); }}
            className="text-slate-400 hover:text-red-500 transition-colors"
          >
            <CloseCircleOutlined />
          </button>
        </div>
      ) : (
        <div className="py-2">
          <div className="text-2xl text-indigo-400 mb-1">{icon}</div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="text-xs text-slate-400 mt-0.5">JPEG or PNG, max 10 MB</p>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type PageStatus = 'idle' | 'uploading' | 'generating' | 'completed' | 'failed' | 'cancelled';

const STEP_NAMES = ['Hook', 'Problem', 'Solution', 'Closure'] as const;

const STEP_META = {
  Hook:     { description: 'Grabs immediate attention',       duration: '~5s' },
  Problem:  { description: 'Establishes contextual empathy',  duration: '~10s' },
  Solution: { description: 'Introduces product cleanly',      duration: '~15s' },
  Closure:  { description: 'Strong call to action',           duration: '~8s' },
};

export default function StudioPage() {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const [status, setStatus] = useState<PageStatus>('idle');
  const [statusMsg, setStatusMsg] = useState('');
  const [job, setJob] = useState<JobResponse | null>(null);
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [cancelling, setCancelling] = useState(false);

  // Live form values for the debug prompt preview
  const [formValues, setFormValues] = useState<FormValues>({});

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const startPolling = useCallback((jobId: string) => {
    pollRef.current = setInterval(async () => {
      try {
        const updated = await apiGetJob(jobId);
        setJob(updated);
        if (updated.status === 'completed') {
          stopPolling();
          setStatus('completed');
        } else if (updated.status === 'failed') {
          stopPolling();
          setStatus('failed');
          setStatusMsg('Video generation failed. Please try again.');
        } else if (updated.status === 'cancelled') {
          stopPolling();
          setStatus('cancelled');
        }
      } catch {
        // transient error — keep polling
      }
    }, 4000); // poll every 4 seconds
  }, [stopPolling]);

  const handleCancel = useCallback(async () => {
    if (!job || cancelling) return;
    setCancelling(true);
    try {
      await apiCancelJob(job.id);
      stopPolling();
      setStatus('cancelled');
      message.info('Job cancellation requested.');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to cancel job.';
      message.error(msg);
    } finally {
      setCancelling(false);
    }
  }, [job, cancelling, stopPolling, message]);

  const handleGenerate = async (values: {
    productTitle: string;
    productCategory: CreateJobPayload['productCategory'];
    targetAudience: CreateJobPayload['targetAudience'];
    videoOrientation: CreateJobPayload['orientation'];
    resolution: CreateJobPayload['resolution'];
  }) => {
    if (!modelFile || !productFile) {
      message.error('Please upload both model and product images.');
      return;
    }

    try {
      // Step 1: Upload images
      setStatus('uploading');
      setStatusMsg('Uploading images…');

      const [modelUpload, productUpload] = await Promise.all([
        apiUploadImage(modelFile),
        apiUploadImage(productFile),
      ]);

      // Step 2: Submit job
      setStatusMsg('Submitting generation job…');
      const { jobId } = await apiCreateJob({
        modelImageUrl:   modelUpload.url,
        productImageUrl: productUpload.url,
        productName:     values.productTitle,
        productCategory: values.productCategory,
        targetAudience:  values.targetAudience,
        orientation:     values.videoOrientation,
        resolution:      values.resolution,
      });

      // Step 3: Fetch initial state and start polling
      const initial = await apiGetJob(jobId);
      setJob(initial);
      setStatus('generating');
      setStatusMsg('');
      startPolling(jobId);

    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Something went wrong. Please try again.';
      message.error(msg);
      setStatus('idle');
      setStatusMsg('');
    }
  };

  const handleReset = () => {
    stopPolling();
    setStatus('idle');
    setStatusMsg('');
    setJob(null);
    setModelFile(null);
    setProductFile(null);
    form.resetFields();
  };

  // Derive current pipeline step index from job state
  const currentStepIndex = (() => {
    if (!job) return 0;
    const processingIdx = job.steps.findIndex(s => s.status === 'processing');
    if (processingIdx >= 0) return processingIdx;
    const completedCount = job.steps.filter(s => s.status === 'completed').length;
    return completedCount;
  })();

  const isGenerating = status === 'uploading' || status === 'generating';

  return (
    <div className="flex bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm h-[calc(100vh-112px)]">

      {/* ── LEFT SIDEBAR ─────────────────────────────────────────────────── */}
      <div className="w-[380px] bg-[#F8FAFC] border-r border-slate-200 flex flex-col flex-shrink-0 relative overflow-y-auto">

        {/* Panel Header */}
        <div className="p-6 border-b border-slate-200 sticky top-0 bg-[#F8FAFC]/95 backdrop-blur z-10 hidden sm:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center border border-indigo-200">
              <ControlOutlined className="text-xl text-indigo-600" />
            </div>
            <div>
              <Title level={4} className="m-0 text-slate-800 tracking-tight">Studio Config</Title>
              <Text className="text-slate-500 text-xs font-medium">Define your video parameters</Text>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 flex-grow">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleGenerate}
            requiredMark={false}
            size="large"
            disabled={isGenerating}
            onValuesChange={(_, all) => setFormValues(all)}
          >
            {/* Visual Assets */}
            <div className="mb-8">
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">1. Visual Assets</Text>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Model Image <span className="text-red-500">*</span></label>
                <ImageDropzone
                  label="Upload Model"
                  icon={<PictureOutlined />}
                  value={modelFile}
                  onChange={setModelFile}
                  disabled={isGenerating}
                  onError={(msg) => message.error(msg)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Product Image <span className="text-red-500">*</span></label>
                <ImageDropzone
                  label="Upload Product"
                  icon={<AppstoreOutlined />}
                  value={productFile}
                  onChange={setProductFile}
                  disabled={isGenerating}
                  onError={(msg) => message.error(msg)}
                />
              </div>
            </div>

            <Divider className="my-6 border-slate-200" />

            {/* Product Meta */}
            <div className="mb-2">
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">2. Product Meta</Text>

              <Form.Item
                name="productTitle"
                label={<span className="font-medium text-slate-700 text-sm">Product Name</span>}
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input placeholder="e.g. Lumina Glow Serum" className="rounded-xl border-slate-300 text-sm" />
              </Form.Item>

              <Form.Item
                name="productCategory"
                label={<span className="font-medium text-slate-700 text-sm">Category</span>}
                rules={[{ required: true, message: 'Required' }]}
              >
                <Select
                  placeholder="Select category"
                  options={[
                    { value: 'beauty',      label: 'Beauty & Skincare' },
                    { value: 'fashion',     label: 'Fashion & Apparel' },
                    { value: 'electronics', label: 'Electronics' },
                    { value: 'health',      label: 'Health & Wellness' },
                  ]}
                />
              </Form.Item>

              <Form.Item
                name="targetAudience"
                label={<span className="font-medium text-slate-700 text-sm">Target Audience</span>}
                rules={[{ required: true, message: 'Required' }]}
                className="mb-0"
              >
                <Select
                  placeholder="Select audience"
                  options={[
                    { value: 'man',      label: 'Men' },
                    { value: 'woman',    label: 'Women' },
                    { value: 'children', label: 'Children' },
                    { value: 'unisex',   label: 'Unisex / All' },
                  ]}
                />
              </Form.Item>
            </div>

            <Divider className="my-6 border-slate-200" />

            {/* Output Format */}
            <div className="mb-2">
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">3. Output Format</Text>

              <Form.Item
                name="videoOrientation"
                label={<span className="font-medium text-slate-700 text-sm">Orientation</span>}
                rules={[{ required: true, message: 'Required' }]}
              >
                <Select
                  placeholder="Select orientation"
                  options={[
                    { value: 'portrait',  label: 'Portrait (9:16) — TikTok / Reels' },
                    { value: 'landscape', label: 'Landscape (16:9) — YouTube' },
                    { value: 'square',    label: 'Square (1:1) — Instagram' },
                  ]}
                />
              </Form.Item>

              <Form.Item
                name="resolution"
                label={<span className="font-medium text-slate-700 text-sm">Resolution</span>}
                rules={[{ required: true, message: 'Required' }]}
                className="mb-0"
              >
                <Select
                  placeholder="Select resolution"
                  options={[
                    { value: '720p',  label: 'HD 720p (Fast)' },
                    { value: '1080p', label: 'FHD 1080p (Standard)' },
                    { value: '4k',    label: '4K Ultra HD (Pro only)' },
                  ]}
                />
              </Form.Item>
            </div>

            {/* Action button */}
            <div className="sticky bottom-0 -mx-6 -mb-6 p-6 pt-6 bg-[#F8FAFC] border-t border-slate-200 z-10 mt-6">
              {status === 'idle' || status === 'failed' || status === 'cancelled' ? (
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  className="bg-indigo-600 hover:bg-indigo-500 shadow-md border-0 h-14 text-base font-semibold rounded-xl"
                >
                  {status === 'failed' ? 'Retry Generation' :
                   status === 'cancelled' ? 'Start New Project' :
                   'Generate Video Sequence'}
                </Button>
              ) : isGenerating ? (
                <div className="flex flex-col gap-2">
                  <Button block disabled className="h-12 text-base font-semibold rounded-xl">
                    <SyncOutlined spin /> {statusMsg || 'Generating…'}
                  </Button>
                  <Button
                    block
                    danger
                    onClick={handleCancel}
                    loading={cancelling}
                    className="h-10 text-sm font-semibold rounded-xl border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Cancel Generation
                  </Button>
                </div>
              ) : (
                <Button
                  block
                  onClick={handleReset}
                  className="bg-white hover:bg-slate-50 border-slate-300 text-slate-700 h-14 text-base font-semibold rounded-xl shadow-sm"
                >
                  Start New Project
                </Button>
              )}
            </div>
          </Form>

          {/* ── DEBUG: Prompt Preview ─────────────────────────────────── */}
          {(() => {
            const isComplete = !!(
              formValues.productTitle &&
              formValues.productCategory &&
              formValues.targetAudience &&
              formValues.videoOrientation &&
              formValues.resolution
            );
            return (
              <PromptDebugPanel
                values={formValues}
                isFormComplete={isComplete}
              />
            );
          })()}

        </div>
      </div>

      {/* ── RIGHT CANVAS ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto bg-slate-50 flex flex-col relative">

        {/* Status bar */}
        {status !== 'idle' && (
          <div className="bg-white border-b border-slate-200 p-6 flex flex-col justify-center">
            <div className="flex justify-between items-end mb-4">
              <div>
                <Title level={4} className="m-0 text-slate-800">
                  {status === 'uploading' ? 'Uploading Assets' :
                   status === 'completed' ? 'Generation Complete' :
                   status === 'failed'    ? 'Generation Failed' :
                   status === 'cancelled' ? 'Generation Cancelled' :
                   'Pipeline Execution'}
                </Title>
                <Text className="text-slate-500 text-sm">
                  {status === 'uploading' ? statusMsg :
                   status === 'completed' ? 'All 4 steps completed successfully' :
                   status === 'failed'    ? 'One or more steps failed' :
                   status === 'cancelled' ? 'Job was cancelled by user' :
                   'Rendering 4-part AI sequence via Google Veo'}
                </Text>
              </div>
              <Text className="text-indigo-600 font-bold text-2xl leading-none">
                {job?.progress ?? 0}%
              </Text>
            </div>
            <Progress
              percent={job?.progress ?? (status === 'uploading' ? 5 : 0)}
              showInfo={false}
              strokeColor={status === 'failed' ? '#EF4444' : '#4F46E5'}
              railColor="#EEF2FF"
              size={['100%', 8]}
              className="m-0"
            />
            {status === 'generating' && (
              <div className="mt-8 px-4 hidden md:block">
                <Steps
                  current={currentStepIndex}
                  size="small"
                  items={STEP_NAMES.map((name) => {
                    const step = job?.steps.find(s => s.name === name);
                    return {
                      title: name,
                      status: step?.status === 'completed' ? 'finish' :
                              step?.status === 'processing' ? 'process' :
                              step?.status === 'failed'    ? 'error'   : 'wait',
                    };
                  })}
                />
              </div>
            )}
          </div>
        )}

        <div className="flex-grow p-8 flex items-center justify-center">
          {status === 'idle' ? (
            <div className="text-center max-w-sm">
              <div className="w-24 h-24 bg-white border border-slate-200 rounded-3xl mx-auto flex items-center justify-center shadow-sm mb-6">
                <PlaySquareOutlined className="text-4xl text-slate-300" />
              </div>
              <Title level={3} className="text-slate-800 mb-2">Ready to Create</Title>
              <Paragraph className="text-slate-500 text-base">
                Configure your visual assets and product details on the left, then click Generate.
              </Paragraph>
            </div>
          ) : (
            <div className="w-full max-w-5xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {STEP_NAMES.map((name, index) => {
                  const step = job?.steps.find(s => s.name === name);
                  const stepStatus = step?.status ?? 'pending';
                  const isActive  = stepStatus === 'processing';
                  const isDone    = stepStatus === 'completed';
                  const isFailed  = stepStatus === 'failed';
                  const isWaiting = stepStatus === 'pending';
                  const meta = STEP_META[name];

                  return (
                    <div
                      key={name}
                      className={`relative rounded-2xl overflow-hidden border transition-all duration-500 flex flex-col bg-[#0F172A] aspect-video
                        ${isActive  ? 'border-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] scale-[1.02]' :
                          isDone    ? 'border-emerald-600 shadow-md' :
                          isFailed  ? 'border-red-600 shadow-md' :
                          'border-slate-800 opacity-60'}`}
                    >
                      {/* Video / state area */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {isWaiting && (
                          <VideoCameraAddOutlined className="text-4xl text-slate-500 opacity-50" />
                        )}
                        {isActive && (
                          <div className="flex flex-col items-center">
                            <SyncOutlined spin className="text-4xl text-indigo-400 mb-4 drop-shadow-[0_0_8px_rgba(79,70,229,0.8)]" style={{ color: '#818cf8' }} />
                            <span className="text-indigo-300 font-medium tracking-wider text-sm animate-pulse">Rendering…</span>
                          </div>
                        )}
                        {isFailed && (
                          <div className="flex flex-col items-center">
                            <CloseCircleOutlined className="text-4xl text-red-400 mb-2" />
                            <span className="text-red-300 text-sm font-medium">Step failed</span>
                          </div>
                        )}
                        {isDone && step?.videoUrl && (
                          <div className="group w-full h-full relative cursor-pointer">
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
                            <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                              <a href={step.videoUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                                <PlayCircleOutlined className="text-6xl text-white drop-shadow-xl group-hover:scale-110 transition-all" style={{ color: '#ffffff' }} />
                              </a>
                            </div>
                            <div className="absolute top-4 right-4 bg-emerald-600 px-2 py-1 rounded text-white text-[10px] font-bold tracking-widest uppercase">
                              Done
                            </div>
                          </div>
                        )}
                        {isDone && !step?.videoUrl && (
                          <CheckCircleOutlined className="text-4xl text-emerald-400" />
                        )}
                      </div>

                      {/* Bottom HUD */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent flex justify-between items-end">
                        <div>
                          <h5 className="text-white m-0 tracking-tight font-semibold text-lg drop-shadow-md">
                            {index + 1}. {name}
                          </h5>
                          <p className="text-slate-300 text-sm mt-1 mb-0 drop-shadow-md font-medium">
                            {meta.description}
                          </p>
                        </div>
                        <div className="bg-black/60 backdrop-blur px-2 py-1 rounded font-mono text-slate-200 text-xs shadow-sm border border-slate-700/50">
                          {meta.duration}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Completed CTA */}
              {status === 'completed' && (
                <div className="mt-8 text-center">
                  <p className="text-slate-500 mb-4">Your video sequence is ready. View it in your history or start a new project.</p>
                  <div className="flex gap-4 justify-center">
                    <Button type="primary" href="/history" className="bg-indigo-600 hover:bg-indigo-500 border-0 shadow-md font-semibold">
                      View in History
                    </Button>
                    <Button onClick={handleReset} className="border-slate-300 text-slate-700 font-semibold">
                      New Project
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
