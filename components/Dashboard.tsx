
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { TrendingUp, Users, CheckCircle, Target, Award, BookOpen } from 'lucide-react';
import { TrainingData, Batch, TARGET_TOTAL, Kejuruan } from '../types';
import GeminiInsight from './GeminiInsight';

interface DashboardProps {
  data: TrainingData[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const totalLulus = data.reduce((sum, item) => sum + Number(item.pesertaLulus), 0);
  const totalTerdaftar = data.reduce((sum, item) => sum + Number(item.pesertaSiapKerja), 0);
  const percentCapaian = (totalLulus / TARGET_TOTAL) * 100;

  // Group by Batch
  const batchData = [Batch.BATCH_1, Batch.BATCH_2, Batch.BATCH_3].map(batch => {
    const batchItems = data.filter(item => item.batch === batch);
    const graduates = batchItems.reduce((sum, item) => sum + Number(item.pesertaLulus), 0);
    const targetPerBatch = TARGET_TOTAL / 3; // Estimasi target merata per batch
    return {
      name: batch,
      Lulus: graduates,
      Target: Math.round(targetPerBatch),
      Persentase: graduates > 0 ? ((graduates / targetPerBatch) * 100).toFixed(1) : 0
    };
  });

  // Group by Kejuruan
  const kejuruanData = Object.values(Kejuruan).map(k => {
    const graduates = data
      .filter(item => item.kejuruan === k)
      .reduce((sum, item) => sum + Number(item.pesertaLulus), 0);
    return { name: k, Lulus: graduates };
  }).sort((a, b) => b.Lulus - a.Lulus);

  // Group by Jenis Pelatihan
  const typeData = [
    { name: 'PBK', value: data.filter(i => i.jenisPelatihan === 'PBK').reduce((sum, i) => sum + Number(i.pesertaLulus), 0) },
    { name: 'PBL', value: data.filter(i => i.jenisPelatihan === 'PBL').reduce((sum, i) => sum + Number(i.pesertaLulus), 0) },
    { name: 'Greenjob', value: data.filter(i => i.jenisPelatihan === 'Greenjob').reduce((sum, i) => sum + Number(i.pesertaLulus), 0) },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Summary */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Capaian Pelatihan Vokasi</h2>
          <p className="text-slate-500">Laporan akumulatif seluruh batch dan kejuruan</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-lg flex items-center gap-3">
          <Target className="text-blue-600" />
          <div>
            <span className="block text-xs text-blue-600 font-bold uppercase">Target Strategis</span>
            <span className="text-xl font-bold text-blue-900">{TARGET_TOTAL} <small className="text-sm font-normal">Peserta</small></span>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          icon={<Users className="text-blue-600" />} 
          label="Total Terdaftar" 
          value={totalTerdaftar.toLocaleString()} 
          subValue="Siap Kerja"
          color="bg-blue-50"
        />
        <KpiCard 
          icon={<CheckCircle className="text-emerald-600" />} 
          label="Total Lulus" 
          value={totalLulus.toLocaleString()} 
          subValue="Telah Sertifikasi"
          color="bg-emerald-50"
        />
        <KpiCard 
          icon={<TrendingUp className="text-amber-600" />} 
          label="Persentase Capaian" 
          value={`${percentCapaian.toFixed(1)}%`} 
          subValue="Dari Target 1712"
          color="bg-amber-50"
          progress={percentCapaian}
        />
        <KpiCard 
          icon={<Award className="text-purple-600" />} 
          label="Program Berjalan" 
          value={data.length} 
          subValue="Kelas Aktif/Selesai"
          color="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Bar Chart - Performance by Batch */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <BookOpen size={20} className="text-blue-600" />
            Capaian per Batch
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={batchData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="Lulus" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Capaian Lulus" />
                <Bar dataKey="Target" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Estimasi Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart - Pelatihan Type */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6">Distribusi Jenis Pelatihan</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {typeData.map((d, i) => (
              <div key={d.name} className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></span>
                  {d.name}
                </span>
                <span className="font-semibold">{((d.value / totalLulus) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Kejuruan Ranking */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6">Peringkat Capaian Kejuruan</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kejuruanData} layout="vertical" margin={{ left: 50 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="Lulus" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6">Analisis Strategis (AI Insights)</h3>
          <GeminiInsight data={data} totalLulus={totalLulus} targetTotal={TARGET_TOTAL} />
        </div>
      </div>

      {/* Raw Data Table (Summary for Leadership) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Riwayat Pelatihan Terkini</h3>
          <span className="text-sm text-slate-500">{data.length} Entri</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Waktu Input</th>
                <th className="px-6 py-4 font-semibold">Batch</th>
                <th className="px-6 py-4 font-semibold">Kejuruan</th>
                <th className="px-6 py-4 font-semibold">Nama Program</th>
                <th className="px-6 py-4 font-semibold text-right">Lulus</th>
                <th className="px-6 py-4 font-semibold">PIC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400 italic">Belum ada data pelatihan terinput.</td>
                </tr>
              ) : (
                [...data].reverse().slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{new Date(item.timestamp).toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                        item.batch === Batch.BATCH_1 ? 'bg-blue-100 text-blue-700' : 
                        item.batch === Batch.BATCH_2 ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {item.batch}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">{item.kejuruan}</td>
                    <td className="px-6 py-4 text-slate-600 truncate max-w-[200px]">{item.namaProgram}</td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">{item.pesertaLulus}</td>
                    <td className="px-6 py-4 text-slate-500">{item.pic}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue: string;
  color: string;
  progress?: number;
}

const KpiCard: React.FC<KpiCardProps> = ({ icon, label, value, subValue, color, progress }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
      {progress !== undefined && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${progress >= 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          {progress.toFixed(0)}%
        </span>
      )}
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <h4 className="text-2xl font-bold text-slate-900 mt-1">{value}</h4>
      <p className="text-slate-400 text-xs mt-1 uppercase tracking-tight">{subValue}</p>
    </div>
    {progress !== undefined && (
      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
        <div 
          className={`h-full rounded-full ${progress >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
    )}
  </div>
);

export default Dashboard;
