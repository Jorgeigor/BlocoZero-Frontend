import dinheiroIcon from "../../../../assets/dinheiroIcon.svg"; 

type Props = {
    title: string;
    value: string | number;
    
}

export function CardOrçamento({ title, value }: Props) {
    return (
        <div className="w-[330px] h-[100px] flex items-center bg-gray-400 border border-gray-300 rounded-lg p-5 shadow-sm gap-6">
            <div className="p-2 rounded-full">
                <img src={dinheiroIcon} alt="Ícone" className="w-full h-full " />
            </div>
            
            <div className="flex flex-col gap-1">
                <h1 className="text-sm font-semibold text-gray-600">{title}</h1>
                <span className="text-2xl font-bold text-gray-800">{value}</span>
            </div>
        </div>
    );
}