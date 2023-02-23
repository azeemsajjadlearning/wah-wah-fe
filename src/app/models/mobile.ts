export interface Brand {
  id: string;
  name: string;
  devices: number;
}

export interface Popular {
  favorites: number;
  id: string;
  name: string;
  position: number;
}

export interface BrandDevice {
  id: string;
  name: string;
  img: string;
  description: string;
}

export interface DeviceDetail {
  name: string;
  img: string;
  detailSpec: DetailSpec[];
  quickSpec: Specification[];
}

interface DetailSpec {
  category: string;
  specifications: Specification[];
}

interface Specification {
  name: string;
  value: string;
}
