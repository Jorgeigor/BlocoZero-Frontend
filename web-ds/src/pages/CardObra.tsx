import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router";
import { Cards } from "../features/home/components/Cards";
import { ContentBox } from "../features/home/components/ContentBox";

const formatCompactCurrency = (value: number) => {
    if (value >= 1000000000) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 2
        }).format(value);
    } else if (value >= 1000000) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 2
        }).format(value);
    }
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const formatFullCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function CardObra() {
    const { id } = useParams();
    const [work, setWork] = useState<any>(null);
    const [budgetList, setBudgetList] = useState<any[]>([]);

    useEffect(() => {
        if (!id) return;
        
        const fetchData = async () => {
            try {
                const resWork = await fetch(`http://localhost:8080/work/specific/${id}`);
                const dataWork = await resWork.json();
                setWork(dataWork.work || dataWork);

                
                const resBudget = await fetch(`http://localhost:8080/budget/list/${id}`); 
                const dataBudget = await resBudget.json();
                
                if (dataBudget.budgets && Array.isArray(dataBudget.budgets)) {
                    setBudgetList(dataBudget.budgets);
                } else if (Array.isArray(dataBudget)) {
                    setBudgetList(dataBudget);
                }

            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };

        fetchData();
    }, [id]);

    const computedData = useMemo(() => {
        if (!budgetList || budgetList.length === 0) return { employees: 0, progress: "0" };

        const uniqueEmployees = new Set<string>();
        budgetList.forEach((item: any) => {
            if (item.Userfunction && item.name) {
                uniqueEmployees.add(item.name);
            }
        });

        let totalCustoOrcado = 0;   
        let totalValorExecutado = 0; 

        budgetList.forEach((item: any) => {
            const custoItem = Number(item.total) || 0;
            
            
            const progressoItem = (item.substage?.progress ?? item.stage?.progress ?? 0);
            
            totalCustoOrcado += custoItem;
            totalValorExecutado += (custoItem * (progressoItem / 100));
        });

        console.log("--- CÁLCULO DE PROGRESSO ---");
        console.log("Total Orçado (Soma dos itens):", totalCustoOrcado);
        console.log("Valor Executado (Ponderado):", totalValorExecutado);

        let finalProgress = 0;
        if (totalCustoOrcado > 0) {
            finalProgress = (totalValorExecutado / totalCustoOrcado) * 100;
        }

        console.log("Progresso Final (%):", finalProgress);

        return {
            employees: uniqueEmployees.size,
            progress: finalProgress.toFixed(1)
        };

    }, [budgetList]); 


    if (!work) {
        return <div className="p-8 text-center text-gray-500">Carregando detalhes...</div>;
    }

    const cardsData = {
        budgetDisplay: formatCompactCurrency(work.budget || 0),
        budgetFull: formatFullCurrency(work.budget || 0),
        employees: computedData.employees,
        progress: computedData.progress
    };

    return (
        <div className="w-full flex flex-col items-center justify-center bg-white-100 p-4">
            <ContentBox data={work} />
            <Cards data={cardsData} />
        </div>
    );
}