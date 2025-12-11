import React from 'react';

export type SessionItemProps = {
    id_work: string
    title: string
    photo: string
    start_time: string
    end_time: string
}

type Props = React.ComponentProps<"a"> & {
    data: SessionItemProps
}

export function SessionItem({ data, ...rest }: Props) {
    const imageUrl = `data:image/jpeg;base64,${data.photo}`;

    // Função simples para formatar data (opcional, pode usar date-fns/dayjs)
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    return (
        <a 
            className="flex items-center gap-3 hover:bg-green-100/5 cursor-pointer rounded-md border border-gray-300 p-2 transition-colors"
            {...rest}
        >
            <img 
                className="w-10 h-10 rounded object-cover" 
                src={imageUrl} 
                alt={data.title} 
            />

            <div className="flex-1 flex flex-col">
                <strong className="text-sm text-gray-100 truncate">
                    {data.title}
                </strong>
                
                {/* Agora exibe o período ao invés de repetir o título */}
                <span className="text-xs text-gray-500">
                    {formatDate(data.start_time)} até {formatDate(data.end_time)}
                </span>
            </div>
        </a>
    )
}