import React, { useState } from 'react';
import { ActivityReport, ProductPerformance } from '../types';
import { FileText, ShieldAlert, CheckCircle, Clock, BarChart2, Eye, MousePointer, ShoppingCart, TrendingUp, List } from 'lucide-react';

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'activity' | 'performance'>('activity');

  // Dummy data for Activity Log
  const reports: ActivityReport[] = [
    { id: '1', date: '2023-10-27 10:30', action: 'SCAN', productName: 'Nike Air Max Copy', status: 'FAILED', details: 'تم الحظر بواسطة مرشح VeRO (العلامة التجارية)' },
    { id: '2', date: '2023-10-27 10:35', action: 'EXPORT', productName: 'Kitchen Gadget Tool', status: 'SUCCESS', details: 'ربح متوقع: $4.50 (هامش 25%)' },
    { id: '3', date: '2023-10-27 11:00', action: 'PUBLISH', productName: 'Smart Watch Strap', status: 'SUCCESS', details: 'نشر على بلوجر + فيسبوك' },
    { id: '4', date: '2023-10-27 11:15', action: 'SCAN', productName: 'Disney Toy', status: 'FAILED', details: 'حقوق ملكية فكرية (Disney)' },
    { id: '5', date: '2023-10-27 12:00', action: 'EXPORT', productName: 'LED Camping Light', status: 'SUCCESS', details: 'ربح متوقع: $8.20' },
  ];

  // Dummy data for Product Performance
  const performanceData: ProductPerformance[] = [
    { id: '101', title: 'Wireless Bluetooth Headphones P9', image: 'https://picsum.photos/50/50?random=1', listingDate: '2023-10-20', price: 29.99, views: 1250, clicks: 340, sales: 45, revenue: 1349.55, status: 'ACTIVE' },
    { id: '102', title: 'Portable Mini Juicer Blender', image: 'https://picsum.photos/50/50?random=2', listingDate: '2023-10-22', price: 19.50, views: 890, clicks: 210, sales: 28, revenue: 546.00, status: 'ACTIVE' },
    { id: '103', title: 'Magnetic Phone Car Mount', image: 'https://picsum.photos/50/50?random=3', listingDate: '2023-10-25', price: 12.99, views: 2400, clicks: 600, sales: 112, revenue: 1454.88, status: 'ACTIVE' },
    { id: '104', title: 'Silicone Kitchen Utensil Set', image: 'https://picsum.photos/50/50?random=4', listingDate: '2023-10-15', price: 34.00, views: 450, clicks: 80, sales: 5, revenue: 170.00, status: 'ENDED' },
  ];

  const totalRevenue = performanceData.reduce((sum, item) => sum + item.revenue, 0);
  const totalSales = performanceData.reduce((sum, item) => sum + item.sales, 0);
  const totalViews = performanceData.reduce((sum, item) => sum + item.views, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BarChart2 className="text-primary" />
            مركز التقارير والتحليلات
        </h2>
        
        {/* Tab Switcher */}
        <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
            <button
                onClick={() => setActiveTab('activity')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeTab === 'activity' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <List size={16} />
                سجل النشاط
            </button>
            <button
                onClick={() => setActiveTab('performance')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeTab === 'performance' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <TrendingUp size={16} />
                أداء المبيعات
            </button>
        </div>
      </div>

      {activeTab === 'activity' ? (
        // ACTIVITY LOG TAB
        <div className="space-y-6">
             <div className="flex gap-4">
                <div className="flex-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                    <p className="text-gray-500 text-sm mb-1">عمليات الفحص</p>
                    <p className="text-3xl font-bold text-blue-600">1,240</p>
                </div>
                <div className="flex-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                    <p className="text-gray-500 text-sm mb-1">المنتجات المقبولة</p>
                    <p className="text-3xl font-bold text-green-600">850</p>
                </div>
                <div className="flex-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                    <p className="text-gray-500 text-sm mb-1">محظورات VeRO</p>
                    <p className="text-3xl font-bold text-red-600">390</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 font-bold text-gray-700">سجل العمليات الأخير</div>
                <table className="w-full text-right">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                        <tr>
                            <th className="p-4 font-bold">التوقيت</th>
                            <th className="p-4 font-bold">العملية</th>
                            <th className="p-4 font-bold">المنتج</th>
                            <th className="p-4 font-bold">التفاصيل</th>
                            <th className="p-4 font-bold">الحالة</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {reports.map((report) => (
                            <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-gray-500 font-mono text-sm flex items-center gap-2">
                                    <Clock size={14} />
                                    {report.date}
                                </td>
                                <td className="p-4">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                                        report.action === 'SCAN' ? 'bg-blue-100 text-blue-700' :
                                        report.action === 'BLOCK' ? 'bg-red-100 text-red-700' :
                                        'bg-purple-100 text-purple-700'
                                    }`}>
                                        {report.action}
                                    </span>
                                </td>
                                <td className="p-4 font-medium text-gray-800">{report.productName}</td>
                                <td className="p-4 text-sm text-gray-600">{report.details}</td>
                                <td className="p-4">
                                    {report.status === 'SUCCESS' && (
                                        <span className="flex items-center gap-1 text-green-600 font-bold text-sm">
                                            <CheckCircle size={16} /> ناجح
                                        </span>
                                    )}
                                    {report.status === 'FAILED' && (
                                        <span className="flex items-center gap-1 text-red-600 font-bold text-sm">
                                            <ShieldAlert size={16} /> محظور
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      ) : (
        // PERFORMANCE TAB
        <div className="space-y-6">
             {/* Performance Summary */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-green-500/20">
                    <div className="flex items-center gap-3 mb-2 opacity-80">
                        <ShoppingCart size={20} />
                        <span className="font-medium">إجمالي المبيعات</span>
                    </div>
                    <div className="text-3xl font-bold">${totalRevenue.toFixed(2)}</div>
                    <div className="text-sm mt-2 opacity-80">من {totalSales} عملية بيع</div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-center">
                     <div className="flex items-center gap-3 mb-1 text-gray-500">
                        <Eye size={20} />
                        <span className="font-medium">مشاهدات eBay</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-800">{totalViews.toLocaleString()}</div>
                    <div className="text-sm text-green-600 font-medium mt-1">+12% هذا الأسبوع</div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-center">
                     <div className="flex items-center gap-3 mb-1 text-gray-500">
                        <MousePointer size={20} />
                        <span className="font-medium">معدل النقر (CTR)</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-800">
                        {((totalSales / totalViews) * 100).toFixed(2)}%
                    </div>
                    <div className="text-sm text-gray-400 mt-1">معدل تحويل جيد</div>
                </div>
            </div>

            {/* Performance Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-700">أداء المنتجات المنشورة</h3>
                    <button className="text-xs text-blue-600 hover:underline">تصدير CSV</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                            <tr>
                                <th className="p-4 font-bold">المنتج</th>
                                <th className="p-4 font-bold">السعر</th>
                                <th className="p-4 font-bold text-center">المشاهدات</th>
                                <th className="p-4 font-bold text-center">النقرات</th>
                                <th className="p-4 font-bold text-center">المبيعات</th>
                                <th className="p-4 font-bold text-center">العائد</th>
                                <th className="p-4 font-bold">الحالة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {performanceData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={item.image} className="w-10 h-10 rounded-md object-cover border border-gray-200" alt="prod" />
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm truncate w-48" title={item.title}>{item.title}</p>
                                                <p className="text-xs text-gray-500">{item.listingDate}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium">${item.price}</td>
                                    <td className="p-4 text-center text-gray-600">{item.views}</td>
                                    <td className="p-4 text-center text-gray-600">{item.clicks}</td>
                                    <td className="p-4 text-center font-bold text-green-600">{item.sales}</td>
                                    <td className="p-4 text-center font-bold text-gray-800">${item.revenue.toFixed(2)}</td>
                                    <td className="p-4">
                                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                                            item.status === 'ACTIVE' 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-gray-200 text-gray-600'
                                        }`}>
                                            {item.status === 'ACTIVE' ? 'نشط' : 'منتهي'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Reports;