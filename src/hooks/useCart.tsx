import { createContext, ReactNode, useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { getProductById, getStockByProductId } from '../services/api'
import { Product } from '../types'
import { CART_COLLECTIONS } from '../util/constants'

interface CartProviderProps {
  children: ReactNode
}

interface UpdateProductAmount {
  productId: number
  amount: number
}

interface CartProps extends Product {
  amount: number
}

interface CartContextData {
  cart: CartProps[]
  addProduct: (productId: number) => Promise<void>
  removeProduct: (productId: number) => void
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void
}

const CartContext = createContext<CartContextData>({} as CartContextData)

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<CartProps[]>(() => {
    const storagedCart = localStorage.getItem(CART_COLLECTIONS)

    return storagedCart ? JSON.parse(storagedCart) : []
  })

  const addProduct = async (productId: number) => {
    try {
      const productInCart = cart.find(product => product.id === productId)

      if (productInCart) {
        const { data: productStock } = await getStockByProductId(productId)

        if (productInCart.amount + 1 <= productStock.amount) {
          const cartUpdated = cart.map(product =>
            product.id === productInCart.id ? { ...product, amount: product.amount + 1 } : product
          )

          setLocalStorageAndStateCart(cartUpdated)
        } else {
          toast.error('Quantidade solicitada fora de estoque')
        }
      } else {
        const { data: product } = await getProductById(productId)

        const cartUpdated = [...cart, { ...product, amount: 1 }]

        setLocalStorageAndStateCart(cartUpdated)
      }
    } catch {
      toast.error('Erro na adição do produto')
    }
  }

  const removeProduct = (productId: number) => {
    try {
      if (!cart.some(product => product.id === productId)) {
        throw new Error('Erro na remoção do produto')
      }

      const cartUpdated = cart.filter(product => product.id !== productId)

      setLocalStorageAndStateCart(cartUpdated)
    } catch {
      toast.error('Erro na remoção do produto')
    }
  }

  const updateProductAmount = async ({ productId, amount }: UpdateProductAmount) => {
    try {
      const productInCart = cart.find(product => product.id === productId)

      if (productInCart && amount > 0) {
        const { data: productStock } = await getStockByProductId(productId)

        if (amount <= productStock.amount) {
          const cartUpdated = cart.map(product => (product.id === productInCart.id ? { ...product, amount } : product))

          setLocalStorageAndStateCart(cartUpdated)
        } else {
          toast.error('Quantidade solicitada fora de estoque')
        }
      } else {
        throw new Error('Erro na alteração de quantidade do produto')
      }
    } catch {
      toast.error('Erro na alteração de quantidade do produto')
    }
  }

  const setLocalStorageAndStateCart = (cart: CartProps[]) => {
    setCart(cart)
    localStorage.setItem(CART_COLLECTIONS, JSON.stringify(cart))
  }

  return (
    <CartContext.Provider value={{ cart, addProduct, removeProduct, updateProductAmount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextData {
  const context = useContext(CartContext)

  return context
}
