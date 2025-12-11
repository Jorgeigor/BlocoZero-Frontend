import { useEffect, useState } from "react";
import { z, ZodError } from "zod";
import { InputForm } from "../InputForm";
import { SelectForm } from "../SelectForm";
import { Button } from "../../../auth/components/Button";
import editarSvg from "../../../../assets/editar.svg";
import incluirSvg from "../../../../assets/incluir.svg";
import deletarSvg from "../../../../assets/deletar.svg";
import { api } from "../../../../services/api";

interface SubetapasPanelProps {
    workId: string; 
    selectedStage: { id: number, name: string } | null;
}

interface SubstageData {
    id_substage: number;
    stage_id: number;
    name: string;
    expDuration?: string;
    exp_duration?: string;
    progress: number;
    
    substageEmployes?: {
        userId: number;
        hours: number;
        userFunction: string;
        user?: { name: string }; 
    }[];

    substageStocks?: {
        materialStockId: number;
        quantityUsed: number;
        materialStock?: { name: string; unitMeasure: string };
    }[];
}

interface EmployeeOption { id_user: number; name: string; }
interface StockOption { id_stock?: number; id_item?: number; name: string; unitMeasure: string; }

interface TempEmployee {
    user_id: number;
    name: string;
    hours_worked: number;
    userfunction: string;
}

interface TempMaterial {
    item_id: number;
    name: string;
    quantity_usage: number;
    unit: string;
}

const substageSchema = z.object({
    name: z.string().min(3, "Nome obrigatório"),
    expDuration: z.string().min(1, "Data Fim obrigatória"),
    progress: z.coerce.number().min(0).max(100).optional(),
});

export function SubetapasPanel({ workId, selectedStage }: SubetapasPanelProps) {
    
    if (!selectedStage) {
        return (
            <div className="h-[200px] flex flex-col items-center justify-center bg-gray-50 border border-gray-300 rounded text-gray-500">
                <p className="font-medium text-lg">Nenhuma etapa selecionada</p>
                <p className="text-sm">Vá na aba "Etapas" e clique em "Ver Subetapas"</p>
            </div>
        );
    }

    const [isVisible, setIsVisible] = useState(false);
    const [substages, setSubstages] = useState<SubstageData[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const [availableEmployees, setAvailableEmployees] = useState<EmployeeOption[]>([]);
    const [availableStock, setAvailableStock] = useState<StockOption[]>([]);

    const [formData, setFormData] = useState({ name: "", expDuration: "", progress: "0" });
    const [tempEmployees, setTempEmployees] = useState<TempEmployee[]>([]);
    const [tempMaterials, setTempMaterials] = useState<TempMaterial[]>([]);

    const [addEmp, setAddEmp] = useState({ user_id: "", hours: "", func: "" });
    const [addMat, setAddMat] = useState({ item_id: "", qtd: "" });

    const fetchResources = async () => {
        try {
            const resEmp = await api.get(`/user/list/${1}`); 
            const rawEmp = resEmp.data;
            let empList: EmployeeOption[] = [];
            if (Array.isArray(rawEmp)) empList = rawEmp;
            else if (rawEmp.users && Array.isArray(rawEmp.users)) empList = rawEmp.users;
            
            setAvailableEmployees(empList);

            const resStock = await api.get(`/stock/list/${workId}`);
            const rawStock = resStock.data;
            let stockList: StockOption[] = [];
            if (Array.isArray(rawStock)) stockList = rawStock;
            else if (rawStock.stock && Array.isArray(rawStock.stock)) stockList = rawStock.stock;
            
            setAvailableStock(stockList);
        } catch (error) {
            console.warn("Erro recursos", error);
            setAvailableEmployees([]); 
            setAvailableStock([]);
        }
    };

    const fetchSubstages = async () => {
        if (!selectedStage) return;
        try {
            const response = await api.get(`/substage/list/${workId}`);
            const data = response.data;
            
            let allSubstages: any[] = [];

            if (data && data.subStages) {
                allSubstages = data.subStages.flat();
            } else if (Array.isArray(data)) {
                allSubstages = data.flat();
            }

            const filteredList = allSubstages.filter((item: any) => {
                const sId = item.stageId || (item.substage && item.substage.stageId);
                return Number(sId) === Number(selectedStage.id);
            });

            const listaLimpa = filteredList.map((item: any) => item.substage ? item.substage : item);
            
            setSubstages(listaLimpa);
        } catch (error) {
            console.error("Erro ao buscar subetapas:", error);
            setSubstages([]);
        }
    };

    useEffect(() => {
        if (selectedStage && workId) {
            fetchResources();
            fetchSubstages();
            setIsVisible(false);
            setSelectedId(null);
            setFormData({ name: "", expDuration: "", progress: "0" });
            setTempEmployees([]);
            setTempMaterials([]);
        }
    }, [selectedStage, workId]);

    const getEmployeeName = (emp: any) => {
        if (emp.user && emp.user.name) return emp.user.name;
        const found = availableEmployees.find(u => u.id_user === emp.userId);
        return found ? found.name : `ID: ${emp.userId}`;
    };

    const getMaterialName = (stock: any) => {
        if (stock.materialStock && stock.materialStock.name) {
            return `${stock.materialStock.name} (${stock.materialStock.unitMeasure})`;
        }
        const found = availableStock.find(s => (s.id_stock || s.id_item) === stock.materialStockId);
        return found ? `${found.name} (${found.unitMeasure})` : `ID: ${stock.materialStockId}`;
    };

    const handleAddEmployee = () => {
        if (!addEmp.user_id || !addEmp.hours || !addEmp.func) return false;
        const user = availableEmployees.find(u => u.id_user === Number(addEmp.user_id));
        if (!user) return false;

        setTempEmployees(prev => [...prev, {
            user_id: user.id_user,
            name: user.name,
            hours_worked: Number(addEmp.hours),
            userfunction: addEmp.func
        }]);
        setAddEmp({ user_id: "", hours: "", func: "" });
        return true;
    };

    const handleAddMaterial = () => {
        if (!addMat.item_id || !addMat.qtd) return false;
        const stockItem = availableStock.find(s => (s.id_stock || s.id_item) === Number(addMat.item_id));
        if (!stockItem) return false;

        setTempMaterials(prev => [...prev, {
            item_id: Number(addMat.item_id),
            name: stockItem.name,
            quantity_usage: Number(addMat.qtd),
            unit: stockItem.unitMeasure
        }]);
        setAddMat({ item_id: "", qtd: "" });
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (addEmp.user_id && addEmp.hours && addEmp.func) {
                if(!window.confirm("Incluir funcionário pendente antes de salvar?")) return;
                handleAddEmployee();
                return;
            }

            setLoading(true);
            const data = substageSchema.parse({
                name: formData.name, 
                expDuration: formData.expDuration,
                progress: formData.progress
            });
            
            const formattedDate = new Date(data.expDuration).toISOString(); 

            const payload = {
                id_work: Number(workId), 
                stage_id: Number(selectedStage.id),
                name: data.name,
                expDuration: formattedDate,
                
                progress: selectedId ? Number(data.progress) : 0,
                
                employees: tempEmployees.map(e => ({
                    user_id: Number(e.user_id),
                    hours_worked: Number(e.hours_worked),
                    userfunction: e.userfunction
                })),
                items_usage: tempMaterials.map(m => ({
                    item_id: Number(m.item_id),
                    quantity_usage: Number(m.quantity_usage)
                }))
            };

            console.log("Enviando Subetapa:", payload);

            if (selectedId) {
                await api.put(`/substage/update/${selectedId}`, payload);
                alert("Subetapa atualizada!");
            } else {
                await api.post("/substage/register", payload);
                alert("Subetapa criada com sucesso!");
            }

            setIsVisible(false);
            setFormData({ name: "", expDuration: "", progress: "0" });
            setTempEmployees([]);
            setTempMaterials([]);
            setSelectedId(null);
            fetchSubstages();

        } catch (error) {
            console.error(error);
            if (error instanceof ZodError) alert(error.issues[0].message);
            // @ts-ignore
            else if (error.response?.data?.error) alert(error.response.data.error);
            // @ts-ignore
            else if (error.response?.data?.message) alert(error.response.data.message);
            else alert("Erro ao salvar subetapa.");
        } finally {
            setLoading(false);
        }
    };

    
    const handleEditClick = () => {
        if (!selectedId) return;
        const item = substages.find(s => s.id_substage === selectedId);
        if (item) {
            const rawDate = item.expDuration || item.exp_duration;
            setFormData({
                name: item.name,
                expDuration: rawDate ? String(rawDate).split('T')[0] : '',
                progress: String(item.progress || 0)
            });

            setTempEmployees([]); 
            setTempMaterials([]);
            setIsVisible(true);
        }
    };

    const handleDeleteClick = async () => {
        if (!selectedId || !window.confirm("Excluir subetapa?")) return;
        try {
            await api.delete(`/substage/delete/${selectedId}`);
            fetchSubstages();
            setSelectedId(null);
        } catch(e) { console.error(e); alert("Erro ao excluir."); }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="overflow-y-scroll h-[350px] pb-4">
             <div className="flex justify-between items-center mb-2 px-1">
                <h3 className="text-sm font-bold text-gray-700">
                    Etapa: <span className="text-blue-600 uppercase">{selectedStage.name}</span>
                </h3>
            </div>

            {isVisible && (
                <div className="w-full py-2 px-4 bg-white rounded-lg shadow-md mb-2 border border-gray-200 text-sm">
                    
                    <div className="flex gap-4 mb-3">
                        <InputForm legend="Nome Subetapa:" name="name" value={formData.name} onChange={handleInputChange} containerClassName="w-1/3" />
                        <InputForm legend="Previsão Fim:" type="date" name="expDuration" value={formData.expDuration} onChange={handleInputChange} containerClassName="w-1/3" />
                        {selectedId && <InputForm legend="Progresso (%):" type="number" name="progress" value={formData.progress} onChange={handleInputChange} containerClassName="w-1/3" />}
                    </div>
                    
                    {!selectedId && (
                        <>
                            <div className="mb-3 bg-gray-50 p-2 rounded border border-gray-200">
                                <h5 className="font-semibold text-xs text-gray-500 mb-1">Alocar Mão de Obra</h5>
                                <div className="flex gap-2 items-end">
                                    <SelectForm legend="Funcionário" value={addEmp.user_id} onChange={e => setAddEmp({...addEmp, user_id: e.target.value})} containerClassName="w-1/3">
                                        <option value="">Selecione...</option>
                                        {availableEmployees.map(u => <option key={u.id_user} value={u.id_user}>{u.name}</option>)}
                                    </SelectForm>
                                    <InputForm legend="Horas:" type="number" value={addEmp.hours} onChange={e => setAddEmp({...addEmp, hours: e.target.value})} containerClassName="w-1/3" />
                                    <InputForm legend="Função:" value={addEmp.func} onChange={e => setAddEmp({...addEmp, func: e.target.value})} containerClassName="w-1/3" />
                                    <button type="button" onClick={handleAddEmployee} className="bg-green-500 text-white px-3 py-1 rounded text-xs h-[28px] mb-[2px] font-bold">+</button>
                                </div>
                                <div className="mt-1 flex flex-wrap gap-1">
                                    {tempEmployees.map((t, i) => (
                                        <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1">
                                            {t.name} ({t.hours_worked}h)<button type="button" onClick={() => setTempEmployees(prev => prev.filter((_, idx) => idx !== i))} className="text-red-500 ml-1">x</button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-3 bg-gray-50 p-2 rounded border border-gray-200">
                                <h5 className="font-semibold text-xs text-gray-500 mb-1">Alocar Materiais</h5>
                                <div className="flex gap-2 items-end">
                                    <SelectForm legend="Material" value={addMat.item_id} onChange={e => setAddMat({...addMat, item_id: e.target.value})} containerClassName="w-1/2">
                                        <option value="">Selecione...</option>
                                        {availableStock.map(s => {
                                            const id = s.id_stock || s.id_item;
                                            return <option key={id} value={id}>{s.name} ({s.unitMeasure})</option>;
                                        })}
                                    </SelectForm>
                                    <InputForm legend="Qtd:" type="number" value={addMat.qtd} onChange={e => setAddMat({...addMat, qtd: e.target.value})} containerClassName="w-1/4" />
                                    <button type="button" onClick={handleAddMaterial} className="bg-green-500 text-white px-3 py-1 rounded text-xs h-[28px] mb-[2px] font-bold">+</button>
                                </div>
                                <div className="mt-1 flex flex-wrap gap-1">
                                    {tempMaterials.map((m, i) => (
                                        <span key={i} className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded border border-orange-200 flex items-center gap-1">
                                            {m.name}: {m.quantity_usage} {m.unit} <button type="button" onClick={() => setTempMaterials(prev => prev.filter((_, idx) => idx !== i))} className="text-red-500 ml-1">x</button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex gap-2 mt-2 justify-end">
                        <Button onClick={handleSubmit} className="px-4 py-1 text-sm bg-gray-350 hover:bg-gray-300 border border-gray-400 text-black">
                            {loading ? "Salvando..." : selectedId ? "Salvar Alterações" : "Confirmar"}
                        </Button>
                        <Button onClick={() => setIsVisible(false)} className="px-4 py-1 text-sm bg-red-200 text-red-800 hover:bg-red-300 border border-gray-400">
                            Cancelar
                        </Button>
                    </div>
                </div>
            )}

            <div className="flex justify-end mt-2 gap-2">
                <Button onClick={() => { setIsVisible(true); setSelectedId(null); setFormData({name:"", expDuration:"", progress: "0"}); setTempEmployees([]); setTempMaterials([]); }} className="flex gap-2 px-3 py-1 text-sm bg-gray-350 border border-gray-400 hover:bg-gray-300">
                    <img src={incluirSvg} className="w-4 h-4" /> Incluir
                </Button>
                <Button onClick={handleEditClick} className={`flex gap-2 px-3 py-1 text-sm border border-gray-400 ${selectedId ? 'bg-blue-100 hover:bg-blue-200' : 'bg-gray-350 opacity-50'}`}>
                    <img src={editarSvg} className="w-4 h-4" /> Editar
                </Button>
                <Button onClick={handleDeleteClick} className={`flex gap-2 px-3 py-1 text-sm border border-gray-400 ${selectedId ? 'bg-red-100 hover:bg-red-200' : 'bg-gray-350 opacity-50'}`}>
                    <img src={deletarSvg} className="w-4 h-4" /> Excluir
                </Button>
            </div>

            <table className="bg-white border border-gray-300 w-full text-left mt-2 text-sm">
                <thead>
                    <tr className="bg-gray-300">
                        <th className="px-1 border-1">Subetapa</th>
                        <th className="px-1 border-1">Equipe</th>
                        <th className="px-1 border-1">Materiais</th>
                        <th className="px-1 border-1">Fim Previsto</th>
                        <th className="px-1 border-1">Prog.</th>
                    </tr>
                </thead>
                <tbody>
                    {substages.length === 0 ? (
                        <tr><td colSpan={5} className="p-2 text-center text-gray-500">Nenhuma subetapa cadastrada.</td></tr>
                    ) : (
                        substages.map((item, index) => {
                            const uniqueKey = item.id_substage || index;
                            const rawDate = item.expDuration || item.exp_duration;
                            const dataFim = rawDate ? new Date(rawDate).toLocaleDateString() : "-";

                            return (
                                <tr key={uniqueKey} onClick={() => setSelectedId(selectedId === item.id_substage ? null : item.id_substage)} className={`cursor-pointer hover:bg-gray-50 ${selectedId === item.id_substage ? 'bg-blue-200' : ''}`}>
                                    <td className="px-1 border-1 align-bottom">{item.name || "Sem nome"}</td>
                                    
                                    <td className="px-1 border-1 text-xs align-middle">
                                        {item.substageEmployes && item.substageEmployes.length > 0 ? (
                                            <div className="flex flex-col gap-1 m-1">
                                                {item.substageEmployes.map((emp, idx) => (
                                                    <span key={idx} className="bg-white border border-gray-300 px-1 rounded shadow-sm block">
                                                        <strong>{getEmployeeName(emp)}</strong> ({emp.hours}h)
                                                    </span>
                                                ))}
                                            </div>
                                        ) : "-"}
                                    </td>

                                    <td className="px-1 border-1 text-xs align-middle">
                                        {item.substageStocks && item.substageStocks.length > 0 ? (
                                            <div className="flex flex-col gap-1 m-1">
                                                {item.substageStocks.map((stock, idx) => (
                                                    <span key={idx} className="bg-white border border-gray-300 px-1 rounded shadow-sm block">
                                                        {getMaterialName(stock)}: {stock.quantityUsed}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : "-"}
                                    </td>

                                    <td className="px-1 border-1 align-bottom">{dataFim}</td>
                                    <td className="px-1 border-1 align-bottom">{item.progress || 0}%</td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}