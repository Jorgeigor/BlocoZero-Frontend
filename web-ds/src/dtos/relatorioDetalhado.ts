export interface RelatorioDetalhado {
  id: number;
  startDate: string; 
  endDate: string;
  status: 'PENDING' | 'VALIDATED' | 'REFUSED';
  

  id_work: number;
  id_user: number;
  id_stage: number;    
  id_substage: number; 
  
  weather: string;              
  completionPercentage: number; 
  notes: string;                
  photo: string | null;         
  
  work?: {
    name: string;
  };
}
