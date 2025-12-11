import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface BackendOption {
    type: string;
    unit: string;
    work_id: number;
}

type Props = React.ComponentProps<"select"> & {
    legend?: string;
    propertyKey: keyof BackendOption;
};

export function Select({ legend, propertyKey, ...rest }: Props) {
    const [options, setOptions] = useState<string[]>([]);
    const { work_id } = useParams();

    useEffect(() => {
        const getOptions = async () => {
            try {
                const response = await fetch(`http://localhost:8080/items/list/${work_id}`);
                const data = await response.json();
                const allValues = data.itemsByWorkId.map((item: BackendOption) => item[propertyKey]);
                const uniqueValues = [...new Set(allValues)];
                setOptions(uniqueValues.map(String));
            } catch (error) {
                console.error("Falha ao buscar opções:", error);
            }
        };
        getOptions();
    }, [work_id, propertyKey]); 
    return (
        <fieldset className="flex flex-1 flex-col text-gray-950">
            {legend && (
                <legend className="text-sm font-semibold mb-2 text-inherit">
                    {legend}
                </legend>
            )}
            <select
                className="w-full h-12 rounded-lg border border-gray-300 px-4 text-sm text-gray-400 bg-transparent outline-none focus:border-2 focus:border-green-100 placeholder-gray-300"
                {...rest}
            >
                <option value="">Selecione</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </fieldset>
    );
}
