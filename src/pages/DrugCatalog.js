import { useState } from 'react';
import {
  Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle,
  MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TextField, Typography, CircularProgress, Alert, FormControl, InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useQuery, useQueryClient } from 'react-query';
import api from '../services/api';

const EMPTY_FORM = { name: '', genericName: '', category: '', dosageForm: '', strength: '', status: 'ACTIVE' };

export default function DrugCatalog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const { data, isLoading, error } = useQuery('drugs', () => api.get('/drugs').then(r => r.data), { retry: false });

  const handleOpen = () => { setForm(EMPTY_FORM); setSaveError(''); setOpen(true); };
  const handleClose = () => setOpen(false);
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!form.name) { setSaveError('Name is required.'); return; }
    setSaving(true);
    setSaveError('');
    try {
      await api.post('/drugs', form);
      queryClient.invalidateQueries('drugs');
      setOpen(false);
    } catch (e) {
      setSaveError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <Box sx={{ display:'flex', justifyContent:'center', mt:4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="warning" sx={{mt:2}}>Could not load data. Service may be starting up.</Alert>;

  return (
    <Box>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:3 }}>
        <Typography variant="h4" fontWeight={700}>Drug Catalog</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>Add New</Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor:'primary.main' }}>
                <TableCell sx={{ color:'white', fontWeight:700 }}>ID</TableCell>
                <TableCell sx={{ color:'white', fontWeight:700 }}>Name</TableCell>
                <TableCell sx={{ color:'white', fontWeight:700 }}>Generic Name</TableCell>
                <TableCell sx={{ color:'white', fontWeight:700 }}>Category</TableCell>
                <TableCell sx={{ color:'white', fontWeight:700 }}>Dosage Form</TableCell>
                <TableCell sx={{ color:'white', fontWeight:700 }}>Strength</TableCell>
                <TableCell sx={{ color:'white', fontWeight:700 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(data || []).map(row => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name || '-'}</TableCell>
                  <TableCell>{row.genericName || '-'}</TableCell>
                  <TableCell>{row.category || '-'}</TableCell>
                  <TableCell>{row.dosageForm || '-'}</TableCell>
                  <TableCell>{row.strength || '-'}</TableCell>
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
          <Box sx={{ p:4, textAlign:'center' }}><Typography color="text.secondary">No records found.</Typography></Box>
        )}
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Drug</DialogTitle>
        <DialogContent sx={{ display:'flex', flexDirection:'column', gap:2, pt:'16px !important' }}>
          {saveError && <Alert severity="error">{saveError}</Alert>}
          <TextField label="Name *" name="name" value={form.name} onChange={handleChange} fullWidth />
          <TextField label="Generic Name" name="genericName" value={form.genericName} onChange={handleChange} fullWidth />
          <TextField label="Category" name="category" value={form.category} onChange={handleChange} fullWidth />
          <TextField label="Dosage Form" name="dosageForm" value={form.dosageForm} onChange={handleChange} fullWidth />
          <TextField label="Strength" name="strength" value={form.strength} onChange={handleChange} fullWidth />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select name="status" value={form.status} label="Status" onChange={handleChange}>
              <MenuItem value="ACTIVE">ACTIVE</MenuItem>
              <MenuItem value="INACTIVE">INACTIVE</MenuItem>
              <MenuItem value="PENDING">PENDING</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px:3, pb:2 }}>
          <Button onClick={handleClose} disabled={saving}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
