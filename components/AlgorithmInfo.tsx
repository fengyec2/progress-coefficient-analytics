
import React from 'react';

const AlgorithmInfo: React.FC = () => (
  <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 flex flex-col justify-center animate-in fade-in slide-in-from-left-4 duration-300">
    <h2 className="text-slate-900 font-bold mb-3 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      算法说明 (排名制)
    </h2>
    <div className="bg-white/60 p-4 rounded-xl font-mono text-center text-slate-800 mb-4 shadow-inner">
      z = 2 * (y - x) / (x + y)
    </div>
    <p className="text-sm text-slate-600 leading-relaxed">
      • <span className="font-bold italic">y</span>: 前次排名, <span className="font-bold italic">x</span>: 后次排名<br/>
      • <span className="text-emerald-700 font-bold">z &gt; 0</span>：表示<span className="underline decoration-emerald-500/30">进步</span> (排名数字变小)<br/>
      • <span className="text-rose-700 font-bold">z &lt; 0</span>：表示<span className="underline decoration-rose-500/30">退步</span> (排名数值变大)<br/>
      • <span className="font-bold">提示：</span>数值越大代表进步越明显。
    </p>
  </div>
);

export default AlgorithmInfo;
