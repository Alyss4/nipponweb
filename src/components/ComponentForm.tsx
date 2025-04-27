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
    <div className="mb-3">
      <MantineCheckbox
        label={label}
        checked={checked}
        onChange={onChange}
        size="md"
        radius="md"
        styles={{
          input: {
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--text-primary)',
            borderWidth: '2px',
            borderRadius: '8px',
            width: '32px',
            height: '32px',
            '&:checked': {
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--text-primary)',
              color: 'var(--text-primary)', // pour bien afficher le "X"
            },
          },
          label: {
            color: 'var(--text-primary)',
            fontWeight: 'bold',
            marginLeft: '10px',
          },
        }}
        icon={({ indeterminate, className }) => (
          <div
            className={className}
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              lineHeight: 1,
              textAlign: 'center',
            }}
          >
            ✖
          </div>
        )}
      />
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
    <div className="mb-3 d-flex align-items-center">
      <input
        type="radio"
        id={label}
        name={name}
        checked={checked}
        onChange={onChange}
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
