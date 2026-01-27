import axios from 'axios';

async function testCreateHouse() {
    console.log('Testing house creation API...\n');

    // 1. Сначала нужно авторизоваться
    console.log('1. Logging in...');
    try {
        const loginResponse = await axios.post('http://localhost:3000/auth/login', {
            email: 'admin@mail.ru',
            password: 'password123'
        });

        const token = loginResponse.data.token;
        console.log('✓ Login successful, token received\n');

        // 2. Тестируем получение списка лотов
        console.log('2. Getting all houses...');
        const housesResponse = await axios.get('http://localhost:3000/houses');
        console.log(`✓ Found ${housesResponse.data.length} houses\n`);

        // 3. Создаем новый лот
        console.log('3. Creating new house...');
        const newHouse = {
            name: 'Тестовый дом с API',
            prevText: 'Это тестовый дом, созданный через API',
            text: 'Полное описание тестового дома. Он создан для проверки работы API создания лотов.',
            startPrice: 25000000,
            images: ['test-1.jpg', 'test-2.jpg'],
            mainImage: 'test-main.jpg',
            country: 'Казахстан',
            city: 'Алматы',
            street: 'ул. Тестовая',
            address: 'д. 1',
            area: 150,
            countRoom: 4,
            year: 2023,
            auctionStartDate: new Date('2026-03-01 10:00:00')
        };

        const createResponse = await axios.post('http://localhost:3000/houses', newHouse, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('✓ House created successfully!');
        console.log('Created house ID:', createResponse.data.id);
        console.log('Created house name:', createResponse.data.name);
        console.log('Created house price:', createResponse.data.startPrice);
        console.log('Created house city:', createResponse.data.city);
        console.log('Created house street:', createResponse.data.street);
        console.log('Created house year:', createResponse.data.year);
        console.log('');

        // 4. Проверяем, что новый лот появился в списке
        console.log('4. Verifying new house in list...');
        const updatedHousesResponse = await axios.get('http://localhost:3000/houses');
        console.log(`✓ Now there are ${updatedHousesResponse.data.length} houses\n`);

        // 5. Получаем созданный лот по ID
        console.log('5. Getting created house by ID...');
        const houseByIdResponse = await axios.get(`http://localhost:3000/houses/${createResponse.data.id}`);
        console.log('✓ House retrieved successfully!');
        console.log('Retrieved house name:', houseByIdResponse.data.name);
        console.log('Retrieved house images:', houseByIdResponse.data.images);
        console.log('Retrieved house auction start date:', houseByIdResponse.data.auctionStartDate);
        console.log('');

        console.log('✅ All tests passed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

testCreateHouse();
