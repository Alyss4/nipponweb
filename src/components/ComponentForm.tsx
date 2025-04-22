'use client';

import React, { useState, ChangeEvent } from 'react';

interface InputProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({ label, type, placeholder, value, onChange, required }) => {
  return (
    <div className="mb-3">
      <label htmlFor={label} className="form-label text-dark fw-bold">
        {label}
      </label>
      <input
        type={type}
        className="form-control"
        id={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--text-primary)', 
          borderRadius: '5px',
        }}
      />
    </div>
  );
};

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
  return (
    <div className="mb-3 form-check">
      <input
        type="checkbox"
        className="form-check-input"
        id={label}
        checked={checked}
        onChange={onChange}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--text-primary)',
          borderRadius: '5px',
        }}
      />
      <label htmlFor={label} className="form-check-label text-dark fw-bold">
        {label}
      </label>
    </div>
  );
};

interface RadioProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Radio: React.FC<RadioProps> = ({ label, name, checked, onChange }) => {
  return (
    <div className="mb-3 form-check">
      <input
        type="radio"
        className="form-check-input"
        id={label}
        name={name}
        checked={checked}
        onChange={onChange}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--text-primary)',
          borderRadius: '5px',
        }}
      />
      <label htmlFor={label} className="form-check-label text-dark fw-bold">
        {label}
      </label>
    </div>
  );
};

interface SelectProps {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}

const Select: React.FC<SelectProps> = ({ label, value, onChange, options }) => {
  return (
    <div className="mb-3">
      <label htmlFor={label} className="form-label text-dark fw-bold">
        {label}
      </label>
      <select
        className="form-select"
        id={label}
        value={value}
        onChange={onChange}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--text-primary)', 
          borderRadius: '5px',
        }}
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

const ButtonPrimaryy: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [buttonColor, setButtonColor] = useState('var(--bg-button-primary)');

  return (
    <button
      className="btn w-100"
      style={{
        backgroundColor: buttonColor,
        color: 'var(--text-button-primary)',
        borderColor: 'var(--border-button-primary)',
      }}
      onMouseOver={() => setButtonColor('var(--bg-button-primary-hover)')}
      onMouseOut={() => setButtonColor('var(--bg-button-primary)')}
      type="submit"
    >
      {children}
    </button>
  );
};

const ButtonSecondaryy: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [buttonColor, setButtonColor] = useState('var(--bg-button-secondary)');

  return (
    <button
      className="btn w-100"
      style={{
        backgroundColor: buttonColor,
        color: 'var(--text-button-secondary)',
        borderColor: 'var(--border-button-secondary)',
      }}
      onMouseOver={() => setButtonColor('var(--bg-button-secondary-hover)')}
      onMouseOut={() => setButtonColor('var(--bg-button-secondary)')}
      type="button"
    >
      {children}
    </button>
  );
};

export { Input, Checkbox, Radio, Select, ButtonPrimaryy, ButtonSecondaryy };
