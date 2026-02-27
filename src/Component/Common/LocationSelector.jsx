import React, { useState, useEffect } from 'react';
import { Country, State, City } from 'country-state-city';
import Select from 'react-select';

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#f9fafb',
    border: 'none',
    boxShadow: state.isFocused ? '0 0 0 2px #5C4033' : '0 0 0 1px #e5e7eb',
    borderRadius: '1rem',
    padding: '0.5rem 0.75rem',
    minHeight: '3.5rem',
    cursor: 'pointer',
    '&:hover': {
      boxShadow: '0 0 0 1px #d1d5db',
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '0',
  }),
  input: (provided) => ({
    ...provided,
    margin: '0',
    padding: '0',
    color: '#111827',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#9ca3af',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#111827',
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '0.75rem',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    zIndex: 9999,
  }),
  menuList: (provided) => ({
    ...provided,
    padding: '0.25rem',
    maxHeight: '200px',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#5C4033' : state.isFocused ? '#5C4033/10' : 'white',
    color: state.isSelected ? 'white' : '#374151',
    borderRadius: '0.5rem',
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: '#5C4033',
      color: 'white',
    },
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: '#9ca3af',
    '&:hover': {
      color: '#5C4033',
    },
  }),
};

export function LocationSelector({ 
  selectedCountry, 
  selectedState, 
  selectedCity, 
  onCountryChange, 
  onStateChange, 
  onCityChange,
  disabled = false 
}) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    const countryOptions = allCountries.map((c) => ({
      value: c.isoCode,
      label: c.name,
      ...c,
    }));
    setCountries(countryOptions);
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const allStates = State.getStatesOfCountry(selectedCountry.value);
      const stateOptions = allStates.map((s) => ({
        value: s.isoCode,
        label: s.name,
        ...s,
      }));
      setStates(stateOptions);
    } else {
      setStates([]);
    }
    setCities([]);
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      const allCities = City.getCitiesOfState(selectedCountry.value, selectedState.value);
      const cityOptions = allCities.map((c) => ({
        value: c.name,
        label: c.name,
        ...c,
      }));
      setCities(cityOptions);
    } else {
      setCities([]);
    }
  }, [selectedCountry, selectedState]);

  const handleCountryChange = (option) => {
    onCountryChange(option);
    onStateChange(null);
    onCityChange(null);
  };

  const handleStateChange = (option) => {
    onStateChange(option);
    onCityChange(null);
  };

  const handleCityChange = (option) => {
    onCityChange(option);
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 ml-1">Country *</label>
        <Select
          options={countries}
          value={selectedCountry}
          onChange={handleCountryChange}
          placeholder="Search & Select Country"
          isClearable
          isSearchable
          styles={customStyles}
          isDisabled={disabled}
          noOptionsMessage={() => "No countries found"}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 ml-1">State *</label>
        <Select
          options={states}
          value={selectedState}
          onChange={handleStateChange}
          placeholder={selectedCountry ? "Search & Select State" : "Select country first"}
          isClearable
          isSearchable
          styles={customStyles}
          isDisabled={disabled || !selectedCountry}
          noOptionsMessage={() => selectedCountry ? "No states found" : "Select country first"}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 ml-1">City *</label>
        <Select
          options={cities}
          value={selectedCity}
          onChange={handleCityChange}
          placeholder={selectedState ? "Search & Select City" : "Select state first"}
          isClearable
          isSearchable
          styles={customStyles}
          isDisabled={disabled || !selectedState}
          noOptionsMessage={() => selectedState ? "No cities found" : "Select state first"}
        />
      </div>
    </div>
  );
}

export default LocationSelector;
