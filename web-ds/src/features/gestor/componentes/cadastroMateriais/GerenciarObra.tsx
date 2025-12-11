import { useParams, useNavigate } from "react-router-dom";
import { AbasCadastroObra } from "./AbasCadastroObra";
import { Button } from "../../../home/components/Button"; 

export function GerenciarObra() {
    const { id } = useParams<{ id: string }>(); 
    const navigate = useNavigate();

    if (!id) {
        return <div className="p-4">ID da obra não encontrado.</div>;
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
            <div className="bg-white border-b border-gray-300 p-4 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Gerenciando Obra #{id}</h1>
                    <span className="text-sm text-gray-500">Cadastre materiais, funcionários e etapas</span>
                </div>
                <Button 
                    variant="base" 
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-2 rounded"
                    onClick={() => navigate('/cadastro-obra')}
                >
                    Voltar para Lista
                </Button>
            </div>

            <div className="flex-1 overflow-hidden bg-white">
                <AbasCadastroObra workId={id} />
            </div>
        </div>
    );
}