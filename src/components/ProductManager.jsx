import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Search, X, Star } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { useAuthStore } from '../store/useAuthStore';
import { getPlaceholderImage } from '../utils/placeholders';
import axios from 'axios';

export default function ProductManager({ user }) {
  const { products, loading, fetchProducts, deleteProduct } = useProductStore();
  const { token } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [basePrice, setBasePrice] = useState(0);
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    barcode: '',
    description: '',
    imageUrl: '',
    categoryId: '',
    roast: '',
    acid: 0,
    body: 0,
    sca: 0,
    region: '',
    origin: '',
    notes: '',
    composition: '',
    prep_method: '',
    brewing_temp: '',
    steeping_time: '',
    tea_type: '',
    storage: '',
    isTop: false,
    isWeekly: false,
    isSpecialty: false,
    variants: [{ weight: 100, price: 0, oldPrice: 0, stock: 10 }]
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/categories')
      .then(res => {
        setCategories(res.data);
        if (res.data.length > 0 && !editId && !formData.categoryId) {
           setFormData(prev => ({ ...prev, categoryId: res.data[0].id }));
        }
      })
      .catch(err => console.error('Ошибка при получении категорий:', err));
  }, [editId]);

  useEffect(() => {
    fetchProducts(searchTerm);
  }, [searchTerm, fetchProducts]);

  const handleBasePriceChange = (price) => {
    const val = parseInt(price) || 0;
    setBasePrice(val);
    
    const selectedCat = categories.find(c => String(c.id) === String(formData.categoryId));
    const catName = selectedCat?.name || '';
    
    const isCoffee = catName.toLowerCase().includes('кофе');
    const isTea = catName.toLowerCase().includes('чай');

    if (val > 0) {
      let newVariants = [];
      if (isCoffee) {
        newVariants = [
          { weight: 100, price: val, stock: 20 },
          { weight: 250, price: Math.round(val * 2.5), stock: 20 },
          { weight: 500, price: Math.round(val * 5), stock: 15 },
          { weight: 1000, price: Math.round(val * 9.5), stock: 10 }
        ];
      } else if (isTea) {
        newVariants = [
          { weight: 50, price: Math.round(val * 0.5), stock: 20 },
          { weight: 100, price: val, stock: 20 },
          { weight: 200, price: Math.round(val * 2), stock: 15 }
        ];
      } else {
        newVariants = [{ weight: 100, price: val, stock: 10 }];
      }
      setFormData(prev => ({ ...prev, variants: newVariants }));
    }
  };

  const handleOpenModal = () => {
    setEditId(null);
    setBasePrice(0);
    setImageFile(null);
    setFormData({
      name: '',
      brand: '',
      barcode: '',
      description: '',
      imageUrl: '',
      categoryId: categories.length > 0 ? categories[0].id : '',
      roast: '',
      acid: 0,
      body: 0,
      sca: 0,
      region: '',
      origin: '',
      notes: '',
      composition: '',
      prep_method: '',
      brewing_temp: '',
      steeping_time: '',
      tea_type: '',
      storage: '',
      isTop: false,
      isWeekly: false,
      isSpecialty: false,
      variants: [{ weight: 100, price: 0, oldPrice: 0, stock: 10 }]
    });
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditId(product.id);
    setImageFile(null);
    const firstVariant = product.variants?.[0];
    setBasePrice(firstVariant ? firstVariant.price : 0);
    setFormData({
      name: product.name || '',
      brand: product.brand || '',
      barcode: product.barcode || '',
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      categoryId: product.categoryId || '',
      roast: product.roast || '',
      acid: product.acid || 0,
      body: product.body || 0,
      sca: product.sca || 0,
      region: product.region || '',
      origin: product.origin || '',
      notes: product.notes || '',
      composition: product.composition || '',
      prep_method: product.prep_method || '',
      brewing_temp: product.brewing_temp || '',
      steeping_time: product.steeping_time || '',
      tea_type: product.tea_type || '',
      storage: product.storage || '',
      isTop: product.isTop || false,
      isWeekly: product.isWeekly || false,
      isSpecialty: product.isSpecialty || false,
      variants: product.variants?.length > 0 
        ? product.variants.map(v => ({ weight: v.weight, price: v.price, oldPrice: v.oldPrice || 0, stock: v.stock }))
        : [{ weight: 100, price: 0, oldPrice: 0, stock: 10 }]
    });
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoryId) {
      alert("Выберите категорию");
      return;
    }
    try {
      let finalImageUrl = formData.imageUrl;

      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', imageFile);
        const uploadRes = await axios.post('http://localhost:5000/api/upload', uploadFormData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}` 
          }
        });
        finalImageUrl = uploadRes.data.imageUrl;
      }

      const sanitizedData = {
        ...formData,
        imageUrl: finalImageUrl,
        categoryId: parseInt(formData.categoryId),
        acid: parseFloat(formData.acid) || 0,
        body: parseFloat(formData.body) || 0,
        sca: parseFloat(formData.sca) || 0,
        isTop: Boolean(formData.isTop),
        isWeekly: Boolean(formData.isWeekly),
        isSpecialty: Boolean(formData.isSpecialty),
        variants: formData.variants.map(v => ({
          weight: parseInt(v.weight),
          price: parseInt(v.price),
          oldPrice: v.oldPrice ? parseInt(v.oldPrice) : null,
          stock: parseInt(v.stock)
        }))
      };
      
      const url = editId ? `http://localhost:5000/api/products/${editId}` : 'http://localhost:5000/api/products';
      const method = editId ? 'put' : 'post';
      
      await axios[method](url, sanitizedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
      setShowModal(false);
    } catch (err) {
      alert('Ошибка при сохранении: ' + (err.response?.data?.error || err.message));
    }
  };

  const selectedCategoryName = categories.find(c => String(c.id) === String(formData.categoryId))?.name?.toLowerCase() || '';
  const isCoffee = selectedCategoryName.includes('кофе');
  const isTea = selectedCategoryName.includes('чай');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8 bg-white dark:bg-[#1C1614] p-8 rounded-[32px] border border-[#EADFD8] dark:border-[#4A3B32] shadow-md dark:shadow-black/40">
        <div>
          <h3 className="text-3xl font-serif text-[#1C1614] dark:text-[#F6F1E9]">Управление бутиком</h3>
          <p className="text-xs text-stone-400 dark:text-stone-500 mt-1 uppercase tracking-widest font-bold">Контроль ассортимента и цен</p>
        </div>
        <button onClick={handleOpenModal} className="bg-white dark:bg-[#362A25] text-[#C06334] dark:text-[#D4AF37] border-2 border-[#EADFD8] dark:border-[#4A3B32] hover:border-[#C06334] dark:hover:border-[#D4AF37] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:shadow-lg transition-all flex items-center gap-3 shadow-md shadow-[#C06334]/5">
          <Plus className="w-5 h-5" /> Добавить лот
        </button>
      </div>

      {/* ПОИСК */}
      <div className="relative mb-8 group">
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 dark:text-stone-500 group-focus-within:text-[#C06334] transition-colors" />
        <input 
          type="text" 
          placeholder="Поиск по названию, бренду или штрих-коду..." 
          className="w-full bg-white dark:bg-[#1C1614] border border-[#EADFD8] dark:border-[#4A3B32] rounded-[32px] py-6 pl-20 pr-10 text-sm focus:outline-none focus:border-[#C06334] focus:shadow-xl focus:shadow-[#C06334]/5 transition-all shadow-md dark:shadow-black/40"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white dark:bg-[#1C1614] border border-[#EADFD8] dark:border-[#4A3B32] rounded-[48px] overflow-hidden shadow-md dark:shadow-black/40">
        <table className="w-full text-left">
          <thead className="bg-stone-50 dark:bg-[#2A201D] border-b border-[#EADFD8] dark:border-[#4A3B32] text-[10px] uppercase tracking-[0.3em] text-stone-400 dark:text-stone-500 font-black">
            <tr>
              <th className="p-8">Товар</th>
              <th className="p-8">Категория</th>
              <th className="p-8">Варианты (Запас)</th>
              <th className="p-8 text-right">Хит</th>
              <th className="p-8 text-right">Управление</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-stone-100 dark:bg-[#362A25] rounded-2xl flex items-center justify-center p-2 border border-[#EADFD8] dark:border-[#4A3B32]">
                       <img 
                        src={p.imageUrl || getPlaceholderImage(p)} 
                        onError={(e) => { e.target.src = getPlaceholderImage(p); }}
                        className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal" 
                        alt="" 
                       />
                    </div>
                    <div>
                      <span className="font-bold text-stone-800 dark:text-stone-200 text-lg block">{p.name}</span>
                      {p.barcode && <span className="text-[9px] text-stone-400 dark:text-stone-500 font-mono">[{p.barcode}]</span>}
                      <div className="flex gap-2 mt-1">
                        {p.isTop && <span className="text-[8px] font-black uppercase bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit"><Star className="w-2 h-2 fill-current" /> Хит</span>}
                        {p.isWeekly && <span className="text-[8px] font-black uppercase bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">Сорт недели</span>}
                        {p.isSpecialty && <span className="text-[8px] font-black uppercase bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">Specialty</span>}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-8">
                  <span className="uppercase text-[9px] font-black px-4 py-2 bg-orange-50 dark:bg-[#362A25] rounded-full text-[#C06334] dark:text-[#D4AF37] border border-orange-100 dark:border-[#4A3B32]">
                    {p.category?.name || '—'}
                  </span>
                </td>
                <td className="p-8">
                  <div className="flex flex-wrap gap-2">
                    {p.variants?.map((v, i) => (
                      <span key={i} className="text-[10px] font-bold bg-white dark:bg-[#1C1614] border border-[#EADFD8] dark:border-[#4A3B32] px-3 py-1.5 rounded-xl text-stone-400 dark:text-stone-500 shadow-md dark:shadow-black/40 flex items-center gap-2">
                        {v.weight}г: <span className="text-stone-900">{v.price}₽</span>
                        {v.oldPrice && <span className="text-[8px] line-through opacity-50">{v.oldPrice}₽</span>}
                        <span className={`text-[8px] px-1.5 rounded-md ${v.stock > 10 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{v.stock} шт</span>
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-8 text-right">
                   {p.isTop ? <Star className="w-5 h-5 text-orange-400 fill-current inline" /> : <Star className="w-5 h-5 text-stone-800 dark:text-stone-200 inline" />}
                </td>
                <td className="p-8 text-right">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => handleEdit(p)} className="p-3 text-[#C06334] hover:bg-orange-50 rounded-2xl transition-all"><Edit2 className="w-5 h-5" /></button>
                    <button onClick={() => deleteProduct(p.id)} className="p-3 text-red-400 hover:bg-red-50 rounded-2xl transition-all"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-[#1C1614]/60 backdrop-blur-xl z-[200]" />
            <motion.div 
              initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} 
              className="fixed inset-x-0 bottom-0 top-24 md:top-24 md:bottom-0 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-4xl bg-white dark:bg-[#1C1614] rounded-t-[40px] md:rounded-t-[56px] shadow-2xl z-[210] overflow-hidden flex flex-col border border-[#DED0C6] dark:border-[#5A4B42]"
            >
              <div className="p-10 border-b border-[#EADFD8] dark:border-[#4A3B32] flex justify-between items-center bg-stone-50/50">
                <div>
                  <h3 className="text-3xl font-serif text-stone-900">{editId ? 'Редактирование' : 'Новый лот'}</h3>
                  <p className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mt-1">Заполните детали продукта</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-4 bg-white dark:bg-[#1C1614] rounded-full shadow-md dark:shadow-black/40 hover:rotate-90 transition-transform"><X className="w-6 h-6" /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar">
                <div className="flex items-center gap-4 bg-stone-50 dark:bg-[#2A201D] p-6 rounded-[24px]">
                   <input 
                     type="checkbox" 
                     id="isTop"
                     checked={formData.isTop}
                     onChange={e => setFormData({...formData, isTop: e.target.checked})}
                     className="w-6 h-6 rounded-lg accent-[#C06334] dark:accent-[#D4AF37]"
                   />
                   <label htmlFor="isTop" className="text-sm font-bold uppercase tracking-widest text-stone-700 flex items-center gap-2 cursor-pointer">
                     <Star className={`w-4 h-4 ${formData.isTop ? 'fill-[#C06334] text-[#C06334]' : 'text-stone-400 dark:text-stone-500'}`} />
                     Хит продаж
                   </label>
                </div>

                <div className="flex items-center gap-4 bg-stone-50 dark:bg-[#2A201D] p-6 rounded-[24px]">
                   <input 
                     type="checkbox" 
                     id="isWeekly"
                     checked={formData.isWeekly}
                     onChange={e => setFormData({...formData, isWeekly: e.target.checked})}
                     className="w-6 h-6 rounded-lg accent-purple-600"
                   />
                   <label htmlFor="isWeekly" className="text-sm font-bold uppercase tracking-widest text-stone-700 flex items-center gap-2 cursor-pointer">
                     <Plus className={`w-4 h-4 ${formData.isWeekly ? 'text-purple-600' : 'text-stone-400 dark:text-stone-500'}`} />
                     Сорт недели (скидка)
                   </label>
                </div>

                <div className="flex items-center gap-4 bg-stone-50 dark:bg-[#2A201D] p-6 rounded-[24px]">
                   <input 
                     type="checkbox" 
                     id="isSpecialty"
                     checked={formData.isSpecialty}
                     onChange={e => setFormData({...formData, isSpecialty: e.target.checked})}
                     className="w-6 h-6 rounded-lg accent-emerald-600"
                   />
                   <label htmlFor="isSpecialty" className="text-sm font-bold uppercase tracking-widest text-stone-700 flex items-center gap-2 cursor-pointer">
                     <span className={`w-4 h-4 rounded-full border-2 ${formData.isSpecialty ? 'border-emerald-600 bg-emerald-600' : 'border-stone-400 dark:border-stone-500'}`} />
                     Specialty (Премиум)
                   </label>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-4">Название лота</label>
                    <input required className="w-full bg-stone-50 dark:bg-[#2A201D] p-6 rounded-[24px] outline-none border border-transparent focus:border-[#C06334] focus:bg-white transition-all text-lg font-serif" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-4">Бренд / Производитель</label>
                    <input className="w-full bg-stone-50 dark:bg-[#2A201D] p-6 rounded-[24px] outline-none border border-transparent focus:border-[#C06334] focus:bg-white transition-all text-lg font-serif" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} placeholder="Напр. Tasty Coffee" />
                  </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-4">Штрих-код (EAN/UPC)</label>
                    <input className="w-full bg-stone-50 dark:bg-[#2A201D] p-6 rounded-[24px] outline-none border border-transparent focus:border-[#C06334] focus:bg-white transition-all text-lg font-serif" value={formData.barcode} onChange={e => setFormData({...formData, barcode: e.target.value})} placeholder="Напр. 4607123456789" />
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-4">Категория</label>
                    <select 
                      required 
                      className="w-full bg-stone-50 dark:bg-[#2A201D] p-6 rounded-[24px] outline-none border border-transparent focus:border-[#C06334] focus:bg-white transition-all appearance-none cursor-pointer text-lg" 
                      value={String(formData.categoryId)} 
                      onChange={e => setFormData({...formData, categoryId: e.target.value})}
                    >
                      <option value="">Выбрать...</option>
                      {categories.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                    </select>
                </div>

                {isTea && (
                  <>
                    <div className="grid grid-cols-3 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-4">Тип чая</label>
                        <input className="w-full bg-stone-50 dark:bg-[#2A201D] p-6 rounded-[24px] outline-none" value={formData.tea_type} onChange={e => setFormData({...formData, tea_type: e.target.value})} placeholder="Зеленый / Улун / Пуэр" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-4">t° заваривания</label>
                        <input className="w-full bg-stone-50 dark:bg-[#2A201D] p-6 rounded-[24px] outline-none" value={formData.brewing_temp} onChange={e => setFormData({...formData, brewing_temp: e.target.value})} placeholder="Напр. 85-90°C" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-4">Время настоев</label>
                        <input className="w-full bg-stone-50 dark:bg-[#2A201D] p-6 rounded-[24px] outline-none" value={formData.steeping_time} onChange={e => setFormData({...formData, steeping_time: e.target.value})} placeholder="Напр. 2-3 мин" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-4">Регион сбора</label>
                        <input className="w-full bg-stone-50 dark:bg-[#2A201D] p-6 rounded-[24px] outline-none" value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} placeholder="Напр. Фуцзянь" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-4">Страна происхождения</label>
                        <input className="w-full bg-stone-50 dark:bg-[#2A201D] p-6 rounded-[24px] outline-none" value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} placeholder="Напр. Китай" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-4">Ноты вкуса (через запятую)</label>
                      <input className="w-full bg-stone-50 dark:bg-[#2A201D] p-6 rounded-[24px] outline-none border border-transparent focus:border-[#C06334] focus:bg-white transition-all text-lg font-serif" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Напр. Травянистый, Цветочный" />
                    </div>
                  </>
                )}

                {isCoffee && (
                  <>
                    <div className="grid grid-cols-4 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-4">Обжарка</label>
                        <input className="w-full bg-stone-50 dark:bg-[#2A201D] p-6 rounded-[24px] outline-none" value={formData.roast} onChange={e => setFormData({...formData, roast: e.target.value})} placeholder="Омни / Эспрессо" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-4">Кислотность</label>
                        <input type="number" step="0.1" className="w-full bg-stone-50 dark:bg-[#2A201D] p-6 rounded-[24px] outline-none" value={formData.acid} onChange={e => setFormData({...formData, acid: e.target.value})} />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-4">Тело</label>
                        <input type="number" step="0.1" className="w-full bg-stone-50 dark:bg-[#2A201D] p-6 rounded-[24px] outline-none" value={formData.body} onChange={e => setFormData({...formData, body: e.target.value})} />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-4">Баллы SCA</label>
                        <input type="number" step="0.1" className="w-full bg-stone-50 dark:bg-[#2A201D] p-6 rounded-[24px] outline-none" value={formData.sca} onChange={e => setFormData({...formData, sca: e.target.value})} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-4">Особенности / Тип</label>
                        <input className="w-full bg-stone-50 dark:bg-[#2A201D] p-6 rounded-[24px] outline-none" value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} placeholder="Напр. Натуральный, Арома" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-4">Страна происхождения</label>
                        <input className="w-full bg-stone-50 dark:bg-[#2A201D] p-6 rounded-[24px] outline-none" value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} placeholder="Напр. Эфиопия" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-4">Букет вкуса (через запятую)</label>
                      <input className="w-full bg-stone-50 dark:bg-[#2A201D] p-6 rounded-[24px] outline-none border border-transparent focus:border-[#C06334] focus:bg-white transition-all text-lg font-serif" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Напр. Какао, Фундук, Карамель" />
                    </div>
                  </>
                )}

                <div className="bg-[#C06334]/5 p-8 rounded-[32px] border border-[#C06334]/10 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#C06334]">Умный расчет прайса</label>
                    <span className="text-[9px] text-[#C06334]/60 font-bold uppercase tracking-tighter italic">Введите цену за 100г — остальное заполнится само</span>
                  </div>
                  <input type="number" placeholder="Напр. 450" className="w-full bg-white dark:bg-[#1C1614] p-6 rounded-[20px] outline-none border-2 border-transparent focus:border-[#C06334] transition-all text-2xl font-serif text-[#C06334]" value={basePrice || ""} onChange={e => handleBasePriceChange(e.target.value)} />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-4">Изображение товара</label>
                  <div className="flex gap-4 items-center">
                    {formData.imageUrl && (
                      <div className="w-20 h-20 bg-[#1C1614] dark:bg-[#362A25] rounded-2xl overflow-hidden border border-[#DED0C6] dark:border-[#5A4B42]">
                        <img src={formData.imageUrl} className="w-full h-full object-contain" alt="Preview" />
                      </div>
                    )}
                    <div className="flex-1 relative">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        className="w-full bg-stone-50 dark:bg-[#2A201D] p-6 rounded-[24px] outline-none border border-transparent focus:border-[#C06334] file:hidden cursor-pointer" 
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] font-bold text-[#C06334] uppercase">
                        {imageFile ? imageFile.name : 'Выберите файл'}
                      </div>
                    </div>
                  </div>
                  <input 
                    className="w-full bg-stone-50/50 p-4 rounded-[16px] outline-none text-[10px] text-stone-400 dark:text-stone-500 mt-2" 
                    value={formData.imageUrl} 
                    onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                    placeholder="Или вставьте прямую ссылку..." 
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-4">Описание</label>
                  <textarea className="w-full bg-stone-50 dark:bg-[#2A201D] p-6 rounded-[24px] h-40 outline-none border border-transparent focus:border-[#C06334] focus:bg-white transition-all" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C06334] ml-4">Ценовые лоты (Вес / Запас)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.variants.map((v, i) => (
                      <div key={i} className="flex gap-4 items-center bg-stone-50 dark:bg-[#2A201D] p-6 rounded-[24px] border border-[#EADFD8] dark:border-[#4A3B32]">
                        <div className="w-20">
                          <label className="text-[8px] uppercase text-stone-400 dark:text-stone-500 block mb-1">Вес</label>
                          <input type="number" className="w-full bg-transparent border-b border-[#DED0C6] dark:border-[#5A4B42] outline-none font-bold" value={v.weight} onChange={e => {
                            const newV = [...formData.variants];
                            newV[i].weight = parseInt(e.target.value);
                            setFormData({...formData, variants: newV});
                          }} />
                        </div>
                        <div className="flex-1">
                          <label className="text-[8px] uppercase text-stone-400 dark:text-stone-500 block mb-1">Цена</label>
                          <input type="number" className="w-full bg-transparent border-b border-[#DED0C6] dark:border-[#5A4B42] outline-none font-bold text-[#C06334]" value={v.price} onChange={e => {
                            const newV = [...formData.variants];
                            newV[i].price = parseInt(e.target.value);
                            setFormData({...formData, variants: newV});
                          }} />
                        </div>
                        <div className="flex-1">
                          <label className="text-[8px] uppercase text-stone-400 dark:text-stone-500 block mb-1">Старая цена</label>
                          <input type="number" className="w-full bg-transparent border-b border-[#DED0C6] dark:border-[#5A4B42] outline-none font-bold text-stone-400 line-through" value={v.oldPrice || ""} onChange={e => {
                            const newV = [...formData.variants];
                            newV[i].oldPrice = parseInt(e.target.value) || 0;
                            setFormData({...formData, variants: newV});
                          }} />
                        </div>
                        <div className="w-20">
                          <label className="text-[8px] uppercase text-stone-400 dark:text-stone-500 block mb-1">Запас</label>
                          <input type="number" className="w-full bg-transparent border-b border-[#DED0C6] dark:border-[#5A4B42] outline-none font-bold text-stone-400 dark:text-stone-500" value={v.stock} onChange={e => {
                            const newV = [...formData.variants];
                            newV[i].stock = parseInt(e.target.value);
                            setFormData({...formData, variants: newV});
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-white dark:bg-[#362A25] text-[#D4AF37] border-2 border-[#EADFD8] dark:border-[#4A3B32] hover:border-[#D4AF37] dark:hover:border-[#D4AF37] py-8 rounded-[32px] font-black uppercase text-[12px] tracking-[0.4em] transition-all shadow-2xl shadow-black/5 hover:shadow-[#D4AF37]/20 active:scale-95"
                >
                  {editId ? 'Сохранить изменения' : 'Внести в реестр'}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
