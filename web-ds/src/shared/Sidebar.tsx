import { useState } from 'react';
import { FaHome, FaCalendarAlt, FaBox, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import Teste from "../assets/Teste.png";
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; 
import { images } from '../assets';

interface SidebarLink {
    label: string;
    to: string;
    icon?: any; 
    roles: string[];
    children?: SidebarLink[];
}

const sidebarLinks: SidebarLink[] = [
    {
        label: 'Início',
        to: '/work',
        icon: FaHome,
        roles: ['tender'] 
    },
    {
        label: 'Cronograma',
        to: '/cronograma-fisico', 
        icon: FaCalendarAlt,
        roles: ['tender'] 
    },
    {
        label: 'Estoque',
        to: '/estoque', 
        icon: FaBox,
        roles: ['tender'] 
    },
    {
        label: 'Relatórios',
        to: '#', 
        icon: FaChartBar,
        roles: ['tender'],
        children: [
            {
                label: 'Enviados',
                to: '/relatorios-devolvidos', 
                roles: ['tender'],
                icon: undefined 
            },
            {
                label: 'Enviar',
                to: '/relatorios', 
                roles: ['tender'],
                icon: undefined
            }
        ]
    },

    {
        label: 'Gerir Obras',
        to: '/cadastro-obra',
        icon: images.InicioGestor,
        roles: ['manager'] 
    },
    {
        label: 'Cronograma',
        to: '/cronograma-fisico', 
        icon: images.cronograma,
        roles: ['manager'] 
    },
    {
        label: 'Orçamento',
        to: '/orcamento', 
        icon: images.Orçamento,
        roles: ['manager'] 
    },
    {
        label: 'Estoque',
        to: '/tabela-estoque', 
        icon: images.Estoque,
        roles: ['manager']
    },
    {
        label: 'Relatórios',
        to: '#', 
        icon: images.Relatorios,
        roles: ['manager'],
        children: [
            {
                label: 'Financeiro',
                to: '/financeiro', 
                roles: ['manager'],
                icon: undefined 
            },
            {
                label: 'Físico',
                to: '/relatorios-gestor', 
                roles: ['manager'],
                icon: undefined
            }
        ]
    }
];

export function Sidebar() {
    const { session, remove } = useAuth();
    const userRole = session?.userFunction;

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const handleDropdownClick = (label: string) => {
        if (openDropdown === label) {
            setOpenDropdown(null); 
        } else {
            setOpenDropdown(label); 
        }
    };

    if (!userRole) {
        return null;
    }

    return (
        <aside className="w-40 h-screen bg-blue-400 text-white flex flex-col justify-between p-4">
            <div>
                <div className="flex items-center gap-3 mb-10">
                    <Link to={`/work`}>
                        <img src={Teste} className='cursor-pointer' alt="Logo BlocoZero"></img>
                    </Link>
                </div>

                <nav className="flex flex-col gap-4">
                    {sidebarLinks
                        .filter(link => link.roles.includes(userRole)) 
                        .map(link => (
                            
                            !link.children ? (
                                <NavLink
                                    key={link.label}
                                    to={link.to}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 font-semibold transition ease-linear rounded-md  ${
                                        isActive ? 'bg-blue-400' : 'hover:bg-gray-600'
                                        }`
                                    }
                                >
                                    {typeof link.icon === 'string' ? (
                                        <img src={link.icon} alt={link.label} className="w-5 h-5" />
                                    ) : (
                                        <link.icon size={20} />
                                    )}
                                    <span>{link.label}</span>
                                </NavLink>
                            ) : (
                                <div key={link.label} className="relative">
                                    <button
                                        onClick={() => handleDropdownClick(link.label)}
                                        className="flex items-center justify-between w-full p-2 hover:bg-gray-600 transition ease-linear rounded-md"
                                    >
                                        <div className="flex items-center gap-3">
                                            {typeof link.icon === 'string' ? (
                                                <img src={link.icon} alt={link.label} className="w-5 h-5" />
                                            ) : (
                                                <link.icon size={20} />
                                            )}
                                            <span>{link.label}</span>
                                        </div>
                                    </button>
                                    
                                    {openDropdown === link.label && (
                                        <div className="flex flex-col gap-2 px-3 mt-2 bg-blue-400 rounded py-2">
                                            {link.children
                                                .filter(child => child.roles.includes(userRole))
                                                .map(child => (
                                                    <NavLink
                                                        key={child.label}
                                                        to={child.to}
                                                        className={({ isActive }) =>
                                                            `p-2 text-sm rounded-md block ${
                                                            isActive ? 'bg-gray-600 font-bold' : 'hover:bg-gray-600'
                                                            }`
                                                        }
                                                    >
                                                        {child.label}
                                                    </NavLink>
                                                ))
                                            }
                                        </div>
                                    )}
                                </div>
                            )
                        ))
                    }
                </nav>
            </div>

            <div className="mt-auto">
                <button
                    onClick={remove} 
                    className="flex items-center gap-3 p-2 w-full font-semibold hover:bg-gray-600 transition ease-linear rounded-md"
                >
                    <FaSignOutAlt size={20} />
                    <span>Sair</span>
                </button>
            </div>
        </aside>
    );
}