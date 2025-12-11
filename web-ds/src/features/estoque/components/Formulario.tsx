import { useState } from "react";
import { z, ZodError } from "zod";
import { InputAuth } from "../../auth/components/InputAuth";
import { Button } from "../../home/components/Button";
import { Select } from "./Select";
import { api } from "../../../services/api";
import { AxiosError } from "axios";

const formSchema = z.object({
    name: z.string().min(1, "O nome do insumo é obrigatório"),
    type: z.string().min(1, "A categoria é obrigatória"),
    quantity: z.number().min(1, "Insira a quantidade"),
    unit: z.string().min(1, "A unidade é obrigatória"),
})
export function Formulario(){
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [quantity, setQuantity] = useState("")
    const [unit, setUnit] = useState("");
    const [isLoading, setIsloading] = useState(false)

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        try {
            setIsloading(true)

            const parsedData = formSchema.parse({ name, type, quantity: parseInt(quantity), unit });

            await api.post("/items/register", parsedData);
            alert("Insumo adicionado com sucesso!");
    }catch (error) {
            console.log(error)
            if (error instanceof ZodError) {
                return alert(error.issues[0].message)
        }

        if( error instanceof AxiosError) {
            return alert(error.response?.data.message)
        }

        alert("Não foi possivel cadastrar!")
    }finally {
        setIsloading(false)
        }
}

    return(
        <div className="bg-gray-200 p-6 mb-6 rounded">
            <div className="grid grid-cols-2 gap-4">
                <InputAuth required legend="Nome do insumo" legendColor="text-gray-950 font-semibold" className="bg-gray-300 w-xs h-10 text-gray-900 rounded-none" onChange={(e) => setName(e.target.value)}/>
                    <Select required propertyKey="type" legend="Categoria"  className="bg-gray-300 w-xs h-10 text-gray-900 rounded-none" onChange={(e) => setType(e.target.value)}/>
                    {/*<div className="flex items-center gap-4 my-6">
                        <legend className="font-semibold">Data</legend>
                        <InputAuth required type="date" className="bg-gray-300 w-[200px] h-10 text-gray-900 rounded-none"/>
                    </div>*/}
                    <InputAuth required legend="Quantidade" type="number" legendColor="text-gray-950 font-semibold" className="bg-gray-300 w-xs h-10 text-gray-900 rounded-none" onChange={(e) => setQuantity(e.target.value)}/>
                    <Select required propertyKey="unit" legend="Unidade"  className="bg-gray-300 w-xs h-10 text-gray-900 rounded-none" onChange={(e) => setUnit(e.target.value)}/>
            </div>
                <div className="flex w-full justify-center gap-4 mt-4">
                    <Button variant="base" className="px-4 py-2">Ocultar</Button>
                    <Button variant="base" isLoading={isLoading} onClick={onSubmit} className="px-4 py-2">Adicionar</Button>
                </div>
        </div>
    )
}