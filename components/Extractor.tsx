import React, { useState } from 'react';
import { ProductData } from '../types';
import { parseProductInfo, calculateSmartPricing } from '../services/geminiService';
import { Sparkles, AlertTriangle, CheckCircle2, ArrowRight, ShieldAlert, BadgeDollarSign, Ban, List, Image as ImageIcon } from 'lucide-react';

interface ExtractorProps {
  onProductExtracted: (product: ProductData) => void;
  onNext: () => void;
}

const Extractor: React.FC<ExtractorProps> = ({ onProductExtracted, onNext }) => {
  const [inputMode, setInputMode] = useState<'url' | 'text'>('text');
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ProductData | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Demo data for quick filling
  const fillDemoData = () => {
    setRawText(`
      سماعات رأس لاسلكية إلغاء الضوضاء P9
      السعر: 15.00$
      الوصف: سماعات ستيريو عالية الجودة، تدعم البلوتوث، مريحة للأذن. بطارية طويلة العمر.
      الماركة: Generic (ليست سوني أو أبل)
      اللون: أسود / فضي
      البطارية: 400mAh
      وقت التشغيل: 8 ساعات
      الاتصال: Bluetooth 5.0
    `);
  };

  const fillBadData = () => {
    setRawText(`
      NIKE Air Jordan High Copy
      Price: $45.00
      Description: Best quality sneakers, authentic look.
    `);
  };

  const handleExtract = async () => {
    if (!rawText.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      // 1. Extract & Analyze Risk
      const parsed = await parseProductInfo(rawText);
      
      // 2. Calculate Profits if Price is available
      let profitCalc;
      if (parsed.price) {
          profitCalc = calculateSmartPricing(parsed.price, parsed.riskAnalysis?.ebayMarketPriceEstimate);
      }

      const newProduct: ProductData = {
        id: Date.now().toString(),
        url: 'https://aliexpress.com/item/demo',
        title: parsed.title || 'منتج غير معنون',
        price: parsed.price || '0.00',
        originalPrice: parsed.originalPrice,
        rating: '4.8',
        images: ['https://picsum.photos/400/400', 'https://picsum.photos/400/401', 'https://picsum.photos/400/402', 'https://picsum.photos/400/403'], 
        description: parsed.description || '',
        specs: parsed.specs || {},
        category: parsed.category || 'عام',
        riskAnalysis: parsed.riskAnalysis,
        profitCalculation: profitCalc
      };

      setExtractedData(newProduct);
      setSelectedImage(newProduct.images[0]); // Set default image
      onProductExtracted(newProduct);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
      if (score <= 30) return 'bg-green-500';
      if (score <= 70) return 'bg-yellow-500';
      return 'bg-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="text-primary" />
            المحلل الذكي (Universal Extractor)
          </h2>
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setInputMode('text')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${inputMode === 'text' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}
            >
              نص المنتج
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الصق تفاصيل المنتج من أي موقع (علي إكسبريس، أمازون، إلخ)
            </label>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full h-40 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-gray-600 font-mono text-sm"
              placeholder="مثال: عنوان المنتج، السعر، المواصفات..."
            />
            <div className="flex gap-3 mt-2">
                <button onClick={fillDemoData} className="text-xs text-blue-500 hover:underline">
                تجربة منتج آمن
                </button>
                <button onClick={fillBadData} className="text-xs text-red-500 hover:underline">
                تجربة منتج مخالف (VeRO)
                </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2">
              <AlertTriangle size={20} />
              <p>{error}</p>
            </div>
          )}

          <button
            onClick={handleExtract}
            disabled={loading || !rawText}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
              loading || !rawText
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-red-600 shadow-lg shadow-red-500/30'
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                جاري الفحص الأمني (VeRO) وتحليل الربحية...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                فحص واستخراج
              </>
            )}
          </button>
        </div>
      </div>

      {extractedData && (
        <div className="animate-fade-in-up space-y-6">
          {/* Risk Analysis Card */}
          <div className={`rounded-2xl shadow-sm border p-6 ${extractedData.riskAnalysis?.isSafe ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
             <div className="flex items-start gap-4">
                 <div className={`p-3 rounded-full flex-shrink-0 ${extractedData.riskAnalysis?.isSafe ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                     {extractedData.riskAnalysis?.isSafe ? <CheckCircle2 size={32} /> : <ShieldAlert size={32} />}
                 </div>
                 <div className="flex-1 space-y-4">
                     <div>
                        <h3 className={`text-xl font-bold ${extractedData.riskAnalysis?.isSafe ? 'text-green-800' : 'text-red-800'}`}>
                            {extractedData.riskAnalysis?.isSafe ? 'تحليل الأمان: منتج آمن (Safe)' : 'تحليل الأمان: عالي المخاطر (High Risk)'}
                        </h3>
                        <p className="text-gray-600 mt-1">
                            {extractedData.riskAnalysis?.brandDetected 
                            ? `تم اكتشاف علامة تجارية: ${extractedData.riskAnalysis.brandDetected}` 
                            : 'لم يتم العثور على أي علامات تجارية محظورة في العنوان أو الوصف.'}
                        </p>
                     </div>

                     {/* Visual Risk Meter */}
                     <div className="bg-white/60 rounded-xl p-4 border border-gray-200/50">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-gray-700">درجة المخاطرة (Risk Score)</span>
                            <span className={`text-sm font-bold ${extractedData.riskAnalysis?.riskScore! > 50 ? 'text-red-600' : 'text-green-600'}`}>
                                {extractedData.riskAnalysis?.riskScore || 0}/100
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div 
                                className={`h-3 rounded-full transition-all duration-1000 ${getRiskColor(extractedData.riskAnalysis?.riskScore || 0)}`}
                                style={{ width: `${extractedData.riskAnalysis?.riskScore || 0}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-medium">
                            <span>0 (Safe)</span>
                            <span>50 (Warning)</span>
                            <span>100 (VeRO Ban)</span>
                        </div>
                     </div>
                     
                     {!extractedData.riskAnalysis?.isSafe && (
                         <div className="bg-red-100/80 p-4 rounded-lg text-sm text-red-900 border border-red-200">
                             <div className="font-bold flex items-center gap-2 mb-2">
                                 <Ban size={18} />
                                 سبب الرفض (Rejection Reason):
                             </div>
                             <p className="leading-relaxed bg-white/50 p-2 rounded border border-red-100">
                                {extractedData.riskAnalysis?.rejectionReason || 'سبب غير محدد، يرجى مراجعة تفاصيل العلامة التجارية.'}
                             </p>
                             <div className="mt-3 text-xs font-bold text-red-700">
                                 تم إيقاف التصدير تلقائياً لحماية حسابك على eBay.
                             </div>
                         </div>
                     )}
                 </div>
             </div>
          </div>

          {/* Profit Calculation Card - Only if Safe */}
          {extractedData.riskAnalysis?.isSafe && extractedData.profitCalculation && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <BadgeDollarSign className="text-blue-600" />
                      دراسة الجدوى والتسعير الذكي
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gray-50 p-4 rounded-xl">
                          <p className="text-xs text-gray-500 mb-1">سعر المصدر</p>
                          <p className="font-bold text-lg text-gray-800">${extractedData.profitCalculation.sourcePrice}</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-xl">
                          <p className="text-xs text-red-500 mb-1">عمولات eBay + شحن</p>
                          <p className="font-bold text-lg text-red-600">
                              -${(extractedData.profitCalculation.ebayFee + extractedData.profitCalculation.shippingCost).toFixed(2)}
                          </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                          <p className="text-xs text-green-600 mb-1">صافي الربح المتوقع</p>
                          <p className="font-bold text-xl text-green-700">+${extractedData.profitCalculation.netProfit}</p>
                          <span className="text-xs font-bold text-green-600 bg-green-200 px-2 py-0.5 rounded-full">
                              {extractedData.profitCalculation.marginPercent}
                          </span>
                      </div>
                      <div className="bg-blue-600 text-white p-4 rounded-xl shadow-lg shadow-blue-500/30">
                          <p className="text-xs text-blue-100 mb-1">سعر البيع المقترح</p>
                          <p className="font-bold text-2xl">${extractedData.profitCalculation.listingPrice}</p>
                      </div>
                  </div>
              </div>
          )}

          {/* Product Preview - Expanded */}
          {extractedData.riskAnalysis?.isSafe && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header Info */}
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-6">
                    {/* Image Gallery Section */}
                    <div className="w-full md:w-56 flex flex-col gap-3 flex-shrink-0">
                        <div className="aspect-square rounded-xl border border-gray-200 p-2 bg-white flex items-center justify-center overflow-hidden">
                             <img 
                                src={selectedImage || extractedData.images[0]} 
                                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" 
                                alt="Main Product" 
                             />
                        </div>
                        {extractedData.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {extractedData.images.slice(0, 4).map((img, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => setSelectedImage(img)}
                                        className={`aspect-square rounded-lg border overflow-hidden transition-all ${selectedImage === img ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" alt={`thumb-${idx}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                        {extractedData.images.length > 4 && (
                            <p className="text-xs text-center text-gray-400">+{extractedData.images.length - 4} صور أخرى</p>
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                             <div>
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full mb-2 inline-block">
                                    {extractedData.category}
                                </span>
                                <h4 className="text-xl font-bold text-gray-800 leading-snug">{extractedData.title}</h4>
                             </div>
                             <div className="text-left flex-shrink-0">
                                 <p className="text-xs text-gray-500">سعر المصدر</p>
                                 <p className="text-xl font-bold text-gray-900">${extractedData.price}</p>
                             </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mt-3 line-clamp-3 bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed">{extractedData.description}</p>
                        
                        <div className="mt-4 flex gap-2">
                             <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded flex items-center gap-1">
                                 <CheckCircle2 size={12} />
                                 صور مستخرجة: {extractedData.images.length}
                             </span>
                        </div>
                    </div>
                </div>

                {/* Specs Grid */}
                <div className="p-6 bg-gray-50/50">
                    <h5 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <List size={16} className="text-gray-500" />
                        المواصفات الفنية المستخرجة
                    </h5>
                    {Object.keys(extractedData.specs).length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {Object.entries(extractedData.specs).map(([key, value], idx) => (
                                <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center">
                                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">{key}</span>
                                    <span className="text-sm text-gray-800 font-bold truncate dir-ltr" title={value}>{value}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">لم يتم استخراج مواصفات تفصيلية.</p>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 flex justify-end border-t border-gray-100 bg-white">
                     <button
                        onClick={onNext}
                        className="bg-secondary text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
                     >
                        اعتماد وتوليد المحتوى
                        <ArrowRight size={20} className="rtl:rotate-180" />
                     </button>
                </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Extractor;
