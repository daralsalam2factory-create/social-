import React, { useState } from 'react';
import { ProductData, GeneratedContent } from '../types';
import { Copy, Facebook, Instagram, Twitter, Video, Hash } from 'lucide-react';

interface SocialMediaPreviewProps {
  product: ProductData;
  content: GeneratedContent | null;
  loading: boolean;
}

type Platform = 'facebook' | 'instagram' | 'twitter' | 'tiktok';

const SocialMediaPreview: React.FC<SocialMediaPreviewProps> = ({ product, content, loading }) => {
  const [activePlatform, setActivePlatform] = useState<Platform>('facebook');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">جاري إعداد الحملات الإعلانية الذكية...</p>
      </div>
    );
  }

  if (!content) return <div className="text-center p-10 text-gray-500">لم يتم توليد المحتوى بعد.</div>;

  const platforms = [
    { id: 'facebook', label: 'فيسبوك', icon: Facebook, color: 'bg-blue-600' },
    { id: 'instagram', label: 'إنستغرام', icon: Instagram, color: 'bg-pink-600' },
    { id: 'twitter', label: 'تويتر (X)', icon: Twitter, color: 'bg-sky-500' },
    { id: 'tiktok', label: 'تيك توك', icon: Video, color: 'bg-black' },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('تم نسخ النص بنجاح!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Tabs */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
            <Hash className="text-indigo-600" />
            حملات السوشيال ميديا
        </h3>
        <div className="flex flex-wrap gap-2">
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePlatform(p.id as Platform)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-bold ${
                activePlatform === p.id
                  ? `${p.color} text-white shadow-lg transform scale-105`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <p.icon size={18} />
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preview Card */}
        <div className="lg:col-span-2">
            {activePlatform === 'facebook' && (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-4 flex items-center gap-3 border-b border-gray-100">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">A</div>
                        <div>
                            <p className="font-bold text-gray-900 text-sm">Affiliate Store</p>
                            <p className="text-xs text-gray-500">ممول · 🌍</p>
                        </div>
                    </div>
                    <div className="p-4 text-gray-800 text-sm whitespace-pre-line" dir="rtl">
                        {content.facebookPost}
                    </div>
                    <div className="bg-gray-100 aspect-video flex items-center justify-center overflow-hidden">
                        <img src={product.images[0]} alt="Post" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-gray-50 p-3 flex justify-between items-center text-gray-500 text-sm border-t border-gray-200">
                        <span>أعجبني</span>
                        <span>تعليق</span>
                        <span>مشاركة</span>
                    </div>
                </div>
            )}

            {activePlatform === 'instagram' && (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm max-w-md mx-auto">
                    <div className="p-3 flex items-center gap-3">
                         <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 to-pink-600 rounded-full p-0.5">
                             <div className="w-full h-full bg-white rounded-full p-0.5">
                                 <div className="w-full h-full bg-gray-200 rounded-full"></div>
                             </div>
                         </div>
                         <span className="font-bold text-sm">affiliate_pro</span>
                    </div>
                    <div className="aspect-square bg-gray-100">
                         <img src={product.images[0]} alt="Post" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 space-y-2">
                        <div className="flex gap-4">
                            <span className="font-bold text-xl">♡</span>
                            <span className="font-bold text-xl">💬</span>
                            <span className="font-bold text-xl">➢</span>
                        </div>
                        <p className="text-sm font-bold">1,240 likes</p>
                        <p className="text-sm text-gray-800 whitespace-pre-line" dir="rtl">
                            <span className="font-bold ml-2">affiliate_pro</span>
                            {content.instagramCaption}
                        </p>
                    </div>
                </div>
            )}

            {activePlatform === 'twitter' && (
                <div className="space-y-4">
                    {content.twitterThread.map((tweet, idx) => (
                        <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex gap-3">
                            <div className="w-10 h-10 bg-sky-500 rounded-full flex-shrink-0"></div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-900">Affiliate Master</span>
                                    <span className="text-gray-500 text-sm">@affiliate_ai · 1h</span>
                                </div>
                                <p className="text-gray-800 whitespace-pre-line text-[15px] leading-normal" dir="rtl">{tweet}</p>
                                {idx === 0 && (
                                    <div className="mt-2 rounded-xl overflow-hidden border border-gray-100 h-48 w-full">
                                         <img src={product.images[0]} alt="Tweet" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex gap-8 text-gray-500 text-sm pt-2">
                                    <span>💬 12</span>
                                    <span>↻ 5</span>
                                    <span>♡ 45</span>
                                    <span>📊 1.2k</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activePlatform === 'tiktok' && (
                <div className="bg-black text-white rounded-2xl overflow-hidden shadow-xl max-w-xs mx-auto aspect-[9/16] relative">
                    <img src={product.images[0]} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90"></div>
                    
                    <div className="absolute right-2 bottom-20 flex flex-col gap-4 items-center">
                        <div className="w-10 h-10 bg-white rounded-full"></div>
                        <div className="flex flex-col items-center"><span className="text-xl">♥</span><span className="text-xs">12.5k</span></div>
                        <div className="flex flex-col items-center"><span className="text-xl">💬</span><span className="text-xs">450</span></div>
                        <div className="flex flex-col items-center"><span className="text-xl">↪</span><span className="text-xs">200</span></div>
                    </div>

                    <div className="absolute bottom-4 right-4 left-4 text-right" dir="rtl">
                        <p className="font-bold mb-2">@affiliate_master</p>
                        <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm text-sm border border-white/10">
                            <p className="font-bold text-yellow-300 mb-1">🎥 سكربت الفيديو:</p>
                            <p className="text-xs leading-relaxed whitespace-pre-line">{content.tiktokScript}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Action Sidebar */}
        <div className="space-y-4">
             <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-bold text-gray-700 mb-4">إجراءات سريعة</h4>
                <div className="space-y-3">
                    <button 
                        onClick={() => {
                            let text = "";
                            if(activePlatform === 'facebook') text = content.facebookPost;
                            if(activePlatform === 'instagram') text = content.instagramCaption;
                            if(activePlatform === 'twitter') text = content.twitterThread.join('\n\n');
                            if(activePlatform === 'tiktok') text = content.tiktokScript;
                            copyToClipboard(text);
                        }}
                        className="w-full py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-black transition-colors flex items-center justify-center gap-2"
                    >
                        <Copy size={18} />
                        نسخ النص
                    </button>
                    <button className="w-full py-3 bg-indigo-50 text-indigo-700 rounded-lg font-bold hover:bg-indigo-100 transition-colors">
                        تحميل الصورة
                    </button>
                </div>
             </div>

             <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-100">
                <h4 className="font-bold text-yellow-800 mb-2 text-sm">💡 نصيحة تسويقية</h4>
                <p className="text-xs text-yellow-700 leading-relaxed">
                    {activePlatform === 'facebook' && "استخدم الأسئلة في بداية المنشور لزيادة التفاعل (Comments)."}
                    {activePlatform === 'instagram' && "الريلز (Reels) تحقق وصولاً أعلى بـ 3 أضعاف من الصور العادية."}
                    {activePlatform === 'twitter' && "استخدم الهاشتاجات الرائجة (Trending) لزيادة الظهور في النتائج."}
                    {activePlatform === 'tiktok' && "أول 3 ثوانٍ هي الأهم. ابدأ بخطاف (Hook) بصري قوي."}
                </p>
             </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaPreview;
