from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import re
from collections import Counter

# Inizializza l'app
app = FastAPI()

# Configurazione CORS (Permette al frontend di comunicare col backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- COSTANTI E FUNZIONI DI CALCOLO ---
PREZZO_SOLO_PRIMO = 9
PREZZO_SOLO_SECONDO = 12.50
PREZZO_COMPLETO = 16

def calcola_prezzo_domenica(ordini):
    totale = 0.0
    for item in ordini:
        matches = re.findall(r'(\d+(?:[.,]\d+)?)\s*€', str(item))
        for prezzo in matches: 
            totale += float(prezzo.replace(",", "."))
    return totale

def estrai_nomi_domenica(cella):
    if cella == "-": return []
    return [re.sub(r':\s*\d+(?:[.,]\d+)?$', '', p.strip(', ').strip()).strip().capitalize() 
            for p in cella.split('€') if p.strip(', ').strip()]

# --- ENDPOINT API ---

@app.post("/api/ordini/upload")
async def elabora_ordini(file: UploadFile = File(...)):
    # Controllo che sia un file Excel o CSV
    if not (file.filename.endswith('.xlsx') or file.filename.endswith('.csv')):
        raise HTTPException(status_code=400, detail="Formato file non supportato. Usa .xlsx o .csv")
    
    # Leggiamo i byte del file inviato dal Frontend
    contents = await file.read()
    
    try:
        # Trasformiamo i byte in un formato leggibile da Pandas
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        else:
            df = pd.read_excel(io.BytesIO(contents))
            
        mappa_colonne = {
            1: "Nome e cognome", 2: "Primo", 3: "Secondo", 4: "Bevande", 
            8: "Primo 2", 9: "Secondo 2", 10: "Contorni", 11: "Bevande 2"
        }
        df.columns = df.columns.str.strip()
        
        # Creazione matrice (esattamente come nel tuo codice)
        matrice = [[valore if pd.notna(valore) and str(valore).strip() != "" else "-" 
                    for valore in riga] for riga in df[list(mappa_colonne.values())].values.tolist()]

        # Contatori
        primi_sabato, secondi_sabato, bevande_sabato = Counter(), Counter(), Counter()
        primi_domenica, secondi_domenica, contorni_domenica, bevande_domenica = Counter(), Counter(), Counter(), Counter()
        
        menu_primo, menu_secondo, menu_completo = 0, 0, 0
        totale_sabato, totale_domenica = 0.0, 0.0
        
        dettaglio_clienti = {"sabato": [], "domenica": []}

        # Analisi Matrice
        for riga in matrice:
            nome = riga[0]
            # --- SABATO ---
            primo_sab, secondo_sab, bevande_sab = str(riga[1]).strip(), str(riga[2]).strip(), str(riga[3]).strip()
            ha_primo = primo_sab != "-"
            ha_secondo = secondo_sab != "-"
            
            quota_cliente_sabato = 0
            if ha_primo and ha_secondo:
                menu_completo += 1
                totale_sabato += PREZZO_COMPLETO
                quota_cliente_sabato = PREZZO_COMPLETO
            elif ha_secondo:
                menu_secondo += 1
                totale_sabato += PREZZO_SOLO_SECONDO
                quota_cliente_sabato = PREZZO_SOLO_SECONDO
            elif ha_primo:
                menu_primo += 1
                totale_sabato += PREZZO_SOLO_PRIMO
                quota_cliente_sabato = PREZZO_SOLO_PRIMO
                
            if ha_primo: primi_sabato[primo_sab.capitalize()] += 1
            if ha_secondo: secondi_sabato[secondo_sab.capitalize()] += 1
            if bevande_sab != "-":
                for bevanda in re.split(r'[,+]', bevande_sab):
                    if bevanda.strip(): bevande_sabato[bevanda.strip().capitalize()] += 1
                    
            if ha_primo or ha_secondo or bevande_sab != "-":
                ordini_sab = [item for item in [primo_sab, secondo_sab, bevande_sab] if item != "-"]
                dettaglio_clienti["sabato"].append({"nome": nome, "ordini": ordini_sab, "prezzo": quota_cliente_sabato})

            # --- DOMENICA ---
            ordini_dom = [item for item in [str(riga[4]), str(riga[5]), str(riga[6]), str(riga[7])] if item != "-"]
            
            if ordini_dom:
                quota_cliente_dom = calcola_prezzo_domenica(ordini_dom)
                totale_domenica += quota_cliente_dom
                dettaglio_clienti["domenica"].append({"nome": nome, "ordini": ordini_dom, "prezzo": quota_cliente_dom})
                
            for piatto in estrai_nomi_domenica(str(riga[4])): primi_domenica[piatto] += 1
            for piatto in estrai_nomi_domenica(str(riga[5])): secondi_domenica[piatto] += 1
            for piatto in estrai_nomi_domenica(str(riga[6])): contorni_domenica[piatto] += 1
            for bevanda in estrai_nomi_domenica(str(riga[7])): bevande_domenica[bevanda] += 1

        # Ritorna un gigantesco oggetto JSON strutturato
        return {
            "status": "success",
            "sabato": {
                "totale_euro": totale_sabato,
                "menu_completo": menu_completo,
                "menu_primo": menu_primo,
                "menu_secondo": menu_secondo,
                "primi": dict(primi_sabato),
                "secondi": dict(secondi_sabato),
                "bevande": dict(bevande_sabato)
            },
            "domenica": {
                "totale_euro": totale_domenica,
                "primi": dict(primi_domenica),
                "secondi": dict(secondi_domenica),
                "contorni": dict(contorni_domenica),
                "bevande": dict(bevande_domenica)
            },
            "dettaglio_clienti": dettaglio_clienti
        }

    except KeyError:
        raise HTTPException(status_code=400, detail="Errore: colonne mancanti. Controlla il template Excel.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))