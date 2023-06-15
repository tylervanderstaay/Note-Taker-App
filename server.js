
const path = require('path');
const express = require('express');
const fs = require('fs')

const port = process.env.PORT || 3001;
const app = express();
const db = './db/db.json'

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



//PAGES
//PAGES
app.get('/', (req, res) => {
    console.log(req)
    res.sendFile(path.join(__dirname, './index.html'))
});
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './notes.html'))
})
//


//DATA

//GET all notes
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, db), 'utf8', (error, notes) => {
        if (error) {
            return console.log(error)
        }
        res.json(JSON.parse(notes))
    })
});

//POST note
app.post('/api/notes', (req, res) => {
    console.log("note post api requested")
    const note = req.body;

    //get current notes
    fs.readFile(path.join(__dirname, db), 'utf8', (error, notes) => {
        if (error) {
            return console.log(error)
        }
        // console.log(`Notes: ${JSON.parse(notes)}`)
        notes = JSON.parse(notes)
        console.log('current note list ', notes)
        const id = notes.length + 10;
        console.log('current new id')
        const newNote = {
            title: note.title,
            text: note.text,
            id: id
        }
        //add current note to note list
        const newNotes = [...notes, newNote]
        console.log('new note list ', newNotes)

        //send new list to file
        fs.writeFile(path.join(__dirname, db), JSON.stringify(newNotes), (error, data) => {
            if (error) {
                return error
            }
            console.log(newNotes)
            res.json(newNotes);
        })
    });
});

app.delete('/api/notes/:id', (req, res) => {
    const deleteId = JSON.parse(req.params.id);

    fs.readFile(path.join(__dirname, db), 'utf8', (error, notes) => {
        if (error) {
            return console.log(error)
        }
        const noteList = JSON.parse(notes)

        console.log(noteList)
        const newList = noteList.filter(note => note.id !== deleteId)

        fs.writeFile(path.join(__dirname, db), JSON.stringify(newList), (error, data) => {
            if (error) {
                return error
            }
            console.log(newList)
            res.json(newList)
        });
    })
})


app.listen(port, () => {
    console.log(`Listening on Port: ${port}`)
})