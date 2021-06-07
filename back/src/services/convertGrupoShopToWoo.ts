const categories = [
  {
    codigo: '9999',
    name: 'Outros',
    id: 138,
  },
  {
    codigo: '1',
    name: 'Mat. de Escritório/Expedi',
    id: 139,
  },
  {
    codigo: '2',
    name: 'Material Limpeza',
    id: 140,
  },
  {
    codigo: '3',
    name: 'Material de Serigrafia',
    id: 141,
  },
  {
    codigo: '4',
    name: 'Material Escolar',
    id: 142,
  },
  {
    codigo: '5',
    name: 'Mat. Técnico e Artistist.',
    id: 143,
  },
  {
    codigo: '6',
    name: 'Suprimentos de Inform.',
    id: 144,
  },
  {
    codigo: '7',
    name: 'Gêneros Alimentícios',
    id: 145,
  },
  {
    codigo: '8',
    name: 'Material Audio-Visual',
    id: 146,
  },
  {
    codigo: '9',
    name: 'Material de Topografia',
    id: 147,
  },
  {
    codigo: '10',
    name: 'Material Eng. Florestal',
    id: 148,
  },
  {
    codigo: '11',
    name: 'Material Descartável',
    id: 149,
  },
  {
    codigo: '12',
    name: 'Utensílios Domésticos',
  },
  {
    codigo: '13',
    name: 'Material Elétrico',
    id: 151,
  },
  {
    codigo: '14',
    name: 'Mat. Quimico Profissional',
    id: 152,
  },
  {
    codigo: '15',
    name: 'Tecidos',
    id: 153,
  },
  {
    codigo: '16',
    name: 'Ferramentas',
    id: 154,
  },
]

const getCategoriaWoo = (codigo) => {
  const result = categories.filter((categoria) => categoria.codigo == codigo)
  const numberCategoriaWoo = result[0]?.id
  if (!numberCategoriaWoo) return
  return [{ id: numberCategoriaWoo }]
}

export default getCategoriaWoo

//module.exports = { getCategoriaWoo }
