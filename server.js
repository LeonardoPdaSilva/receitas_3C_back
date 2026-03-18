import Fastify from 'fastify';
import { Pool } from 'pg';

const sql = new Pool({
    user: "postgres",
    password: "senai",
    host: "localhost",
    port: 5432,
    database: "receitas"
})
 

const servidor = Fastify()

servidor.get('/usuarios', async () => {
   const resultado = await sql.query("SELECT * FROM usuario")
    return resultado.rows
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

servidor.listen({port: 3000})
 