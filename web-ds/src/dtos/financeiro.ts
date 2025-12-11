export interface CronogramaMensal {
  mes: string;          
  valor: string;        
  porcentagem: string;  
  valor_bruto: number;  
}

export interface LinhaRelatorio {
  id_etapa: number;
  nome_etapa: string;
  total_etapa: string;
  cronograma_financeiro: CronogramaMensal[];
}

export interface ResumoRelatorio {
  valor_contrato: string;
  valor_disponivel: string;
  total_acumulado_obra: string;
}

export interface RelatorioFinanceiroDTO {
  resumo: ResumoRelatorio;
  tabela_dados: LinhaRelatorio[];
}