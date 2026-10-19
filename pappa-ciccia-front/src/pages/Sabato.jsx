import React, { useState } from 'react';

function Sabato({ tornaIndietro }) {
  const [comanda, setComanda] = useState('');
  const [totale, setTotale] = useState('');
  const [persone, setPersone] = useState(1);
  const [risultato, setRisultato] = useState(null);

  const dividiConto = async () => {
    if (!totale || persone < 1) return alert("Inserisci un totale valido e almeno 1 persona.");
    
    try {
      const response = await fetch("http://192.168.1.8/api/sabato/dividi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totale_conto: parseFloat(totale), numero_persone: parseInt(persone) })
      });
      const data = await response.json();
      setRisultato(data);
    } catch (error) {
      alert("Errore di connessione. Il server Python è acceso?");
    }
  };

  return (
    <div>
      <button className="btn-back" onClick={tornaIndietro}>⬅️ Torna alla Home</button>
      <h2>🍕 Sabato Sera</h2>
      
      <div style={{ marginTop: '20px' }}>
        <label style={{ fontWeight: 'bold', color: '#ccc' }}>Descrizione</label>
        <textarea 
          placeholder="Box per inserire comanda (es. 3 Pizze, 2 Birre...)" 
          value={comanda}
          onChange={(e) => setComanda(e.target.value)}
          style={{ width: '100%', height: '100px', marginTop: '10px', marginBottom: '20px', padding: '15px', borderRadius: '15px', backgroundColor: '#1e2329', color: 'white', border: '1px solid #333' }}
        />

        <input 
          type="number" 
          placeholder="Prezzo Totale (€)" 
          value={totale}
          onChange={(e) => setTotale(e.target.value)} 
          style={{ width: '100%', padding: '15px', marginBottom: '10px', borderRadius: '15px', backgroundColor: '#1e2329', color: 'white', border: '1px solid #333' }}
        />
        <input 
          type="number" 
          placeholder="Numero Persone" 
          value={persone}
          onChange={(e) => setPersone(e.target.value)} 
          style={{ width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '15px', backgroundColor: '#1e2329', color: 'white', border: '1px solid #333' }}
        />
        
        <button className="btn-menu btn-primary" onClick={dividiConto}>Calcola Divisione</button>
      </div>

      {risultato && (
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#1e2329', borderRadius: '15px', border: '2px solid #2e6bc6' }}>
          <h3 style={{ marginBottom: '15px' }}>Output:</h3>
          <p style={{ fontSize: '18px' }}>💰 Prezzo Totale: <strong>{risultato.totale.toFixed(2)} €</strong></p>
          <p style={{ fontSize: '20px', marginTop: '10px', color: '#4caf50' }}>👤 Ognuno paga: <strong>{risultato.quota.toFixed(2)} €</strong></p>
        </div>
      )}
    </div>
  );
}

export default Sabato;