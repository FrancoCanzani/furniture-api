# Furniture API

Welcome to the Furniture API! This API is designed for managing and interacting with a furniture catalog. It supports features like filtering, sorting, stock updates, discounts, and more.

## Base URL

All endpoints are based at:

```
https://furniture-api.fly.dev
```

---

## Endpoints

### **GET** `/v1/products`

Fetch a list of products with optional filtering, sorting, and pagination.

#### Query Parameters

- **`limit`** _(optional, default: 10)_: Number of items per page. Min: 1, Max: 100.
- **`offset`** _(optional, default: 0)_: Offset for pagination.
- **`sort`** _(optional, default: `newest`)_:
  - Options: `price_asc`, `price_desc`, `name_asc`, `name_desc`, `newest`, `oldest`.
- **Filters**:
  - `name`: Partial match search on product name or category.
  - `category`: Product category (e.g., `sofa`, `chair`, `lamp`).
  - `wood_type`: Type of wood (e.g., `oak`, `maple`).
  - `finish`: Finish type (`natural`, `light`, `medium`, `dark`).
  - `min_price`, `max_price`: Price range filters.
  - `min_stock`, `max_stock`: Stock range filters.
  - `featured`: Boolean (`true` or `false`) to filter featured products.
  - `status`: Product status (`active` or `inactive`).

#### Response

```json
{
  "success": true,
  "count": 100,
  "data": [
    /* array of products */
  ]
}
```

---

### **GET** `/v1/products/:sku`

Retrieve details of a single product by SKU.

#### Path Parameter

- `sku`: Product SKU (UUID format).

#### Response

```json
{
  "success": true,
  "data": {
    /* product details */
  }
}
```

---

### **PATCH** `/v1/products/stock`

Update the stock levels of multiple products.

#### Request Body

```json
{
  "updates": [
    {
      "productSku": "string",
      "quantity": "integer"
    }
  ]
}
```

#### Response

```json
{
  "message": "Stock updated successfully",
  "results": [
    /* update results */
  ]
}
```

---

### **PATCH** `/v1/products/:sku/featured`

Toggle the "featured" status of a product.

#### Path Parameter

- `sku`: Product SKU.

#### Response

```json
{
  "success": true,
  "data": {
    /* updated product details */
  }
}
```

---

### **PATCH** `/v1/products/:sku/discount`

Apply a discount to a product by percentage or price.

#### Query Parameters

- `discountPercentage`: Discount as a percentage (0-100).
- `discountPrice`: Final discounted price (must be less than the original price).

#### Response

```json
{
  "success": true,
  "data": {
    /* updated product details */
  }
}
```

---

## Key Features

### Filtering and Sorting

- Comprehensive filters for price, stock, category, and more.
- Sorting options for price, name, and creation date.

### Stock Management

- Bulk stock updates with validation to prevent negative stock levels.

### AI-Generated Data

- Product data is generated using OpenAI GPT-based models.
- Images are created with Stable Diffusion and optimized with `sharp`.

### Rate Limiting

- API rate limited to 100 requests per day per IP.

### Cron Jobs

- Automated tasks such as resetting stock levels.

---

## Technologies and Libraries Used

- **Backend Framework**: Express.js
- **Database**: Supabase (PostgreSQL-based backend as a service).
- **Image Compression**: `sharp`
- **AI Integration**:
  - OpenAI for generating product data.
  - Stable Diffusion for generating product images.
- **Validation**: `zod`
- **Security**:
  - Helmet for securing HTTP headers.
  - CORS enabled for cross-origin requests.
- **Rate Limiting**: `express-rate-limit`

---

## Setup Instructions

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set environment variables:
   - `PUBLIC_ANON_KEY` (Supabase Public Key).
   - `GETIMG_API_KEY` (Image API Key).
4. Run the development server:
   ```bash
   npm start
   ```
5. Access the API at:
   ```
   http://localhost:3000
   ```

---

## Example Use Cases

1. Fetch all chairs under $500:

   ```
   GET /v1/products?category=chair&max_price=500
   ```

2. Update stock for multiple products:

   ```json
   PATCH /v1/products/stock
   {
     "updates": [
       { "productSku": "sku-123", "quantity": 5 },
       { "productSku": "sku-456", "quantity": -3 }
     ]
   }
   ```

3. Mark a product as featured:
   ```
   PATCH /v1/products/:sku/featured
   ```

---

## License

This project is licensed under the MIT License. See `LICENSE` for details.
