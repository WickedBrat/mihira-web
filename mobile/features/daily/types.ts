export interface DailyLesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  quote: string;
  source: string;
}

export interface PastInsight {
  id: string;
  title: string;
  date: string;
  readTime: string;
  iconName: 'history_edu' | 'self_improvement';
}
