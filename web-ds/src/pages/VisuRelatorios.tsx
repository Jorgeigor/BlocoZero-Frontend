import TabelaRelatorios from "../features/gestor/componentes/Relatorios/TabelaRelatorios";
import { useParams } from "react-router-dom";

export const RelatoriosGestorPage = () => {
  const { work_id } = useParams<{ work_id: string }>();

  console.log("ID da Obra na Página:", work_id);

  if (!work_id) {
    return <div className="p-6 text-red-500">Erro: ID da obra não encontrado na URL.</div>;
  }

  return (
    <div className="p-6 bg-gray-50 flex flex-col overflow-hidden h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#607D8B] rounded-md"></span>
        Relatórios - Progresso Físico (Obra {work_id})
      </h1>

      <div className="w-full flex-1">
        <TabelaRelatorios workId={work_id} />
      </div>
    </div>
  );
};