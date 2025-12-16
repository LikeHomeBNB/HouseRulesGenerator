import React, { useState } from 'react';
import { Home, Settings, FileText, Download, Car, Waves, TreePine, Users, Clock, Plus, Trash2, Edit2 } from 'lucide-react';
import jsPDF from 'jspdf';

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
  const [language, setLanguage] = useState('de'); // 'de' or 'en'

  // Einheitliche Regeln (für alle gleich)
  const [einheitlicheRegeln, setEinheitlicheRegeln] = useState({
    nachtruheVon: '22:00',
    nachtruheBis: '06:00',
    kinderGeeignet: true,
    rauchenErlaubt: false,
    rauchenBalkonErlaubt: false,
    haustiereErlaubt: false,
    vermieeterName: 'LikeHome Service',
    vermieterTelefon: '+49 123 456789',
    whatsappNummer: '+49 123 456789',
    checkinVon: '15:00',
    checkinBis: '20:00',
    checkinFlexibel: false, // Wenn true: nach Check-in-Zeit 24/7 möglich
    checkoutBis: '11:00',
    meldebescheinigungErforderlich: true, // Check-in nur nach ausgefüllter Meldebescheinigung
    checkoutPflichten: 'Bei der Abreise sind folgende Punkte zwingend zu beachten: Alle elektronischen Geräte (Licht, TV, Küchengeräte) ausschalten, Heizung auf Mindesttemperatur (16-18°C) herunterregeln, Klimaanlage ausschalten, alle Fenster und Türen schließen und verriegeln, Wasserhähne fest zudrehen, Geschirr gespült einräumen, Müll ordnungsgemäß entsorgen, persönliche Gegenstände mitnehmen und die Wohnung rechtzeitig verlassen.',
    checkoutPflichten_en: 'Upon departure, the following points must be observed: Turn off all electronic devices (lights, TV, kitchen appliances), turn down heating to minimum temperature (16-18°C), turn off air conditioning, close and lock all windows and doors, turn off taps tightly, wash and put away dishes, dispose of garbage properly, take personal belongings, and leave the apartment on time.'
  });

  // Globale Einstellungen für variable Regeln
  const [globalSettings, setGlobalSettings] = useState({
    parkplaetzeVorhanden: true,
    parkplaetzeUnterschiedlich: true,
    parkplaetzeGlobal: 1, // Wert wenn nicht unterschiedlich
    parkplaetzeKostenpflichtig: false,
    parkplatzgebuehrUnterschiedlich: false,
    parkplatzgebuehrGlobal: 10, // Euro pro Tag
    poolVorhanden: true,
    poolUnterschiedlich: true,
    poolGlobal: false, // Wert wenn nicht unterschiedlich
    gemeinschaftsgartenVorhanden: true,
    privatgartenVorhanden: true,
    gartenUnterschiedlich: true,
    gartenGlobal: 'gemeinschaft', // Wert wenn nicht unterschiedlich
    hundegebuehrUnterschiedlich: false,
    hundegebuehrGlobal: 15, // Euro pro Aufenthalt
    // Überwachung & Datenschutz
    lautstaerkemessung: true,
    lautstaerkeSpeicherdauer: 30, // Tage
    rauchdetektoren: true,
    rauchdetektor_datenspeicherung: true,
    kameras_gemeinschaftsbereiche: false,
    kamera_standorte: 'Eingangsbereiche, Flure' // Text-Liste der Standorte
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
    },
    hundegebuehr: {
      1: 15, // 101: 15€ Hundegebühr
      2: 15, // 102: 15€ Hundegebühr
      3: 15, // 201: 15€ Hundegebühr
      4: 15, // 202: 15€ Hundegebühr
      5: 15, // 301: 15€ Hundegebühr
      6: 15, // 302: 15€ Hundegebühr
      7: 15  // 305: 15€ Hundegebühr
    },
    parkplatzgebuehr: {
      1: 10, // 101: 10€ pro Tag
      2: 10, // 102: 10€ pro Tag
      3: 15, // 201: 15€ pro Tag
      4: 15, // 202: 15€ pro Tag
      5: 8,  // 301: 8€ pro Tag
      6: 8,  // 302: 8€ pro Tag
      7: 20  // 305: 20€ pro Tag
    }
  });

  const [activeTab, setActiveTab] = useState('konfigurator');

  // Helper function to sort apartments by number
  const sortWohnungen = (wohnungsList) => {
    return [...wohnungsList].sort((a, b) => {
      // Extract numeric part from apartment number for proper sorting
      const numA = parseInt(a.nummer) || 0;
      const numB = parseInt(b.nummer) || 0;
      return numA - numB;
    });
  };

  // Apartment Management Functions
  const addWohnung = () => {
    if (neueWohnung.nummer && neueWohnung.name) {
      const newId = Math.max(...wohnungen.map(w => w.id), 0) + 1;
      const newWohnung = { ...neueWohnung, id: newId };
      
      const updatedWohnungen = sortWohnungen([...wohnungen, newWohnung]);
      setWohnungen(updatedWohnungen);
      
      // Add default values for the new apartment in variable rules
      setVariableRegeln(prev => ({
        parkplaetze: { ...prev.parkplaetze, [newId]: 1 },
        pool: { ...prev.pool, [newId]: false },
        garten: { ...prev.garten, [newId]: 'gemeinschaft' },
        hundegebuehr: { ...prev.hundegebuehr, [newId]: 15 },
        parkplatzgebuehr: { ...prev.parkplatzgebuehr, [newId]: 10 }
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
      delete newRules.hundegebuehr[id];
      delete newRules.parkplatzgebuehr[id];
      return newRules;
    });
  };

  const startEdit = (wohnung) => {
    setEditMode(wohnung.id);
    setEditData({ nummer: wohnung.nummer, name: wohnung.name });
  };

  const updateWohnung = (id) => {
    const updatedWohnungen = sortWohnungen(wohnungen.map(w => 
      w.id === id ? { ...w, ...editData } : w
    ));
    setWohnungen(updatedWohnungen);
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

  // English House Rules Generator
  const generateHouseRulesEN = () => {
    let output = `# HOUSE RULES

Welcome! We are delighted that you are staying with us. To ensure you feel completely comfortable and that future guests can do the same, we have compiled a few important points for you.

## 🕐 Arrival and Departure

### a) Check-in
${einheitlicheRegeln.checkinFlexibel ? 
  `Arrival is possible **anytime from ${einheitlicheRegeln.checkinVon}** (24/7).` : 
  `Arrival takes place between **${einheitlicheRegeln.checkinVon} and ${einheitlicheRegeln.checkinBis}**.`
}

${einheitlicheRegeln.meldebescheinigungErforderlich ? '**Important Notice:** Check-in is only possible after complete registration form submission.' : ''}

### b) Check-out
We ask our guests to vacate the accommodation by **${einheitlicheRegeln.checkoutBis}** at the latest.

### c) Delays
Please adhere to the agreed check-in and check-out times.

### d) Check-out Duties
${einheitlicheRegeln.checkoutPflichten_en}

### e) Additional Persons
Additional persons beyond the originally registered number must be reported to the landlord **immediately**.

## 📋 General Guidelines

### a) Legal Basis
The house rules are linked to the rental agreement and must be complied with.

### b) Scope of Application
All guests (and visitors) must follow the house rules and other instructions from the landlord.

## 🔇 Noise Disturbance and Quiet Hours

### a) Quiet Hours
During the period from **${einheitlicheRegeln.nachtruheVon} to ${einheitlicheRegeln.nachtruheBis}**, quiet hours apply in the building. During this time, it is important to behave quietly, not cause loud noise, and be considerate of other guests.

### b) Children
${einheitlicheRegeln.kinderGeeignet 
  ? 'These holiday apartments are suitable for children of all ages.' 
  : 'These holiday apartments are not suitable for children.'} Legal guardians are responsible for the safety and behavior of children at all times.

### c) Noise Protection
Excessive noise and parties are prohibited at all times of day and night.

### d) Neighborhood Respect
Please be considerate of neighbors and other guests. Loud conversations, music, or television after quiet hours are not permitted.

## 🚭 Smoking Regulations

### a) Smoking in the Apartment
${einheitlicheRegeln.rauchenErlaubt 
  ? 'Smoking is permitted in the apartments.' 
  : 'Smoking is strictly prohibited in all apartments.'}

${!einheitlicheRegeln.rauchenErlaubt && einheitlicheRegeln.rauchenBalkonErlaubt 
  ? '### b) Smoking on Balcony/Terrace\nSmoking is permitted on balconies and terraces. Please ensure that cigarette butts are properly disposed of and ashtrays are used.' 
  : !einheitlicheRegeln.rauchenErlaubt 
    ? '### b) Complete Smoking Ban\nSmoking is not permitted anywhere on the property, including balconies and terraces.' 
    : ''}


## 🐕 Pet Policy

### a) Pet Permission
${einheitlicheRegeln.haustiereErlaubt 
  ? 'Pets are allowed in our accommodations.' 
  : 'Pets are not permitted in our accommodations.'}

${einheitlicheRegeln.haustiereErlaubt ? `
### b) Pet Responsibilities  
Pet owners are fully responsible for their animals and must ensure they do not disturb other guests or cause damage.

### c) Pet Fees
${(() => {
  let petFeeText = '';
  if (globalSettings.hundegebuehrUnterschiedlich) {
    const hundegruppen = gruppiereNachWert('hundegebuehr');
    Object.entries(hundegruppen).forEach(([gebuehr, apartmentNummern]) => {
      if (parseInt(gebuehr) > 0) {
        petFeeText += `- **€${gebuehr} per stay:** Apartments ${formatWohnungsListe(apartmentNummern)}\n`;
      } else {
        petFeeText += `- **No fee:** Apartments ${formatWohnungsListe(apartmentNummern)}\n`;
      }
    });
  } else {
    const gebuehr = globalSettings.hundegebuehrGlobal;
    const alleNummern = wohnungen.map(w => w.nummer);
    if (gebuehr > 0) {
      petFeeText += `All apartments: €${gebuehr} per stay\n`;
    } else {
      petFeeText += `No pet fees for any apartments\n`;
    }
  }
  return petFeeText;
})()}

### d) Cleaning Requirements
Additional cleaning costs may apply if pet hair or odors require special cleaning attention.` : ''}

## 🚗 Parking

### a) Parking Availability
`;

    if (globalSettings.parkplaetzeVorhanden) {
      if (globalSettings.parkplaetzeUnterschiedlich) {
        const parkplatzGruppen = gruppiereNachWert('parkplaetze');
        Object.entries(parkplatzGruppen).forEach(([anzahl, apartmentNummern]) => {
          if (parseInt(anzahl) === 0) {
            output += `- **No parking spaces:** Apartments ${formatWohnungsListe(apartmentNummern)} - Guests can use public parking in the area\n`;
          } else if (parseInt(anzahl) === 1) {
            output += `- **1 parking space:** Apartments ${formatWohnungsListe(apartmentNummern)}\n`;
          } else {
            output += `- **${anzahl} parking spaces:** Apartments ${formatWohnungsListe(apartmentNummern)}\n`;
          }
        });
      } else {
        const anzahl = globalSettings.parkplaetzeGlobal;
        const alleNummern = wohnungen.map(w => w.nummer);
        if (anzahl === 0) {
          output += `- **No parking spaces:** All apartments - Guests can use public parking in the area\n`;
        } else if (anzahl === 1) {
          output += `All apartments have 1 parking space: ${formatWohnungsListe(alleNummern)}\n`;
        } else {
          output += `All apartments have ${anzahl} parking spaces: ${formatWohnungsListe(alleNummern)}\n`;
        }
      }
      
      output += `
### b) Parking Fees
`;
      
      if (globalSettings.parkplaetzeKostenpflichtig) {
        if (globalSettings.parkplatzgebuehrUnterschiedlich) {
          const gebuehrGruppen = gruppiereNachWert('parkplatzgebuehr');
          Object.entries(gebuehrGruppen).forEach(([gebuehr, apartmentNummern]) => {
            output += `- **€${gebuehr} per day:** Apartments ${formatWohnungsListe(apartmentNummern)}\n`;
          });
        } else {
          const alleNummern = wohnungen.map(w => w.nummer);
          output += `All apartments: €${globalSettings.parkplatzgebuehrGlobal} per day\n`;
        }
      } else {
        output += `Parking is free of charge for all apartments.\n`;
      }
      
      output += `
### c) Parking Rules
Please park only in designated spaces and ensure your vehicle does not block other guests or access roads.`;
    } else {
      output += `No parking spaces are available at the property. Guests must use public parking in the surrounding area.`;
    }

    // Continue with rest of the English template...
    output += `

## Pool Access

### a) Pool Availability
`;

    if (globalSettings.poolVorhanden) {
      if (globalSettings.poolUnterschiedlich) {
        const poolGruppen = gruppiereNachWert('pool');
        Object.entries(poolGruppen).forEach(([zugang, apartmentNummern]) => {
          if (zugang === 'true') {
            output += `Apartments with pool access: ${formatWohnungsListe(apartmentNummern)}\n`;
          } else {
            output += `Apartments without pool access: ${formatWohnungsListe(apartmentNummern)}\n`;
          }
        });
      } else {
        const alleNummern = wohnungen.map(w => w.nummer);
        if (globalSettings.poolGlobal) {
          output += `All apartments have pool access: ${formatWohnungsListe(alleNummern)}\n`;
        } else {
          output += `No apartments have pool access: ${formatWohnungsListe(alleNummern)}\n`;
        }
      }
      
      output += `
### b) Pool Rules
- Pool hours: Usually from sunrise to sunset
- Children must be supervised at all times
- No glass containers in pool area
- Please shower before entering the pool
- Pool use at your own risk`;
    } else {
      output += `No pool is available at this property.`;
    }

    output += `

## Garden & Outdoor Areas

### a) Garden Access
`;

    if (globalSettings.gartenVorhanden) {
      if (globalSettings.gartenUnterschiedlich) {
        const gartenGruppen = gruppiereNachWert('garten');
        Object.entries(gartenGruppen).forEach(([typ, apartmentNummern]) => {
          if (typ === 'gemeinschaft') {
            output += `Apartments with shared garden access: ${formatWohnungsListe(apartmentNummern)}\n`;
          } else if (typ === 'privat') {
            output += `Apartments with private garden: ${formatWohnungsListe(apartmentNummern)}\n`;
          } else {
            output += `Apartments without garden access: ${formatWohnungsListe(apartmentNummern)}\n`;
          }
        });
      } else {
        const alleNummern = wohnungen.map(w => w.nummer);
        if (globalSettings.gartenGlobal === 'gemeinschaft') {
          output += `All apartments have shared garden access: ${formatWohnungsListe(alleNummern)}\n`;
        } else if (globalSettings.gartenGlobal === 'privat') {
          output += `All apartments have private garden: ${formatWohnungsListe(alleNummern)}\n`;
        } else {
          output += `No garden access for any apartments: ${formatWohnungsListe(alleNummern)}\n`;
        }
      }
      
      output += `
### b) Garden Rules
- Please keep the garden clean and tidy
- Respect plants and outdoor furniture
- Quiet hours also apply to outdoor areas
- No loud music or parties in garden areas`;
    } else {
      output += `No garden or outdoor areas are available.`;
    }

    output += `

## WiFi & Internet

### a) WiFi Access
WiFi is available in all apartments free of charge.

### b) Usage Guidelines
Please use the internet responsibly and refrain from illegal downloads or streaming that may slow down the connection for other guests.

### c) Password Security
Do not share WiFi passwords with unauthorized persons.

## 🔍 Surveillance & Privacy

### a) Privacy Policy
Data processing is GDPR compliant. All collected data serves exclusively for security, property protection, and compliance with house rules.

${globalSettings.lautstaerkemessung ? `### b) Volume Monitoring
Devices for volume monitoring are installed in the apartments. These serve to monitor compliance with quiet hours and noise protection regulations. The measurement data is stored for ${globalSettings.lautstaerkeSpeicherdauer} days and then automatically deleted.

**Important Note:** Only volume levels are measured, no conversations are recorded.` : ''}

${globalSettings.rauchdetektoren ? `### ${globalSettings.lautstaerkemessung ? 'c' : 'b'}) Smoke Detectors
The apartments are equipped with smoke detectors${globalSettings.rauchdetektor_datenspeicherung ? ', which store alarm events with date and time' : ''}. These serve fire protection and the safety of all guests.` : ''}

${globalSettings.kameras_gemeinschaftsbereiche ? `### ${(globalSettings.lautstaerkemessung ? 1 : 0) + (globalSettings.rauchdetektoren ? 1 : 0) === 2 ? 'd' : (globalSettings.lautstaerkemessung || globalSettings.rauchdetektoren) ? 'c' : 'b'}) Video Surveillance
Surveillance cameras are installed in the following common areas: **${globalSettings.kamera_standorte}**.

**Important Information:**
- No private or residential areas are monitored
- Recordings serve security and property protection
- Storage period according to legal requirements
- Recordings can be viewed with legitimate interest` : ''}

### ${['b', 'c', 'd', 'e'][(globalSettings.lautstaerkemessung ? 1 : 0) + (globalSettings.rauchdetektoren ? 1 : 0) + (globalSettings.kameras_gemeinschaftsbereiche ? 1 : 0)]}) Data Protection Rights
Guests have the right to information, correction, and deletion of their personal data according to GDPR. For questions about data protection, please contact the landlord.

## 🛠️ Damages & Theft

### a) Damage Reporting
All damages, defects, or problems must be reported **immediately** to the landlord. This includes minor damages such as clogged drains, defective appliances, or damaged furnishings.

**Damage reports via WhatsApp:** ${einheitlicheRegeln.whatsappNummer}

### b) Liability for Damages
Guests are fully liable for all damages caused during their stay. This includes repair costs, replacement procurement, and any necessary special cleaning.

### c) Theft and Vandalism
In case of theft or willful damage, replacement costs, repair costs, and lost rental income will be charged.

### d) Loss of Keys
In case of key loss, costs for locksmith services, lock changes, and new keys will be charged. Keys must not be left unattended.

## 🆘 Emergency Information

### a) Emergency Contact
In case of an emergency, you can reach the landlord as follows:

**Name:** ${einheitlicheRegeln.vermieeterName}
**Phone:** ${einheitlicheRegeln.vermieterTelefon}

## ⚖️ Contract Penalties and Consequences

In case of violations of the house rules, the following measures may be taken:

### a) Contract Penalties
- **Smoking in non-smoking apartments:** Contract penalty of €500 for required special cleaning
- **Noise disturbance/parties:** Contract penalty of €500
- **Commercial use without permission:** Contract penalty of €500

### b) Additional Fees
- **Late departure:** Additional fee for exceeding check-out time
- **Unregistered guests:** Additional fee per extra person or immediate termination
- **Improper waste disposal:** Cleaning fee of €50
- **Damage caused by pets:** Additional cleaning fees

### c) Contract Termination
In case of serious violations (theft, significant damage, repeated non-compliance), the landlord reserves the right to immediately terminate the rental agreement and demand evacuation of the apartment.

---

We wish you a pleasant stay and are delighted to welcome you as our guest!

If you have any questions or concerns, please feel free to contact us at any time.

**Your ${einheitlicheRegeln.vermieeterName} Team**
`;

    return output;
  };

  // German House Rules Generator (original)
  const generiereHausregeln = () => {
    let output = `# HAUSORDNUNG

Herzlich willkommen! Wir freuen uns, dass du bei uns zuhause bist. Damit du dich rundum wohlfühlst und auch zukünftige Gäste das können, haben wir ein paar wichtige Punkte für dich zusammengefasst.

## 🕐 An- und Abreise

### a) Check-in
${einheitlicheRegeln.checkinFlexibel ? 
  `Die Anreise ist **jederzeit ab ${einheitlicheRegeln.checkinVon} Uhr** möglich (24/7).` : 
  `Die Anreise erfolgt zwischen **${einheitlicheRegeln.checkinVon} Uhr und ${einheitlicheRegeln.checkinBis} Uhr**.`
}

${einheitlicheRegeln.meldebescheinigungErforderlich ? '**Wichtiger Hinweis:** Ein Check-in ist erst nach vollständiger Ausfüllung der Meldebescheinigung möglich.' : ''}

### b) Check-out
Bei der Abreise bitten wir unsere Gäste, die Unterkunft bis spätestens **${einheitlicheRegeln.checkoutBis} Uhr** freizugeben.

### c) Verspätungen
Bitte halten Sie die vereinbarten Check-in- und Check-out-Zeiten ein.

### d) Check-out Pflichten
${einheitlicheRegeln.checkoutPflichten}

### e) Zusätzliche Personen
Zusätzliche Personen über die ursprünglich angemeldete Anzahl hinaus müssen **sofort** beim Vermieter gemeldet werden.

## 📋 Allgemeine Richtlinien

### a) Rechtliche Grundlage
Die Hausregeln sind an den Mietvertrag gekoppelt und verpflichtend einzuhalten.

### b) Geltungsbereich
Alle Gäste (und Besucher) müssen den Hausregeln und weiteren Anweisungen des Vermieters folgen.

### c) Kinder
${einheitlicheRegeln.kinderGeeignet 
  ? 'Diese Ferienwohnungen sind für Kinder aller Altersgruppen geeignet.' 
  : 'Diese Ferienwohnungen sind nicht für Kinder geeignet.'} Erziehungsberechtigte sind für die Sicherheit und das Verhalten der Kinder jederzeit verantwortlich.

## 🔇 Lärmbelästigung und Nachtruhe

### a) Nachtruhe
In der Zeit von **${einheitlicheRegeln.nachtruheVon} Uhr bis ${einheitlicheRegeln.nachtruheBis} Uhr** gilt Nachtruhe im Gebäude. Zu dieser Zeit gilt es sich ruhig zu verhalten, keinen starken Lärm zu verursachen und auf andere Gäste Rücksicht zu nehmen.

### b) Lärmschutz
Übermäßiger Lärm und Partys sind zu jeder Tages- und Nachtzeit untersagt.

### c) Nachbarschaftsrespekt
Wir bitten unsere Gäste und ihre Besucher um einen respektvollen Umgang mit den Anwohnern und Nachbarn.

## 🚗 Parkmöglichkeiten

### a) Allgemeine Parkregeln
Gäste und ihre Besucher müssen sich an geltende Parkvorschriften halten und die Fahrzeuge und Parkwege der Nachbarn beachten.

### b) Verfügbarkeit
Das Gebäude verfügt über unterschiedliche Parkplatzzuteilungen je Wohnung:

`;

    // Parkplätze basierend auf globalen Einstellungen
    if (globalSettings.parkplaetzeVorhanden) {
      if (globalSettings.parkplaetzeUnterschiedlich) {
        // Unterschiedliche Parkplätze pro Apartment
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
      } else {
        // Alle Apartments haben die gleiche Anzahl Parkplätze
        const anzahl = globalSettings.parkplaetzeGlobal;
        const alleNummern = wohnungen.map(w => w.nummer);
        if (anzahl === 0) {
          output += `- **Keine Parkplätze:** Alle Apartments - Gäste können öffentliche Parkplätze in der Umgebung nutzen\n`;
        } else if (anzahl === 1) {
          output += `- **1 Parkplatz:** Alle Apartments (${formatWohnungsListe(alleNummern)})\n`;
        } else if (anzahl === 2) {
          output += `- **2 Parkplätze:** Alle Apartments (${formatWohnungsListe(alleNummern)})\n`;
        } else {
          output += `- **3+ Parkplätze:** Alle Apartments (${formatWohnungsListe(alleNummern)})\n`;
        }
      }
    } else {
      // Keine Parkplätze verfügbar
      output += `- **Keine Parkplätze verfügbar** - Gäste können öffentliche Parkplätze in der Umgebung nutzen\n`;
    }

    // Parkgebühren wenn kostenpflichtig
    if (globalSettings.parkplaetzeVorhanden && globalSettings.parkplaetzeKostenpflichtig) {
      output += `\n### c) Parkgebühren
`;
      if (globalSettings.parkplatzgebuehrUnterschiedlich) {
        // Unterschiedliche Gebühren pro Apartment
        const gebuehrGruppen = gruppiereNachWert('parkplatzgebuehr');
        output += `Die Parkgebühren variieren je nach Apartment:\n\n`;
        Object.entries(gebuehrGruppen).forEach(([gebuehr, nummern]) => {
          output += `- **${gebuehr}€ pro Tag:** Apartment ${formatWohnungsListe(nummern)}\n`;
        });
      } else {
        // Einheitliche Gebühr für alle
        output += `Für alle Apartments gilt eine einheitliche Parkgebühr von **${globalSettings.parkplatzgebuehrGlobal}€ pro Tag**.\n`;
      }
      output += `\nDie Parkgebühren sind bei der Ankunft oder im Voraus zu entrichten.\n`;
    }

    // Pool-Bereich basierend auf globalen Einstellungen
    if (globalSettings.poolVorhanden) {
      output += `\n## Pool

### a) Verfügbarkeit
`;
      
      if (globalSettings.poolUnterschiedlich) {
        // Unterschiedlicher Pool-Zugang pro Apartment
        const poolGruppen = gruppiereNachWert('pool');
        output += `Nur bestimmte Wohnungen in diesem Gebäude haben Zugang zum Pool:

`;
        if (poolGruppen.true && poolGruppen.true.length > 0) {
          output += `- **Pool-Zugang:** Apartment ${formatWohnungsListe(poolGruppen.true)}\n`;
        }
        if (poolGruppen.false && poolGruppen.false.length > 0) {
          output += `- **Kein Pool-Zugang:** Apartment ${formatWohnungsListe(poolGruppen.false)}\n`;
        }
      } else {
        // Alle Apartments haben den gleichen Pool-Zugang
        const alleNummern = wohnungen.map(w => w.nummer);
        if (globalSettings.poolGlobal) {
          output += `Alle Apartments haben Zugang zum Pool: ${formatWohnungsListe(alleNummern)}\n`;
        } else {
          output += `Keine Apartments haben Pool-Zugang: ${formatWohnungsListe(alleNummern)}\n`;
        }
      }

      output += `\n### b) Nutzungszeiten (für berechtigte Wohnungen)
Der Pool darf nur in der Zeit von **08:00 Uhr bis 22:00 Uhr** benutzt werden.

### c) Sicherheitsregeln
Aus Sicherheitsgründen ist es nicht erlaubt, Gläser in oder um den Poolbereich herum zu benutzen. Die Nichteinhaltung dieser Regel führt zu einer Geldbuße.

### d) Hygiene
Bitte duschen Sie sich, bevor Sie den Pool betreten.

`;
    }

    // Garten-Bereich basierend auf globalen Einstellungen
    if (globalSettings.gemeinschaftsgartenVorhanden || globalSettings.privatgartenVorhanden) {
      output += `## 🌳 Garten & Außenbereiche

### a) Gartenverfügbarkeit
`;

      if (globalSettings.gartenUnterschiedlich) {
        // Unterschiedlicher Garten-Zugang pro Apartment
        const gartenGruppen = gruppiereNachWert('garten');
        output += `Die Wohnungen in diesem Gebäude haben unterschiedliche Gartenzugänge:

`;
        
        if (globalSettings.gemeinschaftsgartenVorhanden && gartenGruppen.gemeinschaft && gartenGruppen.gemeinschaft.length > 0) {
          output += `- **Gemeinschaftsgarten:** Apartment ${formatWohnungsListe(gartenGruppen.gemeinschaft)}\n`;
        }
        
        if (globalSettings.privatgartenVorhanden && gartenGruppen.privat && gartenGruppen.privat.length > 0) {
          output += `- **Privater Garten:** Apartment ${formatWohnungsListe(gartenGruppen.privat)}\n`;
        }
        
        if (gartenGruppen.keiner && gartenGruppen.keiner.length > 0) {
          output += `- **Kein Garten:** Apartment ${formatWohnungsListe(gartenGruppen.keiner)}\n`;
        }
      } else {
        // Alle Apartments haben den gleichen Garten-Zugang
        const alleNummern = wohnungen.map(w => w.nummer);
        if (globalSettings.gartenGlobal === 'gemeinschaft') {
          output += `Alle Apartments haben Zugang zum Gemeinschaftsgarten: ${formatWohnungsListe(alleNummern)}\n`;
        } else if (globalSettings.gartenGlobal === 'privat') {
          output += `Alle Apartments haben einen privaten Garten: ${formatWohnungsListe(alleNummern)}\n`;
        } else {
          output += `Keine Apartments haben Garten-Zugang: ${formatWohnungsListe(alleNummern)}\n`;
        }
      }

      // Regeln für Gemeinschaftsgarten
      const hasGemeinschaftsgarten = globalSettings.gemeinschaftsgartenVorhanden && 
        ((!globalSettings.gartenUnterschiedlich && globalSettings.gartenGlobal === 'gemeinschaft') ||
         (globalSettings.gartenUnterschiedlich && Object.values(variableRegeln.garten).includes('gemeinschaft')));

      if (hasGemeinschaftsgarten) {
        output += `\n### b) Regeln für Gemeinschaftsgarten
- Nutzungszeiten: 07:00 bis 22:00 Uhr
- Keine Änderungen an der Bepflanzung
- Kinder müssen beaufsichtigt werden
- Grillen nur nach Absprache

`;
      }

      // Regeln für private Gärten
      const hasPrivatgarten = globalSettings.privatgartenVorhanden && 
        ((!globalSettings.gartenUnterschiedlich && globalSettings.gartenGlobal === 'privat') ||
         (globalSettings.gartenUnterschiedlich && Object.values(variableRegeln.garten).includes('privat')));

      if (hasPrivatgarten) {
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
Das Rauchen ist ${einheitlicheRegeln.rauchenErlaubt ? 'in den Ferienwohnungen erlaubt' : 'in den Ferienwohnungen nicht erlaubt'}${!einheitlicheRegeln.rauchenErlaubt && einheitlicheRegeln.rauchenBalkonErlaubt ? ', jedoch auf Balkonen/Terrassen gestattet' : ''}.

### b) Entsorgung
Zigarettenstummel müssen ordnungsgemäß entsorgt werden und dürfen nicht auf das Grundstück geworfen werden.

## 🐕 Haustiere

### a) Haustierregeln
Haustiere sind ${einheitlicheRegeln.haustiereErlaubt ? 'in den Ferienwohnungen erlaubt' : 'in den Ferienwohnungen nicht erlaubt'}.

${einheitlicheRegeln.haustiereErlaubt ? `### b) Regeln für Haustiere
- Haustiere müssen jederzeit beaufsichtigt werden
- Schäden durch Haustiere gehen zu Lasten des Gastes

### c) Besondere Hunderegeln
- Hunde dürfen nicht im Bett oder auf der Couch aufgehalten werden

### d) Hundegebühren
${globalSettings.hundegebuehrUnterschiedlich ? 
  'Die Hundegebühren variieren je nach Apartment:\n\n' + 
  Object.entries(gruppiereNachWert('hundegebuehr')).map(([gebuehr, nummern]) => 
    `- **${gebuehr}€ pro Aufenthalt:** Apartment ${formatWohnungsListe(nummern)}`
  ).join('\n') :
  `Für alle Apartments gilt eine einheitliche Hundegebühr von **${globalSettings.hundegebuehrGlobal}€ pro Aufenthalt**.`
}

**Ausnahme Assistenzhunde:** Zertifizierte Assistenzhunde (Blindenführhunde, Servicehunde, etc.) sind von der Hundegebühr befreit. Ein entsprechender Nachweis ist bei der Buchung oder Anreise vorzulegen. Assistenzhunde müssen dennoch die allgemeinen Hunderegeln befolgen.` : ''}

## 🚫 Gewerbliche Nutzung

### a) Nutzungsart
Die Ferienwohnungen sind ausschließlich für private Nutzung bestimmt. Jegliche gewerbliche Nutzung ist untersagt.

**Homeoffice/Remote Work:** Die private berufliche Tätigkeit im Homeoffice ist selbstverständlich gestattet und fällt unter die erlaubte private Nutzung.

### b) Foto- und Videoproduktionen
Fotoshootings, Videodrehs oder ähnliche kommerzielle Produktionen sind nur mit ausdrücklicher vorheriger schriftlicher Genehmigung des Vermieters gestattet.

### c) Verbotene Aktivitäten
Prostitution und damit verbundene Aktivitäten sind in den Räumlichkeiten strengstens verboten.

## 📶 WLAN

### a) Nutzungsbedingungen
Den Gästen wird kostenfreier WLAN-Zugang zur Verfügung gestellt. Die Nutzung unterliegt einer Fair Use Policy für angemessene private Nutzung.

### b) Verbotene Aktivitäten
- Illegale Downloads und Streaming von urheberrechtlich geschütztem Material sind strengstens untersagt
- Filesharing, Torrents und P2P-Aktivitäten sind nicht gestattet
- Jegliche rechtswidrige Internetnutzung ist verboten

### c) Haftung
Der Gast haftet vollumfänglich für alle Kosten, Schäden und rechtlichen Konsequenzen, die durch Rechtsverstöße bei der Internetnutzung entstehen. Dies umfasst Abmahngebühren, Anwaltskosten und Schadensersatzforderungen.

## 🔍 Überwachung & Datenschutz

### a) Datenschutzerklärung
Die Datenverarbeitung erfolgt DSGVO-konform. Alle erhobenen Daten dienen ausschließlich der Sicherheit, dem Schutz des Eigentums und der Einhaltung der Hausordnung.

${globalSettings.lautstaerkemessung ? `### b) Lautstärkemessung
In den Wohnungen sind Geräte zur Lautstärkemessung installiert. Diese dienen der Überwachung der Einhaltung der Nachtruhe und Lärmschutzbestimmungen. Die Messdaten werden für ${globalSettings.lautstaerkeSpeicherdauer} Tage gespeichert und anschließend automatisch gelöscht.

**Wichtiger Hinweis:** Es werden nur Lautstärkepegel gemessen, keine Gespräche aufgezeichnet.` : ''}

${globalSettings.rauchdetektoren ? `### ${globalSettings.lautstaerkemessung ? 'c' : 'b'}) Rauchdetektoren
Die Wohnungen sind mit Rauchdetektoren ausgestattet${globalSettings.rauchdetektor_datenspeicherung ? ', die Alarmereignisse mit Datum und Uhrzeit speichern' : ''}. Diese dienen dem Brandschutz und der Sicherheit aller Gäste.` : ''}

${globalSettings.kameras_gemeinschaftsbereiche ? `### ${(globalSettings.lautstaerkemessung ? 1 : 0) + (globalSettings.rauchdetektoren ? 1 : 0) === 2 ? 'd' : (globalSettings.lautstaerkemessung || globalSettings.rauchdetektoren) ? 'c' : 'b'}) Videoüberwachung
In folgenden Gemeinschaftsbereichen sind Überwachungskameras installiert: **${globalSettings.kamera_standorte}**.

**Wichtige Hinweise:**
- Es werden keine Privat- oder Wohnräume überwacht
- Die Aufzeichnungen dienen der Sicherheit und dem Schutz des Eigentums
- Aufbewahrungsdauer gemäß gesetzlichen Bestimmungen
- Bei berechtigtem Interesse können Aufnahmen eingesehen werden` : ''}

### ${['b', 'c', 'd', 'e'][(globalSettings.lautstaerkemessung ? 1 : 0) + (globalSettings.rauchdetektoren ? 1 : 0) + (globalSettings.kameras_gemeinschaftsbereiche ? 1 : 0)]}) Datenschutzrechte
Gäste haben das Recht auf Auskunft, Berichtigung und Löschung ihrer personenbezogenen Daten gemäß DSGVO. Bei Fragen zum Datenschutz wenden Sie sich bitte an den Vermieter.

## 🛠️ Schäden & Diebstahl

### a) Schadensmeldung
Alle Schäden, Defekte oder Mängel müssen **sofort** dem Vermieter gemeldet werden. Dies umfasst auch kleinere Schäden wie verstopfte Abflüsse, defekte Geräte oder beschädigte Einrichtungsgegenstände.

**Schadensmeldungen per WhatsApp:** ${einheitlicheRegeln.whatsappNummer}

### b) Haftung für Schäden
Gäste haften vollumfänglich für alle während ihres Aufenthalts verursachten Schäden. Dies umfasst Reparaturkosten, Ersatzbeschaffung und eventuell notwendige Sonderreinigungen.

### c) Diebstahl und Vandalismus
Bei Diebstahl oder mutwilliger Beschädigung werden Wiederbeschaffungskosten, Reparaturkosten und entgangene Mieteinnahmen in Rechnung gestellt.

### d) Vertraulichkeit von Schlüsseln und Zugangscodes
Schlüssel und Zugangscodes sind streng vertraulich zu behandeln und dürfen unter keinen Umständen an Dritte weitergegeben werden. Dies gilt auch für Familienmitglieder, Freunde oder andere Gäste, die nicht im Mietvertrag aufgeführt sind.

### e) Verlust von Schlüsseln
Bei Schlüsselverlust werden Kosten für Schlüsseldienst, Schlosswechsel und neue Schlüssel dem Gast in Rechnung gestellt. Schlüssel dürfen nicht unbeaufsichtigt gelassen werden.

## 🆘 Notfallinformationen

### a) Notfallkontakt
Im Falle eines Notfalls können Sie den Vermieter wie folgt erreichen:

**Name:** ${einheitlicheRegeln.vermieeterName}
**Telefon:** ${einheitlicheRegeln.vermieterTelefon}

## ⚖️ Vertragsstrafen und Konsequenzen

Bei Verstößen gegen die Hausordnung können folgende Maßnahmen ergriffen werden:

### a) Vertragsstrafen
- **Rauchen in Nichtraucherwohnungen:** Vertragsstrafe von 500€ für die erforderliche Sonderreinigung
- **Lärmbelästigung/Partys:** Vertragsstrafe von 500€
- **Gewerbliche Nutzung ohne Genehmigung:** Vertragsstrafe von 500€

### b) Zusätzliche Gebühren
- **Verspätete Abreise:** Aufpreis bei Überschreitung der Check-out-Zeit
- **Nicht angemeldete Gäste:** Aufpreis pro zusätzlicher Person oder sofortige Kündigung
- **Unsachgemäße Müllentsorgung:** Reinigungsgebühr von 50€
- **Schäden durch Haustiere:** Zusätzliche Reinigungsgebühren

### c) Vertragskündigung
Bei schwerwiegenden Verstößen (Diebstahl, erhebliche Schäden, wiederholte Nichteinhaltung) behält sich der Vermieter das Recht vor, den Mietvertrag sofort zu kündigen und die Räumung der Wohnung zu verlangen.

---

Wir wünschen Ihnen einen angenehmen Aufenthalt und freuen uns, Sie als Gast begrüßen zu dürfen!

Bei Fragen oder Anliegen stehen wir Ihnen jederzeit gerne zur Verfügung.

**Ihr ${einheitlicheRegeln.vermieeterName} Team**
`;

    return output;
  };

  // PDF-Export-Funktion
  const exportPDF = () => {
    const doc = new jsPDF();
    
    // PDF-Konfiguration
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const maxLineWidth = pageWidth - (margin * 2);
    let currentY = margin;
    
    // Hausregeln-Text generieren based on selected language
    const hausregelnText = language === 'en' ? generateHouseRulesEN() : generiereHausregeln();
    
    // Emojis komplett entfernen
    const emojisToRemove = ['📋', '🔇', '🚗', '🌊', '🌳', '🚭', '🐕', '🚫', '📶', '🔍', '💥', '🕐', '🆘', '✅', '🛠️'];
    
    // Text bereinigen und Emojis entfernen
    let cleanText = hausregelnText;
    emojisToRemove.forEach(emoji => {
      cleanText = cleanText.replaceAll(emoji, '');
    });
    
    // Markdown-ähnliche Formatierung entfernen und in PDF umwandeln
    const lines = cleanText.split('\n');
    let skipFirstTitle = true; // Ersten Titel überspringen da wir ihn manuell setzen
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      
      // Ersten Titel überspringen
      if (skipFirstTitle && (line.startsWith('# HAUSORDNUNG') || line.startsWith('# HOUSE RULES'))) {
        skipFirstTitle = false;
        
        // Titel manuell setzen (mittig) - depends on language
        const title = language === 'en' ? 'HOUSE RULES' : 'HAUSORDNUNG';
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        const titleWidth = doc.getTextWidth(title);
        const titleX = (pageWidth - titleWidth) / 2;
        doc.text(title, titleX, currentY);
        currentY += 15;
        continue;
      }
      
      // Neue Seite beginnen wenn nötig
      if (currentY > pageHeight - 40) {
        doc.addPage();
        currentY = margin;
      }
      
      // Überschriften formatieren
      if (line.startsWith('# ')) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        line = line.replace('# ', '');
        currentY += 3;
      } else if (line.startsWith('## ')) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        line = line.replace('## ', '');
        currentY += 2;
      } else if (line.startsWith('### ')) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        line = line.replace('### ', '');
        currentY += 1;
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
      }
      
      // Fettschrift für **text** entfernen
      line = line.replace(/\*\*(.*?)\*\*/g, '$1');
      
      // Leere Zeilen
      if (line.trim() === '') {
        currentY += 2;
        continue;
      }
      
      // Text umbrechen wenn zu lang
      const splitText = doc.splitTextToSize(line, maxLineWidth);
      
      for (let j = 0; j < splitText.length; j++) {
        if (currentY > pageHeight - 20) {
          doc.addPage();
          currentY = margin;
        }
        
        doc.text(splitText[j], margin, currentY);
        currentY += 4;
      }
      
      // Minimaler Abstand zwischen Zeilen
      currentY += 1;
    }
    
    // PDF speichern
    const baseFileName = language === 'en' ? 'House_Rules' : 'Hausregeln';
    const apartmentText = language === 'en' ? 'Apartments' : 'Wohnungen';
    const fileName = `${baseFileName}_${wohnungen.length}_${apartmentText}_${new Date().toLocaleDateString('de-DE').replace(/\./g, '-')}.pdf`;
    doc.save(fileName);
  };

  // Update-Funktionen
  const updateEinheitlich = (key, value) => {
    setEinheitlicheRegeln(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateGlobalSetting = (key, value) => {
    setGlobalSettings(prev => ({
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
                {sortWohnungen(wohnungen).map((wohnung) => (
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
                    Rauchen in der Wohnung:
                  </label>
                  <select
                    value={einheitlicheRegeln.rauchenErlaubt}
                    onChange={(e) => updateEinheitlich('rauchenErlaubt', e.target.value === 'true')}
                    style={{ 
                      padding: '8px 12px', 
                      border: `1px solid ${styles.secondary}`, 
                      borderRadius: '4px',
                      width: '100%',
                      marginBottom: '8px'
                    }}
                  >
                    <option value="false">Nein, Rauchverbot</option>
                    <option value="true">Ja, Rauchen erlaubt</option>
                  </select>
                  
                  {!einheitlicheRegeln.rauchenErlaubt && (
                    <div>
                      <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px', fontSize: '14px' }}>
                        Rauchen auf Balkon/Terrasse:
                      </label>
                      <select
                        value={einheitlicheRegeln.rauchenBalkonErlaubt}
                        onChange={(e) => updateEinheitlich('rauchenBalkonErlaubt', e.target.value === 'true')}
                        style={{ 
                          padding: '6px 8px', 
                          border: `1px solid ${styles.secondary}`, 
                          borderRadius: '4px',
                          width: '100%',
                          fontSize: '14px'
                        }}
                      >
                        <option value="false">Nein, auch auf Balkon verboten</option>
                        <option value="true">Ja, auf Balkon/Terrasse erlaubt</option>
                      </select>
                    </div>
                  )}
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

                {/* Hundegebühren - nur wenn Haustiere erlaubt */}
                {einheitlicheRegeln.haustiereErlaubt && (
                  <div style={{
                    backgroundColor: '#FFF8DC',
                    padding: '16px',
                    borderRadius: '6px',
                    border: `1px solid ${styles.secondary}`,
                    gridColumn: 'span 2'
                  }}>
                    <h4 style={{ margin: '0 0 12px 0', color: styles.dark }}>🐕 Hundegebühren</h4>
                    
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={globalSettings.hundegebuehrUnterschiedlich}
                          onChange={(e) => updateGlobalSetting('hundegebuehrUnterschiedlich', e.target.checked)}
                          style={{ marginRight: '8px' }}
                        />
                        <span>Unterschiedliche Hundegebühren pro Apartment</span>
                      </label>
                    </div>

                    {!globalSettings.hundegebuehrUnterschiedlich && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span>Hundegebühr für alle Apartments:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input
                            type="number"
                            value={globalSettings.hundegebuehrGlobal}
                            onChange={(e) => updateGlobalSetting('hundegebuehrGlobal', parseInt(e.target.value) || 0)}
                            style={{ 
                              padding: '4px 8px', 
                              border: `1px solid ${styles.secondary}`, 
                              borderRadius: '4px',
                              width: '80px'
                            }}
                            min="0"
                          />
                          <span>€ pro Aufenthalt</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Überwachung & Datenschutz */}
                <div style={{
                  backgroundColor: '#FFF0F5',
                  padding: '16px',
                  borderRadius: '6px',
                  border: `1px solid ${styles.secondary}`,
                  gridColumn: 'span 2',
                  marginTop: '16px'
                }}>
                  <h4 style={{ margin: '0 0 16px 0', color: styles.dark }}>🔍 Überwachung & Datenschutz</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    {/* Lautstärkemessung */}
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '8px' }}>
                        <input
                          type="checkbox"
                          checked={globalSettings.lautstaerkemessung}
                          onChange={(e) => updateGlobalSetting('lautstaerkemessung', e.target.checked)}
                          style={{ marginRight: '8px' }}
                        />
                        <span style={{ fontWeight: '600' }}>Lautstärkemessung in Wohnungen</span>
                      </label>
                      {globalSettings.lautstaerkemessung && (
                        <div style={{ marginLeft: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>Speicherdauer:</span>
                          <input
                            type="number"
                            value={globalSettings.lautstaerkeSpeicherdauer}
                            onChange={(e) => updateGlobalSetting('lautstaerkeSpeicherdauer', parseInt(e.target.value) || 30)}
                            style={{ 
                              padding: '4px 8px', 
                              border: `1px solid ${styles.secondary}`, 
                              borderRadius: '4px',
                              width: '60px'
                            }}
                            min="1"
                            max="365"
                          />
                          <span>Tage</span>
                        </div>
                      )}
                    </div>

                    {/* Rauchdetektoren */}
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '8px' }}>
                        <input
                          type="checkbox"
                          checked={globalSettings.rauchdetektoren}
                          onChange={(e) => updateGlobalSetting('rauchdetektoren', e.target.checked)}
                          style={{ marginRight: '8px' }}
                        />
                        <span style={{ fontWeight: '600' }}>Rauchdetektoren</span>
                      </label>
                      {globalSettings.rauchdetektoren && (
                        <div style={{ marginLeft: '24px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={globalSettings.rauchdetektor_datenspeicherung}
                              onChange={(e) => updateGlobalSetting('rauchdetektor_datenspeicherung', e.target.checked)}
                              style={{ marginRight: '8px' }}
                            />
                            <span>Mit Datenspeicherung</span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Kameras */}
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '12px' }}>
                      <input
                        type="checkbox"
                        checked={globalSettings.kameras_gemeinschaftsbereiche}
                        onChange={(e) => updateGlobalSetting('kameras_gemeinschaftsbereiche', e.target.checked)}
                        style={{ marginRight: '8px' }}
                      />
                      <span style={{ fontWeight: '600' }}>Kameras in Gemeinschaftsbereichen</span>
                    </label>
                    {globalSettings.kameras_gemeinschaftsbereiche && (
                      <div style={{ marginLeft: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Standorte:</label>
                        <textarea
                          value={globalSettings.kamera_standorte}
                          onChange={(e) => updateGlobalSetting('kamera_standorte', e.target.value)}
                          placeholder="z.B. Eingangsbereiche, Flure, Gemeinschaftsgarten, Poolbereich"
                          style={{ 
                            padding: '8px', 
                            border: `1px solid ${styles.secondary}`, 
                            borderRadius: '4px',
                            width: '100%',
                            minHeight: '60px',
                            resize: 'vertical'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Check-in & Check-out Zeiten */}
                <div style={{
                  backgroundColor: '#E8F5E8',
                  padding: '16px',
                  borderRadius: '6px',
                  border: `1px solid ${styles.secondary}`,
                  gridColumn: 'span 2',
                  marginTop: '16px'
                }}>
                  <h4 style={{ margin: '0 0 16px 0', color: styles.dark }}>🕐 Check-in & Check-out Zeiten</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    {/* Check-in Von */}
                    <div>
                      <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>
                        Check-in ab:
                      </label>
                      <input
                        type="time"
                        value={einheitlicheRegeln.checkinVon}
                        onChange={(e) => updateEinheitlich('checkinVon', e.target.value)}
                        style={{ 
                          padding: '8px', 
                          border: `1px solid ${styles.secondary}`, 
                          borderRadius: '4px',
                          width: '100%'
                        }}
                      />
                    </div>
                    
                    {/* Check-in Bis */}
                    <div>
                      <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>
                        Check-in bis:
                      </label>
                      <input
                        type="time"
                        value={einheitlicheRegeln.checkinBis}
                        onChange={(e) => updateEinheitlich('checkinBis', e.target.value)}
                        style={{ 
                          padding: '8px', 
                          border: `1px solid ${styles.secondary}`, 
                          borderRadius: '4px',
                          width: '100%'
                        }}
                      />
                    </div>
                    
                    {/* Check-out Bis */}
                    <div>
                      <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>
                        Check-out bis:
                      </label>
                      <input
                        type="time"
                        value={einheitlicheRegeln.checkoutBis}
                        onChange={(e) => updateEinheitlich('checkoutBis', e.target.value)}
                        style={{ 
                          padding: '8px', 
                          border: `1px solid ${styles.secondary}`, 
                          borderRadius: '4px',
                          width: '100%'
                        }}
                      />
                    </div>
                  </div>

                  {/* Flexible Check-in Option */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '8px' }}>
                      <input
                        type="checkbox"
                        checked={einheitlicheRegeln.checkinFlexibel}
                        onChange={(e) => updateEinheitlich('checkinFlexibel', e.target.checked)}
                        style={{ marginRight: '8px' }}
                      />
                      <span style={{ fontWeight: '500' }}>Flexibler Check-in (24/7 nach Check-in-Zeit)</span>
                    </label>
                    <div style={{ 
                      marginLeft: '24px',
                      fontSize: '12px',
                      color: styles.secondary,
                      fontStyle: 'italic'
                    }}>
                      💡 Wenn aktiviert: Nach der ersten Check-in-Zeit kann 24/7 eingecheckt werden
                    </div>
                  </div>

                  {/* Meldebescheinigung erforderlich */}
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '8px' }}>
                      <input
                        type="checkbox"
                        checked={einheitlicheRegeln.meldebescheinigungErforderlich}
                        onChange={(e) => updateEinheitlich('meldebescheinigungErforderlich', e.target.checked)}
                        style={{ marginRight: '8px' }}
                      />
                      <span style={{ fontWeight: '500' }}>Meldebescheinigung vor Check-in erforderlich</span>
                    </label>
                    <div style={{ 
                      marginLeft: '24px',
                      fontSize: '12px',
                      color: styles.secondary,
                      fontStyle: 'italic'
                    }}>
                      💡 Check-in ist erst nach ausgefüllter Meldebescheinigung möglich
                    </div>
                  </div>
                </div>

                {/* Check-out Pflichten */}
                <div style={{
                  backgroundColor: '#F0F8FF',
                  padding: '16px',
                  borderRadius: '6px',
                  border: `1px solid ${styles.secondary}`,
                  gridColumn: 'span 2',
                  marginTop: '16px'
                }}>
                  <h4 style={{ margin: '0 0 12px 0', color: styles.dark }}>🕐 Check-out Pflichten</h4>
                  
                  {/* Language Switch Buttons */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <button
                      onClick={() => setLanguage('de')}
                      style={{
                        padding: '6px 12px',
                        border: `1px solid ${styles.secondary}`,
                        borderRadius: '4px',
                        backgroundColor: language === 'de' ? styles.primary : 'white',
                        color: language === 'de' ? 'white' : styles.dark,
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      🇩🇪 Deutsch
                    </button>
                    <button
                      onClick={() => setLanguage('en')}
                      style={{
                        padding: '6px 12px',
                        border: `1px solid ${styles.secondary}`,
                        borderRadius: '4px',
                        backgroundColor: language === 'en' ? styles.primary : 'white',
                        color: language === 'en' ? 'white' : styles.dark,
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      🇬🇧 English
                    </button>
                  </div>
                  
                  {/* Dynamic Language Content */}
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>
                    {language === 'de' 
                      ? 'Pflichten bei der Abreise (dieser Text erscheint in den deutschen Hausregeln):' 
                      : 'Check-out Duties (this text appears in the English house rules):'}
                  </label>
                  <textarea
                    value={language === 'de' ? einheitlicheRegeln.checkoutPflichten : einheitlicheRegeln.checkoutPflichten_en}
                    onChange={(e) => updateEinheitlich(language === 'de' ? 'checkoutPflichten' : 'checkoutPflichten_en', e.target.value)}
                    placeholder={language === 'de' 
                      ? "Beschreiben Sie hier die Pflichten der Gäste bei der Abreise..." 
                      : "Describe the guests' duties upon departure..."}
                    style={{ 
                      padding: '12px', 
                      border: `1px solid ${styles.secondary}`, 
                      borderRadius: '4px',
                      width: '100%',
                      minHeight: '120px',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      fontSize: '14px',
                      lineHeight: '1.4'
                    }}
                  />
                  <div style={{ 
                    marginTop: '8px', 
                    fontSize: '12px', 
                    color: styles.secondary,
                    fontStyle: 'italic'
                  }}>
                    💡 Tipp: Die Texte werden automatisch mit der Check-out Zeit ({einheitlicheRegeln.checkoutBis} Uhr) verknüpft
                  </div>
                </div>

                {/* Kontaktdaten */}
                <div style={{
                  backgroundColor: '#F0F8FF',
                  padding: '16px',
                  borderRadius: '6px',
                  border: `1px solid ${styles.secondary}`,
                  gridColumn: 'span 2',
                  marginTop: '16px'
                }}>
                  <h4 style={{ margin: '0 0 12px 0', color: styles.dark }}>📞 Kontaktdaten</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>
                        Vermieter Name:
                      </label>
                      <input
                        type="text"
                        value={einheitlicheRegeln.vermieeterName}
                        onChange={(e) => updateEinheitlich('vermieeterName', e.target.value)}
                        placeholder="z.B. LikeHome Service"
                        style={{ 
                          padding: '12px', 
                          border: `1px solid ${styles.secondary}`, 
                          borderRadius: '4px',
                          width: '100%',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>
                        📱 WhatsApp (Schäden):
                      </label>
                      <input
                        type="text"
                        value={einheitlicheRegeln.whatsappNummer}
                        onChange={(e) => updateEinheitlich('whatsappNummer', e.target.value)}
                        placeholder="z.B. +49 123 456789"
                        style={{ 
                          padding: '12px', 
                          border: `1px solid ${styles.secondary}`, 
                          borderRadius: '4px',
                          width: '100%',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>
                        🚨 Notfall-Telefon:
                      </label>
                      <input
                        type="text"
                        value={einheitlicheRegeln.vermieterTelefon}
                        onChange={(e) => updateEinheitlich('vermieterTelefon', e.target.value)}
                        placeholder="z.B. +49 123 456789"
                        style={{ 
                          padding: '12px', 
                          border: `1px solid ${styles.secondary}`, 
                          borderRadius: '4px',
                          width: '100%',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>
                  
                  <div style={{ 
                    marginTop: '8px', 
                    fontSize: '12px', 
                    color: styles.secondary,
                    fontStyle: 'italic'
                  }}>
                    💡 WhatsApp für Schadensmeldungen, Telefon nur für echte Notfälle
                  </div>
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

                {/* Global Parking Settings */}
                <div style={{
                  backgroundColor: styles.light,
                  padding: '16px',
                  borderRadius: '6px',
                  marginBottom: '16px'
                }}>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={globalSettings.parkplaetzeVorhanden}
                        onChange={(e) => updateGlobalSetting('parkplaetzeVorhanden', e.target.checked)}
                        style={{ marginRight: '8px' }}
                      />
                      <span style={{ fontWeight: '600' }}>Es gibt Parkplätze</span>
                    </label>
                  </div>

                  {globalSettings.parkplaetzeVorhanden && (
                    <div>
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={globalSettings.parkplaetzeUnterschiedlich}
                            onChange={(e) => updateGlobalSetting('parkplaetzeUnterschiedlich', e.target.checked)}
                            style={{ marginRight: '8px' }}
                          />
                          <span>Unterschiedliche Anzahl pro Apartment</span>
                        </label>
                      </div>

                      {!globalSettings.parkplaetzeUnterschiedlich && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                          <span>Parkplätze für alle Apartments:</span>
                          <select
                            value={globalSettings.parkplaetzeGlobal}
                            onChange={(e) => updateGlobalSetting('parkplaetzeGlobal', parseInt(e.target.value))}
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
                      )}

                      {/* Parkgebühren */}
                      <div style={{ 
                        backgroundColor: '#E8F5FF', 
                        padding: '12px', 
                        borderRadius: '4px',
                        marginTop: '12px'
                      }}>
                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={globalSettings.parkplaetzeKostenpflichtig}
                              onChange={(e) => updateGlobalSetting('parkplaetzeKostenpflichtig', e.target.checked)}
                              style={{ marginRight: '8px' }}
                            />
                            <span style={{ fontWeight: '600' }}>Parkplätze sind kostenpflichtig</span>
                          </label>
                        </div>

                        {globalSettings.parkplaetzeKostenpflichtig && (
                          <div>
                            <div style={{ marginBottom: '12px' }}>
                              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={globalSettings.parkplatzgebuehrUnterschiedlich}
                                  onChange={(e) => updateGlobalSetting('parkplatzgebuehrUnterschiedlich', e.target.checked)}
                                  style={{ marginRight: '8px' }}
                                />
                                <span>Unterschiedliche Gebühren pro Apartment</span>
                              </label>
                            </div>

                            {!globalSettings.parkplatzgebuehrUnterschiedlich && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span>Parkgebühr für alle Apartments:</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <input
                                    type="number"
                                    value={globalSettings.parkplatzgebuehrGlobal}
                                    onChange={(e) => updateGlobalSetting('parkplatzgebuehrGlobal', parseInt(e.target.value) || 0)}
                                    style={{ 
                                      padding: '4px 8px', 
                                      border: `1px solid ${styles.secondary}`, 
                                      borderRadius: '4px',
                                      width: '80px'
                                    }}
                                    min="0"
                                  />
                                  <span>€ pro Tag</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {globalSettings.parkplaetzeVorhanden && globalSettings.parkplaetzeUnterschiedlich && (
                  <div>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                      gap: '12px'
                    }}>
                      {sortWohnungen(wohnungen).map((wohnung) => (
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

                    {/* Parkgebühren pro Apartment */}
                    {globalSettings.parkplaetzeKostenpflichtig && globalSettings.parkplatzgebuehrUnterschiedlich && (
                      <div style={{ marginTop: '16px' }}>
                        <h4 style={{ margin: '0 0 12px 0', color: styles.dark, fontSize: '16px' }}>
                          💰 Parkgebühren pro Apartment
                        </h4>
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                          gap: '12px'
                        }}>
                          {sortWohnungen(wohnungen).map((wohnung) => (
                            <div key={wohnung.id} style={{
                              padding: '12px',
                              backgroundColor: '#E8F5FF',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}>
                              <span style={{ fontWeight: '600' }}>{wohnung.nummer}</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <input
                                  type="number"
                                  value={variableRegeln.parkplatzgebuehr[wohnung.id]}
                                  onChange={(e) => updateVariable('parkplatzgebuehr', wohnung.id, parseInt(e.target.value) || 0)}
                                  style={{ 
                                    padding: '4px 8px', 
                                    border: `1px solid ${styles.secondary}`, 
                                    borderRadius: '4px',
                                    width: '60px'
                                  }}
                                  min="0"
                                />
                                <span style={{ fontSize: '14px' }}>€/Tag</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
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

                {/* Global Pool Settings */}
                <div style={{
                  backgroundColor: styles.light,
                  padding: '16px',
                  borderRadius: '6px',
                  marginBottom: '16px'
                }}>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={globalSettings.poolVorhanden}
                        onChange={(e) => updateGlobalSetting('poolVorhanden', e.target.checked)}
                        style={{ marginRight: '8px' }}
                      />
                      <span style={{ fontWeight: '600' }}>Es gibt einen Pool</span>
                    </label>
                  </div>

                  {globalSettings.poolVorhanden && (
                    <div>
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={globalSettings.poolUnterschiedlich}
                            onChange={(e) => updateGlobalSetting('poolUnterschiedlich', e.target.checked)}
                            style={{ marginRight: '8px' }}
                          />
                          <span>Unterschiedlicher Pool-Zugang pro Apartment</span>
                        </label>
                      </div>

                      {!globalSettings.poolUnterschiedlich && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span>Pool-Zugang für alle Apartments:</span>
                          <select
                            value={globalSettings.poolGlobal}
                            onChange={(e) => updateGlobalSetting('poolGlobal', e.target.value === 'true')}
                            style={{ 
                              padding: '4px 8px', 
                              border: `1px solid ${styles.secondary}`, 
                              borderRadius: '4px'
                            }}
                          >
                            <option value={false}>Kein Pool-Zugang</option>
                            <option value={true}>Pool-Zugang</option>
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {globalSettings.poolVorhanden && globalSettings.poolUnterschiedlich && (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                    gap: '12px'
                  }}>
                    {sortWohnungen(wohnungen).map((wohnung) => (
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
                          <option value={false}>Kein Pool-Zugang</option>
                          <option value={true}>Pool-Zugang</option>
                        </select>
                      </div>
                    ))}
                  </div>
                )}
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

                {/* Global Garden Settings */}
                <div style={{
                  backgroundColor: styles.light,
                  padding: '16px',
                  borderRadius: '6px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={globalSettings.gemeinschaftsgartenVorhanden}
                        onChange={(e) => updateGlobalSetting('gemeinschaftsgartenVorhanden', e.target.checked)}
                        style={{ marginRight: '8px' }}
                      />
                      <span style={{ fontWeight: '600' }}>Es gibt einen Gemeinschaftsgarten</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={globalSettings.privatgartenVorhanden}
                        onChange={(e) => updateGlobalSetting('privatgartenVorhanden', e.target.checked)}
                        style={{ marginRight: '8px' }}
                      />
                      <span style={{ fontWeight: '600' }}>Es gibt private Gärten</span>
                    </label>
                  </div>

                  {(globalSettings.gemeinschaftsgartenVorhanden || globalSettings.privatgartenVorhanden) && (
                    <div>
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={globalSettings.gartenUnterschiedlich}
                            onChange={(e) => updateGlobalSetting('gartenUnterschiedlich', e.target.checked)}
                            style={{ marginRight: '8px' }}
                          />
                          <span>Unterschiedlicher Garten-Zugang pro Apartment</span>
                        </label>
                      </div>

                      {!globalSettings.gartenUnterschiedlich && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span>Garten-Zugang für alle Apartments:</span>
                          <select
                            value={globalSettings.gartenGlobal}
                            onChange={(e) => updateGlobalSetting('gartenGlobal', e.target.value)}
                            style={{ 
                              padding: '4px 8px', 
                              border: `1px solid ${styles.secondary}`, 
                              borderRadius: '4px'
                            }}
                          >
                            <option value="keiner">Kein Garten</option>
                            {globalSettings.gemeinschaftsgartenVorhanden && (
                              <option value="gemeinschaft">Gemeinschaftsgarten</option>
                            )}
                            {globalSettings.privatgartenVorhanden && (
                              <option value="privat">Privater Garten</option>
                            )}
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {(globalSettings.gemeinschaftsgartenVorhanden || globalSettings.privatgartenVorhanden) && globalSettings.gartenUnterschiedlich && (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                    gap: '12px'
                  }}>
                    {sortWohnungen(wohnungen).map((wohnung) => (
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
                          {globalSettings.gemeinschaftsgartenVorhanden && (
                            <option value="gemeinschaft">Gemeinschaftsgarten</option>
                          )}
                          {globalSettings.privatgartenVorhanden && (
                            <option value="privat">Privater Garten</option>
                          )}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Hundegebühren pro Apartment - nur wenn Haustiere erlaubt und unterschiedlich */}
              {einheitlicheRegeln.haustiereErlaubt && globalSettings.hundegebuehrUnterschiedlich && (
                <div style={{ marginTop: '32px' }}>
                  <h3 style={{ 
                    margin: '0 0 16px 0',
                    color: styles.dark,
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    🐕 Hundegebühren pro Apartment
                  </h3>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                    gap: '12px'
                  }}>
                    {sortWohnungen(wohnungen).map((wohnung) => (
                      <div key={wohnung.id} style={{
                        padding: '12px',
                        backgroundColor: styles.light,
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <span style={{ fontWeight: '600' }}>{wohnung.nummer}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input
                            type="number"
                            value={variableRegeln.hundegebuehr[wohnung.id]}
                            onChange={(e) => updateVariable('hundegebuehr', wohnung.id, parseInt(e.target.value) || 0)}
                            style={{ 
                              padding: '4px 8px', 
                              border: `1px solid ${styles.secondary}`, 
                              borderRadius: '4px',
                              width: '80px'
                            }}
                            min="0"
                          />
                          <span style={{ fontSize: '14px' }}>€</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                  {!globalSettings.parkplaetzeVorhanden ? (
                    <div style={{ fontSize: '14px' }}>
                      <strong>Keine Parkplätze verfügbar</strong>
                    </div>
                  ) : !globalSettings.parkplaetzeUnterschiedlich ? (
                    <div style={{ fontSize: '14px' }}>
                      <strong>
                        {globalSettings.parkplaetzeGlobal === 0 ? 'Keine' : 
                         globalSettings.parkplaetzeGlobal === 1 ? '1 Parkplatz' : 
                         globalSettings.parkplaetzeGlobal === 2 ? '2 Parkplätze' : '3+ Parkplätze'}:
                      </strong> Alle Apartments
                      {globalSettings.parkplaetzeKostenpflichtig && (
                        <div style={{ fontSize: '13px', marginTop: '4px', color: styles.secondary }}>
                          💰 {globalSettings.parkplatzgebuehrUnterschiedlich ? 'Unterschiedliche Gebühren' : `${globalSettings.parkplatzgebuehrGlobal}€/Tag`}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {Object.entries(gruppiereNachWert('parkplaetze')).map(([anzahl, nummern]) => (
                        <div key={anzahl} style={{ marginBottom: '4px', fontSize: '14px' }}>
                          <strong>
                            {anzahl === '0' ? 'Keine' : 
                             anzahl === '1' ? '1 Parkplatz' : 
                             anzahl === '2' ? '2 Parkplätze' : '3+ Parkplätze'}:
                          </strong> {formatWohnungsListe(nummern)}
                        </div>
                      ))}
                      {globalSettings.parkplaetzeKostenpflichtig && (
                        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: `1px solid ${styles.light}` }}>
                          <strong style={{ fontSize: '13px' }}>💰 Parkgebühren:</strong>
                          {!globalSettings.parkplatzgebuehrUnterschiedlich ? (
                            <div style={{ fontSize: '13px', marginTop: '4px' }}>
                              {globalSettings.parkplatzgebuehrGlobal}€/Tag für alle
                            </div>
                          ) : (
                            Object.entries(gruppiereNachWert('parkplatzgebuehr')).map(([gebuehr, nummern]) => (
                              <div key={gebuehr} style={{ fontSize: '13px', marginTop: '2px' }}>
                                {gebuehr}€/Tag: {formatWohnungsListe(nummern)}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Pool Gruppierung */}
                <div>
                  <h4 style={{ margin: '0 0 12px 0', color: styles.dark }}>🏊‍♂️ Pool:</h4>
                  {!globalSettings.poolVorhanden ? (
                    <div style={{ fontSize: '14px' }}>
                      <strong>Kein Pool verfügbar</strong>
                    </div>
                  ) : !globalSettings.poolUnterschiedlich ? (
                    <div style={{ fontSize: '14px' }}>
                      <strong>
                        {globalSettings.poolGlobal ? 'Pool-Zugang' : 'Kein Pool-Zugang'}:
                      </strong> Alle Apartments
                    </div>
                  ) : (
                    Object.entries(gruppiereNachWert('pool')).map(([zugang, nummern]) => (
                      <div key={zugang} style={{ marginBottom: '4px', fontSize: '14px' }}>
                        <strong>{zugang === 'true' ? 'Pool-Zugang' : 'Kein Pool'}:</strong> {formatWohnungsListe(nummern)}
                      </div>
                    ))
                  )}
                </div>

                {/* Garten Gruppierung */}
                <div>
                  <h4 style={{ margin: '0 0 12px 0', color: styles.dark }}>🌳 Garten:</h4>
                  {!globalSettings.gemeinschaftsgartenVorhanden && !globalSettings.privatgartenVorhanden ? (
                    <div style={{ fontSize: '14px' }}>
                      <strong>Kein Garten verfügbar</strong>
                    </div>
                  ) : !globalSettings.gartenUnterschiedlich ? (
                    <div style={{ fontSize: '14px' }}>
                      <strong>
                        {globalSettings.gartenGlobal === 'keiner' ? 'Kein Garten' : 
                         globalSettings.gartenGlobal === 'gemeinschaft' ? 'Gemeinschaftsgarten' : 'Privater Garten'}:
                      </strong> Alle Apartments
                    </div>
                  ) : (
                    Object.entries(gruppiereNachWert('garten')).map(([typ, nummern]) => (
                      <div key={typ} style={{ marginBottom: '4px', fontSize: '14px' }}>
                        <strong>
                          {typ === 'keiner' ? 'Kein Garten' : 
                           typ === 'gemeinschaft' ? 'Gemeinschaftsgarten' : 'Privater Garten'}:
                        </strong> {formatWohnungsListe(nummern)}
                      </div>
                    ))
                  )}
                </div>

                {/* Hundegebühren Gruppierung - nur wenn Haustiere erlaubt */}
                {einheitlicheRegeln.haustiereErlaubt && (
                  <div>
                    <h4 style={{ margin: '0 0 12px 0', color: styles.dark }}>🐕 Hundegebühren:</h4>
                    {!globalSettings.hundegebuehrUnterschiedlich ? (
                      <div style={{ fontSize: '14px' }}>
                        <strong>{globalSettings.hundegebuehrGlobal}€:</strong> Alle Apartments
                      </div>
                    ) : (
                      Object.entries(gruppiereNachWert('hundegebuehr')).map(([gebuehr, nummern]) => (
                        <div key={gebuehr} style={{ marginBottom: '4px', fontSize: '14px' }}>
                          <strong>{gebuehr}€:</strong> {formatWohnungsListe(nummern)}
                        </div>
                      ))
                    )}
                  </div>
                )}
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
                📄 {language === 'en' ? 'Final House Rules (Grouped)' : 'Finale Hausregeln (Gruppiert)'}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Language Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: styles.dark }}>
                    🌍 Sprache:
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      border: `1px solid ${styles.secondary}`,
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="de">🇩🇪 Deutsch</option>
                    <option value="en">🇬🇧 English</option>
                  </select>
                </div>
                <button 
                  onClick={exportPDF}
                  style={{
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
                  }}
                >
                  <Download size={20} />
                  PDF Export
                </button>
              </div>
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
              {language === 'en' ? generateHouseRulesEN() : generiereHausregeln()}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default HausregelnGenerator;