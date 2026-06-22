import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, TextField, Typography, Alert, CircularProgress, Grid } from '@mui/material';
import MedicationIcon from '@mui/icons-material/Medication';
import ScienceIcon from '@mui/icons-material/Science';
import BiotechIcon from '@mui/icons-material/Biotech';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { useAuth } from '../context/AuthContext';

const MoleculeIllustration = () => (
  <svg viewBox="0 0 400 400" style={{ width: '100%', maxWidth: 360, opacity: 0.15 }}>
    <circle cx="200" cy="120" r="30" fill="#1B447A" />
    <circle cx="120" cy="220" r="25" fill="#2196F3" />
    <circle cx="280" cy="220" r="25" fill="#2196F3" />
    <circle cx="160" cy="320" r="20" fill="#4CAF50" />
    <circle cx="240" cy="320" r="20" fill="#4CAF50" />
    <circle cx="320" cy="140" r="18" fill="#FF9800" />
    <circle cx="80" cy="140" r="18" fill="#FF9800" />
    <line x1="200" y1="150" x2="120" y2="195" stroke="#1B447A" strokeWidth="3" />
    <line x1="200" y1="150" x2="280" y2="195" stroke="#1B447A" strokeWidth="3" />
    <line x1="120" y1="245" x2="160" y2="300" stroke="#2196F3" strokeWidth="3" />
    <line x1="280" y1="245" x2="240" y2="300" stroke="#2196F3" strokeWidth="3" />
    <line x1="200" y1="90" x2="320" y2="140" stroke="#FF9800" strokeWidth="2" />
    <line x1="200" y1="90" x2="80" y2="140" stroke="#FF9800" strokeWidth="2" />
    <line x1="160" y1="320" x2="240" y2="320" stroke="#4CAF50" strokeWidth="3" />
  </svg>
);

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a1929 0%, #1B447A 50%, #0d47a1 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Box sx={{ position: 'absolute', top: -50, right: -50, opacity: 0.06 }}>
        <ScienceIcon sx={{ fontSize: 400, color: 'white' }} />
      </Box>
      <Box sx={{ position: 'absolute', bottom: -30, left: -30, opacity: 0.06 }}>
        <BiotechIcon sx={{ fontSize: 300, color: 'white' }} />
      </Box>

      <Grid container sx={{ maxWidth: 900, mx: 'auto', px: 2 }} alignItems="center" spacing={4}>
        <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'center' }}>
          <MoleculeIllustration />
          <Typography variant="h6" color="white" fontWeight={600} textAlign="center" mt={2}>
            Pharmaceutical Excellence
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.7)" textAlign="center" mt={1}>
            Quality-driven manufacturing management
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, mt: 3, opacity: 0.8 }}>
            <Box sx={{ textAlign: 'center' }}>
              <HealthAndSafetyIcon sx={{ color: '#4CAF50', fontSize: 32 }} />
              <Typography variant="caption" color="white" display="block">GMP</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <ScienceIcon sx={{ color: '#2196F3', fontSize: 32 }} />
              <Typography variant="caption" color="white" display="block">QC</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <BiotechIcon sx={{ color: '#FF9800', fontSize: 32 }} />
              <Typography variant="caption" color="white" display="block">R&D</Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card sx={{ boxShadow: '0 8px 40px rgba(0,0,0,0.3)', borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                <MedicationIcon color="primary" sx={{ fontSize: 36 }} />
                <Typography variant="h5" color="primary" fontWeight={700}>ZenPharma</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Medicine Manufacturing Management System
              </Typography>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              <form onSubmit={handleSubmit}>
                <TextField fullWidth label="Username" value={username} onChange={e => setUsername(e.target.value)}
                  margin="normal" required autoFocus />
                <TextField fullWidth label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)}
                  margin="normal" required />
                <Button type="submit" fullWidth variant="contained" size="large"
                  sx={{ mt: 3, py: 1.5, borderRadius: 2, textTransform: 'none', fontSize: '1rem' }}
                  disabled={loading}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                </Button>
              </form>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Default: admin / changeme
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
