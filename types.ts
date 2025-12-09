
export enum AppPhase {
  INTRO = 'INTRO',
  STEP_7 = 'STEP_7',
  STEP_8 = 'STEP_8',
  COMPARE = 'COMPARE',
  SUCCESS = 'SUCCESS',
  ADVANCED_EXPLAIN = 'ADVANCED_EXPLAIN', // 侦探法 (Common Remainder)
  SURPLUS_METHOD = 'SURPLUS_METHOD', // 盈亏法 (Surplus/Deficit)
  GENERAL_FROG = 'GENERAL_FROG', // 青蛙跳跳法 (Iterative/General)
  VISUAL_CYCLE = 'VISUAL_CYCLE', // 积木周期法 (Visual Cycle/LCM)
  DIFF_SAME_METHOD = 'DIFF_SAME_METHOD', // 差同减差法 (Constant Difference)
  CRT_METHOD = 'CRT_METHOD', // 中国剩余定理 (Chinese Remainder Theorem / Han Xin)
  STACKING_METHOD = 'STACKING_METHOD', // 层层堆叠法 (Stacking Rows)
}

export interface OwlResponse {
  message: string;
  mood: 'happy' | 'thinking' | 'excited';
}

export interface AppleGroup {
  count: number;
}
