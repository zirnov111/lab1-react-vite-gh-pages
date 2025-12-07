import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserTable from './UserTable';
import { vi } from 'vitest';

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: 1,
            name: 'Leanne Graham',
            email: 'Sincere@april.biz',
            phone: '1-770-736-8031 x56442',
            website: 'hildegard.org',
            address: { city: 'Moscow' },
          },
          {
            id: 2,
            name: 'Ervin Howell',
            email: 'Shanna@melissa.tv',
            phone: '010-692-6593 x09125',
            website: 'anastasia.net',
            address: { city: 'London' },
          },
        ]),
    })
  );
});

afterEach(() => {
  vi.resetAllMocks();
});

test('фильтрация по городу и отображение результатов', async () => {
  render(<UserTable />);

  // Ждем появления кнопки загрузки
  const loadButton = await screen.findByText('Загрузить пользователей');

  // Кликаем и ждём загрузки данных
  fireEvent.click(loadButton);

  // Ждем появления таблицы (например, заголовка "Имя")
  await waitFor(() => expect(screen.getByText('Имя')).toBeInTheDocument());

  // Меняем фильтр на 'London'
  const select = screen.getByRole('combobox');
  fireEvent.change(select, { target: { value: 'London' } });

  // Проверяем, что отображается правильный пользователь
  await waitFor(() => {
    expect(screen.getByText('Ervin Howell')).toBeInTheDocument();
    expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument();
  });
});