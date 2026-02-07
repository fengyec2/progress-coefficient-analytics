
export const calculateZ = (newRank: number, oldRank: number): number => {
  if (newRank + oldRank === 0) return 0;
  // 修正逻辑：排名数字变小代表进步
  // 公式改为：z = 2 * (前次排名 - 后次排名) / (前次排名 + 后次排名)
  // y = oldRank, x = newRank
  // 如果前次100，后次80，则 100 - 80 = 20，结果为正（进步）
  return (2 * (oldRank - newRank)) / (oldRank + newRank);
};

export const formatNum = (num: number, decimals: number = 4): string => {
  return num.toFixed(decimals);
};

export const getCoefficientColor = (z: number | null): string => {
  if (z === null) return 'text-slate-400';
  if (z > 0) return 'text-emerald-600'; // 进步（系数为正）
  if (z < 0) return 'text-rose-600';    // 退步（系数为负）
  return 'text-slate-600';              // 持平
};
