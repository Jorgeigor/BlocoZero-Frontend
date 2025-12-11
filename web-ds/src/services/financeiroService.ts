import { api } from './api';
import type { RelatorioFinanceiroDTO } from '../dtos/financeiro';

export const financeiroService = {
  // Busca o relatório já processado pelo backend
  // Rota confirmada: GET /financialphysical/list/{workId}
  getRelatorio: async (workId: number): Promise<RelatorioFinanceiroDTO | null> => {
    try {
      const response = await api.get(`/financialphysical/list/${workId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar relatório financeiro:", error);
      return null;
    }
  }
};