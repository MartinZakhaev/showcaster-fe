"use client";

import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Upload, 
  Typography, 
  Tag,
  Select,
  Progress,
  Divider,
  Steps
} from 'antd';
import { 
  InboxOutlined, 
  VideoCameraAddOutlined, 
  PlayCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ControlOutlined,
  PictureOutlined,
  AppstoreOutlined,
  PlaySquareOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

export default function StudioPage() {
  const [form] = Form.useForm();
  
  // State: 'idle' | 'generating' | 'completed'
  const [status, setStatus] = useState<'idle' | 'generating' | 'completed'>('idle');
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0); 

  const handleGenerate = () => {
    setStatus('generating');
    setOverallProgress(5);
    setCurrentStepIndex(1);
    
    // Simulate generation loop
    let progress = 5;
    const interval = setInterval(() => {
      progress += 2;
      setOverallProgress(progress > 100 ? 100 : progress);
      
      if (progress > 25) setCurrentStepIndex(2);
      if (progress > 50) setCurrentStepIndex(3);
      if (progress > 75) setCurrentStepIndex(4);
      
      if (progress >= 100) {
        clearInterval(interval);
        setStatus('completed');
      }
    }, 200); // Takes ~10 seconds
  };

  const handleReset = () => {
    setStatus('idle');
    setOverallProgress(0);
    setCurrentStepIndex(0);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  // The 4 video phases
  const pipelineSteps = [
    { title: "The Hook", description: "Grabs immediate attention", duration: "00:05" },
    { title: "The Problem", description: "Establishes contextual empathy", duration: "00:10" },
    { title: "The Solution", description: "Introduces product cleanly", duration: "00:15" },
    { title: "The Closure", description: "Strong call to action", duration: "00:08" },
  ];

  return (
    <div className="flex bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm h-[calc(100vh-112px)]">
      
      {/* ====================================================================
          LEFT SIDEBAR: CONFIGURATION PANEL
          ==================================================================== */}
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

        {/* Form Container */}
        <div className="p-6 flex-grow">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleGenerate}
            requiredMark={false}
            size="large"
            disabled={status === 'generating'}
          >
            {/* Visual Assets Section */}
            <div className="mb-8">
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">1. Visual Assets</Text>
              
              <Form.Item
                name="modelImage"
                label={<span className="font-medium text-slate-700 text-sm">Model Input</span>}
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[{ required: true, message: 'Required' }]}
              >
                <Dragger 
                  name="files" 
                  action="/upload.do" 
                  className="bg-white hover:bg-indigo-50 border-slate-300 transition-colors rounded-xl"
                  style={{ padding: '16px 0' }}
                >
                  <PictureOutlined className="text-2xl text-indigo-400 mb-2" />
                  <p className="text-sm font-medium text-slate-600">Upload Model</p>
                </Dragger>
              </Form.Item>

              <Form.Item
                name="productImage"
                label={<span className="font-medium text-slate-700 text-sm">Product Input</span>}
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[{ required: true, message: 'Required' }]}
              >
                <Dragger 
                  name="files" 
                  action="/upload.do" 
                  className="bg-white hover:bg-indigo-50 border-slate-300 transition-colors rounded-xl"
                  style={{ padding: '16px 0' }}
                >
                  <AppstoreOutlined className="text-2xl text-indigo-400 mb-2" />
                  <p className="text-sm font-medium text-slate-600">Upload Product</p>
                </Dragger>
              </Form.Item>
            </div>

            <Divider className="my-6 border-slate-200" />

            {/* Product Meta Section */}
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
                    { value: 'beauty', label: 'Beauty & Skincare' },
                    { value: 'fashion', label: 'Fashion & Apparel' },
                    { value: 'electronics', label: 'Electronics' },
                    { value: 'health', label: 'Health & Wellness' },
                  ]}
                  className="rounded-xl font-medium"
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
                    { value: 'man', label: 'Men' },
                    { value: 'woman', label: 'Women' },
                    { value: 'children', label: 'Children' },
                    { value: 'unisex', label: 'Unisex / All' },
                  ]}
                  className="rounded-xl font-medium"
                />
              </Form.Item>
            </div>

            <Divider className="my-6 border-slate-200" />

            {/* Output Format Section */}
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
                    { value: 'portrait', label: 'Portrait (9:16) - TikTok/Reels' },
                    { value: 'landscape', label: 'Landscape (16:9) - YouTube' },
                    { value: 'square', label: 'Square (1:1) - Instagram' },
                  ]}
                  className="rounded-xl font-medium"
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
                    { value: '720p', label: 'HD 720p (Fast)' },
                    { value: '1080p', label: 'FHD 1080p (Standard)' },
                    { value: '4k', label: '4K Ultra HD (Pro/Enterprise only)' },
                  ]}
                  className="rounded-xl font-medium"
                />
              </Form.Item>
            </div>
            
            {/* Action Area built into the form to ensure valid submission logic */}
            <div className="sticky bottom-0 -mx-6 -mb-6 p-6 pt-6 bg-[#F8FAFC] border-t border-slate-200 z-10 mt-6">
               {status === 'idle' ? (
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    block 
                    className="bg-indigo-600 hover:bg-indigo-500 shadow-md border-0 h-14 text-base font-semibold rounded-xl"
                  >
                    Generate Video Sequence
                  </Button>
                ) : status === 'generating' ? (
                  <Button 
                     block 
                     className="bg-slate-100 text-slate-400 border-slate-200 h-14 text-base font-semibold rounded-xl cursor-not-allowed"
                     disabled
                  >
                     <SyncOutlined spin /> Generating...
                  </Button>
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
        </div>
      </div>

      {/* ====================================================================
          RIGHT MAIN CANVAS: PIPELINE VIEW
          ==================================================================== */}
      <div className="flex-1 overflow-y-auto bg-slate-50 flex flex-col relative">
        
        {/* Top Status Bar (Only visible during/after generation) */}
        {status !== 'idle' && (
          <div className="bg-white border-b border-slate-200 p-6 flex flex-col justify-center animate-in slide-in-from-top-4">
             <div className="flex justify-between items-end mb-4">
                 <div>
                   <Title level={4} className="m-0 text-slate-800">Pipeline Execution</Title>
                   <Text className="text-slate-500 text-sm">Rendering 4-part AI sequence</Text>
                 </div>
                 <div className="text-right">
                    <Text className="text-indigo-600 font-bold text-2xl m-0 leading-none">{overallProgress}%</Text>
                 </div>
             </div>
             <Progress percent={overallProgress} showInfo={false} strokeColor="#4F46E5" railColor="#EEF2FF" size={["100%", 8]} className="m-0" />
             
             <div className="mt-8 px-4 hidden md:block">
                 <Steps 
                   current={currentStepIndex - 1} 
                   size="small"
                   items={[
                     { title: "Hook" },
                     { title: "Problem" },
                     { title: "Solution" },
                     { title: "Closure" }
                   ]}
                 />
             </div>
          </div>
        )}

        <div className="flex-grow p-8 flex items-center justify-center">
            {status === 'idle' ? (
               // IDLE STATE
               <div className="text-center max-w-sm animate-in fade-in duration-700">
                  <div className="w-24 h-24 bg-white border border-slate-200 rounded-3xl mx-auto flex items-center justify-center shadow-sm mb-6">
                     <PlaySquareOutlined className="text-4xl text-slate-300" />
                  </div>
                  <Title level={3} className="text-slate-800 mb-2">Ready to Create</Title>
                  <Paragraph className="text-slate-500 text-base">
                    Please configure your visual assets and product details on the left sidebar.
                  </Paragraph>
               </div>
            ) : (
               // GENERATING / COMPLETED STATE
               <div className="w-full max-w-5xl animate-in fade-in duration-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pipelineSteps.map((step, index) => {
                       const stepNum = index + 1;
                       const isActive = currentStepIndex === stepNum && status === 'generating';
                       const isDone = currentStepIndex > stepNum || status === 'completed';
                       const isWaiting = currentStepIndex < stepNum && status === 'generating';

                       // We use a dark elegant "media" card feel for the videos
                       return (
                          <div 
                             key={stepNum} 
                             className={`relative rounded-2xl overflow-hidden border transition-all duration-500 flex flex-col bg-[#0F172A] aspect-video
                               ${isActive ? 'border-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] scale-[1.02]' : 
                                 isDone ? 'border-slate-700 shadow-md' : 'border-slate-800 opacity-60'}`}
                          >
                             {/* Video Placeholder Area */}
                             <div className="absolute inset-0 flex items-center justify-center">
                               {isWaiting ? (
                                  <VideoCameraAddOutlined className="text-4xl text-slate-500 opacity-50" style={{ color: '#64748b' }} />
                               ) : isActive ? (
                                  <div className="flex flex-col items-center">
                                     <SyncOutlined spin className="text-4xl text-indigo-400 mb-4 drop-shadow-[0_0_8px_rgba(79,70,229,0.8)]" style={{ color: '#818cf8' }} />
                                     <span className="text-indigo-300 font-medium tracking-wider text-sm animate-pulse">Rendering Layer...</span>
                                  </div>
                               ) : (
                                 <div className="group w-full h-full relative cursor-pointer">
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <PlayCircleOutlined className="text-6xl text-white opacity-90 group-hover:scale-110 drop-shadow-xl transition-all" style={{ color: '#ffffff' }} />
                                    </div>
                                    <div className="absolute top-4 right-4 bg-indigo-600 px-2 py-1 rounded text-white text-[10px] font-bold tracking-widest uppercase">
                                       Done
                                    </div>
                                 </div>
                               )}
                             </div>

                             {/* Bottom HUD Data Overlay */}
                             <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent flex justify-between items-end">
                                 <div>
                                   <h5 className="text-white m-0 tracking-tight flex items-center gap-2 font-semibold text-lg drop-shadow-md">
                                     {step.title}
                                   </h5>
                                   <p className="text-slate-300 text-sm mt-1 mb-0 drop-shadow-md font-medium">
                                     {step.description}
                                   </p>
                                 </div>
                                 <div className="bg-black/60 backdrop-blur px-2 py-1 rounded font-mono text-slate-200 text-xs shadow-sm border border-slate-700/50">
                                    {step.duration}
                                 </div>
                              </div>
                          </div>
                       )
                    })}
                  </div>
               </div>
            )}
        </div>
      </div>
    </div>
  );
}
