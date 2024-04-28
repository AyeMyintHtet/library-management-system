import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';
import { setClearLocalStorage } from '@/app/utils';


export default function ButtonAppBar() {
  const router = useRouter();

  const Logout=()=>{
    setClearLocalStorage();
    router.push('/');
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{backgroundColor:'#65c6c6'}}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Book Shelf
          </Typography>
          
          <Button color='warning' variant="outlined" onClick={Logout}>Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
