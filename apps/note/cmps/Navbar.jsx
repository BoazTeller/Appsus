export function Navbar() {
    return (
        <div className="navbar">
            <div className="type-filter-container">
                <button className="type-filter txt">Txt</button>
            </div>
            <div className="type-filter-container">
                <button className="type-filter images">Images</button>
            </div>
            <div className="type-filter-container">
                <button className="type-filter todos">Todos</button>
            </div>
        </div>
    )
}