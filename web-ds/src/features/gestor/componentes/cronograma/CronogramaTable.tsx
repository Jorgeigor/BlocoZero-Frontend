import React, { useEffect, useState } from "react";
import { api } from "../../../../services/api";

interface SubtaskAPI {
  substageName: string;
  startDate: string;
  endDate?: string;
  duration?: number;
  progress?: number;
}

interface StageAPI {
  stageName: string;
  stageId: number;
  summaryStartDate?: string | null;
  summaryEndDate?: string | null;
  tasks: SubtaskAPI[];
}

interface CronogramaTableProps {
  id_work: number;
  filterStageId?: string; 
  onChangeStats?: (stats: { dentro: string; adiantadas: string; atrasadas: string }) => void;
}

export function CronogramaTable({ id_work, filterStageId, onChangeStats }: CronogramaTableProps) {
  const [stages, setStages] = useState<StageAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedStages, setExpandedStages] = useState<number[]>([]);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "-" : date.toLocaleDateString('pt-BR');
  };

  const getStageDates = (stage: StageAPI) => {
    if (stage.summaryStartDate && stage.summaryEndDate) {
        return { start: stage.summaryStartDate, end: stage.summaryEndDate };
    }
    if (!stage.tasks || stage.tasks.length === 0) {
        return { start: null, end: null };
    }
    let minDate = new Date(8640000000000000); 
    let maxDate = new Date(-8640000000000000); 
    let found = false;

    stage.tasks.forEach(task => {
        const st = new Date(task.startDate);
        const en = task.endDate ? new Date(task.endDate) : null;
        if (!isNaN(st.getTime())) {
            if (st < minDate) minDate = st;
            found = true;
        }
        if (en && !isNaN(en.getTime())) {
            if (en > maxDate) maxDate = en;
            found = true;
        }
    });

    if (!found) return { start: null, end: null };
    return { start: minDate.toISOString(), end: maxDate.toISOString() };
  };

  const getStageProgress = (tasks: SubtaskAPI[]) => {
      if (!tasks.length) return 0;
      
      let sum = 0;
      tasks.forEach(t => {
          let val = t.progress || 0;
          if (val > 0 && val <= 1) val = val * 100;
          sum += val;
      });
      
      return sum / tasks.length;
  };

  const toggleStage = (stageId: number) => {
    setExpandedStages(prev => 
      prev.includes(stageId) ? prev.filter(id => id !== stageId) : [...prev, stageId]
    );
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/physicalSchedule/list/${id_work}`);
        const data: StageAPI[] = response.data;
        setStages(data);
        setExpandedStages(data.map(s => s.stageId));

        const stats = calculateStats(data);
        if (onChangeStats) onChangeStats(stats);
      } catch (error) {
        console.error("Erro ao carregar cronograma:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id_work]);

  const displayedStages = filterStageId 
      ? stages.filter(s => s.stageId === Number(filterStageId))
      : stages;

  if (loading) return <div className="p-4 text-gray-500">Carregando cronograma...</div>;

  return (
    <div className="w-full bg-white rounded-lg border border-gray-300 shadow-sm overflow-y-scroll max-h-[230px]">
      <div className="grid grid-cols-12 bg-white border-b border-gray-200 py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
        <div className="col-span-3">Etapa</div>
        <div className="col-span-1 text-center">Progresso</div>
        <div className="col-span-1 text-center">Duração</div>
        <div className="col-span-2 text-center">Início Previsto</div>
        <div className="col-span-2 text-center">Fim Previsto</div>
        <div className="col-span-3 text-center">Cronograma</div>
      </div>

      <div className="divide-y divide-gray-200">
        {displayedStages.length === 0 && (
             <div className="p-4 text-center text-gray-500 text-sm">Nenhuma etapa encontrada com este filtro.</div>
        )}
        
        {displayedStages.map((stage) => {
          const { start, end } = getStageDates(stage);
          const stageProgress = getStageProgress(stage.tasks); 
          
          let duration = 0;
          if (start && end) {
             const diff = new Date(end).getTime() - new Date(start).getTime();
             duration = Math.ceil(diff / (1000 * 3600 * 24));
          }

          return (
            <React.Fragment key={stage.stageId}>
              <div 
                className="grid grid-cols-12 py-3 px-4 hover:bg-gray-50 cursor-pointer items-center bg-gray-50/30"
                onClick={() => toggleStage(stage.stageId)}
              >
                <div className="col-span-3 font-bold text-gray-800 flex items-center gap-2">
                  <span className={`transform transition-transform text-xs text-gray-500 ${expandedStages.includes(stage.stageId) ? 'rotate-90' : ''}`}>
                    ▶
                  </span>
                  {stage.stageName}
                </div>
                
                <div className="col-span-1 text-center text-sm text-gray-700 font-medium">
                    {stageProgress.toFixed(2)}%
                </div>
                <div className="col-span-1 text-center text-sm text-gray-600">{duration} dias</div>
                <div className="col-span-2 text-center text-sm text-gray-800 font-medium">{formatDate(start)}</div>
                <div className="col-span-2 text-center text-sm text-gray-800 font-medium">{formatDate(end)}</div>
                
                <div className="col-span-3 px-2">
                   <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-slate-400 h-3 rounded-full transition-all duration-500" style={{ width: `${stageProgress}%` }}></div>
                   </div>
                </div>
              </div>

              {expandedStages.includes(stage.stageId) && stage.tasks.map((task, index) => {
                 let progVal = task.progress || 0;
                 if (progVal > 0 && progVal <= 1) progVal = progVal * 100;

                 return (
                  <div key={`${stage.stageId}-${index}`} className="grid grid-cols-12 py-2 px-4 border-t border-gray-200 items-center bg-white">
                    <div className="col-span-3 pl-8 text-sm text-gray-600 border-l-2 border-gray-200 ml-2">
                      {task.substageName}
                    </div>
                    <div className="col-span-1 text-center text-sm text-gray-500">{progVal.toFixed(0)}%</div>
                    <div className="col-span-1 text-center text-sm text-gray-500">{task.duration || 0}</div>
                    <div className="col-span-2 text-center text-sm text-gray-500">{formatDate(task.startDate)}</div>
                    <div className="col-span-2 text-center text-sm text-gray-500">{formatDate(task.endDate)}</div>
                    
                    <div className="col-span-3 px-2 flex items-center">
                      <div className="w-full bg-gray-100 rounded h-2 relative overflow-hidden">
                        <div className="bg-slate-600 h-full absolute left-0 top-0 rounded" style={{ width: `${progVal}%` }}></div>
                      </div>
                    </div>
                  </div>
                 );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function calculateStats(data: StageAPI[]) {
    const hoje = new Date();
    let atrasadas = 0, adiantadas = 0, dentro = 0, total = 0;
    data.forEach(stage => {
        stage.tasks.forEach(task => {
            total++;
            const end = task.endDate ? new Date(task.endDate) : null;
            
            let prog = task.progress || 0;
            if (prog > 0 && prog <= 1) prog = prog * 100;

            if (!end) { dentro++; return; }
            
            if (prog < 100 && end < hoje) atrasadas++;
            else if (prog === 100 && end > hoje) adiantadas++;
            else dentro++;
        });
    });
    if (total === 0) return { dentro: "0.00", adiantadas: "0.00", atrasadas: "0.00" };
    return {
        atrasadas: ((atrasadas / total) * 100).toFixed(2),
        adiantadas: ((adiantadas / total) * 100).toFixed(2),
        dentro: ((dentro / total) * 100).toFixed(2),
    };
}