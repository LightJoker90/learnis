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
    formData.append("file", file);

    try {
      // Assicurati che questo link sia quello corretto generato da Render
      const response = await fetch("https://learnis-caserta-pappa-e-ciccia-backend.onrender.com/api/ordini/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Errore durante l'elaborazione del file.");

      const data = await response.json();
      setRisultato(data);
    } catch (err) {
      setErrore(err.message);
    } finally {
      setCaricamento(false);
    }
  };

  const renderElencoPiatti = (dizionario, titolo) => {
    const voci = Object.entries(dizionario);
    if (voci.length === 0) return null;

    return (
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ color: '#ccc', marginBottom: '5px' }}>{titolo}:</h4>
        <ul style={{ listStyleType: 'none', paddingLeft: '10px' }}>
          {voci.map(([nome, quantita]) => (
            <li key={nome} style={{ marginBottom: '5px', fontSize: '16px' }}>
              <span style={{ fontWeight: 'bold', color: '#2e6bc6', marginRight: '8px' }}>{quantita}x</span> 
              {nome}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      <button className="btn-back" onClick={tornaIndietro}>⬅️ Torna alla Home</button>
      <h2>📊 Trascrizione Ordini</h2>
      <p style={{ color: '#888', marginBottom: '20px' }}>Carica il file Excel o CSV e genera i riepiloghi.</p>

      <input 
        type="file" 
        accept=".xlsx, .csv" 
        onChange={(e) => setFile(e.target.files[0])} 
        style={{ marginBottom: '20px', width: '100%', padding: '10px', backgroundColor: '#1e2329', borderRadius: '10px' }}
      />

      <button className="btn-menu btn-primary" onClick={gestisciUpload} disabled={caricamento}>
        {caricamento ? "Elaborazione in corso..." : "Calcola Totali"}
      </button>

      {errore && <p style={{ color: '#ff4d4d', marginTop: '10px', fontWeight: 'bold' }}>{errore}</p>}

      {/* --- SEZIONE RISULTATI --- */}
      {risultato && (
        <div style={{ marginTop: '30px' }}>
          
          {/* CARD SABATO */}
          <div style={{ backgroundColor: '#1e2329', padding: '20px', borderRadius: '15px', marginBottom: '20px', border: '1px solid #333' }}>
            <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px' }}>🍕 Riepilogo Sabato</h3>
            <div style={{ marginBottom: '15px', fontSize: '18px' }}>
              <p>💰 <strong>Totale Sabato:</strong> <span style={{ color: '#4caf50' }}>{risultato.sabato.totale_euro.toFixed(2)} €</span></p>
              <p>🍱 Menù Completi: {risultato.sabato.menu_completo}</p>
              <p>🍝 Solo Primi: {risultato.sabato.menu_primo}</p>
              <p>🥩 Solo Secondi: {risultato.sabato.menu_secondo}</p>
            </div>
            {renderElencoPiatti(risultato.sabato.primi, "Primi Piatti")}
            {renderElencoPiatti(risultato.sabato.secondi, "Secondi Piatti")}
            {renderElencoPiatti(risultato.sabato.bevande, "Bevande")}
          </div>

          {/* CARD DOMENICA */}
          <div style={{ backgroundColor: '#1e2329', padding: '20px', borderRadius: '15px', marginBottom: '20px', border: '1px solid #333' }}>
            <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px' }}>🍝 Riepilogo Domenica</h3>
            <div style={{ marginBottom: '15px', fontSize: '18px' }}>
              <p>💰 <strong>Totale Domenica:</strong> <span style={{ color: '#4caf50' }}>{risultato.domenica.totale_euro.toFixed(2)} €</span></p>
            </div>
            {renderElencoPiatti(risultato.domenica.primi, "Primi Piatti")}
            {renderElencoPiatti(risultato.domenica.secondi, "Secondi Piatti")}
            {renderElencoPiatti(risultato.domenica.contorni, "Contorni")}
            {renderElencoPiatti(risultato.domenica.bevande, "Bevande")}
          </div>

          {/* CARD DETTAGLIO QUOTE SABATO */}
          {risultato.dettaglio_clienti.sabato.length > 0 && (
            <div style={{ backgroundColor: '#1e2329', padding: '20px', borderRadius: '15px', marginBottom: '20px', border: '1px solid #333' }}>
              <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px' }}>👤 Dettaglio Quote (Sabato)</h3>
              {risultato.dettaglio_clienti.sabato.map((cliente, index) => (
                <div key={`sab-${index}`} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px dashed #444' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '16px' }}>{cliente.nome}</p>
                  <p style={{ color: '#aaa', fontSize: '14px' }}>{cliente.ordini.join(" + ")}</p>
                  <p style={{ color: '#4caf50', fontWeight: 'bold' }}>Quota: {cliente.prezzo.toFixed(2)} €</p>
                </div>
              ))}
            </div>
          )}

          {/* CARD DETTAGLIO QUOTE DOMENICA */}
          {risultato.dettaglio_clienti.domenica.length > 0 && (
            <div style={{ backgroundColor: '#1e2329', padding: '20px', borderRadius: '15px', marginBottom: '20px', border: '1px solid #333' }}>
              <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px' }}>👤 Dettaglio Quote (Domenica)</h3>
              {risultato.dettaglio_clienti.domenica.map((cliente, index) => (
                <div key={`dom-${index}`} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px dashed #444' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '16px' }}>{cliente.nome}</p>
                  <p style={{ color: '#aaa', fontSize: '14px' }}>{cliente.ordini.join(" + ")}</p>
                  <p style={{ color: '#4caf50', fontWeight: 'bold' }}>Quota: {cliente.prezzo.toFixed(2)} €</p>
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default Ordini;