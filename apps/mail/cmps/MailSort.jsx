const { useState, useEffect } = React

export function MailSort({ onSetSortBy, sortBy, onSetFilterBy, filterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleReadFilterChange({ target }) {
        const { value, name: field } = target
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function getSortDirClass(key) {
        if (sortBy[key]) {
            let dirClass = 'solid '
            dirClass += sortBy[key] > 0 ? 'caret-up' : 'caret-down'
            return dirClass
        }
        return ''
    }
  
    const sortBtns = [
      { key: 'from', label: 'From' }, 
      { key: 'subject', label: 'Subject' },
      { key: 'to', label: 'To' }, 
      { key: 'date', label: 'Date' }
    ]
  
    return (
        <section className="mail-sort flex align-center">
            {/* Sort Buttons */}
            {sortBtns.map(btn => (
                <button
                    key={btn.key}
                    className={`btn-${btn.key} ${getSortDirClass(btn.key)}`}
                    onClick={() => onSetSortBy(btn.key)}
                >
                    {btn.label}
                </button>
            ))}

            {/* Filter - Read/Unread/All */}
            <select name="isRead" onChange={handleReadFilterChange}>
                <option value="">All</option>
                <option value="read">Read</option>
                <option value="unread">Unread</option>
            </select>
        </section>
    )
}
  