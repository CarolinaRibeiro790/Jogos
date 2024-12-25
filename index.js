const express = require("express");
const app = express();
const bodyParser = require('body-parser');

const connection = require('./database/database');
const gamesModel = require('./database/games');

connection.authenticate();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Deletar
app.get('/delete/:id', (req, res) => {
    const id = req.params.id;

    gamesModel.destroy({
        where: { id: id }
    }).then(() => {
        res.redirect('back');
    }).catch((error) => {
        console.error(error);
        res.status(500).send('Erro ao deletar o jogo.');
    });
});

// Editar
app.post('/editar', (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const year = req.body.year;

    gamesModel.update({
        title: title,
        year: year,
    }, {
        where: { id: id }
    }).then(([affectedCount]) => {
        if (affectedCount > 0) {
            res.redirect('/');
        } else {
            res.status(404).send('Jogo não encontrado para editar.');
        }
    }).catch((error) => {
        console.error(error);
        res.status(500).send('Erro ao editar o jogo.');
    });
});

// Abrir tela de edição
app.get('/edit/:id', (req, res) => {
    const { id } = req.params;

    gamesModel.findOne({
        where: { id: id }
    }).then(game => {
        if (game) {
            res.render('editar', {
                game: game
            });
        } else {
            res.status(404).send('Jogo não encontrado.');
        }
    }).catch((error) => {
        console.error(error);
        res.status(500).send('Erro ao buscar o jogo.');
    });
});

// Criar
app.post('/salvar', (req, res) => {
    const title = req.body.title;
    const year = req.body.year;

    gamesModel.create({
        title: title,
        year: year,
    }).then(() => {
        res.redirect('/');
    }).catch((error) => {
        console.error(error);
        res.status(500).send('Erro ao salvar o jogo.');
    });
});

// Abrir tela cadastrar
app.get("/criar", (req, res) => {
    res.render('criar');
});

// Tela inicial
app.get('/', (req, res) => {
    gamesModel.findAll({ raw: true, order: [['id', 'DESC']] }).then(games => {
        res.render('listar', {
            games: games
        });
    }).catch((error) => {
        console.error(error);
        res.status(500).send('Erro ao listar os jogos.');
    });
});

app.listen(8181, function (erro) {
    if (erro) {
        console.log("Erro");
    } else {
        console.log("Servidor iniciado...");
    }
});
