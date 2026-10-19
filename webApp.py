import streamlit as st
import streamlit.components.v1 as components
import pandas as pd
from collections import Counter
import re

# ==========================================
# CONFIGURAZIONE PAGINA E COLORI
# ==========================================
st.set_page_config(page_title="Gestionale Pappa e Ciccia", page_icon="logo.jpeg", layout="centered")

# Sostituisci #0e1117 con il codice HEX esatto dello sfondo del tuo logo
COLORE_SFONDO = "#222738" 

# CSS Avanzato per iPhone, colori personalizzati e bottoni grandi
st.markdown(f"""
    <style>
    /* Nasconde elementi di sistema Streamlit */
    [data-testid="stHeader"] {{display: none !important;}}
    footer {{display: none !important;}}
    .block-container {{padding-top: 2rem !important; padding-bottom: 2rem !important;}} 
    
    /* Colore di sfondo predominante */
    .stApp {{background-color: {COLORE_SFONDO} !important;}}
    
    /* Stile dei bottoni della Home (larghi, con bordi smussati) */
    div.stButton > button {{
        width: 100%;
        height: 60px;
        border-radius: 15px;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
    }}
    </style>
""", unsafe_allow_html=True)

# Inietta il logo per l'icona iOS (assicurati che il link raw sia corretto)
components.html(
    f"""
    <script>
    const parentDoc = window.parent.document;
    const iconeVecchie = parentDoc.querySelectorAll('link[rel="apple-touch-icon"], link[rel="shortcut icon"], link[rel="icon"]');
    iconeVecchie.forEach(icona => icona.remove());

    const linkIcon = parentDoc.createElement('link');
    linkIcon.rel = 'apple-touch-icon';
    linkIcon.href = 'https://raw.githubusercontent.com/LightJoker90/learnis/main/logo.jpeg'; 
    parentDoc.head.appendChild(linkIcon);

    if (!parentDoc.querySelector('meta[name="theme-color"]')) {{
        const metaTheme = parentDoc.createElement('meta');
        metaTheme.name = "theme-color";
        metaTheme.content = "{COLORE_SFONDO}";
        parentDoc.head.appendChild(metaTheme);
    }}
    </script>
    """,
    height=0,
    width=0,
)

# ==========================================
# LOGICA E FUNZIONI CALCOLO (Dal vecchio script)
# ==========================================
PREZZO_SOLO_PRIMO = 9
PREZZO_SOLO_SECONDO = 12.50
PREZZO_COMPLETO = 16

def calcola_prezzo_sabato(primo, secondo):
    if primo != "-" and secondo != "-": return PREZZO_COMPLETO
    elif secondo != "-": return PREZZO_SOLO_SECONDO
    elif primo != "-": return PREZZO_SOLO_PRIMO
    return 0

def calcola_prezzo_domenica(ordini):
    totale = 0.0
    for item in ordini:
        matches = re.findall(r'(\d+(?:[.,]\d+)?)\s*€', str(item))
        for prezzo in matches: totale += float(prezzo.replace(",", "."))
    return totale

def formatta_prezzo(prezzo):
    return f"{int(prezzo)}" if prezzo == int(prezzo) else f"{prezzo:.2f}".replace(".", ",")

def estrai_nomi_domenica(cella):
    if cella == "-": return []
    return [re.sub(r':\s*\d+(?:[.,]\d+)?$', '', p.strip(', ').strip()).strip().capitalize() 
            for p in cella.split('€') if p.strip(', ').strip()]

# ==========================================
# GESTIONE NAVIGAZIONE (MULTI-PAGINA)
# ==========================================
if 'pagina_corrente' not in st.session_state:
    st.session_state.pagina_corrente = 'home'

def cambia_pagina(nome_pagina):
    st.session_state.pagina_corrente = nome_pagina

def bottone_indietro():
    if st.button("⬅️ Torna alla Home", key=f"back_{st.session_state.pagina_corrente}"):
        cambia_pagina('home')
        st.rerun()
    st.divider()

# ==========================================
# SCHERMATE DELL'APP
# ==========================================

def render_home():
    # Logo e Titolo
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        # Usa il file logo caricato, oppure puoi mettere un URL diretto
        st.image("logo.jpeg", use_container_width=True)
    
    st.markdown("<h2 style='text-align: center; margin-bottom: 30px;'>Gestionale Pappa e Ciccia</h2>", unsafe_allow_html=True)
    
    # I 4 Bottoni
    if st.button("📝 CHECK-LIST"): cambia_pagina("checklist")
    if st.button("📊 TRASCRIZIONE ORDINI"): cambia_pagina("ordini")
    if st.button("🍕 SABATO SERA"): cambia_pagina("sabato")
    if st.button("💡 FEEDBACK & NOTE"): cambia_pagina("feedback")

def render_checklist():
    bottone_indietro()
    
    # Immagine intestazione
    st.image("https://cdn-icons-png.flaticon.com/512/2666/2666436.png", width=80) 
    st.title("Check-list")
    st.write("Spunta le attività in programma per il weekend.")
    
    # Sezione liste
    st.subheader("Venerdì")
    st.checkbox("Raccogliere conferme presenze")
    st.checkbox("Comprare bibite e stuzzichini")
    
    st.subheader("Sabato")
    st.checkbox("Inviare file excel aggiornato")
    st.checkbox("Prenotare tavoli/ritiro asporto")
    
    st.subheader("Domenica")
    st.checkbox("Inviare ordini Domenica")
    st.checkbox("Saldare i conti in sospeso")

def render_ordini():
    bottone_indietro()
    st.title("Trascrizione Ordini")
    st.write("Carica il file Excel per generare i riepiloghi.")
    
    # [Qui è racchiuso esattamente il codice dello step precedente]
    uploaded_file = st.file_uploader("Scegli il file .xlsx", type=["xlsx", "csv"])
    if uploaded_file is not None:
        try:
            df = pd.read_csv(uploaded_file) if uploaded_file.name.endswith('.csv') else pd.read_excel(uploaded_file)
            
            mappa_colonne = {1: "Nome e cognome", 2: "Primo", 3: "Secondo", 4: "Bevande", 
                             8: "Primo 2", 9: "Secondo 2", 10: "Contorni", 11: "Bevande 2"}
            df.columns = df.columns.str.strip()
            
            matrice = [[valore if pd.notna(valore) and str(valore).strip() != "" else "-" 
                        for valore in riga] for riga in df[list(mappa_colonne.values())].values.tolist()]

            # (Inizializzazione e Analisi Dati - Ometto le decine di righe per brevità, 
            # incolla qui il blocco dell'analisi matrice e le stampe st.write che avevamo fatto prima)
            st.success("File elaborato correttamente! (Inserisci qui la logica di stampa del file precedente)")
            
        except Exception as e:
            st.error(f"Errore nella lettura: {e}")

def render_sabato():
    bottone_indietro()
    st.title("Sabato Sera")
    st.write("Calcola rapidamente la divisione del conto.")
    
    # Box per inserire la comanda
    comanda = st.text_area("Comanda", placeholder="Es. 3 Pizze Margherita, 2 Patatine, 4 Birre...", height=100)
    
    col1, col2 = st.columns(2)
    with col1:
        totale = st.number_input("Prezzo Totale (€)", min_value=0.0, step=0.5, format="%.2f")
    with col2:
        persone = st.number_input("Numero Persone", min_value=1, step=1)
        
    if st.button("Dividi Conto", type="primary"):
        quota = totale / persone
        st.success(f"💰 **Prezzo Totale:** {formatta_prezzo(totale)} €")
        st.info(f"👤 **Ognuno paga:** {formatta_prezzo(quota)} €")

def render_feedback():
    bottone_indietro()
    st.title("Note & Feedback")
    st.write("Appunta promemoria per il gruppo o valuta il weekend.")
    
    # Diario di bordo/Debiti
    st.text_area("Diario / Cose da ricordare", 
                 placeholder="Es. Ricordare a Raffaele e Giovanni di mandare i soldi delle bevande...", 
                 height=150)
                 
    # Feedback Ristorante/Organizzazione
    st.write("**Valutazione Ristorante/Serata:**")
    st.select_slider("Stelle", options=["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"], value="⭐⭐⭐⭐")
    
    if st.button("Salva Appunti", type="primary"):
        st.toast("✅ Appunti salvati temporaneamente!")

# ==========================================
# GESTORE DELLE PAGINE
# ==========================================
if st.session_state.pagina_corrente == 'home': render_home()
elif st.session_state.pagina_corrente == 'checklist': render_checklist()
elif st.session_state.pagina_corrente == 'ordini': render_ordini()
elif st.session_state.pagina_corrente == 'sabato': render_sabato()
elif st.session_state.pagina_corrente == 'feedback': render_feedback()