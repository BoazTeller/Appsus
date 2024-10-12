const { useState, useEffect } = React

export function MailFilterSearch({ onSetFilterBy, filterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const { value, name: field } = target
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
    }

    function handleFormSubmit(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    return (
        <section className="mail-filter-search">
            <form className="search-form" role="search" onSubmit={handleFormSubmit}>
                <input
                    type="text"
                    name="txt"
                    value={filterByToEdit.txt || ''}
                    onChange={handleChange}
                    aria-label="Search mail"
                    placeholder="Search mail"
                    autoComplete="off"
                    className="search-input"
                />
                
                <button className="search-btn" type="submit" aria-label="Search">
                    <span className="materials">search</span>
                </button>
            </form>
        </section>
    )
}