# Documentation für DataTables

## Einzubindene Libraries
```
https://cdn.datatables.net/1.11.3/css/jquery.dataTables.min.css
https://code.jquery.com/jquery-3.5.1.js
https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css 
https://cdn.datatables.net/2.0.2/css/dataTables.dataTables.min.css
https://cdn.datatables.net/2.0.2/js/dataTables.min.js
```
Unter [DataTable Downloads](https://datatables.net/download/) auch direkt konfigurierbar. Zum einfachen einfügen in das HTML-Dokument

## Initialisierung eines DataTables
```JavaScript
const table = $('#html-table-id').DataTable({
    serverSide: true,
        options...
})
```
## Häufig verwendete Options
| Option: DataType | Funktion |
|---|---|
| serverSide: Bool | Schaltet das dynamische Anfragen von Datensetzen ein bzw. aus
| searching: Bool | Anzeigen der Suchleiste  |
| paging: Bool | Zeigt Dropdown für Anzahl der zuanzeigenden Rows und Buttons zum Seitenwechsel |
| processing: Bool | Lade-Symbol für das warten auf GET-Requests |
| aaSorting: Array | Möglichkeit für Multi-Column Default Sortierung |
| scrollY / scrollX: Int | setzt Scrolling direkt auf *True* und setzt Scroll-Window Größe |
| ajax: Object | Setzt Parameter für ajax Calls um Datensätze zu erhalten |
| columns: Array | Legt die Angezeigten Columns fest. Der *data* Parameter gibt internen Namen an und der *name* Parameter die angezeigten Namen |
[Alle Options](https://www.datatables.net/reference/option/)
## AJAX Option
```JavaScript
ajax: {
        url: "localhost:8080/api/data", // Route
        dataSrc: "aaData" // Array Name
      },
```
### JSON Response
```JSON
{
    "draw": "1",
    "iTotalRecords": 1000,
    "iTotalDisplayRecords": 1000,
    "aaData": [
        {
            "name": "Abbye Frake",
            "position": "Social Media",
        },...
```
## SQL-Query Request
Query ist in den URL-Parametern:
`http://localhost:8080/api/data?draw=1&columns%5B0%5D%5...`
### Decoded Query
```
draw: 1
columns[0][data]: name
columns[0][name]: Name
columns[0][searchable]: true
columns[0][orderable]: true
columns[0][search][value]: 
columns[0][search][regex]: false
...
```
## Server Aufbau
### Genutzte Packages
- Express 
- Path
- mySQL
### Initialisierung des Express-Servers
```JavaScript

const db = require("./database") // Einbindung des Scripts zur Database anbindung

const app = express();
const port = 8080;

app.use(express.static(path.join(__dirname, 'client-dir'))) //Setzt als Standard Route das Client directory
app.use(express.urlencoded({ extended: false })); // Middleware für POST-Requests

...

app.listen(port)
```
## API Routes
```JavaScript
app.get('/api/data', function(req, res) {

    // Auslesen der in der Query vorhandenen Parameter
    var draw = req.query.draw; 
    var start = req.query.start;
    var length = req.query.length;
    ...

    // Zusammensetzten der Search Query
    var search_query = `
        AND (name LIKE '%${search_value}%' 
        OR position LIKE '%${search_value}%')`
    
    var query = `
        SELECT * FROM users 
        WHERE 1 ${search_query} 
        ORDER BY ${column_name} ${column_sort_order} 
        LIMIT ${start}, ${length}`;

    db.query(`SELECT COUNT(*) AS Total FROM users WHERE 1 ${search_query}`, function(error, data){

        ...
        // Speichern von allen Rows, die auf die Query zutreffen
        res.json(data);
    })

```
