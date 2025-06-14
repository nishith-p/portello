'use client';

import { Card, CloseButton, Image, Modal } from '@mantine/core';
import classes from './product-modal.module.css';
import { useMediaQuery } from '@mantine/hooks';

interface SizeModalProps {
  opened: boolean;
  onClose: () => void;
}

export function SizeModal({ opened, onClose }: SizeModalProps) {
  const isMobile = useMediaQuery('(max-width: 48em)'); // 768px
  const isTablet = useMediaQuery('(min-width: 48.0625em) and (max-width: 64em)'); // 768px-1024px

  // Determine modal size based on screen width
  const modalSize = isMobile ? '100%' : isTablet ? '85%' : 'xl';

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size={modalSize}
      withCloseButton={false}
      overlayProps={{
        opacity: 0.55,
        blur: 3,
      }}
      classNames={{
        content: classes.sizeModal,
      }}
      padding={isMobile ? 'xs' : 'md'} // Adjust padding based on screen size
    >
      <CloseButton 
        onClick={onClose} 
        className={classes.closeButton} 
        size={isMobile ? 'md' : 'lg'} // Adjust close button size
      />
      <Card pos="relative" p={isMobile ? 'sm' : 'md'}>
        <Image src="/images/sizeChart.jpg" alt="Size Chart" fit="contain" radius="md" />
      </Card>
    </Modal>
  );
}
