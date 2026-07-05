import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import {
  FiArrowRight, FiThermometer, FiMapPin, FiShield,
  FiTruck, FiChevronDown, FiClipboard, FiActivity
} from 'react-icons/fi';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const faqItems = [
    {
      question: "What does the route analysis actually show me?",
      answer: "You get the real driving distance and duration, a turn-by-turn route breakdown on a map, and an AI report covering temperature risks along the corridor, spoilage probability, optimal departure time, compliance checklist, and recommended stops — all specific to your cargo type."
    },
    {
      question: "Which cargo types are supported?",
      answer: "Vaccines (2–8°C), Medicines (2–8°C), Dairy (1–4°C), Seafood (-2–2°C), Frozen Food (-20 to -15°C), and Fresh Fruits (2–10°C). Each gets a tailored risk profile and compliance notes."
    },
    {
      question: "Do I need any hardware or setup?",
      answer: "No. Just sign up and start entering routes. There's nothing to install. The analysis is entirely cloud-based."
    },
    {
      question: "How accurate is the distance and duration?",
      answer: "We use Google Maps Directions API for real road data. If that's unavailable, we fall back to a smart estimation using real coordinates of 30+ Indian cities and average highway speeds — so you always get a realistic result."
    },
    {
      question: "What is spoilage probability?",
      answer: "It's an AI-calculated percentage representing the risk of cargo degradation based on route length, transit time, ambient temperatures for the season, and your cargo's temperature sensitivity."
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative w-full min-h-[90vh] flex items-center bg-[#FDFCFB] overflow-hidden">
        
        {/* Right Background Image */}
        <div className="absolute inset-0 lg:left-auto lg:right-0 w-full lg:w-[55%] h-full z-0">
          {/* Desktop fade: sharp fade on the left edge to blend with background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FDFCFB] via-[#FDFCFB]/60 to-transparent w-full lg:w-1/2 z-10 hidden lg:block" />
          {/* Mobile/Tablet overlay: light wash to keep text readable */}
          <div className="absolute inset-0 bg-[#FDFCFB]/85 lg:hidden z-10" />
          
          <img 
            src="/hero_truck.png" 
            alt="Cold Chain Truck" 
            className="w-full h-full object-cover object-center lg:object-left"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-16">
          <div className="w-full lg:w-[55%] xl:w-[50%] lg:pr-8">
            
            {/* Top Label */}
            <div className="flex items-center gap-3 text-[14px] font-bold text-primary-brand mb-6 sm:mb-8">
              <div className="w-6 h-[2px] bg-primary-brand"></div>
              Cold-chain route intelligence for India
            </div>

            {/* Headline */}
            <h1 className="text-[46px] md:text-[64px] lg:text-[68px] font-black tracking-tight leading-[1.05] mb-6">
              <span className="text-slate-900 block">Know your route.</span>
              <span className="text-primary-brand block">Before you dispatch.</span>
            </h1>

            {/* Subhead */}
            <p className="text-[16px] md:text-[18px] text-slate-800 lg:text-slate-700 max-w-xl leading-relaxed mb-10 font-medium drop-shadow-sm lg:drop-shadow-none">
              Enter any two locations — get the driving route, temperature risk analysis, compliance checklist, and spoilage forecast.
              <br /><br />
              Powered by AI, built for cold chain.
            </p>

            {/* Input fields */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 w-full max-w-xl">
              <div className="flex-1 flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3.5 w-full shadow-sm">
                <FiMapPin className="text-primary-brand w-5 h-5 flex-shrink-0" />
                <span className="text-slate-800 font-medium text-[15px]">Mumbai, Maharashtra</span>
              </div>
              
              <div className="text-slate-500 rotate-90 sm:rotate-0 flex-shrink-0 font-bold text-xl">
                ⇄
              </div>

              <div className="flex-1 flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3.5 w-full shadow-sm">
                <FiMapPin className="text-primary-brand w-5 h-5 flex-shrink-0" />
                <span className="text-slate-800 font-medium text-[15px]">Delhi, NCR</span>
              </div>
            </div>

            {/* Buttons & Trust */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-5">
              <button
                onClick={() => navigate('/signup')}
                className="bg-primary-brand hover:bg-primary-hover text-white text-[15px] font-bold py-3.5 px-8 rounded-lg flex items-center justify-center gap-2 transition-all w-full sm:w-auto shadow-md"
              >
                Try it free <FiArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="text-slate-800 text-[15px] font-bold flex items-center gap-2 hover:text-primary-brand transition-colors"
              >
                Sign in <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-[13px] text-slate-500 mb-16 font-medium">No credit required &nbsp;&nbsp;•&nbsp;&nbsp; Works for all Indian routes</p>

            {/* Features mini-grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl">
              {[
                { icon: FiMapPin, title: 'AI Route Intelligence', desc: 'Find the safest & fastest cold-chain routes' },
                { icon: FiThermometer, title: 'Temperature Risk Analysis', desc: 'Predict temperature deviations in advance' },
                { icon: FiClipboard, title: 'Compliance Checklist', desc: 'Stay audit-ready with automated reports' },
                { icon: FiActivity, title: 'Spoilage Forecast', desc: 'Reduce losses with AI driven predictions' },
              ].map((f, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="text-primary-brand">
                    <f.icon className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h4 className="text-[13px] font-bold text-slate-900 leading-snug">{f.title}</h4>
                  <p className="text-[12px] text-slate-500 leading-snug">{f.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

    
      {/* ── WHAT YOU GET ── */}
      <section className="py-24 px-4 sm:px-6" id="features">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[30px] md:text-[36px] font-black text-slate-900 tracking-tight">
              One route. Everything you need.
            </h2>
            <p className="text-[14px] text-slate-500 mt-3 max-w-lg mx-auto">
              Stop guessing. Every analysis gives you the facts before the truck leaves the warehouse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                icon: FiMapPin,
                title: 'Driving Route & Map',
                desc: 'Real distance, travel time, and a step-by-step route breakdown rendered on an interactive map — not just a straight line.',
                bg: 'bg-blue-50',
                iconColor: 'text-blue-600',
              },
              {
                icon: FiThermometer,
                title: 'Temperature Risk Analysis',
                desc: 'AI identifies heat corridor risks, monsoon humidity threats, and transit window exposure for your specific cargo type.',
                bg: 'bg-red-50',
                iconColor: 'text-red-600',
              },
              {
                icon: FiShield,
                title: 'Compliance Checklist',
                desc: 'GDP, WHO, and cargo-specific cold-chain requirements — generated per route so your team knows exactly what to verify.',
                bg: 'bg-emerald-50',
                iconColor: 'text-emerald-600',
              },
              {
                icon: FiTruck,
                title: 'Departure Time & Stops',
                desc: 'The AI recommends the best departure window to avoid peak heat, plus midpoint stops for reefer checks.',
                bg: 'bg-orange-50',
                iconColor: 'text-primary-brand',
              },
            ].map((f) => (
              <div key={f.title} className="flex gap-5 p-6 border border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-sm transition-all">
                <div className={`${f.bg} ${f.iconColor} p-3 rounded-xl h-fit flex-shrink-0`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-slate-900">{f.title}</h3>
                  <p className="text-[13px] text-slate-500 mt-1.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CARGO TYPES ── */}
      <section className="py-20 px-4 sm:px-6 bg-slate-50 border-t border-slate-200" id="solutions">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[11px] font-bold text-primary-brand uppercase tracking-widest">Cargo Types</span>
              <h2 className="text-[28px] md:text-[34px] font-black text-slate-900 mt-2 tracking-tight leading-tight">
                Tailored for every cold-chain product
              </h2>
              <p className="text-[14px] text-slate-500 mt-4 leading-relaxed">
                Each cargo type has different temperature tolerances, compliance rules, and spoilage windows. 
                Select your cargo and the AI adjusts the entire analysis accordingly.
              </p>
              <button
                onClick={() => navigate('/signup')}
                className="mt-8 bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all"
              >
                Analyse a route <FiArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { emoji: '💉', label: 'Vaccines', range: '2°C – 8°C', note: 'WHO & GDP compliant' },
                { emoji: '💊', label: 'Medicine', range: '2°C – 8°C', note: 'Pharmaceutical cold-chain' },
                { emoji: '🥛', label: 'Dairy Products', range: '1°C – 4°C', note: 'FSSAI standards' },
                { emoji: '🐟', label: 'Seafood', range: '-2°C – 2°C', note: 'High ambient risk' },
                { emoji: '🧊', label: 'Frozen Food', range: '-20°C – -15°C', note: 'Deep freeze logistics' },
                { emoji: '🍎', label: 'Fresh Fruits', range: '2°C – 10°C', note: 'Perishable organics' },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl px-5 py-3.5">
                  <span className="text-xl flex-shrink-0">{c.emoji}</span>
                  <div className="flex-1">
                    <span className="text-[13px] font-semibold text-slate-800">{c.label}</span>
                    <span className="text-[11px] text-slate-400 ml-2">{c.note}</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">{c.range}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SIMPLE STATS ── */}
      <section className="py-16 px-4 sm:px-6 border-t border-slate-200">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '30+', label: 'Indian cities mapped' },
            { value: '42%', label: 'Average spoilage reduction' },
            { value: '6', label: 'Cargo types supported' },
            { value: '< 3s', label: 'Time to full AI report' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-[36px] font-black text-primary-brand">{s.value}</div>
              <div className="text-[12px] text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-4 sm:px-6 bg-slate-50 border-t border-slate-200" id="how-it-works">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[30px] md:text-[36px] font-black text-slate-900 tracking-tight">How it works</h2>
            <p className="text-[14px] text-slate-500 mt-3">Three steps. Under 30 seconds.</p>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { n: '1', title: 'Enter your route', desc: 'Type any origin and destination — any two cities, towns, or addresses in India.' },
              { n: '2', title: 'Select your cargo', desc: 'Pick from vaccines, medicine, dairy, seafood, frozen food, or fresh fruits. Each has a tailored analysis.' },
              { n: '3', title: 'Get the full report', desc: 'Instantly receive route data, AI temperature risk analysis, compliance notes, and spoilage forecast.' },
            ].map((step) => (
              <div key={step.n} className="flex gap-5 items-start bg-white border border-slate-200 rounded-2xl p-6">
                <div className="w-9 h-9 rounded-full bg-slate-900 text-white text-[14px] font-black flex items-center justify-center flex-shrink-0">
                  {step.n}
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-slate-900">{step.title}</h3>
                  <p className="text-[13px] text-slate-500 mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ── FAQ ── */}
      <section className="py-24 px-4 sm:px-6" id="faq">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-[28px] font-black text-slate-900 mb-10 text-center">Questions</h2>
          <div className="flex flex-col divide-y divide-slate-200">
            {faqItems.map((item, i) => (
              <div key={i} className="py-5">
                <button
                  className="w-full text-left flex items-start justify-between gap-4"
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                >
                  <span className="text-[14px] font-semibold text-slate-800">{item.question}</span>
                  <FiChevronDown
                    className={`w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5 transition-transform duration-200 ${faqOpen === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {faqOpen === i && (
                  <p className="text-[13px] text-slate-500 leading-relaxed mt-3 pr-8">{item.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
