
import React from 'react';
import { RecordData } from '../types';
import { getCoefficientColor, formatNum } from '../utils';

interface RecordItemProps {
  record: RecordData;
  onUpdate: (id: string, updates: Partial<RecordData>) => void;
  onDelete: (id: string) => void;
}

const RecordItem: React.FC<RecordItemProps> = ({ record, onUpdate, onDelete }) => {
  return (
    <div className="grid grid-cols-12 gap-2 items-center p-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-blue-300 transition-colors mb-2">
      <div className="col-span-3">
        <input
          type="text"
          placeholder="姓名"
          value={record.name}
          onChange={(e) => onUpdate(record.id, { name: e.target.value })}
          className="w-full px-2 py-1.5 text-sm border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>
      <div className="col-span-3">
        <input
          type="number"
          placeholder="前次排名"
          value={record.oldRank}
          onChange={(e) => onUpdate(record.id, { oldRank: e.target.value === '' ? '' : Number(e.target.value) })}
          className="w-full px-2 py-1.5 text-sm border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none font-mono"
        />
      </div>
      <div className="col-span-3">
        <input
          type="number"
          placeholder="后次排名"
          value={record.newRank}
          onChange={(e) => onUpdate(record.id, { newRank: e.target.value === '' ? '' : Number(e.target.value) })}
          className="w-full px-2 py-1.5 text-sm border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none font-mono"
        />
      </div>
      <div className={`col-span-2 text-right font-mono font-bold text-xs sm:text-sm ${getCoefficientColor(record.coefficient)}`}>
        {record.coefficient !== null ? formatNum(record.coefficient) : '--'}
      </div>
      <div className="col-span-1 text-right">
        <button
          onClick={() => onDelete(record.id)}
          className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
          title="删除记录"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default RecordItem;
