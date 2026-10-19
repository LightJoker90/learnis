import React, { useState } from 'react';
import './App.css';
import Ordini from './pages/Ordini';
import Sabato from './pages/Sabato';
import Checklist from './pages/Checklist';
import Feedback from './pages/Feedback';

function App() {
  const [paginaCorrente, setPaginaCorrente] = useState('home');

  const cambiaPagina = (pagina) => {
    setPaginaCorrente(pagina);
  };

  return (
    <div className="app-container">
      {paginaCorrente === 'home' && (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          {/* Assicurati di mettere il tuo logo nella cartella public e chiamarlo logo.jpeg */}
          <img src="/logo.jpeg" alt="Logo" style={{ width: '100px', borderRadius: '20px', marginBottom: '20px' }} />
          <h2 style={{ marginBottom: '40px' }}>Gestionale Pappa e Ciccia</h2>
          
          <button className="btn-menu" onClick={() => cambiaPagina('checklist')}>📝 CHECK-LIST</button>
          <button className="btn-menu" onClick={() => cambiaPagina('ordini')}>📊 TRASCRIZIONE ORDINI</button>
          <button className="btn-menu" onClick={() => cambiaPagina('sabato')}>🍕 SABATO SERA</button>
          <button className="btn-menu" onClick={() => cambiaPagina('feedback')}>💡 FEEDBACK</button>
        </div>
      )}

      {/* Qui carichiamo le altre schermate e passiamo la funzione per tornare indietro */}
      {paginaCorrente === 'ordini' && <Ordini tornaIndietro={() => cambiaPagina('home')} />}
      
      {/* (Le altre pagine le aggiungeremo man mano) */}
      {paginaCorrente === 'checklist' && <Checklist tornaIndietro={() => cambiaPagina('home')} />}
      {paginaCorrente === 'sabato' && <Sabato tornaIndietro={() => cambiaPagina('home')} />}
      {paginaCorrente === 'feedback' && <Feedback tornaIndietro={() => cambiaPagina('home')} />}
    </div>
  );
}

export default App;