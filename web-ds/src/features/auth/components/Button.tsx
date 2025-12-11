type Props = React.ComponentProps<"button"> &{
    isLoading?: boolean
}

export function Button({ children, isLoading, type = "button", ...rest}: Props){
    return(
        <button type={type} disabled={isLoading} className="flex items-center justify-center rounded-3xl bg-green-400 text-white cursor-pointer hover:bg-green-350 transition ease-linear disabled:opacity-50 disabled:cursor-progress w-32 h-12 " {...rest} >{children}</button>
    )
}