// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { GRUPO_GET_ALL, GRUPO_POST_ADD, GRUPO_POST_EDIT, GRUPO_DELETE } from '../../../API/requestApi.js';
import { formatarNumero } from "../../../utils/formatarNumbers.js";
import { toast } from "react-toastify";

// Assets:
// import { FiX, FiCheckCircle } from 'react-icons/fi';

// Estilo:
import './style.css';


Modal.propTypes = {
    closeModal: PropTypes.func.isRequired,
    grupoEdit: PropTypes.any,
    grupos: PropTypes.array
}
// eslint-disable-next-line react/prop-types
export function Modal({ closeModal, grupos, setGrupos, grupoEdit, idxGrupoClicado }) {
    const [loadingDB, setLoadingDB] = useState(true);
    const [erro, setErro] = useState(false);
    const [gruposDB, setGruposDB] = useState([]);

    const [newGrupo, setNewGrupo] = useState(false);
    
    const [grupoSelect, setGrupoSelect] = useState('');
    const [inputNewGrupo, setInputNewGrupo] = useState(grupoEdit.nome || '');
    // const [inputNewGrupo, setInputNewGrupo] = useState(grupoEdit ? grupoEdit.nome : '');

    const [confirmAdd, setConfirmAdd] = useState(false);
    const [confirmEdit, setConfirmEdit] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [checkDeleteDB, setCheckDeleteDB] = useState(false);
    const [inputDeleteDB, setInputDeleteDB] = useState('');


    useEffect(()=> {
        async function carregaGruposDB() {
            try {
                const response = await GRUPO_GET_ALL();
                // const response = await [{id:1, nome: 'um'}, {id:2, nome: 'dois'}, {id:3, nome: 'tres'}];
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


    function onNewGrupoCheck() {
        setNewGrupo(!newGrupo);
        setErro(false);
        // setInputNewGrupo('');
        // setGrupoSelect('');
    }

    function addGrupoListLocal(objGrupo) {
        // Verifica se grupo já foi adicionado (pelo id):
        if(!newGrupo) {
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
    async function onSubmitAddGrupo() {
        // e.preventDefault();
        console.log('add grupo...')

        if(newGrupo) {
            try {
                // CREATE/ADD DB:
                const response = await GRUPO_POST_ADD(inputNewGrupo);
                // const response = await {id: 4, nome: inputNewGrupo};
                if(response.erro) {
                    toast.error('Esse grupo já existe');
                    setConfirmAdd(false);
                    return;
                }
                console.log('SUCESSO AO SALVAR NO DB!');


                // CREATE/ADD LOCAL:
                let objGrupoInput = {
                    id: response.id,
                    nome: response.nome
                }

                if(addGrupoListLocal(objGrupoInput)) {
                    toast.success('Grupo criado com sucesso!');
                }
            }
            catch(error) {
                console.log('ERRO na API:');
                // setErro(true);
                console.log(error);
            }
        } else {
            let objGrupoSelecionado = JSON.parse(grupoSelect);
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
            toast.success('Grupo editado com sucesso!');
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
    async function onSubmitDeleteGrupo() {
        if(checkDeleteDB) {
            try {
                // DELETE DB...
                const response = await GRUPO_DELETE(grupoEdit.id);

                if(response.sucesso) {
                    // atualiza localmente
                    let newListaGruposLocal = grupos.filter(grupo => grupo.id !== grupoEdit.id);
                    // console.log(newListaGruposLocal);
                    setGrupos(newListaGruposLocal);
                    toast.warn('Grupo removido permanentemente');
                }
            }
            catch(error) {
                console.log('ERRO na API (ao deletar):');
                toast.error('Erro ao deletar');
                // setErro(true);
                console.log(error);
            }                 
        }
        else {
            console.log('removendo local...');
            
            let newListaGruposLocal = grupos.filter(grupo => grupo.id !== grupoEdit.id);
            // console.log(newListaGruposLocal);
            setGrupos(newListaGruposLocal);
            toast.success('Grupo removido localmente');
        }

        // fecha modals
        setConfirmDelete(false);
        closeModal();
    }

    function onConfirmSubmitAdd(e) {
        e.preventDefault();
        tirarFocusInputs();

        if(!confirmAdd) {
            console.log('Chama mini janela de confirmaçao');
            setConfirmAdd(true);
        }
    }
    function onConfirmSubmitEdit(e) {
        e.preventDefault();
        tirarFocusInputs();

        if(!confirmEdit) {
            console.log('Chama mini janela de confirmaçao');
            setConfirmEdit(true);
        }
    }
    function onConfirmSubmitDelete() {
        if(!confirmDelete) {
            setInputNewGrupo(grupoEdit.nome);
            console.log('Chama mini janela de confirmaçao');
            setConfirmDelete(true);
        }
    }

    function tirarFocusInputs() {
        const inputs = document.querySelectorAll('.content-window input');
        inputs.forEach(input => {
            input.blur();
        });
    }

    

    return (
        <div className="Modal">

            <div className="modal-background" onClick={closeModal}></div>

            <div className="modal-window">
                <div className="top-window">
                    <h3>{grupoEdit ? 'Editar Grupo' : 'Adicionar Grupo'}</h3>
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

                    <div className="btns-window">
                        <button type='button' onClick={closeModal}>Cancelar</button>
                        <button type="button" onClick={onConfirmSubmitDelete}>Remover</button>
                        <button type='submit' disabled={inputNewGrupo === grupoEdit.nome || !inputNewGrupo}>
                            Salvar
                        </button>
                    </div>

                    {confirmEdit && (
                        <div className="modal-background-mini">
                            <div className="modal-mini edit">
                                <h3>Certeza que desaja salvar as alterações?</h3>

                                <p>
                                    O nome do grupo passará a ser: <br /> <strong>{inputNewGrupo}</strong> 
                                    {/* Index: <strong>{idxGrupoClicado}</strong> */}
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
                    {confirmDelete && (
                        <div className="modal-background-mini">
                            <div className="modal-mini">
                                <h3>{checkDeleteDB ? 'Remover grupo na base de dados' : 'Deseja remover o grupo?'}</h3>

                                <div className="remover-grupo">
                                    <p>
                                        Grupo a ser removido: <br /> <strong>{inputNewGrupo}</strong> 
                                    </p>
                                    
                                    <label>
                                        <input type="checkbox" checked={checkDeleteDB} onChange={()=> {setCheckDeleteDB(!checkDeleteDB)}} /> <small>Remover de forma permanente.</small>
                                    </label>
                                    {checkDeleteDB &&
                                    <div className="label-input">
                                        <label>Para confirmar, digite o nome do grupo que deseja remover na base de dados:</label>
                                        <input type="text" value={inputDeleteDB} onChange={(e)=> setInputDeleteDB(e.target.value)} placeholder="digite" required />
                                    </div>
                                    }
                                </div>

                                <div className="btns-yes-no">
                                    <button type="button" className="btn-yes" onClick={onSubmitDeleteGrupo} disabled={checkDeleteDB && inputNewGrupo !== inputDeleteDB}>
                                        {checkDeleteDB ? 'Remover permanentemente' : 'Sim'}
                                    </button>
                                    <button type="button" onClick={() => {setConfirmDelete(false); setCheckDeleteDB(false)}}>
                                        {checkDeleteDB ? 'Cancelar' : 'Não'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </form>

                ) : (

                <form className="content-window" onSubmit={onConfirmSubmitAdd}>
        
                    <label htmlFor="grupo">{newGrupo ? 'Novo grupo: ' : 'Grupo: '}</label>

                    {newGrupo ? (
                
                        <input type="text" name="" id="grupo" className="show" placeholder='Digite aqui' value={inputNewGrupo} onChange={(e)=> setInputNewGrupo(e.target.value)}/>
                    
                    ) : (

                        <select 
                        // id='grupo'
                        value={grupoSelect}
                        onChange={(e)=> {setGrupoSelect(e.target.value); setErro(false)}}
                        className="show"
                        >
                            <option value="">Selecione um grupo</option>

                            {gruposDB.map((grupo)=> (
                            <option key={grupo.id} value={`{"id":${grupo.id},"nome":"${grupo.nome}"}`}>
                                {`${formatarNumero(grupo.id)} - ${grupo.nome}`}
                            </option>
                            ))}
                        </select>
                        
                    )}
                    {erro && <small className="msg-erro">{erro}</small>}
                    
                    <label className="label-check">
                        <input type="checkbox" checked={newGrupo} onChange={onNewGrupoCheck} />
                        <small> Não encontrou o que gostaria? Crie um novo grupo.</small>
                    </label>

                    <div className="btns-window">
                        <button type='button' onClick={closeModal}>Cancelar</button>
                        {newGrupo ? (
                            <button type='submit' disabled={!inputNewGrupo}>Adicionar</button>
                        ) : (
                            <button type='button' onClick={onSubmitAddGrupo} disabled={!grupoSelect}>Adicionar</button>
                        )}
                    </div>

                    {confirmAdd && (
                        <div className="modal-background-mini">
                            <div className="modal-mini">
                                <h3>Um novo grupo será criado:</h3>

                                <p>
                                    Nome do grupo: <strong>{inputNewGrupo}</strong>
                                </p>

                                <p>Deseja continuar?</p>

                                <div>
                                    <button type="button" className="btn-yes" onClick={onSubmitAddGrupo}>
                                        Sim
                                    </button>
                                    <button type="button" onClick={() => setConfirmAdd(false)}>
                                        Não
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </form>

                )

                )}
            </div>
        
        </div>
    )
}