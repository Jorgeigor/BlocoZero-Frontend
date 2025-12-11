import { useEffect, useState } from "react";
import { z, ZodError } from "zod";
import { InputForm } from "../InputForm";
import { SelectForm } from "../SelectForm"; 
import { Button } from "../../../auth/components/Button";
import incluirSvg from "../../../../assets/incluir.svg";
import editarSvg from "../../../../assets/editar.svg";
import deletarSvg from "../../../../assets/deletar.svg";
import { api } from "../../../../services/api";

interface CategoryData {
  id: number;
  name: string;
  id_type: number;
}

interface TypeData {
  id: number;
  name: string;
  work_id: number;
}

interface Props {
    workId: string;
}

const categorySchema = z.object({
  name: z.string().min(1, "O nome da categoria é obrigatório"),
  id_type: z.coerce.number().int().positive("Selecione um tipo válido"),
});

export function CategoriasPanel({ workId }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [types, setTypes] = useState<TypeData[]>([]); 
  
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    id_type: "", 
  });

  const resetForm = () => {
    setFormData({ name: "", id_type: "" });
  };

  const fetchTypes = async () => {
    try {
        const response = await api.get(`/type/list/${workId}`);
        
        console.log("Tipos recebidos da API:", response.data);

        const rawData = response.data.types || response.data || [];
        
        if (Array.isArray(rawData)) {
            setTypes(rawData);
            return rawData; 
        }
        
        setTypes([]);
        return [];
    } catch (error) {
        console.error("Erro ao buscar tipos:", error);
        setTypes([]);
        return [];
    }
  };

  const fetchCategories = async (currentTypes: TypeData[]) => {
    try {
        
        
        let allCats: CategoryData[] = [];
        
        for (const type of currentTypes) {
            try {
                const res = await api.get(`/category/list/${type.id}`);
                const cats = res.data.categories || res.data || [];
                if(Array.isArray(cats)) {
                    allCats = [...allCats, ...cats];
                }
            } catch (e) {}
        }
        
        const uniqueCats = Array.from(new Set(allCats.map(a => a.id)))
            .map(id => allCats.find(a => a.id === id)!);

        setCategories(uniqueCats);

    } catch (error) {
        console.error("Erro categorias:", error);
        setCategories([]);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (workId) {
        setLoading(true);
        fetchTypes().then((myTypes) => {
            fetchCategories(myTypes);
        });
    }
  }, [workId]);

  const getTypeName = (id: number) => {
    return types.find((t) => t.id === id)?.name || `ID: ${id}`;
  };

  const handleNewClick = () => {
    resetForm();
    setSelectedId(null);
    setIsVisible(true);
  };

  const handleEditClick = () => {
    if (!selectedId) return alert("Selecione uma categoria para editar.");
    
    const catToEdit = categories.find((c) => c.id === selectedId);
    if (catToEdit) {
      setFormData({
        name: catToEdit.name,
        id_type: String(catToEdit.id_type),
      });
      setIsVisible(true);
    }
  };

  const handleDeleteClick = async () => {
    if (!selectedId) return alert("Selecione uma categoria.");
    if (!confirm("Excluir categoria?")) return;

    try {
      setLoading(true);
      await api.delete(`/category/delete/${selectedId}`);
      alert("Categoria excluída!");
      setSelectedId(null);
      setIsVisible(false);
      
      const myTypes = await fetchTypes();
      await fetchCategories(myTypes);
      
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir.");
      setLoading(false);
    }
  };

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      setLoading(true);
      const data = categorySchema.parse(formData);

      if (selectedId) {
        await api.put(`/category/update/${selectedId}`, data);
        alert("Atualizado!");
      } else {
        await api.post("/category/register", data);
        alert("Cadastrado!");
      }

      setIsVisible(false);
      resetForm();
      const myTypes = await fetchTypes();
      fetchCategories(myTypes);

    } catch (error) {
      if (error instanceof ZodError) return alert(error.issues[0].message);
      // @ts-ignore
      const msg = error.response?.data?.error || "Erro na requisição";
      alert(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overflow-y-scroll h-[350px] pb-4">
      {isVisible && (
        <div className="w-full space-y-2 py-2 px-4 bg-white rounded-lg shadow-md mb-4 border border-gray-200">
          <h3 className="text-sm font-bold text-gray-700 mb-2">
            {selectedId ? "Editar Categoria" : "Nova Categoria"}
          </h3>

          <div className="flex flex-row items-center gap-6">
            <InputForm
              legend="Nome:"
              value={formData.name}
              onChange={handleInputChange}
              name="name"
              required
              containerClassName="w-2/3"
            />

            <SelectForm
              legend="Tipo:"
              value={formData.id_type}
              onChange={handleInputChange}
              name="id_type"
              containerClassName="w-1/3"
            >
                <option value="">Selecione...</option>
                {types.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                ))}
            </SelectForm>
          </div>

          <div className="flex gap-2 mt-2 justify-end">
            <Button
              className="px-4 h-[26px] text-sm bg-gray-350 text-black hover:bg-gray-300 border border-gray-400"
              onClick={handleSubmit}
              isLoading={loading}
            >
              {selectedId ? "Salvar" : "Confirmar"}
            </Button>
            <Button
              className="px-4 h-[26px] text-sm bg-red-100 text-red-800 hover:bg-red-200 border border-red-300"
              onClick={() => { setIsVisible(false); resetForm(); }}
              type="button"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-end mt-4 mb-2 gap-2">
        <Button className="flex items-center gap-2 px-4 h-[26px] text-sm bg-gray-350 text-black hover:bg-gray-300 rounded-none border-1 border-gray-400" onClick={handleNewClick}>
            <img src={incluirSvg} className="w-4 h-4" /> Incluir
        </Button>
        <Button onClick={handleEditClick} className={`flex items-center gap-2 px-4 h-[26px] text-sm rounded-none border-1 border-gray-400 ${selectedId ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`} disabled={!selectedId}>
            <img src={editarSvg} className="w-4 h-4" /> Editar
        </Button>
        <Button onClick={handleDeleteClick} className={`flex items-center gap-2 px-4 h-[26px] text-sm rounded-none border-1 border-gray-400 ${selectedId ? "bg-red-100 text-red-800 hover:bg-red-200 border-red-300" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`} disabled={!selectedId}>
            <img src={deletarSvg} className="w-4 h-4" /> Excluir
        </Button>
      </div>

      <table className="bg-white border-1 border-gray-500 w-full text-left">
        <thead>
          <tr className="bg-gray-300">
            <th className="px-2 border-1">Categoria</th>
            <th className="px-2 border-1 w-1/3">Tipo</th>
          </tr>
        </thead>
        <tbody>
          {loading && categories.length === 0 ? (
            <tr><td colSpan={2} className="p-4 text-center">Carregando...</td></tr>
          ) : categories.length === 0 ? (
            <tr><td colSpan={2} className="p-4 text-center text-gray-500">Nenhuma categoria encontrada.</td></tr>
          ) : (
            categories.map((category) => (
              <tr 
                key={category.id} 
                onClick={() => setSelectedId(selectedId === category.id ? null : category.id)}
                className={`text-sm border-b-1 border-gray-500 cursor-pointer hover:bg-gray-50 ${selectedId === category.id ? "bg-blue-200" : ""}`}
              >
                <td className="px-2 border-1 font-medium">{category.name}</td>
                <td className="px-2 border-1">{getTypeName(category.id_type)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}