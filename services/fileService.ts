
import * as XLSX from 'xlsx';
import { GroupData, RecordData } from '../types';

export const exportToJson = (data: GroupData[]) => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  const exportFileDefaultName = `progress-analysis-${new Date().toISOString().split('T')[0]}.json`;
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const exportToExcel = (processedGroups: GroupData[], winnerId: string | null) => {
  const wb = XLSX.utils.book_new();
  
  // Detailed sheet
  const consolidatedData: any[] = [];
  processedGroups.forEach(group => {
    group.records.forEach(rec => {
      consolidatedData.push({
        '分组名称': group.name,
        '姓名': rec.name,
        '前次排名': rec.oldRank,
        '后次排名': rec.newRank,
        '进退步系数': rec.coefficient !== null ? parseFloat(rec.coefficient.toFixed(4)) : '--'
      });
    });
  });
  const wsDetails = XLSX.utils.json_to_sheet(consolidatedData);
  XLSX.utils.book_append_sheet(wb, wsDetails, "全员明细");

  // Summary sheet
  const summaryData = processedGroups.map(group => ({
    '分组名称': group.name,
    '人数': group.records.filter(r => r.oldRank !== '' && r.newRank !== '').length,
    '总进退步系数': parseFloat(group.totalCoefficient.toFixed(4)),
    '平均进退步系数': parseFloat(group.averageCoefficient.toFixed(4)),
    '是否优胜组': group.id === winnerId ? '是' : '否'
  }));
  const wsSummary = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, "各组汇总");

  // Individual sheets
  processedGroups.forEach(group => {
    const groupSpecificData = group.records.map(rec => ({
      '姓名': rec.name,
      '前次排名': rec.oldRank,
      '后次排名': rec.newRank,
      '进退步系数': rec.coefficient !== null ? parseFloat(rec.coefficient.toFixed(4)) : '--'
    }));
    const wsGroup = XLSX.utils.json_to_sheet(groupSpecificData);
    XLSX.utils.book_append_sheet(wb, wsGroup, group.name.substring(0, 31));
  });

  XLSX.writeFile(wb, `全量进退步分析报告-${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const processImportFile = (file: File): Promise<GroupData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.json')) {
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          resolve(Array.isArray(imported) ? imported : []);
        } catch (err) { reject(err); }
      };
      reader.readAsText(file);
    } else {
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const importedGroups: GroupData[] = [];
          
          // Legacy complex logic from original app...
          workbook.SheetNames.forEach((sheetName, index) => {
            if (sheetName === "全员明细" || sheetName === "各组汇总") return;
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];
            const records: RecordData[] = jsonData.map((row, i) => ({
              id: `rec-${Date.now()}-${index}-${i}`,
              name: String(row['姓名'] || row['Name'] || ''),
              oldRank: (row['前次排名'] || row['Previous Rank']) !== undefined ? Number(row['前次排名'] || row['Previous Rank']) : '',
              newRank: (row['后次排名'] || row['Current Rank']) !== undefined ? Number(row['后次排名'] || row['Current Rank']) : '',
              coefficient: null
            }));
            if (records.length > 0) {
              importedGroups.push({
                id: `group-${Date.now()}-${index}`,
                name: sheetName,
                records,
                totalCoefficient: 0,
                averageCoefficient: 0
              });
            }
          });
          resolve(importedGroups);
        } catch (err) { reject(err); }
      };
      reader.readAsArrayBuffer(file);
    }
  });
};
