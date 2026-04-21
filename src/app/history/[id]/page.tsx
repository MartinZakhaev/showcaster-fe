"use client";

import React from 'react';
import { 
  Typography, 
  Card, 
  Tag, 
  Button, 
  Breadcrumb,
  Row,
  Col,
  Divider,
} from 'antd';
import { 
  ArrowLeftOutlined, 
  DownloadOutlined, 
  PlayCircleOutlined,
  DeleteOutlined,
  PictureOutlined,
  AppstoreOutlined,
  SettingOutlined,
  GlobalOutlined,
  TeamOutlined,
  ShareAltOutlined
} from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text, Paragraph } = Typography;

export default function HistoryDetailPage() {
  
  // The 4 video phases (Mock logic for a completed generation)
  const pipelineSteps = [
    { title: "The Hook", description: "Grabs immediate attention", duration: "00:05", url: "#" },
    { title: "The Problem", description: "Establishes contextual empathy", duration: "00:10", url: "#" },
    { title: "The Solution", description: "Introduces product cleanly", duration: "00:15", url: "#" },
    { title: "The Closure", description: "Strong call to action", duration: "00:08", url: "#" },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-500 pb-12">
      
      {/* Breadcrumbs & Navigation */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <Breadcrumb className="mb-2" items={[
              { title: <Link href="/history" className="text-slate-400 hover:text-indigo-600"><ArrowLeftOutlined className="mr-1" /> History</Link> },
              { title: 'Project Details' },
            ]} />
            <div className="flex items-center gap-3">
               <Title level={2} className="text-slate-900 tracking-tight m-0">Lumina Glow Serum Launch</Title>
               <Tag color="success" className="uppercase text-[10px] m-0 border-0 bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5">Completed</Tag>
            </div>
            <Text className="text-slate-500 mt-1 block">Generated on Oct 24, 2026 at 09:42 AM</Text>
         </div>
         
         <div className="flex gap-3">
            <Button size="large" icon={<DeleteOutlined />} danger className="border-red-200">Delete</Button>
            <Button size="large" icon={<DownloadOutlined />} type="primary" className="bg-indigo-600 hover:bg-indigo-500 border-0 shadow-md font-semibold">
              Download All (HD)
            </Button>
         </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column: Configurations & Metadata */}
        <Col xs={24} lg={8}>
           <Card className="border-slate-200 shadow-sm h-full" styles={{ body: { padding: '24px' } }}>
              <Title level={5} className="text-slate-800 m-0 mb-4 flex items-center gap-2">
                <SettingOutlined className="text-indigo-500" /> Original Parameters
              </Title>
              
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6">
                 <div className="flex gap-4 mb-4">
                    <div className="w-1/2">
                       <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Model</Text>
                       <div className="aspect-[3/4] bg-slate-200 rounded-lg flex items-center justify-center border border-slate-300 border-dashed">
                          <PictureOutlined className="text-2xl text-slate-400" />
                       </div>
                       <Text className="text-[10px] text-slate-500 mt-1 block truncate">model_input_42.jpg</Text>
                    </div>
                    <div className="w-1/2">
                       <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Product</Text>
                       <div className="aspect-[3/4] bg-slate-200 rounded-lg flex items-center justify-center border border-slate-300 border-dashed">
                          <AppstoreOutlined className="text-2xl text-slate-400" />
                       </div>
                       <Text className="text-[10px] text-slate-500 mt-1 block truncate">serum_bottle_iso.png</Text>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <div>
                    <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Target Audience</Text>
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                       <TeamOutlined className="text-indigo-500" /> Women (18-34)
                    </div>
                 </div>
                 <div>
                    <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Category / Niche</Text>
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                       <GlobalOutlined className="text-indigo-500" /> Beauty & Skincare
                    </div>
                 </div>
                 <Divider className="my-2 border-slate-100" />
                 <div className="flex justify-between">
                    <Text className="text-slate-500 font-medium">Orientation</Text>
                    <Text className="text-slate-800 font-semibold">Portrait (9:16)</Text>
                 </div>
                 <div className="flex justify-between">
                    <Text className="text-slate-500 font-medium">Resolution</Text>
                    <Text className="text-slate-800 font-semibold">1080p</Text>
                 </div>
              </div>
           </Card>
        </Col>

        {/* Right Column: Video Outputs Grid */}
        <Col xs={24} lg={16}>
           <Card className="border-slate-200 shadow-sm h-full" styles={{ body: { padding: '24px' } }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <Title level={4} className="text-slate-800 m-0">Generated Sequence</Title>
                  <Text className="text-slate-500 text-sm">Review and download the isolated videos making up your pipeline.</Text>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pipelineSteps.map((step, index) => {
                   const stepNum = index + 1;

                   return (
                      <div 
                         key={stepNum} 
                         className="relative rounded-2xl overflow-hidden border border-slate-700 flex flex-col bg-[#0F172A] aspect-video group shadow-sm hover:shadow-lg transition-all"
                      >
                         {/* Video Thumbnail Area */}
                         <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/40 opacity-80 group-hover:opacity-60 transition-opacity"></div>
                            <PlayCircleOutlined className="text-6xl text-white opacity-90 group-hover:scale-110 drop-shadow-xl transition-all" style={{ color: '#ffffff' }} />
                            
                            {/* Top HUD actions (shows on hover) */}
                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <Button type="text" shape="circle" icon={<ShareAltOutlined />} className="bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm border-0" />
                               <Button type="primary" shape="circle" icon={<DownloadOutlined />} className="bg-indigo-600 hover:bg-indigo-500 border-0 shadow-md" />
                            </div>
                         </div>

                         {/* Bottom HUD Overlay */}
                         <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent flex justify-between items-end">
                            <div>
                               <h5 className="text-white m-0 tracking-tight flex items-center gap-2 font-semibold text-lg drop-shadow-md">
                                 {stepNum}. {step.title}
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
           </Card>
        </Col>
      </Row>

    </div>
  );
}
