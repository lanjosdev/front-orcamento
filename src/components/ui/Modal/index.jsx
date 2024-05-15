// Funcionalidades / Libs:
import { useState, useEffect } from "react";
import { GRUPO_GET_ALL, GRUPO_POST_ADD } from '../../../API/requestApi.js';

// Assets:
// import { FiX, FiCheckCircle } from 'react-icons/fi';

// Estilo:
import './style.css';


// eslint-disable-next-line react/prop-types
export function Modal({ closeModal, grupos, setGrupos }) {
    const [loadingDB, setLoadingDB] = useState(true);
    const [erro, setErro] = useState(false);
    const [gruposDB, setGruposDB] = useState([]);

    const [newGrupo, setNewGrupo] = useState(false);
    
    const [grupoSelect, setGrupoSelect] = useState('');
    const [inputNewGrupo, setInputNewGrupo] = useState('');


    useEffect(()=> {
        async function carregaGruposDB() {
            try {
                const response = await GRUPO_GET_ALL();
                // console.log(response);
        
                setGruposDB(response);
                setLoadingDB(false);
              } 
              catch(erro) {
                console.log('Deu erro: ');
                console.log(erro);
                setErro(true);
              } 
            //   finally {
            //     setLoading(false);
            //   }
        }
        carregaGruposDB();
    }, []);


    function onChangeSelect(e) {
        setGrupoSelect(e.target.value);      
        // console.log(e.target.value);
    }

    function onNewGrupo() {
        setNewGrupo(!newGrupo);
        setErro(false);
        // setInputNewGrupo('');
        // setGrupoSelect('');
    }

    async function onSubmitGrupo(e) {
        e.preventDefault();

        if(newGrupo) {
            try {
                const response = await GRUPO_POST_ADD(inputNewGrupo);
                console.log('SUCESSO AO SALVAR NO DB!');
                // console.log(response);
                let objGrupoInput = {
                    id: response.id,
                    nome: response.nome
                }

                setGrupos((prev)=> [...prev, objGrupoInput]);
            }
            catch(error) {
                console.log('ERRO na API:');
                // setErro(true);
                console.log(error);
            }
        } else {
            let objGrupoSelecionado = JSON.parse(grupoSelect);
            // console.log(objGrupoSelecionado);
            if(addGrupoListLocal(objGrupoSelecionado)) {
                return;
            }
        }

        closeModal();
    }

    function addGrupoListLocal(objGrupo) {
        // Verifica se grupo já foi adicionado (pelo id):
        if(!newGrupo) {
            for(let grupo of grupos) {
                if(grupo.id === objGrupo.id) {
                    setErro('Este grupo já foi adicionado.');
                    return 'erro';
                }
            }
        }

        setGrupos((prev)=> [...prev, objGrupo]);
        return false;
    }




    return (
        <div className="Modal">

            <div className="modal-background" onClick={closeModal}></div>

            <div className="modal-window">
                <div className="top-window">
                    <h3>Adicionar Grupo</h3>
                    <button type='button' onClick={closeModal}>X</button>
                </div>

                {loadingDB ? (

                <div className="loading-db">
                    <span>{!erro ? 'Buscando grupos existentes...' : 'Houve algum erro.'}</span>
                </div>

                ) : (

                <form className="content-window" onSubmit={onSubmitGrupo}>
            
                    <label htmlFor="grupo">{newGrupo ? 'Novo grupo: ' : 'Grupo: '}</label>

                    {newGrupo ? (
                
                        <input type="text" name="" id="grupo" className="show" placeholder='Digite aqui' value={inputNewGrupo} onChange={(e)=> setInputNewGrupo(e.target.value)}/>
                    
                    ) : (
                        <select 
                        // id='grupo'
                        value={grupoSelect}
                        onChange={onChangeSelect}
                        className="show"
                        >
                            <option value="">Selecione um grupo</option>

                            {gruposDB.map((grupo)=> (
                            <option key={grupo.id} value={`{"id":${grupo.id},"nome":"${grupo.nome}"}`}>
                                {grupo.nome}
                            </option>
                            ))}
                        </select>
                    )}
                    {erro && <small className="msg-erro">{erro}</small>}
                    
                    <label className="label-check">
                        <input type="checkbox" checked={newGrupo} onChange={onNewGrupo} />
                        <small> Não encontrou o que gostaria? Crie um novo grupo.</small>
                    </label>

                    <div className="btns-window">
                        <button type='button' onClick={closeModal}>Cancelar</button>
                        <button type='submit' disabled={newGrupo ? !inputNewGrupo : !grupoSelect}>Adicionar</button>
                    </div>

                </form>

                )}
            </div>
        
        </div>
    )
}