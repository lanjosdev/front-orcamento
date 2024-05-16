// Funcionalidades / Libs:
// import { useContext, useState } from "react";
import { Link } from "react-router-dom";

// Contexts:
// import { UserContext } from "../../contexts/userContext";

// Components:
// import { Header } from '../../components/Header';

// Utils:
// import { formatarTel, formatarData, formatarCadastro } from "../../utils/format";

// Assets:
// import { BiSolidSpreadsheet, BiBlock } from 'react-icons/bi';

// Estilo:
import './style.css';


export function Tabela({ grupos, onOpenModalEdit }) {
       

    return (
        <table className='Tabela'>
            <thead>
                <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">Horas</th>
                    <th scope="col">Ações</th>
                </tr>
            </thead>

            <tbody>
            {grupos.map((grupo, idx)=> (
                <tr key={grupo.id} title={`ID: ${grupo.id}`}>
                    <td data-label="nome">{grupo.nome}</td>

                    <td data-label="horas">0 (estatico)</td>

                    <td data-label="acoes">
                        {/* <div className="actions"> */}
                            <Link className="link-tarefas" to={`/grupo/${grupo.id}`}>
                                Ver tarefas
                            </Link>

                            <button title="editar/remover" onClick={()=> onOpenModalEdit(grupo, idx)}>
                                Edit
                            </button>
                        {/* </div> */}
                    </td>
                </tr>
            ))}  
            </tbody>
        </table>
    )
}