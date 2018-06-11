export class Person {
  name: string;
  hasSuperPowers: boolean;
  isRich: boolean;
  isGenius: boolean;

  constructor(args: { [key: string]: any }) {
    const { name, hasSuperPowers = false, isRich = false, isGenius = false } = args;
    this.name = name;
    this.hasSuperPowers = hasSuperPowers;
    this.isRich = isRich;
    this.isGenius = isGenius;
  }
}

export interface PersonStats {
  total: number;
  superPowers: number;
  rich: number;
  genius: number;
}

export interface PersonEvent {
  action: string;
  person: Person;
  propertyChanged?: {
    name: string;
    value: boolean;
  };
}
