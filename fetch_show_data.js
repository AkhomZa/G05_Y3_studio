document.addEventListener('DOMContentLoaded', () => {
  fetch('E_used/device01.csv') //bring data from data.csv
      .then(response => response.text()) //get data to text
      .then(data => {
          const rows = data.split('\n'); //space rows
          const table = document.getElementById('data-table').getElementsByTagName('tbody')[0];

          rows.forEach(row => { // loop in every row
              const cols = row.split(','); //every col split by ","
              const newRow = table.insertRow(); //create new row

              cols.forEach(col => { //loop in every col
                  const newCell = newRow.insertCell();
                  newCell.textContent = col; //get data to col
              });
          });
          const rowsToRemove = 3; //remove ... row first
          for (let i = 0; i < rowsToRemove; i++) {
              if (table.rows.length > 0) {
                  table.deleteRow(0);  // remove first row
              }
          }
      });
});

// loop shows
// | ->
// | ->
// | ->
// | ->
// | ->
// | ->
// V ->
