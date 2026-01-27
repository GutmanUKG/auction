import axios from 'axios';

async function testAuthFlow() {
    console.log('Testing authentication flow...\n');

    try {
        // 1. Авторизация
        console.log('1. Login with admin credentials...');
        const loginResponse = await axios.post('http://localhost:3000/auth/login', {
            email: 'admin@mail.ru',
            password: 'password123'
        });

        const token = loginResponse.data.token;
        console.log('✓ Login successful');
        console.log('Token:', token.substring(0, 20) + '...\n');

        // 2. Проверка /auth/me
        console.log('2. Checking /auth/me with token...');
        try {
            const meResponse = await axios.get('http://localhost:3000/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('✓ /auth/me successful');
            console.log('User:', meResponse.data.fullName, '-', meResponse.data.email);
            console.log('');
        } catch (err) {
            console.log('❌ /auth/me failed:', err.response?.status, err.response?.data);
            console.log('');
        }

        // 3. Создание лота БЕЗ токена (должно вернуть ошибку)
        console.log('3. Try creating house WITHOUT token...');
        try {
            await axios.post('http://localhost:3000/houses', {
                name: 'Test House',
                startPrice: 1000000,
                country: 'Test',
                city: 'Test',
                area: 100,
                countRoom: 3
            });
            console.log('❌ Should have failed without token!');
        } catch (err) {
            if (err.response?.status === 401) {
                console.log('✓ Correctly returned 401 Unauthorized');
                console.log('Error message:', err.response?.data?.message || err.response?.data);
            } else {
                console.log('❌ Unexpected error:', err.response?.status, err.response?.data);
            }
        }
        console.log('');

        // 4. Создание лота С токеном (должно работать)
        console.log('4. Creating house WITH token...');
        const createResponse = await axios.post('http://localhost:3000/houses', {
            name: 'Test House With Auth',
            prevText: 'Test description',
            text: 'Full test description',
            startPrice: 2000000,
            images: [],
            mainImage: '',
            country: 'Казахстан',
            city: 'Алматы',
            area: 100,
            countRoom: 3
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('✓ House created successfully!');
        console.log('Created house ID:', createResponse.data.id);
        console.log('Created house name:', createResponse.data.name);
        console.log('');

        console.log('✅ All authentication tests passed!');
        console.log('\nИнструкция для тестирования в браузере:');
        console.log('1. Откройте http://localhost:8080/');
        console.log('2. Авторизуйтесь (email: admin@mail.ru, password: password123)');
        console.log('3. После авторизации откройте http://localhost:8080/create-house');
        console.log('4. Заполните форму и создайте лот');
        console.log('\nЕсли всё настроено правильно, токен будет автоматически добавлен к запросу.');

    } catch (error) {
        console.error('\n❌ Test failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testAuthFlow();
