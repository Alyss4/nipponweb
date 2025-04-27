'use client';

import React, { useState, ChangeEvent } from 'react';
import { Input, ButtonPrimaryy } from '../../components/ComponentForm';

interface ContactData {
  nom: string;
  email: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactData>({
    nom: '',
    email: '',
    message: '',
  });
  const [confirmation, setConfirmation] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmation('Votre message a été envoyé avec succès !');
    setFormData({ nom: '', email: '', message: '' });
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '700px' }}>
      <h2 className="text-center text-primary mb-4">Contactez-nous</h2>

      <form onSubmit={handleSubmit}>
        <Input
          label="Nom"
          type="text"
          placeholder="Entrez votre nom"
          value={formData.nom}
          onChange={handleChange}
          required
        />
        <Input
          label="Email"
          type="email"
          placeholder="Entrez votre email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <div className="mb-3">
          <label htmlFor="message" className="form-label text-dark fw-bold">
            Message
          </label>
          <textarea
            className="form-control"
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            required
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--text-primary)',
              borderRadius: '5px',
            }}
          ></textarea>
        </div>

        <div className="text-center">
          <ButtonPrimaryy>Envoyer</ButtonPrimaryy>
        </div>
      </form>

      {confirmation && (
        <p className="text-success text-center mt-4">{confirmation}</p>
      )}
    </div>
  );
}
