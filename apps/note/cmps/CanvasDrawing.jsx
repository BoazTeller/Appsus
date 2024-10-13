const { useState, useRef, useEffect } = React;

export function CanvasDrawing({ onCloseCanvas }) {
    const canvasRef = useRef(null); // Reference to the canvas element
    const [isDrawing, setIsDrawing] = useState(false); // Track drawing state
    const [imageUrl, setImageUrl] = useState(""); // To store the saved image URL

    // Set the canvas size to match the window size
    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }, []);

    // Start drawing when the mouse is pressed
    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.beginPath();
        context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
    };

    // Draw while the mouse is moving
    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        context.stroke();
    };

    // Stop drawing when the mouse is released
    const stopDrawing = () => {
        setIsDrawing(false);
    };

    // Clear the canvas
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    // Save the canvas as an image
    const saveCanvas = () => {
        const canvas = canvasRef.current;
        const image = canvas.toDataURL("image/png"); // Get canvas content as a PNG image
        setImageUrl(image); // Store image URL in state
    };

    return (
        <div style={{ textAlign: "center", position: "relative", height: "100vh", width: "100vw" }}>
            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    border: "1px solid #000",
                    cursor: "crosshair"
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing} // Stop drawing if the mouse leaves the canvas
            ></canvas>
            <div style={{ position: "absolute", top: "10px", left: "10px", zIndex: 1 }}>
                <button onClick={clearCanvas}>Clear</button>
                <button onClick={saveCanvas}>Save as Note</button>
                <button onClick={onCloseCanvas}>Close</button>
            </div>
            {/* Display the saved image */}
            {imageUrl && (
                <div style={{ position: "absolute", bottom: "10px", left: "10px", zIndex: 1 }}>
                    <h3>Saved Image:</h3>
                    <img src={imageUrl} alt="Canvas Drawing" style={{ maxWidth: "100%" }} />
                </div>
            )}
        </div>
    );
}
