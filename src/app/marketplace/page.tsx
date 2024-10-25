
import { TransportMarketplaceComponent } from "@/components/transport-marketplace";
import { db } from "@/db";
const rewards = await db.reward.findMany({
    select: {
        id: true,
        name: true,
        points: true,
        category: {
            select: {
                name: true,
            }
        }
    },
    orderBy: {
        points: "asc",
    },
});
export type Rewards = typeof rewards;
const MarketplacePage = () => {
    return (
        <TransportMarketplaceComponent props={{
            rewards
        }} />
    );
};

export default MarketplacePage;