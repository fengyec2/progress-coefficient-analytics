
import React from 'react';

interface HeaderProps {
  onAddGroup: () => void;
  onClearAll: () => void;
  onExportExcel: () => void;
  onExportJson: () => void;
  onImport: () => void;
  onToggleAlgorithm: () => void;
  showAlgorithm: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onAddGroup, onClearAll, onExportExcel, onExportJson, onImport, onToggleAlgorithm, showAlgorithm
}) => (
  <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-900 hidden md:block">进退步系数分析系统</h1>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center border-r border-slate-200 pr-2 sm:pr-4 gap-1">
          <button onClick={onToggleAlgorithm} className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold ${showAlgorithm ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="hidden sm:inline">算法说明</span>
          </button>
          <button onClick={onExportExcel} className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a2 2 0 00-2-2H5a2 2 0 00-2 2v2m0 0h2a2 2 0 002-2v-2m-6 0h2a2 2 0 002-2v-2M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m0 10h2a2 2 0 002-2v-2m-6 0h2a2 2 0 002-2v-2m7 5v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2m0-10V5a2 2 0 012-2h2a2 2 0 012 2v2" /></svg>
            <span className="hidden sm:inline">导出EXCEL</span>
          </button>
          <button onClick={onExportJson} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <span className="hidden sm:inline">JSON</span>
          </button>
          <button onClick={onImport} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          </button>
        </div>
        
        <button onClick={onClearAll} className="text-xs sm:text-sm font-medium text-slate-500 hover:text-rose-600 px-2 sm:px-3 py-1.5 transition-colors">重置</button>
        <button onClick={onAddGroup} className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md shadow-blue-200 transition-all active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H4a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
          <span>添加分组</span>
        </button>
      </div>
    </div>
  </header>
);

export default Header;
