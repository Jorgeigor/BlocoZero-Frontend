import { FaHourglassHalf } from "react-icons/fa";

interface GanttStats {
  dentro: string;
  adiantadas: string;
  atrasadas: string;
}

interface GanttStatsCardsProps {
  stats: GanttStats;
}

export function GanttStatsCards({ stats }: GanttStatsCardsProps) {
  const cards = [
    {
      label: "% Etapas dentro do prazo",
      value: stats.dentro,
      icon: <FaHourglassHalf size={36} className="text-gray-600 mb-2" />,
      border: "border-gray-400",
      bg: "bg-gray-200",
      text: "text-gray-700",
      valueColor: "text-[#607D8B]",
    },
    {
      label: "% Etapas adiantadas",
      value: stats.adiantadas,
      icon: <FaHourglassHalf size={36} className="text-gray-600 mb-2" />,
      border: "border-gray-400",
      bg: "bg-gray-200",
      text: "text-gray-700",
      valueColor: "text-[#607D8B]",
    },
    {
      label: "% Etapas atrasadas",
      value: stats.atrasadas,
      icon: <FaHourglassHalf size={36} className="text-gray-600 mb-2" />,
      border: "border-gray-400",
      bg: "bg-gray-200",
      text: "text-gray-700",
      valueColor: "text-[#607D8B]",
    },
  ];

  return (
    <div className="flex flex-wrap gap-6 mb-6 justify-center pt-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`flex-1 max-w-xs ${card.bg} border ${card.border} rounded-2xl shadow-md p-6 flex flex-col items-center text-center transition-transform hover:scale-105`}
        >
          {card.icon}
          <p className={`font-semibold ${card.text}`}>{card.label}</p>
          <span className={`text-3xl font-bold mt-2 ${card.valueColor}`}>{card.value}%</span>
        </div>
      ))}
    </div>
  );
}