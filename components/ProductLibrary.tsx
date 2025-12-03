import React from 'react';
import { ProductData } from '../types';
import { Trash2, Edit, Download, ExternalLink, CheckCircle2, Clock } from 'lucide-react';

interface ProductLibraryProps {
  products: ProductData[];
  onEdit: (product: ProductData) => void;
  onDelete: (id: string) => void;
  onDeleteAll: () => void;
}

const ProductLibrary: React.FC<ProductLibraryProps> = ({ products, onEdit, onDelete, onDeleteAll }) => {

  const exportToCSV = () => {
    if (products.length === 0) return;

    // Defined Headers for eBay File Exchange format (Simplified)
    const headers = [
      "Action(SiteID=US|Country=US|Currency=USD|Version=745)",
      "Title",
      "Description",
      "StartPrice",
      "Quantity",
      "ConditionID",
      "PicURL"
    ];

    const rows = products.map(p => {
      // Clean description for CSV (remove newlines/commas)
      const cleanDesc = p.description.replace(/(\r\n|\n|\r)/gm, " ").replace(/"/g, '""');
      
      return [
        "Add", // Action
        `"${p.title.substring(0, 80)}"`, // Max 80 chars
        `"${cleanDesc}"`,
        p.profitCalculation?.listingPrice || p.price,
        "5", // Default Qty
        "1000", // New
        `"${p.images[0] || ''}"`
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `ebay_export_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">مكتبة المنتجات (المخزون)</h2>
           <p className="text-gray-500 text-sm">إدارة المنتجات المحفوظة وتصديرها.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={onDeleteAll}
                className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-bold transition-colors"
            >
                حذف الكل
            </button>
            <button 
                onClick={exportToCSV}
                disabled={products.length === 0}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold text-white transition-colors ${
                    products.length > 0 ? 'bg-green-600 hover:bg-green-700 shadow-md' : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
                <Download size={18} />
                تصدير CSV (eBay)
            </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <CheckCircle2 size={32} />
            </div>
            <p className="text-gray-500 font-medium text-lg">المكتبة فارغة حالياً</p>
            <p className="text-gray-400 text-sm">قم باستخراج المنتجات وحفظها لتظهر هنا.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-right">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                        <tr>
                            <th className="p-4">المنتج</th>
                            <th className="p-4">سعر المصدر</th>
                            <th className="p-4">سعر البيع</th>
                            <th className="p-4">الربح المتوقع</th>
                            <th className="p-4">الحالة</th>
                            <th className="p-4">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                            <img src={product.images[0]} alt="prod" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="max-w-xs">
                                            <p className="font-bold text-gray-800 text-sm truncate" title={product.title}>
                                                {product.title}
                                            </p>
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <Clock size={10} /> {product.createdAt || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 font-mono text-gray-600">${product.price}</td>
                                <td className="p-4 font-mono font-bold text-blue-600">
                                    ${product.profitCalculation?.listingPrice || '-'}
                                </td>
                                <td className="p-4 font-mono font-bold text-green-600">
                                    {product.profitCalculation ? `+$${product.profitCalculation.netProfit}` : '-'}
                                </td>
                                <td className="p-4">
                                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                                        product.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                                        product.status === 'READY' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                        {product.status === 'PUBLISHED' ? 'تم النشر' : 
                                         product.status === 'READY' ? 'جاهز' : 'مسودة'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => onEdit(product)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="تعديل / معاينة"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <a 
                                            href={product.url} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                            title="فتح الرابط الأصلي"
                                        >
                                            <ExternalLink size={16} />
                                        </a>
                                        <button 
                                            onClick={() => onDelete(product.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="حذف"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}
    </div>
  );
};

export default ProductLibrary;