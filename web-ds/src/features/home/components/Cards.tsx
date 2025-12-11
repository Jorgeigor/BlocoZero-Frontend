export type CardsProps = {
    data: {
        budgetDisplay: string; 
        budgetFull: string;    
        employees: number;
        progress: string | number;
    }
}

export function Cards({ data }: CardsProps) {
    return (
        <div className="flex flex-wrap justify-center items-center w-full gap-4 md:gap-8 lg:gap-12 p-4 2xl:mt-10">
            
            <div 
                className="flex flex-col items-center justify-center w-full max-w-[200px] min-h-[150px] bg-white rounded-lg shadow-md p-4 transform transition-transform hover:scale-105"
                title={data.budgetFull} 
            >
                <h1 className="text-lg text-gray-700 font-medium">Orçamento</h1>
                
                <p className="text-xl md:text-2xl text-gray-900 font-bold mt-2 text-center whitespace-nowrap">
                    {data.budgetDisplay}
                </p>
                
                {data.budgetDisplay !== data.budgetFull && (
                    <span className="text-xs text-gray-400 mt-1">(valor aproximado)</span>
                )}
            </div>

            <div className="flex flex-col items-center justify-center w-full max-w-[200px] min-h-[150px] bg-white rounded-lg shadow-md p-4 transform transition-transform hover:scale-105">
                <h1 className="text-lg text-gray-700 font-medium">Gastos</h1>
                <p className="text-xl md:text-2xl text-gray-900 font-bold mt-2 text-center whitespace-nowrap">
                    R$ 200 mil
                </p>
            </div>

            <div className="flex flex-col items-center justify-center w-full max-w-[200px] min-h-[150px] bg-white rounded-lg shadow-md p-4 transform transition-transform hover:scale-105">
                <h1 className="text-lg text-gray-700 font-medium">Operadores</h1>
                <p className="text-3xl text-gray-900 font-bold mt-2">
                    {data.employees}
                </p>
            </div>

            <div className="flex flex-col items-center justify-center w-full max-w-[200px] min-h-[150px] bg-white rounded-lg shadow-md p-4 transform transition-transform hover:scale-105">
                <h1 className="text-lg text-gray-700 font-medium">Progresso</h1>
                <div className="mt-2 flex items-center gap-1">
                    <p className="text-3xl text-gray-900 font-bold">
                        {data.progress}
                    </p>
                    <span className="text-xl font-semibold">%</span>
                </div>
            </div>
            
        </div>
    );
}