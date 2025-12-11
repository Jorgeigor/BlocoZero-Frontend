import { useNavigate } from "react-router-dom";
import { ListaSelecaoObra } from "../../../../shared/ListaSelecaoObra";

export function RelatoriosGestorList() {
    const navigate = useNavigate();

    return (
        <div className="overflow-hidden">
            <ListaSelecaoObra 
                title="Relatórios de progresso físico das Obras"
                onSelect={(id) => navigate(`/obra/${id}/relatorios-gestor`)}
            />
        </div>
    );
}