import { useEffect, useState } from "react";
import { z, ZodError } from "zod";
import { AxiosError } from "axios";
import { InputForm } from "../InputForm"; 
import { Button } from "../../../auth/components/Button"; 
import editarSvg from "../../../../assets/editar.svg";
import incluirSvg from "../../../../assets/incluir.svg";
import deletarSvg from "../../../../assets/deletar.svg";
import { api } from "../../../../services/api";

interface FuncionarioData {
    id_user: number;
    enterprise_id: number;
    userFunction: string;
    name: string;
    email: string;
    hourlyRate: number;
    phone?: string;
    works?: string;
    isActive: boolean;
}

const funcSchema = z.object({
    enterprise_id: z.coerce.number().int("O ID da empresa é inválido"),
    name: z.string().min(1, "O nome do funcionário é obrigatório"),
    userFunction: z.string().min(1, "A função do funcionário é obrigatória"),
    email: z.string().email("O email é inválido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres").optional().or(z.literal('')),
    phone: z.string().min(10, "O número de telefone é inválido"),
    works: z.string().min(1, "As obras atribuídas são obrigatórias"),
    hourlyRate: z.coerce.number().positive("O ganho por hora deve ser um valor positivo"),
});

interface Props {
    workId: string;
}

export function FuncionariosPanel({ workId }: Props) {
    const [isVisible, setIsVisible] = useState(false);
    
    const [funcionarios, setFuncionarios] = useState<FuncionarioData[]>([]);
    
    
    const [allUsers, setAllUsers] = useState<FuncionarioData[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    
    const ENTERPRISE_ID = "1"; 

    const [formFuncData, setFormFuncData] = useState({
        enterprise_id: ENTERPRISE_ID,
        name: "",
        userFunction: "",
        email: "",
        password: "123456",
        phone: "",
        works: workId, 
        hourlyRate: "",
    });

    
    useEffect(() => {
        setFormFuncData(prev => ({ ...prev, works: workId }));
    }, [workId]);

    const resetForm = () => {
        setFormFuncData({
            enterprise_id: ENTERPRISE_ID,
            name: "",
            userFunction: "",
            email: "",
            password: "123456",
            phone: "",
            works: workId, 
            hourlyRate: "",
        });
    };

    const fetchFuncionarios = async () => {
        try {
            
            const response = await api.get(`/user/list/${ENTERPRISE_ID}`);
            const todosAtivos = response.data.filter((user: any) => user.isActive === true);
            
            
            setAllUsers(todosAtivos);

           
            const apenasDestaObra = todosAtivos.filter((user: FuncionarioData) => 
                String(user.works) === String(workId)
            );
            
            setFuncionarios(apenasDestaObra);

        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFuncionarios();
    }, [workId]); 

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormFuncData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleNewClick = () => {
        resetForm();
        setSelectedId(null);
        setIsVisible(true);
    };

    const handleEditClick = () => {
        if (!selectedId) return alert("Por favor, selecione um funcionário na tabela para editar.");
        
        const funcToEdit = funcionarios.find((f) => f.id_user === selectedId);
        if (funcToEdit) {
            setFormFuncData({
                enterprise_id: String(funcToEdit.enterprise_id),
                name: funcToEdit.name,
                userFunction: funcToEdit.userFunction,
                email: funcToEdit.email,
                password: "123456", 
                phone: funcToEdit.phone || "",
                works: funcToEdit.works || workId, 
                hourlyRate: String(funcToEdit.hourlyRate),
            });
            setIsVisible(true);
        }
    };

    const handleDeleteClick = async () => {
        if (!selectedId) return alert("Por favor, selecione um funcionário na tabela para excluir.");
        if (!window.confirm("Tem certeza que deseja excluir este funcionário?")) return;

        try {
            setLoading(true);
            await api.delete(`/user/delete/${selectedId}`);
            alert("Funcionário excluído com sucesso!");
            setSelectedId(null);
            setIsVisible(false);
            resetForm();
            fetchFuncionarios();
        } catch (error) {
            console.error(error);
            if (error instanceof AxiosError) {
                alert(error.response?.data.message || "Erro ao excluir funcionário.");
            } else {
                alert("Não foi possível excluir o funcionário.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFuncSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const usuarioDuplicado = allUsers.find(u => 
            u.email === formFuncData.email && // Mesmo email
            String(u.works) !== String(workId) && 
            u.id_user !== selectedId 
        );

        if (usuarioDuplicado) {
            alert(`BLOQUEADO: O funcionário com email "${formFuncData.email}" já está cadastrado na Obra ID: ${usuarioDuplicado.works}.\n\nNão é permitido alocar o mesmo funcionário em duas obras simultaneamente.`);
            return; // Cancela o envio
        }
        // -----------------------------------------

        try {
            setLoading(true);
            const data = funcSchema.parse({
                name: formFuncData.name,
                enterprise_id: Number(formFuncData.enterprise_id),
                userFunction: formFuncData.userFunction,
                email: formFuncData.email,
                password: formFuncData.password,
                phone: formFuncData.phone,
                works: formFuncData.works,
                hourlyRate: Number(formFuncData.hourlyRate),
            });

            if (selectedId) {
                await api.put(`/user/update/${selectedId}`, data);
                alert("Funcionário atualizado com sucesso!");
            } else {
                await api.post("/user/register", data);
                alert("Funcionário cadastrado com sucesso!");
            }

            setIsVisible(false);
            resetForm();
            setSelectedId(null);
            fetchFuncionarios();

        } catch (error) {
            console.log(error);
            if (error instanceof ZodError) return alert(error.issues[0].message);
            if (error instanceof AxiosError) return alert(error.response?.data.message || "Erro na requisição");
            alert("Não foi possível realizar a solicitação");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="overflow-y-scroll h-[350px] pb-4">
            {isVisible && (
                <div className="w-full space-y-2 py-2 px-4 bg-white rounded-lg shadow-md mb-4 border border-gray-200">
                    <div className="flex flex-row items-center gap-6">
                        <InputForm 
                            legend="Nome do funcionário:" name="name" value={formFuncData.name} onChange={handleInputChange} containerClassName="w-1/3" 
                        />
                        <InputForm 
                            legend="Email:" name="email" value={formFuncData.email} onChange={handleInputChange} containerClassName="w-1/2" 
                        />
                        <InputForm 
                            legend="Função:" name="userFunction" value={formFuncData.userFunction} onChange={handleInputChange} containerClassName="w-1/3" 
                        />
                    </div>
                    <div className="flex flex-row items-center gap-10">
                        <InputForm 
                            legend="Número(Celular):" name="phone" value={formFuncData.phone} onChange={handleInputChange} containerClassName="w-1/3"
                        />
                        <InputForm 
                            legend="Ganho/h:" name="hourlyRate" value={formFuncData.hourlyRate} onChange={handleInputChange} containerClassName="w-1/3" 
                        />
                        <InputForm 
                            legend="ID Obra:" name="works" value={formFuncData.works} onChange={handleInputChange} containerClassName="w-1/3" 
                        />
                    </div>
                    
                    <div className="flex gap-2 mt-2 justify-end">
                        <Button 
                            className="px-4 py-1 text-sm bg-gray-350 hover:bg-gray-300 border border-gray-400 text-black" 
                            isLoading={loading} 
                            onClick={handleFuncSubmit} 
                            type="button"
                        >
                            {selectedId ? "Salvar Alterações" : "Confirmar"}
                        </Button>
                        <Button 
                            onClick={() => setIsVisible(false)} 
                            className="px-4 py-1 text-sm bg-red-200 text-red-800 hover:bg-red-300 border border-gray-400"
                        >
                            Cancelar
                        </Button>
                    </div>
                </div>
            )}

            <div className="flex justify-end mt-4 gap-2">
                <Button onClick={handleNewClick} className="flex items-center gap-2 px-4 h-[26px] text-sm bg-gray-350 text-black hover:bg-gray-300 rounded-none border border-gray-400">
                    <img src={incluirSvg} alt="incluir" className="w-4 h-4" />Incluir
                </Button>
                <Button 
                    onClick={handleEditClick}
                    className={`flex items-center gap-2 px-4 h-[26px] text-sm rounded-none border border-gray-400 ${selectedId ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 'bg-gray-350 opacity-50'}`}
                >
                    <img src={editarSvg} alt="editar" className="w-4 h-4" />Editar
                </Button>
                <Button 
                    onClick={handleDeleteClick} 
                    className={`flex items-center gap-2 px-4 h-[26px] text-sm rounded-none border border-gray-400 ${selectedId ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-gray-350 opacity-50'}`}
                >
                    <img src={deletarSvg} alt="excluir" className="w-4 h-4" />Excluir
                </Button>
            </div>

            <table className="bg-white border border-gray-500 w-full text-left mt-2 text-sm">
                <thead> 
                    <tr className="bg-gray-300">
                        <th className="px-1 border border-gray-400">Código</th>
                        <th className="px-1 border border-gray-400">Funcionário</th>
                        <th className="px-1 border border-gray-400">Ganho/h</th>
                        <th className="px-1 border border-gray-400">Função</th>
                    </tr>
                </thead>
                <tbody>
                    {funcionarios.length === 0 && !loading && (
                         <tr><td colSpan={4} className="text-center p-2 text-gray-500">Nenhum funcionário cadastrado nesta obra.</td></tr>
                    )}
                    {funcionarios.map((func) => (
                        <tr 
                            key={func.id_user} 
                            onClick={() => {
                                if (selectedId === func.id_user) {
                                    setSelectedId(null); 
                                    setIsVisible(false);
                                    resetForm();
                                } else {
                                    setIsVisible(false); 
                                    resetForm();         
                                    setSelectedId(func.id_user); 
                                }
                            }}
                            className={`cursor-pointer hover:bg-gray-50 border-b border-gray-300 ${selectedId === func.id_user ? 'bg-blue-200' : ''}`}
                        >
                            <td className="px-2 border border-gray-300">{func.id_user}</td>
                            <td className="px-2 border border-gray-300">{func.name}</td>
                            <td className="px-2 border border-gray-300">
                                {(func.hourlyRate || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </td>
                            <td className="px-2 border border-gray-300">{func.userFunction}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}