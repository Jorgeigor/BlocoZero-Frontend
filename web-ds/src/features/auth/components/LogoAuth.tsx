import blocoZeroLogo  from '../../../assets/blocoZeroLogo.svg'
export function LogoAuth(){
    return(
        <div className="flex items-center justify-center w-1/2 h-screen bg-white-100">
            <img src={blocoZeroLogo} alt="Bloco Zero Logo" className="size-120" />
        </div>
    )
}