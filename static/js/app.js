const API_URL = 'http://127.0.0.1:5000/apirestful';  
let token = localStorage.getItem('auth_token');  // Recupera o token do localStorage 

// Função para autenticar o usuário
async function login() {
    const nome = document.getElementById('nome').value;
    const matricula = document.getElementById('matricula').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, matricula })
        });

        const data = await response.json();
        if (response.ok) {
            token = data.token;  // Salva o token JWT
            localStorage.setItem('auth_token', token);
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('app-container').style.display = 'block';
            listarUsuarios();  // Carrega os dados dos usuários
        } else {
            showAlert(data.message || 'Erro ao fazer login');
        }
    } catch (error) {
        showAlert('Erro de conexão');
    }
}

// Função de logout
async function logout() {
    try {
        const response = await fetch(`${API_URL}/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (response.ok) {
            token = '';
            localStorage.removeItem('auth_token');
            document.getElementById('app-container').style.display = 'none';
            document.getElementById('login-container').style.display = 'block';
        } else {
            showAlert('Erro ao realizar logout');
        }
    } catch (error) {
        showAlert('Erro de conexão');
    }
}

// Função para exibir alertas
function showAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.classList.add('alert');
    alertBox.innerText = message;
    document.body.appendChild(alertBox);
    setTimeout(() => {
        alertBox.remove();
    }, 3000);
}

// ----------------------------
// Funções CRUD para USUÁRIOS
// ----------------------------

// Criar usuário
async function criarUsuario() {
    const nome = document.getElementById('usuario-nome').value;
    const matricula = document.getElementById('usuario-matricula').value;
    const tipo = document.getElementById('usuario-tipo').value;
    const curso_id = document.getElementById('usuario-curso-id').value;
    try {
        const response = await fetch(`${API_URL}/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({nome, matricula, tipo, curso_id})
        });

        const data = await response.json();
        showAlert(data.message || 'Usuário criado com sucesso');
        if (response.ok) {
            listarUsuarios();
        }
    } catch (error) {
        showAlert('Erro ao criar usuário');
    }
}


// Listar usuários
async function listarUsuarios() {
    try {
        const response = await fetch(`${API_URL}/usuarios`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const usuarios = await response.json();
        console.log(usuarios); // Verifique a estrutura dos dados aqui
        const usuariosList = document.getElementById('usuarios-list');
        usuariosList.innerHTML = '';

        usuarios.forEach(usuario => {
            const li = document.createElement('li');
            li.textContent = `${usuario.nome} - ${usuario.matricula}`;
            li.appendChild(createUpdateButton(usuario.id));
            li.appendChild(createDeleteButton(usuario.id));
            usuariosList.appendChild(li);
        });
    } catch (error) {
        showAlert('Erro ao carregar usuários');
    }
}


// Atualizar usuário
async function atualizarUsuario(userId, nome, matricula, tipo, curso_id) {
    try {
        const response = await fetch(`${API_URL}/usuarios/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nome, matricula, tipo, curso_id })
        });

        const data = await response.json();
        showAlert(data.message || 'Usuário atualizado com sucesso');
        if (response.ok) {
            listarUsuarios();
        }
    } catch (error) {
        showAlert('Erro ao atualizar usuário');
    }
}

// Deletar usuário
async function deletarUsuario(userId) {
    try {
        const response = await fetch(`${API_URL}/usuarios/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        showAlert(data.message || 'Usuário deletado com sucesso');
        if (response.ok) {
            listarUsuarios();
        }
    } catch (error) {
        showAlert('Erro ao deletar usuário');
    }
}

// ----------------------------
// Funções CRUD para CURSOS
// ----------------------------

// Criar curso
async function criarCurso() {
    const nome = document.getElementById('curso-nome').value;
    try {
        const response = await fetch(`${API_URL}/cursos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nome })
        });

        const data = await response.json();
        showAlert(data.message || 'Curso criado com sucesso');
        if (response.ok) {
            listarCursos();
        }
    } catch (error) {
        showAlert('Erro ao criar curso');
    }
}

// Listar cursos
async function listarCursos() {
    try {
        const response = await fetch(`${API_URL}/cursos`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const cursos = await response.json();
        const cursosList = document.getElementById('cursos-list');
        cursosList.innerHTML = '';

        cursos.forEach(curso => {
            const li = document.createElement('li');
            li.textContent = curso.nome;
            li.appendChild(createUpdateButton(curso.id));
            li.appendChild(createDeleteButton(curso.id));
            cursosList.appendChild(li);
        });
    } catch (error) {
        showAlert('Erro ao carregar cursos');
    }
}
// Atualizar curso
async function updateCurso(cursoId) {
    console.log(cursoId); // Verifique se o valor está sendo passado corretamente
    try {
        const response = await fetch(`${API_URL}/cursos/${cursoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nome: 'Novo Nome do Curso' })
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message || 'Curso atualizado com sucesso');
            listarCursos();
        } else {
            alert(data.message || 'Erro ao atualizar curso');
        }
    } catch (error) {
        alert('Erro ao atualizar curso: ' + error.message);
    }
}

// Deletar curso
async function deleteCurso(cursoId) {
    console.log(cursoId); // Verifique se o valor está sendo passado corretamente
    try {
        const response = await fetch(`${API_URL}/cursos/${cursoId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message || 'Curso deletado com sucesso');
            listarCursos();
        } else {
            alert(data.message || 'Erro ao deletar curso');
        }
    } catch (error) {
        alert('Erro ao deletar curso: ' + error.message);
    }
}

// ----------------------------
// Funções CRUD para DISCIPLINAS
// ----------------------------

// Criar disciplina
async function criarDisciplina() {
    const nome = document.getElementById('disciplina-nome').value;
    const curso_id = document.getElementById('disciplina-curso-id').value;
    try {
        const response = await fetch(`${API_URL}/disciplinas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nome, curso_id })
        });

        const data = await response.json();
        showAlert(data.message || 'Disciplina criada com sucesso');
        if (response.ok) {
            listarDisciplinas();
        }
    } catch (error) {
        showAlert('Erro ao criar disciplina');
    }
}

// Listar disciplinas
async function listarDisciplinas() {
    try {
        const response = await fetch(`${API_URL}/disciplinas`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const disciplinas = await response.json();
        const disciplinasList = document.getElementById('disciplinas-list');
        disciplinasList.innerHTML = '';

        disciplinas.forEach(disciplina => {
            const li = document.createElement('li');
            li.textContent = `${disciplina.nome} - Professor: ${disciplina.professor}`;
            li.appendChild(createUpdateButton(disciplina.id));
            li.appendChild(createDeleteButton(disciplina.id));
            disciplinasList.appendChild(li);
        });
    } catch (error) {
        showAlert('Erro ao carregar disciplinas');
    }
}

// Atualizar disciplina
async function atualizarDisciplina(disciplinaId, nome, curso_id) {
    try {
        const response = await fetch(`${API_URL}/disciplinas/${disciplinaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nome, curso_id })
        });

        const data = await response.json();
        showAlert(data.message || 'Disciplina atualizada com sucesso');
        if (response.ok) {
            listarDisciplinas();
        }
    } catch (error) {
        showAlert('Erro ao atualizar disciplina');
    }
}

// Deletar disciplina
async function deletarDisciplina(disciplinaId) {
    try {
        const response = await fetch(`${API_URL}/disciplinas/${disciplinaId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        showAlert(data.message || 'Disciplina deletada com sucesso');
        if (response.ok) {
            listarDisciplinas();
        }
    } catch (error) {
        showAlert('Erro ao deletar disciplina');
    }
}




// ----------------------------
// Funções CRUD para MATRÍCULAS
// ----------------------------

// Criar matrícula

function criarMatricula() {
    const selectCurso = document.getElementById('matricula-curso-id');
    const selectDisciplina = document.getElementById('matricula-disciplina-id');
    const selectAluno = document.getElementById('matricula-aluno-id');

    const cursoId = selectCurso.value;
    const disciplinaId = selectDisciplina.value;
    const alunoId = selectAluno.value;

    if (!cursoId || !disciplinaId || !alunoId) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const authToken = localStorage.getItem('auth_token');

    if (!authToken) {
        console.error('Token de autenticação não encontrado');
        return;
    }

    const matriculaData = {
        curso_id: cursoId,
        disciplina_id: disciplinaId,
        aluno_id: alunoId
    };

    fetch('http://127.0.0.1:5000/apirestful/matriculas', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(matriculaData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Matrícula realizada com sucesso!');
        // Opcionalmente, você pode atualizar a UI ou limpar os campos aqui.
    })
    .catch(error => {
        console.error('Erro ao realizar matrícula:', error);
        mostrarErro('Não foi possível realizar a matrícula.');
    });
}

// Listar matrículas
async function listarMatriculas() {
    const token = localStorage.getItem('auth_token'); // Verifique se o token está corretamente configurado

    try {
        const response = await fetch('http://127.0.0.1:5000/apirestful/matriculas', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const matriculas = await response.json();
        exibirMatriculas(matriculas); // Passa a lista de matrículas para exibir
    } catch (error) {
        alert('Erro ao carregar matrículas');
    }
}

// Exibir as matrículas na interface
function exibirMatriculas(matriculas) {
    const listaMatriculas = document.getElementById('lista-matriculas'); // Verifique se este elemento existe no HTML
    listaMatriculas.innerHTML = '';  // Limpa a lista antes de exibir

    matriculas.forEach(matricula => {
        const listItem = document.createElement('li');
        listItem.classList.add('matricula-item');

        // Exibindo informações da matrícula
        listItem.innerHTML = `
            <strong>Aluno:</strong> ${matricula.aluno} - 
            <strong>Disciplina:</strong> ${matricula.disciplina} - 
            <button onclick="atualizarMatricula(${matricula.id})">Atualizar</button>
            <button onclick="deletarMatricula(${matricula.id})">Deletar</button>
        `;

        listaMatriculas.appendChild(listItem);
    });
}

// Atualizar matrícula
async function atualizarMatricula(matriculaId, usuarioId, disciplinaId) {
    try {
        const response = await fetch(`${API_URL}/matriculas/${matriculaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ usuario_id: usuarioId, disciplina_id: disciplinaId })
        });

        const data = await response.json();
        showAlert(data.message || 'Matrícula atualizada com sucesso');
        if (response.ok) {
            listarMatriculas();
        }
    } catch (error) {
        showAlert('Erro ao atualizar matrícula');
    }
}

// Deletar matrícula
async function deletarMatricula(matriculaId) {
    try {
        const response = await fetch(`${API_URL}/matriculas/${matriculaId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        showAlert(data.message || 'Matrícula deletada com sucesso');
        if (response.ok) {
            listarMatriculas();
        }
    } catch (error) {
        showAlert('Erro ao deletar matrícula');
    }
}

