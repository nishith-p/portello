'use client'

import { useState } from 'react';
import { Button, Group, Paper } from '@mantine/core';
import classes from './BookletViewer.module.css';

interface BookletViewerProps {
  pages: string[]; // Array of URLs for the booklet pages (images or PDFs)
}

const BookletViewer: React.FC<BookletViewerProps> = ({ pages }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={classes.viewerContainer}>
      <Paper className={classes.page} shadow="md" radius="md">
        <img src={pages[currentPage]} alt={`Page ${currentPage + 1}`} className={classes.pageImage} />
      </Paper>
      <Group gap="xl" mt="md" className={classes.controls}>
        <Button onClick={previousPage} disabled={currentPage === 0}>
          Previous
        </Button>
        <span>
          Page {currentPage + 1} of {pages.length}
        </span>
        <Button onClick={nextPage} disabled={currentPage === pages.length - 1}>
          Next
        </Button>
      </Group>
    </div>
  );
};

export default BookletViewer;
