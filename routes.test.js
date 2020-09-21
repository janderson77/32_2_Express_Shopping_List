process.env.NODE_ENV = 'test';

const request = require('supertest');

const app = require('./app');
let items = require('./fakeDb');

let snickers = { name: 'snickers', price: 1.99 };

beforeEach(function() {
	items.push(snickers);
});

afterEach(function() {
	items.length = 0;
});

describe('GET /items', () => {
	test('Get all items', async () => {
		const res = await request(app).get('/items');
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ items: [ snickers ] });
	});
});

describe('GET /items/:name', () => {
	test('Get and item by name', async () => {
		const res = await request(app).get(`/items/${snickers.name}`);

		expect(res.statusCode).toBe(200);
		expect(res.body.name).toMatch(snickers.name);
		expect(JSON.stringify(res.body.price)).toMatch(JSON.stringify(snickers.price));
	});
	test('Resonds with 404 for invalid item', async () => {
		const res = await request(app).get(`/items/skittles`);
		expect(res.statusCode).toBe(404);
	});
});

describe('POST /items', () => {
	test('Creating an item', async () => {
		const res = await request(app).post('/items').send({ name: 'Pocky', price: 5.99 });
		expect(res.statusCode).toBe(201);
	});
	test('Responds with 400 if name is missing', async () => {
		const res = await request(app).post('/items').send({ price: 1.99 });
		expect(res.statusCode).toBe(400);
	});
	test('Responds with 400 if price is missing', async () => {
		const res = await request(app).post('/items').send({ name: 'Pocky' });
		expect(res.statusCode).toBe(400);
	});
});

describe('PATCH /items/:name', () => {
	test('Updating an items name', async () => {
		const res = await request(app).patch(`/items/${snickers.name}`).send({ name: 'Mars' });
		expect(res.statusCode).toBe(200);
		expect(res.body.name).toEqual('Mars');
		expect(res.body.price).toEqual(snickers.price);
	});
	test('Updating an items price', async () => {
		const res = await request(app).patch(`/items/${snickers.name}`).send({ price: 1.49 });
		expect(res.statusCode).toBe(200);
		expect(res.body.price).toEqual(1.49);
		expect(res.body.name).toEqual(snickers.name);
	});
	test('Updating an items name and price', async () => {
		const res = await request(app).patch(`/items/${snickers.name}`).send({
			name: 'Mars',
			price: 1.49
		});
		expect(res.statusCode).toBe(200);
		console.log(res.body);
		expect(res.body).toEqual({ name: 'Mars', price: 1.49 });
	});
});

describe('DELETE /items/:name', () => {
	test('Deleting an item', async () => {
		const res = await request(app).delete(`/items/${snickers.name}`);
		expect(res.statusCode).toBe(200);
	});
	test('Responds with 404 for invalid item', async () => {
		const res = await request(app).delete(`/items/Pocky`);
		expect(res.statusCode).toBe(404);
	});
});
