export function ItemInput({ handleInput, value, name, backgroundColor }) {
    console.log(backgroundColor)
    return (
        <input type="text"
            style={{ backgroundColor: backgroundColor }}
            placeholder="Add an item to the list . . ."
            value={value}
            className="main-input title-input"
            name={name}
            onInput={handleInput}>
        </input>
    )
}