import type { Config } from "@measured/puck";
import PromoBannerCarousel from "@/frontend/components/PromoBannerCarousel";
import DynamicProductSection from "@/frontend/components/puck/DynamicProductSection";
import CategoryGrid from "@/frontend/components/puck/CategoryGrid";
import BenefitsBar from "@/frontend/components/puck/BenefitsBar";
import FeaturedCategories from "@/frontend/components/FeaturedCategories";

type Props = {
    Hero: {};
    ProductCollection: {
        title: string;
        subtitle?: string;
        type: 'trending' | 'promo' | 'new' | 'viewed';
    };
    CategoryGrid: {};
    BenefitsBar: {};
    FeaturedCategories: {};
};

export const config: Config<Props> = {
    components: {
        Hero: {
            render: () => <PromoBannerCarousel />,
        },
        ProductCollection: {
            fields: {
                title: { type: "text" },
                subtitle: { type: "text" },
                type: {
                    type: "select",
                    options: [
                        { label: "Mais Vendidos", value: "trending" },
                        { label: "Promoções", value: "promo" },
                        { label: "Novidades", value: "new" },
                        { label: "Vistos Recentemente", value: "viewed" },
                    ]
                }
            },
            defaultProps: {
                title: "Destaques",
                type: "trending"
            },
            render: (props) => (
                <DynamicProductSection {...props} />
            ),
        },
        CategoryGrid: {
            render: () => <CategoryGrid />
        },
        BenefitsBar: {
            render: () => <BenefitsBar />
        },
        FeaturedCategories: {
            render: () => <FeaturedCategories />
        }
    },
};

export default config;
