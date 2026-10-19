import streamlit as st
import streamlit.components.v1 as components
import pandas as pd
from collections import Counter
import re

# ==========================================
# COSTANTI E FUNZIONI DI UTILITÀ
# ==========================================

PREZZO_SOLO_PRIMO = 9
PREZZO_SOLO_SECONDO = 12.50
PREZZO_COMPLETO = 16

def calcola_prezzo_sabato(primo, secondo):
    ha_primo = primo != "-"
    ha_secondo = secondo != "-"
    if ha_primo and ha_secondo:
        return PREZZO_COMPLETO
    elif ha_secondo:
        return PREZZO_SOLO_SECONDO
    elif ha_primo:
        return PREZZO_SOLO_PRIMO
    return 0

def calcola_prezzo_domenica(ordini):
    totale = 0.0
    for item in ordini:
        # Trova TUTTI i numeri seguiti da €
        matches = re.findall(r'(\d+(?:[.,]\d+)?)\s*€', str(item))
        for prezzo in matches:
            prezzo_estratto = float(prezzo.replace(",", "."))
            totale += prezzo_estratto
    return totale

def formatta_prezzo(prezzo):
    if prezzo == int(prezzo):
        return f"{int(prezzo)}"
    return f"{prezzo:.2f}".replace(".", ",")

def estrai_nomi_domenica(cella):
    if cella == "-":
        return []
    piatti = []
    parti = cella.split('€')
    for p in parti:
        p = p.strip(', ').strip()
        if not p:
            continue
        nome_piatto = re.sub(r':\s*\d+(?:[.,]\d+)?$', '', p).strip()
        if nome_piatto:
            piatti.append(nome_piatto.capitalize())
    return piatti

# ==========================================
# INTERFACCIA WEB (STREAMLIT)
# ==========================================

st.set_page_config(page_title="Gestione Ordini", page_icon="🍔", layout="centered")

# Personalizzazione dell'interfaccia con modifiche CSS per nascondere elementi non necessari e adattare il tema scuro
# Nasconde la sfumatura bianca in alto e colora lo sfondo
st.markdown("""
    <style>
    [data-testid="stHeader"] {display: none !important;}
    .stApp {background-color: #0e1117 !important;}
    .block-container {padding-top: 1rem !important;} 
    </style>
""", unsafe_allow_html=True)

# Inietta il logo personalizzato e il tema scuro per l'iPhone
components.html(
    """
    <script>
    const parentDoc = window.parent.document;
    
    // Imposta il logo per la schermata Home di iOS
    if (!parentDoc.querySelector('link[rel="apple-touch-icon"]')) {
        const linkIcon = parentDoc.createElement('link');
        linkIcon.rel = 'apple-touch-icon';
        // Sostituisci questo link con l'URL grezzo del tuo logo caricato su GitHub
        linkIcon.href = 'https://raw.githubusercontent.com/LightJoker90/learnis/main/logo.jpeg';
        parentDoc.head.appendChild(linkIcon);
    }

    // Colora la barra della batteria e dell'orario di scuro
    if (!parentDoc.querySelector('meta[name="theme-color"]')) {
        const metaTheme = parentDoc.createElement('meta');
        metaTheme.name = "theme-color";
        metaTheme.content = "#0e1117";
        parentDoc.head.appendChild(metaTheme);
    }
    </script>
    """,
    height=0,
    width=0,
)


st.title("🍔 Pappa e Ciccia - Gestione Ordini")
st.write("Carica il file Excel per generare i riepiloghi del Sabato e della Domenica.")

# 1. Caricamento del file
uploaded_file = st.file_uploader("Scegli il file .xlsx", type=["xlsx", "csv"])

if uploaded_file is not None:
    try:
        # Lettura file
        if uploaded_file.name.endswith('.csv'):
            df = pd.read_csv(uploaded_file)
        else:
            df = pd.read_excel(uploaded_file)

        # Mappatura e pulizia colonne
        mappa_colonne = {
            1:  "Nome e cognome",
            2:  "Primo",
            3:  "Secondo",
            4:  "Bevande",
            8:  "Primo 2",
            9:  "Secondo 2",
            10: "Contorni",
            11: "Bevande 2"
        }
        
        df.columns = df.columns.str.strip()
        colonne_menu = list(mappa_colonne.values())

        # Creazione matrice
        matrice = [
            [
                valore if pd.notna(valore) and str(valore).strip() != "" else "-"
                for valore in riga
            ]
            for riga in df[colonne_menu].values.tolist()
        ]

        # Inizializzazione contatori
        primi_sabato = Counter()
        secondi_sabato = Counter()
        bevande_sabato = Counter()
        menu_primo = 0
        menu_secondo = 0
        menu_completo = 0
        totale_sabato = 0.0

        primi_domenica = Counter()
        secondi_domenica = Counter()
        contorni_domenica = Counter()
        bevande_domenica = Counter()
        totale_domenica = 0.0

        # Analisi dati
        for riga in matrice:
            # --- DATI SABATO ---
            primo_sab = str(riga[1]).strip()
            secondo_sab = str(riga[2]).strip()
            bevande_sab = str(riga[3]).strip()
            
            ha_primo = primo_sab != "-"
            ha_secondo = secondo_sab != "-"
            
            if ha_primo and ha_secondo:
                menu_completo += 1
                totale_sabato += PREZZO_COMPLETO
            elif ha_secondo:
                menu_secondo += 1
                totale_sabato += PREZZO_SOLO_SECONDO
            elif ha_primo:
                menu_primo += 1
                totale_sabato += PREZZO_SOLO_PRIMO
                
            if ha_primo: primi_sabato[primo_sab.capitalize()] += 1
            if ha_secondo: secondi_sabato[secondo_sab.capitalize()] += 1
                
            if bevande_sab != "-":
                for bevanda in re.split(r'[,+]', bevande_sab):
                    bevanda_pulita = bevanda.strip().capitalize()
                    if bevanda_pulita:
                        bevande_sabato[bevanda_pulita] += 1
                        
            # --- DATI DOMENICA ---
            cella_primo = str(riga[4])
            cella_secondo = str(riga[5])
            cella_contorno = str(riga[6])
            cella_bevande = str(riga[7])
            
            ordini_dom = [cella_primo, cella_secondo, cella_contorno, cella_bevande]
            ordini_dom = [item for item in ordini_dom if item != "-"]
            
            if ordini_dom:
                totale_domenica += calcola_prezzo_domenica(ordini_dom)
                
            for piatto in estrai_nomi_domenica(cella_primo): primi_domenica[piatto] += 1
            for piatto in estrai_nomi_domenica(cella_secondo): secondi_domenica[piatto] += 1
            for piatto in estrai_nomi_domenica(cella_contorno): contorni_domenica[piatto] += 1
            for bevanda in estrai_nomi_domenica(cella_bevande): bevande_domenica[bevanda] += 1

        # ==========================================
        # STAMPA RISULTATI A SCHERMO
        # ==========================================
        
        # SABATO
        st.header("📅 Riepilogo Sabato")
        col1, col2, col3 = st.columns(3)
        col1.metric("Menu Primo", menu_primo)
        col2.metric("Menu Secondo", menu_secondo)
        col3.metric("Menu Completo", menu_completo)

        st.subheader("🍝 Primi")
        for piatto, quantita in primi_sabato.items(): st.write(f"- **{quantita}** {piatto}")
        
        st.subheader("🥩 Secondi")
        for piatto, quantita in secondi_sabato.items(): st.write(f"- **{quantita}** {piatto}")
        
        st.subheader("🥤 Bevande")
        for bevanda, quantita in bevande_sabato.items(): st.write(f"- **{quantita}** {bevanda}")
        
        st.success(f"💰 Totale Sabato: **{formatta_prezzo(totale_sabato)} €**")
        st.divider()

        # DOMENICA
        st.header("📅 Riepilogo Domenica")
        st.subheader("🍝 Primi")
        for piatto, quantita in primi_domenica.items(): st.write(f"- **{quantita}** {piatto}")

        st.subheader("🥩 Secondi")
        for piatto, quantita in secondi_domenica.items(): st.write(f"- **{quantita}** {piatto}")

        st.subheader("🥗 Contorni")
        for piatto, quantita in contorni_domenica.items(): st.write(f"- **{quantita}** {piatto}")
        
        st.subheader("🥤 Bevande")
        for bevanda, quantita in bevande_domenica.items(): st.write(f"- **{quantita}** {bevanda}")

        st.success(f"💰 Totale Domenica: **{formatta_prezzo(totale_domenica)} €**")
        
        # DETTAGLIO CLIENTI (Nascosto in un menu a tendina)
        with st.expander("🔍 Mostra dettaglio clienti"):
            st.write("#### Sabato")
            for riga in matrice:
                nome = riga[0]
                ordini_sab = [item for item in [riga[1], riga[2], riga[3]] if item != "-"]
                if ordini_sab:
                    prezzo = formatta_prezzo(calcola_prezzo_sabato(riga[1], riga[2]))
                    st.write(f"**{nome}**: {', '.join(ordini_sab)} _({prezzo} €)_")
                    
            st.write("#### Domenica")
            for riga in matrice:
                nome = riga[0]
                ordini_dom = [item for item in [riga[4], riga[5], riga[6], riga[7]] if item != "-"]
                if ordini_dom:
                    prezzo = formatta_prezzo(calcola_prezzo_domenica(ordini_dom))
                    st.write(f"**{nome}**: {', '.join(ordini_dom)} _({prezzo} €)_")

    except KeyError:
        st.error("Errore: I nomi delle colonne non corrispondono. Assicurati di caricare il file giusto!")
    except Exception as e:
        st.error(f"Si è verificato un errore inaspettato: {e}")