import { Product } from './product.model';

export interface Reyon {
  id: string;
  name: string;
  type: string;
  products: Product[];
}
