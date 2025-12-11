import { classMerge } from "../../../utils/classMerge";

type Props = React.ComponentProps<"textarea"> & {
    legend?: string;
    legendColor?: string;
    containerClassName?: string;
}

export function TextareaAuth({
    legend,
    className,
    legendColor = "text-gray-950",
    containerClassName,
    ...rest
}: Props) {
    return (
        <fieldset
            className={classMerge([
                "flex flex-col gap-1",
                containerClassName
            ])}
        >
            {legend &&
                <legend className={`text-sm font-medium whitespace-nowrap ${legendColor}`}>
                    {legend}
                </legend>
            }
            <textarea
                className={classMerge([
                    "w-[631px] h-24 rounded-md border border-gray-400 bg-white p-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 resize-none",
                    className
                ])}
                {...rest}
            />
        </fieldset>
    )
}