function capitalizeWords(str) {
  return str
    .toLowerCase() 
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function groupSeatsByRow(seats) {
  const rows = {};
  seats.forEach((s) => {
    const match = s.seatNumber.match(/^(\d+)([A-Z])$/);
    if (!match) return;
    const row = match[1];
    rows[row] = rows[row] || [];
    rows[row].push(s);
  });
  
  // ordina lettere
  Object.keys(rows).forEach((r) => {
    rows[r].sort((a, b) => a.seatNumber.localeCompare(b.seatNumber));
  });
  
  return rows;
}

function seatStatusToColor(status) {
  switch (status) {
    case 'purple':
      return 'Occupied by you in this reservation'; // purple
    case 'orange':
      return 'Occupied by you in another reservation'; // orange
    case 'red' || 'blue':
      return 'Occupied by others'; // red
    case 'green':
      return 'Available seat'; // green
    case 'yellow':
      return 'Selected seat'; // yellow
    default:
      return 'Status unknown'; // default gray
  }
}
export { capitalizeWords, groupSeatsByRow, seatStatusToColor };