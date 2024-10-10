export function Navbar({onFilterType}) {
    return (
        <div className="navbar">
            <div className="type-filter-container" onClick={(ev)=>onFilterType(ev,'NoteTxt')}>
                <button className="type-filter txt">Txt</button>
                <button className="fa-regular fa-comment icon"/>
            </div>
            <div className="type-filter-container" onClick={(ev)=>onFilterType(ev,'NoteImg')}>
                <button className="type-filter images">Images</button>
                <button className="fa-regular fa-image icon" />

            </div>
            <div className="type-filter-container" onClick={(ev)=>onFilterType(ev,'NoteTodos')}>
                <button className="type-filter todos">Todos</button>
                <button className="fa fa-check-square icon" />
            </div>
        </div>
    )
}