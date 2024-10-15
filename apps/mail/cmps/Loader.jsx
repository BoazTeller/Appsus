export function Loader({ loaderNum = 3}) {
    
    return (
        <span className={`loader${loaderNum}`}></span>
    )
}