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
    const [grupoEdit, setGrupoEdit] = useState(null);

    const [idxGrupoClicado, setIdxGrupoClicado] = useState(null);


    // Verifica se tem grupos salvo localmente (no 1o render):
    useEffect(()=> {
        const gruposLocal = localStorage.getItem('gruposStorage');
        // console.log(reposLocal);

        if(gruposLocal) {
            setGrupos(JSON.parse(gruposLocal));
        }
    }, []);

    // Salva localmente a cada alteração no state 'grupos':
    useEffect(()=> {
        localStorage.setItem('gruposStorage', JSON.stringify(grupos));
        console.log(grupos);
    }, [grupos]);


    
    function onOpenModalAdd() {
        setGrupoEdit(false);

        setModalOpen(true);
    }
    function onOpenModalEdit(grupo, idx) {
        setGrupoEdit(grupo);
        setIdxGrupoClicado(idx);

        setModalOpen(true);
        // console.log(grupo);
    }


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
                    <button className="btn-add" onClick={onOpenModalAdd}>+ Add Grupo</button>}
                </div>

                <div className="painel-content">
                    {grupos.length === 0 ? (
                        <button onClick={onOpenModalAdd}>
                            + Adicionar um Grupo/Atividade neste projeto
                        </button>
                    ) : (
                        <Tabela grupos={grupos} onOpenModalEdit={onOpenModalEdit} />
                    )}
                </div>
            </div>

            </div>         
        </main>

        {modalOpen && 
        <Modal 
            closeModal={()=> setModalOpen(false)} 
            grupos={grupos} 
            setGrupos={setGrupos} 
            grupoEdit={grupoEdit}
            idxGrupoClicado={idxGrupoClicado}
        />
        }

        </>
    )
}