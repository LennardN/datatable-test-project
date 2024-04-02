$(document).ready(function() {
    let blockEditing = false
    let tmpElement = null
    let editedText = ""

    var table = $('#user_table').DataTable({
        paging: true,
        serverSide: true,
        searching: true,
        processing: true, //lade-symbol beim warten auf get request
        scrollY: 700,
        ajax: {
            url: "/api/data",
            dataSrc: "aaData"
        },
        aaSorting: [],
        columns: [
            { data: 'name', name: 'Name'},
            { data: 'position', name: 'Position'},
            { data: 'office', name: 'Office'},
            { data: 'extn', name: 'Extn' },
            { data: 'start_date', name: 'Start Date'},
            { data: 'salary', name: 'Salary' }
        ]
    });
    $('#user_table').on("click", "td:not(:has(*))", function (e) {
        if(blockEditing == false){
            tmpElement = this
            let tmpText = this.innerText
            $(this).replaceWith(`<td><input class="dyn-input" type="text" value="${tmpText}"></input></td>`)
            $(".dyn-input").focus()
            $(".dyn-input").select()
            blockEditing = true
        }
    })


    $('main').on('keypress', function(e) {
        if(e.keyCode == 13 && $('.dyn-input').val() != '' &&  tmpElement != null){
            editedText = $('.dyn-input').val()
            submitChange(editedText, tmpElement)
            $('.dyn-input').parent().replaceWith(tmpElement)
            $(tmpElement).text(editedText)
            blockEditing = false
        }else if(e.keyCode == 13){
            $('.dyn-input').parent().replaceWith(tmpElement)
            blockEditing = false
        }
    })

    $("#user_table").on("focusout", function(){
        if($('.dyn-input').length && $('.dyn-input').parent().length && blockEditing){
            //$("main").trigger("keypress")
            //console.log("trigger keypress")
            //blockEditing = false
        }
    })


    function submitChange(newText, oldElement){
        let rowIndex = table.cell(oldElement).index().row
        let colIndex = table.cell(oldElement).index().column
        let colName = table.column(colIndex).dataSrc()
        let data = table.cell(oldElement).rows().data()[rowIndex]
        data.changedText = newText
        data.changedCol = colName

        $.ajax({
            type: "POST",
            url: "/api/change",
            dataType: "JSON",
            success: function (msg) {
                console.log(msg)
            },
            data: data
        })
        
    }
})

