import { useState } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  address: {
    city: string;
  };
};

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(''); // существующий поиск
  const [cityFilter, setCityFilter] = useState<string>(''); // фильтр по городу

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: User[] = await response.json();
      // Поскольку API не возвращает address, добавим фиктивный адрес для тестирования
      const dataWithAddress = data.map(user => ({
        ...user,
        address: {
          city: ['Moscow', 'Kulm', 'London'][user.id % 3], // пример городов
        },
      }));
      setUsers(dataWithAddress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  // уникальные города для селекта
  const cities = Array.from(new Set(users.map(user => user.address.city)));

  // фильтрация по городу
  const filteredUsers = users.filter(
    user => !cityFilter || user.address.city === cityFilter
  );

  // сообщение «Ничего не найдено», если фильтр по поиску есть и нет совпадений
  const noResults = search.length >= 3 && filteredUsers.length === 0;

  //Обработчик сброса фильтра по городу
  const handleResetFilter = () => {
    setCityFilter('');
  };

  return (
    <div>
      {/* Кнопка загрузки */}
      <button onClick={fetchUsers} disabled={loading}>
        {loading ? 'Загрузка...' : 'Загрузить пользователей'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Поле поиска */}
      {/* (Если есть необходимость, можно оставить или убрать) */}
      {/* <input
        type="text"
        placeholder="Поиск..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      /> */}

      {/* Фильтр по городу */}
      {users.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <label>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            >
              <option value="">Все города</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>
          <button onClick={handleResetFilter} style={{ marginLeft: '10px' }}>
            Сбросить фильтр
          </button>
        </div>
      )}

      {/* Таблица */}
      {users.length > 0 && (
        <>
          {noResults ? (
            <p>Ничего не найдено</p>
          ) : (
            <table
              border={1}
              style={{
                marginTop: '20px',
                borderCollapse: 'collapse',
                width: '100%',
              }}
            >
              <thead>
                <tr>
                  <th>Имя</th>
                  <th>Email</th>
                  <th>Телефон</th>
                  <th>Сайт</th>
                  <th>Город</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <a
                        href={`http://${user.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {user.website}
                      </a>
                    </td>
                    <td>{user.address.city}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}