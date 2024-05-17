// Funcionalidades / Libs:
// import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();

    function sendDataNavigate(sendData) {
        navigate(`/grupo/${sendData.id}`, { state: sendData });
    }       

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
                            <button className="link-tarefas" onClick={()=> sendDataNavigate(grupo)}>
                                Ver tarefas
                            </button>

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