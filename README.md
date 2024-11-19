# 🪑 Furniture API

A robust REST API for managing a furniture catalog with advanced features including AI-generated content, real-time stock management, and dynamic pricing.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
  - [Base URL](#base-url)
  - [Rate Limits](#rate-limits)
- [API Endpoints](#api-endpoints)
  - [Product Listing](#product-listing)
  - [Product Details](#product-details)
  - [Stock Management](#stock-management)
  - [Featured Products](#featured-products)
  - [Product Discounts](#product-discounts)
- [Data Models](#data-models)
- [Feature Details](#feature-details)
- [Error Handling](#error-handling)
- [Development](#development)
- [Deployment](#deployment)
- [Examples](#examples)

## Overview

The Furniture API provides a comprehensive solution for managing an online furniture catalog. Key features include:

- 🔍 Advanced filtering and search capabilities
- 📦 Real-time stock management
- 💰 Dynamic pricing and discounts
- 🤖 AI-generated product data and images
- 🔄 Automated maintenance tasks
- 🔒 Built-in security features

## API Showcase

Want to see what you can build with this API? Check out our demo e-commerce site:

[furniture-api-showcase.vercel.app](https://furniture-api-showcase.vercel.app)

The showcase demonstrates:

- 🎨 Clean, modern UI built with React + TypeScript
- 🔍 Real-time product search and filtering
- ♾️ Infinite scroll product listing
- 🛒 Shopping cart functionality
- 📱 Fully responsive design

The source code for the showcase is available in our [GitHub repository](https://github.com/yourusername/furniture-api-showcase), demonstrating best practices for:

- API integration
- Rate limit handling
- Error management
- State management
- Performance optimization

Use this showcase as a reference for implementing your own frontend using the Furniture API.

## Getting Started

### Base URL

```
https://furniture-api.fly.dev
```

### Rate Limits

- 500 requests per IP address per day
- Exceeded limits return `429 Too Many Requests`
- Headers include `X-RateLimit-Remaining` for tracking

## API Endpoints

### Product Listing

**GET** `/v1/products`

Retrieve a paginated list of products with comprehensive filtering options.

#### Query Parameters

| Parameter | Type    | Default  | Description                |
| --------- | ------- | -------- | -------------------------- |
| limit     | number  | 10       | Items per page (1-100)     |
| offset    | number  | 0        | Pagination offset          |
| sort      | string  | 'newest' | Sorting method             |
| name      | string  | -        | Search in names/categories |
| category  | string  | -        | Product category filter    |
| wood_type | string  | -        | Wood type filter           |
| finish    | string  | -        | Finish type filter         |
| min_price | number  | -        | Minimum price filter       |
| max_price | number  | -        | Maximum price filter       |
| min_stock | number  | -        | Minimum stock filter       |
| max_stock | number  | -        | Maximum stock filter       |
| featured  | boolean | -        | Featured products filter   |

#### Valid Values

```typescript
sort: ['price_asc', 'price_desc', 'name_asc', 'name_desc', 'newest', 'oldest'];
category: [
  'sofa',
  'chair',
  'stool',
  'table',
  'desk',
  'kitchen',
  'vanitory',
  'matress',
  'mirror',
  'wardrove',
  'lamp',
  'tv table',
  'garden',
];
wood_type: [
  'walnut',
  'maple',
  'oak',
  'pine',
  'eucalyptus',
  'bamboo',
  'teak',
  'cedar',
];
finish: ['dark', 'medium', 'light', 'natural'];
```

#### Response Example

```json
{
  "success": true,
  "count": 100,
  "data": [
    {
      "id": "uuid",
      "name": "Modern Oak Chair",
      "category": "chair",
      "description": "Comfortable modern chair...",
      "wood_type": "oak",
      "finish": "natural",
      "dimensions": {
        "width": 60,
        "height": 90,
        "depth": 55
      },
      "price": 299.99,
      "discount_price": 249.99,
      "weight": 12,
      "image_path": "https://...",
      "stock": 50,
      "sku": "uuid",
      "status": "active",
      "featured": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Product Details

**GET** `/v1/products/:sku`

Retrieve detailed information about a specific product.

#### Path Parameters

- `sku`: Product SKU (UUID format)

#### Response Example

```json
{
  "success": true,
  "data": {
    // Same structure as individual product in listing
  }
}
```

### Stock Management

**PATCH** `/v1/products/stock`

Update stock levels for multiple products in a single request.

#### Request Body

```json
{
  "updates": [
    {
      "productSku": "uuid",
      "quantity": 5 // Positive for addition, negative for subtraction
    }
  ]
}
```

#### Response Example

```json
{
  "message": "Stock updated successfully",
  "results": [
    {
      "sku": "uuid",
      "success": true,
      "newStock": 55
    }
  ]
}
```

### Featured Products

**PATCH** `/v1/products/:sku/featured`

Toggle a product's featured status.

#### Path Parameters

- `sku`: Product SKU (UUID format)

#### Response Example

```json
{
  "success": true,
  "data": {
    // Updated product details
  }
}
```

### Product Discounts

**PATCH** `/v1/products/:sku/discount`

Apply a discount to a product.

#### Query Parameters

- `discountPercentage`: Percentage discount (1-99)
- `discountPrice`: Direct discounted price

**Note**: Provide either `discountPercentage` or `discountPrice`, not both.

#### Response Example

```json
{
  "success": true,
  "data": {
    // Updated product details with new pricing
  }
}
```

## Data Models

### Product Schema

```typescript
interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  wood_type: string;
  finish: string;
  dimensions: {
    depth: number;
    width: number;
    height: number;
  };
  price: number;
  weight: number;
  image_path: string;
  stock: number;
  sku: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  featured: boolean;
  discount_price?: number;
  tags?: string[] | null;
}
```

## Feature Details

### AI Integration

- Product descriptions generated using GPT-4
- Product images created with Stable Diffusion XL
- Image optimization using Sharp
  - Compression: 80% quality
  - Size: Max 1200x1200px
  - Format: JPEG with mozjpeg optimization

### Automated Tasks

- Daily stock reset at midnight (PST)
- Configurable via cron expressions in `jobs.ts`

### Security Features

- Helmet.js for secure headers
- CORS protection
- Rate limiting
- Input validation using Zod

## Error Handling

### Common Error Codes

- `400`: Invalid request parameters
- `404`: Resource not found
- `429`: Rate limit exceeded
- `500`: Internal server error

### Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information"
}
```

## Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- GetImg API key (for image generation)

### Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/furniture-api.git
cd furniture-api
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```bash
PUBLIC_ANON_KEY=your-supabase-key
GETIMG_API_KEY=your-getimg-key
PORT=3000
```

4. Start development server:

```bash
npm run dev
```

### Testing

```bash
npm run test        # Run tests
npm run test:watch  # Watch mode
```

## Deployment

### Fly.io Deployment

1. Install Fly CLI
2. Initialize Fly app:

```bash
fly launch
```

3. Deploy:

```bash
fly deploy
```

### Environment Variables

Set these in your deployment environment:

```bash
fly secrets set PUBLIC_ANON_KEY=your-key
fly secrets set GETIMG_API_KEY=your-key
```

## Examples

### Complex Filtering Example

```bash
# Get all oak chairs under $500, sorted by price
curl "https://furniture-api.fly.dev/v1/products?category=chair&wood_type=oak&max_price=500&sort=price_asc"
```

### Bulk Stock Update

```bash
curl -X PATCH "https://furniture-api.fly.dev/v1/products/stock" \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {"productSku": "uuid1", "quantity": 5},
      {"productSku": "uuid2", "quantity": -3}
    ]
  }'
```

### Apply Percentage Discount

```bash
curl -X PATCH "https://furniture-api.fly.dev/v1/products/uuid/discount?discountPercentage=20"
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support open an issue on GitHub.

---

_Last updated: November 17, 2024_
