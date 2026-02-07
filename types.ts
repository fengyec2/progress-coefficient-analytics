
export interface RecordData {
  id: string;
  name: string;
  oldRank: number | '';
  newRank: number | '';
  coefficient: number | null;
}

export interface GroupData {
  id: string;
  name: string;
  records: RecordData[];
  totalCoefficient: number;
  averageCoefficient: number;
}

export interface SummaryStats {
  winnerGroupId: string | null;
  overallAverage: number;
}
