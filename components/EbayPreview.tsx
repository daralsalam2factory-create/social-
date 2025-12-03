import React, { useState } from 'react';
import { ProductData, GeneratedContent } from '../types';
import { Copy, Download, ExternalLink, Palette, Type, Save } from 'lucide-react';

interface EbayPreviewProps {
  product: ProductData;
  content: GeneratedContent | null;
  loading: boolean;
  onSaveToLibrary: (product: ProductData) => void;
}

type TemplateType = 'modern' | 'classic' | 'minimal';

const EbayPreview: React.FC<EbayPreviewProps> = ({ product, content, loading, onSaveToLibrary }) => {
  const [template, setTemplate] = useState<TemplateType>('modern');
  const [primaryColor, setPrimaryColor] = useState('#0064D2');
  const [fontFamily, setFontFamily] = useState("'Segoe UI', sans-serif");
  const [isSaved, setIsSaved] = useState(false);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">جاري إعداد قائمة eBay الاحترافية...</p>
      </div>
    );
  }

  if (!content) return <div className="text-center p-10 text-gray-500">لم يتم توليد المحتوى بعد.</div>;

  // Template Generation Logic
  const generateTemplateHTML = () => {
    const { ebayProductDescription, ebayFeatures, ebayWhyBuy } = content;
    
    // Dynamic Styles based on state
    const styles = {
      modern: `
        font-family: ${fontFamily}; 
        color: #333; 
        line-height: 1.6;
        background: #f9f9f9;
        padding: 20px;
        border-radius: 8px;
      `,
      classic: `
        font-family: ${fontFamily}; 
        color: #000; 
        border: 4px solid ${primaryColor};
        padding: 20px;
        background: #fff;
      `,
      minimal: `
        font-family: ${fontFamily}; 
        color: #444; 
        padding: 20px;
        border-top: 6px solid ${primaryColor};
        background: #fff;
      `
    };

    const headerStyle = template === 'modern' 
      ? `background: ${primaryColor}; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;` 
      : `border-bottom: 2px solid #ccc; padding-bottom: 15px; margin-bottom: 20px; text-align: center; color: ${primaryColor};`;

    const h2Style = `color: ${primaryColor}; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 0;`;

    return `
      <div style="${styles[template]}">
        <div style="${headerStyle}">
          <h1 style="margin:0; font-size: 24px; line-height: 1.3;">${content.ebayTitle}</h1>
        </div>
        
        <div style="background: white; padding: 25px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <h2 style="${h2Style}">Product Overview</h2>
          <p>${ebayProductDescription}</p>

          <div style="display: flex; flex-wrap: wrap; margin-top: 30px; gap: 20px;">
            <div style="flex: 1; min-width: 250px;">
              <h3 style="color: #333; font-weight: bold; margin-bottom: 15px;">Key Features</h3>
              <ul style="list-style-type: none; padding: 0;">
                ${ebayFeatures.map(f => `<li style="padding: 8px 0; border-bottom: 1px dashed #eee; display: flex; align-items: start;"><span style="color:${primaryColor}; margin-right: 8px;">✓</span> ${f}</li>`).join('')}
              </ul>
            </div>
            
            <div style="flex: 1; min-width: 250px;">
              <h3 style="color: #333; font-weight: bold; margin-bottom: 15px;">Why Buy From Us?</h3>
               <ul style="list-style-type: none; padding: 0;">
                ${ebayWhyBuy.map(w => `<li style="padding: 8px 0; border-bottom: 1px dashed #eee; display: flex; align-items: start;"><span style="color:${primaryColor}; margin-right: 8px;">★</span> ${w}</li>`).join('')}
              </ul>
            </div>
          </div>
          
          <div style="margin-top: 40px; text-align: center; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #888;">
            <p>Thank you for shopping with us! Fast Shipping • Quality Guaranteed</p>
          </div>
        </div>
      </div>
    `;
  };

  const finalHTML = generateTemplateHTML();

  const handleManualSave = () => {
    onSaveToLibrary({...product, status: 'READY'});
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const downloadSingleCSV = () => {
    const headers = "Action,Title,Description,Price,Qty,PicURL";
    const row = `Add,"${content.ebayTitle}","${content.ebayProductDescription.substring(0,100)}...",${content.ebayPrice},5,"${product.images[0]}"`;
    const blob = new Blob([`${headers}\n${row}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `item_${product.id}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-wrap gap-3 justify-between items-center shadow-sm">
        <div className="flex items-center gap-4 flex-wrap">
          <h3 className="font-bold text-gray-700">معاينة eBay</h3>
          <div className="h-6 w-px bg-gray-300 hidden md:block"></div>
          
          {/* Template Selector */}
          <div className="flex items-center gap-2">
            <Palette size={16} className="text-gray-500" />
            <select 
              value={template}
              onChange={(e) => setTemplate(e.target.value as TemplateType)}
              className="text-sm bg-gray-50 border border-gray-200 rounded-md py-1 px-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="modern">قالب عصري (Modern)</option>
              <option value="classic">قالب كلاسيكي (Classic)</option>
              <option value="minimal">قالب بسيط (Minimal)</option>
            </select>
          </div>

          {/* Color Picker */}
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded-full border border-gray-200 overflow-hidden cursor-pointer relative">
                <input 
                    type="color" 
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer p-0 border-0"
                />
             </div>
             <span className="text-xs text-gray-500 hidden sm:inline">Theme Color</span>
          </div>

          {/* Font Selector */}
          <div className="flex items-center gap-2">
            <Type size={16} className="text-gray-500" />
            <select 
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="text-sm bg-gray-50 border border-gray-200 rounded-md py-1 px-2 focus:ring-2 focus:ring-blue-500 outline-none w-32"
            >
              <option value="'Segoe UI', sans-serif">Segoe UI</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="'Times New Roman', serif">Times New Roman</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="'Courier New', monospace">Courier</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handleManualSave}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isSaved ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Save size={16} />
            {isSaved ? 'تم الحفظ' : 'حفظ في المكتبة'}
          </button>
          
          <button 
            onClick={() => {navigator.clipboard.writeText(finalHTML); alert('HTML Copied!')}}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            <Copy size={16} />
            نسخ HTML
          </button>
          
          <button 
            onClick={downloadSingleCSV}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            <Download size={16} />
            تحميل CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors shadow-sm">
            <ExternalLink size={16} />
            نشر (تجريبي)
          </button>
        </div>
      </div>

      {/* eBay Mockup */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
        {/* eBay Header Mock */}
        <div className="bg-gray-100 border-b border-gray-300 p-3 flex gap-4 text-xs text-gray-600">
           <span>Home</span> <span>&gt;</span> <span>{product.category}</span>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8" dir="ltr">
           {/* Image Gallery Mock */}
           <div className="md:col-span-5 space-y-4">
              <div className="aspect-square border border-gray-200 rounded-lg overflow-hidden bg-white">
                <img src={product.images[0]} alt="Main" className="w-full h-full object-contain" />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                 {product.images.map((img, idx) => (
                    <div key={idx} className="w-16 h-16 border border-gray-200 rounded hover:border-blue-500 cursor-pointer flex-shrink-0">
                       <img src={img} className="w-full h-full object-contain" />
                    </div>
                 ))}
              </div>
           </div>

           {/* Product Info Mock */}
           <div className="md:col-span-7 space-y-4 text-left font-sans">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                {content.ebayTitle}
              </h1>
              
              <div className="flex items-center gap-2 text-sm">
                 <div className="flex text-yellow-500">★★★★★</div>
                 <span className="text-gray-500">(12 reviews)</span>
              </div>

              <div className="border-t border-b border-gray-200 py-4 space-y-2">
                 <div className="flex items-center gap-4">
                    <span className="text-gray-600 w-24">Price:</span>
                    <span className="text-2xl font-bold text-gray-900">US {content.ebayPrice}</span>
                 </div>
                 <div className="flex items-center gap-4">
                    <span className="text-gray-600 w-24">Condition:</span>
                    <span className="font-bold text-gray-800">New</span>
                 </div>
                 <div className="flex items-center gap-4">
                    <span className="text-gray-600 w-24">Shipping:</span>
                    <span className="text-gray-800">Free International Shipping</span>
                 </div>
              </div>

              <div className="flex gap-3 pt-4">
                 <button className="flex-1 bg-blue-600 text-white py-3 rounded-full font-bold hover:bg-blue-700">Buy It Now</button>
                 <button className="flex-1 bg-blue-100 text-blue-700 py-3 rounded-full font-bold hover:bg-blue-200">Add to cart</button>
              </div>
           </div>
        </div>

        {/* Description Container */}
        <div className="border-t border-gray-300 mt-8">
           <div className="bg-gray-100 p-3 border-b border-gray-300 font-bold text-gray-700 text-left px-6" dir="ltr">Description</div>
           <div className="p-8 prose max-w-none text-right" dir="rtl">
              <div dangerouslySetInnerHTML={{ __html: finalHTML }} />
           </div>
        </div>
      </div>
    </div>
  );
};

export default EbayPreview;