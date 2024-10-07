'use strict'

const NOTES_DB = 'notesDB'
import {storageService} from "../../../services/async-storage.service.js"

export const noteService = {
    query,
    post,
    get,
    remove,
    put,
    _getEmptyNote
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
            return {type, createdAt: '', isPinned:false, style:{backgroundColor:'#00d'}, info:{title:'', txt:''}}
        case 'NoteImg':
            return {type, createdAt: '', isPinned:false, style:{backgroundColor:'#00d'}, info:{url:'', title:''}}
        case 'NoteTodos':
            return {type, createdAt: '', isPinned:false, style:{backgroundColor:'#00d'}, info:{todos:[{txt:'',done:false}], title:''}}
    }
    // return {type: '', createdAt: '', isPinned:false, style:{}, info:{txt:'initial note text'}}
}




