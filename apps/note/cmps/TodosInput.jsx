import { ItemInput } from "./ItemInput.jsx"
const { useState } = React

export function TodosInput({ handleInput, newNote, onSubmitForm, isEditing }) {
    const [todos, setTodos] = useState(newNote.info.todos)

    function handleItemInput({target},todoIndex){
        const {value} = target
        setTodos(prevTodos => {
            const updatedTodos = prevTodos.map((todo,index) => {
                if(index === todoIndex){
                    return { ...todo, txt: value };
                }
                return todo
            })
            handleInput({target:{name:'todos', value:updatedTodos}})
            return updatedTodos
        })
    }

    function onPlusItemClick() {
        console.log('all todos', todos)
        setTodos(prevTodos => {
            return [
                ...prevTodos,
                {id: prevTodos.length, txt: '', done: false}
            ]
        })
    }

    

    return (
        <div className="inputs-grid">
            <form action="submit" onSubmit={onSubmitForm}>
                <div className="inputs-grid">
                    <div className="input-container" style={{ backgroundColor: newNote.style.backgroundColor }}>
                    <input type="text" placeholder="Title" name="title" style={{ backgroundColor: newNote.style.backgroundColor }} value={newNote.info.title} className="main-input title-input" onInput={handleInput}></input> 
                    {todos.map((todo,index) => {
                        return (
                            <ItemInput
                                backgroundColor = {newNote.style.backgroundColor}
                                key={`todo-${todo.id}`}
                                handleInput={(ev)=> handleItemInput(ev,index)}
                                value={todo.txt}
                                name={`todo-${index}`}>
                            </ItemInput>
                        )
                    })}                       
                    </div>
                    <button type="button" className="fa fa-plus" onClick={onPlusItemClick}></button>


                    {isEditing ? (
                        <button className="submit-btn">Save</button>
                    ) : (
                        <button className="submit-btn">Add</button>
                    )}
                </div>
            </form>
        </div>
    )
}
