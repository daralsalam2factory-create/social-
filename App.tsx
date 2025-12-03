import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Extractor from './components/Extractor';
import EbayPreview from './components/EbayPreview';
import BloggerPreview from './components/BloggerPreview';
import SocialMediaPreview from './components/SocialMediaPreview';
import Reports from './components/Reports';
import Settings from './components/Settings';
import ProductLibrary from './components/ProductLibrary';
import { AppState, ProductData, GeneratedContent, AppSettings, ActivityReport } from './types';
import { generateMarketingContent } from './services/geminiService';
import { sendEmailNotification } from './services/notificationService';
import { Menu } from 'lucide-react';

const DEFAULT_SETTINGS: AppSettings = {
  // Accounts
  ebayEmail: '',
  ebayPassword: '',
  isEbayConnected: false,
  
  bloggerEmail: '',
  bloggerPassword: '',
  isBloggerConnected: false,

  facebookAccount: '',
  facebookPassword: '',
  isFacebookConnected: false,

  instagramAccount: '',
  instagramPassword: '',
  isInstagramConnected: false,

  // Automation Defaults
  autoModeEnabled: false,
  minProfitMargin: 20,
  dailyLimit: 10,
  autoPublishEbay: false,
  autoPublishBlog: false,
  autoPostSocial: false,
  excludeBrands: '',
  
  // Notification Defaults
  enableEmailNotifications: false,
  sendGridApiKey: '',
  notificationEmail: '',
  notifyOnHighProfit: true,
  notifyOnVero: true,
  notifyOnExportSuccess: false
};

const App: React.FC = () => {
  const [activeState, setActiveState] = useState<AppState>(AppState.DASHBOARD);
  const [currentProduct, setCurrentProduct] = useState<ProductData | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Persisted State
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [reports, setReports] = useState<ActivityReport[]>([]);
  const [savedProducts, setSavedProducts] = useState<ProductData[]>([]);

  const [isAutoPilotRunning, setIsAutoPilotRunning] = useState(false);
  const autoPilotIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
        const storedSettings = localStorage.getItem('appSettings');
        if (storedSettings) {
             const parsed = JSON.parse(storedSettings);
             // Merge with defaults to ensure new fields exist
             setSettings({...DEFAULT_SETTINGS, ...parsed});
        }

        const storedReports = localStorage.getItem('appReports');
        if (storedReports) setReports(JSON.parse(storedReports));
        
        const storedProducts = localStorage.getItem('appProducts');
        if (storedProducts) setSavedProducts(JSON.parse(storedProducts));

    } catch (e) {
        console.error("Error loading persisted data", e);
    }
  }, []);

  // Save to LocalStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('appReports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('appProducts', JSON.stringify(savedProducts));
  }, [savedProducts]);


  const handleProductExtracted = async (product: ProductData) => {
    setCurrentProduct(product);
    // Automatically start generating content when product is extracted
    if (product.riskAnalysis?.isSafe) {
        setContentLoading(true);
        try {
          const content = await generateMarketingContent(product);
          setGeneratedContent(content);
        } catch (error) {
          console.error("Failed to generate content", error);
        } finally {
          setContentLoading(false);
        }
    } else {
        setGeneratedContent(null);
    }
  };

  const handleSaveToLibrary = (product: ProductData) => {
      // Check if exists
      const exists = savedProducts.find(p => p.id === product.id);
      if (exists) return; // Or update

      const productToSave: ProductData = {
          ...product,
          status: 'READY',
          createdAt: new Date().toLocaleString()
      };
      setSavedProducts(prev => [productToSave, ...prev]);
  };

  const handleDeleteProduct = (id: string) => {
      setSavedProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleEditProduct = (product: ProductData) => {
      setCurrentProduct(product);
      setActiveState(AppState.EBAY_PREVIEW);
      // Trigger regen if needed, for now just preview
      // Ideally we should save generated content with the product in the library to avoid re-generating
  };

  const handleToggleAutoPilot = () => {
    if (isAutoPilotRunning) {
        // Stop
        if (autoPilotIntervalRef.current) clearInterval(autoPilotIntervalRef.current);
        setIsAutoPilotRunning(false);
    } else {
        // Start Check
        if (!settings.isEbayConnected && !settings.isBloggerConnected) {
            alert('يرجى ربط حساب واحد على الأقل (eBay أو Blogger) في صفحة الإعدادات لتشغيل الطيار الآلي.');
            setActiveState(AppState.SETTINGS);
            return;
        }

        setIsAutoPilotRunning(true);
        setActiveState(AppState.REPORTS);
        
        // Start Simulation Loop
        const runSimulationStep = async () => {
            const actions = ['SCAN', 'EXPORT', 'PUBLISH', 'BLOCK'] as const;
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            const randomProductNum = Math.floor(Math.random() * 1000);
            const productName = `Auto Detected Item #${randomProductNum}`;
            
            let newReport: ActivityReport = {
                id: Date.now().toString(),
                date: new Date().toLocaleString(),
                action: 'SCAN',
                productName: productName,
                status: 'WARNING',
                details: 'جاري التحليل...'
            };

            if (randomAction === 'BLOCK') {
                newReport.action = 'BLOCK';
                newReport.status = 'FAILED';
                newReport.details = 'تم الحظر: علامة تجارية مسجلة (VeRO Protection).';
                await sendEmailNotification(settings, 'VERO', productName, newReport.details);

            } else if (randomAction === 'PUBLISH') {
                newReport.action = 'PUBLISH';
                newReport.status = 'SUCCESS';
                newReport.details = settings.autoPublishEbay 
                    ? 'تم النشر تلقائياً على eBay و Social Media.' 
                    : 'جاهز للنشر (يتطلب موافقة يدوية حسب الإعدادات).';
                await sendEmailNotification(settings, 'EXPORT', productName, newReport.details);

            } else {
                const profit = settings.minProfitMargin + Math.floor(Math.random() * 30);
                newReport.action = 'EXPORT';
                newReport.status = 'SUCCESS';
                newReport.details = `تم استخراج منتج مربح. هامش متوقع: ${profit}%`;

                // Add a dummy product to library to show effect
                const autoProduct: ProductData = {
                    id: Date.now().toString(),
                    title: productName,
                    url: 'http://auto',
                    price: '25.00',
                    images: ['https://picsum.photos/200'],
                    description: 'Auto generated',
                    specs: {},
                    category: 'Auto',
                    status: 'DRAFT',
                    createdAt: new Date().toLocaleString(),
                    profitCalculation: {
                        sourcePrice: 15,
                        shippingCost: 5,
                        ebayFee: 3,
                        paypalFee: 0,
                        marketingBudget: 1,
                        netProfit: 10,
                        listingPrice: 34,
                        marginPercent: '30%'
                    }
                };
                setSavedProducts(prev => [autoProduct, ...prev]);

                if (profit > 40) {
                     await sendEmailNotification(settings, 'HIGH_PROFIT', productName, `هامش ربح ممتاز: ${profit}%`);
                }
            }

            setReports(prev => [newReport, ...prev].slice(0, 50)); // Keep last 50
        };

        // Run immediately then interval
        runSimulationStep();
        autoPilotIntervalRef.current = setInterval(runSimulationStep, 8000); 
    }
  };

  useEffect(() => {
    return () => {
        if (autoPilotIntervalRef.current) clearInterval(autoPilotIntervalRef.current);
    };
  }, []);

  const renderContent = () => {
    switch (activeState) {
      case AppState.DASHBOARD:
        return (
            <Dashboard 
                onCreateNew={() => setActiveState(AppState.EXTRACTOR)} 
                isAutoPilotRunning={isAutoPilotRunning}
                onToggleAutoPilot={handleToggleAutoPilot}
            />
        );
      case AppState.EXTRACTOR:
        return (
          <Extractor 
            onProductExtracted={handleProductExtracted} 
            onNext={() => setActiveState(AppState.EBAY_PREVIEW)} 
          />
        );
      case AppState.LIBRARY:
        return (
            <ProductLibrary 
                products={savedProducts}
                onDelete={handleDeleteProduct}
                onEdit={handleEditProduct}
                onDeleteAll={() => setSavedProducts([])}
            />
        );
      case AppState.EBAY_PREVIEW:
        return currentProduct ? (
          <EbayPreview 
            product={currentProduct} 
            content={generatedContent} 
            loading={contentLoading} 
            onSaveToLibrary={handleSaveToLibrary}
          />
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-500 text-lg">يرجى استخراج منتج أولاً للبدء.</p>
            <button 
                onClick={() => setActiveState(AppState.EXTRACTOR)}
                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-red-600 transition-colors"
            >
                الذهاب للاستخراج
            </button>
          </div>
        );
      case AppState.BLOGGER_PREVIEW:
        return currentProduct ? (
          <BloggerPreview 
            product={currentProduct} 
            content={generatedContent} 
            loading={contentLoading} 
          />
        ) : (
           <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-500 text-lg">يرجى استخراج منتج أولاً للبدء.</p>
            <button 
                onClick={() => setActiveState(AppState.EXTRACTOR)}
                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-red-600 transition-colors"
            >
                الذهاب للاستخراج
            </button>
          </div>
        );
      case AppState.SOCIAL_MEDIA:
        return currentProduct ? (
          <SocialMediaPreview 
            product={currentProduct} 
            content={generatedContent} 
            loading={contentLoading} 
          />
        ) : (
           <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-500 text-lg">يرجى استخراج منتج أولاً للبدء.</p>
            <button 
                onClick={() => setActiveState(AppState.EXTRACTOR)}
                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-red-600 transition-colors"
            >
                الذهاب للاستخراج
            </button>
          </div>
        );
      case AppState.REPORTS:
        return (
            <div>
                 {isAutoPilotRunning && (
                    <div className="bg-indigo-600 text-white p-4 rounded-xl mb-6 shadow-lg animate-pulse">
                        <h3 className="font-bold flex items-center gap-2">
                            الطيار الآلي يعمل...
                            <span className="text-xs bg-white/20 px-2 py-1 rounded">Processing</span>
                        </h3>
                    </div>
                 )}
                 {/* Pass real reports to the component if modified, for now using dummy data inside Reports + the live log */}
                 {reports.length > 0 && (
                     <div className="bg-white rounded-xl border border-gray-200 mb-6 p-4">
                         <h3 className="font-bold text-gray-800 mb-3">Live Automation Log</h3>
                         <div className="space-y-2 max-h-60 overflow-y-auto">
                            {reports.map(r => (
                                <div key={r.id} className="text-sm flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-gray-500">{r.date}</span>
                                    <span className={`font-bold ${r.status === 'SUCCESS' ? 'text-green-600' : 'text-red-600'}`}>{r.action}</span>
                                    <span>{r.details}</span>
                                </div>
                            ))}
                         </div>
                     </div>
                 )}
                <Reports />
            </div>
        );
      case AppState.SETTINGS:
        return <Settings settings={settings} onSave={setSettings} />;
      default:
        return <Dashboard onCreateNew={() => setActiveState(AppState.EXTRACTOR)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900 font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 z-50">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-orange-500 rounded-lg flex items-center justify-center text-white font-bold">A</div>
            <span className="font-bold text-gray-800">Affiliate AI</span>
         </div>
         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600">
            <Menu size={24} />
         </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}>
              <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl z-50" onClick={e => e.stopPropagation()}>
                  <Sidebar activeState={activeState} setActiveState={(s) => { setActiveState(s); setMobileMenuOpen(false); }} />
              </div>
          </div>
      )}

      {/* Desktop Sidebar */}
      <Sidebar activeState={activeState} setActiveState={setActiveState} />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;