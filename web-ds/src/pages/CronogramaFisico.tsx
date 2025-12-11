import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Importar hooks de rota
import { GanttStatsCards } from "../features/gestor/componentes/cronograma/GanttStatsCards";
import { CronogramaTable } from "../features/gestor/componentes/cronograma/CronogramaTable";
import { CronogramaToolbar } from "../features/gestor/componentes/cronograma/CronogramaToolbar";
import { api } from "../services/api";
import { Button } from "../features/home/components/Button";

interface StageOption {
    id: number;
    name: string;
}

export function CronogramaPage() {
    const navigate = useNavigate();
    const { work_id } = useParams<{ work_id: string }>(); 
    const currentWorkId = Number(work_id);

    const [stats, setStats] = useState({ dentro: "0.00", adiantadas: "0.00", atrasadas: "0.00" });
    const [stageOptions, setStageOptions] = useState<StageOption[]>([]);
    const [filterStageId, setFilterStageId] = useState("");
    const [workTitle, setWorkTitle] = useState("Carregando...");

    useEffect(() => {
        if (!currentWorkId) return;

        const fetchData = async () => {
            try {
                const resWork = await api.get(`/work/specific/${currentWorkId}`);
                console.log("Dados da Obra recebidos:", resWork.data); 
                const workData = resWork.data.work || resWork.data;
                
                if (workData && workData.title) {
                    setWorkTitle(workData.title);
                } else {
                    setWorkTitle("Obra sem título");
                }

                const response = await api.get(`/stage/list/${currentWorkId}`);
                const data = response.data.stages || response.data || [];
                
                const options = data.map((s: any) => ({
                    id: s.id_stage,
                    name: s.name
                }));
                setStageOptions(options);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                setWorkTitle("Erro ao carregar");
            }
        };
        fetchData();
    }, [currentWorkId]);

    const handleFilterChange = (val: string) => {
        setFilterStageId(val);
    };

    if (!currentWorkId) {
        return <div className="p-6">ID da obra não identificado.</div>;
    }

    return (
        <div className="flex flex-col h-full bg-white p-4 overflow-y-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Cronograma: {workTitle}</h1>
                    <span className="text-sm text-gray-500">Acompanhamento de etapas e prazos</span>
                </div>
                <Button 
                    onClick={() => navigate('/cronograma-fisico')} 
                    className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded text-sm"
                >
                    Trocar Obra
                </Button>
            </div>
            
            <GanttStatsCards stats={stats} />

            <CronogramaToolbar 
                stages={stageOptions} 
                onFilterChange={handleFilterChange}
            />

            <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden mt-4">
                <CronogramaTable 
                    id_work={currentWorkId} 
                    onChangeStats={setStats} 
                    filterStageId={filterStageId} 
                />
            </div>
        </div>
    );
}