import { useId } from "react"; 
import { classMerge } from "../../../utils/classMerge";

type Props = React.ComponentProps<"input"> & {
    legend?: string;
    legendColor?: string;
    containerClassName?: string;
}

export function InputForm({
    legend,
    type = "text",
    className,
    legendColor = "text-gray-950",
    containerClassName,
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
            <input
                id={id} 
                type={type}
                className={classMerge([
                    "flex-1 h-[26px] rounded-sm border border-gray-400 bg-white px-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-gray-500",
                    className
                ])}
                {...rest}
            />
        </div>
    )
}