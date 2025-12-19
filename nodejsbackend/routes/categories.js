/**
 * Categories Routes
 * Handles category management for admins
 */

const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const User = require('../models/User');

/**
 * Middleware to check if user is authenticated
 */
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  next();
};

/**
 * Middleware to check if user is admin
 */
const isAdmin = async (req, res, next) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userId = req.user._id || req.user.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid user session'
      });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.toLowerCase().trim()) : [];
    const emailLower = user.email.toLowerCase();
    
    let isAdminUser = user.isAdmin === true || 
                      adminEmails.includes(emailLower) || 
                      emailLower.includes('admin@');
    
    if (!isAdminUser) {
      try {
        const adminConfig = require('../config/admin.js');
        if (adminConfig && adminConfig.accounts) {
          const adminAccount = adminConfig.accounts.find(
            acc => acc.email.toLowerCase() === emailLower
          );
          if (adminAccount) {
            if (!user.isAdmin) {
              user.isAdmin = true;
              user.adminPermissions = adminAccount.permissions || ['all'];
              await user.save();
            }
            isAdminUser = true;
          }
        }
      } catch (e) {
        // Admin config not accessible
      }
    }
    
    if (!isAdminUser) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    req.adminUser = user;
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({
      success: false,
      message: 'Authorization check failed'
    });
  }
};

/**
 * GET /api/categories
 * Get all categories (public access)
 */
router.get('/categories', async (req, res) => {
  try {
    const { active } = req.query;
    
    const query = {};
    if (active === 'true') {
      query.isActive = true;
    }

    const categories = await Category.find(query).sort({ order: 1, name: 1 });

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

/**
 * GET /api/categories/:id
 * Get a specific category
 */
router.get('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      category
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category'
    });
  }
});

/**
 * POST /api/admin/categories
 * Create a new category (admin only)
 */
router.post('/admin/categories', isAdmin, async (req, res) => {
  try {
    const { name, icon, description, color, order } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    // Check if category already exists
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const category = new Category({
      name: name.trim(),
      slug,
      icon: icon || '📁',
      description: description || '',
      color: color || '#6366f1',
      order: order !== undefined ? order : 0
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category'
    });
  }
});

/**
 * PUT /api/admin/categories/:id
 * Update a category (admin only)
 */
router.put('/admin/categories/:id', isAdmin, async (req, res) => {
  try {
    const { name, icon, description, color, order, isActive } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Update fields
    if (name !== undefined) {
      category.name = name.trim();
      category.slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    if (icon !== undefined) category.icon = icon;
    if (description !== undefined) category.description = description;
    if (color !== undefined) category.color = color;
    if (order !== undefined) category.order = order;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.json({
      success: true,
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category'
    });
  }
});

/**
 * DELETE /api/admin/categories/:id
 * Delete a category (admin only)
 */
router.delete('/admin/categories/:id', isAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category'
    });
  }
});

/**
 * POST /api/admin/categories/:id/subcategories
 * Add a subcategory (admin only)
 */
router.post('/admin/categories/:id/subcategories', isAdmin, async (req, res) => {
  try {
    const { name, icon, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Subcategory name is required'
      });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if subcategory already exists
    const existing = category.subcategories.find(sub => sub.slug === slug);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Subcategory with this name already exists'
      });
    }

    category.subcategories.push({
      name: name.trim(),
      slug,
      icon: icon || '📄',
      description: description || ''
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: 'Subcategory added successfully',
      category
    });
  } catch (error) {
    console.error('Add subcategory error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add subcategory'
    });
  }
});

/**
 * DELETE /api/admin/categories/:id/subcategories/:subId
 * Delete a subcategory (admin only)
 */
router.delete('/admin/categories/:id/subcategories/:subId', isAdmin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    category.subcategories = category.subcategories.filter(
      sub => sub._id.toString() !== req.params.subId
    );

    await category.save();

    res.json({
      success: true,
      message: 'Subcategory deleted successfully',
      category
    });
  } catch (error) {
    console.error('Delete subcategory error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete subcategory'
    });
  }
});

module.exports = router;

