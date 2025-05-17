'use client';

import { Card, CloseButton, Image, Modal } from '@mantine/core';
import classes from './product-modal.module.css';

interface SizeModalProps {
  opened: boolean;
  onClose: () => void;
}

export function SizeModal({ opened, onClose }: SizeModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="xl"
      withCloseButton={false}
      overlayProps={{
        opacity: 0.55,
        blur: 3,
      }}
      classNames={{
        content: classes.sizeModal,
      }}
    >
      <CloseButton onClick={onClose} className={classes.closeButton} size="lg" />
      <Card pos="relative">
        <Image src="/images/sizeChart.jpg" alt="Size Chart" fit="contain" radius="md" />
      </Card>
    </Modal>
  );
}
