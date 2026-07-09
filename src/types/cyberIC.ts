export interface CyberICMetadata {
  icNumber: string;
  citizenName: string;
  registrationDate: string;
  activeTitle: string;
  villageZone: string;
}

export interface ICZone {
  zoneId: string;
  zoneName: string;
  population: number;
}

export interface ICTitle {
  titleId: string;
  titleName: string;
  description: string;
  privileges: string[];
}

export function formatICNumber(icNumber: string): string {
  if (icNumber.length === 12) {
    return `${icNumber.substring(0, 6)}-${icNumber.substring(6)}`;
  }
  return icNumber;
}

export function validateICNumber(icNumber: string): boolean {
  const regex = /^[0-9]{6}-?[0-9]{4}[0-9]{2}$/;
  return regex.test(icNumber);
}

export function getVillageZone(zone: string): string {
  const zones: Record<string, string> = {
    'A': 'Kampung A',
    'B': 'Kampung B',
    'C': 'Kampung C',
    'D': 'Kampung D',
    'E': 'Kampung E'
  };
  return zones[zone] || zone;
}