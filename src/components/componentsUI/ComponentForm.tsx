'use client';

import React, { useState, ChangeEvent } from 'react';
import { Checkbox as MantineCheckbox } from '@mantine/core';
import { Radio as MantineRadio, type RadioIconProps } from '@mantine/core';
interface InputProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  accept?: string; 
}

const Input: React.FC<InputProps> = ({ label, type, placeholder, value, onChange, required, accept, ...props }) => {
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
        {...props}
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

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange, ...props }) => {
  return (
    <div className="mb-3 d-flex align-items-center">
      <label className="d-flex align-items-center" style={{ cursor: 'pointer', position: 'relative' }}>
        <div style={{ position: 'relative', width: '32px', height: '32px', marginRight: '10px' }}>
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            {...props}
            style={{
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              width: '32px',
              height: '32px',
              border: '2px solid var(--text-primary)',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-secondary)',
              cursor: 'pointer',
            }}
          />
          {checked && (
            <span
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'var(--text-primary)',
                fontSize: '18px',
                fontWeight: 'bold',
                pointerEvents: 'none',
              }}
            >
              ✖
            </span>
          )}
        </div>
        <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{label}</span>
      </label>
    </div>
  );
};

interface RadioProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}


const Radio: React.FC<RadioProps> = ({ label, name, checked, onChange, ...props }) => {
  return (
    <div className="mb-3 d-flex align-items-center">
      <input
        type="radio"
        id={label}
        name={name}
        checked={checked}
        onChange={onChange}
        {...props}
        className="custom-radio"
      />
      <label htmlFor={label} className="ms-2" style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
        {label}
      </label>

      <style jsx>{`
        .custom-radio {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-color: var(--bg-secondary);
          border: 2px solid var(--text-primary);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          position: relative;
          transition: all 0.3s ease;
        }

        .custom-radio:checked {
          background-color: var(--bg-secondary);
          border-color: var(--text-primary);
        }

        .custom-radio:checked::after {
          content: '';
          position: absolute;
          top: 4px;
          left: 4px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: var(--bg-primary);
        }
      `}</style>
    </div>
  );
};

interface SelectProps {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  withCustomOption?: boolean;
  onCustomOptionChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
}



const Select: React.FC<SelectProps> = ({ label, value, onChange, options, withCustomOption, onCustomOptionChange, ...props }) => {
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
        {...props}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--text-primary)', 
          borderRadius: '5px',
        }}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
        {withCustomOption && <option value="autre">Autre</option>}
      </select>
      {withCustomOption && value === 'autre' && (
        <input
          type="text"
          className="form-control mt-2"
          placeholder="Entrez votre option personnalisée"
          onChange={onCustomOptionChange}
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--text-primary)',
            borderRadius: '5px',
          }}
        />
      )}
    </div>
  );
};


const ButtonPrimaryy: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => {
  const [buttonColor, setButtonColor] = useState('var(--bg-button-primary)');

  return (
    <button
      {...props}
      className={`btn ${className ?? ""}`}
      style={{
        backgroundColor: buttonColor,
        color: 'var(--text-button-primary)',
        borderColor: 'var(--border-button-primary)',
      }}
      onMouseOver={() => setButtonColor('var(--bg-button-primary-hover)')}
      onMouseOut={() => setButtonColor('var(--bg-button-primary)')}
    >
      {children}
    </button>
  );
};



const ButtonSecondaryy: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => {
  const [buttonColor, setButtonColor] = useState('var(--bg-button-secondary)');

  return (
    <button
      {...props}
      className={`btn ${className ?? ""}`}
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
