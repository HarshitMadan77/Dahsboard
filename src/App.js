import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import './App.css';
import { dashboardData } from './data/dashboardData';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem } from '@mui/material';

function App() {
  const [widgets, setWidgets] = useState(dashboardData.categories[0].widgets);
  const [searchTerm, setSearchTerm] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [newWidgetTitle, setNewWidgetTitle] = useState('');
  const [newWidgetType, setNewWidgetType] = useState('lineChart');
  const [newWidgetData, setNewWidgetData] = useState([]);

  const addWidget = () => {
    const newWidget = {
      id: widgets.length + 1,
      type: newWidgetType,
      name: newWidgetTitle,
      data: newWidgetData,
    };

    if (newWidget.data.length > 0) {
      setWidgets([...widgets, newWidget]);
      setShowForm(false);
    } else {
      alert('Please add data points before adding the widget.');
    }
  };

  const removeWidget = (id) => {
    const updatedWidgets = widgets.filter((widget) => widget.id !== id);
    setWidgets(updatedWidgets);
  };

  const filteredWidgets = widgets.filter((widget) =>
    widget.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDataChange = (index, field, value) => {
    const updatedData = [...newWidgetData];
    if (!updatedData[index]) {
      updatedData[index] = {};
    }
    updatedData[index][field] = value;
    setNewWidgetData(updatedData);
  };

  return (
    <div className="App">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div>
          <button onClick={() => setShowForm(true)}>Add Widget</button>
          <select>
            <option>Last 2 days</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
        </div>
      </header>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search widgets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Dialog open={showForm} onClose={() => setShowForm(false)}>
        <DialogTitle>Add New Widget</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Widget Title"
            type="text"
            fullWidth
            value={newWidgetTitle}
            onChange={(e) => setNewWidgetTitle(e.target.value)}
          />
          <Select
            fullWidth
            value={newWidgetType}
            onChange={(e) => {
              setNewWidgetType(e.target.value);
              setNewWidgetData([]);
            }}
          >
            <MenuItem value="lineChart">Line Chart</MenuItem>
            <MenuItem value="barChart">Bar Chart</MenuItem>
            <MenuItem value="pieChart">Pie Chart</MenuItem>
          </Select>

          <div className="widget-data-inputs">
            {newWidgetType === 'lineChart' &&
              newWidgetData.map((data, index) => (
                <div key={index}>
                  <TextField
                    margin="dense"
                    label="Month"
                    type="text"
                    fullWidth
                    onChange={(e) => handleDataChange(index, 'name', e.target.value)}
                  />
                  <TextField
                    margin="dense"
                    label="Sales"
                    type="number"
                    fullWidth
                    onChange={(e) => handleDataChange(index, 'sales', e.target.value)}
                  />
                </div>
              ))}

            {newWidgetType === 'barChart' &&
              newWidgetData.map((data, index) => (
                <div key={index}>
                  <TextField
                    margin="dense"
                    label="Product"
                    type="text"
                    fullWidth
                    onChange={(e) => handleDataChange(index, 'name', e.target.value)}
                  />
                  <TextField
                    margin="dense"
                    label="Revenue"
                    type="number"
                    fullWidth
                    onChange={(e) => handleDataChange(index, 'revenue', e.target.value)}
                  />
                </div>
              ))}

            {newWidgetType === 'pieChart' &&
              newWidgetData.map((data, index) => (
                <div key={index}>
                  <TextField
                    margin="dense"
                    label="Label"
                    type="text"
                    fullWidth
                    onChange={(e) => handleDataChange(index, 'name', e.target.value)}
                  />
                  <TextField
                    margin="dense"
                    label="Value"
                    type="number"
                    fullWidth
                    onChange={(e) => handleDataChange(index, 'value', e.target.value)}
                  />
                  <TextField
                    margin="dense"
                    label="Color"
                    type="color"
                    fullWidth
                    onChange={(e) => handleDataChange(index, 'color', e.target.value)}
                  />
                </div>
              ))}

            <button onClick={() => setNewWidgetData([...newWidgetData, {}])}>
              Add Data Point
            </button>
          </div>
        </DialogContent>
        <DialogActions>
          <button onClick={() => setShowForm(false)} color="primary">Cancel</button>
          <button onClick={addWidget} color="primary">Add Widget</button>
        </DialogActions>
      </Dialog>

      <div className="dashboard-grid">
        {filteredWidgets.map((widget) => (
          <div className="widget" key={widget.id}>
            <div className="widget-header">
              <h3>{widget.name}</h3>
              <button variant="outlined" color="secondary" onClick={() => removeWidget(widget.id)}>Remove</button>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              {widget.type === 'lineChart' && (
                <LineChart data={widget.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                </LineChart>
              )}
              {widget.type === 'barChart' && (
                <BarChart data={widget.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              )}
              {widget.type === 'pieChart' && (
                <PieChart>
                  <Pie
                    data={widget.data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {widget.data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
