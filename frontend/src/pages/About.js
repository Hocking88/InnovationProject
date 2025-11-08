import React from 'react';
import { 
  Container, 
  Typography, 
  Box,  // <-- Changed
  Card, 
  CardContent, 
  CardMedia 
} from '@mui/material';

const teamMembers = [
  {
    name: 'Amogh Khanna (AK)',
    role: '104808826',
    desc: 'My name is Amogh Khanna, and I am currently pursuing a Bachelor of Computer Science with a major in Data Science at Swinburne University of Technology. I have experience in coding and training predictive model using python. I excel at data analysis and data management. I am in my second year of university and am passionate about data and data science.',
    image: '/AK.jpg' // Assumes AK.jpg is in the public/ folder
  },
  {
    name: 'Nathan Hocking',
    role: '103598980',
    desc: 'My name is Nathan Hocking and I’m a student at Swinburne studying a Bachelor of Computer Science and majoring in Cybersecurity. My experience includes coding in C#, python, SQL, Ruby and more and I have achieved a certificate for Cloud Computing for AWS. I am currently in my final year of study, hoping to get high grades for this innovation project.',
    image: '/Nathan.jpg' // Assumes Nathan.jpg is in the public/ folder
  },
  {
    name: 'Jia Yi Beh (Zoe)',
    role: '102779454',
    desc: 'My name is Jia Yi Beh, but you can call me Zoe. I am currently studying a Bachelor of Computer Science with a major in Artificial Intelligence at Swinburne University of Technology. I have hands-on experience building websites, developing AI models, analyzing data, and configuring secure cloud environments on AWS. My projects range from creating a location booking management system and a job posting website to implementing AI solutions like a classification model using Support Vector Machine (SVM) for data prediction.',
    image: '/Zoe.jpg' // Assumes Zoe.jpg is in the public/ folder
  },
];

export default function About() {
  return (
    <Container sx={{ mt: 8, mb: 8 }}>
      <Typography variant="h4" gutterBottom>🛠️ About Us</Typography>
      <Box 
        sx={{ 
          mt: 3, 
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 4
        }}
      >
        {teamMembers.map((member) => (
          
          /* This Box replaces the <Grid item>.
            - It handles the widths for desktop and mobile.
            - 'flexBasis' is the starting width.
            - 'flexGrow: 1' lets it grow.
          */
          <Box 
            key={member.name}
            sx={{
              // On mobile (xs), be 100% wide
              width: { xs: '100%', sm: 'calc(33.333% - 32px)' }, // 32px = spacing * 8 / 1.5 (approx)
              maxWidth: { sm: '400px' }, // Optional: prevent cards from getting too wide
              flexGrow: 1,
              flexShrink: 1,
              flexBasis: { xs: '100%', sm: '300px' }, // Base size
            }}
          >
            
            {/* These sx props make the cards equal height */}
            <Card sx={{ 
              backgroundColor: 'background.paper',
              height: '100%',
              display: 'flex',
              flexDirection: 'column' 
            }}>
              
              <CardMedia
                component="img"
                height="240"
                image={member.image}
                alt={member.name}
                sx={{ objectFit: 'cover' }}
              />
              
              {/* This sx prop makes the content grow to fill space */}
              <CardContent sx={{ flexGrow: 1 }}> 
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
          </Box>
        ))}
      </Box>
    </Container>
  );
}