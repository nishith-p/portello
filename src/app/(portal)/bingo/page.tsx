'use client';

import { Center, CheckIcon, Container, Grid, Paper, Stack, Text, Title } from '@mantine/core';
import { useActivities } from '@/lib/bingo/hooks';

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

  const checkWin = () => {
    return clickedSquares.every(square => square);
  };

  const isWinner = checkWin();
  const completedCount = clickedSquares.filter(Boolean).length;

  return (
    <Container size="sm" py="md">
      <Paper shadow="xl" radius="xl" withBorder p="xl">
        <Stack gap="xl" align="center">
          <Stack gap="xs">
            <Title order={1} ta="center" c="blue">
              Activity Bingo
            </Title>
            <Title order={3} ta="center" c="blue.4">
              IC 2025 Version
            </Title>
          </Stack>

          {isWinner && (
            <Paper p="md" bg="green.1" radius="md" shadow='xl' style={{ border: '2px solid var(--mantine-color-green-6)' }}>
              <Text size="lg" fw={700} ta="center" c="green.8">
                🎉 Congratulations! You completed all activities! 🎉
              </Text>
            </Paper>
          )}

          <Grid gutter="md" style={{ maxWidth: '500px' }}>
            {activities.map((activity, index) => (
              <Grid.Col span={4} key={index}>
                <Paper
                  p="md"
                  shadow="sm"
                  radius="lg"
                  style={{
                    cursor: 'pointer',
                    minHeight: '120px',
                    backgroundColor: clickedSquares[index]
                      ? 'var(--mantine-color-green-1)'
                      : 'var(--mantine-color-gray-0)',
                    border: clickedSquares[index]
                      ? '2px solid var(--mantine-color-green-3)'
                      : '2px solid var(--mantine-color-gray-3)',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}
                  onClick={() => toggleSquare(index)}
                >
                  <Center style={{ height: '100%' }}>
                    <Stack gap="xs" align="center">
                      <Text
                        size="sm"
                        ta="center"
                        fw={clickedSquares[index] ? 600 : 400}
                        c={clickedSquares[index] ? 'green.8' : 'dark.7'}
                      >
                        {activity}
                      </Text>
                      {clickedSquares[index] && (
                        <CheckIcon
                          size={24}
                          color="var(--mantine-color-green-6)"
                          style={{ marginTop: '4px' }}
                        />
                      )}
                    </Stack>
                  </Center>
                </Paper>
              </Grid.Col>
            ))}
          </Grid>

          <Text size="sm" c="dimmed" ta="center">
            Click to mark activities as completed
            <br />
            {isWinner ? (
              "You've completed all activities!"
            ) : (
              "Complete all activities to finish the challenge!"
            )}
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
}
