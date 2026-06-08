import Fastify from 'fastify';
import { Pool } from 'pg';
import cors from '@fastify/cors';

const sql = new Pool({
    user: "postgres",
    password: "senai",
    host: "localhost",
    port: 5432,
    database: "receitas"
})
 

const servidor = Fastify()
servidor.register(cors, {
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE']
})

servidor.get('/usuarios', async () => {
   const resultado = await sql.query("SELECT * FROM usuario")
    return resultado.rows
})
servidor.delete('/usuarios/:id', async (request, reply) => {
    const id = request.params.id

    await sql.query(
        "DELETE FROM usuario WHERE id = $1",
        [id]
    )

    return reply.send({
        mensagem: "Usuário deletado com sucesso"
    })
})

servidor.put('/usuarios/:id', async (request, reply) => {
    const body = request.body;  
    const id = request.params.id;

    if (!body || !body.nome || !body.senha || !body.email) {
        return reply.status(400).send({
            error: "nome, email e senha são obrigatórios"
        })
    }

    if (!id) {
        return reply.status(400).send({
            error: "Faltou o ID"
        })
    }

    const resultado = await sql.query(
        'UPDATE usuario SET nome = $1, email = $2, senha = $3 WHERE id = $4',
        [body.nome, body.email, body.senha, id]
    )

    return reply.send({
        mensagem: "Usuário atualizado com sucesso"
    })
})


servidor.post("/usuarios", async (request, reply) => {
    const nome = request.body.nome;
    const senha = request.body.senha;
    const email = request.body.email;
    const resultado = await sql.query('INSERT INTO usuario (nome, senha, email) VALUES ($1, $2, $3)', [nome, senha, email])
    return reply.send({
        mensagem: "Usuário criado com sucesso"
    })
})

servidor.post("/login", async (request, reply) => {
    const body = request.body;
    const resultado = await sql.query('SELECT * FROM USUARIO WHERE email = $1 AND senha = $2',
    [body.email, body.senha])
    if(resultado.rows.length === 0){
        return reply.status(401).send({
            error: "email ou senha invalido"
        })   
    } 
    reply.status(200).send({
        mensagem: "Login realizado com sucesso", ok: true
    })
})

servidor.get('/receita', async ()=>{
     const resultado = await sql.query("SELECT * FROM receita")
     return resultado.rows
})

servidor.delete('/receita/:id', async (request, reply) => {
    const id = request.params.id

    await sql.query(
        "DELETE FROM receita WHERE id = $1",
        [id]
    )

    return reply.send({
        mensagem: "Receita deletado com sucesso"
    })
})

servidor.post("/receita", async (request, reply) => {
    const nome = request.body.nome;
    const ingredientes = request.body.ingredientes;
    const instrucoes = request.body.instrucoes;
    const tempo_preparo_minutos = request.body.tempo_preparo_minutos
    const usuario_id = request.body.usuario_id

    const resultado = await sql.query(
    `INSERT INTO receita
    (usuario_id, nome, ingredientes, instrucoes, tempo_preparo_minutos)
    VALUES ($1, $2, $3, $4, $5)`,
    [usuario_id, nome, ingredientes, instrucoes, tempo_preparo_minutos]
)
    return reply.send({
        mensagem:'Receita criada com sucesso'
    })

   
})


servidor.put('/receita/:id', async (request, reply) => {
    const body = request.body
    const id = request.body.id

    if (
        !body ||
        !body.nome ||
        !body.ingredientes ||
        !body.instrucoes ||
        !body.tempo_preparo_minutos ||
        !body.usuario_id
    ) {
        return reply.status(400).send({
            error: "Informações faltando"
        })
    }

    if (!id) {
        return reply.status(400).send({
            error: "Faltou o id"
        })
    }

    await sql.query(
        `UPDATE receita
         SET nome = $1,
             ingredientes = $2,
             instrucoes = $3,
             tempo_preparo_minutos = $4,
             usuario_id = $5
         WHERE id = $6`,
        [
            body.nome,
            body.ingredientes,
            body.instrucoes,
            body.tempo_preparo_minutos,
            body.usuario_id,
            id
        ]
    )

    return reply.send({
        mensagem: "Receita atualizada com sucesso"
    })
})


servidor.listen({port: 3000})
 