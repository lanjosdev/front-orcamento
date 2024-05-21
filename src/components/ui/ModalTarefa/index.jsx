// Funcionalidades / Libs:
import { useState, useEffect } from "react";
import { GRUPO_GET_ALL, TAREFA_POST_ADD, GRUPO_POST_EDIT, TAREFA_GRUPO_ADD } from '../../../API/requestApi.js';
import { toast } from 'react-toastify';

// Assets:
// import { FiX, FiCheckCircle } from 'react-icons/fi';

// Estilo:
import './style.css';


// eslint-disable-next-line react/prop-types
export function ModalTarefa({ closeModal, grupo, setGrupos, tarefaEdit=false, idxGrupoClicado }) {
    const [loadingDB, setLoadingDB] = useState(true);
    const [erro, setErro] = useState('');
    const [gruposDB, setGruposDB] = useState([]);

    const [newTarefa, setNewTarefa] = useState(true);
    
    const [selectTarefa, setSelectTarefa] = useState('');
    const [inputTarefa, setInputTarefa] = useState(tarefaEdit.nome || '');
    const [inputTempo, setInputTempo] = useState(tarefaEdit.tempo || '');
    const [inputDescription, setInputDescription] = useState(tarefaEdit.descricao || '');

    const [confirmAdd, setConfirmAdd] = useState(false);
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
                setErro('Houve algum erro.');
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

    function onCheckNewTarefa() {
        setNewTarefa(!newTarefa);
        setErro('');
        // setInputNewGrupo('');
        // setGrupoSelect('');
    }

    // function addGrupoListLocal(objGrupo) {
    //     // Verifica se grupo já foi adicionado (pelo id):
    //     if(!newTarefa) {
    //         for(let grupo of grupos) {
    //             if(grupo.id === objGrupo.id) {
    //                 setErro('Este grupo já foi adicionado.');
    //                 return false;
    //             }
    //         }
    //     }

    //     setGrupos((prev)=> [...prev, objGrupo]);
    //     return true;
    // }

    async function onSubmitAddTarefa() {
        console.log('adicionando no db..');

        if(newTarefa) {
            try {
                // CREATE/ADD DB:
                const response = await TAREFA_POST_ADD(inputTarefa, inputTempo, inputDescription);
                if(response.erro) {
                    toast.error('Esse grupo já existe');
                    setConfirmAdd(false);
                    return;
                }

                console.log('SUCESSO AO SALVAR tarefa NO DB!');
                // console.log(response);

                // add registro na tabela tarefas-grupos
                try {
                    const response2 = await TAREFA_GRUPO_ADD(grupo.id, response.id);
                    toast.success('Nova tarefa criada');
                    console.log(response2);
                }
                catch(error) {
                    console.log('Erro no tarefa-grupo');
                    console.log(error);
                }
                

                // CREATE/ADD LOCAL:
                // addGrupoListLocal(objGrupoInput);


                // fecha o modal pai
                closeModal();
            }
            catch(error) {
                console.log('ERRO na API:');
                setErro(true);
                toast.error('Erro ao enviar a tarefa.');
                console.log(error);
            }
        } else {
            let objGrupoSelecionado = JSON.parse(selectTarefa);
            // console.log(objGrupoSelecionado);
            // if(!addGrupoListLocal(objGrupoSelecionado)) {
            //     return;
            // }
        }
    }
    function onConfirmSubmitAddTarefa(e) {
        e.preventDefault();

        if(!confirmAdd) {
            console.log('Deseja adicionar?');
            setConfirmAdd(true);
        }
    }



    async function onSubmitEditGrupo() {
        try {
            // UPDATE/EDIT DB...
            const response = await GRUPO_POST_EDIT(tarefaEdit.id, inputTarefa);
            console.log('SUCESSO AO SALVAR NO DB!');
            console.log(response);

            
            // UPDATE/EDIT LOCAL (state):
            let newListaGrupos = grupos;

            newListaGrupos[idxGrupoClicado].nome = inputTarefa;
            // console.log(newListaGrupos);
            setGrupos(newListaGrupos);
            // localStorage.setItem('gruposStorage', JSON.stringify(newListaGrupos));
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
                    <h3>{tarefaEdit ? 'Editar Tarefa' : 'Adicionar Tarefa'}</h3>
                    <button type='button' onClick={closeModal}>X</button>
                </div>

                {loadingDB && !tarefaEdit ? (

                <div className="loading-db">
                    <span>{!erro ? 'Buscando tarefas existentes...' : erro}</span>
                </div>

                ) : (

                tarefaEdit ? (

                <form className="content-window edit" onSubmit={onConfirmSubmitEdit}>
        
                    <label htmlFor="grupo">Nome do grupo:</label>

                    <input type="text" name="" id="grupo" className="show" placeholder='Digite aqui' value={inputTarefa} onChange={(e)=> setInputNewGrupo(e.target.value)}/>

                    {/* {erro && <small className="msg-erro">{erro}</small>} */}
                    
                    {/* <label className="label-check">
                        <input type="checkbox" checked={newGrupo} onChange={onNewGrupo} />
                        <small> Não encontrou o que gostaria? Crie um novo grupo.</small>
                    </label> */}

                    <div className="btns-window">
                        <button type='button' onClick={closeModal}>Cancelar</button>
                        <button type="button" onClick={()=> console.log('call minimodalDelete')}>Remover</button>
                        <button type='submit' disabled={inputTarefa === tarefaEdit.nome || !inputTarefa}>
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

                <form className="content-window tarefa" onSubmit={onConfirmSubmitAddTarefa}>
        
                    {/* <label htmlFor="grupo">{newTarefa ? 'Nova tarefa: ' : 'Tarefa: '}</label> */}

                    {newTarefa ? (
                        <>
                        <div className="label-input show">
                            <label htmlFor="tarefa">Nova tarefa: </label>
                            <input type="text" id="tarefa" value={inputTarefa} onChange={(e)=> setInputTarefa(e.target.value)} placeholder='Digite o nome da tarefa'/>
                        </div>

                        <div className="label-input show">
                            <label htmlFor="tempo">Tempo (minutos): </label>
                            <input type="number" id="tempo" value={inputTempo} onChange={(e)=> setInputTempo(e.target.value)} min={1} placeholder="exemplo: 60"/>
                        </div>

                        <div className="label-input show">
                            <label htmlFor="descri">Descrição: </label>
                            <textarea id="descri" value={inputDescription} onChange={(e)=> setInputDescription(e.target.value)} placeholder="Digite a descrição"></textarea>
                        </div>
                        </>
                    
                    ) : (

                        <div className="label-select">
                            <label>Tarefa: </label>
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
                        </div>
                        
                    )}
                    {erro && <small className="msg-erro">{erro}</small>}

                    
                    <label className="label-check">
                        <input type="checkbox" checked={newTarefa} onChange={onCheckNewTarefa} />
                        <small> Não encontrou o que gostaria? Crie uma nova tarefa.</small>
                    </label>

                    <div className="btns-window">
                        {newTarefa ? (
                            <button type='submit' disabled={!(inputTarefa && inputTempo && inputDescription)}>Adicionar</button>
                        ) : (
                            <button type='button' onClick={()=> console.log('add apenas no local...')} disabled={!selectTarefa}>Adicionar</button>
                        )}
                        <button type='button' onClick={closeModal}>Cancelar</button>
                    </div>

                </form>

                )

                )}

                {confirmAdd && (
                    <div className="modal-background-mini">
                        <div className={`modal-add ${erro && 'erro'}`}>
                            <h3>Uma nova tarefa será salva:</h3>

                            <div className="resumo">
                                <p>
                                    Tarefa: <strong>{inputTarefa}</strong>
                                </p>
                                <p>
                                    Tempo: <strong>{inputTempo} minutos</strong>
                                </p>
                            </div>
                            
                            <p>Deseja prosseguir?</p>
                            
                            <div className="btns-yes-no">
                                <button type="button" className="btn-yes" onClick={onSubmitAddTarefa}>
                                    Sim
                                </button>
                                <button type="button" onClick={() => {setConfirmAdd(false); setErro('')}}>
                                    Não
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        
        </div>
    )
}