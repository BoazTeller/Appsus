export function PalleteColor({noteId, onEditBackgroundColor, isPaletteOpen, setIsPaletteOpen}) {

    function onColorClick(ev){
        ev.stopPropagation()
        const backgroundColor = ev.target.style.backgroundColor
        console.log('chosen background color: ' + backgroundColor)
        onEditBackgroundColor(noteId, backgroundColor)
        setIsPaletteOpen(!isPaletteOpen)
    }

    return (
        <div className="color-palette">
            <div className="color-circle" style={{ backgroundColor: '#f1f1f1' }} onClick={onColorClick}></div>
            <div className="color-circle" style={{ backgroundColor: '#e2cfa9' }} onClick={onColorClick}></div>
            <div className="color-circle" style={{ backgroundColor: '#eaded4' }} onClick={onColorClick}></div>
            <div className="color-circle" style={{ backgroundColor: '#d0b9d3' }} onClick={onColorClick}></div>
            <div className="color-circle" style={{ backgroundColor: '#b9d0d6' }} onClick={onColorClick}></div>
            <div className="color-circle" style={{ backgroundColor: '#c0e4e7' }} onClick={onColorClick}></div>
            <div className="color-circle" style={{ backgroundColor: '#c9e7d8' }} onClick={onColorClick}></div>
            <div className="color-circle" style={{ backgroundColor: '#f5f7c2' }} onClick={onColorClick}></div>
            <div className="color-circle" style={{ backgroundColor: '#f7ecd1' }} onClick={onColorClick}></div>
            <div className="color-circle" style={{ backgroundColor: '#fae0cd' }} onClick={onColorClick}></div>
        </div>
    )
}