
import { useState, useEffect, useMemo, useCallback } from 'react';
import { GroupData, RecordData } from '../types';
import { calculateZ } from '../utils';

const STORAGE_KEY = 'progress-analytics-data';

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

export const useGroups = () => {
  const [groups, setGroups] = useState<GroupData[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_GROUPS; }
    }
    return INITIAL_GROUPS;
  });

  // Calculate processed data including coefficients and averages
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

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(processedGroups));
  }, [processedGroups]);

  const winnerId = useMemo(() => {
    const validGroups = processedGroups.filter(g => g.records.some(r => r.coefficient !== null));
    if (validGroups.length === 0) return null;
    return validGroups.reduce((prev, curr) => 
      curr.averageCoefficient > prev.averageCoefficient ? curr : prev
    , validGroups[0]).id;
  }, [processedGroups]);

  const chartData = useMemo(() => {
    return processedGroups.map(g => ({
      name: g.name,
      avg: parseFloat(g.averageCoefficient.toFixed(4)),
      isWinner: g.id === winnerId
    }));
  }, [processedGroups, winnerId]);

  // Actions
  const addGroup = useCallback(() => {
    setGroups(prev => [...prev, {
      id: `group-${Date.now()}`,
      name: `新分组 ${prev.length + 1}`,
      records: [{ id: `rec-${Date.now()}`, name: '', oldRank: '', newRank: '', coefficient: null }],
      totalCoefficient: 0,
      averageCoefficient: 0,
    }]);
  }, []);

  const deleteGroup = useCallback((id: string) => {
    if (window.confirm('确定要删除这个分组吗？')) {
      setGroups(prev => prev.filter(g => g.id !== id));
    }
  }, []);

  const updateGroupName = useCallback((id: string, name: string) => {
    setGroups(prev => prev.map(g => g.id === id ? { ...g, name } : g));
  }, []);

  const addRecord = useCallback((groupId: string) => {
    setGroups(prev => prev.map(g => g.id === groupId ? {
      ...g,
      records: [...g.records, { id: `rec-${Date.now()}`, name: '', oldRank: '', newRank: '', coefficient: null }]
    } : g));
  }, []);

  const updateRecord = useCallback((groupId: string, recordId: string, updates: Partial<RecordData>) => {
    setGroups(prev => prev.map(g => g.id === groupId ? {
      ...g,
      records: g.records.map(r => r.id === recordId ? { ...r, ...updates } : r)
    } : g));
  }, []);

  const deleteRecord = useCallback((groupId: string, recordId: string) => {
    setGroups(prev => prev.map(g => g.id === groupId ? {
      ...g,
      records: g.records.filter(r => r.id !== recordId)
    } : g));
  }, []);

  const clearAll = useCallback(() => {
    if (window.confirm('确定要清除所有数据吗？此操作不可撤销。')) {
      setGroups(INITIAL_GROUPS);
    }
  }, []);

  const importAll = useCallback((importedGroups: GroupData[]) => {
    setGroups(importedGroups);
  }, []);

  return {
    groups: processedGroups,
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
  };
};
