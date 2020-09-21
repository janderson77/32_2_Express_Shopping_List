const express = require('express');
const ExpressError = require('./expressError');
const router = new express.Router();
const items = require('./fakeDb');

router.get('/', (req, res) => {
	res.json({ items });
});

router.post('/', (req, res, next) => {
	try {
		if (!req.body.name) throw new ExpressError('Name is required', 400);
		const newItem = { name: req.body.name, price: req.body.price };
		if (!req.body.price) throw new ExpressError('Price is required', 400);
		items.push(newItem);
		return res.status(201).json({ Added: newItem });
	} catch (e) {
		return next(e);
	}
});

router.get('/:item', (req, res) => {
	const foundItem = items.find((item) => item.name === req.params.item);
	console.log(req.params.item);
	if (foundItem === undefined) {
		throw new ExpressError('Item not found', 404);
	}
	res.json(foundItem);
});

router.patch('/:item', (req, res, next) => {
	try {
		const foundItem = items.find((item) => item.name === req.params.item);
		if (foundItem === undefined) {
			throw new ExpressError(`${req.params.item} not found`, 404);
		}
		if (!req.body.price) {
			let saveitem = foundItem;
			foundItem.name = req.body.name;
			foundItem.price = saveitem.price;
			res.json(foundItem);
		} else if (!req.body.name) {
			let saveitem = foundItem;
			foundItem.price = req.body.price;
			foundItem.name = saveitem.name;
			res.json(foundItem);
		} else {
			foundItem.name = req.body.name;
			foundItem.price = req.body.price;
		}
		res.json(foundItem);
	} catch (e) {
		return next(e);
	}
});

router.delete('/:item', (req, res, next) => {
	try {
		const foundItem = items.findIndex((item) => item.name === req.params.item);
		if (foundItem === -1) {
			throw new ExpressError('Item not found', 404);
		}
		items.splice(foundItem, 1);
		res.json({ message: 'Deleted' });
	} catch (e) {
		return next(e);
	}
});

module.exports = router;
