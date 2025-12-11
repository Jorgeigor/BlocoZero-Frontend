import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export type MonthData = {
  percent: string;
  value: string;
} | null;

interface EtapaRowProps {
  etapaNome: string;
  totalEtapa: string;
  meses: MonthData[]; 
}

export function EtapaRow({ etapaNome, totalEtapa, meses }: EtapaRowProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <tr className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors">
        <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap sticky left-0 bg-white z-10 border-r border-gray-100">
          <div 
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <ChevronDown size={16} className="text-gray-500" />
            ) : (
              <ChevronRight size={16} className="text-gray-500" />
            )}    
            <span>{etapaNome}</span>
          </div>
        </td>  
        <td className="py-4 px-4 text-gray-700 font-semibold whitespace-nowrap">
          {totalEtapa}
        </td>
        {meses.map((mes, index) => (
          <td key={index} className="py-4 px-4 min-w-[100px] text-center">
            {mes ? (
              <div className="flex flex-col items-center">
                <span className="font-bold text-gray-900">{mes.percent}</span>
                <span className="text-xs text-gray-600">{mes.value}</span>
              </div>
            ) : (
              <div className="h-8 w-full"></div> 
            )}
          </td>
        ))}
      </tr>
      {isOpen && (
        <tr className="hidden bg-white"> 
           <td colSpan={meses.length + 2}>Subetapas aqui...</td>
        </tr>
      )}
    </>
  );
}