// Funcionalidades / Libs:
import { useState, useEffect } from 'react';
import { GRUPO_GET_ID } from '../../API/requestApi';
import { useParams, useLocation, Link } from 'react-router-dom';
// import Cookies from "js-cookie";

// Contexts:
// import { UserContext } from "../../contexts/userContext";

// Components:
import { Header } from '../../components/ui/Header';
import { Tabela } from '../../components/ui/Tabela';
import { ModalTarefa } from '../../components/ui/ModalTarefa';

// Utils:

// Assets:

// Estilo:
import './style.css';


export default function Grupo() {
    const { idGrupo } = useParams(); // pega o parametro definido no routes.jsx //PODEMOS PEGAR O ID DO GRUPO VIA CONTEXT API NO FURUTO
    const location = useLocation();
    const dadoRecebido = location.state; // recebe os dados(do grupo selecionado) da rota/page(/home) anterior pelo useLocation()

    const [loading, setLoading] = useState(true);
    const [erroMsg, setErroMsg] = useState('');

    const [grupo, setGrupo] = useState(dadoRecebido || '');
    const [tarefas, setTarefas] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    // const [erro, setErro] = useState(false);

    
    // Puxa dados do grupo pelo DB (isso verifica se ainda está existente):
    useEffect(()=> {
        async function carregaInfoGrupo() {    
            let id_grupo = dadoRecebido ? dadoRecebido.id : idGrupo;
        
            try {
                const response = await GRUPO_GET_ID(id_grupo);
                console.log('Dados deste grupo:');
                console.log(response);
                setGrupo(response);
            } catch(erro) {
                console.log('Deu erro ao buscar grupo desta page!');
                console.log(erro);
                // usa navigate para page "NotFound" quando não encontrar cliente id
            }  
        }
        carregaInfoGrupo();
    }, [dadoRecebido, idGrupo]);

    // Verifica se tem grupos salvo localmente (no 1o render):
    useEffect(()=> {
        const tarefasLocal = localStorage.getItem('tarefasStorage');

        if(tarefasLocal) {
            // comparaGruposLocalDB(JSON.parse(gruposLocal));
            setTarefas(JSON.parse(tarefasLocal));
        }
    }, []);

    // Salva localmente a cada alteração no state 'grupos':
    useEffect(()=> {
        localStorage.setItem('tarefasStorage', JSON.stringify(tarefas));
        console.log(tarefas);
        setLoading(false);
    }, [tarefas]);
    

    function onOpenModalAdd() {
        // setGrupoEdit(false);

        setModalOpen(true);
    }
    function onOpenModalEdit(grupo, idx) {
        // setGrupoEdit(grupo);
        // setIdxGrupoEdit(idx);

        // abri modal
        setModalOpen(true);
    }


    return (
        <>
        <Header/>

        <main className='Page Grupo fadeIn'>
            <div className="grid">

            <div className='Cabecalho'>
                <Link to='/home'> {'<'} Voltar</Link>
                <h1>
                    {grupo.nome}
                </h1>
                
                <p>Abaixo você adicionará Tarefas que compoem este grupo.</p>
            </div>       

            <div className="Painel">
                <div className="painel-head">
                    <h2>Tarefas:</h2>

                    {tarefas.length !== 0 && 
                    <button className="btn-add" onClick={onOpenModalAdd}>+ Add Tarefa</button>
                    }
                </div>

                <div className="painel-content">

                    {loading ? (

                    <p className='Loading'>{!erroMsg ? 'Buscando tarefas...' : erroMsg}</p>

                    ) : (
                        tarefas.length === 0 ? (

                        <button onClick={onOpenModalAdd}>
                            + Adicionar uma tarefa neste grupo
                        </button>

                        ) : (

                        <Tabela grupos={tarefas} onOpenModalEdit={onOpenModalEdit} />

                        )                                              
                    )}
            
                        
                    
                </div>
            </div>

            </div>         
        </main>


        {modalOpen && 
        <ModalTarefa 
            closeModal={()=> setModalOpen(false)} 
            grupo={grupo}
            tarefas={tarefas} 
            setTarefas={setTarefas} 
            // grupoEdit={grupoEdit}
            // idxGrupoClicado={idxGrupoEdit}
        />
        }

        </>
    )
}