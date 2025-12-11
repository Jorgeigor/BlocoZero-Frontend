import { useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom"; 
import { FilterStatic, type FiltersState } 
from "../features/estoque/components/Filter"; 
import { Table } from "../features/estoque/components/Table";

export function EstoqueObra() {
    const [filters, setFilters] = useState<FiltersState>({
        code: "",
        name: "",
        type: ""
    });

    const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="bg-white h-screen p-10 flex flex-col">
            <div className="mb-4">
                <Link to="/estoque" className="font-semibold text-blue-400 cursor-pointer hover:underline">
                    &larr; Voltar
                </Link>
            </div>

            <FilterStatic filters={filters} onFilterChange={handleFilterChange} />

            <Table filters={filters} />
        </div>
    );
}