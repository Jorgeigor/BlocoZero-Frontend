import { X, AlertCircle, Cloud, FileText, Image as ImageIcon } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    obra: string;
    etapa: string;
    motivo: string | null;
    notes: string;
    photo: string;
    weather: string;
    completionPercentage: number;
    date: string;
  } | null;
}

export function ModalFeedback({ isOpen, onClose, data }: ModalProps) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden relative animate-fade-in">
        
        {/* Cabeçalho */}
        <div className="bg-red-50 p-4 border-b border-red-100 flex justify-between items-center">
          <div className="flex items-center gap-3 text-red-700">
            <AlertCircle size={24} />
            <h2 className="font-bold text-lg">Correção Solicitada</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Corpo */}
        <div className="p-6 space-y-6">
          
          {/* Informações de Contexto */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs uppercase font-semibold">Obra</span>
              <span className="text-gray-800 font-medium text-lg">{data.obra}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs uppercase font-semibold">Etapa</span>
              <span className="text-gray-800 font-medium text-lg">{data.etapa}</span>
            </div>
          </div>

          {/* Data e Porcentagem */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs uppercase font-semibold">Data</span>
              <span className="text-gray-800 font-medium">{data.date}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs uppercase font-semibold">Porcentagem Concluída</span>
              <span className="text-gray-800 font-medium">{data.completionPercentage}%</span>
            </div>
          </div>

          {/* Clima */}
          <div className="flex flex-col">
            <span className="text-gray-500 text-xs uppercase font-semibold flex items-center gap-1">
              <Cloud size={14} />
              Clima
            </span>
            <span className="text-gray-800 font-medium">{data.weather}</span>
          </div>

          {/* Notas */}
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <span className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
              <FileText size={14} />
              Notas:
            </span>
            <p className="text-gray-800 text-sm leading-relaxed">
              {data.notes}
            </p>
          </div>

          {/* Mensagem do Gestor */}
          <div className="bg-red-50 p-4 rounded-md border border-red-200">
            <span className="block text-xs font-bold text-red-500 uppercase mb-2">
              Mensagem do Gestor:
            </span>
            <p className="text-red-800 text-sm leading-relaxed italic">
              "{data.motivo || "Motivo não disponível"}"
            </p>
          </div>

          {/* Foto (se disponível) */}
          {data.photo && (
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs uppercase font-semibold flex items-center gap-1 mb-2">
                <ImageIcon size={14} />
                Foto Anexada
              </span>
              <div className="flex justify-center items-center my-4">
              <img 
                src={`data:image/jpeg;base64,${data.photo}`} 
                alt="Foto do relatório" 
                className="w-40 h-auto rounded-md border border-gray-200" 
              />
            </div>

            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full bg-red-500 block"></span>
            Necessário editar e reenviar o relatório.
          </div>
        </div>

      </div>
    </div>
  );
}