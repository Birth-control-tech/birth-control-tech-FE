import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import App from './App';
import { addDays, cycleDetails, dateKey, dayDifference, phaseForDate, Profile } from './cycle';

test('updates today without duplicating it and shares the edit with calendar and reports', () => {
  const { getByText, getByLabelText, getByRole } = render(<App/>);
  fireEvent.click(getByLabelText('Add entry'));
  fireEvent.change(getByLabelText('Basal body temperature | F'), { target: { value: '98.12' } });
  fireEvent.change(getByLabelText(/A note to yourself/), { target: { value: 'A saved test note.' } });
  fireEvent.click(getByText('Update entry'));
  expect(getByText('Recent check-ins (9)')).toBeInTheDocument();
  fireEvent.click(getByLabelText('Calendar'));
  expect(getByText('98.12 °F')).toBeInTheDocument();
  expect(getByText('A saved test note.')).toBeInTheDocument();
  fireEvent.click(getByLabelText('Reports'));
  expect(getByText('A saved test note.')).toBeInTheDocument();
  expect(getByRole('img', { name: /Temperature trend:/ })).toBeInTheDocument();
});

test('saves cycle baseline and expands calendar phase details', () => {
  const { getByText, getByLabelText, getByRole } = render(<App/>);
  fireEvent.click(getByLabelText('Profile'));
  fireEvent.change(getByLabelText('Typical cycle length | days'), { target: { value: '30' } });
  fireEvent.click(getByText('Save changes'));
  expect(getByRole('status').textContent).toBe('Profile saved');
  fireEvent.click(getByLabelText('Reports'));
  expect(getByText('30d')).toBeInTheDocument();
  fireEvent.click(getByLabelText('Calendar'));
  const previousMonth = getByLabelText('Previous month');
  fireEvent.click(previousMonth);
  fireEvent.click(getByLabelText('Next month'));
  fireEvent.click(getByText('Your period. Also part of the follicular phase.'));
  expect(getByText('The uterine lining sheds during your period.')).toBeInTheDocument();
});

test('signs out and requires a name to continue', () => {
  const { getByText, getByLabelText } = render(<App/>);
  fireEvent.click(getByLabelText('Profile'));
  fireEvent.click(getByText('Sign out'));
  expect(getByText('Continue')).toBeDisabled();
  fireEvent.change(getByLabelText('Your name'), { target: { value: '  Ada  ' } });
  fireEvent.click(getByText('Continue'));
  expect(getByText('Hi, Ada')).toBeInTheDocument();
});

test('cycle estimates handle phase boundaries, next cycle and dates before baseline', () => {
  const start = new Date(2026, 10, 1);
  const profile: Profile = { name: 'Edie', lastPeriod: dateKey(start), cycleLength: 28, periodLength: 5 };
  expect(phaseForDate(start, profile)!.kind).toBe('menstrual');
  expect(phaseForDate(addDays(start, 5), profile)!.kind).toBe('follicular');
  expect(phaseForDate(addDays(start, 13), profile)!.kind).toBe('ovulation');
  expect(phaseForDate(addDays(start, 14), profile)!.kind).toBe('luteal');
  expect(phaseForDate(addDays(start, 28), profile)!.day).toBe(1);
  expect(phaseForDate(addDays(start, -1), profile)).toBeNull();
  expect(dateKey(cycleDetails(profile, addDays(start, 28)).nextPeriod)).toBe(dateKey(addDays(start, 56)));
  expect(dayDifference(new Date(2026, 2, 9), new Date(2026, 2, 7))).toBe(2);
});

test('rejects an out-of-range temperature before saving', () => {
  const { getByText, getByLabelText } = render(<App/>);
  fireEvent.click(getByLabelText('Add entry'));
  const input = getByLabelText('Basal body temperature | F');
  fireEvent.change(input, { target: { value: '106' } });
  expect((input as HTMLInputElement).validity.rangeOverflow).toBe(true);
  fireEvent.submit(getByText('Update entry').closest('form')!);
  expect(getByText('Daily check-in')).toBeInTheDocument();
});

test('disables invalid profile changes and reports photo upload errors', () => {
  const { getByText, getByLabelText, getByRole } = render(<App/>);
  fireEvent.click(getByLabelText('Profile'));
  fireEvent.change(getByLabelText('Typical cycle length | days'), { target: { value: '20' } });
  expect(getByText('Save changes')).toBeDisabled();
  fireEvent.change(getByLabelText('Typical cycle length | days'), { target: { value: '28.5' } });
  expect(getByText('Save changes')).toBeDisabled();
  fireEvent.change(getByLabelText('Choose profile photo'), { target: { files: [new File(['text'], 'notes.txt', { type: 'text/plain' })] } });
  expect(getByRole('alert').textContent).toBe('Choose an image file.');
});
