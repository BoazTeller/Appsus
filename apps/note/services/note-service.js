'use strict'

const NOTES_DB = 'notesDB'
import {storageService} from "../../../services/async-storage.service.js"

export const noteService = {
    query,
    post,
    _getEmptyNote
}

function post(newNote){
    console.log('new note in the service: ', newNote)
    storageService.post(NOTES_DB, newNote)
}

function query(){
    
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




