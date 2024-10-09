'use strict'

const NOTES_DB = 'notesDB'
import {storageService} from "../../../services/async-storage.service.js"
import { utilService } from "../../../services/util.service.js"

const imageUrls = [
    'https://picsum.photos/id/237/200/300',
    'https://picsum.photos/id/238/200/300',
    'https://picsum.photos/id/239/200/300',
    'https://picsum.photos/id/240/200/300',
    'https://picsum.photos/id/241/200/300',
    'https://picsum.photos/id/242/200/300',
    'https://picsum.photos/id/243/200/300',
    'https://picsum.photos/id/244/200/300',
    'https://picsum.photos/id/245/200/300',
    'https://picsum.photos/id/246/200/300'
];

_createNotes()

export const noteService = {
    query,
    post,
    get,
    remove,
    put,
    _createNotes,
    _getEmptyNote
}

function _createNotes() {
    let dummyNotes = utilService.loadFromStorage(NOTES_DB)

    if(!dummyNotes || !dummyNotes.length) {
        dummyNotes = []
        for (let i = 0; i < 10; i++) {
            const txtNote = _createDummyTxtNote(`Title ${i}`, `Text content ${i}`);
            const imgNote = _createDummyImgNote(`Image ${i + 1}`, imageUrls[i]);
            const todoNote = _createDummyTodoNote(`Todo ${i}`, [
                { id: 0, txt: `Task 1 for note ${i}`, done: false },
                { id: 1, txt: `Task 2 for note ${i}`, done: true }
            ]);
    
            dummyNotes.push(txtNote, imgNote, todoNote);
        }
    }

    utilService.saveToStorage(NOTES_DB, dummyNotes);

    console.log('Dummy notes saved to localStorage:', dummyNotes);
}


function _createDummyTxtNote(title, txt) {
    const dummyTxtNote = _getEmptyNote('NoteTxt');
    
    dummyTxtNote.type = 'NoteTxt';
    dummyTxtNote.createdAt = Date.now();
    dummyTxtNote.isPinned = true;
    dummyTxtNote.style = { backgroundColor: '#eaded4' };
    dummyTxtNote.info = {
        title: title,
        txt: txt
    };
    
    return dummyTxtNote;
}

function _createDummyImgNote(title, url) {
    const dummyImgNote = _getEmptyNote('NoteImg');
    
    dummyImgNote.type = 'NoteImg';
    dummyImgNote.createdAt = Date.now();
    dummyImgNote.isPinned = false;
    dummyImgNote.style = { backgroundColor: '#c0f4e7' };
    dummyImgNote.info = {
        title: title,
        url: url // Set the image URL
    };
    
    return dummyImgNote;
}

function _createDummyTodoNote(title, todos) {
    const dummyTodoNote = _getEmptyNote('NoteTodos');
    
    dummyTodoNote.type = 'NoteTodos';
    dummyTodoNote.createdAt = Date.now();
    dummyTodoNote.isPinned = false;
    dummyTodoNote.style = { backgroundColor: '#ffffff' };
    dummyTodoNote.info = {
        title: title,
        todos: todos 
    };
    
    return dummyTodoNote;
}

function post(newNote){
    console.log('new note in the service: ', newNote)
    return storageService.post(NOTES_DB, newNote)
}

function query(){
    return storageService.query(NOTES_DB)
    .then(notes => {
        console.log(notes)
        return notes
    })
}

function remove(noteId){
    console.log('removing note with id ' + noteId)
    return storageService.remove(NOTES_DB, noteId).then(notes => {
        console.log('notes after remove', notes)
        return notes
    })
}

function get(noteId){
    return storageService.get(NOTES_DB, noteId)
    .then(note => {
        return note
    })
}

function put(newNote){
    console.log('DEBUG: service got edited note to handle with id: ' + newNote.id)
    return storageService.put(NOTES_DB, newNote).then(newNote)
}

function _getEmptyNote(type){
    switch(type) {
        case 'NoteTxt':
            return {type, createdAt: '', isPinned:false, style:{backgroundColor:'#ffffff'}, info:{title:'', txt:''}}
        case 'NoteImg':
            return {type, createdAt: '', isPinned:false, style:{backgroundColor:'#fffff'}, info:{url:'', title:''}}
        case 'NoteTodos':
            return {type, createdAt: '', isPinned:false, style:{backgroundColor:'#fffff'}, info:{todos:[{id:0, txt:'',done:false}], title:''}}
    }
}




