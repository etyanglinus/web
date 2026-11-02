import React from 'react';
import {
    Box,
    Typography,
    useTheme,
    alpha
} from '@mui/material';
import NextImage from 'components/NextImage';
import DollarSignHighlighter from 'components/DollarSignHighlighter';
import CustomSlider from 'components/common/CustomSlider';


interface CardData {
    id: number;
    image: string;
    image_full_url: string;
}

interface PopularClientSection {
    popular_client_title: string;
    popular_client_sub_title: string;
    cards: CardData[];
}

interface ClientSectionProps {
    popular_client_section: PopularClientSection;
}

// Swiper breakpoints are min-width ascending — 1 card on mobile, 2 on
// tablet (<md), 8 from md up, matching the original getVisibleCards() steps.
const clientSectionBreakpoints = {
    600: { slidesPerView: 2 },
    900: { slidesPerView: 8 },
};

const ClientSection: React.FC<ClientSectionProps> = ({ popular_client_section }) => {
    const theme = useTheme();

    const cards = popular_client_section?.cards || [];

    return (
        <Box sx={{ py: 6 }}>
            <Box textAlign="center" mb={4}>
                <Typography
                    variant="h3"
                    fontSize={{ xs: "18px", md: '30px' }}
                    mb={1}
                >
                    <DollarSignHighlighter text={popular_client_section?.popular_client_title || 'Our Clients'} theme={theme} />
                    { }
                </Typography>
                <Typography
                    variant="h6"
                    color="text.secondary"
                    fontSize={{ xs: "14px", md: '16px' }}
                    fontWeight="400"
                >
                    {popular_client_section?.popular_client_sub_title || 'Trusted by leading brands for fast and reliable delivery services.'}
                </Typography>
            </Box>

            <CustomSlider
                items={cards}
                getKey={(card: CardData) => card.id}
                renderItem={(card: CardData) => (
                    <Box
                        sx={{
                            backgroundColor: alpha(theme.palette.neutral[200], .5),
                            borderRadius: 2.5,
                            overflow: 'hidden',
                            width: 130,
                            height: 130,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',

                            '& img': {
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }
                        }}
                    >
                        <NextImage
                            width={130}
                            src={card.image_full_url}
                            alt={`Card ${card.id}`}
                            objectFit="cover"
                            height={130}
                            borderRadius="5px"
                            aspectRatio="1/1"
                        />
                    </Box>
                )}
                arrowVariant="inline"
                stretchItems={false}
                slidesPerView={"auto" as any}
                spaceBetween={16}
                breakpoints={clientSectionBreakpoints}
            />
        </Box>
    );
};

export default ClientSection;
