import axios from 'axios'
import { Product } from '../types'

export const api = axios.create({
  baseURL: 'http://localhost:3333',
})

interface Stock {
  id: number
  amount: number
}

interface getProductsResponse {
  data: Product[]
  status: number
}

interface getStockByProductIdResponse {
  data: Stock
  status: number
}

interface getProductByIdResponse {
  data: Product
  status: number
}

export const getProducts = async (): Promise<getProductsResponse> => {
  try {
    const { data, status } = await api.get<Product[]>('products')

    return { data, status }
  } catch (error) {
    throw new Error()
  }
}

export const getProductById = async (id: number): Promise<getProductByIdResponse> => {
  try {
    const { data, status } = await api.get<Product>(`products/${id}`)

    return { data, status }
  } catch (error) {
    throw new Error()
  }
}

export const getStockByProductId = async (id: number): Promise<getStockByProductIdResponse> => {
  try {
    const { data, status } = await api.get<Stock>(`stock/${id}`)

    return { data, status }
  } catch (error) {
    throw new Error()
  }
}
