# Documentation für Editierbare Cells mit Datnebankänderung
## Funktionalität
Austausch des Inhalts des Tabellen Elements `<td>` mit   
`<td><input class="dyn-input" type="text" value="${tmpText}"></input></td>`
Dabei ist `tmpText` der Text der zuvor im Element stand.

Mittels keypress-Listerner wird dann nach dem Drücken der Enter taste dieser Element-Tausch rückgängig gemacht und stadtdessen der Text eingetragen der im Text-Input stand.

Wenn der Listener ausgelöst wird, wird zudem ein Request an den Server geschickt der die jeweilige Cell in der Datenbank updated.

## AJAX Request
```JavaScript
$.ajax({
    type: "POST",
    url: "/api/change",
    dataType: "JSON",
    data: {
        "name": "Adeline Fronzek",
        "position": "Payment Adjustment Coordinator",
        "changedText": "test123",
        "changedCol": "name"
        }
})
```
Hier wird dem Server mittgeteilt das die `changedColumn` `name` ist und diese geändert werden soll. 

Der `changedText` bestimmt dann, welcher Text an der Stelle geupdated wird.
## SQL Update
```SQL
UPDATE testing.users SET "changedCol" = "changedText"
    WHERE 1
    AND name LIKE "req.body.name" 
    AND position LIKE "req.body.position"
```
### Rückgabe
Http-Status 200 bei erfolgereichen Updaten und 500 bei einem Fehler

