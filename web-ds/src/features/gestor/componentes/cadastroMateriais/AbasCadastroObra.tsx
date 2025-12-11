import { useState } from "react";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "./Tabs";
import { MateriaisPanel } from "./AbaMateriais";
import { FuncionariosPanel } from "./AbaFuncionarios";
import { EtapaPanel } from "./AbaEtapa"; 
import { SubetapasPanel } from "./AbaSubetapas";
import { TiposPanel } from "./AbaTipo"; 
import { CategoriasPanel } from "./AbaCategoria";


interface Props {
    workId: string;
}
export function AbasCadastroObra({ workId }: Props) {
    const [activeTab, setActiveTab] = useState("materiais");
    
    const [selectedStage, setSelectedStage] = useState<{id: number, name: string} | null>(null);

    const handleSelectStage = (id: number, name: string) => {
        setSelectedStage({ id, name });
        setActiveTab("subetapas"); 
    };

    return (
        <div className="w-full p-4">
            <Tabs defaultTab="materiais" activeTab={activeTab} onChange={setActiveTab}>
                <TabList>
                    <div className="flex justify-between w-full">
                        <div>
                            <Tab label="materiais">Materiais</Tab>
                            <Tab label="funcionarios">Funcionários</Tab>
                            
                            <Tab label="tipos">Tipos</Tab>
                            <Tab label="categorias">Categorias</Tab>
                            
                            <Tab label="etapa">Etapas</Tab>
                            <Tab label="subetapas" disabled={!selectedStage}>
                                {selectedStage ? `Subetapas de: ${selectedStage.name}` : "Subetapas"}
                            </Tab>
                        </div>
                    </div>
                </TabList>

                <TabPanels>
                    <TabPanel whenActive="materiais">
                        <MateriaisPanel workId={workId} />
                    </TabPanel>
                    
                    <TabPanel whenActive="funcionarios">
                        <FuncionariosPanel workId={workId} />
                    </TabPanel>
                    
                    <TabPanel whenActive="etapa">
                        <EtapaPanel onSelectStage={handleSelectStage}  workId={workId}/>
                    </TabPanel>

                    <TabPanel whenActive="tipos">
                        <TiposPanel workId={workId}/>
                    </TabPanel>

                    <TabPanel whenActive="categorias">
                        <CategoriasPanel workId={workId}/>
                    </TabPanel>

                    <TabPanel whenActive="subetapas">
                        <SubetapasPanel selectedStage={selectedStage} workId={workId} />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    );
}