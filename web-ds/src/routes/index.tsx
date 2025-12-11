import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; 
import { useAuth } from "../hooks/useAuth.tsx";
import { AppLayout } from "../shared/AppLayout";

import { AuthRoutes } from "./AuthRoutes.tsx"; 
import { Home } from "../pages/HomePage";
import { CardObra } from "../pages/CardObra";
import { EstoqueList } from "../pages/EstoqueList";
import { EstoqueObra } from "../pages/Estoque";
import { CronogramaSelecao } from "../features/gestor/componentes/cronograma/CronogramaList.tsx";
import { OrcamentoSelecao } from "../features/gestor/componentes/orçamento/OrcamentoSelecao.tsx";
import { EstoqueSelecao } from "../features/gestor/componentes/estoque-tabela/EstoqueSelecao.tsx";
import { RelatoriosGestorList } from "../features/gestor/componentes/Relatorios/RelatoriosGestorList.tsx";
import { RelatoriosGestorPage } from "../pages/VisuRelatorios.tsx";
import { FinanceiroSelecao } from "../features/financeiro/FinanceiroSelecao.tsx";
import { CadastroObra } from "../pages/CadastroObra";
import { Orçamento } from "../pages/Orçamento";
import { Fin } from "../pages/Financeiro";
import EstoqueTab from "../pages/EstoqueTabela";
import { CronogramaPage } from "../pages/CronogramaFisico";
import { GerenciarObra } from "../features/gestor/componentes/cadastroMateriais/GerenciarObra.tsx";
import { Relatorios } from "../pages/Relatorios";
import { RelatoriosDevolvidos } from "../pages/RelatoriosDevolvidos.tsx"
function AppRoutes() {
    const { session } = useAuth();

//<Route path="/obra/:work_id/relatorios-gestor" element={<RelatoriosGestorPage />} />
    return (
        <Routes>
            <Route path="/" element={<AppLayout />}>
                
                {session?.userFunction === "manager" && (
                    <>
                        <Route path="/cadastro-obra" element={<CadastroObra />} />
                        <Route path="/obras/:id" element={<GerenciarObra />} />

                        <Route path="/obra/:work_id/orcamento" element={<Orçamento />} />
                        <Route path="/obra/:work_id/financeiro" element={<Fin />} />
                        <Route path="/obra/:work_id/estoque" element={<EstoqueTab />} />
                        <Route path="/obra/:work_id/cronograma" element={<CronogramaPage />} />
                        <Route path="/obra/:work_id/relatorios-gestor" element={<RelatoriosGestorPage />} />

                        
                        <Route path="/orcamento" element={<OrcamentoSelecao />} />
                        <Route path="/financeiro" element={<FinanceiroSelecao/>} />
                        <Route path="/tabela-estoque" element={<EstoqueSelecao />} />
                        <Route path="/relatorios-gestor" element={<RelatoriosGestorList />} />
                        <Route path="/cronograma-fisico" element={<CronogramaSelecao />} />
                        <Route path="/" element={<Navigate to="/cadastro-obra" />} />
                    </>
                )}

                {session?.userFunction === "tender" && (
                    <>

                        <Route path="/obra/:work_id/cronograma" element={<CronogramaPage />} />
                        <Route path="/cronograma-fisico" element={<CronogramaSelecao />} />
                        <Route path="/work" element={<Home />} />
                        <Route path="/work/specific/:id" element={<CardObra />} />
                        <Route path="/estoque" element={<EstoqueList />} />
                        <Route path="/estoque/:work_id" element={<EstoqueObra />} />
                        <Route path="/" element={<Navigate to="/work" />} />
                        <Route path="/relatorios" element={<Relatorios />} />
                        <Route path="/relatorios-devolvidos" element={<RelatoriosDevolvidos/>} />
                     </>
                )}

                <Route path="*" element={<Navigate to="/" />} />
            </Route>
        </Routes>
    );
}

export function AppRouter() { 
    const { session, isLoading } = useAuth();
    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Carregando...</div>;
    }

    return (
        <BrowserRouter>
            {!session ? <AuthRoutes /> : <AppRoutes />}
        </BrowserRouter>
    );
}

