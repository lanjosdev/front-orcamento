// Funcionalidades / Libs:
import { useState, useEffect } from 'react';
import { GRUPO_GET_ID } from '../../API/requestApi';
import { useLocation, Link } from 'react-router-dom';
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
    //const { idGrupo } = useParams(); // pega o parametro definido no routes.jsx
    const location = useLocation();
    const dadoRecebido = location.state; // recebe os dados(do grupo selecionado) da rota/page(/home) anterior pelo useLocation()

    const [grupo, setGrupo] = useState(dadoRecebido);
    const [tarefas, setTarefas] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    // const [erro, setErro] = useState(false);

    
    // Puxa dados do grupo pelo DB (isso verifica se ainda está existente):
    useEffect(()=> {
        async function carregaGrupo() {     
            try {
                const response = await GRUPO_GET_ID(dadoRecebido.id);
                console.log('Dados deste grupo:');
                console.log(response);
                setGrupo(response);
            } catch(erro) {
                console.log('Deu erro!');
                console.log(erro);
                // usa navigate para page "NotFound" quando não encontrar cliente id
            } 
            //finally {
            //  preencheCampos();
            //}      
        }
        carregaGrupo();
    }, [dadoRecebido]);
    

    function onOpenModalAdd() {
        // setGrupoEdit(false);

        setModalOpen(true);
    }
    // function onOpenModalEdit(grupo, idx) {
    //     setGrupoEdit(grupo);
    //     setIdxGrupoEdit(idx);

    //     // abri modal
    //     setModalOpen(true);
    // }


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
            
                        <button onClick={onOpenModalAdd}>
                            + Adicionar uma tarefa neste grupo
                        </button>
                    
                </div>
            </div>

            </div>         
        </main>

        {/* {modalOpen && <Modal closeModal={()=> setModalOpen(false)} gruposDB={gruposDB} />} */}
        {modalOpen && 
        <ModalTarefa 
            closeModal={()=> setModalOpen(false)} 
            // grupos={grupos} 
            // setGrupos={setGrupos} 
            // grupoEdit={grupoEdit}
            // idxGrupoClicado={idxGrupoEdit}
        />
        }

        </>
    )
}