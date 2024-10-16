const { useState, useRef, useEffect } = React

import { noteService } from "../services/note-service.js"

export function CanvasDrawing({ onCloseCanvas, onAddNote,noteToEdit,onEditNote }) {
    const canvasRef = useRef(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [isEditingCanvas, setIsEditingCanvas] = useState(false)
    // Set the canvas size to match the window size
    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")
        canvas.width = 500
        canvas.height = 500
        console.log(noteToEdit)
        if (noteToEdit && noteToEdit.isCanvas) {
            setIsEditingCanvas(true)
            const image = new Image()
            image.src = noteToEdit.info.url
            image.onload = () => {
                context.drawImage(image, 0, 0, canvas.width, canvas.height) //drawing the picture on the canvas
            }
        }
    }, [noteToEdit])

    // Start drawing when the mouse is pressed
    const startDrawing = (e) => {
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")
        context.beginPath()
        context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
        setIsDrawing(true)
    }

    // Draw while the mouse is moving
    const draw = (e) => {
        if (!isDrawing) return
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")
        context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
        context.stroke()
    }

    // Stop drawing when the mouse is released
    const stopDrawing = () => {
        setIsDrawing(false)
    }

    // Clear the canvas
    const clearCanvas = () => {
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")
        context.clearRect(0, 0, canvas.width, canvas.height)
    }

    // Save the canvas as an image
    const saveCanvas = () => {
        const canvas = canvasRef.current
        const imageUrl = canvas.toDataURL("image/png") // Get the image URL directly
        if (isEditingCanvas){
            triggerEditNote(imageUrl)
        } else {
            triggerAddNote(imageUrl)
        }
        onCloseCanvas()
    }

    function triggerEditNote(imageUrl){
        let editedNote = noteToEdit
        editedNote.info.url = imageUrl
        onEditNote(editedNote)
    }

    function triggerAddNote(imageUrl){
        let newNote = noteService._getEmptyNote('NoteImg')
        newNote.createdAt = Date.now()
        newNote.info.url = imageUrl // Set the image URL in the note
        newNote.isCanvas = true
        console.log('Saving note:', newNote)
        onAddNote(newNote) // Call onAddNote with the new note
    }

    return (
        <div style={{ textAlign: "center", position: "relative", height: "100vh", width: "100vw" }}>
            <canvas
                ref={canvasRef}
                style={{
                    marginTop:"150px",
                    width: "500px",
                    height: "500px",
                    border: "1px solid #000",
                    cursor: "crosshair",
                    padding: 0,
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
            ></canvas>
            <div className="canvas-actions-container">
                <button className='canvas-btn' onClick={clearCanvas}>Clear</button>
                <button className='canvas-btn' onClick={saveCanvas}>Save as Note</button>
                <button className='canvas-btn' onClick={onCloseCanvas}>Close</button>
            </div>
        </div>
    )
}
