import type { ReactNode } from 'react';

type InfoCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
};

export function InfoCard({ title, value, icon }: InfoCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-300 p-4 shadow min-w-[200px]">
      <div className="text-gray-800">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-700">{title}</span>
        <span className="text-xl font-bold text-gray-900 whitespace-nowrap">{value}</span>
      </div>
    </div>
  );
}