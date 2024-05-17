// Funcionalidades / Libs:
import { useState, useEffect } from "react";
import { GRUPO_GET_ALL, GRUPO_POST_ADD, GRUPO_POST_EDIT } from '../../../API/requestApi.js';

// Assets:
// import { FiX, FiCheckCircle } from 'react-icons/fi';

// Estilo:
import './style.css';


// eslint-disable-next-line react/prop-types
export function ModalTarefa({ closeModal, grupos, setGrupos, grupoEdit=false, idxGrupoClicado }) {
    const [loadingDB, setLoadingDB] = useState(true);
    const [erro, setErro] = useState(false);
    const [gruposDB, setGruposDB] = useState([]);

    const [newTarefa, setNewTarefa] = useState(true);
    
    const [selectTarefa, setSelectTarefa] = useState('');
    const [inputNewGrupo, setInputNewGrupo] = useState(grupoEdit.nome || '');
    // const [inputNewGrupo, setInputNewGrupo] = useState(grupoEdit ? grupoEdit.nome : '');

    const [confirmEdit, setConfirmEdit] = useState(false);



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


    // function onChangeSelect(e) {
    //     setGrupoSelect(e.target.value);      
    //     // console.log(e.target.value);
    // }

    function onNewGrupoCheck() {
        // setNewTarefa(!newTarefa);
        setErro(false);
        // setInputNewGrupo('');
        // setGrupoSelect('');
    }

    function addGrupoListLocal(objGrupo) {
        // Verifica se grupo já foi adicionado (pelo id):
        if(!newTarefa) {
            for(let grupo of grupos) {
                if(grupo.id === objGrupo.id) {
                    setErro('Este grupo já foi adicionado.');
                    return false;
                }
            }
        }

        setGrupos((prev)=> [...prev, objGrupo]);
        return true;
    }

    async function onSubmitAddGrupo(e) {
        e.preventDefault();

        if(newTarefa) {
            try {
                // CREATE/ADD DB:
                const response = await GRUPO_POST_ADD(inputNewGrupo);
                console.log('SUCESSO AO SALVAR NO DB!');
                // console.log(response);
                let objGrupoInput = {
                    id: response.id,
                    nome: response.nome
                }

                // CREATE/ADD LOCAL:
                addGrupoListLocal(objGrupoInput);
            }
            catch(error) {
                console.log('ERRO na API:');
                // setErro(true);
                console.log(error);
            }
        } else {
            let objGrupoSelecionado = JSON.parse(selectTarefa);
            // console.log(objGrupoSelecionado);
            if(!addGrupoListLocal(objGrupoSelecionado)) {
                return;
            }
        }

        // fecha modal
        closeModal();
    }

    async function onSubmitEditGrupo() {
        try {
            // UPDATE/EDIT DB...
            const response = await GRUPO_POST_EDIT(grupoEdit.id, inputNewGrupo);
            console.log('SUCESSO AO SALVAR NO DB!');
            console.log(response);

            
            // UPDATE/EDIT LOCAL (state):
            let newListaGrupos = grupos;

            newListaGrupos[idxGrupoClicado].nome = inputNewGrupo;
            // console.log(newListaGrupos);
            setGrupos(newListaGrupos);
            localStorage.setItem('gruposStorage', JSON.stringify(newListaGrupos));
        }
        catch(error) {
            console.log('ERRO na API:');
            // setErro(true);
            console.log(error);
        }

        // fecha modals
        setConfirmEdit(false);
        closeModal();
    }

    function onConfirmSubmitEdit(e) {
        e.preventDefault();

        console.log('Chama mini janela de confirmaçao');
        setConfirmEdit(true);
    }

    // async function onRemoveGrupo(idGrupo) {
    //     console.log(`Deletou midia id: ${idMedia}`);
    // }

    

    return (
        <div className="Modal">

            <div className="modal-background" onClick={closeModal}></div>

            <div className="modal-window">
                <div className="top-window">
                    <h3>{grupoEdit ? 'Editar Tarefa' : 'Adicionar Tarefa'}</h3>
                    <button type='button' onClick={closeModal}>X</button>
                </div>

                {loadingDB && !grupoEdit ? (

                <div className="loading-db">
                    <span>{!erro ? 'Buscando grupos existentes...' : 'Houve algum erro.'}</span>
                </div>

                ) : (

                grupoEdit ? (

                <form className="content-window edit" onSubmit={onConfirmSubmitEdit}>
        
                    <label htmlFor="grupo">Nome do grupo:</label>

                    <input type="text" name="" id="grupo" className="show" placeholder='Digite aqui' value={inputNewGrupo} onChange={(e)=> setInputNewGrupo(e.target.value)}/>

                    {/* {erro && <small className="msg-erro">{erro}</small>} */}
                    
                    {/* <label className="label-check">
                        <input type="checkbox" checked={newGrupo} onChange={onNewGrupo} />
                        <small> Não encontrou o que gostaria? Crie um novo grupo.</small>
                    </label> */}

                    <div className="btns-window">
                        <button type='button' onClick={closeModal}>Cancelar</button>
                        <button type="button" onClick={()=> console.log('call minimodalDelete')}>Remover</button>
                        <button type='submit' disabled={inputNewGrupo === grupoEdit.nome || !inputNewGrupo}>
                            Salvar
                        </button>
                    </div>

                    {confirmEdit && (
                        <div className="modal-background-delete">
                            <div className="modal-delete">
                                <h3>Certeza que desaja salvar as alterações?</h3>
                                <p>
                                    O nome do grupo passará a ser: <br />
                                    <strong>{inputNewGrupo}</strong> <br />
                                    Index: <strong>{idxGrupoClicado}</strong>
                                </p>
                                <div>
                                    <button type="button" className="btn-yes" onClick={()=> onSubmitEditGrupo()}>
                                        Sim
                                    </button>
                                    <button type="button" onClick={() => setConfirmEdit(false)}>
                                        Não
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </form>

                ) : (

                <form className="content-window" onSubmit={onSubmitAddGrupo}>
        
                    {/* <label htmlFor="grupo">{newTarefa ? 'Nova tarefa: ' : 'Tarefa: '}</label> */}

                    {newTarefa ? (
                        <>
                        <div className="label-input">
                            <label htmlFor="grupo">Nova tarefa: </label>
                            <input type="text" name="" id="grupo" className="show" placeholder='Digite aqui' value={inputNewGrupo} onChange={(e)=> setInputNewGrupo(e.target.value)}/>
                        </div>

                        <div className="label-input">
                            <label htmlFor="">Tempo (minutos): </label>
                            <input type="text"/>
                        </div>
                        </>
                    
                    ) : (

                        <select 
                        // id='grupo'
                        value={selectTarefa}
                        onChange={(e)=> setSelectTarefa(e.target.value)}
                        className="show"
                        >
                            <option value="">Selecione uma tarefa</option>

                            {gruposDB.map((grupo)=> (
                            <option key={grupo.id} value={`{"id":${grupo.id},"nome":"${grupo.nome}"}`}>
                                {grupo.nome}
                            </option>
                            ))}
                        </select>
                        
                    )}
                    {erro && <small className="msg-erro">{erro}</small>}
                    
                    <label className="label-check">
                        <input type="checkbox" checked={newTarefa} onChange={onNewGrupoCheck} />
                        <small> Não encontrou o que gostaria? Crie um novo grupo.</small>
                    </label>

                    <div className="btns-window">
                        <button type='button' onClick={closeModal}>Cancelar</button>
                        <button type='submit' disabled={newTarefa ? !inputNewGrupo : !selectTarefa}>Adicionar</button>
                    </div>

                </form>

                )

                )}
            </div>
        
        </div>
    )
}