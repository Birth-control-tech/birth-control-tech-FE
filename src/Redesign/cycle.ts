export interface Profile { name: string; lastPeriod: string; cycleLength: number; periodLength: number }
export interface LogEntry { date: string; time: string; temp: number | null; symptoms: string[]; notes: string }
export type PhaseKind = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
export const SYMPTOMS = ['Cramps', 'Bloating', 'Headache', 'Spotting', 'Tenderness', 'Low energy', 'Mood changes'];
export const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const parseDate = (key: string) => { const [y, m, d] = key.split('-').map(Number); return new Date(y, m - 1, d) };
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const dayDifference = (a: Date, b: Date) => Math.round((Date.UTC(a.getFullYear(), a.getMonth(), a.getDate()) - Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())) / 86400000);
export const dateLabel = (d: Date, options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }) => d.toLocaleDateString('en-US', options);
export function mockProfile(name: string): Profile { return { name, lastPeriod: dateKey(addDays(new Date(), -13)), cycleLength: 28, periodLength: 5 } }
export function mockLogs(): LogEntry[] {
  const temps = [97.12, 97.24, 97.19, 97.31, 97.22, 97.48, 97.54, 97.62, 97.57];
  const symptoms = [['Cramps'], [], ['Bloating'], [], ['Headache'], [], ['Tenderness'], [], ['Mood changes']];
  const notes = ['Cramps eased by late afternoon. Took it easy today.', '', 'Felt a little bloated in the evening. Otherwise a normal day.', '', 'Headache after lunch. Drank more water and rested.', '', 'Noticed mild tenderness in the morning.', 'Slept well and felt rested today.', 'A little more tired than usual this morning.'];
  return temps.map((temp, i) => ({ date: dateKey(addDays(new Date(), -[9,8,7,6,5,4,3,2,0][i])), time: '07:30', temp, symptoms: symptoms[i], notes: notes[i] }));
}
export function cycleDetails(profile: Profile, today = new Date()) {
  const start = parseDate(profile.lastPeriod), elapsed = dayDifference(today, start);
  return { cycleDay: elapsed >= 0 ? elapsed % profile.cycleLength + 1 : null, nextPeriod: addDays(start, Math.max(1, Math.ceil((elapsed + 1) / profile.cycleLength)) * profile.cycleLength) };
}
export function phaseForDate(date: Date, profile: Profile | null) {
  if (!profile) return null;
  const elapsed = dayDifference(date, parseDate(profile.lastPeriod));
  if (elapsed < 0) return null;
  const day = elapsed % profile.cycleLength + 1, ovulationDay = Math.max(1, profile.cycleLength - 14);
  const kind: PhaseKind = day <= profile.periodLength ? 'menstrual' : day === ovulationDay ? 'ovulation' : day < ovulationDay ? 'follicular' : 'luteal';
  return { day, kind, primary: { menstrual: 'Menstrual phase', follicular: 'Follicular phase', ovulation: 'Ovulation', luteal: 'Luteal phase' }[kind] };
}
