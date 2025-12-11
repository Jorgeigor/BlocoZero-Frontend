import { BsFillCaretUpFill, BsFillCaretDownFill } from "react-icons/bs";

interface ResumoMovimentacaoProps {
  materiais: {
    entrada_rec: number;
    entrada_acu: number;
    saida_rec: number;
    saida_acu: number;
  }[];
}

export default function ResumoMovimentacao({ materiais }: ResumoMovimentacaoProps) {
  const entradasRecentes = materiais.reduce((sum, m) => sum + m.entrada_rec, 0);
  const entradasAcumuladas = materiais.reduce((sum, m) => sum + m.entrada_acu, 0);
  const saidasRecentes = materiais.reduce((sum, m) => sum + m.saida_rec, 0);
  const saidasAcumuladas = materiais.reduce((sum, m) => sum + m.saida_acu, 0);

  const cards = [
    {
      label: <strong>ENTRADAS</strong>,
      icon: <BsFillCaretUpFill size={28} className="text-[#479A54]" />,
      bg: "bg-[#e7e7e7]",
      border: "shadow-md border border-[#c4c4c4]",
      recentes: entradasRecentes,
      acumuladas: entradasAcumuladas,
      text: "text-[#607D8B] text-medium",
    },
    {
      label: <strong>SAÍDAS</strong>,
      icon: <BsFillCaretDownFill size={28} className="text-[#9A2020]" />,
      bg: "bg-[#e7e7e7]",
      border: "shadow-md border border-[#c4c4c4]",
      recentes: saidasRecentes,
      acumuladas: saidasAcumuladas,
      text: "text-[#607D8B] text-medium",
    },
  ];

  return (
    <div className="flex gap-4 mb-2">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`flex items-center p-4 w-80 h-28 rounded-2xl ${card.border} ${card.bg}`}
        >
          <div className="mr-4 flex-shrink-0">{card.icon}</div>
          <div className="flex flex-col w-full">
            <p className={`font-semibold mb-2 ${card.text}`}>{card.label}</p>
            <div className="flex justify-between">
              <span className={`font-medium ${card.text}`}>Recentes</span>
              <span className={`font-semibold ${card.text}`}>{card.recentes}</span>
            </div>
            <div className="flex justify-between">
              <span className={`font-medium ${card.text}`}>Acumuladas</span>
              <span className={`font-semibold ${card.text}`}>{card.acumuladas}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
