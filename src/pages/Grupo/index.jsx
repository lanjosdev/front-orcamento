// Funcionalidades / Libs:
import { useState, useEffect } from 'react';
// import { GRUPO_GET_ALL } from '../../API/requestApi';
// import { useNavigate } from 'react-router-dom';
// import Cookies from "js-cookie";

// Contexts:
// import { UserContext } from "../../contexts/userContext";

// Components:
import { Header } from '../../components/ui/Header';
// import { Tabela } from '../../components/ui/Tabela';
// import { Modal } from '../../components/ui/Modal';

// Utils:

// Assets:

// Estilo:
import './style.css';


export default function Grupo() {
    const [gruposDB, setGruposDB] = useState([]);
    

    useEffect(()=> {
        async function carregaGruposDB() {
            // try {
            //     const response = await GRUPO_GET_ALL();
            //     console.log(response);
        
            //     setGruposDB(response);
            //   } 
            //   catch(erro) {
            //     console.log('Deu erro: ');
            //     console.log(erro);
            //     // setErro(true);
            //   } 
            // //   finally {
            // //     setLoading(false);
            // //   }
        }
        carregaGruposDB();
    }, []);

    // function onShowModal() {

    // }


    return (
        <>
        <Header/>

        <main className='Page Grupo fadeIn'>
            <div className="grid">

            <div className='Cabecalho'>
                <h1>Nome do Grupo aqui</h1>
                
                <p>Abaixo você adicionará Grupos de ações (atividades) que compoem este projeto.</p>
            </div>       

            <div className="Painel">
                <div className="painel-head">
                    <h2>Grupos (Atividades):</h2>

                    {/* {grupos.length !== 0 &&  */}
                    <button className="btn-add">+ Add Grupo</button>
                </div>

                <div className="painel-content">
            
                        <button>
                            + Adicionar um Grupo/Atividade neste projeto
                        </button>
                    
                </div>
            </div>

            </div>         
        </main>

        {/* {modalOpen && <Modal closeModal={()=> setModalOpen(false)} gruposDB={gruposDB} />} */}

        </>
    )
}