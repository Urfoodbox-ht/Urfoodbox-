import { StorefrontShell } from '../components/StorefrontShell.tsx';
import { getStorefrontData } from '../db/queries.ts';
import type { BusinessSettings, CustomerComment, Product } from '../types.ts';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let initialSettings: BusinessSettings | null = null;
  let initialProducts: Product[] = [];
  let initialComments: CustomerComment[] = [];

  try {
    const data = await getStorefrontData();
    const logoUrl = data.settings?.logoImageId
      ? `/api/images/${data.settings.logoImageId}`
      : '/assets/aistudio/IMG-20261115-WA0000_6c778049_6c778049.jpg';

    initialSettings = data.settings
      ? JSON.parse(
          JSON.stringify({
            ...data.settings,
            logoUrl,
          })
        )
      : null;
    initialProducts = JSON.parse(JSON.stringify(data.products || []));
    initialComments = JSON.parse(JSON.stringify(data.comments || []));
  } catch {
    // Client shell will retry /api/storefront gracefully if SSR DB load fails
  }

  return (
    <StorefrontShell
      initialSettings={initialSettings}
      initialProducts={initialProducts}
      initialComments={initialComments}
    />
  );
}
