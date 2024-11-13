src/
├── app.ts
├── config/
│ └── database.ts # Supabase config
├── controllers/
│ └── furniture.controller.ts
├── middleware/
│ ├── auth.middleware.ts
│ └── error.middleware.ts
├── routes/
│ └── furniture.routes.ts
├── services/
│ └── furniture.service.ts
├── types/
│ └── furniture.types.ts
├── lib/
│ └── helpers/
│ └── ai-generation.ts # Your AI helper
└── utils/
└── image-processor.ts # Sharp image processing utils

--

/api/v1/products/
→ general.routes.ts
GET / # List all products
GET /:id # Get single product
POST / # Create product
PUT /:id # Update product
DELETE /:id # Delete product

/api/v1/products/inventory/
→ inventory.routes.ts
PATCH /:id/stock # Update stock
PATCH /:id/status # Change status
GET /low-stock # Get low stock products

/api/v1/products/featured/
→ featured.routes.ts
GET / # Get featured products
PATCH /:id/toggle # Toggle featured status

/api/v1/products/categories/
→ categories.routes.ts
GET / # List all categories
GET /:category # Get products by category
GET /:category/stats # Get category statistics

/api/v1/products/images/
→ images.routes.ts
POST /:id/upload # Upload images
DELETE /:id/:imageId # Delete image
