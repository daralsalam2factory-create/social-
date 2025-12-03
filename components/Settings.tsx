import React, { useState } from 'react';
import { AppSettings } from '../types';
import { Save, User, Settings as SettingsIcon, Zap, Shield, Mail, Lock, CheckCircle, AlertCircle, Loader2, Link as LinkIcon, Unlink } from 'lucide-react';

interface SettingsProps {
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
  };

  const handleConnect = async (platform: 'ebay' | 'blogger' | 'facebook' | 'instagram') => {
    // Check if fields are filled
    const emailKey = platform === 'ebay' ? 'ebayEmail' : platform === 'blogger' ? 'bloggerEmail' : platform === 'facebook' ? 'facebookAccount' : 'instagramAccount';
    const passKey = platform === 'ebay' ? 'ebayPassword' : platform === 'blogger' ? 'bloggerPassword' : platform === 'facebook' ? 'facebookPassword' : 'instagramPassword';
    
    // @ts-ignore
    if (!formData[emailKey] || !formData[passKey]) {
        alert('يرجى إدخال اسم المستخدم وكلمة المرور أولاً.');
        return;
    }

    setConnecting(platform);
    
    // Simulate API Connection Delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const statusKey = platform === 'ebay' ? 'isEbayConnected' : platform === 'blogger' ? 'isBloggerConnected' : platform === 'facebook' ? 'isFacebookConnected' : 'isInstagramConnected';
    
    setFormData(prev => ({
        ...prev,
        [statusKey]: true
    }));
    setConnecting(null);
  };

  const handleDisconnect = (platform: 'ebay' | 'blogger' | 'facebook' | 'instagram') => {
      const statusKey = platform === 'ebay' ? 'isEbayConnected' : platform === 'blogger' ? 'isBloggerConnected' : platform === 'facebook' ? 'isFacebookConnected' : 'isInstagramConnected';
      setFormData(prev => ({
        ...prev,
        [statusKey]: false
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    alert('تم حفظ الإعدادات بنجاح وتحديث حالة الاتصال.');
  };

  // Helper for rendering account cards
  const renderAccountCard = (
      platform: 'ebay' | 'blogger' | 'facebook' | 'instagram', 
      title: string, 
      icon: React.ReactNode, 
      colorClass: string,
      emailField: keyof AppSettings,
      passField: keyof AppSettings,
      statusField: keyof AppSettings
    ) => {
      // @ts-ignore
      const isConnected = formData[statusField];
      const isConnecting = connecting === platform;

      return (
        <div className={`p-5 rounded-xl border transition-all duration-300 ${isConnected ? 'bg-green-50 border-green-200 shadow-sm' : 'bg-white border-gray-200 hover:shadow-md'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isConnected ? 'bg-green-100 text-green-600' : colorClass.replace('text-', 'bg-').replace('600', '100') + ' ' + colorClass}`}>
                        {icon}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800">{title}</h4>
                        <p className="text-xs text-gray-500">{isConnected ? 'متصل بنجاح' : 'غير متصل'}</p>
                    </div>
                </div>
                {isConnected && <CheckCircle className="text-green-500" size={20} />}
            </div>

            <div className="space-y-3">
                <div className="relative">
                    <User size={16} className="absolute top-3 left-3 text-gray-400" />
                    <input
                        type="text"
                        name={emailField}
                        // @ts-ignore
                        value={formData[emailField]}
                        onChange={handleChange}
                        disabled={isConnected}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm outline-none transition-all ${isConnected ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-white border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400'}`}
                        placeholder="اسم المستخدم / البريد"
                    />
                </div>
                <div className="relative">
                    <Lock size={16} className="absolute top-3 left-3 text-gray-400" />
                    <input
                        type="password"
                        name={passField}
                        // @ts-ignore
                        value={formData[passField] || ''}
                        onChange={handleChange}
                        disabled={isConnected}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm outline-none transition-all ${isConnected ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-white border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400'}`}
                        placeholder="••••••••••••"
                    />
                </div>

                {isConnected ? (
                     <button
                        type="button"
                        onClick={() => handleDisconnect(platform)}
                        className="w-full py-2 flex items-center justify-center gap-2 text-red-600 bg-white border border-red-100 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                     >
                        <Unlink size={16} />
                        إلغاء الربط
                     </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => handleConnect(platform)}
                        disabled={isConnecting}
                        className={`w-full py-2 flex items-center justify-center gap-2 text-white rounded-lg text-sm font-medium transition-colors ${isConnecting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-black'}`}
                    >
                        {isConnecting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                جاري الاتصال...
                            </>
                        ) : (
                            <>
                                <LinkIcon size={16} />
                                ربط الحساب
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
      );
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <SettingsIcon className="text-gray-700" size={28} />
        <div>
            <h2 className="text-2xl font-bold text-gray-800">الإعدادات والربط</h2>
            <p className="text-sm text-gray-500">قم بربط حساباتك وتفعيل الأتمتة ليعمل البرنامج نيابة عنك.</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Account Connections Grid */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <User className="text-blue-600" size={20} />
            ربط الحسابات (Credentials)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderAccountCard('ebay', 'حساب eBay Seller', <div className="font-bold">eBay</div>, 'text-blue-600', 'ebayEmail', 'ebayPassword', 'isEbayConnected')}
            {renderAccountCard('blogger', 'مدونة Blogger', <div className="font-bold">B</div>, 'text-orange-600', 'bloggerEmail', 'bloggerPassword', 'isBloggerConnected')}
            {renderAccountCard('facebook', 'صفحة Facebook', <div className="font-bold">FB</div>, 'text-blue-700', 'facebookAccount', 'facebookPassword', 'isFacebookConnected')}
            {renderAccountCard('instagram', 'حساب Instagram', <div className="font-bold">IG</div>, 'text-pink-600', 'instagramAccount', 'instagramPassword', 'isInstagramConnected')}
          </div>
        </div>

        {/* Email Notifications (SendGrid) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Mail className="text-purple-600" size={20} />
            إشعارات البريد الإلكتروني (SendGrid)
          </h3>
          
          <div className="space-y-4">
             <div className="flex items-center justify-between bg-purple-50 p-4 rounded-xl border border-purple-100">
                <div>
                    <h4 className="font-bold text-gray-900">تفعيل الإشعارات</h4>
                    <p className="text-sm text-gray-600">إرسال تقارير فورية عبر البريد الإلكتروني.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="enableEmailNotifications" checked={formData.enableEmailNotifications} onChange={handleChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SendGrid API Key</label>
                  <div className="relative">
                    <Lock size={16} className="absolute top-3 left-3 text-gray-400" />
                    <input
                        type="password"
                        name="sendGridApiKey"
                        value={formData.sendGridApiKey || ''}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none font-mono text-sm"
                        placeholder="SG.xxxxxxxx...."
                    />
                  </div>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">بريد الاستقبال (Receiver Email)</label>
                  <div className="relative">
                     <Mail size={16} className="absolute top-3 left-3 text-gray-400" />
                    <input
                        type="email"
                        name="notificationEmail"
                        value={formData.notificationEmail || ''}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        placeholder="me@example.com"
                    />
                  </div>
                </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100">
                <h4 className="font-bold text-sm text-gray-700">تنبيهات مخصصة:</h4>
                <div className="flex items-center gap-3">
                    <input type="checkbox" name="notifyOnHighProfit" checked={formData.notifyOnHighProfit} onChange={handleChange} className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500" />
                    <span className="text-gray-700">عند العثور على منتج ذو <strong>ربح عالٍ</strong></span>
                </div>
                <div className="flex items-center gap-3">
                    <input type="checkbox" name="notifyOnVero" checked={formData.notifyOnVero} onChange={handleChange} className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500" />
                    <span className="text-gray-700">عند حظر منتج بسبب <strong>حقوق الملكية (VeRO)</strong></span>
                </div>
                 <div className="flex items-center gap-3">
                    <input type="checkbox" name="notifyOnExportSuccess" checked={formData.notifyOnExportSuccess} onChange={handleChange} className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500" />
                    <span className="text-gray-700">عند <strong>نجاح التصدير</strong> والنشر</span>
                </div>
            </div>
          </div>
        </div>

        {/* Automation Rules */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="text-yellow-600" size={20} />
            قواعد "الطيار الآلي" (Auto-Pilot Rules)
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                <div>
                    <h4 className="font-bold text-gray-900">تفعيل الوضع الآلي الكامل</h4>
                    <p className="text-sm text-gray-600">سيقوم البرنامج بالبحث، التحليل، والنشر تلقائياً دون تدخلك.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="autoModeEnabled" checked={formData.autoModeEnabled} onChange={handleChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الحد الأدنى لصافي الربح (%)</label>
                    <input 
                        type="range" 
                        name="minProfitMargin" 
                        min="10" 
                        max="100" 
                        value={formData.minProfitMargin} 
                        onChange={(e) => setFormData({...formData, minProfitMargin: parseInt(e.target.value)})}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>10%</span>
                        <span className="font-bold text-primary">{formData.minProfitMargin}%</span>
                        <span>100%</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">لن يتم نشر أي منتج هامش ربحه أقل من هذه النسبة.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الحد الأقصى للمنتجات يومياً</label>
                    <input 
                        type="number" 
                        name="dailyLimit" 
                        value={formData.dailyLimit} 
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100">
                <h4 className="font-bold text-sm text-gray-700">إجراءات النشر التلقائي:</h4>
                <div className="flex items-center gap-3">
                    <input type="checkbox" name="autoPublishEbay" checked={formData.autoPublishEbay} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                    <span className="text-gray-700">تصدير ونشر في <strong>eBay</strong> مباشرة</span>
                </div>
                <div className="flex items-center gap-3">
                    <input type="checkbox" name="autoPublishBlog" checked={formData.autoPublishBlog} onChange={handleChange} className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500" />
                    <span className="text-gray-700">نشر مقال في <strong>Blogger</strong></span>
                </div>
                <div className="flex items-center gap-3">
                    <input type="checkbox" name="autoPostSocial" checked={formData.autoPostSocial} onChange={handleChange} className="w-4 h-4 text-pink-600 rounded border-gray-300 focus:ring-pink-500" />
                    <span className="text-gray-700">نشر الحملات في <strong>Social Media</strong></span>
                </div>
            </div>
          </div>
        </div>

        {/* Safety Filters */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
           <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Shield className="text-red-600" size={20} />
            فلاتر الحماية (VeRO Protection)
          </h3>
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">استثناء ماركات محددة (يدوي)</label>
              <textarea 
                name="excludeBrands"
                value={formData.excludeBrands}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                placeholder="أدخل أسماء الماركات مفصولة بفاصلة، مثال: BrandX, BadQualityCo..."
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">يقوم النظام تلقائياً بحظر الماركات العالمية، استخدم هذا الحقل لإضافة ماركات إضافية.</p>
          </div>
        </div>

        <button 
            type="submit"
            className="w-full py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-2"
        >
            <Save size={20} />
            حفظ الإعدادات
        </button>

      </form>
    </div>
  );
};

export default Settings;