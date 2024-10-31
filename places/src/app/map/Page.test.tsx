import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest';
import Page from './page'

vi.mock('next/dynamic', () => ({
  default: () => {
    const DynamicComponent = () => <div data-testid="fullscreen-button">FullScreen Button</div>
    return DynamicComponent
  }
}))

vi.mock('./MapComponent', () => ({
  default: () => <div data-testid="map-component">Map Component</div>
}))

describe('Page Component', () => {
  test('renders all components in the correct order', () => {
    render(<Page />)
    
    const container = screen.getByTestId('fullscreen-button').parentElement
    const fullscreenButton = screen.getByTestId('fullscreen-button')
    const mapComponent = screen.getByTestId('map-component')

    expect(fullscreenButton).toBeInTheDocument()
    expect(mapComponent).toBeInTheDocument()

    expect(container?.firstChild).toBe(fullscreenButton)
    expect(container?.lastChild).toBe(mapComponent.parentElement)
  })
})