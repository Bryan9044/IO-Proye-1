import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import BstForm from '../BstForm'
import MatrixMultiplicationForm from '../MatrixMultiplicationForm'

describe('validación de formularios', () => {
  it('muestra un error cuando un peso del BST no es numérico y no envía el formulario', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<BstForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Llaves'), 'ana, pedro')
    await user.type(screen.getByLabelText('Pesos'), '1,o')
    await user.click(screen.getByRole('button', { name: 'Calcular árbol' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('El peso «o» no es válido')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('Muestra un error cuando una llave no tiene la misma cantidad de pesos y no envía el formulario', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<BstForm onSubmit={onSubmit} />)
    
    await user.type(screen.getByLabelText('Llaves'), 'ana')
    await user.type(screen.getByLabelText('Pesos'), '1,2')
    await user.click(screen.getByRole('button', { name: 'Calcular árbol' }))

    expect (await screen.findByRole('alert')).toHaveTextContent('Debe haber exactamente un peso por cada llave.')
    expect(onSubmit).not.toHaveBeenCalled()
  })
  

  it('muestra un error cuando una dimensión no es entera y no envía el formulario', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<MatrixMultiplicationForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Dimensiones de las matrices'), '30, o, 5')
    await user.click(screen.getByRole('button', { name: 'Calcular parentización' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('La dimensión «o» no es válida')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('pide 3 dimensiones cuando se indican 2 matrices', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<MatrixMultiplicationForm onSubmit={onSubmit} />)

    const countInput = screen.getByLabelText('Número de matrices (1 a 10)')
    await user.clear(countInput)
    await user.type(countInput, '2')

    await user.type(screen.getByLabelText('Dimensiones de las matrices'), '30, 5')
    await user.click(screen.getByRole('button', { name: 'Calcular parentización' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Para 2 matrices debes ingresar 3 dimensiones')
    expect(onSubmit).not.toHaveBeenCalled()
  })


})
