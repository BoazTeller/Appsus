const { useState, useEffect } = React

export function NoteFilter({filterByTxt}) {
    const [input, setInput] = useState('')

    useEffect(() => {
        filterByTxt(input)
    }, [input])


    function handleInput({target}){
        const {value} = target
        setInput(value)
    }

    return (
        <div className="input-filter-container">
            <div className="fa fa-search"></div>
            <input
                className="filter-input"
                type="text"
                placeholder="Search"
                value={input}
                onInput={handleInput}
            />
        </div>
    )
}