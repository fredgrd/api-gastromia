import { ICartAttribute } from "./cartItemModel";

export enum CartOperationType {
  Modify,
  Add,
}

export interface ICartOperation {
  type: CartOperationType;
  cart_item_id?: string; // Needed if type is modify - Change the quantity of the selected item
  item_id?: string;
  quantity: number;
  attributes?: ICartAttribute[];
}
