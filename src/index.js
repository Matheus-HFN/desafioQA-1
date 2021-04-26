// Exportando o express
const { response } = require('express');
const express = require('express');

// Biblioteca que irá criar id unico para as pessoas.
const { v4: uuidv4 } = require('uuid');
const { validate: isUuid } = require('uuid');

//Configurando a porta/endereço, verificar se a porta está disponivel
const app = express();

app.use(express.json());

// O array de pessoas cadastradas.
const PessoasCadastradas = [];

// O array de receitas cadastradas.
const ReceitasCadastradas = [];

// Validações Middlewares

function validarPessoaId(resquest, response, next) {
  const { pessoaId } = resquest.params;

  if(!isUuid(pessoaId)){
    return response.status(404).json({ codigoError: '1', mensagemErro: 'Pessoa não encontrada' });
  }

  return next();
}

function validarReceitaId(resquest, response, next) {
  const { receitaId } = resquest.params;

  if(!isUuid(receitaId)) {
    return response.status(400).json({ codigoError: '2', mensagemErro: 'Receita não encontrada.' });
  }

  return next();
}

// API de Pessoas

// Buscar todas as Pessoas Cadastradas
app.get('/pessoas', 
(resquest, response) => {
  return response.json(PessoasCadastradas);
});

// Filtrar uma pessoa.
app.get('/pessoas/:pessoaId', validarPessoaId, 
(resquest, response) => {
  const { pessoaId } = resquest.params;

  const filtra = PessoasCadastradas.find(filtra => filtra.pessoaId === pessoaId);

  return response.json(filtra);
});


// Cadastrar uma pessoa.
app.post('/pessoas',
(resquest, response) => {
  const { name, dataNascimento, cpf, ativo, meta } = resquest.body

  const CadastrarPessoa = 
    {
      pessoaId: uuidv4(),
      name,
      dataNascimento,
      cpf,
      ativo,
      meta,
    };

    if (!name) {
      return response.status(400).json({ codigoError: '3', mensagemErro: 'Nome em branco.' });
    }

    if (!dataNascimento) {
      return response.status(400).json({ codigoError: '4', mensagemErro: 'Data de nascimento em branco.' });
    }

    if (!cpf) {
      return response.status(400).json({ codigoError: '5', mensagemErro: 'O cpf informado não é valido' });
    }

    if (!ativo) {
      return response.status(400).json({ codigoError: '6', mensagemErro: 'Ativo não informado' });
    }


    if (!meta) {   
      return response.status(400).json({ codigoError: '7', mensagemErro: 'O valor da meta está em branco' });
    }

    if (meta < 0) {   
      return response.status(400).json({ codigoError: '8', mensagemErro: 'O valor da meta tem que ser maior que zero' });
    }

  PessoasCadastradas.push(CadastrarPessoa);
  return response.json(CadastrarPessoa);
});

//EditPessoa = Editar uma pessoa, findIndex e um jeito diferente de procruar algo.
app.put('/pessoas/:pessoaId', validarPessoaId, (resquest, response) => {
  const { pessoaId } = resquest.params;
  const { name, dataNascimento, cpf, ativo, meta } = resquest.body

  const pessoaIndex = PessoasCadastradas.findIndex(EditarPessoa => EditarPessoa.pessoaId === pessoaId);

  const EditarPessoa = 
    {
      pessoaId,
      name,
      dataNascimento,
      cpf,
      ativo,
      meta,
    };


    if (!name) {
      return response.status(400).json({ codigoError: '3', mensagemErro: 'Nome em branco.' });
    }

    if (!dataNascimento) {
      return response.status(400).json({ codigoError: '4', mensagemErro: 'Data de nascimento em branco.' });
    }

    if (!cpf) {
      return response.status(400).json({ codigoError: '5', mensagemErro: 'O cpf informado não é valido' });
    }

    if (!ativo) {
      return response.status(400).json({ codigoError: '6', mensagemErro: 'Ativo não informado' });
    }


    if (!meta) {   
      return response.status(400).json({ codigoError: '7', mensagemErro: 'O valor da meta está em branco' });
    }

    if (meta < 0) {   
      return response.status(400).json({ codigoError: '8', mensagemErro: 'O valor da meta tem que ser maior que zero' });
    }

    PessoasCadastradas[pessoaIndex] = EditarPessoa;
      
  return response.json(EditarPessoa);
});


// API de Receitas

app.get('/receitas', (resquest, response) => {
  return response.json(ReceitasCadastradas);
});

app.get('/receitas/:receitaid', validarReceitaId, (resquest, response) => {
  const { id } = resquest.params;

  const IdReceitas = ReceitasCadastradas.find(IdReceitas => IdReceitas.id === id);

  if (IdReceitas < 0) {
    return response.status(400).json({ error: 'Receita não encontrada.' })
  }

  return response.json(IdReceitas);
});


//Cadastrar uma Receita
app.post('/receitas', (resquest, response) => {
  const { pessoaId, data, valor} = resquest.body

  const IdReceitas = PessoasCadastradas.find(IdReceitas => IdReceitas.pessoaId === pessoaId);

  if (!IdReceitas) {
    return response.status(400).json({ error: 'Pessoa não cadastrada' })
  }
  
  const CadastrarReceitas = 
  {
    receitaId: uuidv4(), 
    pessoaId,
    data, 
    valor,
  };

  if (!data) {
    return response.status(400).json({ codigoError: '10', mensagemErro: 'Data está em branco.' })
  }

  if (!valor) {
    return response.status(400).json({ codigoError: '11', mensagemErro: 'Valor está em branco.' })
  }

  if (valor < 0) {   
    return response.status(400).json({ codigoError: '12', mensagemErro: 'O valor tem que ser maior que zero' });
  }

  ReceitasCadastradas.push(CadastrarReceitas);
  return response.json(CadastrarReceitas);
});

// Editar uma Receita
app.put('/receitas/:receitaId', validarReceitaId, (resquest, response) => {
  const { receitaId } = resquest.params;
  const { pessoaId, data, valor} = resquest.body

  const IdReceitas = PessoasCadastradas.find(IdReceitas => IdReceitas.pessoaId === pessoaId);

  const receitaIndex = ReceitasCadastradas.findIndex(EditarReceita => EditarReceita.receitaId === receitaId);

  if (receitaIndex < 0) {
    return response.status(404).json({ error: 'Receita não encontrada.' })
  }

  if (!IdReceitas) {
    return response.status(404).json({ error: 'Pessoa não cadastrada' })
  }

  const EditarReceita = 
    {
      receitaId,
      pessoaId,
      data,
      valor,
    };

    if (!data) {
      return response.status(404).json({ codigoError: '10', mensagemErro: 'Data está em branco.' })
    }
  
    if (!valor) {
      return response.status(404).json({ codigoError: '11', mensagemErro: 'Valor está em branco.' })
    }
  
    if (valor < 0) {   
      return response.status(404).json({ codigoError: '12', mensagemErro: 'O valor tem que ser maior que zero' });
    }

    ReceitasCadastradas[receitaIndex] = EditarReceita;
      
  return response.json(EditarReceita);
});


//Deletar uma Receita
app.delete('/receitas/:receitaId', (resquest, response) => {
  const { receitaId } = resquest.params;

  const receitasIndex = ReceitasCadastradas.findIndex(DeletarReceitas => DeletarReceitas.receitaId === receitaId);

  if (receitasIndex < 0) {
    return response.status(404).json({ error: 'Receita não encontrada.' })
  }

  ReceitasCadastradas.splice(receitasIndex, 1);

  return response.status(204).json({ error: 'Receita deletada' })
});

// A soma de todas as Receitas.
app.get('/totalizadores', (resquest, response) => {
  return response.status(200).json({ error: 'Soma receita' })
});

//Qunado o servidor for iniciado irá retornar está mensagem "Server started"
app.listen(3333, () => {
  console.log('Server started!');
});