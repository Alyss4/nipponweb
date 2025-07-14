import { test, expect } from '@playwright/test';

test('bracket page se charge', async ({ page }) => {
  await page.goto('/bracket/1');
  await expect(page.getByRole('heading', { name: 'Tableau final / Bracket' })).toBeVisible();
});

test('bouton Générer bracket visible ou non', async ({ page }) => {
  await page.goto('/bracket/1');
  const boutonGenerer = page.getByRole('button', { name: /Générer le tableau final/i });
  if (await boutonGenerer.isVisible()) {
    await expect(boutonGenerer).toBeEnabled();
  }
});

test('changemdp page affiche titre', async ({ page }) => {
  await page.goto('/changemdp');
  await expect(page.getByRole('heading', { name: 'Changer le mot de passe' })).toBeVisible();
});

test('changemdp affiche erreur si confirmation invalide', async ({ page }) => {
  await page.goto('/changemdp');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Ancien mot de passe').fill('ancien123');
  await page.getByLabel('Nouveau mot de passe').fill('nouveau123');
  await page.getByLabel('Confirmation').fill('mauvais123');
  await page.getByRole('button', { name: /Changer le mot de passe/i }).click();
  await expect(page.getByText('Les nouveaux mots de passe ne correspondent pas.')).toBeVisible();
});

test('connexion page affiche titre', async ({ page }) => {
  await page.goto('/connexion');
  await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible();
});

test('poules page affiche le titre', async ({ page }) => {
  await page.goto('/poules/1');
  await expect(page.getByRole('heading', { name: /Création des Poules/i })).toBeVisible();
});

test('poules page affiche les options de mode', async ({ page }) => {
  await page.goto('/poules/1');
  await expect(page.getByRole('combobox')).toBeVisible();
  await expect(page.getByRole('combobox')).toContainText('-- Choisir un mode --');
});

test('poules page champ nombre de poules présent', async ({ page }) => {
  await page.goto('/poules/1');
  await expect(page.getByLabel('Nombre de poules')).toBeVisible();
});

test('poules page boutons générer et enregistrer visibles', async ({ page }) => {
  await page.goto('/poules/1');
  await expect(page.getByRole('button', { name: /Générer les Poules/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Enregistrer les poules/i })).toBeVisible();
});
