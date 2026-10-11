export const exportLogsToCsv = (logs, farmName = 'JalaMitra-Farm') => {
  if (!logs || logs.length === 0) {
    alert('No activity logs available to export.');
    return;
  }

  const headers = ['Timestamp', 'Severity', 'Event Type', 'Zone/Sensor', 'Details'];
  const rows = logs.map((log) => [
    `"${log.timestamp || ''}"`,
    `"${log.severity || ''}"`,
    `"${(log.type || '').replace(/"/g, '""')}"`,
    `"${(log.zone || '').replace(/"/g, '""')}"`,
    `"${(log.details || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `${farmName}-Activity-Log-${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
