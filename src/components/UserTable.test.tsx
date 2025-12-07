import { render, screen, fireEvent } from '@testing-library/react'
import UserTable from '../components/UserTable'
//import { vi } from 'vitest';

const mockUsers = [
  {
    id: 1,
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    phone: '+7 (999) 123-45-67',
    website: 'example.com',
  },
];

const originalFetch = globalThis.fetch;

beforeAll(() => {
  (globalThis as any).fetch = () => Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockUsers),
  } as Response);
});

afterAll(() => {
  (globalThis as any).fetch = originalFetch;
});

describe('UserTable', () => {
  test('renders button and does not show table initially', () => {
    render(<UserTable />);
    expect(screen.getByText(/загрузить пользователей/i)).toBeInTheDocument();
    expect(screen.queryByText(/иван/i)).not.toBeInTheDocument();
  });

  test('loads users and displays them when button is clicked', async () => {
    render(<UserTable />);
    fireEvent.click(screen.getByText(/загрузить пользователей/i));
    expect(await screen.findByText(/иван иванов/i)).toBeInTheDocument();
    expect(screen.getByText(/ivan@example.com/i)).toBeInTheDocument();
  });

  test('shows error when fetch fails', async () => {
    (globalThis as any).fetch = () => Promise.reject(new Error('Network error'));

    render(<UserTable />);
    fireEvent.click(screen.getByText(/загрузить пользователей/i));
expect(await screen.findByText(/network error/i)).toBeInTheDocument();
    (globalThis as any).fetch = originalFetch;
  });
});