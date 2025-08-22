import React, { useState } from 'react';
import { Plus, Minus, RotateCcw, Save } from 'lucide-react';

const CounterApp = () => {
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [name, setName] = useState('');

  const increment = () => {
    setCount(count + 1);
    addToHistory(`+1 (${count} → ${count + 1})`);
  };

  const decrement = () => {
    setCount(count - 1);
    addToHistory(`-1 (${count} → ${count - 1})`);
  };

  const reset = () => {
    setCount(0);
    addToHistory(`Reset (${count} → 0)`);
  };

  const addToHistory = (action) => {
    const timestamp = new Date().toLocaleTimeString();
    setHistory(prev => [...prev.slice(-4), { action, timestamp }]);
  };

  const saveCounter = () => {
    if (!name) {
      alert('Bitte einen Namen eingeben!');
      return;
    }
    
    const data = {
      name,
      count,
      savedAt: new Date().toLocaleString(),
      history
    };
    
    // In einer echten App würde hier eine API-Anfrage stehen
    console.log('Gespeichert:', data);
    alert(`${name}: ${count} wurde gespeichert!`);
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{
      '--forest-green': '#1B2C22',
      '--sage-green': '#95A292',
      '--charcoal': '#151515',
      '--light-gray': '#F6F6F6'
    }}>
      {/* Header */}
      <div className="text-white py-8" style={{ backgroundColor: 'var(--forest-green)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-light text-center">LikeHome Counter App</h1>
          <p className="text-center text-lg opacity-90 mt-2">Einfache Beispiel-Anwendung für Entwicklungsreferenz</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Projekt Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4" style={{ borderColor: 'var(--sage-green)' }}>
          <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--charcoal)' }}>Projekt-Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--charcoal)' }}>
                Projekt-Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z.B. Test-Zähler 1"
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': 'var(--sage-green)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--charcoal)' }}>
                Status
              </label>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-green-700 font-medium">
                  {count === 0 ? 'Bereit' : count > 0 ? 'Positiv' : 'Negativ'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Counter Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--charcoal)' }}>
              Aktueller Zählerstand
            </h2>
            
            {/* Counter Display */}
            <div className="mb-8">
              <div 
                className={`text-6xl font-bold rounded-xl p-6 inline-block min-w-[200px] ${
                  count > 0 ? 'bg-green-50 text-green-600' : 
                  count < 0 ? 'bg-red-50 text-red-600' : 
                  'bg-gray-50 text-gray-600'
                }`}
              >
                {count}
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={decrement}
                className="flex items-center px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                <Minus className="w-5 h-5 mr-2" />
                Verringern
              </button>
              
              <button
                onClick={reset}
                className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </button>
              
              <button
                onClick={increment}
                className="flex items-center px-6 py-3 text-white rounded-lg font-medium transition-colors hover:opacity-90"
                style={{ backgroundColor: 'var(--sage-green)' }}
              >
                <Plus className="w-5 h-5 mr-2" />
                Erhöhen
              </button>
            </div>

            {/* Save Button */}
            <button
              onClick={saveCounter}
              className="flex items-center mx-auto px-8 py-3 text-white rounded-lg font-medium transition-colors hover:opacity-90"
              style={{ backgroundColor: 'var(--forest-green)' }}
            >
              <Save className="w-5 h-5 mr-2" />
              Zählerstand speichern
            </button>
          </div>
        </div>

        {/* History Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--charcoal)' }}>
            Letzte Aktionen
          </h3>
          
          {history.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Noch keine Aktionen durchgeführt</p>
          ) : (
            <div className="space-y-2">
              {history.map((entry, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium" style={{ color: 'var(--charcoal)' }}>
                    {entry.action}
                  </span>
                  <span className="text-sm text-gray-500">
                    {entry.timestamp}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Technical Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Technische Details</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Framework:</strong> React 18 mit Hooks</p>
            <p><strong>Styling:</strong> Tailwind CSS + LikeHome Farbschema</p>
            <p><strong>Icons:</strong> Lucide React</p>
            <p><strong>State Management:</strong> useState für lokalen State</p>
            <p><strong>Features:</strong> Counter, History, Local Storage (simuliert)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterApp;