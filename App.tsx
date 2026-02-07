
import React, { useState, useRef } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AlgorithmInfo from './components/AlgorithmInfo';
import GroupCard from './components/GroupCard';
import { useGroups } from './hooks/useGroups';
import { exportToExcel, exportToJson, processImportFile } from './services/fileService';

const App: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAlgorithm, setShowAlgorithm] = useState(false);
  const {
    groups,
    winnerId,
    chartData,
    addGroup,
    deleteGroup,
    updateGroupName,
    addRecord,
    updateRecord,
    deleteRecord,
    clearAll,
    importAll
  } = useGroups();

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imported = await processImportFile(file);
        if (imported.length > 0) {
          importAll(imported);
          alert('数据导入成功！');
        } else {
          alert('未发现有效数据。');
        }
      } catch (err) {
        alert('导入失败，请检查文件格式。');
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      <input type="file" ref={fileInputRef} className="hidden" accept=".json,.xlsx,.xls,.csv" onChange={handleImport} />

      <Header 
        onAddGroup={addGroup}
        onClearAll={clearAll}
        onExportExcel={() => exportToExcel(groups, winnerId)}
        onExportJson={() => exportToJson(groups)}
        onImport={() => fileInputRef.current?.click()}
        onToggleAlgorithm={() => setShowAlgorithm(!showAlgorithm)}
        showAlgorithm={showAlgorithm}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid grid-cols-1 ${showAlgorithm ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-8 mb-12`}>
          {showAlgorithm && <AlgorithmInfo />}
          <div className={`${showAlgorithm ? 'lg:col-span-2' : 'lg:col-span-2'}`}>
            <Dashboard winnerId={winnerId} groups={groups} chartData={chartData} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 items-start">
          {groups.map(group => (
            <GroupCard
              key={group.id}
              group={group}
              isWinner={group.id === winnerId}
              onUpdateGroupName={updateGroupName}
              onAddRecord={addRecord}
              onUpdateRecord={updateRecord}
              onDeleteRecord={deleteRecord}
              onDeleteGroup={deleteGroup}
            />
          ))}

          <button
            onClick={addGroup}
            className="group flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-white hover:border-blue-400 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300"
          >
            <div className="bg-white p-4 rounded-full shadow-md text-slate-400 group-hover:text-blue-500 group-hover:scale-110 transition-all mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </div>
            <span className="font-bold text-slate-500 group-hover:text-blue-600 transition-colors">添加新的对比组</span>
          </button>
        </div>
      </main>

      <footer className="text-center py-10 text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} 进退步系数分析工具 • 现已支持全量 Excel 导出汇总</p>
      </footer>
    </div>
  );
};

export default App;
