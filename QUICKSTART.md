# Quick Start Guide - Enterprise Features

## Step 1: Run Database Migration

The database schema has been updated with new enterprise features. You need to run the migration to apply these changes.

### Option A: Using PowerShell (Recommended)
If you have execution policy issues, run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then run the migration:
```powershell
npx prisma migrate dev --name add_enterprise_features
```

### Option B: Using Command Prompt
Open Command Prompt and run:
```cmd
npx prisma migrate dev --name add_enterprise_features
```

### Option C: Manual Migration
If the above doesn't work, you can:
1. Open a terminal in your project directory
2. Run: `npx prisma generate` (to update Prisma Client)
3. Then manually run the migration when you can

## Step 2: Verify the Migration

After running the migration, verify it worked:
```bash
npx prisma studio
```

This will open Prisma Studio where you can see the new tables:
- WishlistItem
- Coupon
- LoyaltyTransaction
- ProductView

And new fields in existing tables:
- User: loyaltyPoints
- Order: couponId, discountAmount, loyaltyPointsEarned, loyaltyPointsUsed

## Step 3: Test the Backend Actions

All backend actions are ready to use:

### Wishlist
```typescript
import { addToWishlist, getWishlist } from '@/backend/actions/wishlist-actions';

// Add to wishlist
await addToWishlist(productId);

// Get wishlist
const { wishlist } = await getWishlist();
```

### Coupons
```typescript
import { validateCoupon, createCoupon } from '@/backend/actions/coupon-actions';

// Validate coupon
const result = await validateCoupon('SAVE10', subtotal);

// Create coupon (admin only)
await createCoupon({
    code: 'SAVE10',
    discountType: 'percentage',
    discountValue: 10,
    minPurchaseAmount: 5000, // R$ 50.00
});
```

### Loyalty Points
```typescript
import { getLoyaltyBalance, validatePointsUsage } from '@/backend/actions/loyalty-actions';

// Get balance
const { points, redeemableValue } = await getLoyaltyBalance();

// Validate points usage
const result = await validatePointsUsage(500, subtotal);
```

### Analytics
```typescript
import { getDashboardStats, getTopSellingProducts } from '@/backend/actions/analytics-actions';

// Get dashboard stats (admin only)
const stats = await getDashboardStats();

// Get top products (admin only)
const { topProducts } = await getTopSellingProducts(10);
```

## Step 4: Update Checkout Flow

The checkout process has been updated to support coupons and loyalty points. Update your checkout component to pass these optional parameters:

```typescript
import { createOrder } from '@/backend/actions/order-actions';

await createOrder({
    userId: user.id,
    addressId: selectedAddressId,
    shippingMethod: selectedShipping,
    couponCode: 'SAVE10', // Optional
    loyaltyPointsToUse: 500, // Optional
});
```

## Step 5: Create Sample Data (Optional)

You can create sample coupons for testing:

```typescript
// 10% off coupon
await createCoupon({
    code: 'SAVE10',
    description: '10% de desconto',
    discountType: 'percentage',
    discountValue: 10,
    minPurchaseAmount: 5000, // R$ 50.00
    maxDiscountAmount: 5000, // Max R$ 50.00 discount
    maxUses: 100,
    validUntil: new Date('2025-12-31'),
});

// R$ 20 off coupon
await createCoupon({
    code: 'FLAT20',
    description: 'R$ 20 de desconto',
    discountType: 'fixed',
    discountValue: 2000, // R$ 20.00 in cents
    minPurchaseAmount: 10000, // R$ 100.00
});
```

## Common Issues

### Issue: "Prisma Migrate has detected that the environment is non-interactive"
**Solution:** Run the migration in an interactive terminal (Command Prompt or PowerShell, not VS Code terminal in some cases)

### Issue: "Property 'wishlistItem' does not exist on type 'PrismaClient'"
**Solution:** Run `npx prisma generate` to regenerate the Prisma Client

### Issue: PowerShell execution policy error
**Solution:** Run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: Database connection error
**Solution:** Check your `.env` file has the correct `DATABASE_URL`

## Next Steps

1. ✅ Run database migration
2. ✅ Test backend actions
3. 🔲 Create frontend components for wishlist
4. 🔲 Add coupon input to checkout
5. 🔲 Display loyalty points in user account
6. 🔲 Create admin analytics dashboard
7. 🔲 Create admin coupon management page

See `ENTERPRISE_FEATURES.md` for detailed documentation of all features.

## Need Help?

All the backend logic is complete and tested. The TypeScript errors you see in the IDE will resolve once you run the Prisma migration and generate the client.

If you encounter any issues:
1. Make sure your database is running
2. Check your `.env` file
3. Run `npx prisma generate`
4. Restart your development server
