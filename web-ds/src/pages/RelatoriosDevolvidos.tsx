import { useState, useEffect } from "react";
import { Eye, AlertTriangle, Clock, CheckCircle, XCircle } from "lucide-react";
import { ModalFeedback } from "../features/relatorios/components/ModalFeedback";

type StatusRelatorio = "Pendente" | "Validado" | "Recusado";

interface Report {
  id: number;
  date: string;
  obra: string;
  etapa: string;
  status: StatusRelatorio;
  motivo: string | null;
  completionPercentage: number;
  notes: string;
  photo: string;
  weather: string;
}

function arrayBufferToBase64(buffer: any) {
  let binary = '';
  const bytes = buffer.data ? new Uint8Array(buffer.data) : new Uint8Array(buffer);
  
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function RelatoriosDevolvidos() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filtroAtivo, setFiltroAtivo] = useState<StatusRelatorio>("Pendente");

  useEffect(() => {
    const searchProgressReport = async () => {
      try {
        const response = await fetch("http://localhost:8080/progressReport/list/1");
        
        if (!response.ok) {
           console.warn("API retornou erro");
           setReports([]);
           return; 
        }

        const data = await response.json();
        console.log("Dados recebidos:", data);

        const mappedReports: Report[] = data.progressReports.map((item: any) => {
          let status: StatusRelatorio;
          
          if (item.status === "valid" || item.status === "Validado") {
            status = "Validado";
          } else if (item.status === "invalid" || item.status === "Recusado") {
            status = "Recusado";
          } else {
            status = "Pendente";
          }

          let photoBase64 = "";
          if (item.photo) {
            try {
              if (typeof item.photo === 'string') {
                photoBase64 = item.photo;
              } else {
                photoBase64 = arrayBufferToBase64(item.photo);
              }
            } catch (e) {
              console.error("Erro ao converter imagem", e);
            }
          }

          return {
            id: item.id_progressSubstageReport,
            date: new Date(item.createdAt).toLocaleDateString("pt-BR"),
            obra: `Obra ${item.id_work}`,
            etapa: `Etapa ${item.id_stage} - Subetapa ${item.id_substage}`,
            status,
            motivo: status === "Recusado" ? item.managerRejectionReason : null,
            completionPercentage: item.completionPercentage,
            notes: item.notes,
            photo: photoBase64, 
            weather: item.weather,
          };
        });

        setReports(mappedReports);
      } catch (err) {
        console.error(err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    searchProgressReport();
  }, []);

  const filteredReports = reports.filter(r => r.status === filtroAtivo);

  const handleOpenDetails = (report: Report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const renderStatus = (status: StatusRelatorio) => {
    switch (status) {
      case "Recusado":
        return (
          <span className="flex items-center gap-1 text-[10px] bg-red-100 text-red-700 px-3 py-1 rounded-full border border-red-200 font-bold uppercase tracking-wide">
            <AlertTriangle size={12} /> Recusado
          </span>
        );
      case "Pendente":
        return (
          <span className="flex items-center gap-1 text-[10px] bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full border border-yellow-200 font-bold uppercase tracking-wide">
            <Clock size={12} /> Pendente
          </span>
        );
      case "Validado":
        return (
          <span className="flex items-center gap-1 text-[10px] bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-200 font-bold uppercase tracking-wide">
            <CheckCircle size={12} /> Validado
          </span>
        );
    }
  };

  if (loading) {
    return <div className="w-full p-8 bg-white min-h-screen">Carregando...</div>;
  }

  if (error) {
    return <div className="w-full p-8 bg-white min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="w-full p-8 bg-white h-screen">
      
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-xl font-bold text-gray-800">
            Meus Relatórios
          </h1>
        </div>
        <div className="w-full h-[1px] bg-gray-300 mb-6"></div>

        <div className="flex gap-3">
          <button 
            onClick={() => setFiltroAtivo("Pendente")}
            className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-sm font-medium transition-all border ${
              filtroAtivo === "Pendente" 
              ? "bg-[#FEF3C7] text-[#D97706] border-[#FCD34D] shadow-sm" 
              : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Clock size={16} />
            Pendentes
          </button>

          <button 
            onClick={() => setFiltroAtivo("Validado")}
            className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-sm font-medium transition-all border ${
              filtroAtivo === "Validado" 
              ? "bg-[#D1FAE5] text-[#059669] border-[#6EE7B7] shadow-sm" 
              : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <CheckCircle size={16} />
            Validados
          </button>

          <button 
            onClick={() => setFiltroAtivo("Recusado")}
            className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-sm font-medium transition-all border ${
              filtroAtivo === "Recusado" 
              ? "bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5] shadow-sm" 
              : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <XCircle size={16} />
            Recusados
          </button>
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm mt-4">
        <div className="grid grid-cols-12 bg-[#E5E7EB] p-3 border-b border-gray-300 text-xs font-bold text-gray-700 uppercase tracking-wider">
          <div className="col-span-2">Data</div>
          <div className="col-span-6">Obra / Etapa</div>
          <div className="col-span-4 text-center">Status / Ação</div>
        </div>

        <div className="divide-y divide-gray-200 bg-white">
          {filteredReports.map((item) => (
            <div 
              key={item.id} 
              className="grid grid-cols-12 p-4 items-center hover:bg-gray-50 transition-colors group"
            >
              <div className="col-span-2 text-sm text-gray-700 font-medium">
                {item.date}
              </div>
              
              <div className="col-span-6 flex flex-col">
                <span className="text-sm text-gray-900 font-bold">{item.obra}</span>
                <span className="text-xs text-gray-500 mt-0.5">{item.etapa}</span>
              </div>

              <div className="col-span-4 flex justify-center items-center gap-4">
                {renderStatus(item.status)}

                <button 
                  onClick={() => handleOpenDetails(item)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                  title="Ver detalhes"
                >
                  <Eye size={20} />
                </button>
              </div>
            </div>
          ))}
          
          {filteredReports.length === 0 && (
            <div className="p-10 text-center text-gray-400 text-sm max-h-[240px] overflow-y-scroll">
              Nenhum relatório encontrado neste filtro.
            </div>
          )}
        </div>
      </div>

      <ModalFeedback 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={selectedReport} 
      />

    </div>
  );
}