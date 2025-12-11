import { useActionState } from "react";
import { z, ZodError } from "zod";
import { AxiosError } from "axios";
import { useNavigate } from "react-router";

import { Button } from '../features/auth/components/Button';
import { InputAuth } from '../features/auth/components/InputAuth';
import { LogoAuth } from '../features/auth/components/LogoAuth';
import { api } from "../services/api"; 
import { useAuth } from "../hooks/useAuth"; 

const sigInScheme = z.object({
    email: z.string().email({ message: "E-mail inválido" }),
    password: z.string().trim().min(1, { message: "Informe a senha" }),
});

export function SignIn() {
    const [state, formAction, isLoading] = useActionState(signIn, null);
    
    const auth = useAuth();
    const navigate = useNavigate();

    async function signIn(_: any, formData: FormData) {
        try {
            const data = sigInScheme.parse({
                email: formData.get("email"),
                password: formData.get("password"),
            });

            const response = await api.post("/user/login", data);
            console.log("RESPOSTA DA API:", response.data);
            auth.save(response.data.user);
            const userRole = response.data.user.userFunction
            if (userRole === "manager"){
                navigate("/cadastro-obra");
                return null;
            }
            if(userRole === "tender"){
                navigate("/work");
                return null; 
            }

        } catch (error) {
            console.log(error);

            if (error instanceof ZodError) {
                return { message: error.issues[0].message };
            }
            if (error instanceof AxiosError) {
                console.log("DADOS COMPLETOS DO ERRO:", error.response?.data)
                return { message: error.response?.data.error };
            }
            return { message: "Não foi possível conectar ao servidor" };
        }
    }

    return (
        <div className="w-screen h-screen flex ">
            <div className="w-1/2 h-screen bg-blue-400 flex items-center justify-center">
                
                <form action={formAction} className='flex flex-col items-center justify-center gap-5 w-105 h-105 border-2 border-blue-400 bg-blue-400 drop-shadow-lg rounded-2xl  p-8 '>
                    <h1 className='text-white text-4xl font-semibold'>Conecte-se</h1>
                    
                    <InputAuth 
                        name="email" 
                        required 
                        legend="E-mail" 
                        type="email" 
                        className="text-gray-700"
                        placeholder="Seu@email.com" 
                    />
                    <InputAuth 
                        name="password" 
                        required 
                        legend="Senha" 
                        type="password" 
                        className="text-gray-700"
                        placeholder="Sua senha" 
                    />

                    {state?.message && (
                        <p className="text-sm text-red-100 text-center font-medium">
                            {state.message}
                        </p>
                    )}
                    
                    <Button type='submit' isLoading={isLoading}>Entrar</Button>
                </form>
            </div>
            <LogoAuth />
        </div>
    );
}