//import { useState } from 'react';
import { useState } from 'react';
import { Button } from '../features/auth/components/Button';
import { InputAuth } from '../features/auth/components/InputAuth';
import { LogoAuth } from '../features/auth/components/LogoAuth';

export function SignUp(){
    const [name, setName] = useState("")
    const [cpf, setCpf] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [isLoading, setIsloading] = useState(false)

    function onSubmit(e: React.FormEvent){
        e.preventDefault()
        console.log(name, cpf, email, password, passwordConfirm)
    }
    return(
        <div className="w-screen h-screen flex items-center justify-center bg-blue-400">
           <div className="w-1/2 h-screen bg-blue-400 flex items-center justify-center">
                <form onSubmit={onSubmit} className='flex flex-col items-center justify-center gap-5 w-105 border-2 border-blue-400 bg-blue-400 drop-shadow-lg rounded-2xl  p-8 '>
                    <h1 className='text-white text-3xl font-semibold'> Criar conta</h1>
                    <InputAuth required legend="Nome completo" type="text" placeholder="Seu nome" onChange={(e) => setName(e.target.value)}/>
                    <InputAuth required legend="CPF" type="text" placeholder="Seu CPF" onChange={(e) =>setCpf(e.target.value) } />
                    <InputAuth required legend="E-mail" type="email" placeholder="Seu@email.com" onChange={(e) => setEmail(e.target.value)}/>
                    <InputAuth required legend="Senha" type="password" placeholder="Sua senha" onChange={(e) => setPassword(e.target.value)}/>
                    <InputAuth required legend="Confirmar senha" type="password" placeholder="Confirmar senha" onChange={(e) => setPasswordConfirm(e.target.value)}/>
                    <Button type='submit' isLoading={isLoading}>Entrar</Button>
                    <a href="/" className='text-gray-300 cursor-pointer '>Já possui uma conta?</a>
                </form>
           </div>
           <LogoAuth />
        </div>
    )
}