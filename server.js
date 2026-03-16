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

servidor.post("/usuarios", async (request, reply) => {
    const nome = request.body.nome;
    const senha = request.body.senha;
    const email = request.body.email;
    const resultado = await sql.query('INSERT INTO usuario (nome, senha, email) VALUES ($1, $2, $3)', [nome, senha, email])
    return 'usuario criado com sucesso'
})

servidor.post("/login", async (request, reply) => {
    const email = request.body.email
    const senha = request.body.senha
    const resultado = await sql.query('SELECT * FROM USUARIO WHERE email = $1 AND senha = $2',
    [email, senha])
    if(resultado.rows.length === 0){
        return reply.status(401).send({
            mensagem: "email ou senha invalido"
        })   
    } else{
        return reply.status(200).send({
            mensagem: "Login realizado com sucesso",
            usuario: resultado.rows[0]
        })
    }
})

servidor.listen({port: 3000})
 