import type { Config } from "@measured/puck";
import PromoBannerCarousel from "@/frontend/components/PromoBannerCarousel";
import DynamicProductSection from "@/frontend/components/puck/DynamicProductSection";
import CategoryGrid from "@/frontend/components/puck/CategoryGrid";
import BenefitsBar from "@/frontend/components/puck/BenefitsBar";
import FeaturedCategories from "@/frontend/components/FeaturedCategories";

type Props = {
    Hero: {
        banners: { id?: string; imageUrl: string; title: string; subtitle: string; link: string }[];
    };
    ProductCollection: {
        title: string;
        subtitle?: string;
        type: 'trending' | 'promo' | 'new' | 'viewed';
    };
    CategoryGrid: {};
    BenefitsBar: {
        items: { title: string; subtitle: string }[];
    };
    FeaturedCategories: {};
};

export const config: Config<Props> = {
    components: {
        Hero: {
            fields: {
                banners: {
                    type: "array",
                    getItemSummary: (item) => item.title || "Banner",
                    arrayFields: {
                        imageUrl: { type: "text" },
                        title: { type: "text" },
                        subtitle: { type: "text" },
                        link: { type: "text" }
                    }
                }
            },
            defaultProps: {
                banners: [
                    {
                        id: '1',
                        imageUrl: '/images/banner-final-1.png',
                        title: 'Super Oferta',
                        subtitle: 'Confira nossos preços',
                        link: '/search'
                    }
                ]
            },
            render: ({ banners }) => <PromoBannerCarousel banners={banners.map((b, i) => ({ ...b, id: b.id || String(i) }))} />,
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
            fields: {
                items: {
                    type: "array",
                    getItemSummary: (item) => item.title || "Benefício",
                    arrayFields: {
                        title: { type: "text" },
                        subtitle: { type: "text" }
                    }
                }
            },
            defaultProps: {
                items: [
                    { title: "Frete Grátis", subtitle: "Em compras acima de R$ 99" },
                    { title: "Pagamento Seguro", subtitle: "Seus dados protegidos" },
                    { title: "Troca Grátis", subtitle: "Até 30 dias após a compra" }
                ]
            },
            render: ({ items }) => <BenefitsBar items={items} />
        },
        FeaturedCategories: {
            render: () => <FeaturedCategories />
        }
    },
};

export default config;
