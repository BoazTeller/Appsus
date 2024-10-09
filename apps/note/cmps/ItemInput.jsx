export function ItemInput({handleInput, value, name}) {

    return (
        <input type="text"
            placeholder="Add an item to the list . . ."
            value={value}
            className="main-input title-input"
            name={name}
            onInput={handleInput}>
        </input>
    )
}