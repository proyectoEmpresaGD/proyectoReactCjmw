import { ProductModel } from '../models/Postgres/productos.js';

export class ProductController {
  async getAll(req, res) {
    try {
      const { CodFamil, CodSubFamil, limit, page } = req.query;
      const limitParsed = parseInt(limit, 10) || 12;
      const pageParsed = parseInt(page, 10) || 1;
      const offset = (pageParsed - 1) * limitParsed;
      const products = await ProductModel.getAll({ CodFamil, CodSubFamil, limit: limitParsed, offset });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductModel.getById({ id });
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const newProduct = await ProductModel.create({ input: req.body });
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedProduct = await ProductModel.update({ id, input: req.body });
      if (updatedProduct) {
        res.json(updatedProduct);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await ProductModel.delete({ id });
      if (result) {
        res.json({ message: 'Product deleted' });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async search(req, res) {
    try {
      const { query, limit, page } = req.query;
      if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
      }
      const limitParsed = parseInt(limit, 10) || 12;
      const pageParsed = parseInt(page, 10) || 1;
      const offset = (pageParsed - 1) * limitParsed;
      const products = await ProductModel.search({
        query,
        limit: limitParsed,
        offset
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByCodFamil(req, res) {
    try {
      const { codfamil } = req.params;
      const products = await ProductModel.getByCodFamil(codfamil);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


}
