
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GroupData, RecordData } from './types';
import { calculateZ } from './utils';
import GroupCard from './components/GroupCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import * as XLSX from 'xlsx';

const INITIAL_GROUPS: GroupData[] = [
  {
    id: 'group-1',
    name: '第一组',
    records: [
      { id: 'rec-1', name: '张三', oldRank: 100, newRank: 80, coefficient: null },
      { id: 'rec-2', name: '李四', oldRank: 50, newRank: 55, coefficient: null },
    ],
    totalCoefficient: 0,
    averageCoefficient: 0,
  }
];

const App: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [groups, setGroups] = useState<GroupData[]>(() => {
    const saved = localStorage.getItem('progress-analytics-data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_GROUPS;
      }
    }
    return INITIAL_GROUPS;
  });

  const processedGroups = useMemo(() => {
    return groups.map(group => {
      let total = 0;
      let count = 0;
      const records = group.records.map(rec => {
        let z: number | null = null;
        if (rec.oldRank !== '' && rec.newRank !== '') {
          z = calculateZ(Number(rec.newRank), Number(rec.oldRank));
          total += z;
          count++;
        }
        return { ...rec, coefficient: z };
      });

      return {
        ...group,
        records,
        totalCoefficient: total,
        averageCoefficient: count > 0 ? total / count : 0,
      };
    });
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('progress-analytics-data', JSON.stringify(processedGroups));
  }, [processedGroups]);

  const winnerId = useMemo(() => {
    const validGroups = processedGroups.filter(g => g.records.some(r => r.coefficient !== null));
    if (validGroups.length === 0) return null;
    return validGroups.reduce((prev, curr) => 
      curr.averageCoefficient > prev.averageCoefficient ? curr : prev
    , validGroups[0]).id;
  }, [processedGroups]);

  const addGroup = () => {
    const newGroup: GroupData = {
      id: `group-${Date.now()}`,
      name: `新分组 ${processedGroups.length + 1}`,
      records: [{ id: `rec-${Date.now()}`, name: '', oldRank: '', newRank: '', coefficient: null }],
      totalCoefficient: 0,
      averageCoefficient: 0,
    };
    setGroups(prev => [...prev, newGroup]);
  };

  const deleteGroup = (id: string) => {
    if (window.confirm('确定要删除这个分组吗？')) {
      setGroups(prev => prev.filter(g => g.id !== id));
    }
  };

  const updateGroupName = (id: string, name: string) => {
    setGroups(prev => prev.map(g => g.id === id ? { ...g, name } : g));
  };

  const addRecord = (groupId: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          records: [
            ...g.records,
            { id: `rec-${Date.now()}`, name: '', oldRank: '', newRank: '', coefficient: null }
          ]
        };
      }
      return g;
    }));
  };

  const updateRecord = (groupId: string, recordId: string, updates: Partial<RecordData>) => {
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          records: g.records.map(r => r.id === recordId ? { ...r, ...updates } : r)
        };
      }
      return g;
    }));
  };

  const deleteRecord = (groupId: string, recordId: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          records: g.records.filter(r => r.id !== recordId)
        };
      }
      return g;
    }));
  };

  const clearAll = () => {
    if (window.confirm('确定要清除所有数据吗？此操作不可撤销。')) {
      setGroups(INITIAL_GROUPS);
    }
  };

  const exportToJson = () => {
    const dataStr = JSON.stringify(processedGroups, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `progress-analysis-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    
    processedGroups.forEach(group => {
      const data = group.records.map(rec => ({
        '姓名': rec.name,
        '前次排名': rec.oldRank,
        '后次排名': rec.newRank,
        '进退步系数': rec.coefficient !== null ? rec.coefficient.toFixed(4) : '--'
      }));
      
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, group.name.substring(0, 31)); // Sheet name max length is 31
    });

    XLSX.writeFile(wb, `进退步分析报告-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const reader = new FileReader();

    if (fileName.endsWith('.json')) {
      reader.onload = (e) => {
        try {
          const result = e.target?.result as string;
          const importedGroups = JSON.parse(result);
          if (Array.isArray(importedGroups)) {
            setGroups(importedGroups);
            alert('JSON数据导入成功！');
          } else {
            throw new Error('无效的JSON格式');
          }
        } catch (err) {
          alert('导入失败：请确保JSON文件格式正确。');
        }
      };
      reader.readAsText(file);
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv')) {
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const importedGroups: GroupData[] = [];

          workbook.SheetNames.forEach((sheetName, index) => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];
            
            const records: RecordData[] = jsonData.map((row, i) => ({
              id: `rec-${Date.now()}-${index}-${i}`,
              name: String(row['姓名'] || row['Name'] || ''),
              oldRank: (row['前次排名'] || row['Previous Rank'] || row['Old Rank']) !== undefined ? Number(row['前次排名'] || row['Previous Rank'] || row['Old Rank']) : '',
              newRank: (row['后次排名'] || row['Current Rank'] || row['New Rank']) !== undefined ? Number(row['后次排名'] || row['Current Rank'] || row['New Rank']) : '',
              coefficient: null
            }));

            importedGroups.push({
              id: `group-${Date.now()}-${index}`,
              name: sheetName,
              records: records.length > 0 ? records : [{ id: `rec-${Date.now()}-empty`, name: '', oldRank: '', newRank: '', coefficient: null }],
              totalCoefficient: 0,
              averageCoefficient: 0
            });
          });

          if (importedGroups.length > 0) {
            setGroups(importedGroups);
            alert('Excel数据导入成功！');
          }
        } catch (err) {
          console.error(err);
          alert('Excel导入失败，请检查文件格式是否包含“姓名”、“前次排名”、“后次排名”列。');
        }
      };
      reader.readAsArrayBuffer(file);
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const chartData = useMemo(() => {
    return processedGroups.map(g => ({
      name: g.name,
      avg: parseFloat(g.averageCoefficient.toFixed(4)),
      isWinner: g.id === winnerId
    }));
  }, [processedGroups, winnerId]);

  return (
    <div className="min-h-screen pb-20">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".json,.xlsx,.xls,.csv" 
        onChange={importData} 
      />

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
              <button
                onClick={exportToExcel}
                className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                title="导出为Excel"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a2 2 0 00-2-2H5a2 2 0 00-2 2v2m0 0h2a2 2 0 002-2v-2m-6 0h2a2 2 0 002-2v-2M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m0 10h2a2 2 0 002-2v-2m-6 0h2a2 2 0 002-2v-2m7 5v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2m0-10V5a2 2 0 012-2h2a2 2 0 012 2v2" />
                </svg>
                <span className="hidden sm:inline">EXCEL</span>
              </button>
              <button
                onClick={exportToJson}
                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                title="导出为JSON"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="hidden sm:inline">JSON</span>
              </button>
              <button
                onClick={handleImportClick}
                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="导入数据 (支持 .json, .xlsx, .csv)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </button>
            </div>
            
            <button
              onClick={clearAll}
              className="text-xs sm:text-sm font-medium text-slate-500 hover:text-rose-600 px-2 sm:px-3 py-1.5 transition-colors"
            >
              重置
            </button>
            <button
              onClick={addGroup}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md shadow-blue-200 transition-all active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H4a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>添加分组</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 flex flex-col justify-center">
            <h2 className="text-slate-900 font-bold mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              算法说明 (排名制)
            </h2>
            <div className="bg-white/60 p-4 rounded-xl font-mono text-center text-slate-800 mb-4 shadow-inner">
              z = 2 * (y - x) / (x + y)
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              • <span className="font-bold italic">y</span>: 前次排名, <span className="font-bold italic">x</span>: 后次排名<br/>
              • <span className="text-emerald-700 font-bold">z &gt; 0</span>：表示<span className="underline decoration-emerald-500/30">进步</span> (排名数值变小)<br/>
              • <span className="text-rose-700 font-bold">z &lt; 0</span>：表示<span className="underline decoration-rose-500/30">退步</span> (排名数值变大)<br/>
              • <span className="font-bold">支持导入：</span>Excel、CSV、JSON格式文件。
            </p>
          </div>

          <div className="lg:col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white shadow-xl shadow-slate-200">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center h-full">
              <div className="flex-1">
                <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">实时优胜组排行榜</h2>
                {winnerId ? (
                  <div>
                    <div className="text-3xl font-black text-emerald-400 flex items-center gap-3">
                      {processedGroups.find(g => g.id === winnerId)?.name}
                      <span className="text-sm font-normal text-slate-400">目前领先</span>
                    </div>
                    <p className="text-slate-300 mt-2 text-sm">
                      该组凭借最高平均系数 
                      <span className="font-mono font-bold text-emerald-400 mx-1">
                        {processedGroups.find(g => g.id === winnerId)?.averageCoefficient.toFixed(4)}
                      </span> 
                      暂居榜首。
                    </p>
                  </div>
                ) : (
                  <div className="text-slate-500 italic">等待数据输入...</div>
                )}
              </div>
              <div className="w-full md:w-64 h-32 md:h-full min-h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} hide />
                    <Tooltip 
                      cursor={{fill: '#1e293b'}}
                      contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff'}}
                    />
                    <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.isWinner ? '#10b981' : '#ef4444'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 items-start">
          {processedGroups.map(group => (
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="font-bold text-slate-500 group-hover:text-blue-600 transition-colors">添加新的对比组</span>
          </button>
        </div>
      </main>

      <footer className="text-center py-10 text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} 进退步系数分析工具 • 现已支持 Excel 导入导出</p>
      </footer>
    </div>
  );
};

export default App;
