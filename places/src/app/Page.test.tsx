import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import Page from './page';

vi.mock('next/dynamic', () => ({
  default: () => {
    const DynamicComponent = () => <div data-testid="fullscreen-button">FullScreen Button</div>
    return DynamicComponent
  }
}))

vi.mock('@/components/map/MapComponent', () => ({
  default: () => <div data-testid="map-component">Map Component</div>
}))

vi.mock('@/components/buttons/ThemeButton', () => ({
  default: () => <div data-testid="theme-button">Map Component</div>
}))

describe('Page Component', () => {
  test('renders all components', () => {
    render(<Page />)

    const fullscreenButton = screen.getByTestId('fullscreen-button')
    const mapComponent = screen.getByTestId('map-component')
    screen.getByTestId('theme-button')

    expect(fullscreenButton).toBeInTheDocument()
    expect(mapComponent).toBeInTheDocument()
  })
})