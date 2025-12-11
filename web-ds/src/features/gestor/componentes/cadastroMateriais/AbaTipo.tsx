import { useEffect, useState } from "react";
import { z, ZodError } from "zod";
import { AxiosError } from "axios";
import { InputForm } from "../InputForm"; 
import { Button } from "../../../auth/components/Button"; 
import incluirSvg from "../../../../assets/incluir.svg"; 
import editarSvg from "../../../../assets/editar.svg"; 
import deletarSvg from "../../../../assets/deletar.svg"; 
import { api } from "../../../../services/api"; 

interface TypeData {
  id: number;
  name: string;
  work_id: number;
}

interface Props {
    workId: string;
}

const typeSchema = z.object({
  name: z.string().min(1, "O nome do tipo é obrigatório"),
});

export function TiposPanel({ workId }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [types, setTypes] = useState<TypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
  });

  const resetForm = () => {
    setFormData({ name: "" });
  };

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/type/list/${workId}`);
      
      const rawData = response.data.types || response.data || [];
      
      if (Array.isArray(rawData)) {
          const filtered = rawData.filter((t: TypeData) => Number(t.work_id) === Number(workId));
          setTypes(filtered);
      } else {
          setTypes([]);
      }
    } catch (error) {
      console.error("Erro ao buscar tipos:", error);
      setTypes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workId) {
        fetchTypes();
    }
  }, [workId]);

  const handleNewClick = () => {
    resetForm();
    setSelectedId(null); 
    setIsVisible(true);
  };

  const handleEditClick = () => {
    if (!selectedId) {
        return alert("Por favor, selecione um tipo na tabela para editar.");
    }
    const typeToEdit = types.find((t) => t.id === selectedId);
    if (typeToEdit) {
      setFormData({
        name: typeToEdit.name,
      });
      setIsVisible(true);
    }
  };

  const handleDeleteClick = async () => {
    if (!selectedId) return alert("Selecione um tipo para excluir.");
    if (!confirm("Tem certeza que deseja excluir este tipo?")) return;

    try {
      setLoading(true);
      await api.delete(`/type/delete/${selectedId}`);
      alert("Tipo removido com sucesso!");
      setSelectedId(null);
      setIsVisible(false);
      resetForm();
      fetchTypes();
    } catch (error) {
      console.error(error);
      const msg = error instanceof AxiosError ? error.response?.data.error : "Erro ao excluir.";
      alert(msg || "Erro ao excluir.");
    } finally {
      setLoading(false);
    }
  };

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      setLoading(true);
      const data = typeSchema.parse({ name: formData.name });

      const payload = {
          name: data.name,
          work_id: Number(workId)
      };

      if (selectedId) {
        await api.put(`/type/update/${selectedId}`, payload);
        alert("Tipo atualizado com sucesso!");
      } else {
        await api.post("/type/register", payload);
        alert("Tipo cadastrado com sucesso!");
      }

      setIsVisible(false);
      resetForm();
      fetchTypes();   
    } catch (error) {
      if (error instanceof ZodError) return alert(error.issues[0].message);
      if (error instanceof AxiosError) return alert(error.response?.data.error || "Erro na requisição");
      alert("Não foi possível realizar a solicitação");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overflow-y-scroll h-[350px] pb-4">
      {isVisible && (
        <div className="w-full space-y-2 py-2 px-4 bg-white rounded-lg shadow-md mb-4 border border-gray-200">
           <h3 className="text-sm font-bold text-gray-700 mb-2">
            {selectedId ? "Editar Tipo" : "Novo Tipo"}
           </h3>
          <div className="flex flex-row items-center gap-6">
            <InputForm
              legend="Nome do Tipo:"
              value={formData.name}
              onChange={handleInputChange}
              name="name"
              required
              containerClassName="flex-1"
            />
          </div>
          <div className="flex gap-2 mt-2 justify-end">
            <Button
              className="px-4 h-[26px] text-sm bg-gray-350 text-black hover:bg-gray-300 rounded-none border-1 border-gray-400"
              onClick={handleSubmit}
              isLoading={loading}
            >
              {selectedId ? "Salvar" : "Confirmar"}
            </Button>
            <Button
                className="px-4 h-[26px] text-sm bg-red-100 text-red-800 hover:bg-red-200 rounded-none border-1 border-red-300"
                onClick={() => { setIsVisible(false); resetForm(); }}
                type="button"
            >
                Cancelar
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-end mt-4 mb-2 gap-2">
        <Button 
            className="flex items-center gap-2 px-4 h-[26px] text-sm bg-gray-350 text-black hover:bg-gray-300 rounded-none border-1 border-gray-400" 
            onClick={handleNewClick}
        >
            <img src={incluirSvg} alt="Incluir" className="w-4 h-4" />
            Incluir
        </Button>
        <Button 
            onClick={handleEditClick}
            className={`flex items-center gap-2 px-4 h-[26px] text-sm rounded-none border-1 border-gray-400 ${selectedId ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            disabled={!selectedId}
        >
            <img src={editarSvg} alt="Editar" className="w-4 h-4" />
            Editar
        </Button>
        <Button 
            onClick={handleDeleteClick}
            className={`flex items-center gap-2 px-4 h-[26px] text-sm rounded-none border-1 border-gray-400 ${selectedId ? 'bg-red-100 text-red-800 hover:bg-red-200 border-red-300' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            disabled={!selectedId}
        >
            <img src={deletarSvg} alt="Excluir" className="w-4 h-4" />
            Excluir
        </Button>
      </div>

      <table className="bg-white border-1 border-gray-500 w-full text-left">
        <thead>
          <tr className="bg-gray-300">
            <th className="px-2 border-1">Tipo</th>
            {/* Removemos coluna Obra pois é redundante */}
          </tr>
        </thead>
        <tbody>
          {loading && types.length === 0 ? (
             <tr><td className="p-4 text-center">Carregando...</td></tr>
          ) : types.length === 0 ? (
             <tr><td className="p-4 text-center text-gray-500">Nenhum tipo cadastrado nesta obra.</td></tr>
          ) : (
            types.map((type) => (
              <tr 
                key={type.id} 
                onClick={() => {
                    if (selectedId === type.id) {
                        setSelectedId(null);
                        setIsVisible(false);
                        resetForm();
                    } else {
                        setSelectedId(type.id);
                        setIsVisible(false);
                        resetForm();
                    }
                }}
                className={`text-sm border-b-1 border-gray-500 cursor-pointer hover:bg-gray-50 ${selectedId === type.id ? 'bg-blue-200' : ''}`}
              >
                <td className="px-2 border-1 font-medium">{type.name}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}