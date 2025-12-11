import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import IconePesquisa from '../assets/search-icon.svg';
import IconeDinheiro from '../assets/money-icon.svg';

import { InfoCard } from '../features/financeiro/components/InfoCard';
import { EtapaRow } from '../features/financeiro/components/EtapaRow';
import { TotalsTable } from '../features/financeiro/components/TotalsTable';

import { financeiroService } from '../services/financeiroService';
import type { RelatorioFinanceiroDTO } from '../dtos/financeiro';

export function Fin() {
  const { work_id } = useParams(); 

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [relatorio, setRelatorio] = useState<RelatorioFinanceiroDTO | null>(null);

  const formatarValor = (valor: string | number | undefined) => {
    if (!valor) return "R$ 0,00";
    const numero = Number(valor);
    return isNaN(numero) ? "R$ 0,00" : numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  useEffect(() => {
    const carregarDados = async () => {
      if (!work_id) {
        console.warn("Nenhum ID de obra (work_id) encontrado na URL.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const idNumerico = Number(work_id); 
        const dados = await financeiroService.getRelatorio(idNumerico);
        setRelatorio(dados);
      } catch (error) {
        console.error("Erro ao carregar tabela:", error);
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();
  }, [work_id]); 

  const headers = useMemo(() => {
    if (!relatorio || !relatorio.tabela_dados || relatorio.tabela_dados.length === 0) return [];
    return relatorio.tabela_dados[0].cronograma_financeiro.map(c => c.mes);
  }, [relatorio]);

  const tableData = useMemo(() => {
    if (!relatorio?.tabela_dados) return [];

    const dadosMapeados = relatorio.tabela_dados.map(linha => ({
      etapaNome: linha.nome_etapa,
      totalEtapa: formatarValor(linha.total_etapa),
      mesesRaw: linha.cronograma_financeiro, 
      mesesVisuais: linha.cronograma_financeiro.map(c => ({
          percent: c.porcentagem,
          value: c.valor_bruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      }))
    }));

    if (!searchTerm) return dadosMapeados;

    return dadosMapeados.filter(item => 
      item.etapaNome.toLowerCase().includes(searchTerm.toLowerCase())
    );

  }, [relatorio, searchTerm]); 

  const { totaisMensais, totaisAcumulados } = useMemo(() => {
    if (!relatorio || !relatorio.tabela_dados || relatorio.tabela_dados.length === 0) {
      return { totaisMensais: [], totaisAcumulados: [] };
    }

    const qtdMeses = relatorio.tabela_dados[0].cronograma_financeiro.length;
    const somaMensal = new Array(qtdMeses).fill(0);
    const somaAcumulada: number[] = [];
    let acumulador = 0;

    for (let i = 0; i < qtdMeses; i++) {
      relatorio.tabela_dados.forEach(linha => {
        const itemMes = linha.cronograma_financeiro[i];
        if (itemMes) {
          somaMensal[i] += itemMes.valor_bruto;
        }
      });
      acumulador += somaMensal[i];
      somaAcumulada.push(acumulador);
    }

    return { totaisMensais: somaMensal, totaisAcumulados: somaAcumulada };
  }, [relatorio]);



  if (loading) {
    return <div className="min-h-screen bg-[#F5F5F5] p-8 flex items-center justify-center">Carregando relatório...</div>;
  }

  if (!work_id || !relatorio) {
    return (
        <div className="min-h-screen bg-[#F5F5F5] p-8 flex items-center justify-center text-gray-500">
            {!work_id ? "Obra não selecionada (URL inválida)." : "Não foi possível carregar os dados desta obra."}
        </div>
    );
  }

  return (
    <div className="h-screen bg-[#F5F5F5] p-4 md:p-6 overflow-hidden">
      <main className="w-full max-w-full min-w-0">
        
        <section className="flex flex-col md:flex-row items-end justify-start gap-4 mb-4 flex-wrap">
          <div className="flex gap-4 md:gap-6 max-w-full">
             <InfoCard 
                title="Valor do contrato" 
                value={formatarValor(relatorio.resumo?.valor_contrato)} 
                icon={<img src={IconeDinheiro} alt="Dinheiro" className="w-12 h-12" />} 
             />
             <InfoCard 
                title="Total Acumulado" 
                value={formatarValor(relatorio.resumo?.total_acumulado_obra)} 
                icon={<img src={IconeDinheiro} alt="Dinheiro" className="w-12 h-12" />} 
             />
             <InfoCard 
                title="Disponível" 
                value={formatarValor(relatorio.resumo?.valor_disponivel)} 
                icon={<img src={IconeDinheiro} alt="Dinheiro" className="w-12 h-12" />} 
             />
          </div>

          <div className="relative w-72 pb-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none pb-1">
              <img src={IconePesquisa} alt="Pesquisar" className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-full border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-gray-500 focus:outline-none shadow-sm"
            />
          </div>
        </section>

        <section className="border border-gray-300 rounded-lg overflow-x-scroll md:w-[1120px]  2xl:w-[1480px] shadow-sm bg-white">
          <div>
            <table className="w-full text-left border-collapse">
              <thead className="bg-white border-b border-gray-300">
                <tr>
                  <th className="py-4 px-4 text-xs font-semibold text-gray-600 uppercase w-64 sticky left-0 bg-white z-20 border-r border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    Etapa
                  </th>
                  <th className="py-4 px-4 text-xs font-semibold text-gray-600 uppercase border-r border-gray-200 text-right min-w-[120px]">
                    Total Etapa (R$)
                  </th>
                  {headers.map((header, index) => (
                    <th key={index} className="py-4 px-4 text-xs font-semibold text-gray-600 uppercase text-center border-r border-gray-200 min-w-[100px]">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead> 
              <tbody>
                {tableData.length > 0 ? (
                  tableData.map((linha, index) => (
                    <EtapaRow 
                      key={index} 
                      etapaNome={linha.etapaNome}
                      totalEtapa={linha.totalEtapa}
                      meses={linha.mesesVisuais}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={headers.length > 0 ? headers.length + 2 : 2} className="p-8 text-center text-gray-500">
                      {searchTerm ? "Nenhuma etapa encontrada com esse nome." : "Nenhum dado disponível."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-4 md:w-[1120px] 2xl:w-[1480px] overflow-x-scroll">
          <TotalsTable 
            mesesLabels={headers}
            totaisMensais={totaisMensais}
            totaisAcumulados={totaisAcumulados}
          />
        </section>

      </main>
    </div>
  );
}