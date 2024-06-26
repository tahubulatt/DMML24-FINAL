import { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css';

export default function Home() {
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [education, setEducation] = useState('');
    const [lunch, setLunch] = useState('');
    const [readingScore, setReadingScore] = useState('');
    const [writingScore, setWritingScore] = useState('');
    const [prediction, setPrediction] = useState(null);

    const categorizePrediction = (score) => {
        if (score >= 0 && score <= 30) {
            return 'Perlu Banyak Latihan !';
        } else if (score >= 31 && score <= 60) {
            return 'Cukup Baik !';
        } else if (score >= 61 && score <= 80) {
            return 'Hebat !';
        } else if (score >= 81) {
            return 'Luar Biasa !';
        } else {
            return 'Invalid Score';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Konversi inputan menjadi fitur boolean dan numerik untuk model
        const data = {
            gender: gender === 'male' ? 1 : 0, // Gender (binary)
            "reading score": parseInt(readingScore), // Reading Score (integer)
            "writing score": parseInt(writingScore), // Writing Score (integer)
            "associate's degree": education === 'd3' ? 1 : 0, // Associate's degree (binary)
            "bachelor's degree": education === 's1' ? 1 : 0, // Bachelor's degree (binary)
            "high school": education === 'sma' ? 1 : 0, // High School (binary)
            "master's degree": education === 's2' ? 1 : 0, // Master's degree (binary)
            "standard": lunch === 'ya' ? 1 : 0, // Standard lunch (binary)
            "free/reduced": lunch === 'tidak' ? 1 : 0 // Lunch free/reduced (binary)
        };

        console.log('Sending data:', data);

        try {
            const response = await axios.post('http://127.0.0.1:5000/api/predict', data);
            const score = response.data.prediction;
            const category = categorizePrediction(score);
            console.log('Received response:', response.data);
            setPrediction({ name, value: score, category });
        } catch (error) {
            console.error('Error making prediction:', error);
        }
    };

    return (
        <div className={styles.container}>
            <img src="/header.jpg" alt="Image Description" className={styles.headerImage} />
            <h1 className={styles.title}>Predict Student Performance</h1>
            <div className={styles.card}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label>Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Gender</label>
                        <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Parental Education</label>
                        <select value={education} onChange={(e) => setEducation(e.target.value)} required>
                            <option value="">Select Education</option>
                            <option value="sma">SMA</option>
                            <option value="d3">D3</option>
                            <option value="s1">S1</option>
                            <option value="s2">S2</option>
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Lunch</label>
                        <select value={lunch} onChange={(e) => setLunch(e.target.value)} required>
                            <option value="">Select Lunch</option>
                            <option value="ya">Ya</option>
                            <option value="tidak">Tidak</option>
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Reading Score</label>
                        <input type="number" value={readingScore} onChange={(e) => setReadingScore(e.target.value)} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Writing Score</label>
                        <input type="number" value={writingScore} onChange={(e) => setWritingScore(e.target.value)} required />
                    </div>
                    <button type="submit" className={styles.button}>Predict</button>
                </form>
                {prediction !== null && (
                    <div className={styles.result}>
                        <h3>Prediction Result for {name}</h3>
                        <p>Kamu {prediction.category}!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
