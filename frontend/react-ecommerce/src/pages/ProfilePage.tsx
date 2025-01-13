import React from 'react';
import { 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button 
} from '@mui/material';
import useAuthStore from '../stores/authStore';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();

  if (!user) {
    return <Typography>Loading profile...</Typography>;
  }

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              User Profile
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  <strong>Email:</strong> {user.email}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  <strong>Account Type:</strong> 
                  {user.isAdmin ? ' Admin' : ' Regular User'}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  fullWidth
                  onClick={logout}
                >
                  Logout
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ProfilePage;
