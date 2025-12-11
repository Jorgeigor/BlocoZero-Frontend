import { useEffect, useState } from "react";
import { z } from "zod";
import { InputForm } from "../InputForm";
import { Button } from "../../../auth/components/Button";
import editarSvg from "../../../../assets/editar.svg";
import incluirSvg from "../../../../assets/incluir.svg";
import deletarSvg from "../../../../assets/deletar.svg";
import { api } from "../../../../services/api";

interface StageData {
    id_stage: number;
    id_work: number;
    name: string;
    expStartDate: string;
    expEndDate: string;
    progress: number;
}

const stageSchema = z.object({
    name: z.string().min(3, "Nome obrigatório"),
    expStartDate: z.string().min(1, "Data Início obrigatória"),
    expEndDate: z.string().min(1, "Data Fim obrigatória"),
});

interface CronogramaPanelProps {
    workId: string; 
    onSelectStage: (id: number, name: string) => void;
}

export function EtapaPanel({ workId, onSelectStage }: CronogramaPanelProps) {

    const [isVisible, setIsVisible] = useState(false);
    const [stages, setStages] = useState<StageData[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        expStartDate: "",
        expEndDate: "",
    });

    const resetForm = () => {
        setFormData({ name: "", expStartDate: "", expEndDate: "" });
    };

    const fetchStages = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/stage/list/${workId}`);
            
            if (response.data && response.data.stages) {

                setStages(response.data.stages);
            } else if (Array.isArray(response.data)) {
                setStages(response.data);
            } else {
                setStages([]);
            }
        } catch (error) {
            console.warn("Erro ao buscar etapas:", error);
            setStages([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStages();
    }, [workId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNewClick = () => {
        resetForm();
        setSelectedId(null);
        setIsVisible(true);
    };

    const handleEditClick = () => {
        if (!selectedId) return alert("Selecione uma etapa.");
        const item = stages.find(s => s.id_stage === selectedId);
        if (item) {
            setFormData({
                name: item.name,
                expStartDate: item.expStartDate ? String(item.expStartDate).split('T')[0] : '',
                expEndDate: item.expEndDate ? String(item.expEndDate).split('T')[0] : '',
            });
            setIsVisible(true);
        }
    };

    const handleDeleteClick = async () => {
        if (!selectedId) return alert("Selecione uma etapa.");
        if (!window.confirm("Ao excluir a etapa, todas as subetapas serão apagadas. Confirmar?")) return;
        try {
            await api.delete(`/stage/delete/${selectedId}`);
            alert("Etapa excluída!");
            setSelectedId(null);
            setIsVisible(false);
            fetchStages();
        } catch (error) {
            console.error(error);
            alert("Erro ao excluir.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = stageSchema.parse(formData);
            
            const toISO = (dateStr: string) => {
                if (!dateStr) return null;
                return new Date(dateStr).toISOString();
            };

            const payload = { 
                ...data, 
                id_work: Number(workId), 
                progress: 0, 
                expStartDate: toISO(data.expStartDate),
                expEndDate: toISO(data.expEndDate),
                exeStartDate: null, 
                exeEndDate: null
            };

            console.log("Enviando:", payload);

            if (selectedId) {
                await api.put(`/stage/update/${selectedId}`, payload);
                alert("Etapa atualizada!");
            } else {
                await api.post("/stage/register", payload);
                alert("Etapa criada com sucesso!");
            }
            
            setIsVisible(false);
            resetForm();
            setSelectedId(null);
            fetchStages(); 

        } catch (error) {
            console.error(error);
            // @ts-ignore
            const msg = error.response?.data?.error || error.response?.data?.message || "Erro ao salvar.";
            alert(`Falha: ${msg}`);
        }
    };

    return (
        <div className="overflow-y-scroll h-[350px] pb-4">
            {isVisible && (
                <div className="w-full space-y-2 py-2 px-4 bg-white rounded-lg shadow-md mb-4 border border-gray-200">
                    <h3 className="text-sm font-bold text-gray-700 mb-2">
                        {selectedId ? "Editar Etapa" : "Nova Etapa"}
                    </h3>
                    <div className="flex gap-4">
                        <InputForm legend="Nome da Etapa:" name="name" value={formData.name} onChange={handleInputChange} containerClassName="flex-1" />
                        <InputForm legend="Início:" type="date" name="expStartDate" value={formData.expStartDate} onChange={handleInputChange} containerClassName="w-1/4" />
                        <InputForm legend="Fim:" type="date" name="expEndDate" value={formData.expEndDate} onChange={handleInputChange} containerClassName="w-1/4" />
                    </div>
                    
                    <div className="flex gap-2 mt-2 justify-end">
                        <Button 
                            onClick={handleSubmit} 
                            className="px-4 h-[26px] text-sm bg-gray-350 text-black hover:bg-gray-300 rounded-none border-1 border-gray-400"
                        >
                            {selectedId ? "Salvar Alterações" : "Confirmar"}
                        </Button>
                        <Button 
                            onClick={() => setIsVisible(false)} 
                            className="px-4 h-[26px] text-sm bg-red-100 text-red-800 hover:bg-red-200 rounded-none border-1 border-red-300"
                        >
                            Cancelar
                        </Button>
                    </div>
                </div>
            )}

            <div className="flex justify-end mt-2 gap-2">
                <Button 
                    onClick={handleNewClick} 
                    className="flex items-center gap-2 px-4 h-[26px] text-sm bg-gray-350 text-black hover:bg-gray-300 rounded-none border-1 border-gray-400"
                >
                    <img src={incluirSvg} className="w-4 h-4" alt="incluir" /> Incluir
                </Button>
                <Button 
                    onClick={handleEditClick} 
                    className={`flex items-center gap-2 px-4 h-[26px] text-sm rounded-none border-1 border-gray-400 ${selectedId ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                    disabled={!selectedId}
                >
                    <img src={editarSvg} className="w-4 h-4" alt="editar" /> Editar
                </Button>
                <Button 
                    onClick={handleDeleteClick} 
                    className={`flex items-center gap-2 px-4 h-[26px] text-sm rounded-none border-1 border-gray-400 ${selectedId ? 'bg-red-100 text-red-800 hover:bg-red-200 border-red-300' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                    disabled={!selectedId}
                >
                    <img src={deletarSvg} className="w-4 h-4" alt="excluir" /> Excluir
                </Button>
            </div>

            <table className="bg-white border border-gray-300 w-full text-left mt-2 text-sm">
                <thead>
                    <tr className="bg-gray-300">
                        <th className="px-1 border-1">Nome</th>
                        <th className="px-1 border-1">Início</th>
                        <th className="px-1 border-1">Fim</th>
                        <th className="px-1 border-1">Progresso</th>
                        <th className="px-1 border-1 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {stages.length === 0 ? (
                        <tr><td colSpan={5} className="p-2 text-center text-gray-500">Nenhuma etapa cadastrada nesta obra.</td></tr>
                    ) : (
                        stages.map(item => (
                            <tr 
                                key={item.id_stage} 
                                onClick={() => setSelectedId(selectedId === item.id_stage ? null : item.id_stage)}
                                className={`cursor-pointer hover:bg-gray-50 ${selectedId === item.id_stage ? 'bg-blue-200' : ''}`}
                            >
                                <td className="px-2 border-1">{item.name}</td>
                                <td className="px-2 border-1">{new Date(item.expStartDate).toLocaleDateString()}</td>
                                <td className="px-2 border-1">{new Date(item.expEndDate).toLocaleDateString()}</td>
                                <td className="px-2 border-1">{item.progress}%</td>
                                <td className="px-2 border-1 text-center">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation(); 
                                            onSelectStage(item.id_stage, item.name);
                                        }}
                                        className="bg-green-400 text-white px-3 py-0.5 rounded hover:bg-green-350 text-xs font-bold cursor-pointer"
                                    >
                                        Ver Subetapas &gt;
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}