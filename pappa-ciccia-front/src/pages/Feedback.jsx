import React, { useState } from 'react';

function Feedback({ tornaIndietro }) {
  const [nota, setNota] = useState('');
  const [valutazione, setValutazione] = useState(4); // Valore di default: 4 stelle
  const [salvato, setSalvato] = useState(false);

  // Genera le stelle interattive
  const renderStelle = () => {
    return [1, 2, 3, 4, 5].map((stella) => (
      <span 
        key={stella} 
        onClick={() => setValutazione(stella)}
        style={{ 
          cursor: 'pointer', 
          fontSize: '30px', 
          color: stella <= valutazione ? '#ffc107' : '#555',
          marginRight: '5px'
        }}
      >
        ★
      </span>
    ));
  };

  const salvaAppunti = () => {
    // In futuro qui potremmo inviare i dati al backend Python
    setSalvato(true);
    setTimeout(() => setSalvato(false), 3000); // Nasconde il messaggio dopo 3 secondi
  };

  return (
    <div>
      <button className="btn-back" onClick={tornaIndietro}>⬅️ Torna alla Home</button>
      <h2>💡 Feedback & Note</h2>
      <p style={{ color: '#888', marginBottom: '20px' }}>Appunta promemoria o valuta il weekend.</p>
      
      {/* Box Diario */}
      <div style={{ marginBottom: '25px' }}>
        <label style={{ fontWeight: 'bold', color: '#ccc', display: 'block', marginBottom: '10px' }}>
          Diario di bordo / Cose da ricordare
        </label>
        <textarea 
          placeholder="Es. Ricordare a Raffaele di mandare i soldi..." 
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          style={{ 
            width: '100%', height: '120px', padding: '15px', 
            borderRadius: '15px', backgroundColor: '#1e2329', 
            color: 'white', border: '1px solid #333' 
          }}
        />
      </div>

      {/* Box Valutazione */}
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#1e2329', borderRadius: '15px' }}>
        <label style={{ fontWeight: 'bold', color: '#ccc', display: 'block', marginBottom: '10px' }}>
          Valutazione Ristorante/Organizzazione
        </label>
        <div>
          {renderStelle()}
        </div>
      </div>

      <button className="btn-menu btn-primary" onClick={salvaAppunti}>
        Salva Appunti
      </button>

      {/* Messaggio di successo a comparsa */}
      {salvato && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#4caf50', color: 'white', borderRadius: '10px', textAlign: 'center' }}>
          ✅ Appunti salvati con successo!
        </div>
      )}
    </div>
  );
}

export default Feedback;