import { useState, useEffect } from 'react';
import { relatorioService } from "../../../services/relatorioService"; 

interface Stage {
    id_stage: number;
    name: string;
}

interface Substage {
    id_substage: number;
    stage_id: number;
    name: string;
}

interface FormularioProgressoProps {
    onSubmit: (data: any) => void;
    workId: number; 
}

export function FormularioProgresso({ onSubmit, workId }: FormularioProgressoProps) {
    const [listaEtapas, setListaEtapas] = useState<Stage[]>([]);
    const [listaSubetapas, setListaSubetapas] = useState<Substage[]>([]);
    const [subetapasFiltradas, setSubetapasFiltradas] = useState<Substage[]>([]);

    const [formData, setFormData] = useState({
        etapa: '',
        subetapa: '',
        inicio: '',
        fim: '',
        percentual: '',
        clima: '',
        observacoes: ''
    });

    useEffect(() => {
        if (workId) {
            carregarDados();
        }
    }, [workId]); 

    const carregarDados = async () => {
        try {
            const [etapasRes, subetapasRes] = await Promise.all([
                relatorioService.getEtapas(workId),
                relatorioService.getSubetapasByWork(workId)
            ]);
            
            setListaEtapas(etapasRes || []);
            setListaSubetapas(subetapasRes || []);
        } catch (error) {
            console.error("Erro ao carregar listas:", error);
        }
    };


    useEffect(() => {
        if (formData.etapa) {
            const etapaIdSelecionada = Number(formData.etapa);
            const filtradas = listaSubetapas.filter(sub => sub.stage_id === etapaIdSelecionada);
            setSubetapasFiltradas(filtradas);
        } else {
            setSubetapasFiltradas([]);
        }
    }, [formData.etapa, listaSubetapas]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let finalValue = value;
        if (name === 'percentual') {
            const num = parseInt(value);
            if (num < 0) finalValue = "0";
            if (num > 100) finalValue = "100";
        }
        if (name === 'etapa') {
            setFormData(prev => ({ ...prev, [name]: finalValue, subetapa: '' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: finalValue }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const inputStyle = "border border-gray-400 rounded-sm h-[30px] px-2 text-sm focus:outline-none focus:border-gray-600 bg-white shadow-sm";
    const labelStyle = "text-sm font-normal text-gray-900 whitespace-nowrap min-w-max";

    return (
        <form id="form-progresso" className="w-full" onSubmit={handleSubmit}>
            
            <div className="flex flex-col xl:flex-row gap-6 mb-6">
                <div className="flex items-center gap-3 flex-1">
                    <label className={labelStyle}>Etapa:</label>
                    <select name="etapa" className={`${inputStyle} w-full`} value={formData.etapa} onChange={handleChange} required>
                        <option value="">Selecione...</option>
                        {listaEtapas.map((etapa) => (
                            <option key={etapa.id_stage} value={etapa.id_stage}>{etapa.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-6">
                    <div className="flex items-center gap-3">
                        <label className={labelStyle}>Início:</label>
                        <input type="date" name="inicio" className={`${inputStyle} w-36`} value={formData.inicio} onChange={handleChange} />
                    </div>
                    <div className="flex items-center gap-3">
                        <label className={labelStyle}>Fim:</label>
                        <input type="date" name="fim" className={`${inputStyle} w-36`} value={formData.fim} onChange={handleChange} />
                    </div>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-6 mb-6">
                <div className="flex items-center gap-3 flex-[2]">
                    <label className={labelStyle}>Subetapa:</label>
                    <select name="subetapa" className={`${inputStyle} w-full ${!formData.etapa ? 'bg-gray-100 cursor-not-allowed' : ''}`} value={formData.subetapa} onChange={handleChange} disabled={!formData.etapa} required>
                        <option value="">{formData.etapa ? "Selecione a subetapa..." : "Selecione uma etapa primeiro"}</option>
                        {subetapasFiltradas.map((sub) => (
                            <option key={sub.id_substage} value={sub.id_substage}>{sub.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-3">
                    <label className={labelStyle}>Percentual:</label>
                    <div className="flex items-center gap-2">
                        <input type="number" name="percentual" className={`${inputStyle} w-20 text-center`} placeholder="0" value={formData.percentual} onChange={handleChange} />
                        <span className="text-sm font-bold">%</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 mb-8 w-full xl:w-1/3">
                <label className={labelStyle}>Clima:</label>
                <select name="clima" className={`${inputStyle} w-full`} value={formData.clima} onChange={handleChange}>
                    <option value="">Selecione...</option>
                    <option value="sol">Ensolarado ☀️</option>
                    <option value="parcial">Parcialmente Nublado ⛅</option>
                    <option value="nublado">Nublado ☁️</option>
                    <option value="chuva">Chuva Moderada 🌧️</option>
                </select>
            </div>

            <div className="mb-4">
                <label className={`${labelStyle} mb-2 block`}>Observações:</label>
                <textarea name="observacoes" rows={8} className="w-full border border-gray-400 rounded-sm p-2 text-sm resize-none focus:outline-none focus:border-gray-600 shadow-sm" value={formData.observacoes} onChange={handleChange}></textarea>
            </div>
        </form>
    );
}