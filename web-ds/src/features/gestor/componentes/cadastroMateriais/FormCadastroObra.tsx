import { useState } from "react";
import { InputForm } from "../InputForm"; 
import { TextareaAuth } from "../TextareaAuth";
import { Button } from "../../../home/components/Button";
import { z } from "zod";
import { api } from "../../../../services/api";

const workSchema = z.object({
  title: z.string().min(1, "O nome da obra é obrigatório"),
  id_entreprise: z.coerce.number().int(),
  id_manager: z.coerce.number().int(),
  cnpj: z.string().length(14, "O CNPJ deve ter exatamente 14 dígitos"),
  address: z.string().min(1, "O endereço é obrigatório"),
  cep: z.string().length(8, "O CEP deve ter exatamente 8 dígitos"),
  budget: z.coerce.number().positive(),
  start_time: z.coerce.date(),
  end_time: z.coerce.date(),
  description: z.string().min(1, "A descrição é obrigatória"),
  photo: z.instanceof(File).nullable().optional(), 
  tender_id: z.coerce.number().int(),
});

type Props = {
    onSuccess?: () => void;
}

export function FormCadastroObra({ onSuccess }: Props) {
    const [formData, setFormData] = useState({
        title: "",
        id_entreprise: "1",
        id_manager: "1",
        tender_id: "2",
        cnpj: "",
        address: "",
        cep: "",
        budget: "",
        start_time: "",
        end_time: "",
        description: "",
        photo: null as File | null,
        encarregado: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (file) setFormData(prevData => ({ ...prevData, photo: file }));
    };

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        const dataToSend = new FormData();

        try {
            setIsLoading(true);
            const parsedData = workSchema.parse(formData);

            dataToSend.append('title', parsedData.title);
            dataToSend.append('id_entreprise', String(parsedData.id_entreprise));
            dataToSend.append('id_manager', String(parsedData.id_manager));
            dataToSend.append('cnpj', parsedData.cnpj);
            dataToSend.append('address', parsedData.address);
            dataToSend.append('cep', parsedData.cep);
            dataToSend.append('budget', String(parsedData.budget));
            dataToSend.append('start_time', parsedData.start_time.toISOString());
            dataToSend.append('end_time', parsedData.end_time.toISOString());
            dataToSend.append('description', parsedData.description);
            dataToSend.append('tender_id', String(parsedData.tender_id));
            if (parsedData.photo) dataToSend.append('photo', parsedData.photo);

            await api.post("/work/register", dataToSend);
            alert("Obra cadastrada com sucesso!");
            
            if (onSuccess) onSuccess();

        } catch (error) {
           console.error(error);
        } finally {
            setIsLoading(false);
        }
    }
   
    return (
        <form onSubmit={onSubmit} className="w-full space-y-2 py-1 px-2 bg-white">
            <div className="flex flex-row px-4 items-center gap-6">
               <InputForm legend="Nome da obra:" name="title" value={formData.title} onChange={handleChange} containerClassName="flex-1" />
               <InputForm legend="CNPJ:" name="cnpj" value={formData.cnpj} onChange={handleChange} containerClassName="flex-1" />
               <InputForm legend="Encarregado:" name="encarregado" value={formData.encarregado} onChange={handleChange} containerClassName="flex-1" />
            </div>
            
             <div className="flex flex-row px-4 items-center gap-6">
                <InputForm legend="Endereço:" name="address" value={formData.address} onChange={handleChange} containerClassName="w-1/2" />
                <InputForm legend="CEP:" name="cep" value={formData.cep} onChange={handleChange} containerClassName="w-1/4" />
                <InputForm legend="Valor do contrato:" name="budget" type="number" value={formData.budget} onChange={handleChange} containerClassName="flex-1" />
            </div>

            <div className="flex flex-row px-4 items-center gap-6">
                <InputForm legend="Data de início:" name="start_time" type="date" value={formData.start_time} onChange={handleChange} containerClassName="w-1/3" />
                <InputForm legend="Previsão de término:" name="end_time" type="date" value={formData.end_time} onChange={handleChange} containerClassName="w-1/3" />
                <InputForm legend="Foto da obra:" name="photo" type="file" onChange={handleFileChange} containerClassName="flex-1" />
            </div>

            <div className="px-4 flex justify-between items-end gap-6">
                <TextareaAuth legend="Descrição:" name="description" value={formData.description} onChange={handleChange} />
                <Button variant="base" className="px-8 py-2 h-8 bg-gray-350 text-gray-950 hover:bg-gray-300 font-semibold rounded-sm" isLoading={isLoading} type="submit">
                    Registrar
                </Button>
            </div>

        </form>
    );
}