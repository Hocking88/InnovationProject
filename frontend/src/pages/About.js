import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia 
} from '@mui/material';

const teamMembers = [
  {
    name: 'AK',
    role: 'Xxxxxxxxx',
    desc: 'Dtyvgtdevjijjnn_placeholder_text_bgh Asdfhkllkhvvfeeyirjbvty',
    image: '/ak.png' // Assumes ak.png is in the public/ folder
  },
  {
    name: 'Nathan',
    role: 'Xxxxxxxxx',
    desc: 'Dtyvgtdevjijjnn_placeholder_text_bgh Asdfhkllkhvvfeeyirjbvty',
    image: '/nathan.png' // Assumes nathan.png is in the public/ folder
  },
  {
    name: 'Zoe',
    role: 'Xxxxxxxxx',
    desc: 'Dtyvgtdevjijjnn_placeholder_text_bgh Asdfhkllkhvvfeeyirjbvty',
    image: '/zoe.png' // Assumes zoe.png is in the public/ folder
  },
];

export default function About() {
  return (
    <Container sx={{ mt: 8 }} maxWidth="xl">
      <Typography variant="h4" gutterBottom>🛠️ About Us</Typography>
      
      <Grid 
        container 
        spacing={10} 
        sx={{ mt: 8, justifyContent: 'center' }}
      >
        {teamMembers.map((member) => (
          <Grid item xs={12} sm={4} md={4} key={member.name}>
            
            <Card sx={{ backgroundColor: 'background.paper' }}>
              
              <CardMedia
                component="img"
                height="240"
                image={member.image}
                alt={member.name}
              />
              
              <CardContent>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                  {member.name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {member.role}
                </Typography>
                <Typography variant="body2">
                  {member.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}