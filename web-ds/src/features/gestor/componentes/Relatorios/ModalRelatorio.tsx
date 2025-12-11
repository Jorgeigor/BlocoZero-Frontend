import { FiX, FiCheck, FiXCircle, FiImage, FiCalendar } from "react-icons/fi";
import type { RelatorioDetalhado } from "./TabelaRelatorios"; 

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  relatorio: RelatorioDetalhado | null; 
  onAprovar: () => void;
  onRecusar: () => void;
}

export default function RelatorioDetalhesModal({ isOpen, onClose, relatorio, onAprovar, onRecusar }: ModalProps) {
  if (!isOpen || !relatorio) return null;

  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col animate-fade-in-up">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Avaliar Relatório</h2>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                <FiCalendar /> {new Date(relatorio.data).toLocaleDateString('pt-BR')} 
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200">
            <FiX size={24} />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Identificação</label>
                <div className="w-full bg-gray-200 border border-gray-300 rounded px-3 py-2 text-gray-700 text-sm">
                   Obra: {relatorio.nomeObra} | Etapa: {relatorio.etapa} | Sub: {relatorio.subetapa}
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Clima</label>
                   {/* Usando campo 'clima' */}
                   <div className="bg-gray-200 border border-gray-300 rounded px-3 py-2 text-gray-700 text-sm capitalize">
                     {relatorio.clima}
                   </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                   <div className="bg-gray-200 border border-gray-300 rounded px-3 py-2 text-gray-700 text-sm">
                     {relatorio.status}
                   </div>
                </div>
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Progresso ({relatorio.percentual}%)</label>
               <div className="relative w-full bg-gray-200 rounded-full h-3">
                 <div className="bg-[#607D8B] h-3 rounded-full transition-all duration-500" style={{ width: `${relatorio.percentual}%` }}></div>
               </div>
             </div>

             <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observações:</label>
                  <div className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-gray-600 text-sm italic min-h-[60px]">
                    "{relatorio.observacoes}"
                  </div>
             </div>
          </div>

          <div className="flex flex-col gap-4">
              <div className="flex-1 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center min-h-[200px] overflow-hidden relative group">
                 {relatorio.imagemUrl ? (
                   <img src={relatorio.imagemUrl} alt="Evidência" className="w-full h-full object-cover absolute inset-0" />
                 ) : (
                   <div className="text-center text-gray-400 flex flex-col items-center">
                     <FiImage size={32} className="mb-2" />
                     <span className="text-sm">Sem imagem</span>
                   </div>
                 )}
              </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 sticky bottom-0 z-10">
          <button onClick={onRecusar} className="flex items-center gap-2 px-6 py-2 border border-red-500 text-red-600 rounded hover:bg-red-50 font-medium transition-colors">
            <FiXCircle /> Recusar
          </button>
          <button onClick={onAprovar} className="flex items-center gap-2 px-6 py-2 bg-[#607D8B] text-white rounded hover:bg-[#4f6772] font-medium shadow-sm transition-colors">
            <FiCheck /> Validar
          </button>
        </div>

      </div>
    </div>
  );
}
