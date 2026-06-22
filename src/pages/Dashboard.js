import React from 'react';
import { Box, Card, CardContent, Grid, Typography, Avatar } from '@mui/material';
import { useQuery } from 'react-query';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import MedicationIcon from '@mui/icons-material/Medication';
import InventoryIcon from '@mui/icons-material/Inventory';
import FactoryIcon from '@mui/icons-material/Factory';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ScienceIcon from '@mui/icons-material/Science';
import api from '../services/api';

const mockChartData = [
  { month: 'Jan', batches: 45, passed: 42 }, { month: 'Feb', batches: 52, passed: 50 },
  { month: 'Mar', batches: 49, passed: 46 }, { month: 'Apr', batches: 63, passed: 60 },
  { month: 'May', batches: 58, passed: 55 }, { month: 'Jun', batches: 71, passed: 68 },
];

const qcData = [
  { name: 'Passed', value: 321, color: '#4CAF50' },
  { name: 'Failed', value: 17, color: '#f44336' },
  { name: 'Pending', value: 24, color: '#FF9800' },
];

const distributionData = [
  { region: 'North', shipments: 120 }, { region: 'South', shipments: 95 },
  { region: 'East', shipments: 85 }, { region: 'West', shipments: 110 },
  { region: 'Central', shipments: 75 },
];

function StatCard({ title, value, color, subtitle, icon, bgColor }) {
  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Avatar sx={{ bgcolor: bgColor || 'primary.light', width: 52, height: 52 }}>
          {icon}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>{title}</Typography>
          <Typography variant="h4" color={color || 'primary'} fontWeight={700}>{value}</Typography>
          {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
        </Box>
      </CardContent>
      <Box sx={{
        position: 'absolute', top: -20, right: -20, opacity: 0.06,
        '& .MuiSvgIcon-root': { fontSize: 120 }
      }}>
        {icon}
      </Box>
    </Card>
  );
}

export default function Dashboard() {
  const { data: drugs, isLoading: drugsLoading } = useQuery('drugs', () => api.get('/drugs').then(r => r.data), { retry: false });
  const { data: inventory } = useQuery('inventory', () => api.get('/inventory').then(r => r.data), { retry: false });
  const { data: batches } = useQuery('batches', () => api.get('/manufacturing').then(r => r.data), { retry: false });
  const { data: suppliers } = useQuery('suppliers', () => api.get('/suppliers').then(r => r.data), { retry: false });

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>Dashboard</Typography>
        <Box sx={{
          display: 'inline-flex', alignItems: 'center', gap: 0.5,
          bgcolor: 'success.light', color: 'success.dark', px: 1.5, py: 0.5, borderRadius: 2, fontSize: '0.75rem'
        }}>
          <TrendingUpIcon sx={{ fontSize: 16 }} /> All systems operational
        </Box>
      </Box>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Drugs" value={drugsLoading ? '...' : (drugs?.length || 0)}
            subtitle="In catalog" icon={<MedicationIcon />} bgColor="#e3f2fd" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Inventory Items" value={inventory?.length || 0} color="success.main"
            subtitle="Active items" icon={<InventoryIcon sx={{ color: '#4CAF50' }} />} bgColor="#e8f5e9" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Batches" value={batches?.length || 0} color="warning.main"
            subtitle="In production" icon={<FactoryIcon sx={{ color: '#FF9800' }} />} bgColor="#fff3e0" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Suppliers" value={suppliers?.length || 0} color="info.main"
            subtitle="Registered" icon={<PeopleIcon sx={{ color: '#2196F3' }} />} bgColor="#e3f2fd" />
        </Grid>
      </Grid>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <FactoryIcon color="primary" />
                <Typography variant="h6">Monthly Production Batches</Typography>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="batches" stroke="#1B447A" strokeWidth={2} name="Total Batches" />
                  <Line type="monotone" dataKey="passed" stroke="#4CAF50" strokeWidth={2} strokeDasharray="5 5" name="QC Passed" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ScienceIcon color="primary" />
                <Typography variant="h6">Quality Control</Typography>
              </Box>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={qcData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {qcData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
                {qcData.map(item => (
                  <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
                    <Typography variant="caption">{item.name} ({item.value})</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocalShippingIcon color="primary" />
                <Typography variant="h6">Distribution by Region</Typography>
              </Box>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={distributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="shipments" fill="#1B447A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <VerifiedIcon color="primary" />
                <Typography variant="h6">Recent Activity</Typography>
              </Box>
              {[
                { text: 'Batch #B-2026-071 passed QC inspection', time: '2 hours ago', color: '#4CAF50' },
                { text: 'New drug "Amoxicillin 500mg" added to catalog', time: '4 hours ago', color: '#2196F3' },
                { text: 'Supplier "PharmaChem Ltd" updated contract', time: '6 hours ago', color: '#FF9800' },
                { text: 'Inventory alert: Paracetamol below threshold', time: '8 hours ago', color: '#f44336' },
                { text: 'Batch #B-2026-070 started production', time: '12 hours ago', color: '#9C27B0' },
              ].map((item, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1.5, borderBottom: i < 4 ? '1px solid' : 'none', borderColor: 'divider' }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color, mt: 0.8, flexShrink: 0 }} />
                  <Box>
                    <Typography variant="body2">{item.text}</Typography>
                    <Typography variant="caption" color="text.secondary">{item.time}</Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
