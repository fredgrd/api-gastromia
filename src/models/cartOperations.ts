// --------------------------------------------------------------------------
// Helpers

// Check if the object is a ICartOperation
export const isOperation = (operation: any) => {
  const unsafeCast = operation as ICartOperation;

  return (
    unsafeCast.type !== undefined &&
    unsafeCast.quantity !== undefined &&
    (unsafeCast.cart_item_id !== undefined || unsafeCast.item_id !== undefined)
  );
};

// --------------------------------------------------------------------------
// Interface / Schema / Model

export enum CartOperationType {
  Modify = "modify",
  Add = "add",
}

export interface ICartOperationAttribute {
  group_id: string; // ID needed for validation
  attribute_id: string; // Will be populated when computing cart / item total
  quantity: number;
}

export interface ICartOperation {
  owner_id: string;
  type: CartOperationType;
  cart_item_id?: string; // Needed if type is modify - Change the quantity of the selected item
  item_id?: string;
  quantity: number;
  attributes?: ICartOperationAttribute[];
}
