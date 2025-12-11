import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft } from "lucide-react"; 
import { FormCadastroObra } from "../features/gestor/componentes/cadastroMateriais/FormCadastroObra";
import { ListaSelecaoObra } from "../shared/ListaSelecaoObra";

export function CadastroObra() {
    const navigate = useNavigate();
    
    
    const [showForm, setShowForm] = useState(false);

    function handleSelectWork(id: string) {
        navigate(`/obras/${id}`);
    }

    const handleFormSuccess = () => {
        setShowForm(false);
    };

    return (
        <div className="h-screen bg-[#F5F5F5] p-4 md:p-2 overflow-hidden">
            
            <div className="flex flex-col md:flex-row justify-end items-center  max-w-[768px] mx-auto w-full gap-4">
                

                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm ${
                        showForm 
                        ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50" 
                        : "bg-green-400 text-white hover:bg-green-350 hover:shadow-md"      
                    }`}
                >
                    {showForm ? (
                        <>
                            <ArrowLeft size={20} /> Voltar para Lista
                        </>
                    ) : (
                        <>
                            <Plus size={20} /> Cadastrar Nova Obra
                        </>
                    )}
                </button>
            </div>

            <div className="w-full flex justify-center">
                
                {showForm ? (
                    <div className="w-full  bg-white border border-gray-300 rounded-xl p-6 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <FormCadastroObra onSuccess={handleFormSuccess} />
                    </div>
                ) : (

                    <div className="w-full animate-in fade-in duration-300">
                        <ListaSelecaoObra 
                            title="Obras Registradas"
                            onSelect={handleSelectWork}
                        />
                    </div>
                )}

            </div>
        </div>
    );
}