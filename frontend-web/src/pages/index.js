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
      } else if (score >= 81 && score <= 100) {
          return 'Luar Biasa !';
      } else {
          return 'Invalid Score';
      }
  };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Konversi inputan menjadi fitur boolean untuk model
        const features = [
            gender === 'male' ? 1 : 0, // Gender (binary)
            education === 'sd' ? 1 : 0, // SD (binary)
            education === 'smp' ? 1 : 0, // SMP (binary)
            education === 'sma' ? 1 : 0, // SMA (binary)
            education === 's1' ? 1 : 0, // S1 (binary)
            education === 's2' ? 1 : 0, // S2 (binary)
            // education === 's3' ? 1 : 0, // S3 (binary)
            lunch === 'ya' ? 1 : 0, // Lunch (binary)
            parseInt(readingScore), // Reading Score (integer)
            parseInt(writingScore) // Writing Score (integer)
        ];

        console.log('Sending features:', features);

        try {
            const response = await axios.post('http://127.0.0.1:5000/api/predict', { features });
            const score = response.data.prediction;
            const category = categorizePrediction(score);
            console.log('Received response:', response.data);
            // setPrediction(response.data.prediction);
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
                            <option value="sd">SD</option>
                            <option value="smp">SMP</option>
                            <option value="sma">SMA</option>
                            <option value="s1">S1</option>
                            <option value="s2">S2</option>
                            {/* <option value="s3">S3</option> */}
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