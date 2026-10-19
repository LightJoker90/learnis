import React, { useState, useEffect } from 'react';

function Checklist({ tornaIndietro }) {
  // 1. Inizializziamo lo stato leggendo dalla memoria del telefono
  const [spunte, setSpunte] = useState(() => {
    const datiSalvati = localStorage.getItem('checklist_weekend');
    
    // Valori di default (tutto vuoto)
    const defaultSpunte = { ven1: false, ven2: false, sab1: false, sab2: false, dom1: false, dom2: false };

    if (datiSalvati) {
      const { spunteSalvate, timestamp } = JSON.parse(datiSalvati);
      
      // LOGICA TEMPORALE (Reset Automatico)
      const dataUltimaSpunta = new Date(timestamp);
      const oggi = new Date();
      
      // Calcoliamo quanti giorni sono passati dall'ultima modifica
      const diffTempo = Math.abs(oggi - dataUltimaSpunta);
      const giorniPassati = Math.ceil(diffTempo / (1000 * 60 * 60 * 24));
      
      // Se sono passati più di 4 giorni, presupponiamo sia un nuovo weekend: resettiamo tutto.
      // (Puoi cambiare questo 4 con i giorni che preferisci)
      if (giorniPassati > 4) {
        return defaultSpunte;
      }
      
      return spunteSalvate; // Se siamo nello stesso weekend, ricarica le spunte
    }
    
    return defaultSpunte;
  });

  // 2. Ogni volta che modifichi una spunta, salviamo i dati + l'orario attuale in memoria
  useEffect(() => {
    const daSalvare = {
      spunteSalvate: spunte,
      timestamp: new Date().getTime() // Salva i millisecondi esatti attuali
    };
    localStorage.setItem('checklist_weekend', JSON.stringify(daSalvare));
  }, [spunte]);

  const toggleSpunta = (id) => {
    setSpunte({ ...spunte, [id]: !spunte[id] });
  };

  const stileRiga = (id) => ({
    display: 'flex', alignItems: 'center', marginBottom: '15px', fontSize: '18px', cursor: 'pointer',
    textDecoration: spunte[id] ? 'line-through' : 'none',
    color: spunte[id] ? '#888' : 'white', transition: '0.2s'
  });

  const stileCheckbox = { width: '24px', height: '24px', marginRight: '15px', cursor: 'pointer' };

  return (
    <div>
      <button className="btn-back" onClick={tornaIndietro}>⬅️ Torna alla Home</button>
      
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img src="https://cdn-icons-png.flaticon.com/512/2666/2666436.png" alt="To-Do List" style={{ width: '70px', filter: 'invert(1)', opacity: 0.8 }} />
      </div>
      
      <h2 style={{ textAlign: 'center', marginBottom: '5px' }}>CHECK-LIST</h2>
      <p style={{ textAlign: 'center', color: '#888', marginBottom: '30px' }}>
        Breve descrizione delle attività in programma. Si resetta in automatico il prossimo weekend!
      </p>

      {/* Venerdì */}
      <h3 style={{ color: '#2e6bc6', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '5px' }}>Venerdì</h3>
      <div style={{ marginBottom: '25px' }}>
        <label style={stileRiga('ven1')}><input type="checkbox" checked={spunte.ven1} onChange={() => toggleSpunta('ven1')} style={stileCheckbox} /> Raccogliere conferme presenze</label>
        <label style={stileRiga('ven2')}><input type="checkbox" checked={spunte.ven2} onChange={() => toggleSpunta('ven2')} style={stileCheckbox} /> Comprare bibite e stuzzichini</label>
      </div>

      {/* Sabato */}
      <h3 style={{ color: '#2e6bc6', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '5px' }}>Sabato</h3>
      <div style={{ marginBottom: '25px' }}>
        <label style={stileRiga('sab1')}><input type="checkbox" checked={spunte.sab1} onChange={() => toggleSpunta('sab1')} style={stileCheckbox} /> Inviare file excel aggiornato</label>
        <label style={stileRiga('sab2')}><input type="checkbox" checked={spunte.sab2} onChange={() => toggleSpunta('sab2')} style={stileCheckbox} /> Prenotare tavoli / ritiro asporto</label>
      </div>

      {/* Domenica */}
      <h3 style={{ color: '#2e6bc6', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '5px' }}>Domenica</h3>
      <div style={{ marginBottom: '25px' }}>
        <label style={stileRiga('dom1')}><input type="checkbox" checked={spunte.dom1} onChange={() => toggleSpunta('dom1')} style={stileCheckbox} /> Inviare ordini Domenica</label>
        <label style={stileRiga('dom2')}><input type="checkbox" checked={spunte.dom2} onChange={() => toggleSpunta('dom2')} style={stileCheckbox} /> Saldare i conti in sospeso</label>
      </div>
    </div>
  );
}

export default Checklist;