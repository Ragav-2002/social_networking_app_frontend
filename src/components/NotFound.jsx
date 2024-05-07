import React from 'react';
import { Box, Typography } from '@mui/material';

export default function NotFound() {
  return (
    <Box sx={{flex:{xs: 40, md: 4}}} p={2} >
        <Box height='500px' display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Typography variant="h6">Please check your URL</Typography>
        </Box>
    </Box>
  );
}