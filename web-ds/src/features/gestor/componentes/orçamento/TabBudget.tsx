import { useEffect, useState } from "react";
import { api } from "../../../../services/api";
import searchIcon from "../../../../assets/search-icon.svg";

interface TabBudgetProps {
    workId: number;
}

interface BudgetData {
    id_budget: number;
    code: string;
    name: string;
    cost: number;          
    total: number;         
    quantityUsage: number; 
    hours: number;         
    extraHours: number;    
    
    Userfunction: string;  
    
    type?: { name: string };
    category?: { name: string };
    stage?: { name: string };
}

export function TabBudget({ workId }: TabBudgetProps) {
    

    const [budgets, setBudgets] = useState<BudgetData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!workId) return;

        const loadData = async () => {
            try {
                setLoading(true);

                const response = await api.get(`/budget/list/${workId}`);
                
                const budgetData = response.data;
                
                if (budgetData && budgetData.budgets) {
                    setBudgets(budgetData.budgets);
                } else if (Array.isArray(budgetData)) {
                    setBudgets(budgetData);
                } else {
                    setBudgets([]);
                }

            } catch (error) {
                console.error("Erro ao carregar dados do orçamento.", error);
                setBudgets([]); 
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [workId]); 

    const filteredBudgets = budgets.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <main className="p-5"><p>Carregando dados do orçamento...</p></main>;
    }

    return (
        <main className="p-5">
            
            <div className="flex justify-center mb-4">
                <div className="relative w-64"> 
                    <input
                        type="text"
                        placeholder="Pesquisar por nome ou código..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-4 py-1 rounded-full border border-gray-400 text-sm focus:outline-none focus:border-gray-600 bg-gray-50"
                    />
                    <img
                        src={searchIcon}
                        alt="Buscar"
                        className="absolute left-2.5 top-1.5 w-4 h-4 opacity-50"
                    />
                </div>
            </div>

            <div className="w-full overflow-y-scroll max-h-[310px] border border-gray-300 bg-white rounded-lg shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-2 py-2 border-r border-gray-200 font-semibold text-gray-700">Código</th>
                                <th className="px-2 py-2 border-r border-gray-200 font-semibold text-gray-700">Nome</th>
                                <th className="px-2 py-2 border-r border-gray-200 font-semibold text-gray-700">Tipo</th>
                                <th className="px-2 py-2 border-r border-gray-200 font-semibold text-gray-700">Categoria</th>
                                <th className="px-2 py-2 border-r border-gray-200 font-semibold text-gray-700">Etapa</th>
                                
                                <th className="px-2 py-2 border-r border-gray-200 font-semibold text-gray-700">Função</th>
                                <th className="px-2 py-2 border-r border-gray-200 font-semibold text-gray-700 text-center">Qtd.</th>
                                <th className="px-2 py-2 border-r border-gray-200 font-semibold text-gray-700 text-center">Horas</th>
                                <th className="px-2 py-2 border-r border-gray-200 font-semibold text-gray-700 text-center">H. Extras</th>
                                <th className="px-2 py-2 border-r border-gray-200 font-semibold text-gray-700 text-right">Custo Unit.</th>
                                <th className="px-3 py-3 font-semibold text-gray-700 text-right">Total</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {filteredBudgets.length === 0 ? (
                                <tr>
                                    <td colSpan={11} className="text-center p-6 text-gray-500">
                                        Nenhum item encontrado.
                                        <br/><span className="text-xs text-gray-400">(Verifique se o backend está rodando)</span>
                                    </td>
                                </tr>
                            ) : (
                                filteredBudgets.map((item) => (
                                    <tr key={item.id_budget} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                                        <td className="px-3 py-2 border-r border-gray-200 text-xs font-mono text-gray-600">{item.code}</td>
                                        <td className="px-3 py-2 border-r border-gray-200 font-medium text-gray-800">{item.name}</td>
                                        
                                        <td className="px-3 py-2 border-r border-gray-200 text-gray-600">{item.type?.name || '-'}</td>
                                        <td className="px-3 py-2 border-r border-gray-200 text-gray-600">{item.category?.name || '-'}</td>
                                        <td className="px-3 py-2 border-r border-gray-200 text-gray-600">{item.stage?.name || '-'}</td>
                                        
                                        <td className="px-3 py-2 border-r border-gray-200 text-gray-600">{item.Userfunction || '-'}</td>
                                        <td className="px-3 py-2 border-r border-gray-200 text-center">{item.quantityUsage > 0 ? item.quantityUsage : '-'}</td>
                                        <td className="px-3 py-2 border-r border-gray-200 text-center">{item.hours > 0 ? item.hours : '-'}</td>
                                        <td className="px-3 py-2 border-r border-gray-200 text-center">{item.extraHours > 0 ? item.extraHours : '-'}</td>
                                        
                                        <td className="px-3 py-2 border-r border-gray-200 text-right text-gray-700">
                                            {Number(item.cost).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </td>
                                        
                                        <td className="px-3 py-2 text-right font-bold text-gray-800 bg-gray-50">
                                            {Number(item.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}