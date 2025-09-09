import React, { useState } from 'react';
import { Home, Settings, FileText, Download, Car, Waves, TreePine, Users, Clock, Plus, Trash2, Edit2 } from 'lucide-react';

const HausregelnGenerator = () => {
  // CSS Custom Properties für LikeHome-Farben
  const styles = {
    primary: '#1B2C22',     // Forest Green
    secondary: '#95A292',   // Sage Green  
    dark: '#151515',        // Charcoal
    light: '#F6F6F6',       // Light Gray
    white: '#FFFFFF'        // White
  };

  // Wohnungen State - jetzt editierbar
  const [wohnungen, setWohnungen] = useState([
    { id: 1, nummer: '101', name: 'Erdgeschoss Links' },
    { id: 2, nummer: '102', name: 'Erdgeschoss Rechts' },
    { id: 3, nummer: '201', name: '1. OG Links' },
    { id: 4, nummer: '202', name: '1. OG Rechts' },
    { id: 5, nummer: '301', name: '2. OG Links' },
    { id: 6, nummer: '302', name: '2. OG Rechts' },
    { id: 7, nummer: '305', name: '2. OG Penthouse' }
  ]);

  // State für neue Wohnung
  const [neueWohnung, setNeueWohnung] = useState({ nummer: '', name: '' });
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({});
  const [showApartmentManager, setShowApartmentManager] = useState(false);

  // Einheitliche Regeln (für alle gleich)
  const [einheitlicheRegeln, setEinheitlicheRegeln] = useState({
    nachtruheVon: '22:00',
    nachtruheBis: '06:00',
    kinderGeeignet: true,
    rauchenErlaubt: false,
    haustiereErlaubt: false,
    vermieeterName: 'LikeHome Service',
    vermieterTelefon: '+49 123 456789',
    checkinVon: '15:00',
    checkinBis: '20:00',
    checkoutBis: '11:00'
  });

  // Variable Regeln (pro Wohnung)
  const [variableRegeln, setVariableRegeln] = useState({
    parkplaetze: {
      1: 1, // 101: 1 Parkplatz
      2: 1, // 102: 1 Parkplatz
      3: 2, // 201: 2 Parkplätze
      4: 2, // 202: 2 Parkplätze
      5: 0, // 301: Keine Parkplätze
      6: 0, // 302: Keine Parkplätze
      7: 3  // 305: 3+ Parkplätze
    },
    pool: {
      1: false, // 101: Kein Pool
      2: false, // 102: Kein Pool
      3: false, // 201: Kein Pool
      4: false, // 202: Kein Pool
      5: true,  // 301: Pool
      6: true,  // 302: Pool
      7: true   // 305: Pool
    },
    garten: {
      1: 'privat',      // 101: Privater Garten
      2: 'privat',      // 102: Privater Garten
      3: 'gemeinschaft', // 201: Gemeinschaftsgarten
      4: 'gemeinschaft', // 202: Gemeinschaftsgarten
      5: 'gemeinschaft', // 301: Gemeinschaftsgarten
      6: 'gemeinschaft', // 302: Gemeinschaftsgarten
      7: 'keiner'       // 305: Kein Garten
    }
  });

  const [activeTab, setActiveTab] = useState('konfigurator');

  // Apartment Management Functions
  const addWohnung = () => {
    if (neueWohnung.nummer && neueWohnung.name) {
      const newId = Math.max(...wohnungen.map(w => w.id), 0) + 1;
      const newWohnung = { ...neueWohnung, id: newId };
      
      setWohnungen([...wohnungen, newWohnung]);
      
      // Add default values for the new apartment in variable rules
      setVariableRegeln(prev => ({
        parkplaetze: { ...prev.parkplaetze, [newId]: 1 },
        pool: { ...prev.pool, [newId]: false },
        garten: { ...prev.garten, [newId]: 'gemeinschaft' }
      }));
      
      setNeueWohnung({ nummer: '', name: '' });
    }
  };

  const deleteWohnung = (id) => {
    setWohnungen(wohnungen.filter(w => w.id !== id));
    
    // Remove from variable rules
    setVariableRegeln(prev => {
      const newRules = { ...prev };
      delete newRules.parkplaetze[id];
      delete newRules.pool[id];
      delete newRules.garten[id];
      return newRules;
    });
  };

  const startEdit = (wohnung) => {
    setEditMode(wohnung.id);
    setEditData({ nummer: wohnung.nummer, name: wohnung.name });
  };

  const updateWohnung = (id) => {
    setWohnungen(wohnungen.map(w => 
      w.id === id ? { ...w, ...editData } : w
    ));
    setEditMode(null);
    setEditData({});
  };

  const cancelEdit = () => {
    setEditMode(null);
    setEditData({});
  };

  // Gruppierungs-Funktionen
  const gruppiereNachWert = (regel) => {
    const gruppen = {};
    Object.entries(variableRegeln[regel]).forEach(([wohnungId, wert]) => {
      if (!gruppen[wert]) gruppen[wert] = [];
      const wohnung = wohnungen.find(w => w.id === parseInt(wohnungId));
      if (wohnung) gruppen[wert].push(wohnung.nummer);
    });
    return gruppen;
  };

  const formatWohnungsListe = (nummern) => {
    return nummern.sort().join(', ');
  };

  // Hausregeln-Generator
  const generiereHausregeln = () => {
    let output = `# FERIENWOHNUNG HAUSORDNUNG

**Liebe Gäste,**

wir heißen Sie herzlich willkommen in unserer Ferienwohnung und freuen uns über Ihren Aufenthalt! Damit Sie und zukünftige Gäste sich bei uns wohlfühlen können, verpflichten Sie sich mit Ihrem Aufenthalt, diesen Regeln Folge zu leisten. Danke für Ihr Verständnis.

## 📋 Allgemeine Richtlinien

### a) Rechtliche Grundlage
Die Hausregeln sind an den Mietvertrag gekoppelt und bei Nichteinhaltung der Hausregeln behält sich der Vermieter das Recht vor, den Mietvertrag aufzulösen oder einen Teil der Kaution einzubehalten.

### b) Geltungsbereich
Alle Gäste (und Besucher) müssen den Hausregeln und weiteren Anweisungen des Vermieters folgen.

## 🔇 Lärmbelästigung und Nachtruhe

### a) Nachtruhe
In der Zeit von **${einheitlicheRegeln.nachtruheVon} Uhr bis ${einheitlicheRegeln.nachtruheBis} Uhr** gilt Nachtruhe im Gebäude. Zu dieser Zeit gilt es sich ruhig zu verhalten, keinen starken Lärm zu verursachen und auf andere Gäste Rücksicht zu nehmen.

### b) Kinder
${einheitlicheRegeln.kinderGeeignet 
  ? 'Diese Ferienwohnungen sind für Kinder aller Altersgruppen geeignet.' 
  : 'Diese Ferienwohnungen sind nicht für Kinder geeignet.'} Erziehungsberechtigte sind für die Sicherheit und das Verhalten der Kinder jederzeit verantwortlich.

### c) Lärmschutz
Übermäßiger Lärm und Partys sind zu jeder Tages- und Nachtzeit untersagt und können dazu führen, dass der Mietvertrag gekündigt wird, dass die Ferienwohnung verlassen werden muss und dass ggf. zusätzliche Kosten anfallen.

### d) Nachbarschaftsrespekt
Wir bitten unsere Gäste und ihre Besucher um einen respektvollen Umgang mit den Anwohnern und Nachbarn.

## 🚗 Parkmöglichkeiten

### a) Allgemeine Parkregeln
Gäste und ihre Besucher müssen sich an geltende Parkvorschriften halten und die Fahrzeuge und Parkwege der Nachbarn beachten.

### b) Verfügbarkeit
Das Gebäude verfügt über unterschiedliche Parkplatzzuteilungen je Wohnung:

`;

    // Parkplätze gruppiert
    const parkplatzGruppen = gruppiereNachWert('parkplaetze');
    Object.entries(parkplatzGruppen).forEach(([anzahl, nummern]) => {
      const anzahlInt = parseInt(anzahl);
      if (anzahlInt === 0) {
        output += `- **Keine Parkplätze:** Apartment ${formatWohnungsListe(nummern)} - Gäste können öffentliche Parkplätze in der Umgebung nutzen\n`;
      } else if (anzahlInt === 1) {
        output += `- **1 Parkplatz:** Apartment ${formatWohnungsListe(nummern)}\n`;
      } else if (anzahlInt === 2) {
        output += `- **2 Parkplätze:** Apartment ${formatWohnungsListe(nummern)}\n`;
      } else {
        output += `- **3+ Parkplätze:** Apartment ${formatWohnungsListe(nummern)}\n`;
      }
    });

    // Pool-Bereich nur wenn mindestens eine Wohnung Pool hat
    const poolGruppen = gruppiereNachWert('pool');
    if (poolGruppen.true && poolGruppen.true.length > 0) {
      output += `\n## 🏊‍♂️ Pool

### a) Verfügbarkeit
Nur bestimmte Wohnungen in diesem Gebäude haben Zugang zum Pool:

- **Pool-Zugang:** Apartment ${formatWohnungsListe(poolGruppen.true)}`;
      
      if (poolGruppen.false && poolGruppen.false.length > 0) {
        output += `\n- **Kein Pool-Zugang:** Apartment ${formatWohnungsListe(poolGruppen.false)}`;
      }

      output += `\n\n### b) Nutzungszeiten (für berechtigte Wohnungen)
Der Pool darf nur in der Zeit von **08:00 Uhr bis 22:00 Uhr** benutzt werden.

### c) Sicherheitsregeln
Aus Sicherheitsgründen ist es nicht erlaubt, Gläser in oder um den Poolbereich herum zu benutzen. Die Nichteinhaltung dieser Regel führt zu einer Geldbuße.

### d) Hygiene
Bitte duschen Sie sich, bevor Sie den Pool betreten.

`;
    }

    // Garten-Bereich
    const gartenGruppen = gruppiereNachWert('garten');
    const hatGarten = (gartenGruppen.privat && gartenGruppen.privat.length > 0) || 
                     (gartenGruppen.gemeinschaft && gartenGruppen.gemeinschaft.length > 0);
    
    if (hatGarten) {
      output += `## 🌳 Garten & Außenbereiche

### a) Gartenverfügbarkeit
Die Wohnungen in diesem Gebäude haben unterschiedliche Gartenzugänge:

`;
      
      if (gartenGruppen.gemeinschaft && gartenGruppen.gemeinschaft.length > 0) {
        output += `- **Gemeinschaftsgarten:** Apartment ${formatWohnungsListe(gartenGruppen.gemeinschaft)}\n`;
      }
      
      if (gartenGruppen.privat && gartenGruppen.privat.length > 0) {
        output += `- **Privater Garten:** Apartment ${formatWohnungsListe(gartenGruppen.privat)}\n`;
      }
      
      if (gartenGruppen.keiner && gartenGruppen.keiner.length > 0) {
        output += `- **Kein Garten:** Apartment ${formatWohnungsListe(gartenGruppen.keiner)}\n`;
      }

      if (gartenGruppen.gemeinschaft && gartenGruppen.gemeinschaft.length > 0) {
        output += `\n### b) Regeln für Gemeinschaftsgarten
- Nutzungszeiten: 07:00 bis 22:00 Uhr
- Keine Änderungen an der Bepflanzung
- Kinder müssen beaufsichtigt werden
- Grillen nur nach Absprache

`;
      }

      if (gartenGruppen.privat && gartenGruppen.privat.length > 0) {
        output += `### c) Regeln für private Gärten
- Keine Änderungen an der Bepflanzung
- Kinder müssen beaufsichtigt werden
- Grillen im privaten Bereich gestattet

`;
      }
    }

    // Rauchen
    output += `## 🚭 Rauchen

### a) Rauchregeln
Das Rauchen ist ${einheitlicheRegeln.rauchenErlaubt ? 'in den Ferienwohnungen erlaubt' : 'in den Ferienwohnungen nicht erlaubt'}.

### b) Entsorgung
Zigarettenstummel müssen ordnungsgemäß entsorgt werden und dürfen nicht auf das Grundstück geworfen werden. Nichtbeachtung führt zu Bußgeld/Abzug der Kaution.

## 🐕 Haustiere

### a) Haustierregeln
Haustiere sind ${einheitlicheRegeln.haustiereErlaubt ? 'in den Ferienwohnungen erlaubt' : 'in den Ferienwohnungen nicht erlaubt'}.

${einheitlicheRegeln.haustiereErlaubt ? `### b) Regeln für Haustiere
- Haustiere müssen jederzeit beaufsichtigt werden
- Schäden durch Haustiere gehen zu Lasten des Gastes
- Zusätzliche Reinigungsgebühr kann anfallen` : ''}

## 🕐 An- und Abreise

### a) Check-in
Die Anreise erfolgt zwischen **${einheitlicheRegeln.checkinVon} Uhr und ${einheitlicheRegeln.checkinBis} Uhr**.

### b) Check-out
Bei der Abreise bitten wir unsere Gäste, die Unterkunft bis spätestens **${einheitlicheRegeln.checkoutBis} Uhr** freizugeben.

### c) Verspätungen
Für Aufenthalte, die unvereinbart diesen Zeitraum überschreiten, nimmt sich der Vermieter das Recht heraus, einen Aufpreis zu verlangen.

## 🆘 Notfallinformationen

### a) Notfallkontakt
Im Falle eines Notfalls können Sie den Vermieter wie folgt erreichen:

**Name:** ${einheitlicheRegeln.vermieeterName}  
**Telefon:** ${einheitlicheRegeln.vermieterTelefon}

## ✅ Einverständnis

Eine Verletzung dieser Hausordnung verstößt gegen die Mietbedingungen gemäß Mietvertrag. Der Vermieter behält sich das Recht vor, den Mietvertrag zu beenden und Gäste, die sich weigern, die Hausordnung zu befolgen, aus der Wohnung zu verweisen.

---

**Ort, Datum:** _________________ **Unterschrift:** _________________
`;

    return output;
  };

  // Update-Funktionen
  const updateEinheitlich = (key, value) => {
    setEinheitlicheRegeln(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateVariable = (regelKey, wohnungId, value) => {
    setVariableRegeln(prev => ({
      ...prev,
      [regelKey]: {
        ...prev[regelKey],
        [wohnungId]: value
      }
    }));
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: styles.light,
      fontFamily: 'Manrope, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: styles.primary,
        padding: '20px 0',
        marginBottom: '40px'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Home size={32} style={{ color: styles.white, marginRight: '16px' }} />
          <div>
            <h1 style={{ 
              margin: 0, 
              color: styles.white,
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '28px',
              fontWeight: '700'
            }}>
              LikeHome Hausregeln-Generator
            </h1>
            <p style={{ 
              margin: '4px 0 0 0', 
              color: styles.secondary,
              fontSize: '16px'
            }}>
              Elegante Gruppierung • {wohnungen.length} Wohnungen • Finale Hausregeln
            </p>
          </div>
        </div>
      </div>

      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '0 20px'
      }}>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          marginBottom: '40px',
          borderBottom: `2px solid ${styles.light}`
        }}>
          <button
            onClick={() => setActiveTab('apartments')}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderBottom: `3px solid ${activeTab === 'apartments' ? styles.primary : 'transparent'}`,
              backgroundColor: 'transparent',
              color: activeTab === 'apartments' ? styles.primary : styles.secondary,
              cursor: 'pointer',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            <Users size={20} style={{ marginRight: '8px', display: 'inline' }} />
            Apartments
          </button>
          <button
            onClick={() => setActiveTab('konfigurator')}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderBottom: `3px solid ${activeTab === 'konfigurator' ? styles.primary : 'transparent'}`,
              backgroundColor: 'transparent',
              color: activeTab === 'konfigurator' ? styles.primary : styles.secondary,
              cursor: 'pointer',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            <Settings size={20} style={{ marginRight: '8px', display: 'inline' }} />
            Konfiguration
          </button>
          <button
            onClick={() => setActiveTab('hausregeln')}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderBottom: `3px solid ${activeTab === 'hausregeln' ? styles.primary : 'transparent'}`,
              backgroundColor: 'transparent',
              color: activeTab === 'hausregeln' ? styles.primary : styles.secondary,
              cursor: 'pointer',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            <FileText size={20} style={{ marginRight: '8px', display: 'inline' }} />
            Finale Hausregeln
          </button>
        </div>

        {/* Content */}
        {activeTab === 'apartments' ? (
          <div>
            {/* Apartment Manager */}
            <div style={{
              backgroundColor: styles.white,
              padding: '24px',
              borderRadius: '12px',
              marginBottom: '32px',
              border: `2px solid ${styles.primary}`
            }}>
              <h2 style={{ 
                margin: '0 0 20px 0',
                color: styles.dark,
                fontSize: '24px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Users size={28} style={{ marginRight: '12px', color: styles.primary }} />
                Apartment-Verwaltung ({wohnungen.length} Apartments)
              </h2>

              {/* Add new apartment */}
              <div style={{
                backgroundColor: styles.light,
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '24px'
              }}>
                <h3 style={{ margin: '0 0 16px 0', color: styles.dark }}>Neues Apartment hinzufügen</h3>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Nummer (z.B. 101)"
                    value={neueWohnung.nummer}
                    onChange={(e) => setNeueWohnung(prev => ({ ...prev, nummer: e.target.value }))}
                    style={{
                      padding: '8px 12px',
                      border: `1px solid ${styles.secondary}`,
                      borderRadius: '4px',
                      minWidth: '120px'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Name (z.B. Erdgeschoss Links)"
                    value={neueWohnung.name}
                    onChange={(e) => setNeueWohnung(prev => ({ ...prev, name: e.target.value }))}
                    style={{
                      padding: '8px 12px',
                      border: `1px solid ${styles.secondary}`,
                      borderRadius: '4px',
                      minWidth: '200px',
                      flex: '1'
                    }}
                  />
                  <button
                    onClick={addWohnung}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: styles.primary,
                      color: styles.white,
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Plus size={16} />
                    Hinzufügen
                  </button>
                </div>
              </div>

              {/* Apartment List */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '16px'
              }}>
                {wohnungen.map((wohnung) => (
                  <div key={wohnung.id} style={{
                    backgroundColor: styles.light,
                    padding: '16px',
                    borderRadius: '8px',
                    border: `1px solid ${styles.secondary}`
                  }}>
                    {editMode === wohnung.id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <input
                          type="text"
                          value={editData.nummer || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, nummer: e.target.value }))}
                          placeholder="Apartment Nummer"
                          style={{
                            padding: '8px 12px',
                            border: `1px solid ${styles.secondary}`,
                            borderRadius: '4px'
                          }}
                        />
                        <input
                          type="text"
                          value={editData.name || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Apartment Name"
                          style={{
                            padding: '8px 12px',
                            border: `1px solid ${styles.secondary}`,
                            borderRadius: '4px'
                          }}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => updateWohnung(wohnung.id)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: styles.primary,
                              color: styles.white,
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            Speichern
                          </button>
                          <button
                            onClick={cancelEdit}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: styles.secondary,
                              color: styles.white,
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            Abbrechen
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <h4 style={{ margin: 0, color: styles.dark }}>Apartment {wohnung.nummer}</h4>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              onClick={() => startEdit(wohnung)}
                              style={{
                                padding: '4px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: styles.primary
                              }}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => deleteWohnung(wohnung.id)}
                              style={{
                                padding: '4px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#dc2626'
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <p style={{ margin: 0, color: styles.secondary, fontSize: '14px' }}>{wohnung.name}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === 'konfigurator' ? (
          <div>
            {/* Einheitliche Regeln */}
            <div style={{
              backgroundColor: styles.white,
              padding: '24px',
              borderRadius: '12px',
              marginBottom: '32px',
              border: `2px solid ${styles.primary}`
            }}>
              <h2 style={{ 
                margin: '0 0 20px 0',
                color: styles.dark,
                fontSize: '24px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Clock size={28} style={{ marginRight: '12px', color: styles.primary }} />
                Einheitliche Regeln (für alle {wohnungen.length} Wohnungen)
              </h2>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '20px'
              }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                    Nachtruhe:
                  </label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="time"
                      value={einheitlicheRegeln.nachtruheVon}
                      onChange={(e) => updateEinheitlich('nachtruheVon', e.target.value)}
                      style={{ padding: '8px', border: `1px solid ${styles.secondary}`, borderRadius: '4px' }}
                    />
                    <span>bis</span>
                    <input
                      type="time"
                      value={einheitlicheRegeln.nachtruheBis}
                      onChange={(e) => updateEinheitlich('nachtruheBis', e.target.value)}
                      style={{ padding: '8px', border: `1px solid ${styles.secondary}`, borderRadius: '4px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                    Kinder geeignet:
                  </label>
                  <select
                    value={einheitlicheRegeln.kinderGeeignet}
                    onChange={(e) => updateEinheitlich('kinderGeeignet', e.target.value === 'true')}
                    style={{ 
                      padding: '8px 12px', 
                      border: `1px solid ${styles.secondary}`, 
                      borderRadius: '4px',
                      width: '100%'
                    }}
                  >
                    <option value="true">Ja, für alle Altersgruppen</option>
                    <option value="false">Nein, nicht kindergeeignet</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                    Rauchen erlaubt:
                  </label>
                  <select
                    value={einheitlicheRegeln.rauchenErlaubt}
                    onChange={(e) => updateEinheitlich('rauchenErlaubt', e.target.value === 'true')}
                    style={{ 
                      padding: '8px 12px', 
                      border: `1px solid ${styles.secondary}`, 
                      borderRadius: '4px',
                      width: '100%'
                    }}
                  >
                    <option value="false">Nein, Rauchverbot</option>
                    <option value="true">Ja, Rauchen erlaubt</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                    Haustiere erlaubt:
                  </label>
                  <select
                    value={einheitlicheRegeln.haustiereErlaubt}
                    onChange={(e) => updateEinheitlich('haustiereErlaubt', e.target.value === 'true')}
                    style={{ 
                      padding: '8px 12px', 
                      border: `1px solid ${styles.secondary}`, 
                      borderRadius: '4px',
                      width: '100%'
                    }}
                  >
                    <option value="false">Nein, keine Haustiere</option>
                    <option value="true">Ja, Haustiere erlaubt</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Variable Regeln */}
            <div style={{
              backgroundColor: styles.white,
              padding: '24px',
              borderRadius: '12px',
              marginBottom: '32px'
            }}>
              <h2 style={{ 
                margin: '0 0 20px 0',
                color: styles.dark,
                fontSize: '24px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Settings size={28} style={{ marginRight: '12px', color: styles.primary }} />
                Variable Regeln (pro Wohnung)
              </h2>

              {/* Parkplätze */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ 
                  margin: '0 0 16px 0',
                  color: styles.dark,
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Car size={20} style={{ marginRight: '8px', color: styles.primary }} />
                  Parkplätze
                </h3>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                  gap: '12px'
                }}>
                  {wohnungen.map((wohnung) => (
                    <div key={wohnung.id} style={{
                      padding: '12px',
                      backgroundColor: styles.light,
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{ fontWeight: '600' }}>{wohnung.nummer}</span>
                      <select
                        value={variableRegeln.parkplaetze[wohnung.id]}
                        onChange={(e) => updateVariable('parkplaetze', wohnung.id, parseInt(e.target.value))}
                        style={{ 
                          padding: '4px 8px', 
                          border: `1px solid ${styles.secondary}`, 
                          borderRadius: '4px'
                        }}
                      >
                        <option value={0}>Keine</option>
                        <option value={1}>1 Platz</option>
                        <option value={2}>2 Plätze</option>
                        <option value={3}>3+ Plätze</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pool */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ 
                  margin: '0 0 16px 0',
                  color: styles.dark,
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Waves size={20} style={{ marginRight: '8px', color: styles.primary }} />
                  Pool-Zugang
                </h3>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                  gap: '12px'
                }}>
                  {wohnungen.map((wohnung) => (
                    <div key={wohnung.id} style={{
                      padding: '12px',
                      backgroundColor: styles.light,
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{ fontWeight: '600' }}>{wohnung.nummer}</span>
                      <select
                        value={variableRegeln.pool[wohnung.id]}
                        onChange={(e) => updateVariable('pool', wohnung.id, e.target.value === 'true')}
                        style={{ 
                          padding: '4px 8px', 
                          border: `1px solid ${styles.secondary}`, 
                          borderRadius: '4px'
                        }}
                      >
                        <option value={false}>Kein Pool</option>
                        <option value={true}>Pool-Zugang</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Garten */}
              <div>
                <h3 style={{ 
                  margin: '0 0 16px 0',
                  color: styles.dark,
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <TreePine size={20} style={{ marginRight: '8px', color: styles.primary }} />
                  Garten-Zugang
                </h3>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                  gap: '12px'
                }}>
                  {wohnungen.map((wohnung) => (
                    <div key={wohnung.id} style={{
                      padding: '12px',
                      backgroundColor: styles.light,
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{ fontWeight: '600' }}>{wohnung.nummer}</span>
                      <select
                        value={variableRegeln.garten[wohnung.id]}
                        onChange={(e) => updateVariable('garten', wohnung.id, e.target.value)}
                        style={{ 
                          padding: '4px 8px', 
                          border: `1px solid ${styles.secondary}`, 
                          borderRadius: '4px'
                        }}
                      >
                        <option value="keiner">Kein Garten</option>
                        <option value="gemeinschaft">Gemeinschaft</option>
                        <option value="privat">Privat</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Gruppierungs-Vorschau */}
            <div style={{
              backgroundColor: '#E8F5E8',
              padding: '24px',
              borderRadius: '12px',
              border: `2px solid ${styles.primary}`
            }}>
              <h2 style={{ 
                margin: '0 0 20px 0',
                color: styles.dark,
                fontSize: '20px'
              }}>
                📋 Gruppierungs-Vorschau
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {/* Parkplätze Gruppierung */}
                <div>
                  <h4 style={{ margin: '0 0 12px 0', color: styles.dark }}>🚗 Parkplätze:</h4>
                  {Object.entries(gruppiereNachWert('parkplaetze')).map(([anzahl, nummern]) => (
                    <div key={anzahl} style={{ marginBottom: '4px', fontSize: '14px' }}>
                      <strong>
                        {anzahl === '0' ? 'Keine' : 
                         anzahl === '1' ? '1 Parkplatz' : 
                         anzahl === '2' ? '2 Parkplätze' : '3+ Parkplätze'}:
                      </strong> {formatWohnungsListe(nummern)}
                    </div>
                  ))}
                </div>

                {/* Pool Gruppierung */}
                <div>
                  <h4 style={{ margin: '0 0 12px 0', color: styles.dark }}>🏊‍♂️ Pool:</h4>
                  {Object.entries(gruppiereNachWert('pool')).map(([zugang, nummern]) => (
                    <div key={zugang} style={{ marginBottom: '4px', fontSize: '14px' }}>
                      <strong>{zugang === 'true' ? 'Pool-Zugang' : 'Kein Pool'}:</strong> {formatWohnungsListe(nummern)}
                    </div>
                  ))}
                </div>

                {/* Garten Gruppierung */}
                <div>
                  <h4 style={{ margin: '0 0 12px 0', color: styles.dark }}>🌳 Garten:</h4>
                  {Object.entries(gruppiereNachWert('garten')).map(([typ, nummern]) => (
                    <div key={typ} style={{ marginBottom: '4px', fontSize: '14px' }}>
                      <strong>
                        {typ === 'keiner' ? 'Kein Garten' : 
                         typ === 'gemeinschaft' ? 'Gemeinschaftsgarten' : 'Privater Garten'}:
                      </strong> {formatWohnungsListe(nummern)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            backgroundColor: styles.white,
            padding: '32px',
            borderRadius: '12px',
            border: `1px solid ${styles.light}`
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{ 
                margin: 0,
                color: styles.dark,
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '24px'
              }}>
                📄 Finale Hausregeln (Gruppiert)
              </h2>
              <button style={{
                padding: '12px 24px',
                backgroundColor: styles.primary,
                color: styles.white,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                <Download size={20} />
                PDF Export
              </button>
            </div>
            
            <pre style={{
              backgroundColor: styles.light,
              padding: '24px',
              borderRadius: '8px',
              fontSize: '13px',
              lineHeight: '1.6',
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              border: `1px solid ${styles.secondary}`,
              fontFamily: 'Monaco, Courier, monospace'
            }}>
              {generiereHausregeln()}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default HausregelnGenerator;