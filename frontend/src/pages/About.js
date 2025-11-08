//About Page
// Import necessary components from React and Material-UI (MUI)
import React from 'react';
import { 
  Container,    // Centers content horizontally and adds padding
  Typography,   // For rendering text with predefined styles
  Box,          // A generic container component, often used for layout (like CSS flex/grid)
  Card,         // A card container for content sections
  CardContent,  // Content area within a Card
  CardMedia     // For displaying media (like images) within a Card
} from '@mui/material';

// Define an array of team member objects. Each object holds data for one member.
const teamMembers = [
  {
    name: 'Amogh Khanna (AK)',
    role: '104808826',
    desc: 'My name is Amogh Khanna, and I am currently pursuing a Bachelor of Computer Science with a major in Data Science at Swinburne University of Technology. I have experience in coding and training predictive model using python. I excel at data analysis and data management. I am in my second year of university and am passionate about data and data science.',
    image: '/AK.jpg'
  },
  {
    name: 'Nathan Hocking',
    role: '103598980',
    desc: 'My name is Nathan Hocking and I’m a student at Swinburne studying a Bachelor of Computer Science and majoring in Cybersecurity. My experience includes coding in C#, python, SQL, Ruby and more and I have achieved a certificate for Cloud Computing for AWS. I am currently in my final year of study, hoping to get high grades for this innovation project.',
    image: '/Nathan.jpg'
  },
  {
    name: 'Jia Yi Beh (Zoe)',
    role: '102779454',
    desc: 'My name is Jia Yi Beh, but you can call me Zoe. I am currently studying a Bachelor of Computer Science with a major in Artificial Intelligence at Swinburne University of Technology. I have hands-on experience building websites, developing AI models, analyzing data, and configuring secure cloud environments on AWS. My projects range from creating a location booking management system and a job posting website to implementing AI solutions like a classification model using Support Vector Machine (SVM) for data prediction.',
    image: '/Zoe.jpg'
  },
];
// Define the About component
export default function About() {
  return (
    // Container component sets max-width and centers content.
    // sx prop adds custom styling: mt = margin-top, mb = margin-bottom (8 units = 64px by default)
    <Container sx={{ mt: 8, mb: 8 }}>
      {/* Title for the page */}
      <Typography variant="h4" gutterBottom>🛠️ About Us</Typography>
      {/* Box component used as a flex container for the cards */}
      <Box 
        sx={{ 
          mt: 3, // Margin-top of 3 units
          display: 'flex',// Use flexbox for layout
          flexWrap: 'wrap',// Allow items to wrap to the next line on smaller screens
          justifyContent: 'center',// Center items horizontally
          gap: 4// Add spacing (4 units = 32px) between the items
        }}
      >
        {/* Loop through the teamMembers array and render a card for each member */}
        {teamMembers.map((member) => (
          // Box component acting as a responsive wrapper for each Card
          <Box 
            key={member.name}// Unique key for React's list rendering
            sx={{
              // Responsive width:
              // On extra-small (xs) screens (mobile), set width to 100%
              width: { xs: '100%', sm: 'calc(33.333% - 32px)' }, // 32px = spacing * 8 / 1.5 (approx)
              maxWidth: { sm: '400px' }, //prevent cards from getting too wide
              flexGrow: 1,// Allow item to grow to fill available space
              flexShrink: 1,// Allow item to shrink
              flexBasis: { xs: '100%', sm: '300px' }, // Base size before growing/shrinking. 100% on mobile, 300px on larger screens.
            }}
          >
            {/* The Card component itself */}
            {/* These sx props make the cards equal height */}
            <Card sx={{ 
              backgroundColor: 'background.paper', // Use theme's paper color
              height: '100%', // Make the card fill the height of its wrapper Box
              display: 'flex', // Use flexbox for the card's internal layout
              flexDirection: 'column' // Stack card content vertically
            }}>
               {/* CardMedia displays the member's image */}
              <CardMedia
                component="img" // Render as an <img> tag
                height="240" // Fixed height for the image
                image={member.image} // Image source
                alt={member.name} // Alt text for accessibility
                sx={{ objectFit: 'cover' }} // Ensure the image covers the area, cropping if necessary
              />
              
              {/* CardContent holds the text details */}
              {/* This sx prop is key for equal height: it makes this content area grow
                  to fill any remaining vertical space in the Card. */}
              <CardContent sx={{ flexGrow: 1 }}> 
                {/* Member's name */}
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                  {member.name}
                </Typography>
                {/* Member's ID */}
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {member.role}
                </Typography>
                {/* Member's description */}
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