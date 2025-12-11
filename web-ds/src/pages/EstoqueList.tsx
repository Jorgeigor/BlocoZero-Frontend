import { useNavigate } from "react-router-dom";
import { ListaSelecaoObra } from "../shared/ListaSelecaoObra";

export function EstoqueList() {
    const navigate = useNavigate();

    return (
        <div className="h-screen bg-[#F5F5F5] overflow-hidden">
            <ListaSelecaoObra 
                title="Estoque das Obras Responsáveis"
                onSelect={(id) => navigate(`/estoque/${id}`)}
            />
        </div>
    );
}