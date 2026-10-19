import React, { useState, useEffect } from 'react';
import './App.css';
import Ordini from './pages/Ordini';
import Sabato from './pages/Sabato';
import Checklist from './pages/Checklist';
import Feedback from './pages/Feedback';

// --- IMPOSTA QUI LA DATA DEL PROSSIMO CORSO ---
// Formato: "AAAA-MM-GGTHH:MM:00" (Anno-Mese-Giorno T Ora:Minuti:Secondi)
const DATA_PROSSIMO_CORSO = new Date("2026-11-13T15:00:00");

function App() {
  const [paginaCorrente, setPaginaCorrente] = useState('home');
  const [tempoRimanente, setTempoRimanente] = useState(calcolaTempoRimanente());

  // Funzione che calcola giorni, ore, minuti e secondi mancanti
  function calcolaTempoRimanente() {
    const differenza = DATA_PROSSIMO_CORSO - new Date();
    if (differenza <= 0) return null; // Il countdown è finito

    return {
      giorni: Math.floor(differenza / (1000 * 60 * 60 * 24)),
      ore: Math.floor((differenza / (1000 * 60 * 60)) % 24),
      minuti: Math.floor((differenza / 1000 / 60) % 60),
      secondi: Math.floor((differenza / 1000) % 60)
    };
  }

  // Questo Hook aggiorna il timer ogni secondo (1000 millisecondi)
  useEffect(() => {
    const timer = setInterval(() => {
      setTempoRimanente(calcolaTempoRimanente());
    }, 1000);
    return () => clearInterval(timer); // Pulisce il timer se cambi pagina
  }, []);

  const cambiaPagina = (pagina) => {
    setPaginaCorrente(pagina);
  };

  return (
    <div className="app-container">
      {paginaCorrente === 'home' && (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <img src="/logo.jpeg" alt="Logo" style={{ width: '100px', borderRadius: '20px', marginBottom: '20px' }} />
          <h2 style={{ marginBottom: '25px' }}>Gestionale Pappa e Ciccia</h2>
          
          {/* --- WIDGET COUNTDOWN --- */}
          {tempoRimanente ? (
            <div style={{ backgroundColor: '#1e2329', padding: '15px', borderRadius: '15px', marginBottom: '30px', border: '1px solid #333' }}>
              <p style={{ color: '#ccc', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                ⏳ Al prossimo weekend mancano:
              </p>
              <h3 style={{ color: '#2e6bc6', letterSpacing: '2px' }}>
                {tempoRimanente.giorni}g {tempoRimanente.ore}h {tempoRimanente.minuti}m {tempoRimanente.secondi}s
              </h3>
            </div>
          ) : (
            <div style={{ backgroundColor: '#4caf50', padding: '15px', borderRadius: '15px', marginBottom: '30px', color: 'white', fontWeight: 'bold' }}>
              🎉 Il weekend del corso è iniziato!
            </div>
          )}
          {/* ------------------------ */}

          <button className="btn-menu" onClick={() => cambiaPagina('checklist')}>📝 CHECK-LIST</button>
          <button className="btn-menu" onClick={() => cambiaPagina('ordini')}>📊 TRASCRIZIONE ORDINI</button>
          <button className="btn-menu" onClick={() => cambiaPagina('sabato')}>🍕 SABATO SERA</button>
          <button className="btn-menu" onClick={() => cambiaPagina('feedback')}>💡 FEEDBACK</button>
        </div>
      )}

      {paginaCorrente === 'ordini' && <Ordini tornaIndietro={() => cambiaPagina('home')} />}
      {paginaCorrente === 'sabato' && <Sabato tornaIndietro={() => cambiaPagina('home')} />}
      {paginaCorrente === 'checklist' && <Checklist tornaIndietro={() => cambiaPagina('home')} />}
      {paginaCorrente === 'feedback' && <Feedback tornaIndietro={() => cambiaPagina('home')} />}
    </div>
  );
}

export default App;