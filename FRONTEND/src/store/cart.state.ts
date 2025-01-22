import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Product } from '../services/product.service';  

export class AddToCart {
  static readonly type = '[Cart] Add';
  constructor(public product: Product) {}
}

export class RemoveFromCart {
  static readonly type = '[Cart] Remove';
  constructor(public productId: number) {}
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartStateModel {
  items: CartItem[];
}

export class DecrementQuantity {
  static readonly type = '[Cart] Decrement';
  constructor(public productId: number) {}
}

@State<CartStateModel>({
  name: 'cart',
  defaults: {
    items: []
  }
})
export class CartState {
  
  @Selector()
  static getItems(state: CartStateModel): CartItem[] {
    return state.items || [];
  }  

  @Selector()
  static getTotalCount(state: CartStateModel): number {
    return state.items.reduce((acc, item) => acc + item.quantity, 0);
  }

@Action(AddToCart)
addToCart(ctx: StateContext<CartStateModel>, action: AddToCart) {
  const state = ctx.getState();
  const productToAdd = action.product;

  if (productToAdd.stock <= 0) {
    console.warn(`Le produit ${productToAdd.name} n'est plus en stock !`);
    return;
  }

  const existingItem = state.items.find(
    (item) => item.product.id === productToAdd.id
  );

  let updatedItems: CartItem[];

  if (existingItem) {
    updatedItems = state.items.map((item) => {
      if (item.product.id === productToAdd.id) {
        if (item.quantity + 1 > productToAdd.stock) {
          console.warn(
            `Impossible d'ajouter : le stock pour ${productToAdd.name} est épuisé`
          );
          return item;
        }
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
  } else {
    updatedItems = [
      ...state.items,
      { product: productToAdd, quantity: 1 },
    ];
  }

  ctx.patchState({ items: updatedItems });
}



  @Action(RemoveFromCart)
  removeFromCart(ctx: StateContext<CartStateModel>, action: RemoveFromCart) {
    const state = ctx.getState();
    const updatedItems = state.items.filter(
      item => item.product.id !== action.productId
    );
    ctx.patchState({ items: updatedItems });
  }

  @Action(DecrementQuantity)
decrementQuantity(ctx: StateContext<CartStateModel>, action: DecrementQuantity) {
  const state = ctx.getState();
  const updatedItems = state.items.map(item =>
    item.product.id === action.productId
      ? { ...item, quantity: item.quantity - 1 }
      : item
  ).filter(item => item.quantity > 0);
  ctx.patchState({ items: updatedItems });
}
}

