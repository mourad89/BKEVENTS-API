const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();

app.get('/analyse', (req, res) => {
    const venvPath = `"${path.join('C:', 'progs', 'Cours GI 4', 'Projet ANGULAR','myenv', 'Scripts', 'activate.bat')}"`;
    const scriptPath = `"${path.join('C:', 'progs', 'Cours GI 4', 'Projet ANGULAR', 'myenv', 'app.py')}"`;


    const cmd = `call ${venvPath} && python ${scriptPath}`;


    exec(cmd, { shell: 'cmd.exe' }, (err, stdout, stderr) => {
        if (err) {
            console.error('Erreur d\'exécution du script Python :', err);
            res.status(500).send('Erreur d\'exécution du script Python.');
            return;
        }

        if (stderr) {
            console.error('Erreur dans le fichier Python :', stderr);
            res.status(500).send(stderr);
            return;
        }

        console.log('Script python executé avec succé ');
        res.send(stdout.toString());
    });
});


module.exports = app;
