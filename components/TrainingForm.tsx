
import React, { useState } from 'react';
import { Save, X, Calendar, User, Book, Hash, Clock } from 'lucide-react';
import { Batch, Kejuruan, JenisPelatihan, TrainingData } from '../types';

interface TrainingFormProps {
  onSubmit: (data: TrainingData) => void;
  onCancel: () => void;
}

const TrainingForm: React.FC<TrainingFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<TrainingData>>({
    batch: Batch.BATCH_1,
    kejuruan: Kejuruan.OTOMOTIF,
    jenisPelatihan: JenisPelatihan.PBK,
    jumlahJP: 0,
    pesertaSiapKerja: 0,
    pesertaLulus: 0,
    tanggalMulai: new Date().toISOString().split('T')[0],
    tanggalSelesai: new Date().toISOString().split('T')[0],
    namaProgram: '',
    pic: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate
    if (!formData.namaProgram || !formData.pic) {
      alert('Harap isi Nama Program dan PIC');
      setIsSubmitting(false);
      return;
    }

    const finalData: TrainingData = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      ...(formData as Required<TrainingData>)
    };

    // Simulate Apps Script delay
    setTimeout(() => {
      onSubmit(finalData);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Input Data Pelatihan Baru</h2>
          <p className="text-slate-400 text-sm">Lengkapi formulir untuk menambah catatan batch</p>
        </div>
        <button 
          onClick={onCancel}
          className="p-2 hover:bg-slate-800 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Section: Identitas Pelatihan */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Book size={14} /> Informasi Program
            </h3>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Nama Program Pelatihan</label>
              <input
                required
                type="text"
                name="namaProgram"
                value={formData.namaProgram}
                onChange={handleChange}
                placeholder="Contoh: Pemeliharaan Kendaraan Ringan Sistem Injeksi"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Batch</label>
                <select 
                  name="batch" 
                  value={formData.batch} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none"
                >
                  {Object.values(Batch).map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Jenis</label>
                <select 
                  name="jenisPelatihan" 
                  value={formData.jenisPelatihan} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none"
                >
                  {Object.values(JenisPelatihan).map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Kejuruan</label>
              <select 
                name="kejuruan" 
                value={formData.kejuruan} 
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none"
              >
                {Object.values(Kejuruan).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Penanggung Jawab (PIC)</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400" size={16} />
                <input
                  required
                  type="text"
                  name="pic"
                  value={formData.pic}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none"
                  placeholder="Nama Lengkap PIC"
                />
              </div>
            </div>
          </div>

          {/* Section: Metrik & Waktu */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Hash size={14} /> Metrik & Penjadwalan
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Jumlah JP</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type="number"
                    name="jumlahJP"
                    value={formData.jumlahJP}
                    onChange={handleNumberChange}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Terdaftar (Siap Kerja)</label>
                <input
                  type="number"
                  name="pesertaSiapKerja"
                  value={formData.pesertaSiapKerja}
                  onChange={handleNumberChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Jumlah Peserta Lulus</label>
              <input
                type="number"
                name="pesertaLulus"
                value={formData.pesertaLulus}
                onChange={handleNumberChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none text-emerald-600 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Tanggal Mulai</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type="date"
                    name="tanggalMulai"
                    value={formData.tanggalMulai}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Tanggal Selesai</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type="date"
                    name="tanggalSelesai"
                    value={formData.tanggalSelesai}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 flex gap-4 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-b-transparent rounded-full" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save size={18} />
                Simpan Data
              </>
            )}
          </button>
        </div>
      </form>
      
      <div className="bg-amber-50 p-4 border-t border-amber-100 text-xs text-amber-700">
        <strong>Catatan:</strong> Data akan disinkronisasi ke Google Sheets secara otomatis setelah disimpan. Pastikan koneksi internet stabil.
      </div>
    </div>
  );
};

export default TrainingForm;
