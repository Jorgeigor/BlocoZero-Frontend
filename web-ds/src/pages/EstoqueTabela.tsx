import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // 1. Importamos o useParams
import { FiLoader } from "react-icons/fi";
import ResumoMovimentacao from "../features/gestor/componentes/estoque-tabela/MovimentacaoEstoque";
import TabelaMateriais from "../features/gestor/componentes/estoque-tabela/TabelaMateriais";

interface MaterialResumo {
  entrada_rec: number;
  entrada_acu: number;
  saida_rec: number;
  saida_acu: number;
}

export default function EstoqueTab() {
  
  const { work_id } = useParams<{ work_id: string }>();
  const currentWorkId = Number(work_id);

  const [dadosResumo, setDadosResumo] = useState<MaterialResumo[]>([]);
  const [loading, setLoading] = useState(true);


  const endpoint = `http://localhost:8080/stock/list/${currentWorkId}`;

  useEffect(() => {
    if (!currentWorkId) return;

    async function carregarDadosDeResumo() {
      try {
        setLoading(true);
        const resposta = await fetch(endpoint);
        
        if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);

        const dados = await resposta.json();
        const listaMateriais = dados.stock || [];

        if (!Array.isArray(listaMateriais)) throw new Error("Formato inválido");

        const resumoFormatado: MaterialResumo[] = listaMateriais.map((item: any) => ({
          entrada_rec: item.recentInflow,
          entrada_acu: item.cumulativeInflow,
          saida_rec: item.recentOutflow,
          saida_acu: item.cumulativeOutflow,
        }));

        setDadosResumo(resumoFormatado);
      } catch (erro) {
        console.error("Erro ao carregar resumo:", erro);
        setDadosResumo([]);
      } finally {
        setLoading(false);
      }
    }

    carregarDadosDeResumo();
  }, [currentWorkId, endpoint]); 

  if (!currentWorkId) return <div className="p-6">Obra não encontrada (ID inválido).</div>;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] text-gray-500">
        <FiLoader className="animate-spin mr-2" size={24} />
        Carregando dados do estoque...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 flex flex-col w-full h-full overflow-hidden">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#607D8B] rounded-md"></span>
        Controle de Estoque da Obra
      </h1>

      <ResumoMovimentacao materiais={dadosResumo} />

      <TabelaMateriais endpoint={endpoint} />
    </div>
  );
}