import React, { useState } from 'react';

function Checklist({ tornaIndietro }) {
  // Stato per memorizzare quali elementi sono spuntati
  const [spunte, setSpunte] = useState({
    ven1: false, ven2: false,
    sab1: false, sab2: false,
    dom1: false, dom2: false,
  });

  // Funzione per invertire lo stato della spunta quando clicchi
  const toggleSpunta = (id) => {
    setSpunte({ ...spunte, [id]: !spunte[id] });
  };

  // Stile riutilizzabile per le singole righe della checklist
  const stileRiga = (id) => ({
    display: 'flex', 
    alignItems: 'center', 
    marginBottom: '15px', 
    fontSize: '18px', 
    cursor: 'pointer',
    textDecoration: spunte[id] ? 'line-through' : 'none',
    color: spunte[id] ? '#888' : 'white',
    transition: '0.2s'
  });

  const stileCheckbox = {
    width: '24px', 
    height: '24px', 
    marginRight: '15px',
    cursor: 'pointer'
  };

  return (
    <div>
      <button className="btn-back" onClick={tornaIndietro}>⬅️ Torna alla Home</button>
      
      {/* Immagine e Intestazione come da tuo schizzo */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img 
          src="https://cdn-icons-png.flaticon.com/512/2666/2666436.png" 
          alt="To-Do List" 
          style={{ width: '70px', filter: 'invert(1)', opacity: 0.8 }} 
        />
      </div>
      
      <h2 style={{ textAlign: 'center', marginBottom: '5px' }}>CHECK-LIST</h2>
      <p style={{ textAlign: 'center', color: '#888', marginBottom: '30px' }}>
        Breve descrizione delle attività in programma per il weekend.
      </p>

      {/* Sezione Venerdì */}
      <h3 style={{ color: '#2e6bc6', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '5px' }}>Venerdì</h3>
      <div style={{ marginBottom: '25px' }}>
        <label style={stileRiga('ven1')}>
          <input type="checkbox" checked={spunte.ven1} onChange={() => toggleSpunta('ven1')} style={stileCheckbox} />
          Raccogliere conferme presenze
        </label>
        <label style={stileRiga('ven2')}>
          <input type="checkbox" checked={spunte.ven2} onChange={() => toggleSpunta('ven2')} style={stileCheckbox} />
          Comprare bibite e stuzzichini
        </label>
      </div>

      {/* Sezione Sabato */}
      <h3 style={{ color: '#2e6bc6', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '5px' }}>Sabato</h3>
      <div style={{ marginBottom: '25px' }}>
        <label style={stileRiga('sab1')}>
          <input type="checkbox" checked={spunte.sab1} onChange={() => toggleSpunta('sab1')} style={stileCheckbox} />
          Inviare file excel aggiornato
        </label>
        <label style={stileRiga('sab2')}>
          <input type="checkbox" checked={spunte.sab2} onChange={() => toggleSpunta('sab2')} style={stileCheckbox} />
          Prenotare tavoli / ritiro asporto
        </label>
      </div>

      {/* Sezione Domenica */}
      <h3 style={{ color: '#2e6bc6', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '5px' }}>Domenica</h3>
      <div style={{ marginBottom: '25px' }}>
        <label style={stileRiga('dom1')}>
          <input type="checkbox" checked={spunte.dom1} onChange={() => toggleSpunta('dom1')} style={stileCheckbox} />
          Inviare ordini Domenica
        </label>
        <label style={stileRiga('dom2')}>
          <input type="checkbox" checked={spunte.dom2} onChange={() => toggleSpunta('dom2')} style={stileCheckbox} />
          Saldare i conti in sospeso
        </label>
      </div>

    </div>
  );
}

export default Checklist;