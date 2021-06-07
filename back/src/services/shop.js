const axios = require('axios')
const crypto = require('crypto')
const moment = require('moment')
const con = require('../services/connection')
const { Token } = require('../schemas/Token')

async function privateCall(path, data, method = 'get') {
  let tokens = await Token.find()
  console.log('tokens => ', tokens)

  if (tokens.length === 0) {
    console.log('token não encontrado gerando um novo')
    await auth()
    tokens = await Token.find()
  }

  let { token, expireAt } = tokens[0]

  const agora = moment().format('YYYY-MM-DD HH:mm:ss')
  const validadeToken = moment(expireAt).format('YYYY-MM-DD HH:mm:ss')

  if (agora >= validadeToken) {
    console.log('token vencido, gerando novo token')
    await auth()
    tokens = await Token.find()
    token = tokens[0].token
  }

  const timestamp = new Date().getTime()
  const encoded = data
    ? Buffer.from(JSON.stringify(data), 'ascii').toString('base64')
    : ''
  const signature = crypto
    .createHmac('sha256', process.env.SENHA)
    .update(`${method}${timestamp}${encoded}`)
    .digest('base64')

  const headers = {
    CodFilial: process.env.CODFILIAL,
    Timestamp: timestamp,
    Authorization: `Token ${token}`,
    Signature: signature,
  }

  try {
    const response = await axios({
      method,
      url: `${process.env.BASE_URL}${path}`,
      data,
      headers,
    })
    //console.log('response.data', response)
    return response.data
  } catch (error) {
    console.log('error', error)
    return error
  }
}

async function publicCall(path, data, method = 'get') {
  try {
    const response = await axios({
      method,
      url: `${process.env.BASE_URL}${path}`,
      data,
    })
    return response.data
  } catch (error) {
    console.log('error', error)
    return error
  }
}

async function produtos(page = 1) {
  return privateCall(`/produtos/${page}`)
}

async function postClientes(data) {
  return privateCall(`/clientes/`, data, 'post')
}

async function postVenda(data) {
  return privateCall(`/vendas/`, data, 'post')
}

async function todos(path) {
  return privateCall(path, {}, 'get')
}

async function auth() {
  try {
    await Token.collection.drop()
  } catch (error) {}

  const serie = process.env.SERIE
  const codfilial = process.env.CODFILIAL

  const result = await publicCall(
    `/auth/?serie=${serie}&codfilial=${codfilial}`
  )
  const { dados, sucesso, mensagem } = result
  // console.log('dados', dados)

  if (sucesso) {
    await con.query('TRUNCATE TABLE `tokens`')
    const expireAt = moment(dados.expireAt).format('YYYY-MM-DD HH:mm:ss')
    console.log('expireAt', expireAt)

    await Token.create({
      token: dados.token,
      expireAt: expireAt,
    })

    return {
      mensagem: `Token gerado: ${dados.token}`,
    }
  }

  return {
    mensagem: `Erro ao obter token: ${mensagem}`,
  }
}

module.exports = { produtos, postClientes, postVenda, auth, todos }
