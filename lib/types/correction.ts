// Types pour le système de correction

export type CorrectionCategory = 
  | 'orthographe' 
  | 'grammaire' 
  | 'conjugaison' 
  | 'ponctuation' 
  | 'accord'
  | 'typographie';

export type ConfidenceLevel = 'high' | 'medium';

export type CorrectionMode = 'typo-only' | 'standard' | 'strict';

export interface Change {
  id: string;
  type: CorrectionCategory;
  original: string;
  corrected: string;
  position: {
    start: number;
    end: number;
  };
  rule: string;
  explanation: string;
  confidence: ConfidenceLevel;
}

export interface Rule {
  id: string;
  category: CorrectionCategory;
  title: string;
  shortDescription: string;
}

export interface CorrectionStats {
  total_changes: number;
  by_category: Partial<Record<CorrectionCategory, number>>;
  processing_time_ms: number;
}

export interface CorrectionResponse {
  corrected_text: string;
  changes: Change[];
  rules_applied: Rule[];
  stats: CorrectionStats;
  remaining_today: number;
  limit_today: number;
}

export interface CorrectionRequest {
  text: string;
  mode?: CorrectionMode;
}
