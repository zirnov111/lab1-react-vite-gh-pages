import { useState } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
};

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(''); // добавляем состояние поиска

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: User[] = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  // фильтр пользователей по email
  const filteredUsers = users.filter(user => {
    if (search.length >= 3) {
      return user.email.toLowerCase().includes(search.toLowerCase());
    }
    return true; // если менее 3 символов, показываем всех
  });

  // сообщение «Ничего не найдено», если фильтр есть и результатов нет
  const noResults = search.length >= 3 && filteredUsers.length === 0;

  return (
    <div className="user-table-container">
      {/* input для поиска */}
      <input
        type="text"
        placeholder="Поиск по email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px', width: '200px' }}
      />

      <button onClick={fetchUsers} disabled={loading}>
        {loading ? 'Загрузка...' : 'Загрузить пользователей'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

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