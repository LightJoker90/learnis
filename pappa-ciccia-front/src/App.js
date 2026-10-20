import React, { useState, useEffect } from 'react';
import './App.css';
import Ordini from './pages/Ordini';
import Sabato from './pages/Sabato';
import Checklist from './pages/Checklist';
import Feedback from './pages/Feedback';

// --- IMPOSTA QUI LA DATA DEL PROSSIMO CORSO ---
const DATA_PROSSIMO_CORSO = new Date("2026-11-13T15:00:00");

function App() {
  const [paginaCorrente, setPaginaCorrente] = useState('home');
  const [tempoRimanente, setTempoRimanente] = useState(calcolaTempoRimanente());

  function calcolaTempoRimanente() {
    const differenza = DATA_PROSSIMO_CORSO - new Date();
    if (differenza <= 0) return null; 

    return {
      giorni: Math.floor(differenza / (1000 * 60 * 60 * 24)),
      ore: Math.floor((differenza / (1000 * 60 * 60)) % 24),
      minuti: Math.floor((differenza / 1000 / 60) % 60),
      secondi: Math.floor((differenza / 1000) % 60)
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTempoRimanente(calcolaTempoRimanente());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const cambiaPagina = (pagina) => {
    setPaginaCorrente(pagina);
  };

  return (
    <div className="app-container">
      {paginaCorrente === 'home' && (
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          
          {/* 1. WIDGET COUNTDOWN (Ora in alto, stile pillola iOS) */}
          {tempoRimanente ? (
            <div style={{ 
              backgroundColor: '#1c1c1e', // Grigio scuro stile Apple
              padding: '12px 25px', 
              borderRadius: '40px', // Forma a pillola
              marginBottom: '35px', 
              border: '1px solid #333',
              boxShadow: '0 8px 20px rgba(0,0,0,0.4)', // Ombra morbida
              display: 'inline-block' // Lo fa adattare al testo
            }}>
              <p style={{ color: '#8e8e93', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px', letterSpacing: '1px' }}>
                ⏳ Al prossimo weekend mancano:
              </p>
              <h3 style={{ color: '#0a84ff', letterSpacing: '1.5px', margin: 0, fontSize: '18px' }}>
                {tempoRimanente.giorni}g {tempoRimanente.ore}h {tempoRimanente.minuti}m {tempoRimanente.secondi}s
              </h3>
            </div>
          ) : (
            <div style={{ backgroundColor: '#34c759', padding: '12px 25px', borderRadius: '40px', marginBottom: '35px', color: 'white', fontWeight: 'bold', display: 'inline-block', boxShadow: '0 8px 20px rgba(52, 199, 89, 0.3)' }}>
              🎉 Il weekend del corso è iniziato!
            </div>
          )}

          {/* 2. LOGO E TITOLO (Rivisitati) */}
          <div style={{ marginBottom: '40px' }}>
            <img src="/logo.jpeg" alt="Logo" style={{ 
              width: '190px', 
              borderRadius: '25px', 
              marginBottom: '15px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)' // Dà profondità al logo
            }} />
            <h1 style={{ marginBottom: '2px', fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px' }}>
              La casa del team Pappa e Ciccia 
            </h1>
            <h2 style={{ fontSize: '18px', fontWeight: '500', color: '#8e8e93' }}>
              In questa app trovi tutto ciò che ti serve per il weekend del corso, dalla check-list alla trascrizione degli ordini, fino al feedback finale!
            </h2>
          </div>

          {/* 3. BOTTONI MENU */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className="btn-menu" onClick={() => cambiaPagina('checklist')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>📝</span> CHECK-LIST
            </button>
            <button className="btn-menu" onClick={() => cambiaPagina('ordini')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>📊</span> TRASCRIZIONE ORDINI
            </button>
            <button className="btn-menu" onClick={() => cambiaPagina('sabato')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>🍕</span> SABATO SERA
            </button>
            <button className="btn-menu" onClick={() => cambiaPagina('feedback')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>💡</span> FEEDBACK
            </button>
          </div>
          
        </div>
      )}

      {/* --- PAGINE --- */}
      {paginaCorrente === 'ordini' && <Ordini tornaIndietro={() => cambiaPagina('home')} />}
      {paginaCorrente === 'sabato' && <Sabato tornaIndietro={() => cambiaPagina('home')} />}
      {paginaCorrente === 'checklist' && <Checklist tornaIndietro={() => cambiaPagina('home')} />}
      {paginaCorrente === 'feedback' && <Feedback tornaIndietro={() => cambiaPagina('home')} />}
    </div>
  );
}

export default App;