import { useNavigate } from "react-router-dom";
import { ListaSelecaoObra } from "../../../../shared/ListaSelecaoObra";

export function CronogramaSelecao() {
    const navigate = useNavigate();

    return (
        <div className="overflow-hidden">
            <ListaSelecaoObra 
                title="Cronogramas das Obras"
                onSelect={(id) => navigate(`/obra/${id}/cronograma`)}
            />
        </div>
    );
}