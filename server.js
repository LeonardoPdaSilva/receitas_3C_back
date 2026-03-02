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
    const resultado = await sql.query('INSERT INTO usuario (nome, senha) VALUES ($1, $2)', [nome, senha])
    return 'usuario criado com sucesso'
})
servidor.listen({port: 3000})
 