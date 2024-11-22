import { useState } from 'react';

function App() {
  const [apiInput, setApiInput] = useState('{"data":["L","22","h","5","U","444","i","S","1"]}');
  const [selectedFilters, setSelectedFilters] = useState(['all']);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      JSON.parse(apiInput);
      setErrorMessage('');

      let headersList = {
        "Content-Type": "application/json",
      };

      let bodyContent = apiInput;
      let response = await fetch("https://bajajbackend-1jk6.onrender.com/bfhl", {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      });

      let data = await response.json();
      setResponseData(data);
    } catch (error) {
      setResponseData(null);
      setErrorMessage('Invalid JSON input. Please check your input format.');
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterOptions = [
    { value: 'all', label: 'Show All' },
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest-lowercase', label: 'Highest lowercase alphabet' },
  ];

  const handleFilterChange = (value) => {
    setSelectedFilters(prev => {
      if (value === 'all') {
        return ['all'];
      }
      const newFilters = prev.includes(value)
        ? prev.filter(f => f !== value)
        : [...prev.filter(f => f !== 'all'), value];
      return newFilters.length ? newFilters : ['all'];
    });
  };

  const getFilteredResponse = () => {
    if (!responseData) return null;

    if (selectedFilters.includes('all')) {
      return JSON.stringify(responseData, null, 2);
    }

    let result = {};
    if (selectedFilters.includes('alphabets')) {
      result.alphabets = responseData.alphabets;
    }
    if (selectedFilters.includes('numbers')) {
      result.numbers = responseData.numbers;
    }
    if (selectedFilters.includes('highest-lowercase')) {
      result.highest_lowercase_alphabet = responseData.highest_lowercase_alphabet;
    }

    return JSON.stringify(result, null, 2);
  };

  return (
    <div className="min-h-screen bg-teal-50 text-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <h1 className="text-3xl font-bold text-center text-green-600">Bajaj Api Round</h1>
        <h2 className="text-3xl font-bold text-center text-green-900">0101CS211136</h2>
  
        <div className="space-y-4 bg-white p-6 rounded-xl shadow-lg">
          <div className="space-y-2">
            <label htmlFor="api-input" className="block text-sm font-medium text-gray-700">
              API Input
            </label>
            <textarea
              id="api-input"
              value={apiInput}
              onChange={(e) => setApiInput(e.target.value)}
              className={`w-full px-3 py-2 bg-gray-100 border rounded-md font-mono text-sm resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errorMessage ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={4}
            />
            {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
          </div>
  
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
  
        {responseData && (
          <div className="space-y-6 bg-white p-6 rounded-xl shadow-lg">
            <div className="relative">
              <div
                className="flex items-center justify-between border border-gray-300 rounded-md p-3 bg-gray-100 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Multi Filter</span>
                  <div className="flex flex-wrap items-center gap-1">
                    {selectedFilters.map(filter => (
                      <span key={filter} className="text-xs bg-green-100 text-green-700 rounded px-2 py-1">
                        {filterOptions.find(option => option.value === filter).label}
                      </span>
                    ))}
                  </div>
                </div>
                <span className={`text-sm transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
              </div>
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-gray-100 border border-gray-300 rounded-md shadow-lg">
                  {filterOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`px-4 py-2 hover:bg-green-100 cursor-pointer transition-colors duration-150 ${
                        selectedFilters.includes(option.value) ? 'bg-green-100' : ''
                      }`}
                      onClick={() => handleFilterChange(option.value)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedFilters.includes(option.value)}
                        onChange={() => {}}
                        className="mr-2"
                      />
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
  
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-green-600">Filtered Response</h2>
              <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto max-h-60 whitespace-pre-wrap break-words border border-gray-300">
                {getFilteredResponse()}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
}

export default App;
