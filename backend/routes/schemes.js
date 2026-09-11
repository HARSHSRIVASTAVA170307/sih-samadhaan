const express = require('express');
const schemesService = require('../services/schemesService');

const router = express.Router();

/* GET /api/schemes?q=&category=&page=&pageSize=&sort= */
router.get('/', (req, res) => {
  try {
    const result = schemesService.listSchemes(req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load schemes data.' });
  }
});

/* GET /api/schemes/categories */
router.get('/categories', (req, res) => {
  res.json({ categories: schemesService.getCategories() });
});

/* GET /api/schemes/stats */
router.get('/stats', (req, res) => {
  try {
    res.json(schemesService.getStats());
  } catch (err) {
    res.status(500).json({ error: 'Failed to load scheme statistics.' });
  }
});

/* GET /api/schemes/:id */
router.get('/:id', (req, res) => {
  const scheme = schemesService.getSchemeById(req.params.id);
  if (!scheme) {
    res.status(404).json({ error: 'Scheme not found', id: req.params.id });
    return;
  }
  res.json(scheme);
});

module.exports = router;
