import { classMerge } from "../../../utils/classMerge"

type Props = React.ComponentProps<"input"> & {
    legend?: string
    legendColor?: string
    direction?: "row" | "column"
}

export function InputAuth({ legend, type="text", className, legendColor = "text-white", direction = "column", ...rest}: Props) {
    return(
        <fieldset className={
                direction === 'row'
                ? "flex flex-row items-center gap-4 w-full"
                : "flex flex-col gap-2 w-full"
            }>
            {legend && <legend className={`text-sm py-1 ${legendColor}`}>{legend}</legend>}
            <input type={type} className={classMerge(["w-full h-12 rounded-lg bg-white px-4 text-sm text-gray-500  outline-none focus:border-2 focus:border-gray-300  placeholder-gray-300", className])} {...rest} />
        </fieldset>
    )
}