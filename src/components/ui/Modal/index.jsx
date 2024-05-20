// Funcionalidades / Libs:
import { useState, useEffect } from "react";
import { GRUPO_GET_ALL, GRUPO_POST_ADD, GRUPO_POST_EDIT } from '../../../API/requestApi.js';

// Assets:
// import { FiX, FiCheckCircle } from 'react-icons/fi';

// Estilo:
import './style.css';


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


    // function onChangeSelect(e) {
    //     setGrupoSelect(e.target.value);      
    //     // console.log(e.target.value);
    // }

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

        if(newGrupo) {
            try {
                // CREATE/ADD DB:
                const response = await GRUPO_POST_ADD(inputNewGrupo);
                // const response = await {id: 4, nome: inputNewGrupo};
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

    function onConfirmSubmitAdd(e) {
        e.preventDefault();

        console.log('Chama mini janela de confirmaçao');
        setConfirmAdd(true);
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
                        <div className="modal-background-mini">
                            <div className="modal-delete">
                                <h3>Certeza que desaja salvar as alterações?</h3>
                                <p>
                                    O nome do grupo passará a ser:
                                    <strong>{inputNewGrupo}</strong> 
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
                        onChange={(e)=> setGrupoSelect(e.target.value)}
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
                            <div className="modal-delete">
                                <h3>Um novo grupo será salvo:</h3>
                                <p>
                                    Nome do grupo: <strong>{inputNewGrupo}</strong>
                                </p>
                                <p>Deseja prosseguir?</p>
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