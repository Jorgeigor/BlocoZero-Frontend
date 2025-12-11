import { useEffect, useState } from "react";
import { SessionItem, type SessionItemProps } from "../features/home/components/Session"; 
import { api } from "../services/api";
import { Input } from "../features/home/components/Input";
import searchSvg from "../assets/search.svg"; 
import { Button } from "../features/home/components/Button"; 
import { Pagination } from "../features/home/components/Pagination"; 

interface Props {
    title: string;
    onSelect: (workId: string) => void;
}

export function ListaSelecaoObra({ title, onSelect }: Props) {
    const ENTERPRISE_ID = 1;

    const [allWorks, setAllWorks] = useState<SessionItemProps[]>([]); 
    const [filteredWorks, setFilteredWorks] = useState<SessionItemProps[]>([]); 
    const [searchTerm, setSearchTerm] = useState("");
    
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchWorks = async () => {
            try {
                const response = await api.get(`/work/list/${ENTERPRISE_ID}`);
                const data = response.data;
                
                let list: SessionItemProps[] = [];
                
                if (Array.isArray(data)) list = data;
                else if (data.works && Array.isArray(data.works)) list = data.works;
                
                setAllWorks(list);
                setFilteredWorks(list);
            } catch (error) {
                console.error("Erro ao buscar obras:", error);
            }
        };
        fetchWorks();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const term = searchTerm.toLowerCase();
        const filtered = allWorks.filter(w => w.title.toLowerCase().includes(term));
        setFilteredWorks(filtered);
        setPage(1); 
    };
    
    const totalOfPage = Math.ceil(filteredWorks.length / itemsPerPage) || 1;
    const paginatedWorks = filteredWorks.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    function handlePagination(action: "next" | "previous"){
        setPage((prevPage) => {
            if(action === "next" && prevPage < totalOfPage) return prevPage + 1;
            if(action === "previous" && prevPage > 1) return prevPage - 1;
            return prevPage;
        })
    }

    return (
        <div className="flex justify-center p-6 overflow-y-scroll max-h-[480px]">
            
            <main className="bg-white rounded-xl p-10 w-[768px] flex flex-col shadow-lg">
                
                <h1 className="text-gray-800 font-bold text-xl flex-1 mb-2">
                    {title}
                </h1>
                
                <form onSubmit={handleSearch} className="flex flex-1 items-center justify-between mb-2 pb-6 border-b-[1px] border-b-gray-400 md:flex-row gap-2 mt-6">
                    
                        <Input 
                            onChange={(e: any) => setSearchTerm(e.target.value)} 
                            placeholder="Pesquisar obra pelo nome..."
                        />
                    
                    <Button variant="icon" type="submit">
                        {searchSvg ? <img src={searchSvg} alt="Pesquisar" className="w-5" /> : "🔍"}
                    </Button>
                </form>

                <div className="my-4 flex flex-col gap-4 max-h-[282px] overflow-y-scroll">
                    {paginatedWorks.length > 0 ? (
                        paginatedWorks.map((work) => (
                            <div key={work.id_work} onClick={() => onSelect(work.id_work)}>
                                <SessionItem 
                                    data={work} 
                                    onClick={() => onSelect(work.id_work)}
                                />
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400 py-10">Nenhuma obra encontrada.</p>
                    )}
                </div>  
                    <Pagination 
                        current={page}
                        total={totalOfPage}
                        onNext={() => handlePagination("next")}
                        onPrevious={() => handlePagination("previous")}
                    />
                
            </main>
        </div>
    );
}