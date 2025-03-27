import { useState } from "react";

// npm run build

export default function Home() {
    const [image, setImage] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);  // 👈 Nouvel état

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        setImage(URL.createObjectURL(file));
        setPrediction(null);  // Réinitialiser

        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);  // 👈 Démarrer le loader

        try {
            const response = await fetch("https://api-ia-detection.onrender.com/predict", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            setPrediction(data.probability_AI);
        } catch (err) {
            console.error("Erreur API", err);
        } finally {
            setLoading(false);  // 👈 Arrêter le loader
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>🔍 AI Image Detection</h1>

            <input type="file" accept="image/*" onChange={handleUpload} /> <br />
            {image && <img src={image} alt="Uploaded" style={{ width: "300px", marginTop: "10px" }} />}
            {/* Loader ici */}
            {loading && (
                <div style={{ marginTop: "20px" }}>
                    <div className="loader"></div>
                    <p>Please wait...</p>
                </div>
            )}

            {/* Résultat */}
            {!loading && prediction !== null && (
                <h2 style={{ marginTop: "20px" }}>
                    🧐 AI Probability : {(prediction * 100).toFixed(2)}%
                </h2>
            )}

            {/* Style Loader */}
            <style jsx>{`
                .loader {
                    border: 8px solid #f3f3f3;
                    border-top: 8px solid #3498db;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                    margin: auto;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}