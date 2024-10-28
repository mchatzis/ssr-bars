import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from './page';

jest.mock('next/dynamic', () => () => {
  const DynamicComponent= () => {
    return <div data-testid="fullscreen-button">FullScreen Button</div>;
  };
  return DynamicComponent;
});

jest.mock('./MapComponent', () => {
  const MockMapComponent= () => {
    return <div data-testid="map-component">Map Component</div>;
  };
  return MockMapComponent;
});

describe('Page Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders components in correct order', () => {
    render(<Page />);
    const fullscreenButton = screen.getByTestId('fullscreen-button');
    const mapComponent = screen.getByTestId('map-component');
    
    expect(fullscreenButton).toBeInTheDocument();
    expect(mapComponent).toBeInTheDocument();
    
    const mapContainer = mapComponent.parentElement as HTMLElement;
    expect(fullscreenButton.compareDocumentPosition(mapContainer))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });
});