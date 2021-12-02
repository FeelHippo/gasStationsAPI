interface Pump {
  id: number,
  fuel_type: string,
  price: number,
  available: boolean,
}

export interface Station {
  id: number,
  name?: string,
  address?: string,
  city?: string,
  latitude: number,
  longitude: number,
  pumps: Array<Pump>,
  $loki?: string,
  meta?: object,
}