import { useState } from "react";
import { FormularioProgresso } from "../features/relatorios/components/FormularioProgresso";
import { ImageUpload } from "../features/relatorios/components/ImageUpload";
import { Button } from "../features/auth/components/Button"; 
import { relatorioService, type RelatorioEnvioDTO } from "../services/relatorioService";

export function Relatorios() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const MOCK_WORK_ID = 1; 
    const MOCK_USER_ID = 2; 

    const handleFormSubmit = async (formData: any) => {
        if (!selectedFile) {
            alert("Por favor, adicione uma foto antes de enviar.");
            return;
        }

        try {
            setLoading(true);

            const dadosEnvio: RelatorioEnvioDTO = {
                id_work: MOCK_WORK_ID,
                id_user: MOCK_USER_ID,
                id_stage: Number(formData.etapa),
                id_substage: Number(formData.subetapa),
                startDate: formData.inicio,
                endDate: formData.fim,
                weather: formData.clima,
                completionPercentage: Number(formData.percentual),
                notes: formData.observacoes,
                photo: selectedFile 
            };

            console.log("Enviando dados:", dadosEnvio);

            await relatorioService.createRelatorio(dadosEnvio);
            
            alert("Relatório enviado com sucesso!");
            
            

        } catch (error: any) {
            console.error("Erro no envio:", error);
            
            const msg = error.response?.data?.error || error.response?.data?.message || error.message || "Erro desconhecido";
            alert(`Erro ao enviar relatório: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full p-8 bg-white h-screen">
            
            <div className="mb-8">
                <h1 className="text-xl font-bold text-gray-800">Relatório de Progresso</h1>
                <div className="w-full  bg-gray-300 mt-2"></div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                <div className="flex-1">
                    <FormularioProgresso onSubmit={handleFormSubmit} workId={MOCK_WORK_ID} />
                </div>
                
                <div className="w-full lg:w-[400px] flex flex-col justify-start lg:mt-0">
                    
                    <div className="lg:mt-[90px]">
                        <ImageUpload onImageSelect={setSelectedFile} />
                    </div>

                    <div className="flex justify-end mt-4">
                        <Button 
                            type="submit" 
                            form="form-progresso" 
                            isLoading={loading} 
                            disabled={loading}
                            className="bg-[#E0E0E0] text-black border border-gray-400 hover:bg-gray-300 w-32 h-9 rounded-sm text-sm font-normal shadow-sm"
                        >
                            {loading ? "Enviando..." : "Enviar"}
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}