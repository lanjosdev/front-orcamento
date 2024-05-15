// Funcionalidades / Libs:
import { useState, useEffect } from 'react';

// import { useNavigate } from 'react-router-dom';
// import Cookies from "js-cookie";

// Contexts:
// import { UserContext } from "../../contexts/userContext";

// Components:
import { Header } from '../../components/ui/Header';
import { Tabela } from '../../components/ui/Tabela';
import { Modal } from '../../components/ui/Modal';

// Utils:

// Assets:

// Estilo:
import './style.css';


export default function Home() {
    const [grupos, setGrupos] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(()=> console.log(grupos), [grupos]);
    

    return (
        <>
        <Header/>

        <main className='Page Home fadeIn'>
            <div className="grid">

            <div className='Cabecalho'>
                <h1>Projeto Qualquer</h1>
                
                <p>Abaixo você adicionará Grupos de ações (atividades) que compoem este projeto.</p>
            </div>       

            <div className="Painel">
                <div className="painel-head">
                    <h2>Grupos (Atividades):</h2>

                    {grupos.length !== 0 && 
                    <button className="btn-add" onClick={()=> setModalOpen(true)}>+ Add Grupo</button>}
                </div>

                <div className="painel-content">
                    {grupos.length === 0 ? (
                        <button onClick={()=> setModalOpen(true)}>
                            + Adicionar um Grupo/Atividade neste projeto
                        </button>
                    ) : (
                        <Tabela grupos={grupos} />
                    )}
                </div>
            </div>

            </div>         
        </main>

        {modalOpen && <Modal closeModal={()=> setModalOpen(false)} grupos={grupos} setGrupos={setGrupos} />}

        </>
    )
}