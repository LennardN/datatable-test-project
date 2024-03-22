# Documentation für ServerSide DataTables

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
[Alle Options](https://www.datatables.net/reference/option/)
| Option: DataType | Funktion |
|---|---|
| serverSide: Bool | Schaltet das dynamische Anfragen von Datensetzen ein bzw. aus
| searching: Bool | Anzeigen der Suchleiste  |
| paging: Bool | Zeigt Dropdown für Anzahl der zuanzeigenden Rows und Buttons zum Seitenwechsel |
| processing: Bool | Lade-Symbol für das warten auf GET-Requests |
| aaSorting: Array | Möglichkeit für Multi-Column Standard Sortierung |
| scrollY / scrollX: Int | setzt Scrolling direkt auf *True* und setzt Scroll-Window Größe |
| ajax: Object | Setzt Parameter für ajax Calls um Datensätze zu erhalten |
| columns: Array | Legt die Angezeigten Columns fest. Der *data* Parameter gibt internen Namen an und der *name* Parameter die angezeigten Namen |
## Ajax Option
```JavaScript
ajax: {
        url: "localhost:8080/api/data", //Route
        dataSrc: "aaData" //Array Name
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