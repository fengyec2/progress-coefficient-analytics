
import React from 'react';
import { GroupData, RecordData } from '../types';
import RecordItem from './RecordItem';
import { formatNum, getCoefficientColor } from '../utils';

interface GroupCardProps {
  group: GroupData;
  isWinner: boolean;
  onUpdateGroupName: (id: string, name: string) => void;
  onAddRecord: (groupId: string) => void;
  onUpdateRecord: (groupId: string, recordId: string, updates: Partial<RecordData>) => void;
  onDeleteRecord: (groupId: string, recordId: string) => void;
  onDeleteGroup: (id: string) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({
  group,
  isWinner,
  onUpdateGroupName,
  onAddRecord,
  onUpdateRecord,
  onDeleteRecord,
  onDeleteGroup
}) => {
  return (
    <div className={`relative flex flex-col h-full bg-white rounded-xl shadow-md border-2 transition-all duration-300 ${isWinner ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-slate-100'}`}>
      {isWinner && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          优胜组
        </div>
      )}

      <div className="p-5 border-b border-slate-100 flex justify-between items-center">
        <input
          type="text"
          value={group.name}
          onChange={(e) => onUpdateGroupName(group.id, e.target.value)}
          className="text-lg font-bold text-slate-800 bg-transparent border-none focus:ring-0 outline-none w-full mr-4"
          placeholder="小组名称"
        />
        <button
          onClick={() => onDeleteGroup(group.id)}
          className="text-slate-400 hover:text-rose-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto max-h-[500px] bg-slate-50/50">
        <div className="grid grid-cols-12 gap-2 mb-2 px-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          <div className="col-span-3">姓名</div>
          <div className="col-span-3">前次排名</div>
          <div className="col-span-3">后次排名</div>
          <div className="col-span-2 text-right">系数 (z)</div>
          <div className="col-span-1"></div>
        </div>
        
        {group.records.map((record) => (
          <RecordItem
            key={record.id}
            record={record}
            onUpdate={(rid, updates) => onUpdateRecord(group.id, rid, updates)}
            onDelete={(rid) => onDeleteRecord(group.id, rid)}
          />
        ))}

        <button
          onClick={() => onAddRecord(group.id)}
          className="w-full mt-2 py-3 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 hover:text-blue-500 hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          添加人员数据
        </button>
      </div>

      <div className="p-5 bg-slate-50 border-t border-slate-100 rounded-b-xl space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500">组系数总和:</span>
          <span className={`font-mono font-bold ${getCoefficientColor(group.totalCoefficient)}`}>
            {formatNum(group.totalCoefficient)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-600 font-medium">平均进退步系数:</span>
          <span className={`text-xl font-mono font-black ${getCoefficientColor(group.averageCoefficient)}`}>
            {formatNum(group.averageCoefficient)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
