'use client';

import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import {
  Button,
  Center,
  CheckIcon,
  Container,
  Grid,
  Image,
  Paper,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useActivities } from '@/lib/bingo/hooks';
import { download } from '@/lib/bingo/util-download';
import { useMediaQuery, useViewportSize } from '@mantine/hooks';

const activities = [
  'Drank coffee today',
  'Wore matching socks',
  'Checked social media',
  'Ate something sweet',
  'Made your bed',
  'Listened to music',
  'Took a photo',
  'Called a friend',
  'Went outside',
];

export default function BingoGame() {
  const { clickedSquares, toggleSquare } = useActivities(activities);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const isTablet = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  const checkWin = () => {
    return clickedSquares.every((square) => square);
  };

  const isWinner = checkWin();

  const exportAsPng = async () => {
    if (!cardRef.current) return;

    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        backgroundColor: '#ffffff',
        quality: 1.0,
        pixelRatio: 3,
        cacheBust: true,
        canvasWidth: 1080,
        canvasHeight: 1920,
      });

      download(dataUrl, 'bingo-card.png');
    } catch (error) {
      console.error('Error exporting PNG:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Enhanced responsive sizing calculations
  const cardMaxWidth = isMobile ? '100vw' : isTablet ? '400px' : '500px';
  const cardPadding = isMobile ? 'sm' : isTablet ? 'md' : 'xl';
  const titleSize = isMobile ? 'h4' : isTablet ? 'h3' : 'h1';
  const activityTextSize = isMobile ? '10px' : isTablet ? 'xs' : 'sm';
  const gridGutter = isMobile ? 4 : isTablet ? 6 : 8;
  const squarePadding = isMobile ? 4 : isTablet ? 6 : 8;
  const checkIconSize = isMobile ? 14 : isTablet ? 16 : 24;
  const logoHeight = isMobile ? 30 : isTablet ? 35 : 50;

  return (
    <Container
      fluid
      px={isMobile ? 'xs' : 'md'}
      py="md"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <Paper
        ref={cardRef}
        shadow="xl"
        radius="xl"
        withBorder
        p={cardPadding}
        style={{
          width: '100%',
          maxWidth: cardMaxWidth,
          aspectRatio: '9/16',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          margin: '0 auto',
        }}
      >
        <Stack gap={isMobile ? 'sm' : isTablet ? 'md' : 'xl'} align="center" style={{ flex: 1 }}>
          <Stack gap="xs" align="center">
            <Image 
              radius="md" 
              height={logoHeight} 
              width="auto" 
              fit="contain" 
              src="images/IC2025.png" 
            />
            <Title order={1} ta="center" c="blue" size={titleSize}>
              Activity Bingo
            </Title>
          </Stack>

          {isWinner && (
            <Paper
              p="sm"
              bg="yellow.1"
              radius="md"
              shadow="xl"
              style={{ 
                border: '2px solid var(--mantine-color-yellow-6)',
                width: '100%',
              }}
            >
              <Text size={isMobile ? 'xs' : isTablet ? 'sm' : 'lg'} fw={700} ta="center" c="yellow.8">
                🎉 Congratulations! You completed all activities! 🎉
              </Text>
            </Paper>
          )}

          <Grid 
            gutter={gridGutter} 
            style={{ 
              width: '100%',
              flex: 1,
              margin: 0,
            }}
          >
            {activities.map((activity, index) => (
              <Grid.Col span={4} key={index} style={{ padding: gridGutter / 2 }}>
                <Paper
                  p={squarePadding}
                  shadow="sm"
                  radius="lg"
                  style={{
                    cursor: 'pointer',
                    height: '100%',
                    minHeight: isMobile ? '70px' : isTablet ? '80px' : '100px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backgroundColor: clickedSquares[index]
                      ? 'var(--mantine-color-green-1)'
                      : 'var(--mantine-color-gray-0)',
                    border: clickedSquares[index]
                      ? '2px solid var(--mantine-color-green-3)'
                      : '2px solid var(--mantine-color-gray-3)',
                    transition: 'all 0.2s ease',
                    aspectRatio: '1/1',
                  }}
                  onClick={() => toggleSquare(index)}
                >
                  <Stack gap={2} align="center" justify="center" style={{ height: '100%' }}>
                    <Text
                      size={activityTextSize}
                      ta="center"
                      fw={clickedSquares[index] ? 600 : 400}
                      c={clickedSquares[index] ? 'green.8' : 'dark.7'}
                      style={{
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: isMobile ? 3 : isTablet ? 3 : 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: isMobile ? 1.1 : isTablet ? 1.15 : 1.2,
                        fontSize: isMobile ? '10px' : isTablet ? '11px' : '14px',
                        hyphens: 'auto',
                        wordBreak: 'break-word',
                      }}
                    >
                      {activity}
                    </Text>
                    {clickedSquares[index] && (
                      <CheckIcon
                        size={checkIconSize}
                        color="var(--mantine-color-green-6)"
                        style={{ marginTop: '2px', flexShrink: 0 }}
                      />
                    )}
                  </Stack>
                </Paper>
              </Grid.Col>
            ))}
          </Grid>
        </Stack>
      </Paper>
      
      <Stack mt="md" style={{ width: '100%', maxWidth: cardMaxWidth }}>
        <Text size={isMobile ? 'xs' : isTablet ? 'sm' : 'sm'} c="dimmed" ta="center">
          Click to mark activities as completed
          <br />
          {isWinner
            ? "You've completed all activities!"
            : 'Complete all activities to finish the challenge!'}
        </Text>
        <Button
          onClick={exportAsPng}
          loading={isExporting}
          variant="filled"
          data-html2canvas-ignore
          fullWidth
          size={isMobile ? 'sm' : isTablet ? 'md' : 'md'}
        >
          Export for Instagram
        </Button>
      </Stack>
    </Container>
  );
}
