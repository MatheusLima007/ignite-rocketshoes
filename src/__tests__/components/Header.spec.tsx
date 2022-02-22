import { render } from '@testing-library/react'
import { ReactNode } from 'react'
import Header from '../../components/Header'
import { useCart } from '../../hooks/useCart'

const mockedUseCartHook = useCart as jest.Mock

jest.mock('../../hooks/useCart')

jest.mock('react-router-dom', () => {
  return {
    Link: ({ children }: { children: ReactNode }) => children,
  }
})

describe('Header Component', () => {
  beforeEach(() => {
    mockedUseCartHook.mockReturnValue({
      cart: [
        {
          amount: 2,
          id: 1,
          image: 'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg',
          price: 179.9,
          title: 'Tênis de Caminhada Leve Confortável',
        },
        {
          amount: 1,
          id: 2,
          image: 'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis2.jpg',
          price: 139.9,
          title: 'Tênis VR Caminhada Confortável Detalhes Couro Masculino',
        },
      ],
    })
  })
  it('should be able to render the amount of products added to cart', () => {
    const { getByTestId, rerender } = render(<Header />)

    const cartSizeCounter = getByTestId('cart-size')
    expect(cartSizeCounter).toHaveTextContent('2 itens')

    mockedUseCartHook.mockReturnValueOnce({
      cart: [
        {
          amount: 2,
          id: 1,
          image: 'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg',
          price: 179.9,
          title: 'Tênis de Caminhada Leve Confortável',
        },
      ],
    })

    rerender(<Header />)
    expect(cartSizeCounter).toHaveTextContent('1 item')
  })
})
