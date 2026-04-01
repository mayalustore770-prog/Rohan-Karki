/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Youtube, 
  Cloud, 
  Briefcase, 
  Gamepad2, 
  Activity, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight,
  Menu,
  X,
  ExternalLink,
  Sparkles,
  Search,
  Github,
  Download,
  Loader2,
  Heart,
  Copy,
  Check,
  Instagram
} from 'lucide-react';
import { GOOGLE_SERVICES } from './constants';
import { GoogleService } from './types';

const IconMap: Record<string, React.ElementType> = {
  Youtube,
  Cloud,
  Briefcase,
  Gamepad2,
  Activity
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState<GoogleService>(GOOGLE_SERVICES[0]);
  
  // Header Search State
  const [headerSearch, setHeaderSearch] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredServices = GOOGLE_SERVICES.filter(s => 
    s.name.toLowerCase().includes(headerSearch.toLowerCase())
  );

  // APK Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Donation State
  const [copied, setCopied] = useState(false);
  const upiId = 'rohan.karki@ptyes';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApkSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setSearchResults([]);

    try {
      // Search for repositories with the query and 'android' topic or keyword
      const repoResponse = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}+topic:android&sort=stars&order=desc&per_page=6`);
      
      if (!repoResponse.ok) throw new Error('GitHub API request failed');
      
      const repoData = await repoResponse.json();
      
      if (repoData.items.length === 0) {
        setSearchError('No matching open-source apps found.');
        return;
      }

      // For each repository, fetch its latest release to find APK files
      const resultsWithApks = await Promise.all(repoData.items.map(async (repo: any) => {
        try {
          const releaseResponse = await fetch(`https://api.github.com/repos/${repo.full_name}/releases/latest`);
          if (!releaseResponse.ok) return { ...repo, apkUrl: null };
          
          const releaseData = await releaseResponse.json();
          const apkAsset = releaseData.assets.find((asset: any) => asset.name.endsWith('.apk'));
          
          return {
            ...repo,
            apkUrl: apkAsset ? apkAsset.browser_download_url : null,
            releaseName: releaseData.name || releaseData.tag_name
          };
        } catch (err) {
          return { ...repo, apkUrl: null };
        }
      }));

      setSearchResults(resultsWithApks);
    } catch (err) {
      setSearchError('Failed to search GitHub. Please try again later.');
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#202124] font-sans selection:bg-[#4285F4] selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6 flex-1">
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-[#4285F4] via-[#34A853] to-[#FBBC05] rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Sparkles className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-semibold tracking-tight hidden sm:block">Rohan Hub</span>
              </div>

              {/* Header Search Bar */}
              <div className="relative max-w-xs w-full hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="Search trial limits..."
                    value={headerSearch}
                    onChange={(e) => {
                      setHeaderSearch(e.target.value);
                      setShowResults(true);
                    }}
                    onFocus={() => setShowResults(true)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 rounded-xl text-sm outline-none transition-all"
                  />
                </div>
                
                <AnimatePresence>
                  {showResults && headerSearch && (
                    <>
                      <div 
                        className="fixed inset-0 z-[-1]" 
                        onClick={() => setShowResults(false)} 
                      />
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                      >
                        {filteredServices.length > 0 ? (
                          filteredServices.map(service => (
                            <button
                              key={service.id}
                              onClick={() => {
                                const el = document.getElementById(service.id);
                                el?.scrollIntoView({ behavior: 'smooth' });
                                setShowResults(false);
                                setHeaderSearch('');
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: service.color }}>
                                  {React.createElement(IconMap[service.icon], { className: "w-4 h-4" })}
                                </div>
                                <span className="font-medium text-sm">{service.name}</span>
                              </div>
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase">
                                {service.trialPeriod}
                              </span>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center">
                            <p className="text-xs text-gray-400">No premium service found with that name.</p>
                          </div>
                        )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              {GOOGLE_SERVICES.map(service => (
                <button 
                  key={service.id}
                  onClick={() => {
                    const el = document.getElementById(service.id);
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-sm font-medium text-gray-600 hover:text-[#4285F4] transition-colors"
                >
                  {service.name}
                </button>
              ))}
              <button className="bg-[#202124] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-black transition-all hover:shadow-xl active:scale-95">
                Get Started
              </button>
            </div>

            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-20 px-4 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {GOOGLE_SERVICES.map(service => (
                <button 
                  key={service.id}
                  onClick={() => {
                    setIsMenuOpen(false);
                    const el = document.getElementById(service.id);
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-2xl font-semibold text-left"
                >
                  {service.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <header className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase text-[#4285F4] bg-blue-50 rounded-full">
              Exclusive Access
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
              Experience Google <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#FBBC05]">At Its Best.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Unlock the full potential of your favorite tools. From ad-free entertainment to professional workspace solutions, all with free trial periods.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto bg-[#4285F4] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#1a73e8] transition-all hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 group">
                Explore All Services
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-all">
                Learn How Trials Work
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Interactive Feature Showcase */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-8">Choose your premium experience</h2>
              <div className="space-y-4">
                {GOOGLE_SERVICES.map((service) => {
                  const Icon = IconMap[service.icon];
                  const isActive = activeService.id === service.id;
                  return (
                    <button
                      key={service.id}
                      onClick={() => setActiveService(service)}
                      className={`w-full text-left p-6 rounded-3xl transition-all border-2 ${
                        isActive 
                          ? 'border-[#4285F4] bg-blue-50/50 shadow-lg' 
                          : 'border-transparent hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${isActive ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>
                          <Icon className={`w-6 h-6 ${isActive ? 'text-[#4285F4]' : 'text-gray-500'}`} />
                        </div>
                        <div>
                          <h3 className={`font-bold ${isActive ? 'text-[#4285F4]' : 'text-gray-900'}`}>{service.name}</h3>
                          <p className="text-sm text-gray-500">{service.trialPeriod}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService.id}
                  initial={{ opacity: 0, scale: 0.95, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="bg-[#F8F9FA] rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: activeService.color }}>
                        {React.createElement(IconMap[activeService.icon], { className: "w-6 h-6" })}
                      </div>
                      <h3 className="text-2xl font-bold">{activeService.name}</h3>
                    </div>
                    <span className="px-4 py-1 bg-white rounded-full text-xs font-bold border border-gray-200">
                      {activeService.trialPeriod}
                    </span>
                  </div>
                  
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    {activeService.description}
                  </p>

                  <div className="space-y-4 mb-10">
                    {activeService.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#34A853]" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <a 
                    href={activeService.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#202124] text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all group"
                  >
                    Start Your Free Trial
                    <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                </motion.div>
              </AnimatePresence>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#FBBC05]/10 rounded-full blur-2xl -z-10" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#4285F4]/10 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Grid */}
      <section className="py-24 px-4 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need, in one place</h2>
            <p className="text-gray-600">Discover how each service elevates your digital life.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {GOOGLE_SERVICES.map((service, index) => {
              const Icon = IconMap[service.icon];
              return (
                <motion.div
                  id={service.id}
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-[2rem] border border-gray-100 hover:shadow-xl transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform" style={{ backgroundColor: service.color }}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.name}</h3>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{service.trialPeriod}</span>
                    <a 
                      href={service.ctaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4285F4] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Try Free <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* APK Search Section */}
      <section id="apk-search" className="py-24 px-4 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-sm font-bold mb-6"
            >
              <Github className="w-4 h-4" />
              Open Source Explorer
            </motion.div>
            <h2 className="text-4xl font-bold mb-4">Find Open Source Apps</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Search for your favorite open-source Android applications directly from GitHub and get the latest APK releases.
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-16">
            <form onSubmit={handleApkSearch} className="relative group">
              <input
                type="text"
                placeholder="Search apps (e.g., Echo Nightly, NewPipe, VLC)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-purple-500 rounded-3xl outline-none transition-all text-lg shadow-sm group-hover:shadow-md"
              />
              <button 
                type="submit"
                disabled={isSearching}
                className="absolute right-3 top-3 bottom-3 px-6 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                Search
              </button>
            </form>
          </div>

          {searchError && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2 text-red-500 mb-8"
            >
              <AlertCircle className="w-5 h-5" />
              <span>{searchError}</span>
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {searchResults.map((app, idx) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-[#F8F9FA] p-8 rounded-[2.5rem] border border-gray-100 hover:shadow-xl transition-all flex flex-col h-full"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <Github className="w-6 h-6 text-gray-700" />
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                      <Sparkles className="w-3 h-3 text-yellow-500" />
                      {app.stargazers_count.toLocaleString()} stars
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 line-clamp-1">{app.name}</h3>
                  <p className="text-gray-500 text-sm mb-6 flex-grow line-clamp-3">
                    {app.description || 'No description provided.'}
                  </p>

                  <div className="space-y-4">
                    {app.apkUrl ? (
                      <a 
                        href={app.apkUrl}
                        className="w-full inline-flex items-center justify-center gap-2 bg-purple-600 text-white py-4 rounded-2xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
                      >
                        <Download className="w-5 h-5" />
                        Download APK
                      </a>
                    ) : (
                      <div className="w-full py-4 text-center text-gray-400 text-sm font-medium bg-gray-100 rounded-2xl border border-dashed border-gray-200">
                        No APK found in latest release
                      </div>
                    )}
                    <a 
                      href={app.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 text-gray-600 py-2 text-sm font-bold hover:text-purple-600 transition-colors"
                    >
                      View on GitHub <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* FAQ / Trust Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Frequently Asked Questions</h2>
          <div className="space-y-8 text-left">
            <div className="p-6 bg-gray-50 rounded-2xl">
              <h4 className="font-bold mb-2">Are these services really free?</h4>
              <p className="text-gray-600 text-sm">Yes, all services listed offer a free trial period for new users. After the trial ends, a monthly subscription fee applies unless cancelled.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl">
              <h4 className="font-bold mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-600 text-sm">Absolutely. You can cancel your subscription at any time through your Google Account settings. You will continue to have access until the end of the trial period.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl">
              <h4 className="font-bold mb-2">How do I start a trial?</h4>
              <p className="text-gray-600 text-sm">Simply click on the "Start Free Trial" button for the service you're interested in. You'll be redirected to the official Google page to complete the setup.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-white to-[#F8F9FA]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-gray-100 text-center relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -z-10 -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 -ml-32 -mb-32" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-3xl mb-8">
                <Heart className="w-10 h-10 text-red-500 fill-red-500" />
              </div>
              <h2 className="text-4xl font-bold mb-6">Support Rohan Hub</h2>
              <p className="text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
                Love the website? Your donations provide the motivation to keep adding more valuable services and maintaining the open-source explorer. Every bit helps!
              </p>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-3xl shadow-xl border border-gray-100 mb-4">
                    {/* Generating a QR code using a public API for the UPI ID */}
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=Rohan%20Karki`)}`} 
                      alt="Donation QR Code"
                      className="w-48 h-48"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Scan to Donate</p>
                </div>

                <div className="text-left space-y-6">
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">UPI ID</p>
                    <div className="flex items-center justify-between">
                      <code className="text-lg font-mono font-bold text-gray-800">{upiId}</code>
                      <button 
                        onClick={copyToClipboard}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Copy UPI ID"
                      >
                        {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-500" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span>Direct support to the developer</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span>No middleman fees</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span>Help add more premium trials</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#202124] text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Sparkles className="text-[#202124] w-5 h-5" />
                </div>
                <span className="text-xl font-bold">Rohan Hub</span>
              </div>
              <p className="text-gray-400 max-w-sm mb-8">
                Your destination for discovering and managing Google's most powerful premium tools and services.
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://www.instagram.com/rohan_karki19?igsh=b2JxbXllNmFlN2Jm" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-colors"
                  title="Follow on Instagram"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                  title="Follow on GitHub"
                >
                  <Github className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6">Services</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                {GOOGLE_SERVICES.map(s => (
                  <li key={s.id} className="hover:text-white transition-colors cursor-pointer">{s.name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Resources</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="hover:text-white transition-colors cursor-pointer">Help Center</li>
                <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
                <li className="hover:text-white transition-colors cursor-pointer">Google Account</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2026 Rohan Hub. All rights reserved.</p>
            <div className="flex gap-8">
              <span>English (US)</span>
              <span className="hover:text-white cursor-pointer">Feedback</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
