export function castArray<T extends any[]>(value: T): T;

export function castArray<T>(value: T): T[];

export function castArray(value: any): any[] {
  return Array.isArray(value) ? value : [value];
}
