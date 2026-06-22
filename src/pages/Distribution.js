import React from 'react';
import { Box, Button, Card, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useQuery } from 'react-query';
import api from '../services/api';

export default function Distribution() {
  const { data, isLoading, error } = useQuery('distribution', () => api.get('/distribution').then(r => r.data), { retry: false });

  if (isLoading) return <Box sx={{ display:'flex', justifyContent:'center', mt:4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="warning" sx={{mt:2}}>Could not load data. Service may be starting up.</Alert>;

  return (
    <Box>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:3 }}>
        <Typography variant="h4" fontWeight={700}>Distribution</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>Add New</Button>
      </Box>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor:'primary.main' }}>
                <TableCell sx={{ color:'white', fontWeight:700 }}>ID</TableCell>
                <TableCell sx={{color:"white",fontWeight:700}}>Shipmentnumber</TableCell><TableCell sx={{color:"white",fontWeight:700}}>Destination</TableCell><TableCell sx={{color:"white",fontWeight:700}}>Carrier</TableCell><TableCell sx={{color:"white",fontWeight:700}}>Dispatchdate</TableCell><TableCell sx={{color:"white",fontWeight:700}}>Estimatedarrival</TableCell>
                <TableCell sx={{ color:'white', fontWeight:700 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(data || []).map(row => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.shipmentNumber || "-"}</TableCell><TableCell>{row.destination || "-"}</TableCell><TableCell>{row.carrier || "-"}</TableCell><TableCell>{row.dispatchDate || "-"}</TableCell><TableCell>{row.estimatedArrival || "-"}</TableCell>
                  <TableCell>
                    <Box component="span" sx={{ px:1, py:0.5, borderRadius:1, fontSize:12, fontWeight:700,
                      bgcolor: row.status === 'ACTIVE' ? 'success.light' : 'warning.light',
                      color: row.status === 'ACTIVE' ? 'success.dark' : 'warning.dark' }}>
                      {row.status || 'ACTIVE'}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {(!data || data.length === 0) && (
          <Box sx={{p:4, textAlign:'center'}}><Typography color="text.secondary">No records found.</Typography></Box>
        )}
      </Card>
    </Box>
  );
}
