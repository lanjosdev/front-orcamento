// Funcionalidades / Libs:
import { useState, useEffect } from 'react';
import { GRUPO_GET_ID } from '../../API/requestApi';
// import { useNavigate } from 'react-router-dom';
// import Cookies from "js-cookie";

// Contexts:
// import { UserContext } from "../../contexts/userContext";

// Components:
import { Header } from '../../components/ui/Header';
import { Tabela } from '../../components/ui/Tabela';
import { Modal } from '../../components/ui/Modal';
import { toast } from "react-toastify";

// Utils:

// Assets:

// Estilo:
import './style.css';


export default function Home() {
    const [loading, setLoading] = useState(true);
    const [showErro, setShowErro] = useState(false);
    
    const [grupos, setGrupos] = useState([]);

    const [modalOpen, setModalOpen] = useState(false);
    const [grupoEdit, setGrupoEdit] = useState(null);
    const [idxGrupoEdit, setIdxGrupoEdit] = useState(null);


    // Verifica se tem grupos salvo localmente (no 1o render):
    useEffect(()=> {
        const gruposLocal = localStorage.getItem('gruposStorage');

        if(gruposLocal) {
            comparaGruposLocalDB(JSON.parse(gruposLocal));
            // setGrupos(JSON.parse(gruposLocal));
        }
    }, []);

    // Salva localmente a cada alteração no state 'grupos':
    useEffect(()=> {
        localStorage.setItem('gruposStorage', JSON.stringify(grupos));
        console.log(grupos);
        // setLoading(false);
    }, [grupos]);


    async function comparaGruposLocalDB(gruposLocal) {
        let newGruposLocal = [];

        for(let grupoLocal of gruposLocal) {
            try {
                const grupoDB = await GRUPO_GET_ID(grupoLocal.id);
                if(grupoDB) {
                    newGruposLocal.push(grupoDB);
                }
            }
            catch(error) {
                console.log('Deu ERRO (ao buscar Grupo / ID):');
                console.log(error);
                setShowErro('Houve algum erro :(');
            }
            // finally {
            //     setLoading(false);
            // }   
        }
        
        if(newGruposLocal.length > 0) {
            console.log(newGruposLocal);
            setGrupos(newGruposLocal);

            // setLoading(false);
        } 
        else {
            // setGrupos(gruposLocal);
            // setShowErro('Erro ao carregar grupos')
            //toast.error('Erro ao carregar grupos');
        }

        setLoading(false);
    }

    
    function onOpenModalAdd() {
        setGrupoEdit(false);

        setModalOpen(true);
    }
    function onOpenModalEdit(grupo, idx) {
        setGrupoEdit(grupo);
        setIdxGrupoEdit(idx);

        // abri modal
        setModalOpen(true);
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

                    {(!loading && grupos.length !== 0) && 
                    <button className="btn-add" onClick={onOpenModalAdd}>+ Add Grupo</button>}
                </div>

                <div className="painel-content">
                    {loading ? (

                        <p className='Loading'>{!showErro ? 'Buscando grupos...' : 
                        <>
                            <ion-icon name="warning-outline"></ion-icon> {showErro}
                        </>}</p>
                        
                    ) : (
                        grupos.length === 0 ? (

                        <button className='btn-add-secundary' onClick={onOpenModalAdd}>
                            <ion-icon name="add-sharp"></ion-icon>
                            Adicionar um Grupo/Atividade neste projeto
                        </button>

                        ) : (

                        <Tabela grupos={grupos} onOpenModalEdit={onOpenModalEdit} />

                        )                                                
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
            idxGrupoClicado={idxGrupoEdit}
        />
        }

        </>
    )
}