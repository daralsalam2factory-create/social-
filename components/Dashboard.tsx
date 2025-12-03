import React from 'react';
import { StatCardProps } from '../types';
import { DollarSign, TrendingUp, Package, Share2, BarChart2, Zap, StopCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Demo Data for chart
const data = [
  { name: 'Jan', sales: 4000, visits: 2400 },
  { name: 'Feb', sales: 3000, visits: 1398 },
  { name: 'Mar', sales: 2000, visits: 9800 },
  { name: 'Apr', sales: 2780, visits: 3908 },
  { name: 'May', sales: 1890, visits: 4800 },
  { name: 'Jun', sales: 2390, visits: 3800 },
  { name: 'Jul', sales: 3490, visits: 4300 },
];

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
        {icon}
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center gap-1 text-sm text-green-600 font-medium">
        <TrendingUp size={16} />
        <span>{trend}</span>
        <span className="text-gray-400 font-normal mr-1">مقارنة بالشهر الماضي</span>
      </div>
    )}
  </div>
);

interface DashboardProps {
    onCreateNew: () => void;
    isAutoPilotRunning?: boolean;
    onToggleAutoPilot?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onCreateNew, isAutoPilotRunning, onToggleAutoPilot }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">أهلاً بك، المسوق المحترف 👋</h2>
          <p className="text-gray-500 mt-1">إليك ملخص أداء منتجاتك ومبيعات الأفليت.</p>
        </div>
        <div className="flex gap-3">
             <button 
                onClick={onToggleAutoPilot}
                className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 ${
                    isAutoPilotRunning 
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-200' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/30'
                }`}
            >
                {isAutoPilotRunning ? (
                    <>
                        <StopCircle size={20} className="animate-pulse" />
                        إيقاف الطيار الآلي
                    </>
                ) : (
                    <>
                        <Zap size={20} />
                        تشغيل الطيار الآلي
                    </>
                )}
            </button>
            <button 
                onClick={onCreateNew}
                className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition-shadow shadow-lg shadow-red-500/30 flex items-center gap-2"
            >
                <Package size={20} />
                منتج جديد
            </button>
        </div>
      </div>

      {isAutoPilotRunning && (
          <div className="bg-indigo-900 text-white p-4 rounded-xl flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="font-medium">النظام يعمل الآن في الخلفية: يقوم بالبحث عن منتجات مربحة، فحصها، ونشرها تلقائياً...</span>
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded">Live Logs</span>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="إجمالي الأرباح" 
          value="$12,450" 
          icon={<DollarSign className="text-green-600" />} 
          trend="+15%"
          color="bg-green-100"
        />
        <StatCard 
          title="المنتجات النشطة" 
          value="45" 
          icon={<Package className="text-blue-600" />} 
          trend="+4"
          color="bg-blue-100"
        />
        <StatCard 
          title="زيارات المدونة" 
          value="85.2k" 
          icon={<Share2 className="text-orange-600" />} 
          trend="+22%"
          color="bg-orange-100"
        />
        <StatCard 
          title="معدل التحويل" 
          value="3.2%" 
          icon={<BarChart2 className="text-purple-600" />} 
          color="bg-purple-100"
        />
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">تحليل الأداء</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0064D2" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0064D2" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF4747" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FF4747" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="visits" stroke="#0064D2" fillOpacity={1} fill="url(#colorVisits)" strokeWidth={3} />
                <Area type="monotone" dataKey="sales" stroke="#FF4747" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-bold text-gray-800 mb-4">أفضل المنتجات أداءً</h3>
           <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0">
                          <img src={`https://picsum.photos/100/100?random=${i}`} className="w-full h-full object-cover rounded-lg" alt="product" />
                      </div>
                      <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-gray-800 truncate">ساعة ذكية مقاومة للماء X{i}00</h4>
                          <p className="text-xs text-gray-500">تم بيع 124 قطعة</p>
                      </div>
                      <span className="font-bold text-green-600 text-sm">+$420</span>
                  </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;