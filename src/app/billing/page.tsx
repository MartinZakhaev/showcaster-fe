"use client";

import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  Button, 
  Progress, 
  Switch, 
  Tag, 
  Table, 
  Row, 
  Col, 
  Divider 
} from 'antd';
import { 
  CheckCircleFilled, 
  CreditCardOutlined, 
  DownloadOutlined, 
  ThunderboltFilled,
  SafetyCertificateFilled,
  WarningOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export default function BillingPage() {
  const [isYearly, setIsYearly] = useState(true);

  // Mock Invoice Data
  const invoices = [
    { key: '1', date: 'Oct 01, 2026', amount: '$79.00', status: 'Paid', invoiceId: 'INV-4920' },
    { key: '2', date: 'Sep 01, 2026', amount: '$79.00', status: 'Paid', invoiceId: 'INV-4819' },
    { key: '3', date: 'Aug 01, 2026', amount: '$79.00', status: 'Paid', invoiceId: 'INV-4702' },
    { key: '4', date: 'Jul 01, 2026', amount: '$79.00', status: 'Paid', invoiceId: 'INV-4621' },
  ];

  const invoiceColumns = [
    { title: 'Invoice', dataIndex: 'invoiceId', key: 'invoiceId', render: (text: string) => <Text className="font-medium text-slate-800">{text}</Text> },
    { title: 'Date', dataIndex: 'date', key: 'date', render: (text: string) => <Text className="text-slate-500">{text}</Text> },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (text: string) => <Text className="font-semibold text-slate-700">{text}</Text> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color="success" className="uppercase font-bold border-0 text-[10px] bg-emerald-50 text-emerald-600">{status}</Tag> },
    { title: 'Action', key: 'action', render: () => <Button type="text" icon={<DownloadOutlined />} className="text-slate-400 hover:text-indigo-600" /> },
  ];

  const pricingPlans = [
    {
      name: "Free",
      description: "For individuals wanting to test the waters.",
      priceMonthly: 0,
      priceYearly: 0,
      popular: false,
      buttonText: "Current Plan",
      features: ["10 Video Generations", "Standard 720p Quality", "Showcaster Watermark", "Community Support"],
    },
    {
      name: "Starter",
      description: "Perfect for getting your first campaigns off the ground.",
      priceMonthly: 29,
      priceYearly: 24,
      popular: false,
      buttonText: "Upgrade to Starter",
      features: ["50 Video Generations / mo", "1080p HD Quality", "No Watermark", "Email Support", "1 Active Campaign"],
    },
    {
      name: "Professional",
      description: "The ideal plan for growing affiliates and agencies.",
      priceMonthly: 79,
      priceYearly: 59,
      popular: true,
      buttonText: "Upgrade to Pro",
      features: ["250 Video Generations / mo", "4K Ultra HD Quality", "Fast-lane Rendering", "Priority Next-Day Support", "Unlimited Campaigns", "Custom Branding"],
    },
    {
      name: "Enterprise",
      description: "For high-volume teams requiring maximum scaling.",
      priceMonthly: 249,
      priceYearly: 199,
      popular: false,
      buttonText: "Contact Sales",
      features: ["Unlimited Video Generations", "API Access", "Dedicated Account Manager", "Custom Infrastructure", "Role-based Access Control", "SSO Authentication"],
    }
  ];

  return (
    <div className="max-w-7xl mx-auto pb-16 animate-in fade-in duration-500 w-full flex flex-col gap-10">
      
      {/* SECTION: Overview & Current Plan */}
      <section>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          <div className="flex-1">
             <div className="flex items-center gap-3 mb-2">
                <Title level={3} className="m-0 text-slate-900 tracking-tight">Free Plan</Title>
                <Tag color="processing" className="m-0 border-0 bg-indigo-50 text-indigo-700 font-bold tracking-widest text-[10px] uppercase">Active</Tag>
             </div>
             <Text className="text-slate-500 block mb-6 text-base">You are currently on the Free Tier. Upgrade to unblock unlimited potentials and remove watermarks.</Text>
             
             <div className="bg-[#F8FAFC] rounded-xl p-5 border border-slate-100 max-w-md">
                <div className="flex justify-between items-end mb-2">
                   <Text className="font-semibold text-slate-700">Video Generation Credits</Text>
                   <Text className="text-slate-500 text-sm">8 <span className="text-slate-300">/ 10</span></Text>
                </div>
                <Progress percent={80} showInfo={false} strokeColor="#4F46E5" railColor="#E2E8F0" size={["100%", 8]} className="m-0" />
                <Text className="text-xs text-slate-400 mt-2 block">Credits will not reset on the free plan.</Text>
             </div>
          </div>
          
          <div className="w-full md:w-auto bg-slate-50 border border-slate-200 p-6 rounded-xl flex flex-col items-center justify-center text-center">
             <ThunderboltFilled className="text-3xl text-amber-400 mb-3 drop-shadow-sm" />
             <Title level={4} className="m-0 text-slate-800 tracking-tight">Ready to scale?</Title>
             <Text className="text-slate-500 text-sm mb-4 block max-w-[200px]">Unlock 4K quality and unlimited campaigns.</Text>
             <Button type="primary" className="bg-indigo-600 hover:bg-indigo-500 border-0 shadow-md font-semibold px-6 select-none" onClick={() => window.scrollTo({top: 400, behavior: 'smooth'})}>
               View Pricing Plans
             </Button>
          </div>
        </div>
      </section>

      {/* SECTION: Pricing Tiers */}
      <section>
        <div className="text-center mb-8">
           <Title level={2} className="text-slate-900 tracking-tight mb-2">Plans & Pricing</Title>
           <Text className="text-slate-500 text-base mb-6 block">Simple, transparent pricing that grows with you.</Text>
           
           <div className="flex items-center justify-center gap-4">
              <Text className={`font-medium ${!isYearly ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</Text>
              <Switch checked={isYearly} onChange={setIsYearly} className="bg-indigo-600" />
              <div className="flex items-center gap-2">
                 <Text className={`font-medium ${isYearly ? 'text-slate-900' : 'text-slate-400'}`}>Yearly</Text>
                 <Tag className="bg-emerald-100 text-emerald-700 border-0 rounded-full font-bold uppercase text-[10px] m-0">Save 20%</Tag>
              </div>
           </div>
        </div>

        <Row gutter={[24, 24]}>
          {pricingPlans.map((plan, idx) => (
            <Col xs={24} md={12} xl={6} key={idx}>
              <Card 
                className={`h-full relative flex flex-col transition-all duration-300 ${plan.popular ? 'border-indigo-600 shadow-xl shadow-indigo-100 scale-105 z-10' : 'border-slate-200 shadow-sm hover:border-slate-300'}`}
                styles={{ body: { padding: '32px', display: 'flex', flexDirection: 'column', height: '100%' } }}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-indigo-600 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-md">
                    Most Popular
                  </div>
                )}
                
                <Title level={4} className={`m-0 tracking-tight ${plan.popular ? 'text-indigo-600' : 'text-slate-800'}`}>
                  {plan.name}
                </Title>
                <div className="min-h-[48px] mt-2 mb-6">
                  <Text className="text-slate-500 text-sm leading-relaxed block">{plan.description}</Text>
                </div>
                
                <div className="mb-6 flex items-baseline gap-1">
                  <Text className="text-4xl font-bold tracking-tighter text-slate-900">
                    ${isYearly ? plan.priceYearly : plan.priceMonthly}
                  </Text>
                  {plan.priceMonthly > 0 && <Text className="text-slate-400 font-medium">/mo</Text>}
                </div>
                
                <Button 
                  type={plan.popular ? "primary" : "default"} 
                  disabled={plan.name === 'Free'}
                  block 
                  size="large"
                  className={`mb-8 font-semibold rounded-lg ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-500 border-0 shadow-md h-12' : plan.name==='Free' ? 'bg-slate-50 h-12 text-slate-400' : 'h-12 border-slate-300 text-slate-700'}`}
                >
                  {plan.buttonText}
                </Button>

                <div className="flex-grow">
                   <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">Included Features</Text>
                   <ul className="space-y-3 m-0 p-0 list-none">
                     {plan.features.map((feature, fIdx) => (
                       <li key={fIdx} className="flex items-start gap-3">
                         <CheckCircleFilled className="text-indigo-500 mt-1" />
                         <span className="text-slate-600 text-sm font-medium">{feature}</span>
                       </li>
                     ))}
                   </ul>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* SECTION: Payment & History Inline */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-4">
         
         <div className="xl:col-span-1">
            <Title level={4} className="text-slate-900 tracking-tight mb-4">Payment Method</Title>
            <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden relative">
               <div className="absolute top-0 right-0 p-6 opacity-10">
                 <SafetyCertificateFilled className="text-8xl text-white" />
               </div>
               
               <div className="relative z-10">
                 <div className="flex justify-between items-start mb-10">
                    <div className="w-12 h-8 bg-white/20 backdrop-blur rounded flex items-center justify-center">
                       <CreditCardOutlined className="text-white text-xl" />
                    </div>
                    <Tag className="border-0 bg-white/10 text-white font-mono m-0">Default</Tag>
                 </div>
                 
                 <div className="font-mono text-white text-xl mb-2 tracking-widest opacity-90">
                   **** **** **** 4242
                 </div>
                 
                 <div className="flex justify-between items-end">
                    <div>
                      <Text className="text-white/50 text-[10px] uppercase font-bold tracking-widest block mb-1">Expires</Text>
                      <Text className="text-white font-mono opacity-90">12/28</Text>
                    </div>
                    <div>
                       <div className="flex gap-[-4px]">
                          <div className="w-6 h-6 rounded-full bg-red-500 opacity-80 mix-blend-multiply"></div>
                          <div className="w-6 h-6 rounded-full bg-amber-500 opacity-80 mix-blend-multiply -ml-2"></div>
                       </div>
                    </div>
                 </div>
               </div>
            </Card>
            <div className="mt-4">
              <Button block className="border-slate-300 text-slate-700 font-medium">Update Payment Method</Button>
            </div>
         </div>

         <div className="xl:col-span-2 flex flex-col">
            <div className="flex justify-between items-center mb-4">
               <Title level={4} className="text-slate-900 tracking-tight m-0">Billing History</Title>
               <Button type="link" className="text-indigo-600 font-medium px-0">View All</Button>
            </div>
            <Card className="border-slate-200 shadow-sm flex-grow" styles={{ body: { padding: 0 } }}>
               <Table 
                 columns={invoiceColumns} 
                 dataSource={invoices} 
                 pagination={false} 
                 className="custom-table"
               />
            </Card>
         </div>

      </section>

    </div>
  );
}
