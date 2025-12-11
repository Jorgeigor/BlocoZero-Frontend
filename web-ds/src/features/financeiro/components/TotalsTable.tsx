interface TotalsTableProps {
  mesesLabels: string[];
  totaisMensais: number[];
  totaisAcumulados: number[];
}

export function TotalsTable({ mesesLabels, totaisMensais, totaisAcumulados }: TotalsTableProps) {
  
  const formatMoney = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const commonCell = "bg-white border-gray-300 px-4 py-4 whitespace-nowrap";
  const labelCell = `${commonCell} font-semibold text-gray-900 text-left`;
  const valueCell = `${commonCell} font-normal text-gray-700 text-center`;

  return (
    <div className="w-full">
      <table className="text-xs border-separate border-spacing-0">

        <thead className="invisible h-0">
          <tr>
            <th className="py-0 px-4 w-64"></th> 
            <th className="py-0 px-4 min-w-[120px]"></th> 
            {mesesLabels.map((_, i) => (
               <th key={i} className="py-0 px-4 min-w-[100px]"></th> 
            ))}
          </tr>
        </thead>
        
        <tbody>

          <tr>
            <td className="p-0 border-none bg-transparent"></td>
            <td className={`${labelCell} border-l border-t border-b rounded-tl-2xl`}>
              Total mensal
            </td>
            
            {totaisMensais.map((val, index) => (
              <td 
                key={index} 
                className={`${valueCell} border-t border-b ${index === totaisMensais.length - 1 ? 'border-r rounded-tr-2xl' : ''}`}
              >
                {formatMoney(val)}
              </td>
            ))}
          </tr>
          <tr>
          <td className="p-0 border-none bg-transparent"></td>

          <td className={`${labelCell} border-l border-b rounded-bl-2xl`}>
           Total Acumulado
            </td>
            {totaisAcumulados.map((val, index) => (
            <td 
            key={index} 
            className={`${valueCell} border-b ${index === totaisAcumulados.length - 1 ? 'border-r rounded-br-2xl' : ''}`}
          >
            {formatMoney(val)}
            </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}