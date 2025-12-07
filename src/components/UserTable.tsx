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
  const [search, setSearch] = useState(''); 
  const [cityFilter, setCityFilter] = useState<string>(''); 

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: User[] = await response.json();
      
      const dataWithAddress = data.map(user => ({
        ...user,
        address: {
          city: ['Moscow', 'Kulm', 'London'][user.id % 3], 
        },
      }));
      setUsers(dataWithAddress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

 
  const cities = Array.from(new Set(users.map(user => user.address.city)));

 
  const filteredUsers = users.filter(
    user => !cityFilter || user.address.city === cityFilter
  );

  
  const noResults = search.length >= 3 && filteredUsers.length === 0;

 
  const handleResetFilter = () => {
    setCityFilter('');
  };

  return (
    <div>
     
      <button onClick={fetchUsers} disabled={loading}>
        {loading ? 'Загрузка...' : 'Загрузить пользователей'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

     

     
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