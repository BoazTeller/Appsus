const { useState, useEffect } = React

export function MailFilterSearch({ onSetFilterBy, filterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function onClearTxt() {
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, txt: '' }))
    }

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
                    <span className="materials" title="Search">search</span>
                </button>

                {filterByToEdit.txt &&
                    <button className="clear-btn" type="button" aria-label="Clear">
                        <span className="materials" title="Clear search" onClick={onClearTxt}>clear</span>
                    </button>
                }
            </form>
        </section>
    )
}