import { useId } from "react";
import { classMerge } from "../../../utils/classMerge";

type Props = React.ComponentProps<"select"> & {
    legend?: string;
    legendColor?: string;
    containerClassName?: string;
}

export function SelectForm({
    legend,
    className,
    legendColor = "text-gray-950",
    containerClassName,
    children, 
    ...rest
}: Props) {
    const id = useId();

    return (
        <div
            className={classMerge([
                "flex flex-row items-center gap-3",
                containerClassName
            ])}
        >
            {legend &&
                <label
                    htmlFor={id}
                    className={`text-sm font-medium whitespace-nowrap ${legendColor}`}
                >
                    {legend}
                </label>
            }
            
            <select
                id={id}
                className={classMerge([
                    
                    "flex-1 h-[26px] rounded-md border border-gray-400 bg-white px-2 text-sm text-gray-950 outline-none focus:ring-2 ",
                    className
                ])}
                {...rest}
            >
                {children} 
            </select>
        </div>
    )
}