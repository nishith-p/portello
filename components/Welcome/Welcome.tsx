import { Button, Text, Title } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome() {
  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        Welcome to{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'pink', to: 'yellow' }}>
          Portello
        </Text>
      </Title>
      <Text c="white" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        Get ready for the best International Congress ever happened!!! International Congress 2025
        is around the corner
      </Text>
      <div className={classes.controls}>
        <Button
          className={classes.registrationButton}
          variant="white"
          size="lg"
          component="a"
          href="/delegateForm"
        >
          Register for IC 2025
        </Button>
      </div>
    </>
  );
}
