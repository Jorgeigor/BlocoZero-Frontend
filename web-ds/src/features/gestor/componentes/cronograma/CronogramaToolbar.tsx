
interface StageOption {
    id: number;
    name: string;
}

interface CronogramaToolbarProps {
    stages: StageOption[]; 
    onFilterChange: (stageId: string) => void;
}

export function CronogramaToolbar({ stages, onFilterChange }: CronogramaToolbarProps) {
    return (
        <div className="flex justify-center items-center gap-4 mb-4">
            <div className="relative">
                <select 
                    className="appearance-none bg-white border border-gray-400 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500 text-sm font-bold shadow-sm cursor-pointer w-64"
                    onChange={(e) => onFilterChange(e.target.value)}
                    defaultValue=""
                >
                    <option value="">Todas as etapas</option>
                    {stages.map((stage) => (
                        <option key={stage.id} value={stage.id}>
                            {stage.name}
                        </option>
                    ))}
                </select>
                
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                </div>
            </div>

        </div>
    );
}