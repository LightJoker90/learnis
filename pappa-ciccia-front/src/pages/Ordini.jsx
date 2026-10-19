import React, { useState } from 'react';

function Ordini({ tornaIndietro }) {
  const [file, setFile] = useState(null);
  const [risultato, setRisultato] = useState(null);
  const [caricamento, setCaricamento] = useState(false);
  const [errore, setErrore] = useState(null);

  const gestisciUpload = async () => {
    if (!file) return alert("Seleziona prima un file!");
    
    setCaricamento(true);
    setErrore(null);

    const formData = new FormData();
    formData.append("file", file); // Deve chiamarsi "file" come nel backend Python

    try {
      const response = await fetch("https://learnis-caserta-pappa-e-ciccia-backend.onrender.com/api/ordini/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Errore durante l'elaborazione del file.");
      }

      const data = await response.json();
      setRisultato(data); // Salviamo il JSON gigante che ci manda Python
    } catch (err) {
      setErrore(err.message);
    } finally {
      setCaricamento(false);
    }
  };

  return (
    <div>
      <button className="btn-back" onClick={tornaIndietro}>⬅️ Torna alla Home</button>
      <h2>Trascrizione Ordini</h2>
      <p style={{ color: '#888', marginBottom: '20px' }}>Carica il file Excel o CSV.</p>

      <input 
        type="file" 
        accept=".xlsx, .csv" 
        onChange={(e) => setFile(e.target.files[0])} 
        style={{ marginBottom: '20px', width: '100%' }}
      />

      <button className="btn-menu btn-primary" onClick={gestisciUpload}>
        {caricamento ? "Elaborazione in corso..." : "Calcola Totali"}
      </button>

      {errore && <p style={{ color: 'red', marginTop: '10px' }}>{errore}</p>}

      {/* Se abbiamo il risultato da Python, lo mostriamo a schermo */}
      {risultato && (
        <div style={{ marginTop: '30px' }}>
          <h3>📅 Riepilogo Sabato</h3>
          <p>Totale Sabato: {risultato.sabato.totale_euro} €</p>
          <p>Primi: {Object.keys(risultato.sabato.primi).length}</p>
          
          <h3 style={{ marginTop: '20px' }}>📅 Riepilogo Domenica</h3>
          <p>Totale Domenica: {risultato.domenica.totale_euro} €</p>
          <p>Primi: {Object.keys(risultato.domenica.primi).length}</p>

          <p style={{ marginTop: '20px', color: '#888', fontSize: '14px' }}>
            (Questa è solo un'anteprima base dei dati. Espanderemo l'elenco dei piatti nel prossimo step!)
          </p>
        </div>
      )}
    </div>
  );
}

export default Ordini;