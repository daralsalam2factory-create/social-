import React, { useState, useEffect, useRef } from 'react';
import { ProductData, GeneratedContent } from '../types';
import { Copy, Send, Tag, Search, BarChart3, Edit3, Eye, Check, RefreshCw, Plus, X } from 'lucide-react';
import Quill from 'quill';

interface BloggerPreviewProps {
  product: ProductData;
  content: GeneratedContent | null;
  loading: boolean;
}

const BloggerPreview: React.FC<BloggerPreviewProps> = ({ product, content, loading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [blogTitle, setBlogTitle] = useState('');
  
  // SEO State
  const [seoDescription, setSeoDescription] = useState('');
  const [seoTags, setSeoTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');

  // Quill Refs
  const quillRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (content) {
      setEditorContent(content.blogContent);
      setBlogTitle(content.blogTitle);
      setSeoDescription(content.seoMetaDescription);
      setSeoTags(content.seoTags || []);
    }
  }, [content]);

  // Initialize Quill when entering edit mode
  useEffect(() => {
    if (isEditing && quillRef.current && !quillInstanceRef.current) {
        quillInstanceRef.current = new Quill(quillRef.current, {
            theme: 'snow',
            modules: {
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'direction': 'rtl' }],
                  [{ 'align': [] }],
                  ['link', 'image'],
                  ['clean']
                ],
            },
        });

        // Set initial content
        if (editorContent) {
            quillInstanceRef.current.clipboard.dangerouslyPasteHTML(editorContent);
        }

        // Listen for changes
        quillInstanceRef.current.on('text-change', () => {
            if (quillInstanceRef.current) {
                setEditorContent(quillInstanceRef.current.root.innerHTML);
            }
        });
    }

    // Cleanup when exiting edit mode
    if (!isEditing) {
        quillInstanceRef.current = null;
    }
  }, [isEditing]);


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-12 h-12 border-4 border-blogger border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">جاري كتابة مقال احترافي...</p>
      </div>
    );
  }

  if (!content) return <div className="text-center p-10 text-gray-500">لم يتم توليد المحتوى بعد.</div>;

  const handleCopy = () => {
    navigator.clipboard.writeText(editorContent);
    alert('تم نسخ محتوى المقال (HTML) بنجاح!');
  };

  const handleSyncDescription = () => {
    // Strip HTML and get first 150 chars
    const plainText = editorContent.replace(/<[^>]*>?/gm, ' ');
    setSeoDescription(plainText.substring(0, 155).trim() + '...');
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !seoTags.includes(newTagInput.trim())) {
      setSeoTags([...seoTags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSeoTags(seoTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
       {/* Action Bar */}
       <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-wrap gap-3 justify-between items-center shadow-sm">
        <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <span className="w-6 h-6 bg-blogger text-white rounded text-xs flex items-center justify-center font-bold">B</span>
            معاينة بلوجر
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isEditing 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            {isEditing ? <Check size={16} /> : <Edit3 size={16} />}
            {isEditing ? 'إنهاء التعديل' : 'تعديل يدوي'}
          </button>
          
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            <Copy size={16} />
            نسخ المحتوى
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blogger text-white hover:bg-orange-600 rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Send size={16} />
            نشر للمدونة
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor Preview */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
             <div className="border-b border-gray-200 p-4 bg-gray-50">
                 <label className="block text-xs text-gray-500 mb-1">عنوان المقال (Editable)</label>
                 <input 
                    type="text" 
                    value={blogTitle} 
                    onChange={(e) => setBlogTitle(e.target.value)}
                    className="w-full bg-transparent text-xl font-bold text-gray-800 border-none focus:ring-0 placeholder-gray-400 focus:outline-none"
                    placeholder="عنوان المقال"
                 />
             </div>
             
             <div className="flex-1 bg-white relative min-h-[500px]">
                 {isEditing ? (
                    <div ref={quillRef} className="h-full bg-white" />
                 ) : (
                    <div className="p-8 prose prose-lg max-w-none prose-img:rounded-xl">
                        <img src={product.images[0]} alt={product.title} className="w-full h-64 object-cover mb-6 rounded-xl shadow-sm" />
                        <div dangerouslySetInnerHTML={{ __html: editorContent }} />
                    </div>
                 )}
             </div>
        </div>

        {/* Sidebar Settings & SEO */}
        <div className="space-y-6">
            {/* SEO Score Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-700 flex items-center gap-2">
                        <BarChart3 size={18} className="text-green-600" />
                        نقاط SEO
                    </h4>
                    <span className="text-2xl font-bold text-green-600">{content.seoScore || 85}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div 
                        className="bg-green-600 h-2.5 rounded-full" 
                        style={{ width: `${content.seoScore || 85}%` }}
                    ></div>
                </div>
                <p className="text-xs text-gray-500">يتم تحديث المعاينة أدناه تلقائياً عند التعديل.</p>
            </div>

            {/* Google Search Preview */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-gray-700 flex items-center gap-2">
                        <Search size={18} />
                        Google Preview
                    </h4>
                    <button onClick={handleSyncDescription} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                        <RefreshCw size={12} />
                        استخراج من المحتوى
                    </button>
                </div>
                
                {/* Visual Preview */}
                <div className="font-sans text-left bg-white p-2 rounded hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200" dir="ltr">
                    <div className="text-sm text-gray-800 mb-1 flex items-center gap-1">
                        <span className="bg-gray-200 rounded-full w-4 h-4 inline-block"></span>
                        MyAwesomeBlog.com
                    </div>
                    <div className="text-xl text-[#1a0dab] font-medium hover:underline cursor-pointer truncate">
                        {blogTitle.substring(0, 60)}{blogTitle.length > 60 ? '...' : ''}
                    </div>
                    <div className="text-sm text-gray-600 leading-snug mt-1 break-words">
                        {seoDescription || "No description set. Click 'Extract' or type below."}
                    </div>
                </div>

                {/* Edit Meta Description */}
                <div className="mt-4">
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                        وصف الميتا (Meta Description)
                        <span className={`float-end ${seoDescription.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                            {seoDescription.length}/160
                        </span>
                    </label>
                    <textarea 
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        className="w-full text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 border"
                        rows={3}
                        placeholder="اكتب وصفاً جذاباً لمحركات البحث..."
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <Tag size={18} />
                    الكلمات المفتاحية
                </h4>
                
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {seoTags.map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-orange-50 text-orange-600 text-xs rounded-full border border-orange-100 flex items-center gap-1 group">
                                {tag}
                                <button 
                                    onClick={() => handleRemoveTag(tag)}
                                    className="hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={12} />
                                </button>
                            </span>
                        ))}
                    </div>
                    
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={newTagInput}
                            onChange={(e) => setNewTagInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder="إضافة كلمة مفتاحية..."
                        />
                        <button 
                            onClick={handleAddTag}
                            className="bg-orange-100 text-orange-600 p-2 rounded-lg hover:bg-orange-200 transition-colors"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BloggerPreview;