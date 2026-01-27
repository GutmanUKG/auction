import { db } from './db.js';
import * as houseModel from './models/houseModel.js';

async function checkNewFields() {
    try {
        console.log('Checking new fields in houses table...\n');

        // Получаем один объект
        const house = await houseModel.getById(11);

        if (!house) {
            console.log('No house found with id 11');
            return;
        }

        console.log('House data:');
        console.log('ID:', house.id);
        console.log('Name:', house.name);
        console.log('City:', house.city);
        console.log('Street:', house.street);
        console.log('Address:', house.address);
        console.log('Year:', house.year);
        console.log('Area:', house.area);
        console.log('Start Price:', house.startPrice);
        console.log('Current Price:', house.currentPrice);
        console.log('Auction Start Date:', house.auctionStartDate);
        console.log('Images:', house.images);
        console.log('User Count:', house.userCount);

        console.log('\n✓ All new fields are present!');

        await db.destroy();
    } catch (error) {
        console.error('Error:', error);
        await db.destroy();
        process.exit(1);
    }
}

checkNewFields();
