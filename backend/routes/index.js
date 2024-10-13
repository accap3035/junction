import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function IndexPage() {
    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h4">
                    Welcome to Our Hackathon Project!
                </Typography>
            </Box>
        </Container>
    );
}

export default IndexPage;
