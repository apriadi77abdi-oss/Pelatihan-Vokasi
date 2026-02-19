
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { TrainingData } from '../types';
import { BrainCircuit, Sparkles, RefreshCw } from 'lucide-react';

interface GeminiInsightProps {
  data: TrainingData[];
  totalLulus: number;
  targetTotal: number;
}

const GeminiInsight: React.FC<GeminiInsightProps> = ({ data, totalLulus, targetTotal }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateInsight = async () => {
    if (data.length === 0) {
      setInsight("Belum ada data pelatihan yang tersedia untuk dianalisis.");
      return;
    }

    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Sebagai asisten analis data untuk pimpinan Balai Latihan Kerja.
        Data saat ini:
        - Total Peserta Lulus: ${totalLulus}
        - Target Tahunan: ${targetTotal}
        - Persentase Capaian: ${((totalLulus / targetTotal) * 100).toFixed(2)}%
        - Jumlah Program Berjalan: ${data.length}
        - Detail per Kejuruan: ${JSON.stringify(data.map(i => ({ kejuruan: i.kejuruan, lulus: i.pesertaLulus })))}

        Berikan ringkasan eksekutif dalam 3 poin singkat:
        1. Evaluasi kecepatan capaian target.
        2. Identifikasi kejuruan yang paling produktif.
        3. Rekomendasi strategis untuk pimpinan agar target 1712 orang tercapai tepat waktu.
        Gunakan bahasa Indonesia yang profesional dan lugas.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setInsight(response.text || "Gagal menghasilkan analisis.");
    } catch (error) {
      console.error(error);
      setInsight("Gagal memuat analisis AI. Pastikan konfigurasi API sudah benar.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.length]);

  return (
    <div className="bg-slate-900 text-white rounded-xl p-6 relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <BrainCircuit size={100} />
      </div>
      
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="text-amber-400" size={20} />
          <h4 className="font-bold text-slate-200">Rangkuman Cerdas Gemini</h4>
        </div>
        <button 
          onClick={generateInsight}
          disabled={loading}
          className="p-1 hover:bg-slate-800 rounded transition-colors disabled:opacity-50"
          title="Refresh Insight"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="relative z-10">
        {loading ? (
          <div className="space-y-4">
            <div className="h-4 bg-slate-800 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-slate-800 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-slate-800 rounded animate-pulse w-5/6"></div>
          </div>
        ) : (
          <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {insight}
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800 text-[10px] text-slate-500 italic">
        Analisis dihasilkan otomatis berdasarkan data real-time menggunakan teknologi Gemini AI.
      </div>
    </div>
  );
};

export default GeminiInsight;
