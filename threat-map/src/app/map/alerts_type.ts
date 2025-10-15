export interface AlertRecord {
  ipAddress: string;
  abuseConfidenceScore: number;
  lastReportedAt: string;
}

export interface AlertResponse {
  meta: {
    generatedAt: string;
  };
  data: AlertRecord[];
}
