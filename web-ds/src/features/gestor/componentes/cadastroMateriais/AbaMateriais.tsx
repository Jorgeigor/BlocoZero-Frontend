import { useEffect, useState } from "react";
import { z, ZodError } from "zod";
import { AxiosError } from "axios";
import { InputForm } from "../InputForm";
import { SelectForm } from "../SelectForm";
import { Button } from "../../../auth/components/Button";
import editarSvg from "../../../../assets/editar.svg";
import incluirSvg from "../../../../assets/incluir.svg";
import deletarSvg from "../../../../assets/deletar.svg";
import { api } from "../../../../services/api";


interface StockData {
    id_stock: number;
    id_work: number;
    id_type: number;
    id_category: number;
    code: string;
    name: string;
    unitMeasure: string;
    stockQuantity: number;
    weightLength: number;
    minQuantity: number;
    costUnit: number;
    
    category?: { name: string }; 
}

// Para o select e exibição
interface CategoryOption {
    id: number;
    name: string;
    id_type: number;
}

interface TypeData {
    id: number;
    name: string;
    work_id: number;
}

const stockSchema = z.object({
    id_work: z.coerce.number().min(1, "ID da obra inválido"),
    id_type: z.coerce.number(), 
    id_category: z.coerce.number().min(1, "Selecione a categoria"),
    code: z.string().min(1, "O código é obrigatório"),
    name: z.string().min(1, "O nome é obrigatório"),
    unitMeasure: z.string().min(1, "Selecione a unidade"),
    stockQuantity: z.coerce.number().min(0),
    weightLength: z.coerce.number().min(0),
    minQuantity: z.coerce.number().min(0),
    costUnit: z.coerce.number().min(0),
});

interface Props {
    workId: string;
}

export function MateriaisPanel({ workId }: Props) {
    
    const [isVisible, setIsVisible] = useState(false);
    const [stocks, setStocks] = useState<StockData[]>([]);
    const [categories, setCategories] = useState<CategoryOption[]>([]); 
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        id_work: workId,
        id_type: "1", 
        id_category: "",
        code: "",
        name: "",
        unitMeasure: "",
        stockQuantity: "",
        weightLength: "",
        minQuantity: "15",
        costUnit: "0.00",
    });

    const fetchCategoriesForWork = async () => {
        try {
            const resTypes = await api.get(`/type/list/${workId}`);
            const types = resTypes.data.types || resTypes.data || [];
            
            if (!Array.isArray(types)) return;

            let allCats: CategoryOption[] = [];
            
            for (const type of types) {
                try {
                    if (Number(type.work_id) === Number(workId)) {
                        const resCat = await api.get(`/category/list/${type.id}`);
                        const cats = resCat.data.categories || resCat.data || [];
                        if (Array.isArray(cats)) {
                            allCats = [...allCats, ...cats];
                        }
                    }
                } catch (e) { /* ignora erro */ }
            }
            
            const uniqueCats = Array.from(new Set(allCats.map(a => a.id)))
                .map(id => allCats.find(a => a.id === id)!);

            setCategories(uniqueCats);

        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
        }
    };

    const fetchStocks = async () => {
        try {
            const response = await api.get(`/stock/list/${workId}`);
            const data = response.data;
            if (data && data.stock) setStocks(data.stock);
            else if (Array.isArray(data)) setStocks(data);
            else setStocks([]);
        } catch (error) {
            console.error("Erro ao buscar estoque:", error);
            setStocks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (workId) {
            setFormData(prev => ({ ...prev, id_work: workId }));
            fetchStocks();
            fetchCategoriesForWork(); 
        }
    }, [workId]);

    const resetForm = () => {
        setFormData({
            id_work: workId,
            id_type: "1",
            id_category: "",
            code: "",
            name: "",
            unitMeasure: "",
            stockQuantity: "",
            weightLength: "",
            minQuantity: "15",
            costUnit: "0.00",
        });
    };

    const getCategoryName = (id: number) => {
        const cat = categories.find(c => c.id === id);
        return cat ? cat.name : `ID ${id}`; 
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const catId = Number(e.target.value);
        const selectedCat = categories.find(c => c.id === catId);
        
        setFormData(prev => ({
            ...prev,
            id_category: e.target.value,
            id_type: selectedCat ? String(selectedCat.id_type) : prev.id_type
        }));
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNewClick = () => {
        resetForm();
        setSelectedId(null);
        setIsVisible(true);
    };

    const handleEditClick = () => {
        if (!selectedId) return alert("Selecione um item para editar.");
        const item = stocks.find((s) => s.id_stock === selectedId);
        if (item) {
            setFormData({
                id_work: String(item.id_work),
                id_type: String(item.id_type),
                id_category: String(item.id_category),
                code: item.code,
                name: item.name,
                unitMeasure: item.unitMeasure,
                stockQuantity: String(item.stockQuantity),
                weightLength: String(item.weightLength),
                minQuantity: String(item.minQuantity),
                costUnit: String(item.costUnit || 0),
            });
            setIsVisible(true);
        }
    };

    const handleDeleteClick = async () => {
        if (!selectedId) return alert("Selecione um item para excluir.");
        if (!window.confirm("Deseja remover este item do estoque?")) return;
        try {
            setLoading(true);
            await api.delete(`/stock/delete/${selectedId}`);
            alert("Item removido com sucesso!");
            setSelectedId(null);
            setIsVisible(false);
            resetForm();
            fetchStocks();
        } catch (error) {
            console.error(error);
            alert("Erro ao excluir.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const data = stockSchema.parse(formData);
            
            // Backend espera 'category' ou 'id_category'? Mando ambos por garantia.
            const payload = { 
                ...data, 
                category: data.id_category, 
                id_category: data.id_category 
            };

            if (selectedId) {
                await api.put(`/stock/update/${selectedId}`, payload);
                alert("Estoque atualizado!");
            } else {
                await api.post("/stock/create", payload);
                alert("Item criado com sucesso!");
            }
            setIsVisible(false);
            resetForm();
            setSelectedId(null);
            fetchStocks();
        } catch (error) {
            console.log("Erro detalhado:", error);
            if (error instanceof ZodError) return alert(error.issues[0].message);
            if (error instanceof AxiosError) return alert(error.response?.data?.error || "Erro na API");
            alert("Erro desconhecido");
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
                            legend="Código:" name="code" value={formData.code}
                            onChange={handleInputChange} containerClassName="flex-1"
                        />
                        
                        <SelectForm
                            legend="Categoria:" name="id_category" value={formData.id_category}
                            onChange={handleCategoryChange} 
                            containerClassName="flex-1"
                        >
                            <option value="">Selecione...</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </SelectForm>
                    </div>

                    <div className="flex flex-row items-center gap-4">
                        <InputForm
                            legend="Nome do material:" name="name" value={formData.name}
                            onChange={handleInputChange} containerClassName="w-1/3"
                        />
                        <SelectForm
                            legend="Unidade:" name="unitMeasure" value={formData.unitMeasure}
                            onChange={handleInputChange} containerClassName="w-1/6"
                        >
                            <option value="">...</option>
                            <option value="M³">M³</option>
                            <option value="kg">kg</option>
                            <option value="L">L</option>
                            <option value="m">m</option>
                            <option value="un">un</option>
                        </SelectForm>
                        
                        <InputForm
                            legend="Peso/Comp:" name="weightLength" value={formData.weightLength}
                            onChange={handleInputChange} type="number" containerClassName="flex-1"
                        />
                         <InputForm
                            legend="Custo Unit (R$):" name="costUnit" value={formData.costUnit}
                            onChange={handleInputChange} type="number" step="0.01" containerClassName="flex-1"
                        />
                    </div>

                    <div className="flex flex-row items-center gap-10">
                        <InputForm
                            legend="Qtd Inicial:" name="stockQuantity" value={formData.stockQuantity}
                            onChange={handleInputChange} type="number" containerClassName="w-1/3"
                        />
                        <InputForm
                            legend="Estoque Mínimo:" name="minQuantity" value={formData.minQuantity}
                            onChange={handleInputChange} type="number" containerClassName="w-1/3"
                        />
                    </div>

                    <div className="flex gap-2 mt-2 justify-end">
                        <Button onClick={handleSubmit} className="px-4 py-1 text-sm bg-gray-350 hover:bg-gray-300  border border-gray-400 text-black">
                            {selectedId ? "Salvar Alterações" : "Confirmar"}
                        </Button>
                        <Button onClick={() => setIsVisible(false)} className="px-4 py-1 text-sm bg-red-200 text-red-800 hover:bg-red-300  border border-gray-400">
                            Cancelar
                        </Button>
                    </div>
                </div>
            )}

            <div className="flex justify-end mt-2 gap-2">
                <Button onClick={handleNewClick} className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-350 border border-gray-400 hover:bg-gray-300">
                    <img src={incluirSvg} alt="incluir" className="w-4 h-4"/> Incluir
                </Button>
                <Button onClick={handleEditClick} className={`flex items-center gap-2 px-3 py-1 text-sm border border-gray-400 ${selectedId ? 'bg-blue-100 hover:bg-blue-200' : 'bg-gray-350 opacity-50'}`}>
                    <img src={editarSvg} alt="editar" className="w-4 h-4"/> Editar
                </Button>
                <Button onClick={handleDeleteClick} className={`flex items-center gap-2 px-3 py-1 text-sm border border-gray-400 ${selectedId ? 'bg-red-100 hover:bg-red-200' : 'bg-gray-350 opacity-50'}`}>
                    <img src={deletarSvg} alt="deletar" className="w-4 h-4"/> Excluir
                </Button>
            </div>

            <table className="bg-white border-1 border-gray-500 w-full text-left mt-2 text-sm">
                <thead>
                    <tr className="bg-gray-300">
                        <th className="px-1 border-1">Código</th>
                        <th className="px-1 border-1">Nome</th>
                        <th className="px-1 border-1">Categoria</th>
                        <th className="px-1 border-1">Unidade</th>
                        <th className="px-1 border-1">Qtd Atual</th>
                        <th className="px-1 border-1">Minimo</th>
                        <th className="px-1 border-1">Custo Un.</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.length === 0 && !loading && (
                        <tr><td colSpan={7} className="text-center p-2 text-gray-500">Nenhum item encontrado.</td></tr>
                    )}
                    {stocks.map((item) => (
                        <tr
                            key={item.id_stock}
                            onClick={() => setSelectedId(selectedId === item.id_stock ? null : item.id_stock)}
                            className={`cursor-pointer hover:bg-gray-50 ${selectedId === item.id_stock ? 'bg-blue-200' : ''}`}
                        >
                            <td className="px-2 border-1">{item.code}</td>
                            <td className="px-2 border-1">{item.name}</td>
                            
                            <td className="px-2 border-1">
                                {item.category?.name || getCategoryName(item.id_category)}
                            </td>
                            
                            <td className="px-2 border-1">{item.unitMeasure}</td>
                            <td className="px-2 border-1">{item.stockQuantity}</td>
                            <td className="px-2 border-1">{item.minQuantity}</td>
                            <td className="px-2 border-1">
                                {item.costUnit ? `R$ ${Number(item.costUnit).toFixed(2)}` : '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}