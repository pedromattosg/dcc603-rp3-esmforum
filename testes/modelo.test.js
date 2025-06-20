const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando cadastro de uma resposta para uma pergunta', () => {
  modelo.cadastrar_pergunta('4 + 4 = ?');
  const perguntas = modelo.listar_perguntas();
  const idPergunta = perguntas[0].id_pergunta;
  const idResposta = modelo.cadastrar_resposta(idPergunta, '8');
  const respostas = modelo.get_respostas(idPergunta);
  expect(respostas.length).toBe(1);
  expect(respostas[0].texto).toBe('8');
  expect(respostas[0].id_resposta).toBe(idResposta);
  expect(respostas[0].id_pergunta).toBe(idPergunta);
});

test('Testando get_pergunta para uma pergunta cadastrada', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  const idPergunta = modelo.listar_perguntas()[0].id_pergunta;
  const textoPergunta =  modelo.listar_perguntas()[0].texto;
  const resultado = modelo.get_pergunta(idPergunta);
  expect(resultado.id_pergunta).toBe(idPergunta);
  expect(resultado.texto).toBe(textoPergunta);
});

test('Testando get_resposta para as respostas associadas a uma pergunta', () => {
  modelo.cadastrar_pergunta('2 + 3 = ?');
  const idPergunta = modelo.listar_perguntas()[0].id_pergunta;
  const idResposta1 = modelo.cadastrar_resposta(idPergunta, '5');
  const idResposta2 = modelo.cadastrar_resposta(idPergunta, 'cinco');
  const respostas = modelo.get_respostas(idPergunta);
  expect(respostas.length).toBe(2);
  expect(respostas[0].texto).toBe('5');
  expect(respostas[0].id_resposta).toBe(idResposta1);
  expect(respostas[1].texto).toBe('cinco');
  expect(respostas[1].id_resposta).toBe(idResposta2);
});