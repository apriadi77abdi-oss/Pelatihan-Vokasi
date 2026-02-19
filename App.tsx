
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, PlusCircle, BarChart3, Settings } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TrainingForm from './components/TrainingForm';
import { TrainingData } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'input'>('dashboard');
  const [data, setData] = useState<TrainingData[]>([]);
  const [loading, setLoading] = useState(true);

  // Load mock data or real data from localStorage for demo purposes
  // In a real scenario, this would fetch from Google Apps Script Web App
  useEffect(() => {
    const savedData = localStorage.getItem('training_records');
    if (savedData) {
      setData(JSON.parse(savedData));
    }
    setLoading(false);
  }, []);

  const handleAddData = (newData: TrainingData) => {
    const updatedData = [...data, newData];
    setData(updatedData);
    localStorage.setItem('training_records', JSON.stringify(updatedData));
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-64 bg-slate-900 text-white flex flex-col sticky top-0 md:h-screen z-10">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="text-blue-400" />
            Vokasi Monitoring
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Dashboard Pimpinan</p>
        </div>
        
        <div className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab('input')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'input' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <PlusCircle size={20} />
            <span className="font-medium">Input Data</span>
          </button>
        </div>

        <div className="p-4 border-t border-slate-800 text-slate-500 text-xs">
          <div className="flex items-center gap-2 px-4 py-2 opacity-50">
            <Settings size={14} />
            <span>Versi 1.0.4</span>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : activeTab === 'dashboard' ? (
            <Dashboard data={data} />
          ) : (
            <TrainingForm onSubmit={handleAddData} onCancel={() => setActiveTab('dashboard')} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
